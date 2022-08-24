# PPE Amplify Development Documents

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

