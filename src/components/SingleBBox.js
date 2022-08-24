/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */
import React  from 'react';
import { connect } from 'react-redux' 
import { Stage, Layer } from 'react-konva';
// import shortid from 'shortid';
import { nanoid } from 'nanoid'
import { Image } from 'react-konva';

import Box from 'aws-northstar/layouts/Box';
import axios from 'axios'

import Rectangle from './Rectangle/Rectangle';
import RectTransformer from './Rectangle/RectTransformer';

import Grid from 'aws-northstar/layouts/Grid';
import Container from 'aws-northstar/layouts/Container';
import Inline from 'aws-northstar/layouts/Inline';
import StatusIndicator from 'aws-northstar/components/StatusIndicator';

import  RadioButton from 'aws-northstar/components/RadioButton';
import RadioGroup from 'aws-northstar/components/RadioGroup';


import './BBox.css'

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
    return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
}

const COLOR_DICT = {
  0:"red",
  1:"#8AF3AA",
  2:"yellow"
}

class URLImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
    };
  }

  componentDidMount() {
    this.loadImage();
  }

  componentDidUpdate(oldProps) {
    if (oldProps.src !== this.props.src) {
      this.loadImage();
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.handleLoad);
  }

  loadImage() {
    this.image = new window.Image();
    this.image.src = this.props.src;    
    this.image.addEventListener('load', this.handleLoad);
  }

  handleLoad = () => {
    this.setState({
      image: this.image
    });
  };

  render() {
    return (
      <Image
        width={this.props.width}
        height={this.props.high}
        image={this.state.image}
        ref={node => {
          this.imageNode = node;
        }}
      />
    );
  }
}

class SingleBBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {

        img_show_w:400,
        img_show_h:300,

        img_w:400,
        img_h:300,
        ratio:1,
        rectangles: [],
        rectCount: 0,
        rectCountName: 0,
        selectedShapeName: '',
        mouseDown: false,
        mouseDraw: false,
        newRectX: 0,
        newRectY: 0,

        fault_list:[],
        object_list:[],
 
        // selectedOption:null,
        // selectedOption_normal:null,     
        
        selectedOption:{},
        selectedOption_normal:{},
        doc_id:null,
        predict:[],
        predict_normal:[],

        opt_fault:[],
        opt_normal:[],

        current:{value:''},
        current_normal:{value:''},

        showSave:true,

        acknowledged:null,
        manual_modified:null,

        tag:this.props.tag,
        tag_code:this.props.tag_code,
        tag_status:false,

        bbox_type_dict:{},

        modified:false, 
        original_bbox:[],

        maskTag:0,
        helmetTag:0,
        rectColor:COLOR_DICT[0]


      }
      // console.log('xxxxx')
    }

    componentDidMount(){
      // console.log(this.props)

      var input_option_fault =[]
      if (this.props.fault_list) {
        this.props.fault_list.forEach((item,index)=>{
            var _tmpitem = {}
            _tmpitem['label'] = item
            _tmpitem['value'] = index
            input_option_fault.push(_tmpitem)
        })
      }

      var input_option_normal = []
      if (this.props.object_list) {
        this.props.object_list.forEach((item,index)=>{
            var _tmpitem = {}
            _tmpitem['label'] = item
            _tmpitem['value'] = index
            input_option_normal.push(_tmpitem)
        })
      }

      var original_falut 
      if(this.props.data.predict && this.props.data.predict[0]){
        original_falut = this.props.data.predict[0]
      }

      var original_normal 
      if(this.props.data.predict_normal && this.props.data.predict_normal[0]){
        original_normal = this.props.data.predict_normal[0]
      }

      this.setState({
        fault_list:this.props.fault_list,
        object_list:this.props.object_list,
        opt_fault:input_option_fault,
        opt_normal:input_option_normal,
        original_falut : original_falut,
        original_normal : original_normal
      },()=>{
          this.init()
      })

    }


    calcRatio(cW,cH,imgW,imgH){
      // console.log('cW,cH,imgW,imgH:'+cW+'|'+cH+'|'+imgW+'|'+imgH)
      var ratio = 1
      if(imgW < cW && imgH < cH){
        // console.log(1)
        // To be zoom in (w and h)
        ratio = parseFloat(Math.min(cW/imgW,cH/imgH)).toFixed(2)

      }else if(imgW >= cW && imgH >= cH){
        // console.log(2)
        // To be zoom out (w and h)
        ratio = parseFloat((Math.min(cW/imgW,cH/imgH))).toFixed(2)
      }else if(imgW < cW && imgH >= cH ){
        // console.log(3)
        // To be zoom out (h only)
        ratio = parseFloat(1/(cH/imgH)).toFixed(2)
      }else{
        // console.log(4)
        // To be zoom in (w only)
        ratio = parseFloat(1/(cW/imgW)).toFixed(2)
      }
      return ratio

    }

    query_init_bbox(item){
      const { tag_code } = this.state;
      var k = 'ack_bbox_' + tag_code
      var result = []

      // console.log(item.output)
      if(!item[k] && item.output){

        item.output.forEach((bbox) => {
          var bbox_array
          if(typeof (bbox)=='string'){
            bbox_array = bbox.split(' ');
          }else{
            bbox_array = bbox;
          }
          // const bbox_array = bbox.split(' ');
          result.push([
            parseInt(bbox_array[0]),
            parseFloat(bbox_array[1]).toFixed(2),
            parseFloat(bbox_array[2]).toFixed(2),
            parseFloat(bbox_array[3]).toFixed(2),
            parseFloat(bbox_array[4]).toFixed(2)
          ])
        })
        // if(item.doc_id=='df5debf5-9735-404c-adc4-357abe6aa6eb'){
        //   console.log('111:')
        //   console.log(result)
        // }
        return result
      }else if(item[k]){
        return item[k]
      }
      return []
    }

    init(){
      // console.log(this.props)
      // const id = this.props.data.doc_id
      const item = this.props.data

      var _tmp = {}
      _tmp['image_url'] = item.image_url

      // if (item.predict){
      //   _tmp['predict'] = item.predict
      // }else{
      //   _tmp['predict'] = []
      // }

      // if (item.predict_normal){
      //   _tmp['predict_normal'] = item.predict_normal
      // }else{
      //   _tmp['predict_normal'] = []
      // }

      _tmp['doc_id'] = item.doc_id

      // _tmp['selectedOption'] = {'value':''}
      // _tmp['selectedOption_normal'] = {'value':''}

      // _tmp['bbox']  = []

      var _p_x;
      var _p_y;
      var _p_w;
      var _p_h;
      var _color;

      var imgObj = new window.Image();
      imgObj.src = item.image_url;

      imgObj.onload = function(){
          // console.log(this.state)
          const cW = this.state.img_show_w;
          const cH = this.state.img_show_h;
          var imgW = parseInt(imgObj.width);
          var imgH = parseInt(imgObj.height);

          // console.log("img:"+imgW+"|"+imgH+"|"+item.predict)
          // console.log("ctx:"+cW+"|"+cH+"|"+item.predict)

          const ratio = this.calcRatio(cW,cH,imgW,imgH)
          imgW = ratio * imgW
          imgH = ratio * imgH

          this.setState({img_w:imgW,img_h:imgH})

          _tmp['bbox'] = []
          // console.log("===> enter !!")
          // console.log(item)

          var _map_bbox_type = this.state.bbox_type_dict

          const _bbox_data = this.query_init_bbox(item)

          this.setState({'original_bbox':_bbox_data})
          
          // item.output.forEach((bbox,index) => {
          //   console.log(bbox+'||'+index);
          //   var bbox_array = bbox.split(' ');

          _bbox_data.forEach((bbox_array,index)=>{

            // console.log(bbox_array+'||'+index);

            _p_x = bbox_array[1];
            _p_y = bbox_array[2];
            _p_w = bbox_array[3];
            _p_h = bbox_array[4];
            // _color = "red"
            _color = COLOR_DICT[bbox_array[0]]

            const _center_x = _p_x;
            const _center_y = _p_y;
            const _w = _p_w;
            const _h = _p_h;
  
            const r_x = parseInt((_center_x - (_w/2))*(imgW))
            const r_y = parseInt((_center_y - (_h/2))*(imgH))
            const r_w = parseInt(_w*(imgW));
            const r_h = parseInt(_h*(imgH));
  
            // console.log('ratio:'+ ratio)
            // console.log("imgw:"+(imgW)+"| imgh:"+imgH)
            // console.log("rect:"+r_x+"|"+r_y+"|"+r_w+"|"+r_h)

            _tmp['bbox'].push(
              {
                x:r_x,y:r_y,width:r_w,height:r_h,name:index.toString(),
                "stroke":_color,
                // "key":shortid.generate(),
                "key":nanoid(),
                "label":index.toString(),
              // "lineWidth" : "1.5"
            })

            _map_bbox_type[index] = parseInt(bbox_array[0])

          })

          // console.log(_tmp['bbox'])


          // _tmp['bbox']  = [{x:r_x,y:r_y,width:r_w,height:r_h,name:'0',
          //   "stroke":_color,
          //   "key":shortid.generate(),
          //   "label":'0',
          //   // "lineWidth" : "1.5"
          // }]


          var _acknowledged
          if (item.acknowledged){
            _acknowledged = item.acknowledged
          }else{
            _acknowledged = false
          }

          var _manual_modified
          if (item.manual_modified){
            _manual_modified= item.manual_modified
          }else{
            _manual_modified = false
          }


          this.setState({
            bbox_type_dict:_map_bbox_type,
            ratio:ratio,
            img: _tmp['image_url'],
            rectangles: _tmp['bbox'],
            rectCount: _tmp['bbox'].length,
            rectCountName: _tmp['bbox'].length,
            // fault_list:_tmp['fault_list'],
            // object_list:_tmp['object_list'],
            selectedOption:_tmp['selectedOption'],
            selectedOption_normal:_tmp['selectedOption_normal'],
            doc_id:_tmp['doc_id'],
            predict:_tmp['predict'],
            predict_normal:_tmp['predict_normal'],
            acknowledged:_acknowledged,
            manual_modified:_manual_modified
          },()=>{
            // this.setState({loading:false})
            // console.log('++++++++++++++++++++++++++++')
            // console.log(_tmp)
            // console.log(this.state)
          }) 

        }.bind(this);
    }

  


    handleStageMouseDown = (event) => {
      const { rectangles } = this.state;
      // clicked on stage - clear selection or ready to generate new rectangle
      if (event.target.className === 'Image') {
        const stage = event.target.getStage();
        const mousePos = stage.getPointerPosition();
        this.setState({
          mouseDown: true,
          newRectX: mousePos.x,
          newRectY: mousePos.y,
          selectedShapeName: '',
        });
        return;
      }

      // clicked on transformer - do nothing
      if(event.target.getParent() && event.target.getParent().className === 'Transformer'){
        return;
      }

      // const clickedOnTransformer = event.target.getParent().className === 'Transformer';
      // if (clickedOnTransformer) {
      //   return;
      // }
  
      // find clicked rect by its name
      const name = event.target.name();
      const rect = rectangles.find(r => r.name === name);
      // console.log('==> handleStageMouseDown')
      // console.log(name)
      // console.log(rect)
      if (rect) {
        this.setState({
          selectedShapeName: name,
          rectangles,
        });
      } else {
        this.setState({
          selectedShapeName: '',
        });
      }
    };
  
    handleRectChange = (index, newProps) => {
      // console.log('>> handleRectChange')
      const { rectangles } = this.state;
      rectangles[index] = {
        ...rectangles[index],
        ...newProps,
      };
  
      this.setState({ rectangles });
    };
  
    handleNewRectChange = (event) => {
      const {
        rectangles, rectCount, newRectX, newRectY,ratio, bbox_type_dict,rectCountName
      } = this.state;
      const stage = event.target.getStage();
      const mousePos = stage.getPointerPosition();

      // console.log(rectCountName)
      // console.log(rectangles[rectCountName])
      // console.log(tag_status)
      // console.log(tag_status? COLOR_DICT[0]:COLOR_DICT[1])
      if (!rectangles[rectCountName]) {
        rectangles.push({
          x: newRectX,
          y: newRectY,
          width: mousePos.x - newRectX,
          height: mousePos - newRectY,
          // name: `rect${rectCount + 1}`,
          // name: `${rectCount}`,
          name: `${rectCountName}`,
          // stroke: '#00A3AA',
          // stroke: tag_status? COLOR_DICT[0]:COLOR_DICT[1],
          stroke: this.state.rectColor,
          // key: shortid.generate(),
          "key":nanoid(),
          // label: `${rectCount}`,
          label: `${rectCountName}`,
          confidence:0,
          ratio:ratio
        });

        // bbox_type_dict[`${rectCount}`] = tag_status? 0:1
        // bbox_type_dict[`${rectCountName}`] = tag_status? 0:1
        console.log('tag_code ==>')
        console.log('tag_code ==>')
        console.log('tag_code ==>')
        console.log(this.props)
        console.log(this.state)
        if(this.props.tag_code === 'mask'){
          bbox_type_dict[`${rectCountName}`] = this.state.maskTag
        }else if(this.props.tag_code === 'helmet'){
          bbox_type_dict[`${rectCountName}`] = this.state.helmetTag
        }else{
          bbox_type_dict[`${rectCountName}`] = 0
        }        

        // const _rectCountName = rectCountName + 1
        

        return this.setState({ rectangles,mouseDraw: true , modified:true});
      }
      rectangles[rectCount].width = mousePos.x - newRectX;
      rectangles[rectCount].height = mousePos.y - newRectY;

      return this.setState({ rectangles });
      
    };
  
    handleStageMouseUp = () => {
      const { rectCount, mouseDraw ,rectCountName } = this.state;
      if (mouseDraw) {
        this.setState({ rectCount: rectCount + 1,rectCountName: rectCountName + 1 , mouseDraw: false , modified:true});
        // this.setState({ rectCount: rectCount + 1, mouseDraw: false });
        // this.setState({ mouseDraw: false });
      }
      this.setState({ mouseDown: false });
    };
  

    set_shape = (result, msg) => {
      this.props.send_shape(msg)
    }


    onChange_fault(event){
      this.setState({
        selectedOption:event.target,
        selectedOption_normal:{},
      })
    }

    onChange_normal(event){
      this.setState({
        selectedOption_normal:event.target,
        selectedOption:{},
      })
  }

  trans_bbox(bbox,type_dict){
    // console.log(bbox)
    var _bbox = []
    bbox.forEach((item) => {
      const x = item.x
      const y = item.y
      const w = item.width
      const h = item.height
      const img_w = this.state.img_w
      const img_h = this.state.img_h

      const center_x = parseFloat((x + w/2)/img_w).toFixed(2);
      const center_y = parseFloat((y + h/2)/img_h).toFixed(2);
      const _w = parseFloat(w/img_w).toFixed(2);
      const _h = parseFloat(h/img_h).toFixed(2);
      _bbox.push([type_dict[item.name], parseFloat(center_x),parseFloat(center_y),parseFloat(_w),parseFloat(_h)])
    })
    return _bbox
  }

  save(){
    const { rectangles, bbox_type_dict ,tag_code,modified,original_bbox } = this.state;

    // this.setState({acknowledged:true})

    const docid = this.state.doc_id
    // console.log(this.state.rectangles)
    // console.log(this.state.bbox_type_dict)
    const _bbox = this.trans_bbox(rectangles,bbox_type_dict)
    // console.log(_bbox)

    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);

    var payload = {}
    payload['acknowledged'] = true
    // payload['ack_type'] = 'abnormal'
    var k = 'ack_' + tag_code
    payload[k] = true
    k = 'ack_date_' + tag_code
    payload[k] = today.toISOString(); 
    k = 'ack_bbox_' + tag_code
    payload[k] = _bbox

    if(modified || original_bbox !== _bbox){
      payload['manual_modified'] = modified
    }


    console.log(payload)
    console.log(payload)
    console.log(payload)
    console.log(payload)



    const HEADERS = {'Content-Type': 'application/json'};
    // const apiUrl = '/save_verified_result'+'/'+ docid;
    const apiUrl = `/save_verified_result/${docid}`;
    // console.log(apiUrl)
    var result = "";

    axios({ method: 'POST', url: apiUrl , data: payload ,headers: HEADERS}).then(response => {
        // console.log(response);
        if (response.status === 200) {
            result = "Save result successfully !"
            this.setState({
              current:this.state.selectedOption,
              current_normal:this.state.selectedOption_normal,
              // showSave:false
            },()=>{
              alert(result)
            })
        } else {
            result = "Save result error !"
            alert(result)
        }
        // console.log(result)
    })


  }

  removebbox(){

  }

  removeOne(){
      const {
        rectangles,selectedShapeName,bbox_type_dict
      } = this.state;

      // console.log(selectedShapeName)
      if ( selectedShapeName  && selectedShapeName !== ''){
        const rect = rectangles.find(r => r.name === selectedShapeName);
        if (rect) {
          var _rectangles = [];
          rectangles.forEach((item)=>{
            if (item.name !== selectedShapeName) {
              _rectangles.push(item)
            }
          })
          
          if( bbox_type_dict[selectedShapeName] ) delete bbox_type_dict[selectedShapeName];

          this.setState({
            modified:true,
            selectedShapeName: '',
            rectangles:_rectangles,
            rectCount:_rectangles.length,
            bbox_type_dict
          });
        } 
      }
  }

  removeAll(){

    this.setState({
          modified:true,
          selectedShapeName: '',
          rectangles:[],
          rectCount:0,
          rectCountName:0,
          bbox_type_dict:{}
        });
}

onToggleChange(e){
  // console.log(e)
  this.setState({tag_status:e})
}

onMaskChange(e){
  console.log(e)
  this.setState({
    maskTag:parseInt(e.target.value),
    rectColor:COLOR_DICT[parseInt(e.target.value)]
  })
}

onHelmetChange(e){
  console.log(e)
  this.setState({
    helmetTag:parseInt(e.target.value),
    rectColor:COLOR_DICT[parseInt(e.target.value)]
  })
}

  renderBBox(){

//     <RadioGroup
//     items={[
//         <RadioButton value="one">one</RadioButton>, 
//         <RadioButton value="two">two</RadioButton>,
//         <RadioButton value="three">three</RadioButton>,
//         <RadioButton value="disabled" disabled>disabled</RadioButton>,
//         <RadioButton value="with description" description="Here is a description">with description</RadioButton>,
//     ]}
// />


    var items = []
    this.state.rectangles.forEach((doc)=>{
        // console.log(doc)
        // console.log(index)
        // const c_id = 'card-'+index
        items.push(
            <RadioButton value={doc.name} onChange={() => {}}>{"["+doc.name+"]"}</RadioButton>
        )
    })
    return <RadioGroup items={items} />
}

renderRadioGroup(){
  // console.log("  ========  ")
  // console.log(this.props.tag)
  // console.log(this.props.tag_code)
  var items = []
  if(this.props.tag_code === 'mask'){
    items.push(
      <Grid container>
          <RadioGroup
            items={[
                <RadioButton key="" value="0" onChange={(e) =>{this.onMaskChange(e)}}>mask(red)</RadioButton>, 
                <RadioButton key="" value="1" onChange={(e) =>{this.onMaskChange(e)}}>face(green)</RadioButton>,
            ]}
            value={this.state.maskTag.toString()}
          />
      </Grid>     
    )
  }else{
    items.push(
      <Grid container>
          <RadioGroup
            items={[
                <RadioButton key="" value="0" onChange={(e) =>{this.onHelmetChange(e)}}>person(red)</RadioButton>, 
                <RadioButton key="" value="1" onChange={(e) =>{this.onHelmetChange(e)}}>head(green)</RadioButton>,
                <RadioButton key="" value="2" onChange={(e) =>{this.onHelmetChange(e)}}>helmet(yellow)</RadioButton>,
            ]}
            value={this.state.helmetTag.toString()}
          />
      </Grid>     
    )
  }


  return items
}
  

    render(){
      const {
        state: { rectangles, selectedShapeName, mouseDown ,manual_modified,acknowledged},
        handleStageMouseDown,
        handleNewRectChange,
        handleRectChange,
        handleStageMouseUp,
      } = this;

      // img_show_w:300,
      // img_show_h:400,
      const c_id = 'bbox'+this.props.data.doc_id

      console.log(this.props.data.doc_id)
      console.log(this.props.data.acknowledged)

      let status_ack = null;
      if (acknowledged) {
        status_ack = <StatusIndicator statusType="positive">Verified</StatusIndicator>;
      } else {
        status_ack = <StatusIndicator statusType="warning">Waiting</StatusIndicator>;
      }
  
      let status_modified = null;
      if (manual_modified) {
        status_modified = <StatusIndicator statusType="info">Modified</StatusIndicator>;
      }
      

      return (
        <Container headingVariant="h4" title={this.props.data.doc_id}>
          <Grid container spacing={3}>
            <Grid item xs={8}>
              {/* <Box display="flex" bgcolor='grey.100'  alignItems="center" justifyContent="center"> */}
              <Box display="flex" alignItems="center" justifyContent="center">
                <div id={c_id}>
                  <Stage  
                    ref={(node) => {
                      this.stage = node;
                    }}
                    container={c_id}
                    width={this.state.img_show_w}
                    height={this.state.img_show_h}
                    onMouseDown={handleStageMouseDown}
                    onTouchStart={handleStageMouseDown}
                    onMouseMove={mouseDown && handleNewRectChange}
                    onTouchMove={mouseDown && handleNewRectChange}
                    onMouseUp={mouseDown && handleStageMouseUp}
                    onTouchEnd={mouseDown && handleStageMouseUp}
                    id="myCanvas"
                  >
                      <Layer>
                          <URLImage 
                              src={this.state.img} 
                              width={this.state.img_w} 
                              high={this.state.img_h} 
                          />
                      </Layer>
                      <Layer>
                        {rectangles.map((rect, i) => (
                          <Rectangle
                            sclassName="rect"
                            key={rect.key}
                            {...rect}
                            onTransform={(newProps) => {
                              handleRectChange(i, newProps);
                            }}
                          />
                        ))}
                        <RectTransformer selectedShapeName={selectedShapeName} /> 
                      </Layer>
                  </Stage>
                </div>
              </Box>
            {/* </Column> */}
            {/* <Column key="column2"> */}
            </Grid>
            <Grid item xs={4}>
              <Grid container>
              <Grid item xs={12}>
                  {this.renderRadioGroup()}
              </Grid>
                {/* <Grid item xs={12}>
                        <Inline>
                          <Toggle label={tag+':'+tag_status} checked={tag_status} onChange={(e)=>this.onToggleChange(e)} />
                        </Inline>
                </Grid> */}
                <Grid item xs={12}>
                      {/* </FormField>
                        <FormField label="" controlId="formFieldId1"> */}
                        {/* </FormField> */}
                        <Inline>
                          <button className="btn" disabled={!this.state.showSave} onClick={(e) => this.removeOne(e)}>Remove Current</button>
                          {/* <Button disabled={!this.state.showSave} onClick={(e) => this.removeOne(e)}  >Remove Current</Button> */}
                        </Inline>
                        </Grid>
                <Grid item xs={12}>
                        <Inline>
                          <button className="btn" disabled={!this.state.showSave} onClick={(e) => this.removeAll(e)}>Remove All</button>
                          {/* <Button disabled={!this.state.showSave} onClick={(e) => this.removeAll(e)}  >Remove All</Button> */}
                        </Inline>
                        </Grid>
                <Grid item xs={12}>
                        <Inline>
                          <button className="btn" disabled={!this.state.showSave} onClick={(e) => this.save(e)}>Confirm Data</button>
                          {/* <Button size="large" disabled={!this.state.showSave} onClick={(e) => this.save(e)}  >Confirm Data</Button> */}
                          </Inline>
                          </Grid>
                <Grid item xs={12}>
                          {status_ack} 
                          {status_modified}
                          </Grid>
                </Grid>            
                    {/* </FormSection> */}
                {/* </Form> */}
              {/* </Box> */}
            </Grid>
          </Grid>
      </Container>
      );
    }
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(SingleBBox));


