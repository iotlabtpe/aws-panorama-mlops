import React, { useState } from 'react'
import Modal from 'aws-northstar/components/Modal';
import { Text, Box, Heading, Button, Inline } from 'aws-northstar';
import Input from 'aws-northstar/components/Input'
import Icon from 'aws-northstar/components/Icon';

const DeleteModal = ({title,deleteModal, setDeleteModal, deleteSubmit}) => {
   const [deleteInput, setDeleteInput] = useState('');
   

   const footer = (
    <Inline>
        <Button type='reset' variant='link' onClick={()=>setDeleteModal(false)}>Cancel</Button>
        <Button onClick={(e)=> deleteSubmit(title) } disabled={deleteInput === title ?  false : true }>Delete</Button>
    </Inline>
   )

  return (
    <>
    <Modal title={`Delete ${title}`} visible={deleteModal} onClose={() => setDeleteModal(false)} footer={footer}>
        <Box margin="20px 10px">
        <Text variant='span'>Deletion will remove this application from AWS Panorama. </Text>
        <br/><br/>
        <Box display="flex" alignItems="center"> 
            <Box marginRight="5px">
                <Icon name='Warning' fontSize="default" htmlColor='red'/>
            </Box>
        <Heading variant='h4'>We only delete the record, but we didn't delete the package in Panorama Console</Heading>
        </Box>

        <br/>
        <Text variant='span'>To confirm deletion , please type <b>{title}</b></Text>
        
        <Input placeholder={title} onChange={(e)=>setDeleteInput(e)} value={deleteInput}/>
        </Box>
    </Modal>
    </>
  )
}

export default DeleteModal