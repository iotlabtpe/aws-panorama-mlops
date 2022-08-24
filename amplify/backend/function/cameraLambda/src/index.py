import json
import boto3
import sys


# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def post(event):
    pano_client = boto3.client("panorama")
    body = json.loads(event["body"])

    CAMERA_NAME = body["brand"]
    CAMERA_CREDS = {
        "Username": body["location"],
        "Password": body["network"],
        "StreamUrl": body["address"],
    }

    print(body["camera_id"])
    print(body["address"])
    print(body["description"])
    print(body["location"])
    print(body["brand"])
    print(body["network"])
    print(body["image_size"])

    try:
        pano_res = pano_client.create_node_from_template_job(
            NodeName=CAMERA_NAME,
            OutputPackageName=CAMERA_NAME,
            OutputPackageVersion="0.1",
            TemplateParameters=CAMERA_CREDS,
            TemplateType="RTSP_CAMERA_STREAM",
        )
    except Exception as e:
        eprint("Error !!")
        eprint(e)
        return {
            "statusCode": 404,
            "body": "Camera Error",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }


def get(event):
    print(event)

    eprint(">>> Start query config.")
    panorama_client = boto3.client("panorama")

    try:
        response = panorama_client.list_nodes(MaxResults=25)
        cameras = []
        for node in response["Nodes"]:
            camera = {}
            camera["NodeId"] = node["NodeId"]
            camera["Name"] = node["Name"]
            camera["CreatedTime"] = node["CreatedTime"].strftime("%Y/%m/%d, %H:%M:%S")
            camera["PackageId"] = node["PackageId"]
            eprint(node["NodeId"])
            eprint(node["Name"])
            if "Description" in node:
                camera["Description"] = node["Description"]
                eprint(node["Description"])
            eprint(node["CreatedTime"].strftime("%Y/%m/%d, %H:%M:%S"))
            cameras.append(camera)

        return {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "body": json.dumps(cameras),
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
    eprint(">>> Start query config.")
    panorama_client = boto3.client("panorama")
    try:
        panorama_client.delete_package(ForceDelete=True, PackageId=body["PackageId"])
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
