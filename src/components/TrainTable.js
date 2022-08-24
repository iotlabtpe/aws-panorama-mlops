/* eslint-disable react/no-multi-comp */
import Table from 'aws-northstar/components/Table';
import StatusIndicator from 'aws-northstar/components/StatusIndicator';
import Button from 'aws-northstar/components/Button';
import ButtonDropdown from 'aws-northstar/components/ButtonDropdown';
// import Popover from 'aws-northstar/components/Popover';
import Inline from 'aws-northstar/layouts/Inline';
import { Text } from 'aws-northstar';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux'
// import Link from 'aws-northstar/components/Link';
// import DeployEndpoint from './DeployEndpoint'

import { API } from 'aws-amplify';
import axios from 'axios'
import { withTranslation } from 'react-i18next'
import DeleteModal from './atom/DeleteModal';
import { useHistory } from 'react-router-dom';


const mapStateToProps = state => {
    return { session: state.session }
}

const MapDispatchTpProps = (dispatch) => {
    return {
        changeLang: (key) => dispatch({ type: 'change_language', data: key })
    }
}

const columnDefinitions = [
    // {
    //     'id': 'trainingjob.name',
    //     width: 250,
    //     show:false,
    //     Header: 'JobName',
    //     accessor: 'jobname'
    // },
    {
        'id': 'model.model_name',
        width: 250,
        Header: 'Application Name',
        accessor: 'model_name',
        Cell: ({ row }) => {
            return <div>
                <a href={`/ModelManageTable/${row.original.model_name}`}>{row.original.model_name}</a>
            </div>
        }
    },
    // {
    //     'id': 'stage',
    //     width: 120,
    //     Header: 'Stage',
    //     accessor: 'stage'
    // },
    {
        'id': 'trainingjob.status',
        width: 150,
        Header: 'JobStatus',
        accessor: 'JobStatus',
        Cell: ({ row }) => {
            if (row && row.original) {
                // console.log(row.original)
                const status = row.original.status;
                switch (status) {
                    case 'InProgress':
                        return <StatusIndicator statusType="info">In Procress</StatusIndicator>;
                    case 'Error':
                        return <StatusIndicator statusType="negative">Error</StatusIndicator>;
                    case 'Completed':
                        if (row.original.model_name) {
                            // const model_id = row.original.model_name;
                            // const target = "/TrainingResult/"+model_id;
                            return <div>
                                <StatusIndicator statusType={"positive"} >{status}</StatusIndicator>
                            </div>
                        } else {
                            return <div>
                                <StatusIndicator statusType="positive" >{status}</StatusIndicator>
                            </div>;
                        }
                    default:
                        return (
                            <div>
                                <StatusIndicator statusType="info" >Training</StatusIndicator>
                            </div>
                        );
                }
            }
            return null;
        }
    },
    // {
    //     'id': 'model.cost',
    //     width: 150,
    //     Header: 'Cost',
    //     accessor: 'cost'
    // },  
    // {
    //     'id': 'model.size',
    //     width: 150,
    //     Header: 'Size',
    //     accessor: 'size'
    // },
    {
        'id': 'trainingjob.creation_time',
        width: 150,
        Header: 'Created Date',
        accessor: 'creation_time'
    },
    // {
    //     id: 'trainingjob.status',
    //     width: 200,
    //     Header: 'JobStatus',
    //     accessor: 'status',
    //     Cell: ({ row  }) => {
    //         if (row && row.original) {
    //             const status = row.original.status;
    //             switch(status) {
    //                 case 'InProgress':
    //                     return <StatusIndicator  statusType="positive">Active</StatusIndicator>;
    //                 case 'Completed':
    //                     return <StatusIndicator  statusType="negative">Inactive</StatusIndicator>;
    //                 default:
    //                     return null;
    //             }
    //         }
    //         return null;
    //     }
    // },
    // {
    //     'id': 'trainingjob.result',
    //     width: 100,
    //     Header: 'Result',
    //     accessor: 'Result',
    //     Cell: ({row}) => {
    //         if (row && row.original) {
    //             // console.log(row.original)
    //             const status = row.original.status;
    //             switch(status) {
    //                 case 'Completed':
    //                     if (row.original.model_name){
    //                         const model_id = row.original.model_name;
    //                         const target = "/TrainingResult/"+model_id;
    //                         return <div >                          
    //                                     <Link href={target}><Button variant="icon" icon="folder" /> </Link>
    //                                 </div>
    //                     }else{
    //                         return <div>
    //                                     <StatusIndicator  statusType="positive">Complete</StatusIndicator>
    //                                 </div>;                     
    //                     }
    //                 default:
    //                     return null;
    //             }
    //         }
    //         return null;
    //     }
    // },
    // {
    //     'id': 'trainingjob.training_start_time',
    //     width: 150,
    //     Header: 'JobStart',
    //     accessor: 'training_start_time'
    // }, 
    // {
    //     'id': 'trainingjob.training_end_time',
    //     width: 150,
    //     Header: 'JobEnd',
    //     accessor: 'training_end_time'
    // },

    // {
    //     'id': 'model.creation_time',
    //     width: 150,
    //     Header: 'ModelCreate',
    //     accessor: 'model_creation_time'
    // },     
    {
        'id': 'trainingjob.model_data_url',
        width: 400,
        Header: 'Application Storage',
        accessor: 'model_data_url'
    },
    // {
    //     'id': 'endpointconfig_create_time',
    //     width: 150,
    //     Header: 'EP_Conf_Name',
    //     accessor: 'endpointconfig_create_time'
    // },
    // {
    //     'id': 'endpoint_name',
    //     width: 400,
    //     Header: 'EP_Name',
    //     accessor: 'endpoint_name'
    // },
    // {
    //     'id': 'endpoint_create_time',
    //     width: 150,
    //     Header: 'EP_Create_Time',
    //     accessor: 'endpoint_create_time'
    // },
    // {
    //     'id': 'endpoint_status',
    //     width: 120,
    //     Header: 'EP_Status',
    //     accessor: 'endpoint_status',
    //     Cell: ({ row  }) => {
    //         if (row && row.original) {
    //             // console.log(row.original)
    //             const status = row.original.endpoint_status;
    //             switch(status) {
    //                 case 'InService':
    //                     return <StatusIndicator  statusType="positive">Ready</StatusIndicator>;
    //                 default:
    //                     return null;
    //             }
    //         }
    //         return null;
    //     }
    // },
    // {
    //     'id': 'deploy',
    //     width: 120,
    //     Header: 'deploy',
    //     Cell: ({ row  }) => {
    //         if (row && row.original) {
    //             // console.log(row.original)
    //             const status = row.original.endpoint_status;
    //             switch(status) {
    //                 case 'InService':
    //                     return <DeployEndpoint ep_name={row.original.endpoint_name} disabled={false} />
    //                 default:
    //                     // return <DeployEndpoint  disabled={true} />
    //                     return <DeployEndpoint  disabled />
    //             }
    //         }
    //         return null;
    //     }
    // },
    // {
    //     'id': 'endpoint_last_modified_time',
    //     width: 150,
    //     Header: 'EP_Modified_Time',
    //     accessor: 'endpoint_last_modified_time'
    // },
]

const TrainTable_v2 = ({ t }) => {
    const history = useHistory();
    const [loading, setLoading] = useState(false);
    const [modelList, setModelList] = useState([]);
    const [current, setCurrent] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        const load_data = async () => {
            setLoading(true);
            await API.get('backend', '/model').then(res => {
                console.log(res)
                if (res.Items) {
                    // console.log(res.data)
                    const _tmp_data = []
                    res.Items.forEach((item) => {
                        var _tmp = {}
                        _tmp['jobname'] = item['trainingjob.name']
                        _tmp['status'] = item['trainingJobStatus']
                        _tmp['model_data_url'] = item['trainingJobModelDataUrl']
                        _tmp['creation_time'] = item['trainingJobStartTime']
                        _tmp['training_start_time'] = item['trainingjob.training_start_time']
                        _tmp['training_end_time'] = item['trainingjob.training_end_time']

                        _tmp['endpoint_name'] = item['endpoint.endpoint_name']
                        _tmp['endpoint_create_time'] = item['endpoint.creation_time']
                        _tmp['endpointconfig_create_time'] = item['endpointconfig.creation_time']
                        _tmp['endpoint_status'] = item['endpoint.status']
                        _tmp['endpoint_last_modified_time'] = item['endpoint.last_modified_time']
                        _tmp['stage'] = item['stage']
                        _tmp['model_name'] = item['model_name']
                        _tmp['model_creation_time'] = item['model.creation_time']
                        _tmp['cost'] = Math.floor(Math.random() * 10000)
                        _tmp['size'] = Math.floor(Math.random() * 10).toString() + 'GB'
                        _tmp_data.push(_tmp)
                    });

                    setModelList(_tmp_data);
                }
            })
            setLoading(false);
        }
        load_data();
    }, [])


    const jump_to_newTask = () => {
        // NEW ONE
        //history.push("/NewApplicationConfig")
        history.push("/NewTrainingTask")
    }

    // const jump_to_result  = () => {
    //    history.push("/TrainingResult")
    // }
    const jump_to_clone_application = () => {
        history.push(`/CloneModelConfig/${current.model_name}`)
    }

    // const test = () => {
    //     console.log(current);
    // }
    const tableActions = (

        <Inline>
            <ButtonDropdown
                content="Action"
                disabled={current.length === 0 ? true : false}
                // disabled={false}
                items={
                    [
                        { text: <Text>{t("Clone Model")}</Text>, onClick: () => jump_to_clone_application() },
                        { text: <Text>{t("Delete")}</Text>, onClick: () => setDeleteModal(true) }
                    ]
                }
            >
            </ButtonDropdown>
            <Button variant="primary" onClick={() => jump_to_newTask()}>
                {t("New Training")}
            </Button>
        </Inline>
    );
    return (
        <>
            <DeleteModal title={current.length === 0 ? 'Start' : current[0].model_name} setDeleteModal={setDeleteModal} deleteModal={deleteModal} />
            <Table
                id="TrainTable"
                actionGroup={tableActions}
                tableTitle={t("Packaged Application Table")}
                multiSelect={false}
                columnDefinitions={columnDefinitions}
                items={modelList}
                onSelectionChange={(item) => { setCurrent(item) }}
                loading={loading}
                disableSettings={false}
            />
        </>
    )
}


// class  TrainTable extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//         loading : true ,
//         model_list : [],
//         curent : {}
//     }
//   }

//   componentDidMount(){
//     // console.log(this.model_list)
//     this.setState({loading:true},()=>{
//         this.load_data()
//     })
//   }

//   async load_data(){
//     // console.log(this.state)

//     await axios.get('/listmodel', {dataType: 'json'}).then(res => {
//         // console.log(res)
//         if (res.data){
//             // console.log(res.data)
//             var _tmp_data = []
//             res.data.forEach((item)=>{
//                 var _tmp = {}
//                 _tmp['jobname'] = item['trainingjob.name']
//                 _tmp['status'] = item['trainingjob.status']
//                 _tmp['model_data_url'] = item['trainingjob.model_data_url']
//                 _tmp['creation_time'] = item['trainingjob.creation_time']
//                 _tmp['training_start_time'] = item['trainingjob.training_start_time']
//                 _tmp['training_end_time'] = item['trainingjob.training_end_time']

//                 _tmp['endpoint_name'] = item['endpoint.endpoint_name']
//                 _tmp['endpoint_create_time'] = item['endpoint.creation_time']
//                 _tmp['endpointconfig_create_time'] = item['endpointconfig.creation_time']
//                 _tmp['endpoint_status'] = item['endpoint.status']
//                 _tmp['endpoint_last_modified_time'] = item['endpoint.last_modified_time']
//                 _tmp['stage'] = item['stage']
//                 _tmp['model_name'] = item['model_name']
//                 _tmp['model_creation_time'] = item['model.creation_time']
//                 _tmp['cost'] = Math.floor(Math.random()*10000)
//                 _tmp['size'] =  Math.floor(Math.random()*10).toString() + 'GB'
//                 _tmp_data.push(_tmp)
//             });

//             this.setState({model_list:_tmp_data},()=>{
//                 this.setState({loading:false})
//             })
//         }
//         // console.log(this.state.model_list)

//         return res.data
//     })
//   }





//   render(){
//     const {
//         props: {t}
//       } = this;


//     return(
//         <>
//         <Table
//             id = "TrainTable"
//             actionGroup={this.tableActions}
//             tableTitle={t("Model Training Table")}
//             multiSelect={false}
//             columnDefinitions={columnDefinitions}
//             items={this.state.model_list}
//             onSelectionChange={(item)=>{this.setState({curent:item})}}
//             loading={this.state.loading}
//             disableSettings={false}
//         />
//         </>
//     )
//   }
// }

export default connect(mapStateToProps, MapDispatchTpProps)(withTranslation()(TrainTable_v2));
