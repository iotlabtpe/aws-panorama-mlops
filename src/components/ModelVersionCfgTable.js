/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Table from 'aws-northstar/components/Table';
// import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';

import React  from 'react';
import { connect } from 'react-redux' 

import Textarea from 'aws-northstar/components/Textarea';

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
        width: 200,
        Header: 'ID',
        accessor: 'Version_ID'
    },
    // {
    //     'id': 'Model_ID',
    //     width: 200,
    //     Header: 'Model',
    //     accessor: 'ModelID'
    // },
    {
        'id': 'Version',
        width: 60,
        Header: 'Version',
        accessor: 'Version'
    },
    {
        'id': 'Asset_Location',
        width: 200,
        Header: 'Location',
        accessor: 'Asset_Location'
    },
    // {
    //     'id': 'Parameter',
    //     width: 400,
    //     Header: 'Parameter',
    //     accessor: 'Parameter'
    // },
    {
        'id': 'Parameter',
        width: 400,
        Header: 'Parameter',
        accessor: 'Parameter',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const _v = row.original.Parameter;
                return <Textarea rows="10"readonly value={_v} />
            }else{
                return null;
            }
        }
    },
    {
        'id': 'Lifecycle',
        width: 400,
        Header: 'Lifecycle',
        accessor: 'Lifecycle',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const _v = row.original.Lifecycle;
                return <Textarea rows="10"readonly value={_v} />
            }else{
                return null;
            }
        }
    },
]


class  ModelVersionCfgTable extends React.Component {
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
    await axios.get('/cfg_model/version/'+this.props.id, {dataType: 'json'}).then(res => {
        console.log(res)
        if (res.data){
            console.log(res.data)
            var _tmp_data = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['Version_ID'] = item['Version_ID']
                _tmp['Model_ID'] = item['Model_ID']
                _tmp['Version'] = item['Version']
                _tmp['Asset_Location'] = item['Asset_Location']
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
    this.props.history.push("/NewModelVersionConfig/"+this.props.id)
  }



  render(){
    const {
        props: {t}
    } = this;

    const tableActions = (
        <Inline>
            <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
                {t("New Model Version Config")}
            </Button>
        </Inline>
    );

    return(

        <Table
            id = "ModelVerCfgTable"
            actionGroup={tableActions}
            tableTitle={t("Model Version Config")}
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


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ModelVersionCfgTable));


