import json
import boto3
import os
from botocore.exceptions import ClientError
import logging


env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]


TABLE_NAME = "Event-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)

s3 = boto3.client(
    "s3",
    config=boto3.session.Config(s3={"addressing_style": "virtual"}, signature_version="s3v4"),
)


def handler(event, context):
    try:
        # body = event['body']
        body = json.loads(event["body"])
        type = body["type"]
        s3uri = body["s3uri"]
        images_prefix = "images"
        labels_prefix = "labels"

        response = table.scan(Limit=10)
        items = response["Items"]
        for item in items:
            print(item)
            result = post_process_hit(item["payload"], type, s3uri, images_prefix, labels_prefix)
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
            "body": json.dumps("Hello from your new Amplify Python lambda!"),
        }
    except ClientError as e:
        logging.error(e)


def post_process_hit(payload, type, s3uri, images_prefix, labels_prefix):
    try:
        print("post_processing")
        if type == "mask":
            # print(payload['ack_mask'])
            if "ack_bbox_mask" in payload:
                print(payload["ack_bbox_mask"])
                ack_bbox = payload["ack_bbox_mask"]
            else:
                return []
        else:
            ack_bbox = payload["ack_bbox_helmet"]
        # print('Ack_bbox',ack_bbox)
        image_uri = payload["origin_picture"]
        first = image_uri.find("/", 5)
        s3bucket = image_uri[5:first]
        s3key = image_uri[first + 1 :]
        last = image_uri.rfind("/")

        image_file_name = image_uri[last + 1 :]
        print("Image_file", image_file_name)
        print("S3", s3bucket)
        print("key", s3key)
        download_file("/tmp/" + image_file_name, s3bucket, s3key)

        first = s3uri.find("/", 5)
        if first == -1:
            image_s3bucket = s3uri[5:]
            image_s3key = images_prefix + "/" + image_file_name
        else:
            image_s3bucket = s3uri[5:first]
            image_s3key = s3uri[first + 1 :] + "/" + images_prefix + "/" + image_file_name

        print("image_file_name:{}".format(image_file_name))
        print("processing image_s3bucket")
        print("image_s3bucket:{}".format(image_s3bucket))
        print("image_s3key:{}".format(image_s3key))
        upload_file("/tmp/" + image_file_name, image_s3bucket, image_s3key)

        last = image_file_name.rfind(".")
        label_file_name = image_file_name[0:last] + ".txt"

        if first == -1:
            label_s3bucket = s3uri[5:]
            label_s3key = labels_prefix + "/" + label_file_name
        else:
            label_s3bucket = s3uri[5:first]
            label_s3key = s3uri[first + 1 :] + "/" + labels_prefix + "/" + label_file_name

        # label_s3key = s3uri[first + 1 : ] + '/' + labels_prefix + '/' + label_file_name

        label_file = open("/tmp/" + label_file_name, "w")

        print("start writing label_file")
        for line in ack_bbox:
            label_file.write(str(line[0]) + " " + str(line[1]) + " " + str(line[2]) + " " + str(line[3]) + " " + str(line[4]))
        label_file.close()

        upload_file("/tmp/" + label_file_name, label_s3bucket, label_s3key)

        result = {}
        result["image"] = {}
        result["image"]["s3bucket"] = image_s3bucket
        result["image"]["s3key"] = image_s3key
        result["label"] = {}
        result["label"]["s3bucket"] = label_s3bucket
        result["label"]["s3key"] = label_s3key
        return result
        # return []
    except Exception as e:
        print(e)
        return {"statusCode": 500, "body": "Error!!"}


def upload_file(file, s3bucket, s3key):
    print("Uploading...")
    print(file)
    print(s3bucket)
    print(s3key)
    if s3key is None:
        s3_key = os.path.basename(file)

    # Upload the file
    s3_client = boto3.client("s3")
    try:
        response = s3_client.upload_file(file, s3bucket, s3key)
        print("Uploading Success")
    except ClientError as e:
        logging.error(e)


def download_file(file, s3bucket, s3key):
    print("Downloading...")
    print(file)
    print(s3bucket)
    print(s3key)
    s3.download_file(s3bucket, s3key, file)
