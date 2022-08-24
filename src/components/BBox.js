/* eslint-disable no-alert */
/* eslint-disable react/no-multi-comp */
import React  from 'react';
import { connect } from 'react-redux' 
import { Stage, Layer } from 'react-konva';
// import shortid from 'shortid';
import { nanoid } from 'nanoid'

import { Image } from 'react-konva';
import ColumnLayout from 'aws-northstar/layouts/ColumnLayout';
import { Column } from 'aws-northstar/layouts/ColumnLayout';
import Box from 'aws-northstar/layouts/Box';
import Button from 'aws-northstar/components/Button';
import axios from 'axios'
import Select from 'aws-northstar/components/Select';
import Form from 'aws-northstar/components/Form';
import FormField from 'aws-northstar/components/FormField'
import FormSection from 'aws-northstar/components/FormSection';

import Rectangle from './Rectangle/Rectangle';
import RectTransformer from './Rectangle/RectTransformer';

import {withTranslation} from 'react-i18next'

const mapStateToProps = state => {
    return { session: state.session }
}
const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
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

class BBox extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        img_show_w:600,
        img_show_h:600,
        img_w:300,
        img_h:300,
        rectangles: [],
        rectCount: 0,
        selectedShapeName: '',
        mouseDown: false,
        mouseDraw: false,
        newRectX: 0,
        newRectY: 0,

        fault_list:[],
        object_list:[],
        
        selectedOption:{},
        selectedOption_normal:{},
        doc_id:'',
        predict:[],
        predict_normal:[],

        opt_fault:[],
        opt_normal:[],

        current:{value:''},
        current_normal:{value:''},

        showSave:false

      }
    }

    componentDidMount(){
      axios.get('/get_meta', {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            // console.log(res)
            // console.log(res.data)
            if (res.status === 200){
              var input_option_fault = []
              var input_option_normal = []

              if (res.data.fault_list) {
                res.data.fault_list.forEach((item,index)=>{
                    var _tmpitem = {}
                    _tmpitem['label'] = item
                    _tmpitem['value'] = index
                    input_option_fault.push(_tmpitem)
                })
              }
              if (res.data.object_list) {
                res.data.object_list.forEach((item,index)=>{
                    var _tmpitem = {}
                    _tmpitem['label'] = item
                    _tmpitem['value'] = index
                    input_option_normal.push(_tmpitem)
                })
              }
              this.setState({
                  fault_list:res.data.fault_list,
                  object_list:res.data.object_list,
                  opt_fault:input_option_fault,
                  opt_normal:input_option_normal
              },()=>{
                  this.init()
              })
            }else{
                return null
            }
        }
    })

    }


    init(){
      const id = this.props.match.params.id
      axios.get('/get_doc/'+id, {dataType: 'json'}).then(res => {
        // console.log(res)
        if (res.data){
            res.data.forEach((item)=>{
              // console.log(item)
              var _tmp = {}
              _tmp['image_url'] = item._source.image_url

              if (item._source.predict){
                _tmp['predict'] = item._source.predict
              }else{
                _tmp['predict'] = []
              }

              if (item._source.predict_normal){
                _tmp['predict_normal'] = item._source.predict_normal
              }else{
                _tmp['predict_normal'] = []
              }

              // _tmp['predict_normal'] = item._source.predict_normal
              _tmp['doc_id'] = item._id
              // _tmp['fault_list'] = item._source.fault_list
              // _tmp['object_list'] = item._source.object_list

              _tmp['selectedOption'] = {'value':''}
              _tmp['selectedOption_normal'] = {'value':''}
              _tmp['bbox']  = []

              var _p_x;
              // var _p_y;
              var _p_w;
              var _p_h;
              var _color;

              if (item._source.predict && item._source.predict[0]){
                  _tmp['selectedOption'] = {
                      'value':item._source.predict[0].toString()
                  }
                  _p_x = item._source.predict[1];
                  // _p_y = item._source.predict[2];
                  _p_w = item._source.predict[3];
                  _p_h = item._source.predict[4];
                  _color = "yellow"
                }
              
              if (item._source.predict_normal && item._source.predict_normal[0]){
                  _tmp['selectedOption_normal'] = {
                      'value':item._source.predict_normal[0].toString()
                  }
                  _p_x = item._source.predict_normal[1];
                  // _p_y = item._source.predict_normal[2];
                  _p_w = item._source.predict_normal[3];
                  _p_h = item._source.predict_normal[4];
                  _color = "#8AF3AA"

              }

              // console.log(_p_x+'|'+_p_y)

              var imgObj = new window.Image();
              imgObj.src = item._source.image_url;

              imgObj.onload = function(){
                  // console.log('....>>>> enter onload ')
                  // console.log(this.state)
                  const cW = this.state.img_show_w;
                  const cH = this.state.img_show_h;
                  const imgW = imgObj.width;
                  const imgH = imgObj.height;

                  // console.log("img:"+imgW+"|"+imgH+"|"+item._source.predict)
                  // console.log("ctx:"+cW+"|"+cH+"|"+item._source.predict)
                  
                  if (imgW > imgH){
                      const n =  cW / imgW
                      // const y = (cH / 2) - ((imgH/2) * (n))
                      // // ctx.drawImage(this,0,y,cW,)
                      this.setState({img_w:cW,img_h:(imgH*n)})
                      
                  }else{
                      const n =  cH / imgH
                      // const x = (cW / 2) - ((imgW/2) * (n))
                      // // ctx.drawImage(this,x,0,(imgW*n),cH)
                      this.setState({img_w:(imgW*n),img_h:cH})

                      const _center_x = _p_x;
                      const _center_y = _p_x;
                      const _w = _p_w;
                      const _h = _p_h;
                  
    
                      const r_x = (_center_x - (_w/2)) * (imgW*n);
                      const r_y = (_center_y - (_h/2)) * cH;
                      const r_w = _w * (imgW*n);
                      const r_h = _h * cH;
    
                      _tmp['bbox']  = [{x:r_x,y:r_y,width:r_w,height:r_h,name:'0',
                        "stroke":_color,
                        // "key":shortid.generate(),
                        "key": nanoid(),
                        "label":'0'
                      }]

                      this.setState({
                        img: _tmp['image_url'],
                        rectangles: _tmp['bbox'],
                        rectCount: _tmp['bbox'].length,
                        // fault_list:_tmp['fault_list'],
                        // object_list:_tmp['object_list'],
                        selectedOption:_tmp['selectedOption'],
                        selectedOption_normal:_tmp['selectedOption_normal'],
                        doc_id:_tmp['doc_id'],
                        predict:_tmp['predict'],
                        predict_normal:_tmp['predict_normal'],

                      },()=>{
                        // console.log(this.state)
                      })
                      
                  }
              }.bind(this)
            });

        }
        // console.log(this.state.model_list)
        return res.data
      })

  
    }

  

    // drawbox(boxarray,cW,cH,imgW,imgH){
      drawbox(boxarray,cW,cH,imgW){
      const ratio = cW/imgW
      this.setState({ratio:ratio},()=>{
        var box0 = []
        // var box = boxarray
        boxarray.map((box,_i) => {
          // console.log(box)
          var arr_x = [box[0][0],box[1][0],box[2][0],box[3][0]]
          var arr_y = [box[0][1],box[1][1],box[2][1],box[3][1]]
          var x_min = Math.min.apply(null, arr_x);
          var x_max = Math.max.apply(null, arr_x);
          var y_min = Math.min.apply(null, arr_y);
          var y_max = Math.max.apply(null, arr_y);
          // console.log("x="+x_min+",y="+y_min+",w="+(x_max-x_min)+",h="+(y_max-y_min))
          // console.log("ratio=" + cW/imgW )
          // console.log(shape)
          // console.log("==> x="+x_min*ratio+",y="+y_min*ratio+",w="+(x_max-x_min)*ratio+",h="+(y_max-y_min)*ratio)
          const name = ""+_i
          var _tmp =  {
            "x":(x_min)*ratio,
            "y":(y_min)*ratio,
            "width":(x_max-x_min)*ratio,
            "height":(y_max-y_min)*ratio,
            "name":name,
            "stroke":"#8AF3AA",
            // "key":shortid.generate(),
            "key":nanoid(),
            "label":name,
            "ratio":ratio,
          }
          box0.push(_tmp)
          return ""
        })
     
        this.setState({rectangles:box0,rectCount:box0.length})
        // Bus2.emit('rectangles', box0);
      })
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
        // Bus2.emit('select_react', rect);
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
        rectangles, rectCount, newRectX, newRectY,ratio
      } = this.state;
      const stage = event.target.getStage();
      const mousePos = stage.getPointerPosition();
      if (!rectangles[rectCount]) {
        rectangles.push({
          x: newRectX,
          y: newRectY,
          width: mousePos.x - newRectX,
          height: mousePos - newRectY,
          // name: `rect${rectCount + 1}`,
          name: `${rectCount}`,
          stroke: '#00A3AA',
          // key: shortid.generate(),
          key:nanoid(),
          label: '',
          confidence:0,
          ratio:ratio
        });

        // Bus2.emit('rectangles', rectangles);
        return this.setState({ rectangles, mouseDraw: true });
      }
      rectangles[rectCount].width = mousePos.x - newRectX;
      rectangles[rectCount].height = mousePos.y - newRectY;

      // Bus2.emit('rectangles', rectangles);
      return this.setState({ rectangles });
    };
  
    handleStageMouseUp = () => {
      const { rectCount, mouseDraw } = this.state;
      if (mouseDraw) {
        this.setState({ rectCount: rectCount + 1, mouseDraw: false });
      }
      this.setState({ mouseDown: false });
    };
  

    set_shape = (result, msg) => {
      this.props.send_shape(msg)
    }


    onChange_fault(event){
      if (event.target.value !== this.state.current.value ){
        this.setState({
          selectedOption:event.target,
          showSave:true
        })
      }
    }

    onChange_normal(event){
      if (event.target.value !== this.state.current_normal.value ){
        this.setState({
          selectedOption_normal:event.target,
          showSave:true
        })
      }
  }

  save(){

    const docid = this.state.doc_id

    const payload = {
      // selectedOption:this.state.selectedOption,
      // selectedOption_normal:this.state.selectedOption_normal,
      // predict:this.state.predict,
      // predict_normal:this.state.predict_normal,
      acknoledged : true,
      // normal_type : 0
      normal_value : this.state.opt_fault[this.state.selectedOption.value].label,
      abnormal_value : this.state.opt_normal[this.state.selectedOption_normal.value].label
    };

    const HEADERS = {'Content-Type': 'application/json'};
    const apiUrl = `/save_verified_result/${docid}`;
    // const apiUrl = '/save_verified_result'+'/'+ docid;
    // console.log(apiUrl)
    var result = "";

    // console.log(payload)
    // console.log(this.state.opt_fault)
    // console.log(this.state.selectedOption)


    axios({ method: 'POST', url: apiUrl , data: payload ,headers: HEADERS}).then(response => {
        console.log(response);
        if (response.status === 200) {
            result = "Save result successfully !"
            this.setState({
              current:this.state.selectedOption,
              current_normal:this.state.selectedOption_normal,
              showSave:false
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

  

    render(){
      const {
        // state: { rectangles, selectedShapeName, mouseDown ,fault_list,object_list,selectedOption,selectedOption_normal,doc_id,predict,predict_normal},
        state: { rectangles, selectedShapeName, mouseDown },
        handleStageMouseDown,
        handleNewRectChange,
        handleRectChange,
        handleStageMouseUp,
      } = this;
  

      return (
        <ColumnLayout>
          <Column key="column1">
            <Box display="flex" bgcolor="grey.100"  alignItems="center" justifyContent="center">
              <div id="bbox">
                <Stage  
                  ref={(node) => {
                    this.stage = node;
                  }}
                  container="bbox"
                  width={640}
                  height={900}
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
          </Column>
          <Column key="column2">
            <Box display="flex" bgcolor="grey.100" alignItems="center" justifyContent="center">
                  <Form  actions={
                          <div>
                              <Button  disabled={!this.state.showSave} onClick={() => this.save()}  >Save</Button>
                          </div>
                      }
                  >
                  <FormSection header="Verify Result">
                      <FormField label="Fault" controlId="formFieldId1">
                        <Select
                          options={this.state.opt_fault}
                          selectedOption={this.state.selectedOption}
                          onChange={(e) => this.onChange_fault(e)}
                        />
                      </FormField>
                      <FormField label="Normal" controlId="formFieldId2">
                        <Select
                            options={this.state.opt_normal}
                            selectedOption={this.state.selectedOption_normal}
                            onChange={(e) => this.onChange_normal(e)}
                        />
                      </FormField>
                  
                  </FormSection>
              </Form>




            </Box>
          </Column>
      </ColumnLayout>
      );
    }
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(BBox));

