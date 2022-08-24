import Inline from 'aws-northstar/layouts/Inline';
import React  from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'
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

// function load_url(id,url,predict,color){
//     var c = document.getElementById(id)
//     if (c){
//         var ctx = c.getContext("2d");
//         const cW = c.offsetWidth;    // 获取元素宽度
//         const cH = c.offsetHeight;   // 获取元素高度
         
//         ctx.fillStyle='#000a0a';
//         ctx.fillRect(0,0,cW,cH);

//         var imgObj = new Image();
//         imgObj.src = url;
//         imgObj.onload = function(){
//             const imgW = imgObj.width;
//             const imgH = imgObj.height;
//             // console.log("img:"+imgW+"|"+imgH+"|"+predict)
//             // console.log("ctx:"+cW+"|"+cH+"|"+predict)
            
//             if (imgW > imgH){
//                 const n =  cW / imgW
//                 const y = (cH / 2) - ((imgH/2) * (n))
//                 ctx.drawImage(this,0,y,cW,(imgH*n))
//             }else{
//                 const n =  cH / imgH
//                 const x = (cW / 2) - ((imgW/2) * (n))
//                 ctx.drawImage(this,x,0,(imgW*n),cH)

//                 if (predict) {
//                     const _center_x = predict[1];
//                     const _center_y = predict[2];
//                     const _w = predict[3];
//                     const _h = predict[4];

//                     const r_x = (_center_x - (_w/2)) * (imgW*n);
//                     const r_y = (_center_y - (_h/2)) * cH;
//                     const r_w = _w * (imgW*n);
//                     const r_h = _h * cH;

//                     // console.log(r_x,'|',r_y,'|',r_w,'|',r_h,'|')

//                     ctx.strokeStyle = color;
//                     ctx.lineWidth = 1.5;
//                     ctx.strokeRect((x+r_x),r_y,r_w,r_h);
//                 }
                
//             }
            
//         }
//     }
// };

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
        tagSelectedOption:{name:'口罩',value:'mask'},

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
        current_page:1,
        total_pages:1,
        current_from:0,
        ls_saving:false

    }
    this.onJobChange = this.onJobChange.bind(this)
    this.onStatusChange = this.onStatusChange.bind(this)
    this.onTagChange = this.onTagChange.bind(this)
    this.onPageSizeChange = this.onPageSizeChange.bind(this)
  }

  componentDidMount(){
    // console.log(this.model_list)
    this.setState({loading:true},()=>{
        this.init()
    })
  }


init(){
    // if(this.state.curr_job){
        // const id = this.state.curr_job
        // console.log(this.state.statusSelectedOption)

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
        // const url = '/list_event/'+'?from='+this.state.current_from+'&&size='+page_size+doc_status+type_status
        const url = `/list_event/?from=${this.state.current_from}&&size=${page_size}${doc_status}${type_status}`
        // console.log(this.state.statusSelectedOption.value)
        API.get('backend','/event').then(res => {
                // console.log(res)
                if (res){
                    console.log(res)
                    // console.log(res.data)
                    var _tmp_data = []
                    const _total_docs = res.length
                    const _page_size = parseInt(this.state.pageSelectedOption.value)
                    const _total_pages = Math.floor(_total_docs/_page_size) + 1
                    res.forEach((item)=>{
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

                        // console.log(item)                        
                        if(item['type']==='mask' && item.ack_bbox_mask){
                            _tmp['output'] = item.ack_bbox_mask
                        } else if(item['type']==='helmet' && item.ack_bbox_helmet){
                            _tmp['output'] = item.ack_bbox_helmet
                        } else if(item['type']==='person' && item.ack_bbox_person){
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

                            // _tmp['output'] = JSON.parse(result)
                            // console.log(item._source.label_string)
                            // console.log(_tmp['output'])
                        }


                        _tmp_data.push(_tmp)
                    });
                    this.setState({
                        doc_list:_tmp_data,
                        total_docs: _total_docs,
                        total_pages : _total_pages,
                        current_page:1,
                        current_from:0,
                    },()=>{
                        this.setState({loading:false})
                    })
                }
                // console.log(this.state.model_list)
                return res
            })
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

btn_prev(){
    var currPage = this.state.current_page;
    if(currPage > 1){
        var from = this.state.current_from - parseInt(this.state.pageSelectedOption.value);
        this.setState({
            current_page: currPage - 1,
            current_from: from,
            doc_list: []
        },()=>{
            // this.load_job_detail()
            this.init()
        })
    }
}
btn_next(){
    var currPage = this.state.current_page;
    if(currPage < this.state.total_pages){
        var from = this.state.current_from + parseInt(this.state.pageSelectedOption.value);
        this.setState({
            current_page: currPage + 1,
            current_from: from,
            doc_list: []
        },()=>{
            // this.load_job_detail()
            this.init()
        })
    }
}

  renderBBox(){
      var items = []
      this.state.doc_list.forEach((doc,index)=>{
          const b_id = 'box-'+index
          const c_id = 'card-'+index
          items.push(
            <Box width="600px" id={b_id} >
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

  render(){
    const {
        state: { statusOptions,statusSelectedOption,tagSelectedOption,
            pageOptions,pageSelectedOption,current_page,total_pages},
        props: {t}
    } = this;

    return(
        <Grid container>
            <Grid item xs={12}>
                <Inline>   
                    {/* <KeyValuePair label="Job_id:"></KeyValuePair>
                    <Select placeholder={'Choose job'} 
                        statusType={this.state.job_loading} 
                        loadingText="Loading job list" 
                        options={jobOptions}
                        selectedOption={jobSelectedOption}
                        onChange={this.onJobChange}
                    /> */}
                    <KeyValuePair label="Status:"></KeyValuePair>
                    <Select placeholder={'Choose an image status'} 
                        options={statusOptions}
                        selectedOption={statusSelectedOption}
                        onChange={this.onStatusChange}
                    />
                    <KeyValuePair label="Tag:"></KeyValuePair>
                    {/* <Select placeholder={'Choose an bot tag'} 
                        options={tagOptions}
                        selectedOption={tagSelectedOption}
                        onChange={this.onTagChange}
                    /> */}
                    {/* <Translation> */}
                        <Select placeholder={'Choose an bot tag'} 
                            options={[{value:'mask',label:t('mask')},{value:'helmet',label:t('helmet')},{value:'person',label:t('person')}]}
                            selectedOption={tagSelectedOption}
                            onChange={this.onTagChange}
                        />
                    {/* </Translation> */}

                {/* </Inline>
            </Grid>
            <Grid item xs={12}>
                <Inline>    */}
                    <KeyValuePair label="Page_Size:"></KeyValuePair>
                    <Select placeholder={'Choose page size'} 
                        options={pageOptions}
                        selectedOption={pageSelectedOption}
                        onChange={this.onPageSizeChange}
                    />
                    <Button variant = "primary" onClick = {() => this.btn_prev()}  loading={this.state.ls_loading} > {t('Prev')}  </Button>
                    <Button variant = "primary" onClick = {() => this.btn_next()}  loading={this.state.ls_loading} > {t('Next')} </Button>

                    <KeyValuePair label="Current/Total Page:"></KeyValuePair>
                    <Badge content={current_page} color="blue" />
                    {'/'}
                    <Badge content={total_pages} color="blue" />
                </Inline>  
            </Grid>
            <Grid item xs={12}>
                <Inline>   
                    {this.renderBBox()}
                </Inline>
            </Grid>
        </Grid>

    )
  }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ImgCard));

