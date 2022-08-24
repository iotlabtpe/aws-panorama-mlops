/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */

import Table from 'aws-northstar/components/Table';
// import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Link from 'aws-northstar/components/Link';

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
    // {
    //     'id': 'Model_ID',
    //     width: 300,
    //     Header: 'ID',
    //     accessor: 'Model_ID'
    // },
    {
        'id': 'Model_ID',
        width: 300,
        Header: 'ID',
        accessor: 'Model_ID',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const model_id = row.original.Model_ID;
                const target = "/ModelVersionConfig/"+model_id
                return <Link href={target}>{model_id}</Link>
            }else{
                return null;
            }
        }
    },
    {
        'id': 'Model_Name',
        width: 200,
        Header: 'Name',
        accessor: 'Model_Name'
    },
    {
        'id': 'in_topic',
        width: 200,
        Header: 'Type',
        accessor: 'in_topic'
    },
    {
        'id': 'out_topic',
        width: 200,
        Header: 'Publisher',
        accessor: 'out_topic'
    }
]


class  ModelCfgTable extends React.Component {
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
    await axios.get('/cfg_model', {dataType: 'json'}).then(res => {
        console.log(res)
        if (res.data){
            console.log(res.data)
            var _tmp_data = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['Model_ID'] = item['Model_ID']
                _tmp['Model_Name'] = item['Model_Name']
                _tmp['in_topic'] = item['in_topic']
                _tmp['out_topic'] = item['out_topic']
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
    this.props.history.push("/NewModelConfig")
  }



  render(){
    const {
        props: {t}
    } = this;

    const tableActions = (
        <Inline>
            <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
                {t("New Model Config")}
            </Button>
        </Inline>
    );

    return(

        <Table
            id = "ModelCfgTable"
            actionGroup={tableActions}
            tableTitle={t("Model Config")}
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

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ModelCfgTable));

