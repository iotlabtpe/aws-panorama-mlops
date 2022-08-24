import json
import boto3
import os

# Get the statemachinearn
state_arn = boto3.client("ssm").get_parameter(
    Name="/ppe/state/arn/" + os.environ["ENV"]
)["Parameter"]["Value"]


sfs = boto3.client("stepfunctions")

# sfs = boto3.client('stepfunctions')


def handler(event, context):
    input = event["body"]

    print(state_arn)
    response = sfs.start_execution(stateMachineArn=state_arn, input=input)

    print(response)
    # TODO implement
    return {
        "statusCode": 200,
        "body": "task - "
        + response["executionArn"]
        + " started at "
        + response["startDate"].strftime("%Y-%m-%d %H:%M:%S"),
        "headers": {
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
        },
    }
