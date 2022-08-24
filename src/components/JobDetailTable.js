/* eslint-disable react/no-multi-comp */
import Table from 'aws-northstar/components/Table';
import Inline from 'aws-northstar/layouts/Inline';
import Link from 'aws-northstar/components/Link';
import React  from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'

// import { createHashHistory } from 'history';
import PredictResult from './PredictResult'

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
        'id': 'doc_id',
        width: 200,
        Header: 'doc_id',
        accessor: 'doc_id',
        Cell: ({ row  }) => {
            if (row && row.original) {
                // console.log(row.original)
                const doc_id = row.original.doc_id;
                const target = row.original.image_url;
                return <Link href={target} target="_blank" >{doc_id}</Link>
            }else{
                return null;
            }
        }
    },
    // {
    //     'id': 'bot_name',
    //     width: 120,
    //     Header: 'bot_name',
    //     accessor: 'bot_name'
    // },
    {
        'id': 'created_date',
        width: 200,
        Header: 'create',
        accessor: 'created_date'
    },
    {
        'id': 'complete_date',
        width: 200,
        Header: 'complete',
        accessor: 'complete_date'
    },
    {
        'id': 'status',
        width: 200,
        Header: 'status',
        accessor: 'status'
    },
    // {
    //     'id': 'thumbnail',
    //     width: 120,
    //     Header: 'Thumbnail',
    //     accessor: 'Thumbnail',
    //     Cell: ({ row  }) => {
    //         const doc_id = row.original.doc_id;
    //         const url = row.original.image_url;
    //         if (row && row.original) {
    //             if (row.original.predict){
    //                 return <PreCanv id={doc_id} url={url} predict={row.original.predict} color={"red"} />
    //             }
    //             if (row.original.predict_normal){
    //                 return <PreCanv id={doc_id} url={url} predict={row.original.predict_normal} color={"#8AF3AA"} />
    //             }  

    //         }else{
    //             return null;
    //         }
    //     }
    // },
    {
        'id': 'predict',
        width: 200,
        Header: 'predict',
        accessor: 'predict',
        Cell: ({ row  }) => {
            const opt = row.original.fault_list;
            const select = row.original.selectedOption;
            if (row && row.original && select) {
                return <PredictResult options={opt} selectedOption={select} docid={row.original.doc_id} predict={row.original.predict} ></PredictResult>
            }else{
                return null;
            }
        }
    },
    {
        'id': 'predict_normal',
        width: 200,
        Header: 'predict_normal',
        accessor: 'predict_normal',
        Cell: ({ row  }) => {
            const opt = row.original.object_list;
            const select = row.original.selectedOption_normal;
            if (row && row.original && select) {
                return <PredictResult options={opt} selectedOption={select} docid={row.original.doc_id} predict={row.original.predict} ></PredictResult>
            }else{
                return null;
            }
        }
    },
    // {
    //     'id': 'update',
    //     width: 200,
    //     Header: '',
    //     accessor: 'predict',
    //     Cell: ({ row  }) => {
    //         if (row && row.original) {
    //             // console.log(row.original)
    //             const doc_id = row.original.doc_id;
    //             // const target = "/doc/"+doc_id+"?jobid="+row.original.job_id
    //             const target = "/doc/"+row.original.job_id+"/"+doc_id
    //             return <Link href={target}>Verify</Link>
    //         }else{
    //             return null;
    //         }
    //     }
    // },    
];

class  JobDetailTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true ,
        doc_list : [],
        curent : {},
        fault_list:[],
        object_list:[]
    }
  }


  componentDidMount(){
    // console.log(this.model_list)
    this.setState({loading:true},()=>{
        this.init()
    })
  }


  init(){
    axios.get('/get_meta', {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            // console.log(res)
            // console.log(res.data)
            if (res.status === 200){
                this.setState({
                    fault_list:res.data.fault_list,
                    object_list:res.data.object_list,
                },()=>{
                    this.load_data(res.data.fault_list,res.data.object_list)
                })
            }else{
                return null
            }
        }
    })

  }

  async load_data(fault_list,object_list){
    // console.log(this.props)
    const id = this.props.match.params.id 
    // await axios.get('/get_job_detail/'+ id +'?from=0&&size=5', {dataType: 'json'}).then(res => {
    await axios.get('/get_job_detail/'+ id , {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            // console.log(res.data)
            var _tmp_data = []
            res.data.content.forEach((item)=>{
                var _tmp = {}
                _tmp['job_id'] = item._source.job_id
                _tmp['bot_name'] = item._source.bot_name
                _tmp['created_date'] = item._source.create_date
                _tmp['complete_date'] = item._source.complete_date
                _tmp['image_url'] = item._source.image_url
                _tmp['predict'] = item._source.predict
                _tmp['predict_normal'] = item._source.predict_normal
                _tmp['doc_id'] = item._id
                _tmp['fault_list'] = fault_list
                _tmp['object_list'] = object_list
                _tmp['status'] = item._source.status

                _tmp['selectedOption'] = {'value':''}

                if (item._source.predict && item._source.predict[0]){
                    _tmp['selectedOption'] = {
                        'value':item._source.predict[0].toString()
                    }
                }
                if (item._source.predict_normal && item._source.predict_normal[0]){
                    _tmp['selectedOption_normal'] = {
                        'value':item._source.predict_normal[0].toString()
                    }
                }
                _tmp_data.push(_tmp)
            });
            this.setState({doc_list:_tmp_data},()=>{
                this.setState({loading:false})
                // console.log(_tmp_data)
            })
        }
        // console.log(this.state.model_list)
        return res.data
    })

  }




  render(){
    const tableActions = (
        <Inline>
            {/* <Button variant='primary' onClick={() => this.drawThumbnail()}>
                test
            </Button> */}
        </Inline>
    );

    return(

        <Table
            id = "ttt"
            actionGroup={tableActions}
            tableTitle="Job Detail Table"
            multiSelect={false}
            columnDefinitions={columnDefinitions}
            items={this.state.doc_list}
            onSelectionChange={(item)=>{this.setState({curent:item})}}
            loading={this.state.loading}
            disableSettings={false}
        />
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(JobDetailTable));

