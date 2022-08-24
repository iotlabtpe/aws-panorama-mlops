import json
import boto3
import tarfile
import os


random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])

RETRAIN_NAME = "retrainoutput-" + random_p["Parameter"]["Value"]


def handler(event, context):
    model_name = "default"
    if "model_name" in event:
        model_name = event["model_name"]

    s3_client = boto3.client("s3")
    s3_client.download_file(
        RETRAIN_NAME, model_name + "/output/model.tar.gz", "/tmp/model.tar.gz"
    )

    file = tarfile.open("/tmp/model.tar.gz")
    # extracting file
    file.extractall("/tmp")
    file.close()

    # print(os.listdir('/tmp'))

    s3_client.upload_file(
        "/tmp/metrics.json", RETRAIN_NAME, model_name + "/metrics.json"
    )

    event["metrics_bucket"] = RETRAIN_NAME
    event["metrics_filename"] = f"{model_name}/metrics.json"

    return event
