export const navigationItems = (t) => {
    const results = [{
            type : "expandable-link-group",
            text: t("Monitoring") ,
            items: [
                {
                    "type": "link",
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
            "type": "expandable-link-group",
            "text": t("Model Training"),
            "expanded": true,
            "items": [
                // {
                //     "type": SideNavigationItemType.LINK,
                //     "text": t("New Training"),
                //     "href": "/NewTrainingTask"
                // },
                {
                    "type": "link",
                    "text": t("Training Result"),
                    "href": "/TrainingList"
                },
            ]
        },
        {
        "type": "expandable-link-group",
        "text": t("Alert Management"),
        "expanded": true,
        "items": [{
                "type": "link",
                "text": t("Alert List"),
                "href": "/event"
            },
            {
                "type": "link",
                "text": t("Alert Verify"),
                "href": "/event_verify"
            },
            {
                "type": "link",
                "text": t("Alert Export"),
                "href": "/ExportEventDataSet"
            },
        ]
        },
        {
        "type": "expandable-link-group",
        "text": t("Config"),
        "expanded": true,
        "items": [
        {
            "type": "link",
            "text": t("Deployment Config"),
            "href": "/DeployConfig"
        },
        //   {
        //     "type": "link",
        //     "text": t("Component Config"),
        //     "href": "/ComponentConfig"
        //   },
        //   {
        //     "type": "link",
        //     "text": t("Model Config"),
        //     "href": "/ModelConfig"
        //   },
        {
            "type": "link",
            "text": t("Device Config"),
            "href": "/DeviceConfig"
        },
        {
            "type": "link",
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
    return results
}