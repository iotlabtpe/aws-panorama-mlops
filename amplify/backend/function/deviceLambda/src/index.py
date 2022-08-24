import json
import boto3

import sys

env_p = boto3.client("ssm").get_parameter(Name="/ppe/env")["Parameter"]["Value"]
panorama_client = boto3.client("panorama")

TABLE_NAME = "Device-" + env_p
# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def post(event):
    print(event)
    db = boto3.resource("dynamodb")
    table = db.Table(TABLE_NAME)
    body = json.loads(event["body"])

    print(body["device_id"])
    print(body["device_name"])
    print(body["device_core_name"])
    print(body["core_arn"])
    print(body["type"])
    print(body["use_gpu"])
    print(body["storage"])

    try:
        response = table.put_item(
            Item={
                "device_id": body["device_id"],
                "device_name": body["device_name"],
                "device_core_name": body["device_core_name"],
                "core_arn": body["core_arn"],
                "type": body["type"],
                "use_gpu": body["use_gpu"],
                "storage": body["storage"],
            }
        )
        eprint("OK !!")
        eprint(response)
        return {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "body": body["device_id"],
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }
    except Exception as e:
        # raise e
        eprint("Error !!")
        eprint(e)
        return {"statusCode": 500, "body": "Error!!"}


def get(event):
    print(event)
    eprint(">>> Start query config.")

    # db = boto3.resource('dynamodb')
    # table = db.Table(TABLE_NAME)

    try:
        response = panorama_client.list_devices()
        devices = []
        for node in response["Devices"]:
            device = {}
            device["DeviceId"] = node["DeviceId"]
            device["Name"] = node["Name"]
            device["CreatedTime"] = node["CreatedTime"].strftime("%Y/%m/%d, %H:%M:%S")
            device["ProvisioningStatus"] = node["ProvisioningStatus"]

            devices.append(device)
            eprint(device)
        # response = table.scan()
        eprint(response)
        eprint(response["ResponseMetadata"]["HTTPStatusCode"])
        return {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "body": json.dumps(devices),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }
    except Exception as e:
        eprint(e)
        return {"statusCode": 500, "body": "Error!!"}


def delete(event):
    print(event)
    body = json.loads(event["body"])
    panorama_client = boto3.client("panorama")
    try:
        panorama_client.delete_device(DeviceId=body["DeviceId"])
        return {
            "statusCode": 200,
            "body": "Delete Successful !!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }
    except Exception as e:
        # raise e
        eprint(e)
        return {
            "statusCode": 500,
            "body": "Error!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }


def handler(event, context):
    if event["httpMethod"] == "POST":
        return post(event)
    elif event["httpMethod"] == "GET":
        return get(event)
    elif event["httpMethod"] == "DELETE":
        return delete(event)


if __name__ == "__main__":
    pass
