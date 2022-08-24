/* eslint-disable react/no-multi-comp */
import Table from 'aws-northstar/components/Table';
// import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import Inline from 'aws-northstar/layouts/Inline';
import Link from 'aws-northstar/components/Link';

import React  from 'react';
import { connect } from 'react-redux' 

import axios from 'axios'

// import { createHashHistory } from 'history';
// const hashHistory = createHashHistory();

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
        'id': 'job_id',
        width: 300,
        Header: 'job_id',
        accessor: 'job_id',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const job_id = row.original.job_id;
                const target = "/job/"+job_id
                return <Link href={target}>{job_id}</Link>
            }else{
                return null;
            }
        }
    },
    {
        'id': 'bot_name',
        width: 240,
        Header: 'bot_name',
        accessor: 'bot_name'
    },
    {
        'id': 'creatation_time',
        width: 200,
        Header: 'creatation_time',
        accessor: 'creatation_time'
    },
    {
        'id': 'number_of_files',
        width: 40,
        Header: 'files',
        accessor: 'number_of_files'
    },
    {
        'id': 'number_of_bots',
        width: 40,
        Header: 'bots',
        accessor: 'number_of_bots'
    },
    // {
    //     'id': 'input',
    //     width: 300,
    //     Header: 'input',
    //     accessor: 'input'
    // },
    {
        'id': 'output',
        width: 600,
        Header: 'output',
        accessor: 'output'
    },
]


class  InferenceTable extends React.Component {
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
    await axios.get('/listinference', {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            // console.log(res.data)
            var _tmp_data = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['job_id'] = item['job_id']
                _tmp['bot_name'] = item['bot_name']
                _tmp['creatation_time'] = item['creatation_time']
                _tmp['number_of_files'] = item['number_of_files']
                _tmp['number_of_bots'] = item['number_of_bots']
                // _tmp['input'] = 's3://'+item['bucket']+'/'+'[TBD]'
                // _tmp['output'] = 's3://'+item['output_s3_bucket']+'/'+item['output_s3_prefix']
                _tmp['input'] =  `s3://${item['bucket']}/${item['in_s3_prefix']}`
                _tmp['output'] = `s3://${item['output_s3_bucket']}/${item['output_s3_prefix']}`
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




  jump_to_newTask(){
    this.props.history.push("/NewInferenceTask")
  }



  render(){
    const tableActions = (
        <Inline>
            <Button variant="primary" onClick={() => this.jump_to_newTask()}>
                New Batch Job
            </Button>
        </Inline>
    );

    return(

        <Table
            id = "InfTable"
            actionGroup={tableActions}
            tableTitle="Inference Table"
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

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(InferenceTable));


