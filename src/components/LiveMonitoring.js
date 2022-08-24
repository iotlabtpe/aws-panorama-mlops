/* eslint-disable react/no-multi-comp */

import Table from 'aws-northstar/components/Table';

// import Inline from 'aws-northstar/layouts/Inline';
// import Link from 'aws-northstar/components/Link';
import { API } from 'aws-amplify'; 
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Grid from 'aws-northstar/layouts/Grid';
import Box from 'aws-northstar/layouts/Box';
import Container from 'aws-northstar/layouts/Container';
import Button from 'aws-northstar/components/Button';
// import Heading from 'aws-northstar/components/Heading';
import React  from 'react';
import { connect } from 'react-redux' 
import { nanoid } from 'nanoid'

import ExpandableSection from 'aws-northstar/components/ExpandableSection'

import ReactHlsPlayer from 'react-hls-player';


import axios from 'axios'

// import { createHashHistory } from 'history';
// const hashHistory = createHashHistory();

import {withTranslation} from 'react-i18next'
import KeyValuePair from 'aws-northstar/components/KeyValuePair';
import Stack from 'aws-northstar/layouts/Stack';
import ColumnLayout, { Column } from 'aws-northstar/layouts/ColumnLayout';
import Inline from 'aws-northstar/layouts/Inline';

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
        'id': 'camera_id',
        width: 200,
        Header: 'camera_id',
        accessor: 'camera_id'
    },
    {
        'id': 'device_id',
        width: 200,
        Header: 'device_id',
        accessor: 'device_id'
    },
    {
        'id': 'is_monitoring',
        width: 100,
        Header: 'is_monitoring',
        // accessor: 'is_monitoring'
        Cell: ({ row  }) => {
            // console.log(row.original)
            var result = []
            // console.log(row.original.is_monitoring)
            if (row) {
                 if(row.original.is_monitoring){
                     result.push(<StatusIndicator statusType="positive">Monitoring</StatusIndicator>)
                 }else{
                     result.push(<StatusIndicator statusType="info">Suspending</StatusIndicator>)
                 }
            }
            return <div>{result}</div>
        }
    },
    // {
    //     'id': 'address',
    //     width: 100,
    //     Header: 'address',
    //     // accessor: 'address'
    //     Cell: ({ row  }) => {
    //         // console.log(row.original)
    //         var result = []
    //         if (row && row.original.address) {
    //             result.push(<Link href={row.original.address}>{row.original.address}</Link>)
    //         }
    //         return <div>{result}</div>
    //     }
    // },
    // {
    //     'id': 'last_picture',
    //     width: 100,
    //     Header: 'last_picture',
    //     accessor: 'last_picture'
    // }
]


const event_columnDefinitions = [
    {
        'id': 'time_stamp',
        width: 100,
        Header: 'time_stamp',
        accessor: 'time_stamp'
    },
    {
        'id': 'event_message',
        width: 100,
        Header: 'event_message',
        // accessor: 'event_message'
        Cell: ({ row  }) => {
            // console.log(row.original)
            var result = []
            // console.log(row.original.is_monitoring)
            if (row) {
                 if(row.original.event_message){
                     result.push(
                        <ExpandableSection variant="borderless" header="Message">
                            {row.original.event_message}
                            </ExpandableSection>
                    )
                 }
            }
            return <div>{result}</div>
        }
    },
   
]


class  LiveMonitoring extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true ,
        monitoring_list : [],
        curent : null,
        curent_id:[],
        btnText: this.props.t("Start Monitoring"),
        loading_event:true,
        event_list:[]

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

    String.prototype.inList = function(list){
        return (list.indexOf(this.toString()) !== -1)
    }

    const url = '/deployment'
    await API.get('backend','/deployment').then(res => {
        var _tmp_deploy = [] 
        var _tmp_dict_deploy = {}
        console.log(res)
        res.forEach((item)=>{ 
            // console.log(item)
            _tmp_deploy.push(item['CameraID']) 
            _tmp_dict_deploy[item['CameraID']] = item['DeviceID']
        })

        // console.log(_tmp_deploy)
        // console.log(_tmp_dict_deploy)

        API.get('backend','/camera').then(res2 => {
            console.log(res2)
            if (res2){
                var _tmp_data = []
                res2.forEach((item,index)=>{
                    if (item['camera_id'].inList(_tmp_deploy)){
                        var _tmp = {}
                        // const _id = nanoid()
                        _tmp['id'] = index
                        _tmp['key'] =  nanoid()
                        _tmp['camera_id'] = item['camera_id']

                        _tmp['address'] = item['address']
                        _tmp['description'] = item['description']
                        _tmp['location'] = item['location']
                        _tmp['brand'] = item['brand']
                        _tmp['network'] = item['network']
                        _tmp['image_size'] = item['image_size']    
                        _tmp['is_monitoring'] = item['is_monitoring']
                        _tmp['device_id'] = _tmp_dict_deploy[item['camera_id']]
                        _tmp_data.push(_tmp)
                    }
                });
                var c_id = []
                var _btn =  this.props.t("Start Monitoring")
                if(_tmp_data[0]) {
                    c_id = [_tmp_data[0]['id']]
                    if(_tmp_data[0]['id']['is_monitoring']){
                        _btn =  this.props.t("Start Monitoring")
                    }else{
                        _btn =  this.props.t("Stop Monitoring")
                    }
                }

                this.setState({
                    monitoring_list:_tmp_data,
                    curent_id: c_id,
                    btnText:_btn,
                    btnDisable: false
                },()=>{
                    this.setState({loading:false})
                })

            }
            this.setState({loading:false})
            return _tmp_data
        })
    })
  }

  async load_event_data(){
    this.setState({loading_event:true})
    const url = "/ppe_monitoring/event/"+ this.state.current[0].camera_id
    await axios.get(url, {dataType: 'json'}).then(res => {
        this.setState({loading:false})
        if (res.data){
            var _tmp_data = []
            res.data.forEach((item,index)=>{
                var _tmp = {}
                // const _id = nanoid()

                _tmp['id'] = index
                _tmp['key'] = nanoid()
                _tmp['camera_id'] = item['camera_id']
                _tmp['time_stamp'] = item['time_stamp']
                _tmp['event_message'] = JSON.stringify(item['payload'])

                _tmp_data.push(_tmp)
            });

            this.setState({
                event_list:_tmp_data
            },()=>{
                this.setState({loading_event:false})
            })
        }
        // console.log(this.state.model_list)
        return res.data
    })
  }


  change_select(item){
    var _btnText =  this.props.t("Start Monitoring")
    // console.log(item[0])
    if(item && item[0] && item[0]['is_monitoring']){
        _btnText =  this.props.t("Stop Monitoring")
    }


    if(item && item.length === 1){
        this.setState({
            current:item,
            btnText:_btnText,
            url:item[0]['address'],
            loading_event:true,
            btnDisable:false,
            location:item[0]['location'],
            brand:item[0]['brand'],
            network:item[0]['network'],
            address:item[0]['address'],
            image_size:item[0]['image_size'],
            description:item[0]['description']
        },()=>{
            this.load_event_data()
        })
    }
}

  getRowId(data){
    // console.log(data)
    return data?data.id:[]
  }

  handelMonitoringStatus(){
      const payload = this.state.current[0]
      payload.is_monitoring = payload.is_monitoring?false:true

      const HEADERS = {'Content-Type': 'application/json'};
      const apiUrl = '/ppe_monitoring';
      // var result = "=> call"  + apiUrl + "\n";
      var result = "";
  
      this.setState({btnDisable:true},()=>{
        axios({ method: 'POST', url: `${apiUrl}`, data: payload ,headers: HEADERS}).then(response => {
            // console.log(response);
            if (response.status === 200) {
                result = "Update Monitoring status successfully !"
                var _tmp = this.state.monitoring_list
                _tmp[this.state.curent_id].is_monitoring = payload.is_monitoring

                var _btnText = this.props.t("Start Monitoring")
                if( payload.is_monitoring){
                    _btnText =  this.props.t("Stop Monitoring")
                }
  
                 this.setState({
                     monitoring_list:_tmp,
                     current:[_tmp[this.state.curent_id]],
                     btnText:_btnText
                  },()=>{
                 this.setState({btnDisable:false})
              })
  
            } else {
                result = "Update Monitoring status error !"
            }
            this.setState({btnDisable:false})
            console.log(result)
        })
      })
    //   this.setState({btnDisable:true})
  }


  render(){


    const {
        state:{location,brand,network,address,image_size,description},
        props: {t}
    } = this;

    const tableActions = (
        <Box display="flex" width="100%" justifyContent="space-between" alignItems="left">
        <Box>
            <Button disabled={this.state.btnDisable} variant="primary" onClick={() => this.handelMonitoringStatus()}>
                {this.state.btnText}
            </Button>
        </Box>
        </Box>
    )

    const eventTableActions = (
        <Inline>
            <Button icon={"refresh"} iconAlign="right"  onClick={()=>{this.load_event_data()}}  > {t('refresh')}</Button>
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
                    // actionGroup={tableActions}
                    tableTitle={t("Monitoring Cameras")}
                    multiSelect={false}
                    columnDefinitions={columnDefinitions}
                    items={this.state.monitoring_list}
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
                        {/* <Container headingVariant="h4" title={t('Live Video')}> */}
                        <Container headingVariant="h4" title={tableActions}>
                        
                        <Grid container>
                            <Grid item xs={12}>
                                {/* {this.state.url} */}
                                {/* <video
                                        style={{width:'98%', height:'100%' , 'objectfit': 'fill'}}
                                        id="my-video"
                                        src={(this.state.url)?this.state.url:null}
                                        // poster={(this.state.poster)?this.state.poster:null} 
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
                                /> */}
                                  <ReactHlsPlayer
                                    src={(this.state.url)?this.state.url:null}
                                    autoPlay
                                    controls={false}
                                    width="100%"
                                    height="auto"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <ColumnLayout>
                                    <Column key="column1">
                                        <Stack>
                                            <KeyValuePair label="location" value={location}></KeyValuePair>
                                            <KeyValuePair label="brand" value={brand}></KeyValuePair>
                                            <KeyValuePair label="network" value={network}></KeyValuePair>
                                        </Stack>
                                    </Column>
                                    <Column key="column2">
                                        <Stack>
                                            <KeyValuePair label="address" value={address}></KeyValuePair>
                                            <KeyValuePair label="image_size" value={image_size}></KeyValuePair>
                                            <KeyValuePair label="description" value={description}></KeyValuePair>
                                        </Stack>
                                    </Column>

                                </ColumnLayout>
                            </Grid>
                        </Grid>
                        </Container>
                     </Grid>
                     <Grid item xs={10}>
                            <Container headingVariant="h4" >
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Table
                                            id = "EventTable"
                                            actionGroup={eventTableActions}
                                            tableTitle={t("Camera Events")}
                                            multiSelect={false}
                                            columnDefinitions={event_columnDefinitions}
                                            items={this.state.event_list}
                                            // onSelectionChange={(item)=>{this.setState({curent:item})}}
                                            // onSelectionChange={(item)=>{this.change_select(item)}}
                                            getRowId={this.getRowId}
                                            loading={this.state.loading_event}
                                            disableSettings={false}
                                            // selectedRowIds={['d9129cf1-2642-46ca-ab67-c3d03a67667d']}
                                            // selectedRowIds={this.state.curent_id}
                                            // getRowId={getRowId}
                                            // onFetchData={this.handleFetchData}
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

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(LiveMonitoring));

// "Monitoring Cameras": "監控攝像頭",
//     "Live Video": "實時監控",
//     "Camera Events": "告警事件",
//     "Start Monitoring": "啟動監控",
//     "Stop Monitoring": "停止監控"


