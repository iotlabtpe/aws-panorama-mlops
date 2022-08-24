import json
import boto3
import os

# Get SSM
ssm = boto3.client("ssm")
env = os.environ["ENV"]
env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + env)["Parameter"]["Value"]

region = os.environ["REGION"]
# Get SM
sm = boto3.client("sagemaker", region_name=region)

# Get DB
TABLE_NAME = "ppaModel-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)


def handler(event, context):
    # TODO implement
    # From create_training_job
    model_name = event["model_name"]
    try:
        response = sm.describe_training_job(TrainingJobName=model_name)
        print(response)
    except Exception as e:
        print(e)
        print("Unable to describe training job.")
        raise (e)
    params = {}

    status = response["TrainingJobStatus"]
    creation_time = response["CreationTime"]

    params["trainingJobName"] = model_name
    params["trainingJobStatus"] = status
    params["trainingJobCreationTime"] = creation_time.strftime("%Y-%m-%d %H:%M:%S")

    model_data_url = None
    if status == "Completed":
        s3_output_path = response["OutputDataConfig"]["S3OutputPath"]
        model_data_url = s3_output_path + "/" + model_name + "/output/model.tar.gz"
        training_start_time = response["TrainingStartTime"]
        training_end_time = response["TrainingEndTime"]
        params["trainingJobModelDataUrl"] = model_data_url
        params["trainingJobStartTime"] = training_start_time.strftime(
            "%Y-%m-%d %H:%M:%S"
        )
        params["trainingJobEndTime"] = training_end_time.strftime("%Y-%m-%d %H:%M:%S")
        table.update_item(
            Key={"model_name": model_name},
            UpdateExpression="set trainingJobStatus = :val, trainingJobModelDataUrl = :val2, trainingJobStartTime = :val3, trainingJobEndTime = :val4",
            ExpressionAttributeValues={
                ":val": status,
                ":val2": model_data_url,
                ":val3": params["trainingJobStartTime"],
                ":val4": params["trainingJobEndTime"],
            },
            ReturnValues="UPDATED_NEW",
        )
    elif status == "Failed":
        failure_reason = response["FailureReason"]
        params["trainingJobFailureReason"] = failure_reason
        table.update_item(
            Key={"model_name": model_name},
            UpdateExpression="set trainingJobFailureReason = :val",
            ExpressionAttributeValues={":val": params["trainingJobFailureReason"]},
            ReturnValues="UPDATED_NEW",
        )

    key = {"model_name": model_name}

    result = {
        "model_name": model_name,
        "status": status,
        "model_data_url": model_data_url,
    }
    return result
