# Panorama MLOps Overview 

![Screen Shot 2022-09-20 at 4 12 42 PM](https://user-images.githubusercontent.com/61721490/192129270-16b17f4c-3e4c-40a4-a0c2-6e4e3b00b7dc.png)

## Overview

Panorama MLOPs is an extension service from Panorama which help you better manage, monitor and deploy your Panorama APP, with this service, you can easily using Web service to do the following operation

* Create / Delete / View Panorama Data source
* View / Delete  Panorama Devices status 
* Package and Deploy Panorama APP without writing any code 
* Manage your Panorama APP and Model in Panorama MLOps console 

If you want to know the details about how to do the above actions, please go to this [documents]()

## Getting Started 

## One Click Deployment Panorama MLOps with Amplify Console

1. Prerequisites 

* [AWS Account](https://aws.amazon.com/mobile/details) with appropriate permissions to create the related resources
* GitHub Account with appropriate permissions to clone, and install the amplify app 
* [AWS CLI](http://docs.aws.amazon.com/cli/latest/userguide/installing.html) ( For delete usage ) with output configured as JSON  `(pip install awscli --upgrade --user)`

2. Clone this sample to your App

![Screen Shot 2022-09-19 at 9 19 41 AM](https://user-images.githubusercontent.com/61721490/192129286-efb6a012-0878-41d3-bbf6-00acff5912ce.png)

3. Click the button to load the AWS Amplify Console. Amplify Console will build and deploy your backend and frontend in a single workflow. the end to end deployment should take around 20 minutes:


<br/>
<div align="center" width="100%">
  <a href="https://console.aws.amazon.com/amplify/home#/create" target="_blank">
        <img src="https://oneclick.amplifyapp.com/button.svg" alt="Deploy to Amplify Console">
  </a>
</div>

<br/>



4. Connect the Amplify with your source code from the Git repository you just cloned, authorize AWS Amplify to connect to this repository and select a branch.

<img width="1739" alt="Screen Shot 2022-09-19 at 9 27 08 AM" src="https://user-images.githubusercontent.com/61721490/192129301-9d29bf98-f980-4cfc-b66e-6f90169c326a.png">

5. Create new environment, branch, and create an IAM role ( with following json snippet )
<img width="997" alt="Screen Shot 2022-09-19 at 9 32 22 AM" src="https://user-images.githubusercontent.com/61721490/192129413-add3c3fc-f17b-440b-bdf3-6af4fd6978a3.png">

**The IAM permission is not the best practice here, it’s just for sample purpose**

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ssm:*",
                "codebuild:*",
                "states:*",
                "iot:*",
                "s3:*",
                "dynamodb:*",
                "lambda:*",
                "sagemaker:*",
                "panorama:*",
                "ecr:*",
                "ec2:*"
            ],
            "Resource": "*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:AddRoleToInstanceProfile",
                "iam:PassRole",
                "iam:DeleteInstanceProfile",
                "iam:AttachRolePolicy",
                "iam:CreateRole",
                "iam:RemoveRoleFromInstanceProfile"
            ],
            "Resource": "arn:aws:iam::*:role/amplify*"
        },
        {
            "Effect": "Allow",
            "Action": [
                "iam:CreateInstanceProfile",
                "iam:RemoveRoleFromInstanceProfile",
                "iam:AddRoleToInstanceProfile",
                "iam:PassRole",
                "iam:DeleteInstanceProfile",
                "iam:AttachRolePolicy",
                "iam:CreateRole",
                "iam:RemoveRoleFromInstanceProfile"
            ],
            "Resource": "arn:aws:iam::*:instance-profile/amplify*"
        }
    ]
}
```


6. Paste the build script and replace the default one with the following yaml snippet 
![Screen Shot 2022-09-19 at 9 40 47 AM](https://user-images.githubusercontent.com/61721490/192129447-68e09888-5334-41dc-af68-c558999a26bf.png)


```
version: 1
backend:
  phases:
    preBuild:
      commands:
        - ln -fs /usr/local/bin/python3.8 /usr/bin/python3
        - ln -fs /usr/local/bin/pip3.8 /usr/bin/pip3
        - pip3 install pipenv
        - pip3 install virtualenv
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    # IMPORTANT - Please verify your build output directory
    baseDirectory: /build/
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```


7. Click “Next” then “Save and Deploy” and wait for the graph to turn into the following graph

![Screen Shot 2022-09-19 at 9 42 29 AM](https://user-images.githubusercontent.com/61721490/192129453-71e48634-7730-4ed6-8d7f-a157cb0d0cd0.png)


## Local Develop Environment Setup

1. **Prerequisites**

* [NodeJS](https://nodejs.org/en/download/) with [NPM](https://docs.npmjs.com/getting-started/installing-node)
* [AWS Amplify CLI](https://github.com/aws-amplify/amplify-cli) configured for a region where all other services in use are available `(npm install -g @aws-amplify/cli)`

2. You have already cloned the repo in previous step. Change directory to application root and install dependencies

```
cd aws-panorama-mlops && npm install
```

3. Select your app in amplify console. All Apps → aws-panorama-mlops → Backend Environment → (extend) Edit backend at the bottom.

![Screen Shot 2022-09-19 at 10 00 41 AM](https://user-images.githubusercontent.com/61721490/192129467-c3f51d63-f8a1-49a0-bb61-b8512baa94e0.png)


4. Paste this command into your terminal at the root of your repo (when prompted accept defaults for runtime and source path)

```
amplify pull --appId <app-id-from-console> --envName <env-name>

? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use default
Amplify AppID found: xxxxxx1234sd. Amplify App name is: aws-appsync-refarch-microservices}
Backend environment master found in Amplify Console app: aws-appsync-refarch-microservices
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building javascript
Please tell us about your project
? What javascript framework are you using react
? Source Directory Path:  src
? Distribution Directory Path: build
? Build Command:  npm run-script build
? Start Command: npm run-script start

? Do you plan on modifying this backend? Yes

Successfully pulled backend environment master from the cloud.
Run 'amplify pull' to sync upstream changes.
```

5. Start and work on your front end locally. This will connect to the backend deployed in AWS.

```
`npm run start`
```



## Clean up

You can refer the doc for more details 

https://aws.amazon.com/premiumsupport/knowledge-center/amplify-delete-application/

There are three ways to delete PPE, you will need to combine two of them to delete the APP in most situation

**Using AWS Amplify Console** 

1. Open the [AWS Amplify console](https://console.aws.amazon.com/amplify/)
2. In the left navigation pane, choose the name of the application that you want to delete


![Screen Shot 2022-09-22 at 6 54 30 PM](https://user-images.githubusercontent.com/61721490/192129604-ae490af1-ef14-4ca4-8417-3ec936939a97.png)

**After that, if you still see your APP in the Amplify Console, you will need to use AWS CLI and CloudFormation to completely delete the APP**

### 
**Using CloudFormation** 

1. Go to the console
2. Use the filter to find the amplify stack with your environment name in it, for example: if you env name is mainline, search for the amplify stack name with "mainline"
3. Click on Delete Button to delete the stack 
<img width="1785" alt="Screen Shot 2022-09-25 at 1 24 27 PM" src="https://user-images.githubusercontent.com/61721490/192129786-901baab2-a62a-4fe7-8e8d-64d3c612ff20.png">

**You will have to use AWS Cli to delete the amplify app thoroughly after using CloudFormation**

### Using AWS Cli 

1. Make sure you have the AWS Cli installed 
2. Open the terminal 
3. Run the following [delete-app](https://docs.aws.amazon.com/cli/latest/reference/amplify/delete-app.html) AWS CLI command:

**Important:** Replace **your-app-id** with your application's App ID. Replace **application-region** with the AWS Region that your application is in.

<img width="1777" alt="Screen Shot 2022-09-25 at 1 35 53 PM" src="https://user-images.githubusercontent.com/61721490/192130005-cfad1c23-f27d-407a-8a14-fa1825827589.png">

```
aws amplify delete-app --app-id <your-app-id> --region <application-region>
```

