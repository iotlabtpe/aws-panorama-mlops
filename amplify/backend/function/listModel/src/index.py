import json
import boto3
import os

env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
TABLE_NAME = "Model-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)


def handler(event, context):

    response = table.scan()
    print(response)
    body = json.dumps(response)
    return {
        "statusCode": 200,
        "body": body,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }


def process_item(item):
    if "files" not in item:
        return

    files = item["files"]
    presigned_urls = []
    model_data_url = item["trainingJobModelDataUrl"]
    last = model_data_url.rfind("/")
    for file in files:
        print(file)
        file_uri = model_data_url[0 : last + 1] + file
        first = file_uri.find("/", 5)
        bucket = file_uri[5:first]
        file_key = file_uri[first + 1 :]
        print("key", file_key)
        presigned_urls.append(get_presigned_url(bucket, file_key))
    item["presigned_urls"] = presigned_urls


def get_presigned_url(bucket, file_key):
    try:
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket, "Key": file_key},
            ExpiresIn=1000,
        )
        print("Got presigned URL: {}".format(url))
    except:
        print("Couldn't get a presigned URL for client method")
        raise
    return url
