export const breadcrumbItems =  (t,current, url1, url2)=>{
        console.log(current)
           console.log('test');  
        switch (current) {
            case "CameraMonitoring": 
                return [
                    {
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Monitoring"),
                        href: "/",
                    },
                    {
                        text: t("Camera Monitoring"),
                        href: "#",
                    }
    
    
                ];
            case "ExportEventDataSet":
                return [
                    {
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Alert Management"),
                        href: "/ExportEventDataSet",
                    },
                    {
                        text: t("Alert Export"),
                        href: "#",
                    }
    
    
                ];
            case "EventVerify":
                return [
                    {
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Alert Management"),
                        href: "/event_verify",
                    },
                    {
                        text: t("Alert Verify"),
                        href: "#",
                    }
                ];
            case "EventList":
                return [
                    {
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Alert Management"),
                        href: "/event",
                    },
                    {
                        text: t("Alert List"),
                        href: "#",
                    }
                ];
            case "InferenceList":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/InferenceList",
                    },
                    {
                        text: t("Inferene Result"),
                        href: "#",
                    }
                ];
            case "NewInferenceTask":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/InferenceList",
                    },
                    {
                        text: t("New Inference"),
                        href: "#",
                    }
                ];
            case "ExportDataSet":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/InferenceList",
                    },
                    {
                        text: t("Export Dataset"),
                        href: "#",
                    }
                ];
            case "job":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/InferenceList",
                    },
                    {
                        text: t("Inferene Result"),
                        href: url1,
                    },
                    {
                        text: t("Job Detail"),
                        href: "#",
                    }
                ];
            case "doc":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/InferenceList",
                    },
                    {
                        text: t("Inferene Result"),
                        href: url1,
                    },
                    {
                        text: t("Job Detail"),
                        href: url2,
                    },
                    {
                        text: t("Image"),
                        href: "#",
                    }
                ];
            case "TrainingList":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Model Training"),
                        href: "/TrainingList",
                    },
                    {
                        text: t("Training Result"),
                        href: "#",
                    }
                ];
            case "NewTrainingTask":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Model Training"),
                        href: '/NewTrainingTask',
                    },
                    {
                        text: t("New Training"),
                        href: "#",
                    }
                ];
            case "TrainingResult":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Model Training"),
                        href: "/TrainingList",
                    },
                    {
                        text: t("Model Result"),
                        href: url1,
                    },
                    {
                        text: t("Train Output Detail"),
                        href: "#",
                    }
                ];
            case "Main":
                return [{
                    text: t("Home"),
                    href: "/",
                }];
                // "items": [{
                //     "type": SideNavigationItemType.LINK,
                //     "text": t("Box Detect A"),
                //     "href": "/local_helmet"
                // },
                // {
                //     "type": SideNavigationItemType.LINK,
                //     "text": t("Box Detect B"),
                //     "href": "/local_helmet2"
                // },
            case "LocalA":
                return [{
                    text: t("Home"),
                    href: "/",
                },{
                    text:  t("Box Detect A"),
                    href: "/local_helmet",
                }];
            case "LocalB":
                return [{
                    text: t("Home"),
                    href: "/",
                },{
                    text:  t("Box Detect B"),
                    href: "/local_helmet2",
                }];
            case "Summary":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Dashboard"),
                        href: "/Summary",
                    },
                    {
                        text: t("Model Dashboard"),
                        href: "#",
                    },
                ];
            case "Summary2":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Dashboard"),
                        href: "/Summary2",
                    },
                    {
                        text: t("Alert Dashboard"),
                        href: "#",
                    },
                ];
            case "Verify":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Inference on Cloud"),
                        href: "/Verify",
                    },
                    {
                        text: t("Manual Verify"),
                        href: "#",
                    },
                ];
            case "DeploymentCfgList":
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                    {
                        text: t("Config"),
                        href: "/DeployConfig",
                    },
                    {
                        text: t("Deployment Config"),
                        href: "#",
                    },
                ];
            case "NewDeployForm":
                return [{
                    text: t("Home"),
                    href: "/",
                    },
                    {
                        text: t("Config"),
                        href: "/NewDeployConfig",
                    },
                    {
                        text: t("New Deployment Config"),
                        href: "#",
                    },
                ];
            case "ComponentVersionCfgList":{
                return [
                    {
                    text: t("Home"),
                    href: '/',
                    },
                    {
                        text: t("Config"),
                        href: '/ComponentConfig',
                    },
                    {
                    text: t('Component Config'),
                    href: url1,
                    },
                    {
                    text: t('Component Version Config'),
                    href: '#',
                    }
                ];
                }   
                case "NewComponentVersionConfig":{
                return [
                    {
                    text: t("Home"),
                    href: '/',
                    },
                    {
                        text: t("Config"),
                        href: '/ComponentConfig',
                    },
                    {
                    text: t('Component Version Config'),
                    href: url1,
                    },
                    {
                    text: t('#'),
                    href: '#',
                    }
                ];
                }   
                case "ComponentCfgList":{
                return [
                    {
                    text: t("Home"),
                    href: '/',
                    },
                    {
                        text: t("Config"),
                        href: '/ComponentConfig',
                    },
                    {
                    text: t('Component Config'),
                    href: '#',
                    }
                ];
                }    
                case "NewComponentConfig":{
                return [
                    {
                    text: t("Home"),
                    href: '/',
                    },
                    {
                        text: t("Config"),
                        href: '/NewComponentConfig',
                    },
                    {
                    text: t('New Component Config'),
                    href: '#',
                }
                ];
                }
                case "ModelVersionCfgList":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/ModelConfig',
                      },
                      {
                        text: t('Model Config'),
                        href: url1,
                      },
                      {
                        text: t('Model Version Config'),
                        href: '#',
                      }
                    ];
                  }   
                  case "NewModelVersionConfig":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/ModelConfig',
                      },
                      {
                        text: t('Model Version Config'),
                        href: url1,
                      },
                      {
                        text: t('New Model Version Config'),
                        href: '#',
                      }
                    ];
                  }   
                  case "ModelCfgList":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/ModelConfig',
                      },
                      {
                        text: t('Model Config'),
                        href: '#',
                      }
                    ];
                  }    
                  case "NewModelConfig":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/NewModelConfig',
                      },
                      {
                        text: t('New Model Config'),
                        href: '#',
                    }
                    ];
                  }
                  case "CameraCfgList":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/CameraConfig',
                      },
                      {
                        text: t('Camera Config'),
                        href: '#',
                      }
                    ];
                  }
                  case "NewCameraConfig":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/NewCameraConfig',
                      }, 
                      {
                        text: t('New Camera Config'),
                        href: '#',
                      }
                    ];
                  }
                  case "DeviceCfgList":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/DeviceConfig',
                      },
                      {
                        text: t('Device Config'),
                        href: '#',
                      }
                    ];
                  }
                  case "NewDeviceConfig":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Config"),
                          href: '/NewDeviceConfig',
                      },
                      {
                        text: t('New Device Config'),
                        href: '#',
                      }
                    ];
                  }
                  case "ModelManage":{
                    return [
                      {
                        text: t("Home"),
                        href: '/',
                      },
                      {
                          text: t("Training Result"),
                          href: '/TrainingList',
                      },
                      {
                        text: t('Application Details'),
                        href: '#',
                      }
                    ];
                  }
                  case "CloneModelConfig":{
                    return [
                        {
                          text: t("Home"),
                          href: '/',
                        },
                        {
                            text: t("Training Result"),
                            href: '/TrainingList',
                        },
                        {
                          text: t('Clone New Application'),
                          href: '#',
                        }
                      ];
                  }
                  case "NewApplicationConfig":{
                    return [
                        {
                          text: t("Home"),
                          href: '/',
                        },
                        {
                            text: t("Training Result"),
                            href: '/TrainingList',
                        },
                        {
                          text: t('Create New Application'),
                          href: '#',
                        }
                      ];
                  }
    
            default:
                return [{
                        text: t("Home"),
                        href: "/",
                    },
                ]
        }
}