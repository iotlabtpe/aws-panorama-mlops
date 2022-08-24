/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */
// import { Table, Header, SpaceBetween, Button, TextFilter, Pagination } from '@amzn/awsui-components-react/polaris';
import Table from 'aws-northstar/components/Table';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Modal from 'aws-northstar/components/Modal';

import React from 'react';
import { connect } from 'react-redux'
import Amplify, { API } from 'aws-amplify';

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
        'id': 'NodeId',
        width: 500,
        Header: 'Camera ID',
        accessor: 'NodeId'
    },
    {
        'id': 'Name',
        width: 300,
        Header: 'Camera Name',
        accessor: 'Name'
    },
    {
        'id': 'Description',
        width: 400,
        Header: 'Description',
        accessor: 'Description'
    },
    // {
    //     'id': 'location',
    //     width: 200,
    //     Header: 'location',
    //     accessor: 'location'
    // },
    {
        'id': 'CreatedTime',
        width: 400,
        Header: 'Created Time',
        accessor: 'CreatedTime'
    },
    // {
    //     'id': 'network',
    //     width: 200,
    //     Header: 'network',
    //     accessor: 'network'
    // },
    // {
    //     'id': 'image_size',
    //     width: 200,
    //     Header: 'image_size',
    //     accessor: 'image_size'
    // }
]

class CameraCfgTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            job_list: [],
            current: {},
            apiMessage: "",
            visible: false,
            responseMessage: ""
        }
    }

    componentDidMount() {
        // console.log(this.model_list)
        this.setState({ loading: true }, () => {
            this.load_data()
        })
    }

    async load_data() {
        await API.get('backend', '/camera').then(res => {
            console.log('return Data', res)
            if (res) {
                console.log(res)
                var _tmp_data = []
                res.forEach((item) => {
                    var _tmp = {}
                    _tmp['NodeId'] = item['NodeId']
                    _tmp['Name'] = item['Name']
                    _tmp['Description'] = item['Description']
                    _tmp['CreatedTime'] = item['CreatedTime']
                    _tmp['PackageId'] = item['PackageId']
                    // _tmp['brand'] = item['brand']
                    // _tmp['network'] = item['network']
                    // _tmp['image_size'] = item['image_size']    
                    _tmp_data.push(_tmp)

                });
                this.setState({ job_list: _tmp_data }, () => {
                })
                this.setState({ loading: false })
            }
            // console.log(this.state.model_list)
            return res
        })
    }

    jump_to_newCfg() {
        this.props.history.push("/NewCameraConfig")
    }

    async delete_camera() {
        const payload = {
            "PackageId": this.state.current[0]['PackageId']
        }
        console.log(payload)
        const response = await API.del('backend', '/camera', { body: payload })

        this.setState({ visible: true })
        this.setState({ responseMessage: response })
    }

    closeModel() {
        this.setState({ visible: false })
        window.location.reload();
    }


    render() {
        const {
            props: { t }
        } = this;


        const tableActions = (
            <Inline>
                <Button onClick={() => this.delete_camera()} disabled={this.state.current.length !== 0 ? false : true}>
                    {t('Delete Camera')}
                </Button>
                <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
                    {t('New Camera Config')}
                </Button>
            </Inline>
        );

        return (
            <>
                <Table
                    id="CameraCfgTable"
                    actionGroup={tableActions}
                    tableTitle={t('Camera Config')}
                    multiSelect={false}
                    columnDefinitions={columnDefinitions}
                    items={this.state.job_list}
                    onSelectionChange={(item) => { this.setState({ current: item }) }}
                    // getRowId={this.getRowId}
                    loading={this.state.loading}
                    disableSettings={false}
                // onFetchData={this.handleFetchData}
                />
                <Modal title="Delete Camera" visible={this.state.visible} onClose={() => this.closeModel()}>
                    {this.state.responseMessage}
                </Modal>
            </>
        )
    }
}


export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(CameraCfgTable));

