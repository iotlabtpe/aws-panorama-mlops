import json
import boto3
import json
from decimal import Decimal
from botocore.exceptions import ClientError
import os


def handler(event, context):
    # TODO implement
    env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
    TABLE_NAME = "Event-" + env_p
    db = boto3.resource("dynamodb")
    table = db.Table(TABLE_NAME)
    print(event["body"])

    """
    resource = table.scan(Limit=10)
    
    for item in resource['Items']:
        print(item)
    """
    # body = json.loads(event['body'])
    body = json.loads(event["body"], parse_float=Decimal)
    # body = event['body']
    print(body["CameraID"])
    # Find the original table field
    original_item = table.get_item(Key={"CameraID": body["CameraID"], "TimeStamp": body["TimeStamp"]})

    print(">>>>>>>>>>>Original Data")
    print(original_item["Item"]["payload"])
    old_payload = original_item["Item"]["payload"]

    new_payload = {
        "CameraID": body["CameraID"],
        "TimeStamp": body["TimeStamp"],
        "label_string": old_payload["label_string"],
        "ack_bbox_mask": body["ack_bbox_mask"],
        "ack_date_mask": body["ack_date_mask"],
        "ack_mask": body["ack_mask"],
        "acknowledged": body["acknowledged"],
        "device_id": body["device_id"],
        "flag": body["flag"],
        "label": old_payload["label"],
        "label_filename": old_payload["label_filename"],
        "location": old_payload["location"],
        "manual_modified": body["manual_modified"],
        "name": old_payload["name"],
        "origin_picture": old_payload["origin_picture"],
        "picture": old_payload["picture"],
        "picture_filename": old_payload["picture_filename"],
        "time": old_payload["time"],
        "type": old_payload["type"],
        "video_filename": old_payload["video_filename"],
        "video": old_payload["video"],
    }
    print(">>>>>>>>>>>>.NewPayload")
    print(new_payload)
    new_value = table.update_item(
        Key={"CameraID": body["CameraID"], "TimeStamp": body["TimeStamp"]},
        UpdateExpression="set payload = :val",
        ExpressionAttributeValues={":val": new_payload},
        ReturnValues="UPDATED_NEW",
    )
    print(">>>>>>>>>> New Value")
    print(new_value)
    return {
        "statusCode": 200,
        "body": json.dumps("Hello from Lambda!"),
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*",
        },
    }
