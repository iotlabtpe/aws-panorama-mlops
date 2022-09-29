#!/bin/bash
set -v
set -e
# This script shows how to build the Docker image and push it to ECR to be ready for use
# by SageMaker.

# The argument to this script is the image name. This will be used as the image on the local
# machine and combined with the account and region to form the repository name for ECR.
if [ "$#" -ne 1 ]; then
    echo "usage: $0 [region-name]"
    exit 1
fi

image="yolov5-train"

# Get the account number associated with the current IAM credentials
dst_id=$(aws sts get-caller-identity --query Account --output text)

# Get the region defined in the current configuration
dst_region=$1

# if [[ ${dst_region} =~ ^cn.* ]]
# then
#     src_id=919796776125
#     src_region="cn-north-1"
#     aws_endpoint="amazonaws.com.cn"
# else
#     src_id=201125699002
#     src_region="ap-southeast-1"
#     aws_endpoint="amazonaws.com"
# fi

# fullname_src="${src_id}.dkr.ecr.${src_region}.${aws_endpoint}/${image}:latest"
fullname_dst="${dst_id}.dkr.ecr.${dst_region}.${aws_endpoint}/${image}:latest"

# If the repository doesn't exist in ECR, create it.

if ! aws ecr describe-repositories --repository-names "${image}" --region ${dst_region};
then
    aws ecr create-repository --repository-name "${image}" --region ${dst_region}
    aws ecr get-login-password --region ${dst_region} | sudo docker login --username AWS --password-stdin ${dst_id}.dkr.ecr.${dst_region}.${aws_endpoint}
    # aws ecr get-login-password --region ${src_region} | sudo docker login --username AWS --password-stdin ${src_id}.dkr.ecr.${src_region}.${aws_endpoint}


    aws ecr set-repository-policy \
        --repository-name "${image}" \
        --policy-text "file://ecr-policy.json" \
        --region ${dst_region}

    # Build the docker image, tag with full name and then push it to ECR

    base_img='pytorch/pytorch:1.10.0-cuda11.3-cudnn8-runtime'
    echo 'base_img:'$base_img

    cd container 

    echo $PWD 

    sudo docker build --no-cache -t ${image} -f Dockerfile --build-arg BASE_IMG=$base_img .
    # sudo docker pull ${fullname_src}
    sudo docker tag ${image} ${fullname_dst}
    sudo docker push ${fullname_dst}
fi

