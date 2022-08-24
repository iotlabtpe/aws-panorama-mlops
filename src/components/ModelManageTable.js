import React, { useEffect, useState } from 'react'
import LineChart, { Line, NORTHSTAR_COLORS, YAxis, XAxis, Tooltip } from 'aws-northstar/charts/LineChart';
import BarChart, {Bar} from 'aws-northstar/charts/BarChart';
// import Card from 'aws-northstar/components/Card';
// import ExpandableSection from 'aws-northstar/components/ExpandableSection';
import { Container, Button, Inline, Column, ColumnLayout, Stack, KeyValuePair, Status, LoadingIndicator,Box, HeadingStripe } from 'aws-northstar';
import axios from 'axios';
import DeleteModal from './atom/DeleteModal';
import {withTranslation} from 'react-i18next'
import { connect } from 'react-redux' 

const mapStateToProps = state => {
    return { session: state.session }
  }

const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key)=>dispatch({type: 'change_language',data: key})
    }
}

const ModelManageTable = ({t}) => {
    // model state
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState({});
    const [deleteModal, setDeleteModal] = useState(false);
    useEffect(() => {
      const getData = async()=>{
        setLoading(true);
        const response = await axios.get('/test1');
        setModel(response.data.data);
        setLoading(false);
      }
      getData();
    }, [])
    
    const sampleData = [
        { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
        { name: 'Page B', uv: 3000, pv: 1398, amt: 2210, },
        { name: 'Page C', uv: 2000, pv: 9800, amt: 2290, },
        { name: 'Page D', uv: 2780, pv: 3908, amt: 2000, },
        { name: 'Page E', uv: 1890, pv: 4800, amt: 2181, },
        { name: 'Page F', uv: 2390, pv: 3800, amt: 2500, },
        { name: 'Page G', uv: 3490, pv: 4300, amt: 2100, },
    ];

    const actionButtons = (
        <Inline>
        <Button variant='normal' onClick={()=>setDeleteModal(true)}>Delete Application</Button>
    </Inline>
    );
  return (
    <>
        { loading === false ? 
        <Box width="100%"> 
            <Box width="100%" aria-label="Header" margin="20px 0px" display="flex"  alignItems="center">
                <HeadingStripe title="SpotBot-2022-06-14-06-49-33" actionButtons={actionButtons} />
                <DeleteModal title={model.name} setDeleteModal={setDeleteModal}  deleteModal={deleteModal}/>
            </Box>
            <Box width="100%">
                <Container headingVariant='h4' 
                    title="Model Chart"
                    // style={{'display':'flex'}}
                >
                <Box width="100%" display="flex">
                        <LineChart title="Line Chart - two data series" width={450} height={200} data={sampleData}>
                                <Line dataKey="pv" fill={NORTHSTAR_COLORS.ORANGE} />
                                <Line dataKey="uv" fill={NORTHSTAR_COLORS.BLUE} />
                                <XAxis dataKey="name" angle={30} dy={10}/>
                                <YAxis />
                                <Tooltip />
                        </LineChart>      
                        <BarChart title="Bar Chart - two data series" width={400} height={200} data={sampleData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="pv" fill={NORTHSTAR_COLORS.ORANGE} stroke={NORTHSTAR_COLORS.ORANGE} />
                            <Bar dataKey="uv" fill={NORTHSTAR_COLORS.BLUE} stroke={NORTHSTAR_COLORS.BLUE}/>
                        </BarChart>
                    </Box>            
                                    
                </Container>
                <Container headingVariant='h4' 
                    title="Model Detail" 
                >
                    <ColumnLayout>
                        <Column key="column1">
                            <Stack>
                                <KeyValuePair label="Model Name" value="SLCCSMWOHOFUY0"></KeyValuePair>
                                <KeyValuePair label="Model Arn" value="bbb.cloudfront.net"></KeyValuePair>
                                <KeyValuePair label="Creation Time" value='test'></KeyValuePair>
                            </Stack>
                        </Column>
                        <Column key="column2">
                            <Stack>
                                <KeyValuePair label="Model Framework" value={Status}></KeyValuePair>
                                <KeyValuePair label="Model Artifact S3 Location" value='test'></KeyValuePair>
                                <KeyValuePair label="Algorithm" value='test'></KeyValuePair>
                            </Stack>
                        </Column>
                        <Column key="column3">
                            <Stack>
                                <KeyValuePair label="Status" value="Default CloudFront "></KeyValuePair>
                                <KeyValuePair label="FleetArn"></KeyValuePair>
                                <KeyValuePair label="Error" value="Off"></KeyValuePair>
                            </Stack>
                        </Column>
                        <Column key="column4">
                            <Stack>
                                <KeyValuePair label="Model Packaging Complete" value="Default CloudFront SSL certificate"></KeyValuePair>
                                <KeyValuePair label="Model Size (GB) " value="6"></KeyValuePair>
                            </Stack>
                        </Column>
                    </ColumnLayout>                  
                        
                </Container>
                <Container headingVariant='h4' 
                    title="Training Detail" 
                >
                    <ColumnLayout>
                        <Column key="column1">
                            <Stack>
                                <KeyValuePair label="Class Number" value="SLCCSMWOHOFUY0"></KeyValuePair>
                                <KeyValuePair label="Class List" value="bbb.cloudfront.net"></KeyValuePair>
                                <KeyValuePair label="Training Instance" value='test'></KeyValuePair>
                            </Stack>
                        </Column>
                        <Column key="column2">
                            <Stack>
                                <KeyValuePair label="Training Image S3" value={Status}></KeyValuePair>
                                <KeyValuePair label="Training Label S3" value='test'></KeyValuePair>
                                <KeyValuePair label="Pretrained Weight S3" value='test'></KeyValuePair>
                            </Stack>
                        </Column>
                        <Column key="column3">
                            <Stack>
                                <KeyValuePair label="Training Epochs" value="Default CloudFront SSL certificate"></KeyValuePair>
                                <KeyValuePair label="Incremental Training "></KeyValuePair>
                            </Stack>
                        </Column>
                    </ColumnLayout>                  
                        
                </Container>
            </Box>
        </Box>
        : <LoadingIndicator size="big" /> }
    </>
  )
}


export default connect(mapStateToProps,MapDispatchTpProps)(withTranslation()(ModelManageTable));