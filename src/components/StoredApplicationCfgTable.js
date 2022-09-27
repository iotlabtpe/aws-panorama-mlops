import Table from 'aws-northstar/components/Table';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Modal from 'aws-northstar/components/Modal';

import React from 'react';
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
        'id': 'appName',
        width: 500,
        Header: 'App Name',
        accessor: 'appName'
    },
    {
        'id': 'lastModifiedTime',
        width: 300,
        Header: 'Last Modified Time',
        accessor: 'lastModifiedTime'
    },
    {
        'id': 'appUri',
        width: 400,
        Header: 'Storage Uri',
        accessor: 'appUri'
    }
]

class StoredApplicationCfgTable extends React.Component {
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
        await API.get('backend', '/listStoredApplication').then(res => {
            console.log('return Data', res)
            if (res) {
                console.log(res)
                var _tmp_data = []
                res.forEach((item) => {
                    var _tmp = {}
                    _tmp['appName'] = item['appName']
                    _tmp['lastModifiedTime'] = item['lastModifiedTime']
                    _tmp['appUri'] = item['appUri']
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
        this.props.history.push("/NewStoredApplicationConfig")
    }

    async delete_application() {
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
                <Button onClick={() => this.delete_application()} disabled={this.state.current.length !== 0 ? false : true}>
                    {t('Delete Application')}
                </Button>
                <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
                    {t('New Application')}
                </Button>
            </Inline>
        );

        return (
            <>
                <Table
                    id="StoredApplicationCfgTable"
                    actionGroup={tableActions}
                    tableTitle={t('Stored Application')}
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


export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(StoredApplicationCfgTable));

