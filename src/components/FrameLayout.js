
import React from 'react';
import { connect } from 'react-redux'
// import menuUtils from '../lib/menuUtils' 
import AppLayout from 'aws-northstar/layouts/AppLayout';
import SideNavigation from 'aws-northstar/components/SideNavigation';
import BreadcrumbGroup from 'aws-northstar/components/BreadcrumbGroup';
import { withTranslation } from 'react-i18next'
import Link from 'aws-northstar/components/Link';
import Box from 'aws-northstar/layouts/Box';
import Button from 'aws-northstar/components/Button';
import ButtonDropdown from 'aws-northstar/components/ButtonDropdown';
import Header from 'aws-northstar/components/Header';

import { SideNavigationItemType } from 'aws-northstar/components/SideNavigation';

const mapStateToProps = state => {
    return { session: state.session }
}

const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key) => dispatch({ type: 'change_language', data: key })
    }
}

class FrameLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    navigationItems(t) {
        const result = [{
            "type": SideNavigationItemType.LINK,
            "text": t("Monitoring"),
            "expanded": true,
            "items": [
                {
                    "type": SideNavigationItemType.LINK,
                    "text": t("Camera Monitoring"),
                    "href": "/"
                },
            ]
        },
        // [{
        //     "type": SideNavigationItemType.LINK,
        //     "text": t("Local Inference") ,
        //     "expanded": true,
        //     "items": [
        //         {
        //             "type": SideNavigationItemType.LINK,
        //             "text": t("Box Detect A"),
        //             "href": "/local_helmet"
        //         },
        //         {
        //             "type": SideNavigationItemType.LINK,
        //             "text": t("Box Detect B"),
        //             "href": "/local_helmet2"
        //         },
        //     ]
        // },
        {
            "type": SideNavigationItemType.LINK,
            "text": t("Application"),
            "expanded": true,
            "items": [
                {
                    "type": SideNavigationItemType.LINK,
                    "text": t("Deployment Config"),
                    "href": "/DeployConfig"
                },
                {
                    "type": SideNavigationItemType.LINK,
                    "text": t("Training Result"),
                    "href": "/TrainingList"
                },
            ]
        },
        // {
        //     "type": SideNavigationItemType.LINK,
        //     "text": t("Inference on Cloud"),
        //     "expanded": true,
        //     "items": [{
        //             "type": SideNavigationItemType.LINK,
        //             "text": t("New Inference"),
        //             "href": "/NewInferenceTask"
        //         },
        //         {
        //             "type": SideNavigationItemType.LINK,
        //             "text": t("Manual Verify"),
        //             "href": "/Verify"
        //         },
        //         {
        //             "type": SideNavigationItemType.LINK,
        //             "text": t("Export Dataset"),
        //             "href": "/ExportDataSet"
        //         },
        //     ]
        // },
        {
            "type": SideNavigationItemType.LINK,
            "text": t("Alert Management"),
            "expanded": true,
            "items": [{
                "type": SideNavigationItemType.LINK,
                "text": t("Alert List"),
                "href": "/event"
            },
            {
                "type": SideNavigationItemType.LINK,
                "text": t("Alert Verify"),
                "href": "/event_verify"
            },
            {
                "type": SideNavigationItemType.LINK,
                "text": t("Alert Export"),
                "href": "/ExportEventDataSet"
            },
            ]
        },
        {
            "type": SideNavigationItemType.LINK,
            "text": t("Config"),
            "expanded": true,
            "items": [
                //   {
                //     "type": SideNavigationItemType.LINK,
                //     "text": t("Component Config"),
                //     "href": "/ComponentConfig"
                //   },
                //   {
                //     "type": SideNavigationItemType.LINK,
                //     "text": t("Model Config"),
                //     "href": "/ModelConfig"
                //   },
                {
                    "type": SideNavigationItemType.LINK,
                    "text": t("Device Config"),
                    "href": "/DeviceConfig"
                },
                {
                    "type": SideNavigationItemType.LINK,
                    "text": t("Camera Config"),
                    "href": "/CameraConfig"
                }
            ]
        },
            // {
            //     "type": SideNavigationItemType.LINK,
            //     "text": t("Dashboard"),
            //     "expanded": true,
            //     "items": [
            //         // {
            //         //     "type": SideNavigationItemType.LINK,
            //         //     "text": t("Model Dashboard"),
            //         //     "href": "/Summary"
            //         // },
            //         {
            //             "type": SideNavigationItemType.LINK,
            //             "text": t("Alert Dashboard"),
            //             "href": "/Summary2"
            //         },
            //     ]
            // },
            // {
            //     "type": SideNavigationItemType.LINK,
            //     "text": t("QRCode"),
            //     "href": "/QRCode"
            // },
            // 
            //   "type": SideNavigationItemType.LINK,
            //   "text": t("Sign Out"),
            //   "href": "/SignOut"
            // },   
        ];

        return result
    }

    breadcrumbItems(t, current, url1, url2) {
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
                    text: t("Application"),
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
                }, {
                    text: t("Box Detect A"),
                    href: "/local_helmet",
                }];
            case "LocalB":
                return [{
                    text: t("Home"),
                    href: "/",
                }, {
                    text: t("Box Detect B"),
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
                    text: t("Application"),
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
            case "ComponentVersionCfgList": {
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
            case "NewComponentVersionConfig": {
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
            case "ComponentCfgList": {
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
            case "NewComponentConfig": {
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
            case "ModelVersionCfgList": {
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
            case "NewModelVersionConfig": {
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
            case "ModelCfgList": {
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
            case "NewModelConfig": {
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
            case "CameraCfgList": {
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
            case "NewCameraConfig": {
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
            case "DeviceCfgList": {
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
            case "NewDeviceConfig": {
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

            default:
                return [{
                    text: t("Home"),
                    href: "/",
                },
                ]
        }
    }
    jump_to_panorama(d) {
        if (d === 'device') {
            window.location.href = "https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#devices"
        }
        else if (d === 'camera') {
            window.location.href = "https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#data-sources"
        }
        else if (d === 'application') {
            window.location.href = "https://ap-southeast-1.console.aws.amazon.com/panorama/home?region=ap-southeast-1#deployed-applications"
        }
    }

    render() {
        const {
            props: { t, breadcrumb, url1, url2 }
        } = this;

        const menuItems = [
            { text: 'English', onClick: () => this.props.changeLang('en') },
            { text: '简体中文', onClick: () => this.props.changeLang('zh') },
            { text: '繁體中文', onClick: () => this.props.changeLang('zh_tw') }
        ];
        const PanoramaItems = [
            { text: 'Camera', onClick: () => this.jump_to_panorama('camera') },
            { text: 'Device', onClick: () => this.jump_to_panorama('device') },
            { text: 'Application', onClick: () => this.jump_to_panorama('application') }
        ]

        const _header = <Header
            title={t("Out of Box AI Demo")}
            rightContent={

                <Box alignItems="center" display="flex" >
                    <ButtonDropdown content="Panorama" items={PanoramaItems} darkTheme />
                    <ButtonDropdown content={t('lang')} items={menuItems} darkTheme />
                </Box>
            }
        />
        const _header_side = {
            href: "/",
            text: 'PPE Detector Demo'
        }



        const navigation = <SideNavigation header={_header_side} items={this.navigationItems(t)} />
        const breadcrumbGroup = <BreadcrumbGroup items={this.breadcrumbItems(t, breadcrumb, url1, url2)} />

        const mainContent = this.props.component
        return (
            <AppLayout
                header={_header}
                navigation={navigation}
                breadcrumbs={breadcrumbGroup}
            >
                {mainContent}
            </AppLayout>
        )
    }
}

export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(FrameLayout));


