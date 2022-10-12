import json
import boto3
import os
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
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

        # TODO Pagination 
        
        body = json.loads(event["body"])
        type = body["type"]
        s3uri = body["s3uri"]
        images_prefix = "images"
        labels_prefix = "labels"

        response = table.query(
                    IndexName='tag-timestamp-index',
                    KeyConditionExpression=Key('tag').eq('beta'),
                    ScanIndexForward=False
        )

        datas = response['Items']
            
        while 'LastEvaluatedKey' in response:
            response = table.query(
                ExclusiveStartKey=response['LastEvaluatedKey'],
                IndexName='tag-timestamp-index',
                KeyConditionExpression=Key('tag').eq('beta'),
                ScanIndexForward=False
            )
            datas.update(response['Items'])

        for item in datas:
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
        ack_bbox = []
        if type == "person":
            # print(payload['ack_mask'])
            if payload["acknowledged"] == True:
                if len(payload["ack_bbox_person"]) != 0:
                    print(payload["ack_bbox_person"])
                    ack_bbox = payload["ack_bbox_person"]
                else:
                    # "label_string" : { "S" : "0 0.0921875 0.9368055555555556 0.171875 1.1125\n0 0.218359375 0.9972222222222222 0.41953125 1.0055555555555555\n" },
                    # [[0,0.07,0.82,0.09,0.35],[0,0.07,0.82,0.09,0.35]]
                    # "ack_bbox_person" : { "L" : [ { "L" : [ { "N" : "0" }, { "N" : "0.07" }, { "N" : "0.82" }, { "N" : "0.09" }, { "N" : "0.35" } ] } ] },
                    # 0 0.1 0.2 0.3 0.4\n 0 0.2 0.3 0.4 
                    # [0,0.1,0.2,0.3,0.4]
                    print("Having none-modifed verifed data")
                    data = payload['label_string']
                    results = data.strip().split("\n")
                    print(results)
                    ack_bbox = []
                    for result in results:
                        labeling = result.split(" ")
                        print("Labeling",labeling)
                        ack_bbox.append(labeling)
            else:
                return ack_bbox
                    
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
        for count,line in enumerate(ack_bbox):
            # not the last line 
            print(count,line)
            if(count != len(ack_bbox) - 1):
                label_file.write(str(line[0]) + " " + str(line[1]) + " " + str(line[2]) + " " + str(line[3]) + " " + str(line[4]) + "\n")
            else:
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
    s3.download_file(s3bucket, s3key, file)
