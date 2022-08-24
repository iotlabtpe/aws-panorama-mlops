/* eslint-disable react/sort-comp */
/* eslint-disable react/no-multi-comp */
import Inline from 'aws-northstar/layouts/Inline';
import React  from 'react';
import { connect } from 'react-redux' 
import axios from 'axios'

// import { createHashHistory } from 'history';

import Box from 'aws-northstar/layouts/Box'
import Card from 'aws-northstar/components/Card'
import Grid from 'aws-northstar/layouts/Grid';
import SingleBBox from './SingleBBox'


import Select from 'aws-northstar/components/Select';
import Button from 'aws-northstar/components/Button';
import KeyValuePair from 'aws-northstar/components/KeyValuePair';
import Badge from 'aws-northstar/components/Badge';

// import { t } from 'i18next';

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
        // tagOptions:[
        //     {value:'1',label:'口罩'},
        //     {value:'2',label:'安全帽'}
        // ],
        tagOptions:[
            {value:'mask',label:'口罩'},
            {value:'helmet',label:'安全帽'}
        ],        
        // tagSelectedOption:{name:'口罩',value:'1'},
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
        // this.init()
        this.init_JobList()
    })
  }


  init_JobList(){
    axios.get('/listinference', {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            // console.log(res.data)
            var _tmp_data = []
            var _tmp_job_option = []
            res.data.forEach((item)=>{
                var _tmp = {}
                _tmp['job_id'] = item['job_id']
                _tmp_data.push(_tmp)
                _tmp_job_option.push({
                    label: item['job_id'],
                    value: item['job_id']
                })
            });

            var _curr_job
            var _tmp_job_select
            // console.log(_tmp_data)
            if(_tmp_data.length > 0){
                _curr_job = _tmp_data[_tmp_data.length-1].job_id
                _tmp_job_select = {
                    name:_tmp_data[_tmp_data.length-1].job_id,
                    value:_tmp_data[_tmp_data.length-1].job_id
                }
            }



            this.setState({
                job_list: _tmp_data,
                curr_job: _curr_job,
                jobOptions: _tmp_job_option,
                job_loading: 'finished',
                jobSelectedOption:_tmp_job_select
            },()=>{
                // this.setState({loading:false})
                this.load_meta_detail()

            })
        }
        // console.log(this.state.model_list)
        return res.data
    })
  }

  load_meta_detail(){
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
                    this.load_job_detail()
                })
            }else{
                return null
            }
        }
    })
  }

load_job_detail(){
    if(this.state.curr_job){
        const id = this.state.curr_job
        var doc_status = ''
        if(this.state.statusSelectedOption.value === '3'){
            doc_status = '&&acknowledged=true'
        }else if(this.state.statusSelectedOption.value === '2'){
            doc_status = '&&acknowledged=false'
        }

        const page_size = parseInt(this.state.pageSelectedOption.value)
        const url = '/get_job_detail/'+ id +'?from='+this.state.current_from+'&&size='+page_size+doc_status
        // console.log(url)
        axios.get(url, {dataType: 'json'}).then(res => {
                // console.log(res)
                if (res.data){
                    // console.log(res.data)
                    var _tmp_data = []
                    const _total_docs = res.data.total
                    const _page_size = parseInt(this.state.pageSelectedOption.value)
                    const _total_pages = Math.floor(_total_docs/_page_size) + 1
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

                        // _tmp['ack_type'] = item._source.ack_type
                        _tmp['acknowledged'] = item._source.acknowledged
                        // _tmp['ack_bbox'] = item._source.ack_bbox
                        _tmp['manual_modified'] = item._source.manual_modified

                        const prefix = ['ack_','ack_date_','ack_bbox_']
                        TAG_LIST.forEach((t)=>{
                            prefix.forEach((pre)=>{
                                var k = pre + t 
                                if(item._source[k]){
                                    _tmp[k] = item._source[k]
                                }
                            })
                        })

                        // console.log(item._source.output)
                        
                        // const searchRegExp = /\'/g;
                        // const replaceWith = '\"';
                        // const result = item._source.output.replace(searchRegExp, replaceWith);
                        // _tmp['output'] = JSON.parse(result)

                        if(item._source.ack_bbox_mask){
                            _tmp['output'] = item._source.ack_bbox_mask
                        } else if(item._source.ack_bbox_helmet){
                            _tmp['output'] = item._source.ack_bbox_helmet
                        // } else if(item._source.label_string){
                        } else if(item._source.output){
                            // _tmp['output'] = []
                            // const searchRegExp = /\'/g;
                            // const replaceWith = '\"';
                            // const result = item._source.output.replace(searchRegExp, replaceWith);
                            // _tmp['output'] = JSON.parse(result)

                            // console.log('==> output:')
                            // console.log(item._source.output)
                            // _tmp['output'] = JSON.parse(item._source.output)

                            _tmp['output'] = []
                            // const searchRegExp = /\'/g;
                            // const replaceWith = '\"';
                            const searchRegExp = /'/g;
                            const replaceWith = '"';
                            const result = item._source.output.replace(searchRegExp, replaceWith);
                            
                            const _tmp_label = JSON.parse(result)
                            // console.log(_tmp_label)
                            _tmp_label.forEach((_tmp_single_bbox)=>{
                                // const _json_single_bbox = _tmp_single_bbox.split(' ')
                                // if(_json_single_bbox.length==5){
                                //     _tmp['output'].push(_json_single_bbox)
                                // }
                                _tmp['output'].push(_tmp_single_bbox)
                            })

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
                return res.data
            })
    }


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
        this.load_job_detail()
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
      this.load_job_detail()
    })
}

onTagChange(e){
    console.log(e)
    console.log(this)
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
      this.load_job_detail()
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
      this.load_job_detail()
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
            this.load_job_detail()
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
            this.load_job_detail()
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
                    <SingleBBox 
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
        state: {jobOptions,jobSelectedOption,statusOptions,statusSelectedOption,tagSelectedOption,
            pageOptions,pageSelectedOption,current_page,total_pages},
            props: {t}
    } = this;


    return(
        <Grid container>
            <Grid item xs={12}>
                <Inline>   
                    <KeyValuePair label="Job_id:"></KeyValuePair>
                    <Select placeholder={'Choose job'} 
                        statusType={this.state.job_loading} 
                        loadingText="Loading job list" 
                        options={jobOptions}
                        selectedOption={jobSelectedOption}
                        onChange={this.onJobChange}
                    />
                    <KeyValuePair label="Status:" ></KeyValuePair>
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
                    <Select placeholder={'Choose an bot tag'} 
                            options={[{value:'mask',label:t('mask')},{value:'helmet',label:t('helmet')}]}
                            selectedOption={tagSelectedOption}
                            onChange={this.onTagChange}
                    />
                </Inline>
            </Grid>
            <Grid item xs={12}>
                <Inline>   
                    <KeyValuePair label="Page_Size:"></KeyValuePair>
                    <Select placeholder={'Choose page size'} 
                        options={pageOptions}
                        selectedOption={pageSelectedOption}
                        onChange={this.onPageSizeChange}
                    />
                    <Button variant = "primary" onClick = {() => this.btn_prev()} icon="SkipPreviousRounded" loading={this.state.ls_loading} > {t('Prev')}  </Button>
                    <Button variant = "primary" onClick = {() => this.btn_next()} icon="SkipNextRounded" loading={this.state.ls_loading} > {t('Next')} </Button>

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


