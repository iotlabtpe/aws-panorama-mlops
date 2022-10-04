import json
import os
import boto3


def handler(event, context):
  print('received event:')
  print(event)

  random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])["Parameter"]["Value"]
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps(random_p)
  }