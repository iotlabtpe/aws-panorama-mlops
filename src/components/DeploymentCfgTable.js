import Table from 'aws-northstar/components/Table';
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Modal from 'aws-northstar/components/Modal';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'

import axios from 'axios'
import { API } from 'aws-amplify';

import { withTranslation } from 'react-i18next'
const mapStateToProps = state => {
    return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key) => dispatch({ type: 'change_language', data: key })
    }
}

const columnDefinitions = [
    {
        'id': 'ApplicationInstanceId',
        width: 200,
        Header: 'Applicatino ID',
        accessor: 'ApplicationInstanceId'
    },
    {
        'id': 'Name',
        width: 300,
        Header: 'Applicaiton Name',
        accessor: 'Name'
    },
    {
        'id': 'DefaultRuntimeContextDeviceName',
        width: 200,
        Header: 'Device ID',
        accessor: 'DefaultRuntimeContextDeviceName'
    },
    {
        'id': 'HealthStatus',
        width: 200,
        Header: 'Health Status',
        accessor: 'HealthStatus',
        Cell: ({ row }) => {
            if (row && row.original) {
                const status = row.original.HealthStatus;
                switch (status) {
                    case 'RUNNING':
                        return <StatusIndicator statusType='positive'>{status}</StatusIndicator>;
                    case 'ERROR':
                        return <StatusIndicator statusType='negative'>{status}</StatusIndicator>;
                    case 'NOT_AVAILABLE':
                        return <StatusIndicator statusType='warning'>{status}</StatusIndicator>;
                    default:
                        return <StatusIndicator statusType='negative'>{status}</StatusIndicator>;
                }
            }
            return null;
        }
    },
    // {
    //     'id': 'Camera_ID',
    //     width: 200,
    //     Header: 'Camera ID',
    //     accessor: 'Camera_ID'
    // },
    // {
    {
        'id': 'Status',
        width: 400,
        Header: 'Status',
        accessor: 'Status',
        Cell: ({ row }) => {
            if (row && row.original) {
                const status = row.original.Status;
                switch (status) {
                    case 'DEPLOYMENT_PENDING':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'DEPLOYMENT_REQUESTED':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'DEPLOYMENT_IN_PROGRESS':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'DEPLOYMENT_ERROR':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'DEPLOYMENT_SUCCEEDED':
                        return <StatusIndicator statusType='positive'>{status}</StatusIndicator>;
                    case 'REMOVAL_PENDING':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'REMOVAL_REQUESTED':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'REMOVAL_IN_PROGRESS':
                        return <StatusIndicator statusType='info'>{status}</StatusIndicator>;
                    case 'REMOVAL_FAILED':
                        return <StatusIndicator statusType='negative'>{status}</StatusIndicator>;
                    case 'REMOVAL_SUCCEEDED':
                        return <StatusIndicator statusType='warning'>{status}</StatusIndicator>;
                    case 'DEPLOYMENT_FAILED':
                        return <StatusIndicator statusType='negative'>{status}</StatusIndicator>;
                    default:
                        return <StatusIndicator statusType='negative'>{status}</StatusIndicator>;
                }
            }
            return null;
        }
    },
    // {
    //     'id': 'Arn',
    //     width: 500,
    //     Header: 'Arn',
    //     accessor: 'Arn'
    // },
    // {
    //     'id': 'targetArn',
    //     width: 300,
    //     Header: 'Arn',
    //     accessor: 'targetArn'
    // },
    {
        'id': 'CreatedTime',
        width: 200,
        Header: 'Created Time',
        accessor: 'CreatedTime'
    },
    // {
    //     'id': 'components',
    //     width: 600,
    //     Header: 'CFG-Components',
    //     accessor: 'components'
    // },
    // {
    //     'id': 'deploymentPolicies',
    //     width: 600,
    //     Header: 'CFG-Policy',
    //     accessor: 'deploymentPolicies'
    // },
    // {
    //     'id': 'iotJobConfigurations',
    //     width: 600,
    //     Header: 'CFG-IoTJob',
    //     accessor: 'iotJobConfigurations'
    // },
]


const DeploymentCfgTable = ({ t, changeLang }) => {
    let history = useHistory();
    const [loading, setLoading] = useState(true);
    const [joblist, setJoblist] = useState([]);
    const [current, setCurrent] = useState({});
    const [visible, setVisible] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    // const [current, setCurrent] = useState({});
    // console.log(current);
    useEffect(() => {
        const load_data = async () => {
            await API.get('backend', '/deployment').then(res => {
                console.log(res)
                if (res) {
                    console.log(res)
                    let _tmp_data = []
                    res.forEach((item) => {
                        let _tmp = {}
                        _tmp['ApplicationInstanceId'] = item['ApplicationInstanceId']
                        _tmp['DefaultRuntimeContextDeviceName'] = item['DefaultRuntimeContextDeviceName']
                        _tmp['HealthStatus'] = item['HealthStatus']
                        _tmp['Name'] = item['Name']
                        _tmp['Status'] = item['Status']
                        _tmp['Arn'] = item['Arn']
                        _tmp['targetArn'] = item['targetArn']
                        _tmp['CreatedTime'] = item['CreatedTime']

                        _tmp_data.push(_tmp)
                    });

                    // const test_data =  {
                    //     'Deployment_ID':'cb831c07-2556-4433-ad60-da0720d78113',
                    //     'Device_ID':'123',
                    //     'Camera_ID':'123',
                    //     'Component_Version_ID':'123',
                    //     'Model_Version_ID':'123',
                    //     'targetArn':'123',
                    //     'deploymentName':'123',
                    //     'components':'123',
                    //     'deploymentPolicies':'123',
                    //     'iotJobConfigurations':'123',
                    // }
                    // const test_data_2 =  {
                    //     'Deployment_ID':'cb831c07-2556-4433-ad60-da0720d7811311',
                    //     'Device_ID':'123333',
                    //     'Camera_ID':'123',
                    //     'Component_Version_ID':'123',
                    //     'Model_Version_ID':'123',
                    //     'targetArn':'123',
                    //     'deploymentName':'123',
                    //     'components':'123',
                    //     'deploymentPolicies':'123',
                    //     'iotJobConfigurations':'123',
                    // }
                    // _tmp_data.push(test_data);
                    // _tmp_data.push(test_data_2);
                    console.log(_tmp_data);
                    setJoblist(_tmp_data);
                    setLoading(false);
                }
                // console.log(this.state.model_list)
                return res.data
            })
        }
        load_data();
    }, [])

    const jump_to_newCfg = () => {
        history.push("/NewDeployConfig");
    }
    const delete_application = async () => {
        const payload = {
            "ApplicationInstanceId": current[0].ApplicationInstanceId
        }
        const response = await API.del('backend', '/deployment', { body: payload })

        setVisible(true)
        setResponseMessage(response)
    }
    const closeModel = () => {
        this.setState({ visible: false })
        window.location.reload();
    }

    const tableActions = (
        <Inline>
            <Button onClick={() => delete_application()} disabled={current.length > 0 && current[0].Status.startsWith('DEPLOYMENT') ? false : true}>
                {t('Remove Application')}
            </Button>
            <Button variant="primary" onClick={() => jump_to_newCfg()}>
                {t('New Deployment')}
            </Button>
        </Inline>
    );
    return (
        <>
            <Modal title="Deployment" visible={visible} onClose={() => closeModel()}>
                {responseMessage}
            </Modal>
            <Table
                id="DepCfgTable"
                actionGroup={tableActions}
                tableTitle={t('Deployment Config')}
                columnDefinitions={columnDefinitions}
                multiSelect={false}
                items={joblist}
                onSelectionChange={(item) => { setCurrent(item) }}
                disableGroupBy={false}
                defaultGroups={['DefaultRuntimeContextDeviceName']}
                loading={loading}
            />
        </>
    )
}

export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(DeploymentCfgTable));


