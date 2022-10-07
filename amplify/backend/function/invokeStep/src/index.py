import boto3
import json
import os
from datetime import datetime

def handler(event, context):

    try:
        print(event)
        body = json.loads(event["body"])
        print(body)
        name_prefix = 'sample'
        model_name = name_prefix + "-" + datetime.now().strftime("%Y-%m-%d-%H-%M-%S")
        # *get the env and role arn 
        random_p = random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])["Parameter"]["Value"]
        role_arn = boto3.client("ssm").get_parameter(Name="/ppe/config/arn/" + os.environ["ENV"])["Parameter"]["Value"]
        
        # *Need to get the AWS account id
        account_id = boto3.client("sts").get_caller_identity()["Account"]
        training_image = account_id + ".dkr.ecr." + os.environ['REGION'] + ".amazonaws.com/yolov5-train:latest"

        # *S3 Related Get 
        pretrainBucket = 'pretraininput-' + random_p

        trainingBucket = 'pretraininput-' + random_p
        if body['inputS3BucketName'] != "":
            trainingBucket = body['inputS3BucketName']
        retrainBucket = 'retrainoutput-' + random_p
        panoramaAppBucket = 'panorama-app-' + random_p
        appGraphBucket = 'app-graph-' + random_p

        # *Model 
        modelTable = 'Model-' + os.environ['ENV']
        
        # *CodeBuild Project
        codeBuildProject = 'Build-Panorama-App-' + os.environ['ENV']

        # *S3 Bucket Name ( Zip file ) of Panorma APP 
        app_name_zip = body["storedApplication"]

        # *Skip Training 
        skip_train = False 
        if body['inputS3BucketName'] == "":
            skip_train = True 
        
        # Step functions input 
        instance_type = 'ml.c5.18xlarge'

        stepInput = {}
        stepInput['skipTrain'] = skip_train
        stepInput['TrainingImage'] = training_image
        stepInput['cfgS3Uri'] = f's3://{pretrainBucket}/cfg'
        stepInput['weightsS3Uri'] = f's3://{pretrainBucket}/weights'
        stepInput['imagesS3Uri'] = f's3://{trainingBucket}/images'
        stepInput['labelsS3Uri'] = f's3://{trainingBucket}/labels'
        stepInput['output_s3uri'] = f's3://{retrainBucket}'
        stepInput['instance_type'] = instance_type
        stepInput['role_arn'] = role_arn
        stepInput['table_name'] = modelTable
        stepInput['project_name'] = codeBuildProject
        stepInput['app_name'] = app_name_zip[:-4]
        stepInput['app_s3_uri'] = f's3://{panoramaAppBucket}/{app_name_zip}'
        stepInput['model_name'] = model_name
        stepInput['GRAPH_S3'] = f's3://{appGraphBucket}/graph/{model_name}/graph.json'
        
        # Get the statemachinearn
        state_arn = boto3.client("ssm").get_parameter(
            Name="/ppe/state/arn/" + os.environ["ENV"]
        )["Parameter"]["Value"]
        print(state_arn)
        sfs = boto3.client("stepfunctions")
        response = sfs.start_execution(stateMachineArn=state_arn, input=json.dumps(stepInput))

        print(response)
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
    except Exception as e:
        print(e)
        print(str(e))
        return {
            "statusCode": 404,
            "body": json.dumps("Somethin wrong with the input "),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            }
        }