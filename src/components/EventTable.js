/* eslint-disable react/no-multi-comp */

import Table from 'aws-northstar/components/Table';

import Inline from 'aws-northstar/layouts/Inline';
import Link from 'aws-northstar/components/Link';

import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Grid from 'aws-northstar/layouts/Grid';
import Container from 'aws-northstar/layouts/Container';
import React  from 'react';
import { connect } from 'react-redux' 


import { API } from 'aws-amplify';
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

    // {
    //     'id': 'id',
    //     width: 100,
    //     Header: 'id',
    //     accessor: 'id'
    // },
    {
        'id': 'name',
        width: 100,
        Header: 'name',
        accessor: 'name'
    },
    {
        'id': 'time',
        width: 100,
        Header: 'time',
        accessor: 'time'
    },
    {
        'id': 'location',
        width: 100,
        Header: 'location',
        accessor: 'location'
    },
    {
        'id': 'device_id',
        width: 300,
        Header: 'device_id',
        accessor: 'device_id'
    },
    // {
    //     'id': 'status',
    //     width: 150,
    //     Header: 'status',
    //     accessor: '',
    //     Cell: ({ row  }) => {
    //          if (row && row.original.status) {
    //              if(row.original.status == 'Complete'){
    //                  return <StatusIndicator statusType="positive">Complete</StatusIndicator>;
    //              }else{
    //                  return <StatusIndicator statusType="info">Procressing</StatusIndicator>;
    //              }
    //          }else{
    //              return <StatusIndicator statusType="warning">New</StatusIndicator>;
    //          }
    //     }
    // },

    {
        'id': 'detail',
        width: 200,
        Header: 'detail',
        accessor: 'detail',
        Cell: ({ row  }) => {
            // console.log(row.original)
            var result = []
            if (row && row.original.status) {
                 if(row.original.status === 'Complete'){
                     result.push(<StatusIndicator statusType="positive">Complete</StatusIndicator>)
                 }else{
                     result.push(<StatusIndicator statusType="info">Procressing</StatusIndicator>)
                 }
             }else{
                 result.push( <StatusIndicator statusType="warning">New Event</StatusIndicator>)
             }

            if (row && row.original.picture_filename && row.original.picture) {
                // console.log('picture')
                // console.log(row.original)
                const target = row.original.picture
                result.push(<Link href={target}>{row.original.picture_filename}</Link>)
            }
            if (row && row.original.video_filename && row.original.video) {
                // console.log(row.original)
                const target = row.original.video
                result.push(<Link href={target}>{row.original.video_filename}</Link>)
            }
            if (row && row.original.label_filename && row.original.label) {
                // console.log(row.original)
                const target = row.original.label
                result.push(<Link href={target}>{row.original.label_filename}</Link>)
            }
            // console.log(result)
            return <div>{result}</div>
        }
    },
]


class  EventTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true ,
        job_list : [],
        curent : null,
        curent_id:[]

    }
  }

  componentDidMount(){
    // console.log(this.model_list)
    this.setState({loading:true},()=>{
        this.load_data()
    })
  }


  async load_data(){
    // const url = 'http://localhost:7300/mock/619312aa31c2f2583685aebb/example/list_event'
    const url = '/list_event'
    await API.get('backend','/event').then(res => {
        console.log(res)
        if (res){
            console.log(res)
            var _tmp_data = []
            res.forEach((item)=>{
                var _tmp = {}
                // _tmp['job_id'] = item['job_id']
                // _tmp['bot_name'] = item['bot_name']
                // _tmp['creatation_time'] = item['creatation_time']
                // _tmp['number_of_files'] = item['number_of_files']
                // _tmp['number_of_bots'] = item['number_of_bots']
                // _tmp['input'] = 's3://'+item['bucket']+'/'+'[TBD]'
                // _tmp['output'] = 's3://'+item['output_s3_bucket']+'/'+item['output_s3_prefix']

                _tmp['id'] = item ['time']
                _tmp['key'] = item['key']
                _tmp['device_id'] = item['device_id']
                _tmp['flag'] = item['flag']
                _tmp['label_filename'] = item['label_filename']
                _tmp['picture_filename'] = item['picture_filename']
                _tmp['video_filename'] = item['video_filename']
                _tmp['location'] = item['location']
                _tmp['name'] = item['name']
                _tmp['time'] = item['time']
                _tmp['type'] = item['type']
                _tmp['picture'] = item['picture']
                _tmp['origin_picture'] = item['origin_picture']
                _tmp['label'] = item['label']
                _tmp['video'] = item['video']
                
                _tmp_data.push(_tmp)
            });

            var c_id = []
            if(_tmp_data[0]) {
                c_id = [_tmp_data[0]['id']]
             }

            this.setState({
                job_list:_tmp_data,
                curent_id: c_id
            },()=>{
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

  change_select(item){
      this.setState({current:item})
  }

  getRowId(data){
    console.log(data)
    return data?data.id:[]
  }



  render(){
    const {
            props: {t}
    } = this;

    const tableActions = (
        <Inline>
        </Inline>
    );

    return(
        <Container headingVariant="h4">
          <Grid container>
          <Grid item xs={6}>
             <Grid container>
             <Grid item xs={11}>
                <Table
                    id = "InfTable"
                    actionGroup={tableActions}
                    tableTitle={t("Event Table")}
                    multiSelect={false}
                    columnDefinitions={columnDefinitions}
                    items={this.state.job_list}
                    // onSelectionChange={(item)=>{this.setState({curent:item})}}
                    onSelectionChange={(item)=>{this.change_select(item)}}
                    getRowId={this.getRowId}
                    loading={this.state.loading}
                    disableSettings={false}
                    // selectedRowIds={['d9129cf1-2642-46ca-ab67-c3d03a67667d']}
                    selectedRowIds={this.state.curent_id}
                    // getRowId={getRowId}
                    // onFetchData={this.handleFetchData}
                />
                                            </Grid>  
                            <Grid item xs={1}></Grid>
                            </Grid>             
            </Grid>

            <Grid item xs={6}>
                <Grid container>
                    <Grid item xs={10}>
                        <Container headingVariant="h4" title={t('Original Pic')}>
                        <Grid container>
                            {/* <Grid item xs={11}>
                                <video
                                    style={{width:'98%', height:'100%' , 'objectfit': 'fill'}}
                                    id="my-video"
                                    src={(this.state.current && this.state.current[0])?this.state.current[0].video:null}
                                    poster={(this.state.current && this.state.current[0])?this.state.current[0].picture:null} 
                                    controls="controls"
                                    // autoplay="autoplay"
                                    loop="loop"
                                    preload="auto"
                                    webkit-playsinline="true" 
                                    playsinline="true"
                                    x-webkit-airplay="allow" 
                                    x5-playsinline
                                    x5-video-player-type="h5" 
                                    x5-video-player-fullscreen="true"  
                                    x5-video-orientation="portraint"
                                />
                                </Grid> */}
                            <Grid item xs={12}>
                                <img alt=""
                                    style={{width:'100%', height:'100%' , 'objectfit': 'fill'}}
                                    src={(this.state.current && this.state.current[0])?this.state.current[0].origin_picture:null}
                                />
                            </Grid>
                        </Grid>
                        </Container>
                     </Grid>
                     <Grid item xs={10}>
                            <Container headingVariant="h4" title={t('Alert Pic')}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <img alt=""
                                            style={{width:'100%', height:'100%' , 'objectfit': 'fill'}}
                                            src={(this.state.current && this.state.current[0])?this.state.current[0].picture:null}
                                        />
                                    </Grid>
                                </Grid>
                            </Container>
                    </Grid>
                </Grid>
            </Grid>

          </Grid>
        </Container>
    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(EventTable));


