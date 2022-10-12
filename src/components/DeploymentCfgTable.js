import Table from 'aws-northstar/components/Table';
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Modal from 'aws-northstar/components/Modal';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux'

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
        Header: 'Application ID',
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
        load_data();
    }, [])

    const load_data = async () => {
        setLoading(true)
        await API.get('backend', '/listDeployment').then(res => {
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
                    
                    if(_tmp['Status'] !== 'REMOVAL_SUCCEEDED'){
                        _tmp_data.push(_tmp)
                    }
                });

                console.log(_tmp_data);
                setJoblist(_tmp_data);
                setLoading(false);
            }
            // console.log(this.state.model_list)
            return res.data
        })
    }
    const jump_to_newCfg = () => {
        history.push("/NewDeployConfig");
    }
    const delete_application = async () => {
        const payload = {
            "ApplicationInstanceId": current[0].ApplicationInstanceId
        }
        const response = await API.del('backend', '/deleteDeployment', { body: payload })

        setVisible(true)
        setResponseMessage(response)
    }
    const closeModel = () => {
        this.setState({ visible: false })
        window.location.reload();
    }

    const tableActions = (
        <Inline>
            <Button
                variant="icon"
                label="refresh"
                icon="refresh"
                onClick={() => load_data()}
            />
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


