import json
import boto3 
import os
import logging
from botocore.exceptions import ClientError

s3 = boto3.client("s3")
random_p = boto3.client("ssm").get_parameter(Name="/ppe/random/" + os.environ["ENV"])["Parameter"]["Value"]
bucket = f'panorama-app-{random_p}'


def handler(event, context):
    if event['httpMethod'] == 'GET':
        response  = s3.list_objects(
            Bucket= bucket
            )
        
        results = []
        for object in response['Contents']:
            s3uri = f's3://{bucket}/{object["Key"]}'
            result = {
                'appName': object['Key'],
                'lastModifiedTime': object['LastModified'].strftime("%Y/%m/%d, %H:%M:%S"),
                'appUri': s3uri
                
            }
            #print("APP-Name: ",object['Key'])
            #print("Last-Modified-Time: ", object['LastModified'].strftime("%Y/%m/%d, %H:%M:%S"))
            #print(f'Storage: s3://{bucket}/{object["Key"]}')
            results.append(result)
            
        print(results)
        return {
            'statusCode': 200,
            'body': json.dumps(results),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }
    elif event['httpMethod'] == 'POST':
        try:
            body = json.loads(event["body"])
            if body['uploadMethod'] == 'uri':
                try:
                    app_uri = body['copyUri']
                    first = app_uri.find("/", 5)
                    s3bucket = app_uri[5:first]
                    s3key = app_uri[first + 1 :]
                    last = app_uri.rfind("/")
                    image_file_name = app_uri[last + 1 :]
                    print("Image_file", image_file_name)
                    print("S3", s3bucket)
                    print("key", s3key)
                    download_file("/tmp/" + image_file_name, s3bucket, s3key)
                    upload_file("/tmp/" + image_file_name, bucket, s3key)
                    
                    return {
                        'statusCode': 200,
                        'body': json.dumps("Upload Success!!!"),
                        "headers": {
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                        },
                    }
                except ClientError as e:
                    logging.error(e)
                    return {
                        'statusCode': 404,
                        'body': json.dumps("Please make sure the object did exist in the destination bucket!!!"),
                        "headers": {
                            "Access-Control-Allow-Headers": "*",
                            "Access-Control-Allow-Origin": "*",
                            "Access-Control-Allow-Headers": "*",
                        },
                    }              
            elif body['uploadMethod'] == 'file':
                pass
        except:
            return {
                'statusCode': 404,
                'body': json.dumps("Please make sure you fill out the form correctly!!!"),
                "headers": {
                    "Access-Control-Allow-Headers": "*",
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Headers": "*",
                },
            }             

def upload_file(file, s3bucket, s3key):
    print("Uploading...")
    print(file)
    print(s3bucket)
    print(s3key)
    if s3key is None:
        s3_key = os.path.basename(file)

    # Upload the file
    s3_client = boto3.client("s3")
    try:
        response = s3_client.upload_file(file, s3bucket, s3key)
        print("Uploading Success")
    except ClientError as e:
        logging.error(e)


def download_file(file, s3bucket, s3key):
    print("Downloading...")
    print(file)
    print(s3bucket)
    print(s3key)
    s3.download_file(s3bucket, s3key, file)
            
            