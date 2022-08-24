import Mock from 'mockjs'

Mock.setup({
   timeout: '200-600'
})

// export default Mock.mock('/test1','GET',
//     ['mock create training  create_trainjob job']
// )

// const data = Mock.mock({
//     "list|20-60": [
//       {
//         "id": '@increment(1)',
//         "title": "@ctitle",
//         "content": "@cparagraph",
//         "add_time": "@date(yyyy-MM-dd hh:mm:ss)"
//       }
//     ]
//   })

const mock_model = {
        'name': 'test123',
        'size': 6,
        'cost': 5353,
        'status': 1,
}



Mock.mock('/test1', 'get', (options) => {
    // let body = JSON.parse(options.body)
    
    // data.list.push(Mock.mock({
    //   "id": '@increment(1)',
    //   "title": '123',
    //   "content": 'test',
    //   "add_time": "@date(yyyy-MM-dd hh:mm:ss)"
    // }))
  
    return {
      status: 200,
      message: 'Return successful',
      data: mock_model
    }
  })
// export default [
 Mock.mock('/listmodel','get',
    [
        {
           "endpoint.endpoint_name" : "mtr-xieyongliang-2021-08-30-22-58-45",
           "trainingjob.model_data_url" : "s3://sagemaker-us-west-2-034068151705/mtr-xieyongliang-2021-08-30-22-58-45/output/model.tar.gz",
           "trainingjob.status" : "InProgress",
           "model_name" : "mtr-xieyongliang-2021-08-30-22-58-45",
           "trainingjob.training_start_time" : "2021-08-30 23:01:08",
           "endpoint.creation_time" : "2021-08-31 02:17:16",
           "model.creation_time" : "2021-08-31 02:17:13",
           "endpoint.status" : "InProgress",
           "trainingjob.name" : "mtr-xieyongliang-2021-08-30-22-58-45",
           "endpoint.last_modified_time" : "2021-08-31 02:29:31",
           "endpointconfig.creation_time" : "2021-08-31 02:17:14",
           "trainingjob.training_end_time" : "2021-08-31 02:17:08",
           "stage" : "endpoint",//training job -> model -> ep-config -> endpoint 
           "trainingjob.creation_time" : "2021-08-30 22:58:46"
        },
        {
           "endpoint.status" : "InService",
           "model.creation_time" : "2021-08-30 17:08:57",
           "trainingjob.name" : "mtr-xieyongliang-2021-08-30-13-50-12",
           "model_name" : "mtr-xieyongliang-2021-08-30-13-50-12",
           "trainingjob.status" : "Completed",
           "trainingjob.training_start_time" : "2021-08-30 13:52:41",
           "endpoint.creation_time" : "2021-08-30 17:09:00",
           "trainingjob.model_data_url" : "s3://sagemaker-us-west-2-034068151705/mtr-xieyongliang-2021-08-30-13-50-12/output/model.tar.gz",
           "endpoint.endpoint_name" : "mtr-xieyongliang-2021-08-30-13-50-12",
           "trainingjob.creation_time" : "2021-08-30 13:50:12",
           "trainingjob.training_end_time" : "2021-08-30 17:08:51",
           "stage" : "endpoint",
           "endpointconfig.creation_time" : "2021-08-30 17:08:58",
           "endpoint.last_modified_time" : "2021-08-30 17:22:19"
        },
        {
           "trainingjob.status" : "Completed",
           "model_name" : "mtr-xieyongliang-2021-09-02-00-42-22",
           "trainingjob.training_start_time" : "2021-09-02 00:46:01",
           "endpoint.creation_time" : "2021-09-02 04:01:30",
           "endpoint.status" : "InService",
           "model.creation_time" : "2021-09-02 04:01:27",
           "trainingjob.name" : "mtr-xieyongliang-2021-09-02-00-42-22",
           "endpoint.endpoint_name" : "mtr-xieyongliang-2021-09-02-00-42-22",
           "trainingjob.model_data_url" : "s3://sagemaker-us-west-2-034068151705/mtr-xieyongliang-2021-09-02-00-42-22/output/model.tar.gz",
           "trainingjob.training_end_time" : "2021-09-02 04:01:18",
           "stage" : "endpoint",
           "trainingjob.creation_time" : "2021-09-02 00:42:23",
           "endpointconfig.creation_time" : "2021-09-02 04:01:28",
           "endpoint.last_modified_time" : "2021-09-02 04:14:50"
        },
        {
           "trainingjob.model_data_url" : "s3://sagemaker-us-west-2-034068151705/mtr-xieyongliang-2021-08-30-22-59-39/output/model.tar.gz",
           "endpoint.endpoint_name" : "mtr-xieyongliang-2021-08-30-22-59-39",
           "endpoint.status" : "InService",
           "model.creation_time" : "2021-08-31 02:18:04",
           "trainingjob.name" : "mtr-xieyongliang-2021-08-30-22-59-39",
           "model_name" : "mtr-xieyongliang-2021-08-30-22-59-39",
           "trainingjob.status" : "Completed",
           "trainingjob.training_start_time" : "2021-08-30 23:02:19",
           "endpoint.creation_time" : "2021-08-31 02:18:06",
           "endpoint.last_modified_time" : "2021-08-31 02:30:30",
           "endpointconfig.creation_time" : "2021-08-31 02:18:05",
           "trainingjob.creation_time" : "2021-08-30 22:59:40",
           "trainingjob.training_end_time" : "2021-08-31 02:17:59",
           "stage" : "endpoint"
        }
     ]

)

// Mock.mock('/create_trainjob','POST',
//     ['mock create training  create_trainjob job']
// ),

// Mock.mock('/model','POST',
//     ['mock create training job']
// )

// ]
