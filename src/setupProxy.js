const { createProxyMiddleware } = require('http-proxy-middleware'); 
// const config = require('../bak/config');
const base_url = process.env.API_GATEWAY_PROD_ENDPOINT
console.log('base_url: ' + base_url)
console.log('base_url: ' + base_url)
console.log('base_url: ' + base_url)

console.log(process.env)

// http://spot-bot-1086976796.ap-southeast-1.elb.amazonaws.com/_plugin/kibana/app/kibana

module.exports = function(app) {
    app.use(createProxyMiddleware('/save_event_verified_result', {
        target: base_url + '/event',
        // target: config.api_save,
        pathRewrite: {
            '^/save_event_verified_result': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    })); 

    app.use(createProxyMiddleware('/dashboard', {
        target: base_url + '/dashboard',
        // target: config.api_save,
        pathRewrite: {
            '^/dashboard': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));   

    // app.use(createProxyMiddleware('/camera_event', {
    //     target: base_url + '/ppe_monitoring/event',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/camera_event': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));    

    app.use(createProxyMiddleware('/ppe_monitoring', {
        target: base_url + '/ppe_monitoring',
        // target: config.api_save,
        pathRewrite: {
            '^/ppe_monitoring': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));

    
    // app.use(createProxyMiddleware('/deployment', {
    //     target: base_url + '/deployment',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/deployment': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));


    // app.use(createProxyMiddleware('/cfg_camera', {
    //     target: base_url + '/cfg_camera',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/cfg_camera': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));


    app.use(createProxyMiddleware('/component', {
        target: base_url + '/component',
        // target: config.api_save,
        pathRewrite: {
            '^/component': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));


    
    // app.use(createProxyMiddleware('/component_ver', {
    //     target: base_url + '/component/version',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/component_ver': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));


    app.use(createProxyMiddleware('/cfg_model', {
        target: base_url + '/cfg_model',
        // target: config.api_save,
        pathRewrite: {
            '^/cfg_model': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));


    // app.use(createProxyMiddleware('/cfg_model_ver', {
    //     target: base_url + '/cfg_model_ver',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/cfg_model_ver': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));
    

    app.use(createProxyMiddleware('/cfg_device', {
        target: base_url + '/cfg_device',
        // target: config.api_save,
        pathRewrite: {
            '^/cfg_device': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));

    app.use(createProxyMiddleware('/cfg_device', {
        target: base_url + '/cfg_device',
        // target: config.api_save,
        pathRewrite: {
            '^/cfg_device': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));


    app.use(createProxyMiddleware('/save_event_result', {
        target: base_url + '/export/event',
        // target: config.api_save,
        pathRewrite: {
            '^/save_event_result': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));

    app.use(createProxyMiddleware('/list_event', {
        target: base_url + '/event',
        // target: config.api_save,
        pathRewrite: {
            '^/list_event': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));

    app.get('/env', (req, res) => {
        const result = {
            UserPool:process.env.UserPool,
            UserPoolClient:process.env.UserPoolClient,
            UserPoolDomain:process.env.UserPoolDomain,
            CallbackURL:process.env.CallbackURL,
            LogoutURL:process.env.LogoutURL,
            CognitoRegion:process.env.CognitoRegion
        }
        res.send(result)
    })

    app.get('/env_kb', (req, res) => {
        const result = {
            ESKibana:process.env.ESKibana,
            ESKibana2:process.env.ESKibana2,
            gw:process.env
        }
        res.send(result)
    })

    // app.use(createProxyMiddleware('/listmodel', {
    //     target: base_url + '/model',
    //     // target: config.api_save,
    //     pathRewrite: {
    //         '^/listmodel': '',
    //     },
    //     changeOrigin: true,
    //     secure: false, 
    //     ws: false, 
    // }));
    
    app.use(createProxyMiddleware('/save_inference_result', {
        target: base_url + '/export/data',
        // target: config.api_save,
        pathRewrite: {
            '^/save_inference_result': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));
    app.use(createProxyMiddleware('/create_trainjob', {
        target: base_url + '/model',
        // target: config.api_save,
        pathRewrite: {
            '^/create_trainjob': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));
    app.use(createProxyMiddleware('/listinference', {
        target: base_url + '/inference',
        // target: config.api_save,
        pathRewrite: {
            '^/listinference': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));

    app.use(createProxyMiddleware('/create_inference_job', {
        target: base_url + '/inference',
        // target: config.api_save,
        pathRewrite: {
            '^/create_inference_job': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));    

    app.use(createProxyMiddleware('/get_job_detail', {
        target: base_url + '/inference/job',
        // target: config.api_save,
        pathRewrite: {
            '^/get_job_detail': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));    

    app.use(createProxyMiddleware('/get_meta', {
        target: base_url + '/meta',
        // target: config.api_save,
        pathRewrite: {
            '^/get_meta': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    })); 

    // 
    app.use(createProxyMiddleware('/save_verified_result', {
        target: base_url + '/inference/doc',
        // target: config.api_save,
        pathRewrite: {
            '^/save_verified_result': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    })); 

    app.use(createProxyMiddleware('/get_doc', {
        target: base_url + '/inference/doc',
        // target: config.api_save,
        pathRewrite: {
            '^/get_doc': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));     

    app.use(createProxyMiddleware('/byob', {
        target: base_url + '/byob',
        // target: config.api_save,
        pathRewrite: {
            '^/byob': '',
        },
        changeOrigin: true,
        secure: false, 
        ws: false, 
    }));    

};
