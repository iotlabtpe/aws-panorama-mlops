import json
import boto3
import sys
import os

override_camera_template = {
    "nodeGraphOverrides": {
        "envelopeVersion": "2021-01-01",
        "packages": [],
        "nodes": [],
        "nodeOverrides": [{"replace": "front_door_camera", "with": []}],
    }
}


arn_role = boto3.client("ssm").get_parameter(Name="/ppe/config/arn/" + os.environ["ENV"])["Parameter"]["Value"]
env_p = os.environ["ENV"]

# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def post(event, account_id):
    print(event)
    s3 = boto3.resource("s3")
    pano_client = boto3.client("panorama")
    body = json.loads(event["body"])
   
    cameras = body["cameraNames"].split(",")

    for camera in cameras:
        override_camera_template["nodeGraphOverrides"]["packages"].append(
            {
                "name": "{acc_id}::{name}".format(acc_id=account_id, name=camera),
                "version": "1.0",
            }
        )
        override_camera_template["nodeGraphOverrides"]["nodes"].append(
            {
                "name": "{}".format(camera),
                "interface": "{acc_id}::{name}.{name}".format(acc_id=account_id, name=camera),
                "overridable": True,
                "overrideMandatory": False,
                "launch": "onAppStart",
            }
        )
        override_camera_template["nodeGraphOverrides"]["nodeOverrides"][0]["with"].append({"name": "{}".format(camera)})

    # # Override env node into Panorama Application
    override_camera_template["nodeGraphOverrides"]["nodes"].append({"name": "my_env", "interface": "string", "value": env_p})
    override_camera_template["nodeGraphOverrides"]["nodeOverrides"].append({"replace": "environment_variable", "with": [{"name": "my_env"}]})

    override_camera_template["nodeGraphOverrides"]["nodes"].append({"name": "my_region", "interface": "string", "value": os.environ["REGION"]})
    override_camera_template["nodeGraphOverrides"]["nodeOverrides"].append({"replace": "region_variable", "with": [{"name": "my_region"}]})

    override_camera_template["nodeGraphOverrides"]["nodes"].append({"name": "my_deviceId", "interface": "string", "value": body['deviceId']})
    override_camera_template["nodeGraphOverrides"]["nodeOverrides"].append({"replace": "deviceId_variable", "with": [{"name": "my_deviceId"}]})

    override_camera_template["nodeGraphOverrides"]["nodes"].append({"name": "my_cameraId", "interface": "string", "value": cameras[0]})
    override_camera_template["nodeGraphOverrides"]["nodeOverrides"].append({"replace": "cameraId_variable", "with": [{"name": "my_cameraId"}]})


    # Use targerArn for S3 bucket to download graph.json
    bucket, key = body["targetArn"].split("/", 2)[-1].split("/", 1)
    eprint({bucket, key})

    try:
        s3.meta.client.download_file(bucket, key, "/tmp/graph.json")
        with open("/tmp/graph.json") as graph_json:
            payload = json.load(graph_json)
            eprint(payload)
    except Exception as e:
        # raise e
        eprint(e)
        return {
            "statusCode": 500,
            "body": json.dumps(str(e)),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }


    # TODO Need to create a system parameter to access role for panorama service
    try:
        resp = pano_client.create_application_instance(
            Name=body["deploymentName"],
            ManifestPayload={"PayloadData": json.dumps(payload)},
            ManifestOverridesPayload={"PayloadData": json.dumps(override_camera_template)},
            DefaultRuntimeContextDevice=body["deviceId"],
            RuntimeRoleArn=arn_role,
        )
        eprint(resp)
        return {
            "statusCode": 200,
            "body": "Panorama Deployment Started!!",
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
            "body": json.dumps(str(e)),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }

   

def get(event):
    print(event)
    eprint(">>> Start query config.")
    panorama_client = boto3.client("panorama")

    try:
        response = panorama_client.list_application_instances(MaxResults=10)
        results = []
        if "ApplicationInstances" in response:   
            results = response["ApplicationInstances"]
        while 'NextToken' in response: 
            response = panorama_client.list_application_instances(MaxResults=10, NextToken=response['NextToken'])
            results+= response["ApplicationInstances"]
        
            
        eprint(response["ResponseMetadata"]["HTTPStatusCode"])

        applications = []
        for node in results:
            application = {}
            application["Name"] = node["Name"]
            application["ApplicationInstanceId"] = node["ApplicationInstanceId"]
            application["DefaultRuntimeContextDeviceName"] = node["DefaultRuntimeContextDeviceName"]
            application["CreatedTime"] = node["CreatedTime"].strftime("%Y/%m/%d, %H:%M:%S")
            application["Arn"] = node["Arn"]
            application["HealthStatus"] = node["HealthStatus"]
            application["Status"] = node["Status"]

            applications.append(application)
            eprint(node)
        eprint(response["ResponseMetadata"]["HTTPStatusCode"])
        return {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "body": json.dumps(applications),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
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
    panorama_client = boto3.client("panorama")
    body = json.loads(event["body"])
    try:
        panorama_client.remove_application_instance(ApplicationInstanceId=body["ApplicationInstanceId"])
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
        aws_account_id = context.invoked_function_arn.split(":")[4]
        return post(event, aws_account_id)
    elif event["httpMethod"] == "GET":
        return get(event)
    elif event["httpMethod"] == "DELETE":
        return delete(event)


if __name__ == "__main__":
    pass
