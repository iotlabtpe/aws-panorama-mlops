import boto3
import os


env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])

S3_NAME = "app-graph-" + random_p["Parameter"]["Value"]


def handler(event, context):
    client = boto3.client("codebuild")
    env_var = [
        {"name": "TASK_TOKEN", "value": event["token"], "type": "PLAINTEXT"},
        {
            "name": "MODEL_S3",
            "value": event["otherInput"]["model_data_url"],
            "type": "PLAINTEXT",
        },
        {
            "name": "MODEL_NAME",
            "value": event["otherInput"]["model_name"],
            "type": "PLAINTEXT",
        },
        {"name": "DB_TABLE_NAME", "value": "Model-" + env_p, "type": "PLAINTEXT"},
        {
            "name": "GRAPH_S3",
            "value": "s3://" + S3_NAME + "/graph/{}/graph.json".format(event["otherInput"]["model_name"]),
            "type": "PLAINTEXT",
        },
    ]
    build = client.start_build(
        projectName="Build-Panorama-App-" + os.environ["ENV"],
        environmentVariablesOverride=env_var,
    )
    build_id = build["build"]["id"]
    return {
        "statusCode": 200,
        "build_id": build_id,
    }
