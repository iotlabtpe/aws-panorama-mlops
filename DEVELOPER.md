# PPE Amplify Development Documents

Please first install the PPE with following instructions so you can have a developer environment on your local environment.

## Installation For Developer 

### Note:

* This a different set up than [README.md](https://github.com/hardco2020/aws-panorama-mlops/blob/main/README.md), if you wish to develop your own PPE, please use the following set up for your environm

* PPE only support one region for now which is  **ap-southeast-1**, make sure you have admin access for the region.
* You will need some basic knowledge of using **Terminal** and **AWS Console**
* We will be using Amplify Cli , and some of the git action during the way.

### Prerequisites:

* Have a Panorama device and a working Camera ( Data resource )  connected to your [Panorama Console](https://aws.amazon.com/panorama/)
* **Install amplify cli** and **Configure Amplify** by following the instructions on https://docs.amplify.aws/cli/start/install/
    * [Install Node.js®](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) if they are not already on your machine.
* Install **git** by following the instructions on **** [**https://github.com/git-guides/install-git**](https://github.com/git-guides/install-git)

### Install:

Install the PPE project by cloning the repository to your local machine

```
git clone [https://github.com/hardco2020/amplify-oneClick.git](https://github.com/hardco2020/aws-ppe-test1.git)
```

Heading to the root of the repository 

```
cd <your-repo-path>
```



### **Amplify configure**

Create an amplify IAM user for your account, type **amplify configure** in your terminal

```
amplify configure
```

It will automatically login to your AWS console if you already login. Back to the terminal and press enter

It will ask you to select region, please select ap-southeast-1 and fill in the user name you like 

Press Enter to continue


```
Specify the AWS Region
? region: ap-southeast-1
Specify the username of the new IAM user:
? user name: Amplify-Final-User
Complete the user creation using the AWS console
https://console.aws.amazon.com/iam/home?region=ap-southeast-1#/users$new?step=final&accessKey&userNames=Amplify-Final-User&permissionType=policies&policies=arn:aws:iam::aws:policy%2FAdministratorAccess-Amplify
```

After that it will lead you to create an Amplify IAM user,  **choose create policy** 
![](https://i.imgur.com/5Wco53a.png)

Choose **JSON**, and **enter the following json inside the field**
![](https://i.imgur.com/bqvHmZq.png)
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

Give the policy a random name, and attach it to the previous user you create 
<img width="795" alt="Screen Shot 2022-08-26 at 10 48 57 AM" src="https://user-images.githubusercontent.com/61721490/186806023-29fc5c67-af84-4950-bda4-9149b84d801a.png">

After that you will see an access key and the secret key like  below, **please don’t close the window yet** 

<img width="797" alt="Screen Shot 2022-08-26 at 10 50 03 AM" src="https://user-images.githubusercontent.com/61721490/186806076-93e88b53-0780-4d2e-aa32-cbc6a11e3164.png">



Then you can back to the terminal, and **press Enter to continue, then you will see the request to enter Access Key ID and Secret Key, Copy the key you just create in last step.**

```
Enter the access key of the newly created user:
? accessKeyId:  ********************
? secretAccessKey:  ****************************************
```

Enter a profile name you prefer, it will create a profile for your amplify cli

```
? Profile Name: finalTest
This would update/create the AWS Profile in your local machine
```

If you see the following message, congrats on finishing the amplify configure

```
Successfully set up the new user.
```



## Deploying

**Init the amplify**, and the system will ask if you want to use an existing environment, **select no**

```
amplify init

Note: It is recommended to run this command from the root of your app directory
? Do you want to use an existing environment? No
```


Enter a desired env name, remember this name, as it will be used for the later, **please name it other than  “dev”**

```
? Enter a name for the environment
```


Choose the **AWS Profile**

```
? Select the authentication method you want to use: (Use arrow keys)
Amplify Studio
❯ AWS profile
AWS access keys
```

Choose the one correspond to the IAM User you just create in **Configure Amplify**

```
? Please choose the profile you want to use (Use arrow keys)
plugins
codeartifact
default
test
❯ finalTest
```

It will initialize the resource on the cloud for you, if you go to your AWS Amplify Console, you can see the resource is created 
<img width="790" alt="Screen Shot 2022-08-26 at 10 50 52 AM" src="https://user-images.githubusercontent.com/61721490/186806171-5a910c06-104c-4bf5-8e2d-32a1cf82e62a.png">


Move to the custom resource

```
amplify/backend/custom/customResource291b215b/customResource291b215b-cloudformation-template.yaml
```

Replace the env Default name with your environment name.

```
env:
    Type: String
    Default: <Your own env name>
    Description: Please input your amplify env name !!!
```

<img width="790" alt="Screen Shot 2022-08-26 at 10 54 17 AM" src="https://user-images.githubusercontent.com/61721490/186806514-b3d74c13-96e9-4956-aea1-fe764d2c5c96.png">

Build the APP and Publish the whole stack to your backend 

```
npm install  // Build the Front-end app on the local environment
amplify publish  // Push the build Front-end app and your Back-end service to the Cloud
```

<img width="795" alt="Screen Shot 2022-08-26 at 10 56 52 AM" src="https://user-images.githubusercontent.com/61721490/186807827-36235872-cd48-4f27-bd9a-94cd9fdbe7dc.png">

Click into the website URL which shows at the end, your website will be deployed on the 



```
https://cra.link/deployment
The project was built assuming it is hosted at /.
You can control this with the homepage field in your package.json.

The build folder is ready to be deployed.
You may serve it with a static server:

npm install -g serve
serve -s build

Find out more about deployment here:

  https://cra.link/deployment

✔ Zipping artifacts completed.
✔ Deployment complete!

https://dev.d2bo2woks3a1xn.amplifyapp.com
```


After you successfully see your website, please **go to the AWS Amplify Console** and do one last setting. select your App, and select **Rewrite and redirects**

<img width="800" alt="Screen Shot 2022-08-26 at 10 58 53 AM" src="https://user-images.githubusercontent.com/61721490/186808299-74452777-ad0a-46e4-b90e-fcd9ce3dc2a6.png">


**Add Rewrites and redirects**

<img width="795" alt="Screen Shot 2022-08-26 at 11 00 02 AM" src="https://user-images.githubusercontent.com/61721490/186808400-9c4c8f92-d164-4c1e-b59f-de832b063db0.png">

Add the following text to each role like the pic below 

`</^[^.]+$|\.(?!(css|gif|ico|jpg|js|png|txt|svg|woff|woff2|ttf|map|json|webp)$)([^.]+$)/>`

`/index.html`

`200`

<img width="797" alt="Screen Shot 2022-08-26 at 11 01 01 AM" src="https://user-images.githubusercontent.com/61721490/186808508-0309a2db-288d-4d8a-901d-563640909366.png">

### **Congrats, you are done with the one click installation !!** 

## Prerequisites:

- Have a Panorama device and a working Camera ( Data resource ) connected to your [Panorama Console](https://aws.amazon.com/panorama/)

- **Install amplify cli** and **Configure Amplify** by following the instructions on https://docs.amplify.aws/cli/start/install/
  - [Install Node.js®](https://nodejs.org/en/download/) and [NPM](https://www.npmjs.com/get-npm) if they are not already on your machine.
- Install **git** by following the instructions on \***\* [**https://github.com/git-guides/install-git**](https://github.com/git-guides/install-git)
- Install **aws cli** by following the instructions on https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
- **Follow the instruction on [this doc](https://quip-amazon.com/ifLWAwqmEQbQ/PPE-Amplify-One-Click-Installation)to set up the PPE Amplify in your environment.**

## Structure for PPE

### Total Infrastructure

- Front-end : React
- Back-end : Python
- Infrastructure: Amplify, CloudFormation, Panorama application

You can see the following graph for the infrastructure and the tools we used.

https://design-inspector.a2z.com/?#IPPA_API

### About the Panorama Application

If you haven’t deployed any Panorama Application before, please follow the following workshop or videos to understand more about Panorama

Short Version:
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/20220718-govtec-sg/AWS+Panorama+Tutorial.pdf
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/20220718-govtec-sg/workshop-short-eng.mp4
Long Version:
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/AWS+Panorama+Workshop.pdf
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/Meeting+Recording+-+Re+Panorama+Workshop+-+Part1.mp4
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/Meeting+Recording+-+Re+Panorama+Workshop+-+Part2.mp4
https://panorama-workshop-2022-mandarin.s3.amazonaws.com/Meeting+Recording+-+Re+Panorama+Workshop+-+Part3.mp4

### Key Infrastructure ( From Deployment Perspective )

The key infrastructures for deployment are the following two resource, please make sure you are familiar with these two services and have the doc ready.

- [CloudFormation](https://docs.aws.amazon.com/cloudformation/index.html)
- [Amplify](https://docs.amplify.aws/)

![](https://i.imgur.com/3Y4vx6w.png)
As the graph above, we use amplify as our Full-stack infrastructure, but currently amplify only support you to create ApiGateway, DynamoDB and Lambda through CLI, so for the other resource, we will be using a resource call [Custom](https://docs.amplify.aws/cli/custom/cloudformation/), **which Amplify allows you to create your own resource by using CloudFormation**

## Common Development :

**The official Amplify doc are well written for most of the situations**, the below are the common commands when you are developing with the PPE Amplify project, you can find out more detail on the official doc to see how it’s done.

https://docs.amplify.aws/start/q/integration/js/

### Open a branch

https://docs.amplify.aws/cli/teams/overview/

Amplify use git to control the environment, so you can actually deploy multiple environment with different setting and merge them just like git.

```
amplify env add
amplify env checkout <branch>`
```

### Adding a new service ( API → Lambda → Database )

https://docs.amplify.aws/cli/restapi/restapi/#rest-endpoint-that-triggers-existing-lambda-functions

```
// You can replace it with api / function / storage
amplify add <resource>
```

- It will ask you to do a lot of setting, you just need to follow the steps and set the config you need for the service.

### Giving your Lambda access to other service

https://docs.amplify.aws/cli/function/

‘There are two ways for you to revise the access for Lambada, on the **amplify/backend/<function>**

- custom-policies.json
  - `[ { "Action": ["s3:CreateBucket"], "Resource": ["arn:aws:s3:::*"] } ]`
- <function>-cloudformation-template.json
  - Under the **"lambdaexecutionpolicy": { ... You can add your inline policy for the Lambda**

### Update the Resource

https://docs.amplify.aws/cli/function/
If you need to change any environment setting and name, use the following command.

```
// You can replace it with api/ function / storage / custom
amplify update <resource>
```

### Test on the local machine

https://docs.amplify.aws/cli/usage/mock/

You can use mock to see how’s the change work when you revise it on your local environment without have to deploy to find out what happen. you can **edit the event.json to simulate what will be passed to the Lambda Function**

```
// You can replace it with api/ function / storage
amplify mock <resource>
```

### Adding a special infrastructure

If you need to have a structure other than API/ Lambda / DynamoDB, then you need add a custom resource, you can choose either **CDK or CloudFormation**

```
amplify add custom
```

After you add a custom resource, **you will have to rely on CloudFormation and CDK** to create the infrastructure for you

## Command error when developing ( 坑 )

### 502/500 Error Cross-Origin Request Blocked when calling API

- This is actually **not a [CROS](https://developer.mozilla.org/zh-TW/docs/Web/HTTP/CORS) error,** what usually happen is **your Lambda crashed for some reason,** this will cause Amplify to return such error, so make sure to check your Lambda first, before you go for the cross origin error.
- When you are writing lambda return json, make sure to attach header like the following, as this will also cause the above error
  ```
   'statusCode': response['ResponseMetadata']['HTTPStatusCode'],
     'body': body['camera_id'],
     'headers': {
         "Access-Control-Allow-Headers" : "*",
         'Access-Control-Allow-Origin': '*',
         'Access-Control-Allow-Headers': '*',
     }
  ```

### Camera Lambda return An error occurred (ConflictException) when calling the CreateNodeFromTemplateJob operation:

- When you have a fresh new account, you have to go to [AWS Panorama console](https://aws.amazon.com/panorama/) , and **there will be an alert asking if you want to allow other resource to access Panorama**, press Yes and then try the Lambda again

