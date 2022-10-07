import json
import boto3
import os

env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
TABLE_NAME = "Event-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)

def handler(event, context):
    body = json.loads(event['body'])
    try:
        table.delete_item(
            Key={
                'CameraID': body['CameraID'],
                'TimeStamp': body['TimeStamp']
            },
        )
        return {
            "statusCode": 200,
            "body": "Delete Successful!!",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }
    except Exception as e:
        return {
            "statusCode": 404,
            "body": str(e),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }
        