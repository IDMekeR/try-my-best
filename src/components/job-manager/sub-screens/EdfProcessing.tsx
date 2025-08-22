import React, { useEffect, useState } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { message, Popconfirm, Popover, Spin, Skeleton, Switch } from 'components/shared/AntComponent';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { cancelEdfJobs, getEdfProcessing, getEnableEdfAnalyzer, resetEdfJobs } from 'services/actions/jobManagerAction';
import { DoubleLeftOutlined, FileExcelOutlined, SyncOutlined } from 'components/shared/AntIcons';
import { FileImageOutlined, FilePdfOutlined, FileTextOutlined } from 'components/shared/AntIcons';
import dayjs from 'dayjs';
import ViewResult from '../modal/ViewResult';

const EdfProcessing: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { edfProcessInfo, loading5, success5, success8, success9, loading8, loading9, error9, error8, edfAnalyzerInfo, success10, loading10, error10 } = useSelector((state: any) => state.jobManager);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const [eyeClose, setEyeClose]: any = useState(null);
    const [eyeOpen, setEyeOpen]: any = useState(null);
    const [eyeSteps, setEyeSteps]: any = useState(null);
    const [rowData, setRowData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [docType, setDocType] = useState('');
    const [jobID, setJobID] = useState(0);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success8 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error8 : false;
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success9 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error9 : false;
    const [initialLoading, setInitialLoading] = useState(true);
    const [loadingJob, setLoadingJob] = useState(true);
    const [enableAnalyzer, setEnableAnalyzer] = useState(false);
    const [showJobSuccessmsg, setShowJobSuccessmsg] = useState(false);
    const jobsuccessmsg = showJobSuccessmsg ? success10 : false;
    const [showJobErrormsg, setShowJobErrormsg] = useState(false);
    const joberrormsg = showJobErrormsg ? error10 : false;
    const userRole = sessionStorage.getItem('role');

    const titleOptions = [
        { id: 1, label: 'No. of Files', value: edfProcessInfo?.data?.total_edf_files || 0, type: 'number' },
        { id: 2, label: 'Request No', value: edfProcessInfo?.data?.encoded_RequestNumber, type: 'text' },
        { id: 3, label: 'Patient Name', value: edfProcessInfo?.data?.patient_name || '-', type: 'text' },
        { id: 4, label: 'Account Name', value: edfProcessInfo?.data?.account_name, type: 'text' },
        { id: 5, label: 'Submitted on', value: edfProcessInfo?.data?.submitted_on || null, type: 'date' },
        { id: 6, label: 'Submitted by', value: edfProcessInfo?.data?.account_name || 'Axon Solutions', type: 'text' },
    ];

    const filteredTitleOptions = userRole === 'researcher'
        ? titleOptions.filter(option => option.id !== 3 && option.id !== 4)
        : titleOptions;

    const EyeCloseContent = (
        <div className="">
            <div className="bg-light">
                <div className="row p-2 mx-1 mt-1">
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Submitted On </h6>
                        <div className="">{eyeClose ? dayjs(eyeClose?.submitted_on).format('MM-DD-YYYY') : ''}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Channels per Frame </h6>
                        <div className="">{eyeClose ? eyeClose?.channels_per_frame : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs </h6>
                        <div className="">{eyeClose ? eyeClose?.epochs : '...'}</div>
                    </div>
                </div>
                <div className="row p-2 mx-1 mt-1">
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Sampling Rate</h6>
                        <div className="">{eyeClose ? eyeClose?.sample_rate_hz : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs Start </h6>
                        <div className="">{eyeClose ? eyeClose?.epochs_start : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs End </h6>
                        <div className="">{eyeClose ? eyeClose?.epochs_end : ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const EyeOpenContent = (
        <div className="">
            <div className="bg-light">
                <div className="row p-2 mx-1 mt-1">
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Submitted On </h6>
                        <div className="">{eyeOpen ? dayjs(eyeOpen?.submitted_on).format('MM-DD-YYYY') : ''}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Channels per Frame </h6>
                        <div className="">{eyeOpen ? eyeOpen?.channels_per_frame : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs </h6>
                        <div className="">{eyeOpen ? eyeOpen?.epochs : '...'}</div>
                    </div>
                </div>
                <div className="row p-2 mx-1 mt-1">
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Sampling Rate</h6>
                        <div className="">{eyeOpen ? eyeOpen?.sample_rate_hz : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs Start </h6>
                        <div className="">{eyeOpen ? eyeOpen?.epochs_start : '...'}</div>
                    </div>
                    <div className="form-group col">
                        <h6 className="fw-bold fs-14">Epochs End </h6>
                        <div className="">{eyeOpen ? eyeOpen?.epochs_end : ''}</div>
                    </div>
                </div>
            </div>
        </div>
    );

    const navigateBack = () => {
        navigate('/edf_job_manager');
    };


    useEffect(() => {
        if (success5) {
            setLoadingJob(false);
        }
    }, [success5]);

    useEffect(() => {
        if (commonInfo) {
            setEnableAnalyzer(commonInfo?.edf_analyzer_flag);
        }
    }, [commonInfo]);

    const getAnalyzer = () => {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getEnableEdfAnalyzer(inputJson) as any);
        setEnableAnalyzer(!enableAnalyzer);
        setShowJobErrormsg(true);
        setShowJobSuccessmsg(true);
    };
    useEffect(() => {
        if (jobsuccessmsg) {
            if (enableAnalyzer) {
                message.success('Edf Analyzer enabled for this request');
            } else if (!enableAnalyzer) {
                message.success('Edf Analyzer disabled for this request');
            }
            setShowJobSuccessmsg(false);
        }
        if (joberrormsg) {
            message.error("Edf Analyzer couldn't be enabled");
            setShowJobErrormsg(false);
        }
    }, [jobsuccessmsg, joberrormsg]);

    function getEdfStepsDetails() {
        const inputJson = {
            req_id: location.state?.id || 0,
        };
        new Promise((resolve) => {
            dispatch(getEdfProcessing(inputJson) as any);
            resolve(null);
        }).finally(() => {
            setInitialLoading(false);
        });
    }


    useEffect(() => {
        getEdfStepsDetails();
    }, [location.state?.id, dispatch]);

    useEffect(() => {
        if (edfProcessInfo?.data?.overall_status != 'complete' && edfProcessInfo?.data?.overall_status != 'error' && !loading5) {
            const interval = setInterval(() => {
                getEdfStepsDetails();
            }, 8000); // 8 seconds in milliseconds
            setInitialLoading(false);
            return () => clearInterval(interval);
        }
        return undefined;
    });

    useEffect(() => {
        if (edfProcessInfo?.Job_info) {
            const eyeOpenArray = edfProcessInfo?.Job_info?.filter((item: any) => item?.doc_type?.toLowerCase() === 'eye open');
            const eyeCloseArray = edfProcessInfo?.Job_info?.filter((item: any) => item?.doc_type?.toLowerCase() === 'eye close');
            setEyeOpen(eyeOpenArray[0]);
            setEyeClose(eyeCloseArray[0]);
            if (eyeOpenArray !== null && eyeOpenArray?.length > 0) {
                setEyeSteps(eyeOpenArray[0]);
            } else if (eyeCloseArray !== null && eyeCloseArray?.length > 0) {
                setEyeSteps(eyeCloseArray[0]);
            } else {
                setEyeSteps([]);
            }
        }
    }, [edfProcessInfo?.Job_info]);

    const showModal = (val: any, doctype: string, id: number) => {
        setDocType(doctype);
        setRowData(null);
        setOpenModal(true);
        setRowData(val);
        setJobID(id);
    };

    const handleCancel = () => {
        setOpenModal(false);
        setRowData(null);
    };

    const cancelJob = (id: number) => {
        const inputJson = {
            servicerequestid: id,
        };
        dispatch(cancelEdfJobs(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    const resetJob = (id: number) => {
        const inputJson = {
            servicerequestid: id,
        };
        dispatch(resetEdfJobs(inputJson) as any);
        setShowErrormsg1(true);
        setShowSuccessmsg1(true);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Job has been cancelled successfully');
            navigateBack()
        }
        if (errormsg) {
            setShowErrormsg(false);
            message.error('Job couldn"t be cancelled');
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg1) {
            setShowSuccessmsg1(false);
            message.success('Job has been reset successfully');
            getEdfStepsDetails()
        }
        if (errormsg1) {
            setShowErrormsg1(false);
            message.error('Job couldn"t be reset');
        }
    }, [successmsg1, errormsg1]);

    const handleNavigate = () => {
        if (edfProcessInfo?.data?.Request_status === 'Released') {
            navigate('/released-request/dataset-information', {
                state: {
                    id: location.state?.id,
                    rowData: location.state?.rowData,
                },
            } as NavigateOptions);
        } else {
            navigate('/view-request/pipeline-request', {
                state: {
                    id: location.state?.id,
                    request_from: 'jobMng',
                    is_billing: location.state?.is_billing,
                    reqDetail: location.state?.rowData,
                    reqFrom: location.state?.rowData?.request_from
                },
            } as NavigateOptions);
        }
    };

    return (
        <div className="p-2">
            <div className="mt-2 d-flex grid-title-card">
                <h5 className="my-auto">EDF Processing Details</h5>
                <div className="ms-auto d-flex justify-content-center align-items-center">
                    {userRole !== 'researcher' ? <Popconfirm title={enableAnalyzer ? 'Are you sure to disable EDF analyzer for this request?' : 'Are you sure to enable EDF analyzer for this request?'} onConfirm={getAnalyzer}>
                        <div className="me-2 pointer">
                            <Switch size="small" defaultChecked={enableAnalyzer} checked={enableAnalyzer}></Switch>
                            <span className="ps-2 fs-16">EDF Analyzer</span>
                        </div>
                    </Popconfirm> : ""}
                    <Button type="primary" onClick={navigateBack}>
                        Back
                    </Button>
                </div>
            </div>
            <Spin spinning={initialLoading}>
                <div className="bg-white p-3 mt-3">
                    <div className="bg-light shadow-sm p-2 d-flex justify-content-around">
                        <div className="p-3"></div>
                        {filteredTitleOptions?.map((item: any) => {
                            const date = item.type === 'date' ? new Date(item.value) : null;
                            return (
                                <div className="col" key={item.id}>
                                    <h6 className="text-dark">{item.label}</h6>
                                    <p
                                        className={`${item.type === 'number' && userRole !== 'researcher' ? 'text-blue text-underline pointer w-auto' : ''} text-capitalize mb-0 fs-15`}
                                        {...(item.type === 'number' && userRole !== 'researcher' && { onClick: handleNavigate })}
                                    >
                                        {item.type === 'date' ? date?.toLocaleDateString() : item.value}
                                    </p>
                                </div>
                            );
                        })}
                        <div className="col">
                            <h6 className="text-dark">Overall Status</h6>
                            <p
                                className={`${edfProcessInfo?.data?.overall_status === 'complete'
                                    ? 'text-success'
                                    : edfProcessInfo?.data?.overall_status === 'error'
                                        ? 'text-danger'
                                        : edfProcessInfo?.data?.overall_status?.toLowerCase() === 'yet to start'
                                            ? 'text-purple'
                                            : 'text-warning'
                                    } fs-15 text-capitalize fw-bold mb-0`}
                            >
                                {edfProcessInfo?.data?.overall_status}
                            </p>
                        </div>
                    </div>
                    <table className="table-bordered w-100 edf-step-header mt-3 px-0 mx-0">
                        <thead>
                            <tr>
                                <th className="p-2 border-0 step-name">Steps</th>
                                <th className="p-2 border-0 text-center" colSpan={2}>
                                    Eyes closed condition
                                    <Popover content={EyeCloseContent} title="Eyes Closed Details">
                                        <span className="ms-2 fs-13 pointer">
                                            <DoubleLeftOutlined rotate={270} />
                                        </span>
                                    </Popover>
                                </th>
                                <th className="p-2 border-0 text-center" colSpan={2}>
                                    Eyes opened condition
                                    <Popover content={EyeOpenContent} title="Eyes Opened Details">
                                        <span className="ms-2 fs-13 pointer">
                                            <DoubleLeftOutlined rotate={270} />
                                        </span>
                                    </Popover>
                                </th>
                                <th className="border-0">
                                    {edfProcessInfo ? (
                                        edfProcessInfo?.data?.Request_status == 'Released' || userRole === 'researcher' ? (
                                            ''
                                        ) : (
                                            <div className="col-auto d-flex ">
                                                <Popconfirm
                                                    placement="topLeft"
                                                    title="Are you sure to cancel this job?"
                                                    onConfirm={() => cancelJob(edfProcessInfo?.data?.ServiceRequestID)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button type="default" danger className="ms-auto bg-danger border-0 text-white col-auto me-1 fw-bold" loading={loading8}>
                                                        Cancel Job
                                                    </Button>
                                                </Popconfirm>
                                                <Popconfirm
                                                    placement="topLeft"
                                                    title="Are you sure to reset this job?"
                                                    onConfirm={() => resetJob(edfProcessInfo?.data?.ServiceRequestID)}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <Button type="default" className="bg-warning text-dark col-auto bg-blue me-2 fw-bold" loading={loading9}>
                                                        Reset Job
                                                    </Button>
                                                </Popconfirm>
                                            </div>
                                        )
                                    ) : (
                                        <div className="col-auto d-flex me-2">
                                            <Popconfirm
                                                placement="topLeft"
                                                title="Are you sure to cancel this job?"
                                                onConfirm={() => cancelJob(edfProcessInfo?.ServiceRequestID)}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button type="default" danger className="ms-auto bg-danger border-0 text-white col-auto me-1 fw-bold" loading={loading8}>
                                                    Cancel Job
                                                </Button>
                                            </Popconfirm>
                                        </div>
                                    )}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading5 && loadingJob ? (
                                <LoadingIndicator />
                            ) : (
                                <>
                                    {eyeSteps?.processing_steps?.map((item: any, index: number) => {
                                        const correspondingItem = eyeOpen?.processing_steps?.[index]; // Access corresponding item
                                        const eyeCloseItem = eyeClose?.processing_steps?.[index] || null;
                                        return (
                                            <React.Fragment key={index + 1}>
                                                <tr className="heading">
                                                    <td className="p-2 ">{item?.heading}</td>
                                                    <td className="p-2 text-center status-heading">{index === 0 ? 'Status' : ''}</td>
                                                    <td className="p-2 text-center output-heading">{index === 0 ? 'Output View' : ''}</td>
                                                    <td className="p-2 text-center status-heading">{index === 0 ? 'Status' : ''}</td>
                                                    <td className="p-2 text-center output-heading">{index === 0 ? 'Output View' : ''}</td>
                                                    <td className="p-2">{index === 0 ? 'Comments' : ''}</td>
                                                </tr>
                                                {item.steps?.map((val: any, ind: number) => {
                                                    const value = correspondingItem?.steps?.[ind];
                                                    const value1 = eyeCloseItem?.steps?.[ind] || null;
                                                    return (
                                                        <tr key={ind + 140}>
                                                            <td className="p-2">{val.step_name}</td>
                                                            <td className="p-2 text-center">
                                                                <Button
                                                                    className={`${value1?.step_status?.toLowerCase() === 'complete' || value1?.step_status?.toLowerCase() === 'done'
                                                                        ? 'success-btn'
                                                                        : value1?.step_status?.toLowerCase() === 'in progress' || value1?.step_status?.toLowerCase() === 'inprogress'
                                                                            ? 'warning-btn'
                                                                            : value1?.step_status?.toLowerCase() === 'yet to start'
                                                                                ? 'lightgray-btn'
                                                                                : value1?.step_status?.toLowerCase() === 'error'
                                                                                    ? 'danger-btn'
                                                                                    : value1?.step_status?.toLowerCase() === 'skip'
                                                                                        ? 'purple-btn '
                                                                                        : ''
                                                                        } border-0 w-100`}
                                                                >
                                                                    {value1?.step_status?.toLowerCase() === 'in progress' || value1?.step_status?.toLowerCase() === 'inprogress' ? (
                                                                        <SyncOutlined spin className="text-dark" />
                                                                    ) : value1?.step_status?.toLowerCase() === 'yet to start' ? (
                                                                        'Yet to Start'
                                                                    ) : (
                                                                        <span className="text-capitalize">{value1?.step_status || '--'}</span>
                                                                    )}
                                                                </Button>
                                                            </td>
                                                            <td className="p-2 text-center fs-15 text-primary">
                                                                <span className="pointer">
                                                                    {value1 && value1?.output_file !== '' ? (
                                                                        value1?.output_type == 'png' ? (
                                                                            <FileImageOutlined onClick={() => showModal(value1, 'Eye Close', eyeClose?.job_id)} />
                                                                        ) : value1?.output_type == 'txt' ? (
                                                                            <FileTextOutlined onClick={() => showModal(value1, 'Eye Close', eyeClose?.job_id)} />
                                                                        ) : value1?.output_type == 'xlsx' || value1?.output_type === 'xls' ? (
                                                                            <a href={value1.output_file}
                                                                                download="filename.xlsx"
                                                                                className='text-primary'
                                                                            >
                                                                                <FileExcelOutlined />
                                                                            </a>
                                                                        ) : (
                                                                            <FilePdfOutlined onClick={() => showModal(value1, 'Eye Close', eyeClose?.job_id)} />
                                                                        )
                                                                    ) : (
                                                                        '--'
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <Button
                                                                    className={`${value?.step_status?.toLowerCase() === 'complete' || value?.step_status?.toLowerCase() === 'done'
                                                                        ? 'success-btn'
                                                                        : value?.step_status?.toLowerCase() === 'in progress' || value?.step_status?.toLowerCase() === 'inprogress'
                                                                            ? 'warning-btn'
                                                                            : value?.step_status?.toLowerCase() === 'yet to start'
                                                                                ? 'lightgray-btn'
                                                                                : value?.step_status?.toLowerCase() === 'error'
                                                                                    ? 'danger-btn'
                                                                                    : value?.step_status?.toLowerCase() === 'skip'
                                                                                        ? 'purple-btn '
                                                                                        : ''
                                                                        } border-0 w-100`}
                                                                >
                                                                    {value?.step_status?.toLowerCase() === 'in progress' || value?.step_status?.toLowerCase() === 'inprogress' ? (
                                                                        <SyncOutlined spin className="text-dark" />
                                                                    ) : value?.step_status?.toLowerCase() === 'yet to start' ? (
                                                                        'Yet to Start'
                                                                    ) : (
                                                                        <span className="text-capitalize">{value?.step_status}</span>
                                                                    )}
                                                                </Button>
                                                            </td>
                                                            <td className="p-2 text-center fs-15 text-primary">
                                                                <span className="pointer">
                                                                    {value && value.output_file !== '' ? (
                                                                        value.output_type == 'png' ? (
                                                                            <FileImageOutlined onClick={() => showModal(value, 'Eye Open', eyeOpen?.job_id)} />
                                                                        ) : value.output_type == 'txt' ? (
                                                                            <FileTextOutlined onClick={() => showModal(value, 'Eye Open', eyeOpen?.job_id)} />
                                                                        ) : value.output_type == 'xlsx' || value.output_type === 'xls' ? (

                                                                            <a href={value.output_file}
                                                                                download="filename.xlsx"
                                                                                className='text-primary'
                                                                            >
                                                                                <FileExcelOutlined />
                                                                            </a>
                                                                        ) : (
                                                                            <FilePdfOutlined onClick={() => showModal(value, 'Eye Open', eyeOpen?.job_id)} />
                                                                        )
                                                                    ) : (
                                                                        '--'
                                                                    )}
                                                                </span>
                                                            </td>
                                                            <td className="p-2">{val.comments || '--'}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </React.Fragment>
                                        );
                                    })}
                                </>
                            )}
                        </tbody>
                    </table>
                </div>
            </Spin>
            <ViewResult data={{ rowData, openModal, handleCancel, docType }} jobID={jobID} reqNo={edfProcessInfo?.data?.encoded_RequestNumber || ''} />
        </div>
    );
};

export default EdfProcessing;


function LoadingIndicator() {
    return (
        <tr className="p-2">
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
            <td>
                <Skeleton
                    active
                    className="col p-2"
                    paragraph={{
                        rows: 2,
                    }}
                />
            </td>
        </tr>
    );
}