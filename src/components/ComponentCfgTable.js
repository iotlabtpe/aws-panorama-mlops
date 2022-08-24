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
    //     'id': 'Component_ID',
    //     width: 300,
    //     Header: 'ID',
    //     accessor: 'Component_ID'
    // },
    {
        'id': 'Component_ID',
        width: 300,
        Header: 'ID',
        accessor: 'Component_ID',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const comp_id = row.original.Component_ID;
                const target = "/ComponentVersionConfig/"+comp_id
                return <Link href={target}>{comp_id}</Link>
            }else{
                return null;
            }
        }
    },
    {
        'id': 'ComponentName',
        width: 200,
        Header: 'Name',
        accessor: 'ComponentName'
    },
    {
        'id': 'ComponentType',
        width: 200,
        Header: 'Type',
        accessor: 'ComponentType'
    },
    {
        'id': 'ComponentPublisher',
        width: 200,
        Header: 'Publisher',
        accessor: 'ComponentPublisher'
    },
    {
        'id': 'ComponentDescription',
        width: 300,
        Header: 'Description',
        accessor: 'ComponentDescription'
    },
]


class  ComponentCfgTable extends React.Component {
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
    await axios.get('/component', {dataType: 'json'}).then(res => {
        console.log(res)
        if (res.data){
            console.log(res.data)
            var _tmp_data = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['Component_ID'] = item['Component_ID']
                _tmp['ComponentName'] = item['ComponentName']
                _tmp['ComponentType'] = item['ComponentType']
                _tmp['ComponentPublisher'] = item['ComponentPublisher']
                _tmp['ComponentDescription'] = item['ComponentDescription']
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
    this.props.history.push("/NewComponentConfig")
  }



  render(){
    const {
        props: {t}
      } = this;

    const tableActions = (
        <Inline>
            <Button variant="primary" onClick={() => this.jump_to_newCfg()}>
                {t('New Component Config')}
            </Button>
        </Inline>
    );

    return(
        <Table
            id = "CompCfgTable"
            actionGroup={tableActions}
            tableTitle={t('Component Config')}
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

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ComponentCfgTable));


