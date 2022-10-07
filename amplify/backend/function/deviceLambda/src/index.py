import json
import boto3
import os
import sys

env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
panorama_client = boto3.client("panorama")

# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)



def get(event):
    print(event)
    eprint(">>> Start query config.")


    try:
        response = panorama_client.list_devices(
            MaxResults=10
        )
        results = []
        if "Devices" in response:   
            results = response["Devices"]
        while 'NextToken' in response: 
            response = panorama_client.list_devices(MaxResults=10, NextToken=response['NextToken'])
            results+= response["Devices"]

        devices = []
        for node in results:
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
    if event["httpMethod"] == "GET":
        return get(event)
    elif event["httpMethod"] == "DELETE":
        return delete(event)


if __name__ == "__main__":
    pass
