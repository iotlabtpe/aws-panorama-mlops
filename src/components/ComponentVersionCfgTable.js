/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Table from 'aws-northstar/components/Table';
// import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';

import React  from 'react';
import { connect } from 'react-redux' 

import axios from 'axios'

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
  return { session: state.session }
}


const MapDispatchTpProps = (dispatch) => {
  return {
      changeLang: (key)=>dispatch({type: 'change_language',data: key})
  }
}


const columnDefinitions = [
    {
        'id': 'Version_ID',
        width: 250,
        Header: 'ID',
        accessor: 'Version_ID'
    },
    // {
    //     'id': 'Component_ID',
    //     width: 200,
    //     Header: 'Name',
    //     accessor: 'ComponentName'
    // },
    {
        'id': 'Version',
        width: 50,
        Header: 'Version',
        accessor: 'Version'
    },
    {
        'id': 'Artifact_URI',
        width: 200,
        Header: 'Artifact',
        accessor: 'Artifact_URI'
    },
    {
        'id': 'Parameter',
        width: 300,
        Header: 'Parameter',
        accessor: 'Parameter'
    },
    {
        'id': 'Lifecycle',
        width: 300,
        Header: 'Lifecycle',
        accessor: 'Lifecycle'
    },
]


class  ComponentVersionCfgTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true ,
        job_list : [],
        curent : {}
    }
  }

  componentDidMount(){
    // console.log(this.model_list)
    this.setState({loading:true},()=>{
        this.load_data()
    })
  }

  async load_data(){
    console.log(this.props)
    // await axios.get('/component_ver/'+this.props.id, {dataType: 'json'}).then(res => {
    await axios.get('/component/version/'+this.props.id, {dataType: 'json'}).then(res => {
        console.log(res)
        if (res.data){
            console.log(res.data)
            var _tmp_data = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['Version_ID'] = item['Version_ID']
                _tmp['Component_ID'] = item['Component_ID']
                _tmp['Version'] = item['Version']
                _tmp['Artifact_URI'] = item['Artifact_URI']
                _tmp['Parameter'] = item['Parameter']
                _tmp['Lifecycle'] = item['Lifecycle']
                _tmp_data.push(_tmp)
            });

            this.setState({job_list:_tmp_data},()=>{
                this.setState({loading:false})
            })
        }
        // console.log(this.state.model_list)
        return res.data
    })
  }

  jump_to_newCfg(){
    this.props.history.push("/NewComponentVersionConfig/"+this.props.id)
  }



  render(){
    const {
        props: {t}
    } = this;

    const tableActions = (
        <Inline>
            <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
               {t('New Component Version Config')}
            </Button>
        </Inline>
    );

    return(
        <Table
            id = "CompVerCfgTable"
            actionGroup={tableActions}
            tableTitle={t("Component Version Config")}
            multiSelect={false}
            columnDefinitions={columnDefinitions}
            items={this.state.job_list}
            onSelectionChange={(item)=>{this.setState({curent:item})}}
            // getRowId={this.getRowId}
            loading={this.state.loading}
            disableSettings={false}
            // onFetchData={this.handleFetchData}
        />
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ComponentVersionCfgTable));


