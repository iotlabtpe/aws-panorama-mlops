import boto3
import os 
import sys
import shutil

import logging

log = logging.getLogger('my_logger')

random_p = boto3.client('ssm',region_name='ap-southeast-1').get_parameter(Name='/ppe/random')
target_s3_folder = "src"
target_s3_bucket = "panorama-app-" + random_p['Parameter']['Value']

log.info(target_s3_bucket)
log.info(target_s3_folder)

homedir = "/opt/aws/panorama/storage/"
entry_point = "{}/tensorrt_pytorch_panorama.py".format(target_s3_folder)

if os.path.exists(os.path.join(homedir, target_s3_folder)):
    shutil.rmtree(os.path.join(homedir, target_s3_folder))


def downloadDirectoryFroms3(bucketName, remoteDirectoryName):
    s3_resource = boto3.resource('s3')
    bucket = s3_resource.Bucket(bucketName) 
    for obj in bucket.objects.filter(Prefix = remoteDirectoryName):
        if not os.path.exists(os.path.join(homedir , os.path.dirname(obj.key))):
            os.makedirs(os.path.join(homedir, os.path.dirname(obj.key)))
        bucket.download_file(obj.key, os.path.join(homedir, obj.key))

downloadDirectoryFroms3(target_s3_bucket, target_s3_folder)
os.execl(sys.executable, "python3", os.path.join(homedir, entry_point))
