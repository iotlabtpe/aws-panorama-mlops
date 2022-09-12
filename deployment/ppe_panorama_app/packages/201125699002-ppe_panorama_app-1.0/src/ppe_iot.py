from re import T
import pycuda.autoinit
import torch
import torchvision
import pycuda.driver as cuda
import tensorrt as trt
import logging
import time
import cv2
import numpy as np
import copy
import random
import os
import uuid
import time
import json
import datetime
import boto3
from sympy import Polygon, Point, Line
import threading

import multiprocessing
from multiprocessing import Process

log = logging.getLogger("my_logger")


def ppe_handler(image_to_send, cor_data, env):
    iot_client = boto3.client("iot-data", region_name="ap-southeast-1")
    s3_client = boto3.resource("s3", region_name="ap-southeast-1")
    sql_command = "/ppe/random/" + env
    log.info("sql_command", sql_command)
    random_p = boto3.client("ssm", region_name="ap-southeast-1").get_parameter(Name=sql_command)
    prefix = "ppe"
    # device_id = 'cf2533b6-2541-4347-a68c-404742578e14'
    # camera_id = 'cf2533b6-2541-4347-a68c-404742578e14'
    # bucket = 'auo-ppe-v2-event-bucket-20220428'
    bucket = "event-" + random_p["Parameter"]["Value"]
    log.info("bucket", bucket)
    log.info("env", env)
    device_id = "device-edathpmcmq6itrwh72dhuu6kkq"
    camera_id = "demo-camera-1.0-a07451ac-demo-camera"

    picture_path = prefix + "/images/" + device_id + "/"
    s3_picture = "s3://" + bucket + "/" + picture_path
    label_path = prefix + "/labels/" + device_id + "/"
    s3_label = "s3://" + bucket + "/" + label_path

    event_data = {}

    event_data["key"] = str(uuid.uuid1())
    event_data["TimeStamp"] = time.time()
    event_data["bucket"] = bucket
    event_data["prefix"] = prefix
    event_data["acknowledged"] = "false"
    eventDate = datetime.datetime.now()
    file_name_prefix = eventDate.strftime("%Y%m%d%H%M%S")
    event_data["time"] = eventDate.strftime("%Y-%m-%d %H:%M:%S")
    event_data["location"] = "TPE"
    event_data["device_id"] = device_id
    event_data["CameraID"] = camera_id
    event_data["status"] = "unresolve"
    event_data["name"] = "Cordon Line Event"
    event_data["flag"] = "Cordon Line Detecting"
    event_data["type"] = "person"
    event_data["local_file_path"] = ""

    event_data["picture_filename"] = file_name_prefix + ".jpg"
    event_data["picture_path"] = picture_path + event_data["picture_filename"]
    event_data["picture"] = s3_picture + event_data["picture_filename"]

    event_data["origin_picture_filename"] = file_name_prefix + "_origin" + ".jpg"
    event_data["origin_picture_path"] = picture_path + event_data["origin_picture_filename"]
    event_data["origin_picture"] = s3_picture + event_data["origin_picture_filename"]

    event_data["label_filename"] = file_name_prefix + ".txt"
    event_data["label_path"] = label_path + event_data["label_filename"]
    event_data["label"] = s3_label + event_data["label_path"]
    event_data["label_string"] = ""

    event_data["video_filename"] = ""
    event_data["video_path"] = ""
    event_data["video"] = ""

    _person_coordinates = cor_data["person_coordinates"]
    _cordon_coordinates = cor_data["cordon_coordinates"]
    _label_coordinates = cor_data["label_coordinates"]

    event_data["label_string"] = event_data["label_string"] + _label_coordinates

    copy_to_send = copy.deepcopy(image_to_send)
    # raw image, draw cordon
    cv2.rectangle(copy_to_send, _cordon_coordinates[0], _cordon_coordinates[2], (0, 255, 255), 2)
    raw_serial = cv2.imencode(".png", copy_to_send)[1].tostring()
    s3_client.Object(bucket, event_data["origin_picture_path"]).put(Body=raw_serial, ContentType="image/PNG")

    for _person_coordinate in _person_coordinates:
        cv2.rectangle(copy_to_send, _person_coordinate[0], _person_coordinate[2], (255, 0, 0), 2)

    cv2.rectangle(copy_to_send, _cordon_coordinates[0], _cordon_coordinates[2], (0, 255, 255), 2)
    bbox_serial = cv2.imencode(".png", copy_to_send)[1].tostring()
    s3_client.Object(bucket, event_data["picture_path"]).put(Body=bbox_serial, ContentType="image/PNG")

    s3_client.Object(bucket, event_data["label_path"]).put(Body=_label_coordinates, ContentType="text/plain")

    payload = json.dumps(event_data)
    # log.info('End of uploading to S3')
    log.info(">>>>>>>>>>>>>>> Start sending signal to IOT CORE")
    # log.info('Sending: ' + payload)
    iot_client.publish(topic="ppe/event/" + env, qos=1, payload=bytes(payload, "utf-8"))
    log.info("End of Sending <<<<<<<<<<<<<")


def cordon_area_detection(payload_obj):
    _cordon_coordinates = payload_obj["cordon_coordinates"]
    _person_coordinates = payload_obj["person_coordinates"]

    # Unpack coordinates into **kwargs
    _cordon_area = Polygon(*_cordon_coordinates)

    for _person_coordinate in _person_coordinates:
        # is_enclosed = False
        _person_area = Polygon(*_person_coordinate)
        isIntersection = _cordon_area.intersection(_person_area)

        if isIntersection != []:
            return True

    return False


class PpeIot:
    def __init__(self, bucket, device_id, camera_id, env):
        self.bucket = bucket
        self.device_id = device_id
        self.camera_id = camera_id
        self.env = env
        self.prefix = "ppe"
        self.picture_path = self.prefix + "/images/" + self.device_id + "/"
        self.s3_picture = "s3://" + self.bucket + "/" + self.picture_path
        self.label_path = self.prefix + "/labels/" + self.device_id + "/"
        self.s3_label = "s3://" + self.bucket + "/" + self.label_path

        self.num_camera = 100
        self.is_detect = {}

    def detect_and_report(self, stream_id, bboxes, cordon_area, image_raw):
        log.info("Start detecting!!!")
        people_cor = []
        label_cor = ""

        # Cordon coordinate, order: left-top, right-top, right-bottom, left-bottom. Hard code for fixed resolution(1280x720).
        cordon_cor = [
            (round(cordon_area[0] * 1280), round(cordon_area[1] * 720)),
            (round(cordon_area[2] * 1280), round(cordon_area[1] * 720)),
            (round(cordon_area[2] * 1280), round(cordon_area[3] * 720)),
            (round(cordon_area[0] * 1280), round(cordon_area[3] * 720)),
        ]
        # log.info('>>>>>>Processing')
        # log.info('Detection from camera: ' + stream_id)
        for i in range(len(bboxes)):
            bbox = bboxes[i]
            log.info(
                "bbox cor: ({}, {}) ({}, {})".format(
                    str(int(bbox[0])),
                    str(int(bbox[1])),
                    str(int(bbox[2])),
                    str(int(bbox[3])),
                )
            )
            # Add the people coordinates to list, order: left-top, right-top, right-bottom, left-bottom.
            people_cor.append(
                [
                    (int(bbox[0]), int(bbox[1])),
                    (int(bbox[2]), int(bbox[1])),
                    (int(bbox[2]), int(bbox[3])),
                    (int(bbox[0]), int(bbox[3])),
                ]
            )

            # Label data, format in ratio: (left+right)/2, (top+bottom)/2, (right-left), (bottom-top)
            label_cor += (
                "0"
                + " "
                + str(float((bbox[0] + bbox[2]) / 2 / 1280))
                + " "
                + str(float((bbox[1] + bbox[3]) / 2 / 720))
                + " "
                + str(float((bbox[2] - bbox[0]) / 1280))
                + " "
                + str(float((bbox[3] - bbox[1]) / 720))
                + "\n"
            )

        compareData = {
            "cordon_coordinates": cordon_cor,
            "person_coordinates": people_cor,
            "label_coordinates": label_cor,
        }

        if self.is_detect.get(stream_id) is None:
            self.is_detect[stream_id] = False

        is_overlap = cordon_area_detection(compareData)
        # logo.info("OverLap" + is_overlap)
        # is_already_detect = self.is_detect[stream_id]

        # log.info(f'is_overlap {str(is_overlap)}')
        # log.info(f'is_already_detect {str(self.is_detect[stream_id])}')
        """
        if is_overlap and is_already_detect == False:
            log.info('>>>>>>Processing')
            log.info('People detected from camera: ' + stream_id)
            ppe_handler(image_raw, compareData)
            log.info('<<<<<<End of processing')
            self.is_detect[stream_id] = True
        else:
            self.is_detect[stream_id] = is_overlap
        """

        # if is_overlap :
        log.info(">>>>>>Processing")
        log.info("People detected from camera: " + stream_id)
        ppe_handler(image_raw, compareData, self.env)
        log.info("<<<<<<End of processing")
        # self.is_detect[stream_id] = True
