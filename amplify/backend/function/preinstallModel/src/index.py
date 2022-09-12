import json
import boto3 
import cfnresponse
import os


def handler(event, context):
  try:
    random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])["Parameter"]["Value"]
    if event['RequestType'] == "Create":
      codeBuild_client = boto3.client("codebuild")
      env_var = [
          {
              "name":"PRETRAIN_BUCKET",
              "value": "s3://pretraininput-" + random_p,
          }
      ]
      build = codeBuild_client.start_build(
          projectName="Preinstalled-Panorama-Model-" + os.environ["ENV"],
          environmentVariablesOverride=env_var,
      )
      build_id = build["build"]["id"]
      responseValue = 120
      responseData = {}
      responseData['Data'] = responseValue
      cfnresponse.send(event, context, cfnresponse.SUCCESS, 
        responseData, 'scm-cfn-customresource-id')
      return {
          "statusCode": 200,
          "build_id": build_id,
      }
  except:
    responseValue = 120
    responseData = {}
    responseData['Data'] = responseValue
    cfnresponse.send(event, context, cfnresponse.FAILED, 
      responseData, 'scm-cfn-customresource-id')
