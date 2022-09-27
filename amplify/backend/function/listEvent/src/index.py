import boto3
import json
from botocore.exceptions import ClientError
from boto3.dynamodb.conditions import Key
import os

env_p = os.environ["ENV"]
# DB
TABLE_NAME = "Event-" + env_p
db = boto3.resource("dynamodb")
table = db.Table(TABLE_NAME)

# S3

# def defaultencode(o):
#     if isinstance(o, Decimal):
#         # Subclass float with custom repr?
#         return int(o)
#     raise TypeError(repr(o) + " is not JSON serializable")

s3 = boto3.client("s3")


def processData(item):
    good = {}
    good["CameraID"] = item["CameraID"]
    good["TimeStamp"] = int(item["TimeStamp"])
    good["label_filename"] = "defaultTest"
    if item["payload"]["label_filename"]:
        good["label_filename"] = item["payload"]["label_filename"]
    good["picture_filename"] = item["payload"]["picture_filename"]
    good["video_filename"] = item["payload"]["video_filename"]
    good["name"] = item["payload"]["name"]
    good["type"] = item["payload"]["type"]

    # print(item["payload"]["time"])
    good["time"] = item["payload"]["time"]
    good["flag"] = item["payload"]["flag"]
    good["location"] = item["payload"]["location"]
    good["device_id"] = item["payload"]["device_id"]
    good["picture"] = get_presigned_url(item["payload"]["picture"])
    if len(item["payload"]["video"]) > 0:
        good["video"] = get_presigned_url(item["payload"]["video"])
    if len(item["payload"]["label"]) > 0:
        good["label"] = get_presigned_url(item["payload"]["label"])
    if "acknowledged" in item["payload"]:
        good["acknowledged"] = item["payload"]["acknowledged"]
    if "manual_modified" in item["payload"]:
        good["manual_modified"] = item["payload"]["manual_modified"]
    if "ack_bbox_person" in item["payload"]:
        box_group = []
        for box in item["payload"]["ack_bbox_person"]:
            new_box = []
            for line in box:
                new_box.append(str(line))
            box_group.append(new_box)
        good["ack_bbox_person"] = box_group
    if "ack_bbox_mask" in item["payload"]:
        box_group = []
        for box in item["payload"]["ack_bbox_mask"]:
            new_box = []
            for line in box:
                new_box.append(str(line))
            box_group.append(new_box)
        good["ack_bbox_mask"] = box_group
    good["origin_picture"] = get_presigned_url(item["payload"]["origin_picture"])
    return good

def handler(event, context):
    # TODO implement
    try:
        if event["httpMethod"] == "GET":
            # has queryParmeter 
            # if event['']
            print(event)
            # print(event['pathParameters']['pr'])
            results = []
            response = table.query(
                IndexName='tag-timestamp-index',
                KeyConditionExpression=Key('tag').eq('beta'),
                ScanIndexForward=False
            )
            datas = response['Items']
            
            while 'LastEvaluatedKey' in response:
                response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
                datas.update(response['Items'])
            for data in datas:
                good = processData(data)
                results.append(good)
            returnBody = results

        # The way to process data on every request 
        if event["httpMethod"] == "POST":
            body = json.loads(event['body'])
            print(event)
            returnBody = {}
            if 'LastEvaluatedKey' in body:
                print('page')
                response = table.scan(
                    Limit=10,
                    ExclusiveStartKey=body['LastEvaluatedKey']
                )
                if 'LastEvaluatedKey' in response:
                    response['LastEvaluatedKey']['TimeStamp'] = int(response['LastEvaluatedKey']['TimeStamp'])
                    returnBody['LastEvaluatedKey'] = response['LastEvaluatedKey']
                
            else:
                print('first page')
                response = table.scan(Limit=10)
                if 'LastEvaluatedKey' in response:
                    response['LastEvaluatedKey']['TimeStamp'] = int(response['LastEvaluatedKey']['TimeStamp'])
                    returnBody['LastEvaluatedKey'] = response['LastEvaluatedKey']
            results = []
            print(response)
            for item in response["Items"]:
                good = processData(item)
                results.append(good)
            returnBody['Items'] = results
        # elif event["httpMethod"] == "POST":
        #     print(event["body"])
        #     table.update_item(
        #         Key={"CameraID": body["CameraID"], "TimeStamp": body["TimeStamp"]},
        #         UpdateExpression="set payload = :val",
        #         ExpressionAttributeValues={":val": body},
        #         ReturnValues="UPDATED_NEW",
        #     )
        #     body = json.dumps("Update Successful")
        return {
            "statusCode": 200,
            "body": json.dumps(returnBody),
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            },
        }
    except Exception as e:
        print("Error !!")
        print(e)
        return {
            "statusCode": 404,
            "body": "Random Error",
            "headers": {
                "Access-Control-Allow-Headers": "*",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
            },
        }


def get_presigned_url(s3uri):
    first = s3uri.find("/", 5)
    # bucket = bucket=s3uri[5 : first]
    bucket = s3uri[5:first]

    file_key = s3uri[first + 1 :]
    try:
        url = s3.generate_presigned_url(
            ClientMethod="get_object",
            Params={"Bucket": bucket, "Key": file_key},
            ExpiresIn=1000,
        )
    except ClientError:
        print("Couldn't get a presigned URL for client method ")
        raise
    return url
