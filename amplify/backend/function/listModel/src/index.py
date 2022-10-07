import json
import boto3
import os

env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
TABLE_NAME = "Model-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)


def handler(event, context):

    response = table.scan(Limit=100)

    datas = response['Items']
    while 'LastEvaluatedKey' in response:
        response = table.scan(Limit=100, ExclusiveStartKey=response['LastEvaluatedKey'])
        datas.update(response['Items'])
    body = json.dumps(datas)
    return {
        "statusCode": 200,
        "body": body,
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }