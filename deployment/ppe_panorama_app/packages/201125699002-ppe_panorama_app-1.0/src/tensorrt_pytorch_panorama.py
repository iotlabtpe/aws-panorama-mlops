from ast import arg
import os
from re import T

os.environ["PYTHON_EGG_CACHE"] = "/panorama/.cache"

import boto3

s3 = boto3.resource("s3")

import panoramasdk as p
import os
import sys
import threading
import time
import numpy as np
import onnx_tensorrt
from yolov5trt import YoLov5TRT
from ppe_iot import PpeIot, cordon_area_detection
import zmq

# import multiprocessing
from multiprocessing import Process

import logging
from logging.handlers import RotatingFileHandler

log = logging.getLogger("my_logger")
log.setLevel(logging.DEBUG)
handler = RotatingFileHandler(
    "/opt/aws/panorama/logs/app.log", maxBytes=10000000, backupCount=2
)
formatter = logging.Formatter(
    fmt="%(asctime)s %(levelname)-8s %(message)s", datefmt="%Y-%m-%d %H:%M:%S"
)
handler.setFormatter(formatter)
log.addHandler(handler)


class ObjectDetectionApp(p.node):
    def __init__(self):
        self.model_batch_size = 1
        self.pre_processing_output_size = 640
        self.onnx_file_path = "/panorama/yolov5s.onnx"
        self.engine_file_path = "/opt/aws/panorama/storage/yolov5s_dynamic_148.engine"
        if not os.path.exists(self.engine_file_path):
            onnx_tensorrt.onnx2tensorrt(
                self.onnx_file_path, self.engine_file_path, dynamic_batch=[1, 4, 8]
            )

        self.yolov5_wrapper = YoLov5TRT(
            self.engine_file_path, self.model_batch_size, True
        )

        # For PPE portal, IoT event report and camera monitoring. Hard code for demonstration.
        self.bucket = "event-cd14bfe0-1231-11ed-b64e-06ca11bc4d14"
        self.device_id = "device-edathpmcmq6itrwh72dhuu6kkq"
        self.camera_id = "demo-camera-1.0-a07451ac-demo-camera"

        self.env = self.inputs.env.get()
        self.ppe_iot_handler = PpeIot(
            self.bucket, self.device_id, self.camera_id, self.env
        )

        self.cordon_area = [(0.1, 0.2, 0.3, 0.7), (0.3, 0.2, 0.5, 0.7)]
        self.maxn_event_no = 1000000000

    def listener(self):
        context = zmq.Context()
        socket = context.socket(zmq.SUB)
        socket.connect("tcp://localhost:5555")
        # Set setsockopt to receive all message
        socket.setsockopt(zmq.SUBSCRIBE, "".encode("utf-8"))

        while True:
            msg = socket.recv_pyobj()
            log.info(f"Received event and trigger detect_and_report() {msg[-1]}")
            self.ppe_iot_handler.detect_and_report(*msg[0])
            # threading.Thread(target=self.ppe_iot_handler.detect_and_report, args=(*msg, )).start()

    def publish(self, socket, args):
        log.info(f"Send event {args[-1]}")
        socket.send_pyobj(args)

    def get_frames(self):
        input_frames = self.inputs.video_in.get()
        return input_frames

    def run(self):
        Process(target=self.listener).start()

        # Init zmq publisher
        context = zmq.Context()
        socket = context.socket(zmq.PUB)
        socket.bind("tcp://*:5555")

        input_images = list()
        image_list = []  # An image queue

        event_no = 0
        while True:
            try:
                input_frames = self.get_frames()

                input_images = [frame.image for frame in input_frames]
                stream_ids = [frame.stream_id for frame in input_frames]
                image_list += input_images

                # render fps setting
                # org = (1700, 80)
                # fontFace = cv2.FONT_HERSHEY_SIMPLEX
                # fontScale = 2.0
                # color = (0, 255, 255)
                # thickness = 5
                # lineType = cv2.LINE_AA

                if len(image_list) >= self.model_batch_size:
                    # start
                    start_time = time.time()

                    prediction = self.yolov5_wrapper.infer(
                        image_list[: self.model_batch_size]
                    )
                    # A list of bboxes
                    # Each bboxes is of shape [NUM_BOX, 6]
                    # Each box in bboxes is of [x1 y1 x2 y2 score class_id]

                    # end
                    end_time = time.time()

                    fps = (self.model_batch_size) / (end_time - start_time)

                    for idx in range(len(prediction)):
                        restuls = prediction[idx]  # [:, :4]
                        if len(restuls) == 0:
                            continue
                        result_boxes = restuls[:, :4].tolist()

                        # Trigger cordon detection if there is any people been detected
                        if len(result_boxes) > 0:
                            send_args = [
                                [
                                    stream_ids[idx],
                                    result_boxes,
                                    self.cordon_area[idx],
                                    image_list[idx],
                                ],
                                event_no,
                            ]
                            self.publish(socket, send_args)
                            event_no += 1
                            if event_no >= self.maxn_event_no:
                                event_no = 0

                    for idx in range(len(input_frames)):
                        input_frames[idx].add_rect(
                            self.cordon_area[idx][0],
                            self.cordon_area[idx][1],
                            self.cordon_area[idx][2],
                            self.cordon_area[idx][3],
                        )
                        input_frames[idx].add_label(f"{fps:>5.2f}", 0.9, 0.05)
                        # cv2.putText(input_frames[idx].image, f"{fps:>5.2f}", org, fontFace, fontScale, color, thickness, lineType)

                    image_list = image_list[self.model_batch_size :]

                self.outputs.video_out.put(input_frames)

            except Exception as e:
                self.yolov5_wrapper.destroy()
                log.exception("Exception is {}".format(e))
                pass


if __name__ == "__main__":
    try:
        app = ObjectDetectionApp()
        app.run()
    except Exception as err:
        log.exception("App Did not Start {}".format(err))
        sys.exit(1)
