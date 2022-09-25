## How to use Panorama MLOPs

The following will teach you how to deploy **a Human Detector APP on Panorama and monitor the results using Panorama MLOps** 

### Upload a sample application to Panorama MLOps 

Click on **Stored Application** on the left menu, the below table will have one default app which is **ppe_panorama_app.zip**

If you wish to upload other application, just click on **New Application**



<img width="1788" alt="Screen Shot 2022-09-25 at 7 13 43 PM" src="https://user-images.githubusercontent.com/61721490/192140720-7e3cbf72-66ec-45e7-a367-4c1792bb5088.png">


Choose **uri** and then put the **bucket uri** where you put your zip file of application at

**Remember to zip the folder of application**

<img width="1780" alt="Screen Shot 2022-09-25 at 7 13 33 PM" src="https://user-images.githubusercontent.com/61721490/192140709-caeb31d2-7e51-46fc-b76f-4cdb17e4d459.png">




### Start training a sample application for your Panorama

Click on **Packaged Application** on the left menu, the below table will be empty when you first deploy the PPE 

<img width="1788" alt="Screen Shot 2022-08-24 at 2 24 28 PM" src="https://user-images.githubusercontent.com/61721490/186345931-8bb9e5d3-c597-4656-9f90-7dac6f0c6265.png">

Click on **New training, and just click on Submit,** we don’t have to input anything dataset for our sample APP

<img width="1784" alt="Screen Shot 2022-08-24 at 2 25 16 PM" src="https://user-images.githubusercontent.com/61721490/186345986-ed905df5-82e9-486c-bd86-3f8f6d3fd98d.png">


After that you will **see a field with training icon in your application, it means the training begin**, you can do other steps and come back after the training finished 

![Screen Shot 2022-08-29 at 1 37 15 PM](https://user-images.githubusercontent.com/61721490/187130256-d8e42f11-1027-4ba8-9d7a-c9c6beacd18e.png)

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
