import json
import boto3
from datetime import datetime
import boto3
import os


# Access Sagemaker and S3 and Dynamodb and SSM
# Grab the needed function


# Sagemaker
region = os.environ["REGION"]
sm = boto3.client("sagemaker", region_name=region)
env_p = boto3.client("ssm").get_parameter(Name="/ppe/env/" + os.environ["ENV"])["Parameter"]["Value"]
# SSM
random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])

PRE_S3_NAME = "pretraininput-" + random_p["Parameter"]["Value"]
TABLE_NAME = "Model-" + env_p

print(random_p)
print(random_p["Parameter"]["Value"])

# S3


def handler(event, context):
    # Remember to add json.loads() when testing on real api
    # print(event['body'])
    # body = json.loads(event['body'])
    try:
        # S3
        input_s3url = "s3://pretraininput-" + random_p["Parameter"]["Value"]
        print(input_s3url)
        output_s3url = "s3://retrainoutput-" + random_p["Parameter"]["Value"]
        print(output_s3url)
        model_tag = "default"
        if "tag" in event:
            model_tag = event["tag"]
        name_prefix = "ppa"
        if "name" in event:
            name_prefix = event["name"]
        model_name = name_prefix + "-" + datetime.now().strftime("%Y-%m-%d-%H-%M-%S")

        # Need to get the AWS account id
        account_id = boto3.client("sts").get_caller_identity()["Account"]
        print(account_id)
        training_image = account_id + ".dkr.ecr.ap-southeast-1.amazonaws.com/gary-yolov5-train:latest"

        # training_image = event['training_image'] // specify the training_image from the account

        cfg_prefix = "cfg"
        weights_prefix = "weights"
        images_prefix = "images"
        labels_prefix = "labels"
        if "images_prefix" in event:
            images_prefix = event["images_prefix"]
        if "labels_prefix" in event:
            labels_prefix = event["labels_prefix"]

        # Create a role for training job to perform action successfully
        role_arn = boto3.client("ssm").get_parameter(Name="/ppe/config/arn")["Parameter"]["Value"]
        instance_type = "ml.p3.2xlarge"
        if "instance_type" in event:
            instance_type = event["instance_type"]

        response = sm.create_training_job(
            TrainingJobName=model_name,
            HyperParameters={},
            AlgorithmSpecification={
                "TrainingImage": training_image,
                "TrainingInputMode": "File",
                "EnableSageMakerMetricsTimeSeries": True,
            },
            RoleArn=role_arn,
            InputDataConfig=[
                {
                    "ChannelName": "cfg",
                    "DataSource": {
                        "S3DataSource": {
                            "S3DataType": "S3Prefix",
                            "S3Uri": input_s3url + "/" + cfg_prefix,
                            "S3DataDistributionType": "FullyReplicated",
                        }
                    },
                },
                {
                    "ChannelName": "weights",
                    "DataSource": {
                        "S3DataSource": {
                            "S3DataType": "S3Prefix",
                            "S3Uri": input_s3url + "/" + weights_prefix,
                            "S3DataDistributionType": "FullyReplicated",
                        }
                    },
                },
                {
                    "ChannelName": "images",
                    "DataSource": {
                        "S3DataSource": {
                            "S3DataType": "S3Prefix",
                            "S3Uri": input_s3url + "/" + images_prefix,
                            "S3DataDistributionType": "FullyReplicated",
                        }
                    },
                },
                {
                    "ChannelName": "labels",
                    "DataSource": {
                        "S3DataSource": {
                            "S3DataType": "S3Prefix",
                            "S3Uri": input_s3url + "/" + labels_prefix,
                            "S3DataDistributionType": "FullyReplicated",
                        }
                    },
                },
            ],
            OutputDataConfig={"S3OutputPath": output_s3url},
            ResourceConfig={
                "InstanceType": instance_type,
                "InstanceCount": 1,
                "VolumeSizeInGB": 30,
            },
            StoppingCondition={"MaxRuntimeInSeconds": 86400},
            EnableNetworkIsolation=False,
            EnableInterContainerTrafficEncryption=False,
            EnableManagedSpotTraining=False,
        )

        params = {
            "model_name": model_name,
            "stage": "training_job",
            "modelTag": model_tag,
        }
        # dynamodb put action

        db = boto3.resource("dynamodb")
        table = db.Table(TABLE_NAME)
        table.put_item(
            Item={
                "model_name": model_name,
                "stage": "training_job",
                "modelTag": model_tag,
            }
        )
        result = {"model_name": model_name}
        return result
    except Exception as e:
        # raise e
        print("Error !!")
        print(e)
        # return {
        #   'statusCode': 500,
        #   'body': 'Error!!'
        # }
