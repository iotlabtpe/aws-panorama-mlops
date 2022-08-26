# PPE Amplify One Click Installation 

## Note:

* PPE only support one region for now which is  **ap-southeast-1**, make sure you have admin access for the region.
* You will need some basic understanding of **AWS Console** and **Github** during the installation

## Prerequisites:

* Have a Panorama device and a working Camera ( Data resource )  connected to your [Panorama Console](https://aws.amazon.com/panorama/)
* Have an AWS account with **AWS Permission** to access [Amplify Console](https://aws.amazon.com/jp/amplify/) and the [IAM Console](https://us-east-1.console.aws.amazon.com/iamv2/home)
    * AWS Permission
        * As a managed service, Amazon Amplify performs operations on your behalf on the AWS hardware that is managed by Amazon Amplify. Amazon Amplify can perform only operations that the user permits. You can read more about which permissions are necessary in the [AWS Documentation](https://docs.aws.amazon.com/sagemaker/latest/dg/sagemaker-roles.html).
* Have a [Github](https://github.com/) account with full access 

## Fork Repo to your Git

heading to our [git repo](https://github.com/hardco2020/aws-panorama-mlops), and fork the repo to your account
![](https://i.imgur.com/6hZ53EG.png)

Next, you can head to the [Amplify Console](https://ap-southeast-1.console.aws.amazon.com/amplify/home?region=ap-southeast-1#/) , choose **Hosting my Web APP and GitHub as your existing code**

![](https://i.imgur.com/2CCl4uM.png)


Grant access to your AWS account using you Github, and choose **amplify-oneClick** on Branch **main**

![](https://i.imgur.com/TuEeASY.png)

Fill in the name you want and the environment name you like, after that you have to **create a new role**

![](https://i.imgur.com/Np5kAwy.png)

During creating a new role, you can just click next until the Create Role is completed, here are the example pictures

![](https://i.imgur.com/Aa9Lxmi.png)

![](https://i.imgur.com/hGpHlyd.png)

![](https://i.imgur.com/L6S7RY7.png)

![](https://i.imgur.com/1M62AGd.png)

After that, please search the role name in IAM Console, click on **Add permissions**

![](https://i.imgur.com/NNzZti7.png)

Click on **Create Policy**

![](https://i.imgur.com/5Wco53a.png)
Choose **JSON** and paste the following JSON into the rule like the picture below


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
                "ecs:*",
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

![](https://i.imgur.com/bqvHmZq.png)

After creating the policy, choose the **policy you just created to attach to your Role**

![](https://i.imgur.com/yN0Krxj.png)

Go back to **Amplify Console, Choose the Role you just created**

![](https://i.imgur.com/gYKBV1w.png)

You will see a **Building Script** once scroll down, **click on Edit and paste the following script on it.**

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

![](https://i.imgur.com/lmtKR2x.png)

Once you past the code, you can **click on save and go next**

![](https://i.imgur.com/OMGwODD.png)

you will see the final review of your deployment, click on **Save and Deploy**

![](https://i.imgur.com/FeQmUdF.png)

After that you will see a **four step graph** on your screen like the picture below

![](https://i.imgur.com/CQawOlB.png)

Go to the **Amplify Studio settings** on the left menu, and **click Enable Amplify Studio**

<img width="1471" alt="Screen Shot 2022-08-24 at 2 10 36 PM" src="https://user-images.githubusercontent.com/61721490/186343665-d8a813b4-218e-4c22-bfd0-dc33ed7ce040.png">

Go to the **Build settings, Edit the Build Image Settings**

<img width="1788" alt="Screen Shot 2022-08-24 at 2 12 20 PM" src="https://user-images.githubusercontent.com/61721490/186343957-b5c43b5d-9c39-4c8a-be68-f61694b6c7df.png">

Set the **Build timeout to be 60 minutes**

<img width="1749" alt="Screen Shot 2022-08-24 at 2 12 37 PM" src="https://user-images.githubusercontent.com/61721490/186344017-31736dec-e491-4cce-a383-294305263bd3.png">

Go back to the Buliding Graph by click on your App name ( default is amplify-oneClick ) on the left menu 

Because when we first deploy the APP, it will use the 30 minutes build time out setting for our deployment, we will need to redeploy so the APP will follow our new settings

Click on the **Cancel**, wait a while, and there will be a **Redeploy button**, click on the **Redeploy this version** to retry again with our new config

<img width="796" alt="Screen Shot 2022-08-24 at 2 15 31 PM" src="https://user-images.githubusercontent.com/61721490/186344488-6e2eb173-29e1-4b78-bf4b-f80f793cfea3.png">

After you see them all turning into green like the picture below ( you have to **wait approximately 30-60 minutes** on your first try ) . 

**Congrats, you are done with the one click installation !!** 

<img width="1425" alt="Screen Shot 2022-08-24 at 2 16 15 PM" src="https://user-images.githubusercontent.com/61721490/186344653-a1e69679-fd7b-4d13-bb9d-409f6215e376.png">

You can click on the **Domain URL** to see your own PPE below!!!

<img width="1789" alt="Screen Shot 2022-08-24 at 2 17 23 PM" src="https://user-images.githubusercontent.com/61721490/186344780-2f66fbdb-0946-4ec4-be53-cff7c2e5130b.png">


## How to use the PPE with Panorama

The following will teach you how to deploy **a Human Detector APP on Panorama and monitor the results using PPE** 

### Start training a sample application for your Panorama

Click on **Packaged Application** on the left menu, the below table will be empty when you first deploy the PPE 

<img width="1788" alt="Screen Shot 2022-08-24 at 2 24 28 PM" src="https://user-images.githubusercontent.com/61721490/186345931-8bb9e5d3-c597-4656-9f90-7dac6f0c6265.png">

Click on **New training, and just click on Submit,** we don’t have to input anything dataset for our sample APP

<img width="1784" alt="Screen Shot 2022-08-24 at 2 25 16 PM" src="https://user-images.githubusercontent.com/61721490/186345986-ed905df5-82e9-486c-bd86-3f8f6d3fd98d.png">


After that you will **see a field with training icon in your application, it means the training begin**, you can do other steps and come back after the training finished 
[Image: Image.jpg]

The training has two phase, the first phase is to output a model to your **retrain bucket** which shows below 

<img width="1772" alt="Screen Shot 2022-08-24 at 2 26 03 PM" src="https://user-images.githubusercontent.com/61721490/186346129-74ef2cd8-fda0-43d9-9b5c-3d594a48d596.png">

The next phase is to output a **graph.json  in your app-graph bucket which you could use to deploy Panorama,** you can spot the difference by observing the ModelStorage field. **When you see ModelStorage has s3://app-graph...,** then it means you are done with the training.

You will need to copy the ModelStorage **s3://app-graph... in the Deploy with the PPE step**


### Add a Camera to your PPE 

First click on the left menu, and there’s a **Camera Config** at the bottom
<img width="1776" alt="Screen Shot 2022-08-24 at 2 28 02 PM" src="https://user-images.githubusercontent.com/61721490/186346408-e1ebb427-c670-4116-b56d-91ba0ee286b8.png">

Click on the New Camera Config on the right side

Input the correspond information for your camera, and click on **Submit**

<img width="1772" alt="Screen Shot 2022-08-24 at 2 28 51 PM" src="https://user-images.githubusercontent.com/61721490/186346568-dd38f46b-8be3-429d-9026-257e18d6c10e.png">

After that you can see a camera created in your Camera Config, if you go to [Panorama Console](https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#), you can see your camera being created under the Data sources

<img width="1384" alt="Screen Shot 2022-08-24 at 2 30 03 PM" src="https://user-images.githubusercontent.com/61721490/186346703-b0bc811f-a0b5-41a2-9484-603033d51fbc.png">


### Add a Panorama device to PPE 

You will first need to create a Panorama device in  [Panorama Console](https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#), after that you will see your device running in the console 

Then you will see the device you provisioned show up at your **Device Config**

<img width="1786" alt="Screen Shot 2022-08-24 at 2 30 39 PM" src="https://user-images.githubusercontent.com/61721490/186346812-4152b468-3372-4f14-9943-af5c0a3baa9f.png">


### Deploy with PPE

After you finish **Add a Camera to your PPE**, **Start training a sample application for your Panorama**, and **Add a Panorama device to PPE**, you can go on with Deploy with PPE 

Click on **Deployed Application**, then click on **New Deployment** on the right side

<img width="1790" alt="Screen Shot 2022-08-24 at 2 33 09 PM" src="https://user-images.githubusercontent.com/61721490/186347271-a7179757-a950-464d-96cf-ce2d939b95ea.png">

Choose the correspond **Device ID** and **Camera ID** you just created, and pass the s3 url you get from **Start training a sample application for your Panorama** and you can randomly name your APP Name

After complete all the field, you can click on **Submit**

<img width="1775" alt="Screen Shot 2022-08-24 at 2 34 16 PM" src="https://user-images.githubusercontent.com/61721490/186347431-3a4fed44-4f2a-4601-955e-e35e285cc890.png">

After that, you can see your application status at **Deployed Application** or you can go to [Panorama Console](https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#), and click on **Deployed applications,** you will  see your APP is being deployed, please wait for 30-60 minutes, then see your **Application is running with green light,** you can go to next step

<img width="1772" alt="Screen Shot 2022-08-24 at 2 35 42 PM" src="https://user-images.githubusercontent.com/61721490/186347696-881c6172-c622-4a4e-9235-18adc4954d92.png">


## **Use the Panorama Application with PPE**

After you Application is running with green light, **you can go in front of your camera for 5 seconds , then it will start the detection and sent the data to your database**


### Monitor the activity 

Click on **Alert List** 

<img width="962" alt="Screen Shot 2022-08-24 at 2 39 17 PM" src="https://user-images.githubusercontent.com/61721490/186348411-f4b7e2e5-42d7-4c05-aa4d-f304b800adb2.png">


You can see the **detection is being return as series of data and image**

So you can **Monitor if there’s any alert activity** or people not wearing mask or people without helmet depends on how you write your APP, in this case, it will be when there’s human walking by.

### Verify the activity 

Click on **Alert Verify** 

<img width="1000" alt="Screen Shot 2022-08-24 at 2 41 06 PM" src="https://user-images.githubusercontent.com/61721490/186348694-33b00050-6d87-4e02-88b4-ea40968d6867.png">

You can  **Manually verify  if your model is actually being accurate** about the activity at this page

If you think it’s not correct, you can **Correct it by redefining the box it captured and Confirm the data** 

<img width="994" alt="Screen Shot 2022-08-24 at 2 41 52 PM" src="https://user-images.githubusercontent.com/61721490/186348822-9784957f-9e4e-4694-b9d6-87937e4b0d2c.png">

Click on **Confirm Data**


<img width="996" alt="Screen Shot 2022-08-24 at 2 42 16 PM" src="https://user-images.githubusercontent.com/61721490/186348877-71179712-78a3-4d3d-9311-b639cfaae197.png">

Then refresh the page, you can see your data successfully modified 

<img width="1029" alt="Screen Shot 2022-08-24 at 2 42 37 PM" src="https://user-images.githubusercontent.com/61721490/186348931-3c96069c-6f11-42c0-bc86-946839190b0c.png">


### **Export your data** 

You can **retrain your data after you have manually confirmed them**, so you can make your model to be more precise in the future 

Click on **Alert Export** 

<img width="1781" alt="Screen Shot 2022-08-24 at 2 44 33 PM" src="https://user-images.githubusercontent.com/61721490/186349238-00f94966-6d92-45b4-9202-28208d9f267a.png">

Go to your S3 Console and choose the bucket with **s3://export-event-xxxxx** ( or you can choose your own bucket  

<img width="1000" alt="Screen Shot 2022-08-24 at 2 43 16 PM" src="https://user-images.githubusercontent.com/61721490/186349025-10f289a7-7165-43ba-a017-b2efd50d0e65.png">

Copy the S3 Url to the following field, then **Submit** 

<img width="1786" alt="Screen Shot 2022-08-24 at 2 45 06 PM" src="https://user-images.githubusercontent.com/61721490/186349349-c925d906-d2ec-4e86-aa0e-909c70c86e35.png">

Then you can see your dataset inside your bucket, and use the dataset  to **Retrain your Model** 

<img width="1002" alt="Screen Shot 2022-08-24 at 2 43 59 PM" src="https://user-images.githubusercontent.com/61721490/186349152-91c545f4-088b-4968-93c7-33f7d44b6cf8.png">


## How to replace your model + app in PPE ##

go to https://github.com/hardco2020/aws-panorama-mlops-script/blob/main/README.md for more detail


## How to delete PPE ##

You can refer the doc for more details 
https://aws.amazon.com/premiumsupport/knowledge-center/amplify-delete-application/

There are three ways to delete PPE, you will need to combine two of them to delete the APP in most situation

### Using AWS Amplify Console 

1. Open the [AWS Amplify console](https://console.aws.amazon.com/amplify/)
2.  In the left navigation pane, choose the name of the application that you want to delete. The **App** page opens.
3. On the **App** page, select the **Actions** dropdown list. Then, choose **Delete app**.


**After that, if you still see your APP in the Amplify Console, you will need to use AWS CLI to completely delete the APP**

### Using AWS CLI

**Note:** If you receive errors when running AWS CLI commands, [make sure that you're using the most recent version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-troubleshooting.html).

Run the following [delete-app](https://docs.aws.amazon.com/cli/latest/reference/amplify/delete-app.html) AWS CLI command:

**Important:** Replace **your-app-id** with your application's App ID. Replace **application-region** with the AWS Region that your application is in.

```
`aws amplify delete-app --app-id <your-app-id> --region <application-region>`
```

## 
Set Up Notification For Example Panorama App 

When you use the **PPE Training feature** , and successfully have a graph.json in your s3 bucket, it will have an example app which will capture human and sent the messages to IOT → DynamoDB then to your **PPE Alert List, In order to successfully deploy the application, you must** 

* Deploy through PPE 
* When you are manually deploy through Panorama Console, please make sure your execution role has the following resource 
    ```json
        {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Action": [
                        "ssm:*",
                        "iot:*",
                        "s3:*",
                        "dynamodb:*",
                    ],
                    "Resource": "*"
                }
            ]
        }
    ```

## Common Error When Deploying 

The following errors will be seen in the **build logs** if you missed some of the steps above 

### Amplify Studio not enabled 

Make sure to **turn on the Amplify Studio** before you deploy the PPE, otherwise the error will pop up 

### access key is undefined

Make sure to name your env name other than **dev** 

### Build time out after deploying for 30 minutes

* When you are deploying for the first time, it will cost you approximately 35 - 60 minutes depend on your network situation, so set the time out to be more than 30 minutes will fix the problem

* If you see your Build Logs last line to be **“open at [xxxxxx.amplify.com](http://xxxxxx.amplify.com/) .....”,** try to start another APP which select the Github branch to be main, and select a different environment name



## Developer Doc

[Panorama MLOps Developer Installation document](https://github.com/hardco2020/aws-panorama-mlops/blob/main/DEVELOPER.md#installation-for-developer)

[Panorama MLOps Development Documents](https://github.com/hardco2020/aws-panorama-mlops/blob/main/DEVELOPER.md)
