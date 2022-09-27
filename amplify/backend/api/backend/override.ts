// This file is used to override the REST API resources configuration
import { AmplifyApiRestResourceStackTemplate } from '@aws-amplify/cli-extensibility-helper';

export function override(resources: AmplifyApiRestResourceStackTemplate) {
    resources.restApi.addPropertyOverride("Body",{
        ...resources.restApi.body,
        'x-amazon-apigateway-request-validators' : {
            'Validate body' : {
              validateRequestParameters : false,
              validateRequestBody : true
            }
          }
        }
    ) 
    resources.restApi.addPropertyOverride("Body.definitions", {
        postCameraSchema: {
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Post Camera schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'cameraName', 
                'username',
                'password',
                'streamUrl'
            ],
            additionalProperties: false,
            properties: {
                cameraName: {
                    type: 'string',
                    title: 'The ModelName',
                    maxLength: 100
                },
                username: {
                    type: 'string',
                    title: 'The username',
                    maxLength: 100
                },
                password: {
                    type: 'string',
                    title: 'The password',
                    maxLength: 100
                },
                streamUrl: {
                    type: 'string',
                    title: 'The streamUrl',
                    maxLength: 100
                }
            }
        },
        deleteCameraSchema: {
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Delete Camera schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'PackageId'
            ],
            additionalProperties: false,
            properties: {
                PackageId: {
                    type: 'string',
                    title: 'The packageId',
                    maxLength: 100
                },
            }
        },
        createDeploymentSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Create Deployment schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'cameraNames',
                'deviceId',
                'deploymentName',
                'targetArn'
            ],
            additionalProperties: false,
            properties: {
                cameraNames: {
                    type: 'string',
                    title: 'The cameraNames',
                    maxLength: 100
                },
                deviceId:{
                    type: 'string',
                    title: 'The deviceId',
                    maxLength: 100
                },
                deploymentName:{
                    type: 'string',
                    title: 'The deploymentName',
                    maxLength: 100
                },
                targetArn:{
                    type: 'string',
                    title: 'The targetArn',
                    maxLength: 100
                }
            }
        },
        deleteDeploymentSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Delete Deployment schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'ApplicationInstanceId'
            ],
            additionalProperties: false,
            properties: {
                ApplicationInstanceId: {
                    type: 'string',
                    title: 'The ApplicationInstanceId',
                    maxLength: 100
                }
            }
        },
        exportEventSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Export event schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'type',
                's3uri'
            ],
            additionalProperties: false,
            properties: {
                type: {
                    type: 'string',
                    title: 'The type',
                    maxLength: 100
                },
                s3uri: {
                    type: 'string',
                    title: 'The s3uri',
                    maxLength: 100
                }
            }
        },
        invokeStepSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Invoke step functions schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'inputS3BucketName',
                'storedApplication'
            ],
            additionalProperties: false,
            properties: {
                inputS3BucketName: {
                    type: 'string',
                    title: 'The inputS3BucketName',
                    maxLength: 100
                },
                storedApplication: {
                    type: 'string',
                    title: 'The storedApplication',
                    maxLength: 100
                }
            }
        },
        createStoredApplicationSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Create Stored Application schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'uploadMethod',
                'copyUri'
            ],
            additionalProperties: false,
            properties: {
                uploadMethod: {
                    type: 'string',
                    title: 'The uploadMethod',
                    maxLength: 100
                },
                copyUri: {
                    type: 'string',
                    title: 'The copyUri',
                    maxLength: 100
                }
            }
        },
        // deleteStoredApplicationSchema:{
        //     $schema: 'http://json-schema.org/draft-07/schema',
        //     type: 'object',
        //     title: 'Create Stored Application schema',
        //     description: 'The root schema comprises the entire JSON document.',
        //     required: [
        //         'uploadMethod',
        //         'copyUri'
        //     ],
        //     additionalProperties: false,
        //     properties: {
        //         uploadMethod: {
        //             type: 'string',
        //             title: 'The uploadMethod',
        //             maxLength: 100
        //         },
        //         copyUri: {
        //             type: 'string',
        //             title: 'The copyUri',
        //             maxLength: 100
        //         }
        //     }
        // },
        verifyEventSchema:{
            $schema: 'http://json-schema.org/draft-07/schema',
            type: 'object',
            title: 'Create Stored Application schema',
            description: 'The root schema comprises the entire JSON document.',
            required: [
                'CameraID',
                'TimeStamp',
                'device_id',
                'ack_bbox_person',
                'ack_date_person'

            ],
            additionalProperties: false,
            properties: {
                CameraID: {
                    type: 'string',
                    title: 'The CameraID',
                    maxLength: 100
                },
                TimeStamp: {
                    type: 'number',
                    title: 'The TimeStamp',
                    maxLength: 100
                },
                ack_bbox_person: {
                    type: 'array',
                    title: 'The ack_bbox_person',
                    maxLength: 100
                },
                device_id: {
                    type: 'string',
                    title: 'The device_id',
                    maxLength: 100
                },
                ack_date_person: {
                    type: 'string',
                    title: 'The ack_date_person',
                    maxLength: 100
                }
            }
        }
    })
    
    const postCameraPath = '/postCamera'
    resources.restApi.addPropertyOverride(`Body.paths.${postCameraPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "postCameraSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/postCameraSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${postCameraPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[postCameraPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )

    const deleteCameraPath = '/deleteCamera'
    resources.restApi.addPropertyOverride(`Body.paths.${deleteCameraPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "deleteCameraSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/deleteCameraSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${deleteCameraPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[deleteCameraPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )

    const createDeploymentPath = '/createDeployment'
    resources.restApi.addPropertyOverride(`Body.paths.${createDeploymentPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "createDeploymentSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/createDeploymentSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${createDeploymentPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[createDeploymentPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )
    
    const deleteDeploymentPath = '/deleteDeployment'
    resources.restApi.addPropertyOverride(`Body.paths.${deleteDeploymentPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "deleteDeploymentSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/deleteDeploymentSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${deleteDeploymentPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[deleteDeploymentPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )

    const exportEventPath = '/exportEvent'
    resources.restApi.addPropertyOverride(`Body.paths.${exportEventPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "exportEventSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/exportEventSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${exportEventPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[exportEventPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )
    
    const invokeStepPath = '/invokeStep'
    resources.restApi.addPropertyOverride(`Body.paths.${invokeStepPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "invokeStepSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/invokeStepSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${invokeStepPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[invokeStepPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )

    const createStoredApplicationPath = '/createStoredApplication'
    resources.restApi.addPropertyOverride(`Body.paths.${createStoredApplicationPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "createStoredApplicationSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/createStoredApplicationSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${createStoredApplicationPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[createStoredApplicationPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )
    
    const verifyEventPath = '/verifyEvent'
    resources.restApi.addPropertyOverride(`Body.paths.${verifyEventPath}.x-amazon-apigateway-any-method.parameters`,[
        {
          name: "verifyEventSchema",
          in: "body",
          required: true,
          schema: { '$ref': '#/definitions/verifyEventSchema' }
        },
      ]
    )

    resources.restApi.addPropertyOverride(`Body.paths.${verifyEventPath}.x-amazon-apigateway-any-method`,{
        ...resources.restApi.body.paths[verifyEventPath]["x-amazon-apigateway-any-method"],
        'x-amazon-apigateway-request-validator' : "Validate body"}
    )
    
}
