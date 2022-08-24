import React, { useState } from 'react'
import {withTranslation} from 'react-i18next'
import { connect } from 'react-redux' 
import { Form, Button, FormSection, Input, FormField, FormRenderer, componentTypes, validatorTypes} from 'aws-northstar'
import { useHistory } from 'react-router-dom'


const mapStateToProps = state => {
    return { session: state.session }
  }

const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
}
const NewApplicationForm = ({t}) => {
  const history = useHistory();
  const [modelName, setModelName] = useState('');
  const [classNumber, setClassNumber] = useState(1);
  const [classList, setClassList] = useState([]);
  const [algorithm, setAlgorithm] = useState('');
  const [trainingImageS3, setTrainingImageS3] = useState(''); 
  const [trainingLabelS3, setTrainingLabelS3] = useState(''); 
  const [validateImageS3, setValidateImageS3] = useState(''); 
  const [validateLabelS3, setvalidateLabelS3] = useState(''); 
  const [pretrainedWeightS3, setPretrainedWeightS3] = useState('');
  const [trainingInstance, setTrainingInstance] = useState('');
  const [trainingEpoch, setTrainingEpoch] = useState(100);

  const submit = (e) => {
    console.log("success");
    console.log(e);
  }
  const cancel = () => {
    history.push('/trainlist');
  }

  const schema = {
    fields: [
        {
            component: componentTypes.SUB_FORM,
            title: 'Create New Application',
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
            ]

        }
    ]
  }
  
  
//   const handelInputChange = (e,set) = {
    
//   }
  return (
    <>
        <FormRenderer schema={schema} onSubmit={(e)=>submit(e)} onCancel={()=>cancel()} />
    </>
  )
}

export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(NewApplicationForm));