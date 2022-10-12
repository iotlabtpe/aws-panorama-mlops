import Inline from 'aws-northstar/layouts/Inline';
import React  from 'react';
import { connect } from 'react-redux' 
import { API } from 'aws-amplify'
// import { createHashHistory } from 'history';
import Box from 'aws-northstar/layouts/Box'
import Card from 'aws-northstar/components/Card'
import Grid from 'aws-northstar/layouts/Grid';
import EventBBox from './EventBBox'

import Select from 'aws-northstar/components/Select';
import Button from 'aws-northstar/components/Button';
import KeyValuePair from 'aws-northstar/components/KeyValuePair';
import Badge from 'aws-northstar/components/Badge';
import {withTranslation} from 'react-i18next'
import Alert from 'aws-northstar/components/Alert';
import { LoadingIndicator, Text } from 'aws-northstar';

// import { Trans ,Translation } from 'react-i18next';
// const hashHistory = createHashHistory();


const mapStateToProps = state => {
    return { session: state.session ,language: state.lang.language, languageList: state.lang.languageList}
  }
  
  const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
  }


const TAG_LIST = ['mask','helmet']


class  ImgCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        loading : true ,
        doc_list : [],
        curent : {},
        fault_list:[],
        object_list:[],
        curr_job:null,
        jobOptions:[],
        job_loading:'loading',
        jobSelectedOption:null,
        statusOptions:[
            {value:'1',label:'All'},
            {value:'2',label:'Waiting'},
            {value:'3',label:'Verified'}
        ],
        // statusSelectedOption:{name:'Waiting',value:'2'},
        statusSelectedOption:{name:'All',value:'1'},

        tagOptions:[
            {value:'person',label:'电子围栏'},
            {value:'mask',label:'口罩'},
            {value:'helmet',label:'安全帽'}
        ],
        tagSelectedOption:{name:'口罩',value:'person'},

        pageOptions:[
            {value:'1',label:'1'},
            {value:'10',label:'10'},
            {value:'20',label:'20'},
            {value:'30',label:'30'},
            {value:'40',label:'40'},
            {value:'50',label:'50'},
        ],
        pageSelectedOption:{name:'10',value:'10'},
        // pageSelectedOption:{name:'1',value:'1'},
        current_page:0,
        total_pages:1,
        current_from:0,
        ls_saving:false,

        total_doc_list: [],
        lastKey: {}

    }
    this.onJobChange = this.onJobChange.bind(this)
    this.onStatusChange = this.onStatusChange.bind(this)
    this.onTagChange = this.onTagChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
  }

  componentDidMount(){
    // console.log(this.model_list)
    this.init()
  }


async init(){
    console.log(">>>>>>>>Loading Process")
    this.setState({
        loading:true
    })
    var doc_status = ''
    if(this.state.statusSelectedOption.value === '3'){
        doc_status = '&&acknowledged=true'
    }else if(this.state.statusSelectedOption.value === '2'){
        doc_status = '&&acknowledged=false'
    }
    var type_status = ''
    if(this.state.tagSelectedOption.value === 'mask'){
        type_status = '&&type=mask'
    }else if(this.state.tagSelectedOption.value === 'helmet'){
        type_status = '&&type=helmet'
    }else if(this.state.tagSelectedOption.value === 'person'){
        type_status = '&&type=person'

    }
    const page_size = parseInt(this.state.pageSelectedOption.value)
    // console.log(this.state.statusSelectedOption.value)

    let payload = {}
    if(this.state.lastKey !==  null){
        payload = this.state.lastKey
    }
    
    await API.post('backend','/listEvent',{ body: payload }).then(res => {
            // console.log(res)
            if (res.Items){
                var _tmp_data = []

                if ( 'rowCount' in res ){                 
                    const _total_pages = Math.floor(res['rowCount']/10) + 1
                    this.setState({
                        total_pages: _total_pages
                    })
                } 

                if('LastEvaluatedKey' in res){
                    this.setState({
                        lastKey: {
                            'LastEvaluatedKey': res['LastEvaluatedKey']
                        }
                    })
                }
                res.Items.forEach((item)=>{
                    var _tmp = {}

                    // _tmp['id'] = item['time']
                    _tmp['CameraID'] = item['CameraID']
                    _tmp['TimeStamp'] = item['TimeStamp']
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
                    _tmp['label'] = item['label']
                    _tmp['video'] = item['video']
                    _tmp['origin_picture'] = item['origin_picture']
                    

                    // _tmp['ack_type'] = item.ack_type
                    _tmp['acknowledged'] = item.acknowledged
                    // _tmp['ack_bbox'] = item.ack_bbox
                    _tmp['manual_modified'] = item.manual_modified

                    const prefix = ['ack_','ack_date_','ack_bbox_']
                    TAG_LIST.forEach((t)=>{
                        prefix.forEach((pre)=>{
                            var k = pre + t 
                            if(item[k]){
                                _tmp[k] = item[k]
                            }
                        })
                    })

                    if(item['type']==='mask' && item.ack_bbox_mask){
                        _tmp['output'] = item.ack_bbox_mask
                    } else if(item['type']==='helmet' && item.ack_bbox_helmet){
                        _tmp['output'] = item.ack_bbox_helmet
                    } else if(item['type']==='person' && item.ack_bbox_person){
                        console.log("person")
                        
                        _tmp['output'] = item.ack_bbox_person
                    } else if(item.label_string){
                        _tmp['output'] = []
                        const _tmp_label = item.label_string.split('\n')
                        // console.log(_tmp_label)
                        _tmp_label.forEach((_tmp_single_bbox)=>{
                            const _json_single_bbox = _tmp_single_bbox.split(' ')
                            if(_json_single_bbox.length === 5){
                                _tmp['output'].push(_json_single_bbox)
                            }
                        })
                    }


                    _tmp_data.push(_tmp)
                });
                this.setState(
                    {
                        doc_list: _tmp_data
                    }
                )
                this.setState( (prevState) => ({ 
                    total_doc_list: [...prevState.total_doc_list, ..._tmp_data]
                }))

                this.setState({loading:false})
            }
            return res
        })
        console.log(">>>>>>>>Ending Process")
    // }


  }





  onJobChange(e){
      this.setState({
        jobSelectedOption:{
            name:e.target.value,
            value:e.target.value,
        },
        curr_job:e.target.value,
        doc_list:[]
      },()=>{
        // this.load_job_detail()
        this.init()
      })
  }

onStatusChange(e){
    this.setState({
        statusSelectedOption:{
          name:e.target.name,
          value:e.target.value,
      },
      doc_list:[]
    },()=>{
    //   this.load_job_detail()
    this.init()
    })
}

onTagChange(e){
    // console.log(this)
    var _name = ''
    if (!e.target.name){
        const _select = this.state.tagOptions.find(r => r.value === e.target.value);
        console.log("Select",_select)
        if (_select) {
            _name = _select.label
        }
    }

    this.setState({
        tagSelectedOption:{
          name:_name,
          value:e.target.value,
      },
      doc_list:[]
    },()=>{
    //   this.load_job_detail()
    this.init()
    })
}

onPageSizeChange(e){
    // console.log(e)
    this.setState({
        pageSelectedOption:{
          name:e.target.name,
          value:e.target.value,
      },
      doc_list:[]
    },()=>{
    //   this.load_job_detail()
    this.init()
    })
}

async btn_next(next_page){
    console.log('total_data:', this.state.total_doc_list)
    console.log('next_page', next_page)
    const current_page_index = next_page 

    // need more data 
    // 30 - 40   40  3 
    // 40 - 50   48  4 
    // 40 
    if( (current_page_index + 1) * 10 > this.state.total_doc_list.length ){
        console.log("Load new data")
        await this.init()
    }
    
    console.log("Showing index", current_page_index*10, " to ", (current_page_index+1)*10 )
    let tmp_data = this.state.total_doc_list.slice(
        current_page_index * 10,
        (current_page_index + 1) * 10
    );
    // reach the end 
    if(tmp_data.length !== 10){
        
        tmp_data = this.state.total_doc_list.slice(
            current_page_index * 10,
            this.state.total_doc_list.length
        );
    }
    console.log(this.state.doc_list)

    this.setState(
        {
            doc_list: tmp_data,
            current_page: next_page
        }
    )
}

  renderBBox(){
      var items = []
      this.state.doc_list.forEach((doc,index)=>{
          const b_id = 'box-'+ doc.TimeStamp
          const c_id = 'card-'+ doc.TimeStamp
          items.push(
            <Box width="600px" id={b_id} key={b_id}>
                {/* testing-{doc.TimeStamp} */}
            {/* <Box id={b_id} > */}
                <Card withHover id={c_id}>
                    <EventBBox 
                        tag={this.state.tagSelectedOption.name}
                        tag_code={this.state.tagSelectedOption.value}
                        data={doc} 
                        fault_list={this.state.fault_list}
                        object_list={this.state.object_list}
                    />
                </Card>
            </Box>
          )
      })
      return items
  }

  renderLoading(){
    return (
        <LoadingIndicator/>
        // <Alert type="warning" header="Warning header">
        //     You didn't have any alert message right now 
        //  </Alert>
    )
  }
  render(){
    const {
        state: { statusOptions,statusSelectedOption,tagSelectedOption,
            pageOptions,pageSelectedOption,current_page,total_pages},
        props: {t}
    } = this;

    return(
        <Grid container spacing={1}>
            <Grid item xs={12}>
                <Box display="flex" alignItems="center" justifyContent="space-between" width="30vw">   
                    <Button variant = "primary" onClick = {() => this.btn_next(this.state.current_page-1)}  loading={this.state.ls_loading}  disabled={ current_page  === 0 ? true : false }> {t('Prev')}  </Button>
                    <Button variant = "primary" onClick = {() => this.btn_next(this.state.current_page+1)}  loading={this.state.ls_loading}  disabled={ current_page + 1 === total_pages ? true : false }> {t('Next')} </Button>

                    <Text>Current/Total Page:</Text>
                    <Badge content={current_page+1} color="blue" />
                    {'/'}
                    <Badge content={total_pages} color="blue" />
                </Box>  
            </Grid> 
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={12}>
                <Inline>   
                    {this.renderBBox().length === 0 ?  this.renderLoading() : this.renderBBox()}
                </Inline>
            </Grid>
        </Grid>

    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ImgCard));

