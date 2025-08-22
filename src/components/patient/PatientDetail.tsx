import React, { useEffect, useState } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Avatar, Empty, Image, Spin, Table, Tooltip } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { getPatient, getPntAssRequestList } from 'services/actions/patientAction';
import PatientModal from './modal/PatientModal';
import { ToolFilled, UserOutlined } from '@ant-design/icons';

const PatientDetail: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { pntInfo, loading3, assReqInfo, loading4 } = useSelector((state: any) => state.patient);
    const patientData = !loading3 ? pntInfo?.data[0] : [];
    const reqList = !loading4 ? assReqInfo?.data : [];
    const userRole=sessionStorage.getItem('role');
    const [openModal, setOpenModal] = useState(false);
    const rowData = pntInfo || [];
    const pageIndex = 1;
    const pageSize = 10;
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Associated Request Available" />, 
    };

    function getPatientDetail() {
        dispatch(getPatient(location?.state?.patientId) as any);
    }

    function getAssRequest() {
        dispatch(getPntAssRequestList(location.state?.patientId) as any);
    }

    useEffect(() => {
        if (location.state?.patientId) {
            getPatientDetail();
            getAssRequest();
        }
    }, []);

    const handlegoBack = () => {
        navigate('/patient-list');
    };

    const showModal = () => {
        setOpenModal(true);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };

    const callBackGrid = () => {
        getPatientDetail();
    };

    const columns = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            render: (id: any, record: any, index: number) => {
                if (pageIndex === 1) {
                    return index + 1;
                } else {
                    return (pageIndex - 1) * pageSize + (index + 1);
                }
            },
        },
        {
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
        },
        {
            title: 'Request Name',
            dataIndex: 'request_name',
            key: 'request_name',
        },
        {
            title: 'Submitted/Released Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return reqList ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Request Type',
            dataIndex: 'request_type',
            key: 'request_type',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                if (sessionStorage?.getItem('role') === 'staff') {
                    if (
                        status?.toLowerCase() === 'on review' ||
                        status?.toLowerCase() === 'acknowledged' ||
                        status?.toLowerCase() === 'reassessment' ||
                        status?.toLowerCase() === 'request review'||
                        status?.toLowerCase() === 'result review'
                    ) {
                        return <div className="text-lightblue fw-bold">Acknowledged</div>;
                    } else if (status?.toLowerCase() === 'request init') {
                        return <div className="text-warning fw-bold">Submitted</div>;
                    } else {
                        return <div className="text-danger fw-bold">{status}</div>;
                    }
                }
                else{

                    if (status?.toLowerCase() === 'on review') {
                        return <div className="text-warning fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'request init' || status?.toLowerCase() === 'inactive') {
                        return <div className="text-danger fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'reassessment') {
                        return <div className="text-lightpurple fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'result review') {
                        return <div className="text-lightblue fw-bold">{status}</div>;
                    } else {
                        return <div className="text-success fw-bold">{status}</div>;
                    }
                }
            },
        },
    ];

    const navigateStepWizard = (record: any) => {

        if(userRole === 'staff'){
            if (record.status === 'On Review' || record.status === 'Reassessment' || record.status === 'Result Review') {
                    navigate(`/view-request/order-management`, {
                    state: {
                        reqDetail: record,
                        reqId: record.id,
                        status: true,
                        active: record.is_active,
                        error: false,
                        requestFrom: record.request_from,
                    },
                } as NavigateOptions);
            } else if (record.status === 'Request Init') {
                navigate(`/view-request/order-management`, {
                    state: {
                        reqDetail: record,
                        reqId: record.id,
                        status: false,
                        active: record.is_active,
                        error: false,
                        requestFrom: record.request_from,
                    },
                } as NavigateOptions);
            } else if (record?.status == "Released") {
                navigate('/released-request/dataset-information',
                { state: { id: record?.id, rowData: record } } as NavigateOptions);
            }
        } else{
            if (record?.status == "Released") {
                navigate('/released-request/dataset-information',
                        { state: { id: record?.id, rowData: record } } as NavigateOptions);
            } else {
                navigate('/view-request/pipeline-request', {
                    state: {
                        id: record?.id,
                        request_from: 'patient',
                        is_billing: record?.is_billing,
                        reqDetail: record,
                    },
                } as NavigateOptions);
            }
        }
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Associated Request List</h5>
                <div className="ms-auto d-flex">
                    <Button type="primary" onClick={handlegoBack}>
                        Back
                    </Button>
                </div>
            </div>
            <div className="row mx-0 mt-2">
                <div className="col px-0 bg-white shadow-sm me-3 pnt-ass-tbl">
                    <Table className="pointer" columns={columns} dataSource={reqList} rowKey="id" 
                    loading={loading4}
                    scroll={{ x: 'calc(230px + 50%)'}}
                    locale={customLocale}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                navigateStepWizard(record);
                            },
                        };
                    }}
                    />
                </div>
                <div className="col-md-3 px-0 ">
                    <Spin spinning={loading3}>
                        <div className="bg-white p-2 shadow-sm ">
                            <div className="bg-light p-2 text-center">
                                    <div className="ms-auto mb-auto text-end edit-icon text-success edit-card col-auto pointer" onClick={showModal}>
                                        <Tooltip title="Edit" >
                                            <EditIcon />
                                        </Tooltip>              
                                    </div>
                                <Avatar size={140} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                            </div>
                            <div className="pntcard-info mt-3 mx-auto justify-content-between align-items-center px-0 d-flex w-100">
                                <div className="flex-wrap d-flex px-3 w-100 mx-auto">
                                    <div className="col-md-6 ">
                                        <h6>Patient ID</h6>
                                        <p>{patientData?.encoded_PatientNumber || '--'}</p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <h6>Patient Name</h6>
                                        <p className="text-capitalize">
                                            {patientData?.first_name} {patientData?.last_name}
                                        </p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <h6>Date of birth</h6>
                                        <p>{patientData?.dob || '--'}</p>
                                    </div>
                                    <div className="col-md-6 ">
                                        <h6>Sex at birth</h6>
                                        <p>{patientData?.gender || '--'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Gender identity</h6>
                                        <p>{patientData?.gender_identity || '--'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Contact Phone</h6>
                                        <p>{patientData?.contact_number || '--'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Handedness</h6>
                                        <p className="text-capitalize">{patientData?.handedness || '--'}</p>
                                    </div>
                                    <div className="col-md-6">
                                        <h6>Account name</h6>
                                        <p>{patientData?.account_name || '--'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Spin>
                </div>
            </div>
            <PatientModal openModal={openModal} closeModal={handleCancel} callBackGrid={callBackGrid} patientData={rowData} />
        </div>
    );
};

export default PatientDetail;
