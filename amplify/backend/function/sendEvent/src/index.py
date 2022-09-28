import json
import boto3
import os
def handler(event, context):
  print('received event:')
  print(event)
  

  tableName = 'Event-' + os.environ["ENV"] 
  dynamodb = boto3.resource('dynamodb')
  table = dynamodb.Table(tableName)
  
  body = event
  body['TimeStamp'] = int(body['TimeStamp'])

  table.put_item(
    Item={
      'CameraID': body['CameraID'],
      'TimeStamp': body['TimeStamp'],
      'payload':  body,
      'tag': 'beta'
    }
  )
  
  return {
      'statusCode': 200,
      'headers': {
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST,GET'
      },
      'body': json.dumps('Hello from your new Amplify Python lambda!')
  }