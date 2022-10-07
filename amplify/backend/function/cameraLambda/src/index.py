import json
import boto3
import sys


# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def post(event):
    pano_client = boto3.client("panorama")
    body = json.loads(event["body"])

    CAMERA_NAME = body["cameraName"]
     
    if body['username'] != '' and body['password'] != '':
        CAMERA_CREDS = {
            "Username": body["username"],
            "Password": body["password"],
            "StreamUrl": body["streamUrl"],
        }
    else:
        CAMERA_CREDS = {
            "StreamUrl": body["streamUrl"],
        }
    print(body["description"])

    try:
        pano_client.create_node_from_template_job(
            NodeDescription=body['description'],
            NodeName=CAMERA_NAME,
            OutputPackageName=CAMERA_NAME,
            OutputPackageVersion="1.0",
            TemplateParameters=CAMERA_CREDS,
            TemplateType="RTSP_CAMERA_STREAM",
        )
        return {
            "statusCode":200,
            "body": json.dumps("Create Successful"),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }
    except Exception as e:
        eprint("Error !!")
        eprint(e)
        return {
            "statusCode": 404,
            "body": str(e),
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
        response = panorama_client.list_nodes(
            MaxResults=10,
            Category='MEDIA_SOURCE'
        )

        results = []
        if "Nodes" in response:   
            results = response["Nodes"]
        while 'NextToken' in response: 
            response = panorama_client.list_nodes(MaxResults=10, Category='MEDIA_SOURCE', NextToken=response['NextToken'])
            results+= response["Nodes"]

        cameras = []
        for node in results:
            response = panorama_client.describe_node(
                NodeId=node['NodeId'],
            )
            camera = {}
            camera["NodeId"] = response["NodeId"]
            camera["Name"] = response["Name"]
            camera["CreatedTime"] = response["CreatedTime"].strftime("%Y/%m/%d, %H:%M:%S")
            if 'Description' in response:
                camera['Description'] = response['Description']
            camera["PackageId"] = response["PackageId"]
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
        return {
            "statusCode": 500,
            "body": "Error!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }


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
