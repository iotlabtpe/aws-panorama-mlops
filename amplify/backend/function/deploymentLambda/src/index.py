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
env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
TABLE_NAME = "Deployment-" + env_p

# Hack to print to stderr so it appears in CloudWatch.
def eprint(*args, **kwargs):
    print(*args, file=sys.stderr, **kwargs)


def post(event, account_id):
    print(event)
    eprint("env", env_p)
    db = boto3.resource("dynamodb")
    s3 = boto3.resource("s3")
    pano_client = boto3.client("panorama")
    table = db.Table(TABLE_NAME)
    body = json.loads(event["body"])
    # print(body['Device_ID'])
    # print(body['Camera_ID'])
    # print(body['Component_Version_ID'])
    # print(body['Model_Version_ID'])
    # print(body['targetArn'])
    # print(body['deploymentName'])
    # print(body['components'])
    # print(body['deploymentPolicies'])
    # print(body['iotJobConfigurations'])
    # Use Model_Version_ID for Panorama camera list

    cameras = body["Model_Version_ID"].split(",")

    for camera in cameras:
        override_camera_template["nodeGraphOverrides"]["packages"].append(
            {
                "name": "{acc_id}::{name}".format(acc_id=account_id, name=camera),
                "version": "0.1",
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

    # Override env node into Panorama Application
    override_camera_template["nodeGraphOverrides"]["nodes"].append({"name": "my_env", "interface": "string", "value": env_p})
    override_camera_template["nodeGraphOverrides"]["nodeOverrides"].append({"replace": "environment_variable", "with": [{"name": "my_env"}]})
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
            "body": "Download graph.json fail!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }

    # Use Comonent_Version_ID for Panorama device id

    # TODO Need to create a system parameter to access role for panorama service
    try:
        resp = pano_client.create_application_instance(
            Name=body["deploymentName"],
            ManifestPayload={"PayloadData": json.dumps(payload)},
            ManifestOverridesPayload={"PayloadData": json.dumps(override_camera_template)},
            DefaultRuntimeContextDevice=body["Component_Version_ID"],
            RuntimeRoleArn=arn_role,
        )
        eprint(resp)
        return {
            "statusCode": 200,
            "body": "Panorama Deployment Successful!!",
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
            "body": "Panorama Deployment fail!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }

    # try:
    #     response = table.put_item(
    #         Item={
    #             "DeploymentID": body["Deployment_ID"],
    #             "DeviceID": body["Device_ID"],
    #             "CameraID": body["Camera_ID"],
    #             "ComponentVersionID": body["Component_Version_ID"],
    #             "ModelVersionID": body["Model_Version_ID"],
    #             "TargetArn": body["targetArn"],
    #             "DeploymentName": body["deploymentName"],
    #             "components": body["components"],
    #             "deploymentPolicies": body["deploymentPolicies"],
    #             "iotJobConfigurations": body["iotJobConfigurations"],
    #         }
    #     )
    #     return {
    #         "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
    #         "body": body["Deployment_ID"],
    #         "headers": {
    #             "Access-Control-Allow-Headers": "*",
    #             "Access-Control-Allow-Origin": "*",
    #             "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    #         },
    #     }
    # except Exception as e:
    #     # raise e
    #     eprint(e)
    #     return {
    #         "statusCode": 500,
    #         "body": "Error!!",
    #         "headers": {
    #             "Access-Control-Allow-Headers": "*",
    #             "Access-Control-Allow-Origin": "*",
    #             "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
    #         },
    #     }


def get(event):
    print(event)
    eprint(">>> Start query config.")
    # db = boto3.resource("dynamodb")
    # table = db.Table(TABLE_NAME)
    panorama_client = boto3.client("panorama")

    try:
        response = panorama_client.list_application_instances(
            MaxResults=25,
            StatusFilter="DEPLOYMENT_SUCCEEDED" | "DEPLOYMENT_ERROR" | "REMOVAL_FAILED" | "PROCESSING_DEPLOYMENT" | "PROCESSING_REMOVAL" | "DEPLOYMENT_FAILED",
        )
        eprint(response["ResponseMetadata"]["HTTPStatusCode"])

        applications = []
        for node in response["ApplicationInstances"]:
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
