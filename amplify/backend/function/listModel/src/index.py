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
    # model_name = None
    # # if event['pathParameters'] != None:
    # #     model_name = event['pathParameters']['model_name']

    # # model_tag = "default"

    # # if event['queryStringParameters'] != None:
    # #     if 'tag' in event['queryStringParameters']:
    # #         model_tag = event['queryStringParameters']['tag']

    # if model_name == None:
    #     items = table.scan(FilterExpression=Attr('model_tag').eq(model_tag))
    #     for item in items:
    #         process_item(item)
    #     body = json.dumps(items)
    # else:
    #     params = {}
    #     params['model_name'] = model_name
    #     item = table.get_item(params)
    #     process_item(item)
    #     body = json.dumps(item)
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
    # s3://app-graph-cd14bfe0-1231-11ed-b64e-06ca11bc4d14/graph/ppa-2022-08-03-05-37-59/graph.json
    # s3://retrainoutput-cd14bfe0-1231-11ed-b64e-06ca11bc4d14/ppa-2022-08-03-05-37-59/output/model.tar.gz
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
    except ClientError:
        print("Couldn't get a presigned URL for client method {}.".format(client_method))
        raise
    return url
