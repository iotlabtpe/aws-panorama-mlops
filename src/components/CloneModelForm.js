import React, { useState } from 'react'
import {withTranslation} from 'react-i18next'
import { connect } from 'react-redux' 
import { FormRenderer, componentTypes, validatorTypes, Box, Button, Text, Modal } from 'aws-northstar'
import { useHistory } from 'react-router-dom'
import { CopyBlock, github, dracula } from "react-code-blocks";


const mapStateToProps = state => {
    return { session: state.session }
  }

const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
}
const CloneModelForm = ({t}) => {
    const history = useHistory();
    const [ showApp, setShowApp] = useState(false);
//   const [modelName, setModelName] = useState('');
//   const [classNumber, setClassNumber] = useState(1);
//   const [classList, setClassList] = useState([]);
//   const [algorithm, setAlgorithm] = useState('');
//   const [trainingImageS3, setTrainingImageS3] = useState(''); 
//   const [trainingLabelS3, setTrainingLabelS3] = useState(''); 
//   const [validateImageS3, setValidateImageS3] = useState(''); 
//   const [validateLabelS3, setvalidateLabelS3] = useState(''); 
//   const [pretrainedWeightS3, setPretrainedWeightS3] = useState('');
//   const [trainingInstance, setTrainingInstance] = useState('');
//   const [trainingEpoch, setTrainingEpoch] = useState(100);

  const submit = (e) => {
    console.log("success");
    console.log(e);
  }
  const cancel = () => {
    history.push('/trainlist');
  }

  const code = 
  `
  import numpy as np
  import cv2
  
  import panoramasdk
  
  model_input_resolution = (600,480)        
  box_color = (0,0,255)
  box_thickness = 1
  
  # application class
  class Application(panoramasdk.node):
      
      # initialize application
      def __init__(self):
          
          super().__init__()
          
          self.frame_count = 0
  
      # run top-level loop of application  
      def run(self):
          
          while True:
              
              print( f"Frame : {self.frame_count}", flush=True )
              
              # get video frames from camera inputs 
              media_list = self.inputs.video_in.get()
              
              for i_media, media in enumerate(media_list):
                  print( f"media[{i_media}] : media.image.dtype={media.image.dtype}, media.image.shape={media.image.shape}", flush=True )
  
                  # pass the video frame, and get formatted data for model input
                  image_formatted = self.format_model_input(media.image)
                  
                  # pass the formatted model input data, run people detection, and get detected bounding boxes
                  detected_boxes = self.detect_people( image_formatted )
                  
                  # render the detected bounding boxes on the video frame
                  self.render_boxes( media.image, detected_boxes )
                  
              # put video output to HDMI
              self.outputs.video_out.put(media_list)
              
              self.frame_count += 1
  
      # convert video frame from camera to model input data
      def format_model_input( self, image ):
          
          # scale to resolution expected by the model
          image = cv2.resize( image, model_input_resolution )
  
          # uint8 -> float32
          image = image.astype(np.float32) / 255.0
  
          # [480,600,3] -> [1,3,480,600]
          B = image[:, :, 0]
          G = image[:, :, 1]
          R = image[:, :, 2]
          image = [[[], [], []]]
          image[0][0] = R
          image[0][1] = G
          image[0][2] = B
          
          return np.asarray(image)
  
      # run people detection, and return detected bounding boxes
      def detect_people( self, data ):
          
          detected_boxes = []
          
          model_node_name = "people_detection_model"
          score_threshold = 0.5
          klass_person = 0
          
          # call people detection model
          people_detection_results = self.call( {"data":data}, model_node_name )
  
          # None result means empty
          if people_detection_results is None:
              return detected_boxes
      
          classes, scores, boxes = people_detection_results
  
          assert classes.shape == (1,100,1)
          assert scores.shape == (1,100,1)
          assert boxes.shape == (1,100,4)
          
          # scale bounding box to 0.0 ~ 1.0 space
          def to_01_space( box ):
              return box / np.array([
                  model_input_resolution[0], 
                  model_input_resolution[1], 
                  model_input_resolution[0], 
                  model_input_resolution[1] 
              ])
          
          # gather bounding boxes to return
          for klass, score, box in zip( classes[0], scores[0], boxes[0] ):
              if klass[0] == klass_person:
                  if score[0] >= score_threshold:
                      box = to_01_space( box )
                      detected_boxes.append( box )
  
          return detected_boxes
      
      # render bounding boxes
      def render_boxes( self, image, boxes ):
          
          for box in boxes:
              
              # scale 0.0-1.0 space to camera image resolution
              h = image.shape[0]
              w = image.shape[1]
              box = (box * np.array([ w, h, w, h ])).astype(int)
              
              # render red rectancle
              cv2.rectangle( 
                  image, 
                  tuple(box[0:2]),
                  tuple(box[2:4]),
                  color = box_color,
                  thickness = box_thickness, 
                  lineType = cv2.LINE_8,
              )
  
  app = Application()
  app.run()
  `;
const Label = ({ label }) => <Text>{label}</Text>;


  
  const CodeBlockLink = ({}) => (
    <Box marginTop="2px">
        <Button icon="external" onClick={()=>setShowApp(!showApp)}>App.py</Button>
    </Box>
  )
  const schema = {
    fields: [
        {
            component: componentTypes.SUB_FORM,
            title: 'Clone Model',
            // description: 'This is a subform',
            name: 'subform1',
            fields:[
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Model Name',
                name: 'Model_Name',
                label: 'Model Name',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Class Number',
                name: 'Class_Number',
                label: 'Class Number',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Class List',
                name: 'Class_List',
                label: 'Class List',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Algorithn',
                name: 'Algorithm',
                label: 'Algorithm',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Training Image S3',
                name: 'Training_Image_S3',
                label: 'Training Image S3',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Training Label S3',
                name: 'Training_Label_S3',
                label: 'Training Label S3',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Validate Image S3',
                name: 'Validate_Image_S3',
                label: 'Validate Image S3',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Validate Label S3',
                name: 'Validate_Label_S3',
                label: 'Validate Label S3',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Pretrained Weight S3',
                name: 'Pretrained_Weight_S3',
                label: 'Pretrained Weight S3',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Training Instance',
                name: 'Training_instance',
                label: 'Training Instance',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Training Epochs',
                name: 'Trainging_Epochs',
                label: 'Training Epochs',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.TEXT_FIELD,
                title: 'Training Epochs',
                name: 'Trainging_Epochs',
                label: 'Training Epochs',
                validate: [
                    {
                        type: validatorTypes.REQUIRED,
                    },
                ],
            },
            {
                component: componentTypes.CUSTOM,
                name: 'text',
                label: 'Used Script',
                CustomComponent: Label,
            },
            {
                component: componentTypes.CUSTOM,
                name: 'Used_Script',
                label: 'Used Script',
                CustomComponent: CodeBlockLink,
            },


            ]

        }
    ]
  }
  
  
//   const handelInputChange = (e,set) = {
    
//   }
  return (
    
    <>
        {/* <Modal title="App.py" visible={showApp} onClose={() => setShowApp(false)} >
            <Box overflow="auto">
                <CopyBlock
                language='python'
                text={code}
                showLineNumbers={true}
                theme={github}
                wrapLines={true}
                codeBlock
                />
            </Box>
        </Modal> */}
        <FormRenderer schema={schema} onSubmit={(e)=>submit(e)} onCancel={()=>cancel()} />
        <Box overflow="auto" marginTop="10px" display={showApp === true ? "flex" : "none" }>
                <CopyBlock
                language='python'
                text={code}
                theme={dracula}
                codeBlock
                />
        </Box>
    </>
  )
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(CloneModelForm));
