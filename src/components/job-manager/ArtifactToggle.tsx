import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate , NavigateOptions} from 'react-router-dom';
import API_URL from 'config.js';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import { getEdfProcessing, getEdfStepResult } from 'services/actions/jobManagerAction';
import { triggerBase64Download } from 'common-base64-downloader-react';
import { getEdfAnalyzerTopos, resetEdfJobs, cancelEdfJobs } from 'services/actions/jobManagerAction';
import { Button, Image, message, Modal, Progress, Skeleton, Spin, Tabs } from 'antd';
import { url2 } from 'components/shared/CompVariables';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

function TopographyImages(data) {
    const [outputVal, setOutputVal] = useState();
    const [outputVal1, setOutputVal1] = useState();
    const [outputVal2, setOutputVal2] = useState();
    const [outputVal3, setOutputVal3] = useState();
    const [outputVala, setOutputVala] = useState();
    const [outputVal1a, setOutputVal1a] = useState();
    const [outputVal2a, setOutputVal2a] = useState();
    const [outputVal3a, setOutputVal3a] = useState();
    const [loadingIcon, setLoadingIcon] = useState(false);
    const popdata = data?.data.output1?.length === 0 ? '' : data?.data?.output1?.split('.')?.pop();
    const popdata1 = data?.data.output2?.length === 0 ? '' :data?.data?.output2?.split('.')?.pop();
    const popdata2 = data?.data.eooutput1?.length === 0 ? '' :data?.data?.eooutput1?.split('.')?.pop();
    const popdata3 = data?.data.eooutput2?.length === 0 ? '' : data?.data?.eooutput2?.split('.')?.pop();

    useEffect(() => {
        if (popdata == 'txt') {
            if (data?.data?.output1) {
                setLoadingIcon(true);
                getPngInfo(data?.data?.output1?.startsWith('https:') ? data?.data?.output1 : "");
            } else {
                setLoadingIcon(false);
            }
        }
    }, [popdata, data?.data?.output1]);

    useEffect(() => {
        if (popdata1 == 'txt') {
            if (data?.data?.output2) {
                setLoadingIcon(true);
                getPngInfo1( data?.data?.output2?.startsWith('https:') ? data?.data?.output2 : "");
            } else {
                setLoadingIcon(false);
            }
        }
    }, [popdata1, data?.data?.output2]);

    useEffect(() => {
        if (popdata2 == 'txt') {
            if (data?.data?.eooutput1) {
                setLoadingIcon(true);
                getPngInfo3(data?.data?.eooutput1?.startsWith('https:') ?  data?.data?.eooutput1  :  "");
            } else {
                setLoadingIcon(false);
            }
        }
    }, [popdata2, data?.data?.eooutput1]);

    useEffect(() => {
        if (popdata3 == 'txt') {
            if (data?.data?.eooutput2) {
                setLoadingIcon(true);
                getPngInfo4(data?.data?.eooutput2?.startsWith('https:') ? data?.data?.eooutput2  : "");
            } else {
                setLoadingIcon(false);
            }
        }
    }, [popdata3, data?.data?.eooutput2]);

    function getPngInfo(imageUrl) {
        axios
            .get(imageUrl)
            .then((response) => {
                const page1DataValue = response?.data?.page1_data;
                const page2DataValue = response?.data?.page2_data;
                setLoadingIcon(false);
                setOutputVal1(page2DataValue);
                setOutputVal(page1DataValue);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    function getPngInfo1(imageUrl) {
        axios
            .get(imageUrl)
            .then((response) => {
                const page1DataValue = response?.data?.page1_data;
                const page2DataValue = response?.data?.page2_data;
                setLoadingIcon(false);
                setOutputVal3(page2DataValue);
                setOutputVal2(page1DataValue);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    function getPngInfo3(imageUrl) {
        axios
            .get(imageUrl)
            .then((response) => {
                const page1DataValue = response?.data?.page1_data;
                const page2DataValue = response?.data?.page2_data;
                setLoadingIcon(false);
                setOutputVal1a(page2DataValue);
                setOutputVala(page1DataValue);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }
    function getPngInfo4(imageUrl) {
        axios
            .get(imageUrl)
            .then((response) => {
                const page1DataValue = response?.data?.page1_data;
                const page2DataValue = response?.data?.page2_data;
                setLoadingIcon(false);
                setOutputVal3a(page2DataValue);
                setOutputVal2a(page1DataValue);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    return (
        <div className="topo-height border p-3">
            <h6 className="txt-primary fs-17 ">{data?.data?.title}</h6>
            <h6 className="mt-3">Eyes Closed</h6>
            <div className="bg-aliceblue p-2 d-flex">
                <div className="col-md-6">
                    <p className="fw-bold fs-15">Processed Result</p>
                    <div>
                        {data?.data?.output2 && data?.data?.output2?.length === 0 ? (
                            'No data found'
                        ) : (
                            <>
                                {popdata === 'png' || popdata === 'jpg' || popdata === 'jpeg' ? (
                                    <Image src={ data?.data?.output2?.startsWith('https:') ? data?.data?.output2 :  ""} />
                                ) : popdata === 'txt' ? (
                                    <Spin spinning={loadingIcon}>
                                        <Image src={`data:image/png;base64,${outputVal2}`} width="100%" height="auto" />
                                        <Image src={`data:image/png;base64,${outputVal3}`} width="100%" height="auto" />
                                    </Spin>
                                ) : (
                                    ''
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className="col-md-6">
                    <p className="fw-bold fs-15">Non-Processed Result</p>
                    <div>
                        {data?.data?.output1 && data?.data?.output1?.length === 0 ? (
                            'No data found'
                        ) : (
                            <>
                                {popdata === 'png' || popdata === 'jpg' || popdata === 'jpeg' ? (
                                    <Image src={data?.data?.output1?.startsWith('https:')? data?.data?.output1 : ""} />
                                ) : popdata === 'txt' ? (
                                    <Spin spinning={loadingIcon}>
                                        <Image src={`data:image/png;base64,${outputVal}`} width="100%" height="auto" />
                                        <Image src={`data:image/png;base64,${outputVal1}`} width="100%" height="auto" />
                                    </Spin>
                                ) : (
                                    ''
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
            {data?.data?.id === '3' ? (
                ''
            ) : (
                <>
                    <h6 className="mt-3">Eyes Opened</h6>
                    <div className="bg-aliceblue p-2 d-flex">
                        <div className="col-md-6">
                            <p className="fw-bold fs-15">Processed Result</p>
                            <div>
                                {data?.data?.eooutput2 && data?.data?.eooutput2?.length === 0 ? (
                                    'No data found'
                                ) : (
                                    <>
                                        {popdata === 'png' || popdata === 'jpg' || popdata === 'jpeg' ? (
                                            <Image src={data?.data?.eooutput2?.startsWith('https:') ? data?.data?.eooutput2  : ""} />
                                        ) : popdata === 'txt' ? (
                                            <Spin spinning={loadingIcon}>
                                                {' '}
                                                <Image src={`data:image/png;base64,${outputVal2a}`} width="100%" height="auto" />
                                                <Image src={`data:image/png;base64,${outputVal3a}`} width="100%" height="auto" />
                                            </Spin>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <p className="fw-bold fs-15">Non-Processed Result</p>
                            <div>
                                {data?.data?.eooutput1 && data?.data?.eooutput1?.length === 0 ? (
                                    'No data found'
                                ) : (
                                    <>
                                        {popdata === 'png' || popdata === 'jpg' || popdata === 'jpeg' ? (
                                            <Image src={data?.data?.eooutput1?.startsWith('https:') ? data?.data?.eooutput1 :  ""} />
                                        ) : popdata === 'txt' ? (
                                            <Spin spinning={loadingIcon}>
                                                {' '}
                                                <Image src={`data:image/png;base64,${outputVala}`} width="100%" height="auto" />
                                                <Image src={`data:image/png;base64,${outputVal1a}`} width="100%" height="auto" />
                                            </Spin>
                                        ) : (
                                            ''
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}


export default function ArtifactToggle() {
    const location = useLocation();
    const history = useNavigate();
    const dispatch = useDispatch();
    const backendURL = API_URL;
    const url1 = backendURL.slice(0, backendURL.lastIndexOf('/'));
    const url2 = url1.slice(0, url1.lastIndexOf('/'));
    const [open, setOpen] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [title, setTitle] = useState('');
    const [loadingJob, setLoadingJob] = useState(true);
    const {xlsxInfo,loading7, success7,  loading5, success5, edfProcessInfo,
        success9,success6,loading6,edfTopoInfos } = useSelector((state: any) => state.jobManager)
    const [showMsg, setShowMsg] = useState(false);
    const serviceRequestid = edfProcessInfo ? edfProcessInfo?.data : [];
    const successMsg = showMsg ? success7 : null;
    const downloadProgress = useSelector((state: any) => state.download.docDownProgress);
    const [hideprogress, setHideprogress] = useState(false);
    const showprogress = hideprogress ? downloadProgress : null;
    const userRole = sessionStorage.getItem('role');
    const ReqId: any = location?.state?.sid;
    const jobManagerReq = location?.state?.reqFrom;
    const edfReq = location?.state?.reqFromEdf;
    const requestFrom = jobManagerReq ? jobManagerReq : edfReq;
    const jobProcessInfo = edfProcessInfo ? edfProcessInfo?.Job_info[0] : [];
    const customFormat = (percent) => `${percent}%`;
    const [open2, setOpen2] = useState(false);
    const [eyeCondition, setEyeCondition] = useState('');
    const [topoName, setTopoName] = useState('FFT-Absolute Power');
    const [outputVal, setOutputVal] = useState('');
    const [outputVal1, setOutputVal1] = useState('');
    const [outputType, setOutputType] = useState('');
    const [loadingIcon, setLoadingIcon] = useState(false);
    const [eyeCloseArr, setEyeCloseArr] = useState([]);
    const [eyeOpenArr, setEyeOpenArr] = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success9 : null;
    const [resultPath, setResultPath] = useState('');
    const [resultGphName, setResultGphName] = useState('');
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success6 : null;

    const docs = [
        {
            uri: resultPath?.startsWith('https:') ? resultPath : '',
            fileName: resultGphName,
        },
    ];

    useEffect(() => {
        allJobs();
    }, [dispatch]);

    function allJobs() {
        const inputJson = {
            req_id: ReqId,
        };
        dispatch(getEdfProcessing(inputJson) as any);
    }

    function getEdfAnalyzers() {
        dispatch(getEdfAnalyzerTopos(location?.state?.sid) as any);
    }

    useEffect(() => {
        getEdfAnalyzers();
    }, []);

    const handleCancel = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (edfProcessInfo?.data?.overall_status !== 'complete' && edfProcessInfo?.data?.overall_status !== 'error') {
            const interval = setInterval(() => {
                allJobs();
            }, 8000); // 8 seconds in milliseconds
            return () => clearInterval(interval);
        }
        return undefined;
    });

    const callEDF = (stepid, stepname, otype) => {
        const inputJson = {
            job_id: stepname,
            step_id: stepid,
        };
        if (otype == 'pdf') {
            setOpen3(true);
        } else if (otype == 'xlsx') {
            setOpen1(true);
        } else if ((otype == 'png' && stepid == 21) || stepid == 22 || stepid == 23) {
            setOpen2(true);
        } else {
            setOpen(true);
        }
        dispatch(getEdfProcessing(inputJson) as any);
        setShowMsg(true);
        setHideprogress(true);
    };
    const handleCancel1 = () => {
        setOpen1(false);
    };
    const handleCancel2 = () => {
        setOpen2(false);
    };

    useEffect(() => {
        if (successMsg) {
            if (xlsxInfo?.step_output?.output_type == 'xlsx' || xlsxInfo?.step_output?.output_type == 'xls') {
                triggerBase64Download(
                    `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxInfo?.step_output?.output}`,
                    `${(edfProcessInfo ? edfProcessInfo?.data?.RequestNumber : 'Output') && eyeCondition == 'open' ? 'EO' : 'EC'}result_file`
                );
            } else return;
            setShowMsg(false);
        }
    }, [successMsg]);

    useEffect(() => {
        if (success7) {
            setLoadingJob(false);
        }
    }, [success7]);

    useEffect(() => {
        if (showprogress) {
            if (showprogress == 100) {
                setTimeout(() => {
                    setHideprogress(false);
                    setOpen1(false);
                }, 3000);
            }
        }
    }, [showprogress]);

    const handleBack = () => {
        if (edfProcessInfo?.data?.Request_status === 'Released') {
            history(`/released-request/dataset-information`, {
                state: {
                    reqId: edfProcessInfo?.data?.ServiceRequestID,
                },
            } as NavigateOptions);
        } else {
            history(`/view-request/pipeline-request`, {
                state: {
                    reqId: edfProcessInfo?.data?.ServiceRequestID,
                    request_from: requestFrom,
                },
            } as NavigateOptions);
        }
    };
    const cancelJob = (id) => {
        const inputJson = {
            servicerequestid: id,
        };
        dispatch(cancelEdfJobs(inputJson) as any);
        setShowSuccessmsg1(true);
    };
    const resetJob = (id) => {
        const inputJson = {
            servicerequestid: id,
        };
        dispatch(resetEdfJobs(inputJson) as any);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Job reset has been done successfully');
            allJobs();
            setShowSuccessmsg(false);
        }
    }, [successmsg]);

    useEffect(() => {
        if (successmsg1) {
            message.success('Job cancel has been done successfully');
            handleBackFunc();
            setShowSuccessmsg1(false);
        }
    }, [successmsg1]);

    useEffect(() => {
        if (edfProcessInfo?.Job_info) {
            if (edfProcessInfo?.Job_info[0]?.doc_type == 'Eye Open') {
                setEyeOpenArr(edfProcessInfo?.Job_info[0]);
                setEyeCloseArr(edfProcessInfo?.Job_info[1]);
            } else {
                setEyeOpenArr(edfProcessInfo?.Job_info[1]);
                setEyeCloseArr(edfProcessInfo?.Job_info[0]);
            }
        }
    }, [edfProcessInfo?.Job_info]);

    const handleCancel3 = () => {
        setOpen3(false);
    };
    const handleCancel4 = () => {
        setOpen4(false);
        setResultPath('');
    };

    const handleOpenTopography = (item: any) => {
        setOutputType(item?.output_type);
        if (item?.output_type === 'txt') {
            setOutputVal('');
            if (item?.output_file) {
                setLoadingIcon(true);
                getPngInfo( item?.output_file?.startsWith('https:') ? item?.output_file  : '');
                setOpen3(true);
            } else {
                setLoadingIcon(false);
            }
        } else {
            setOutputVal(item?.output_file);
            setOpen3(true);
        }
    };

    const handleResultPreview = (item: any) => {
        setOutputType(item?.output_type);
        if (item?.output_type === 'pdf') {
            setResultPath(item?.output_file);
            setResultGphName(item?.step_name);
            setOpen4(true);
            setLoadingIcon(true);
        }
    };

    function getPngInfo(imageUrl: any) {
        axios
            .get(imageUrl)
            .then((response) => {
                const page1DataValue = response?.data?.page1_data;
                const page2DataValue = response?.data?.page2_data;
                setLoadingIcon(false);
                setOutputVal1(page2DataValue);
                setOutputVal(page1DataValue);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }

    const handleBackFunc = () => {
        history('/edf_job_manager');
    };

    const jobEO = edfProcessInfo?.Job_info?.filter((job: any) => job.doc_type?.toLowerCase() === 'eye open').flatMap((job: any) => job.processing_steps);
    // const jobEO = edfDoclistInfoUpd?.Job_info?.filter((job) => job.doc_type?.toLowerCase() == 'eye open').map((job) => job.processing_steps);
    const jobEC = edfProcessInfo?.Job_info?.filter((job: any) => job.doc_type?.toLowerCase() == 'eye close').flatMap((job: any) => job.processing_steps);
    const topographySteps = jobEO ? jobEO?.filter((job: any) => job.heading?.toLowerCase() === 'topography').flatMap((step: any) => step.steps) : [];
    const topographyStepsEC = jobEC ? jobEC?.filter((job: any) => job.heading?.toLowerCase() === 'topography').flatMap((step: any) => step.steps) : [];

    const tabItems = [
        {
            label: 'Absolute Power',
            key: '1',
            children: (
                <TopographyImages
                    data={{
                        title: 'Absolute Power',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_absolute_power_topo_path || '',
                        type1: '',
                        id: '1',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_absolute_power_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_absolute_power_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_absolute_power_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'Relative Power',
            key: '2',
            children: (
                <TopographyImages
                    data={{
                        title: 'Relative Power',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_relative_power_topo_path || '',
                        type1: '',
                        id: '2',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_relative_power_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_relative_power_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_relative_power_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'PDR Topography',
            key: '3',
            children: (
                <TopographyImages
                    data={{
                        title: 'PDR Topography',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_pdr_topo_path || '',
                        type1: '',
                        id: '3',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_pdr_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_pdr_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_pdr_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'FFT Absolute Power',
            key: '4',
            children: (
                <TopographyImages
                    data={{
                        title: 'FFT Absolute Power',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_FFT_absolute_power_topo_path || '',
                        type1: '',
                        id: '4',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_FFT_absolute_power_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_FFT_absolute_power_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_FFT_absolute_power_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'Z-Scored FFT Absolute Power',
            key: '5',
            children: (
                <TopographyImages
                    data={{
                        title: 'Z-Scored FFT Absolute Power',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_Z_scored_FFT_absolute_power_topo_path || '',
                        type1: '',
                        id: '5',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_Z_scored_FFT_absolute_power_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_Z_scored_FFT_absolute_power_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_Z_scored_FFT_absolute_power_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'FFT Relative Power',
            key: '6',
            children: (
                <TopographyImages
                    data={{
                        title: 'FFT Relative Power',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_FFT_relative_power_topo_path || '',
                        type1: '',
                        id: '6',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_FFT_relative_power_topo_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_FFT_relative_power_topo_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_FFT_relative_power_topo_path,
                    }}
                />
            ),
        },
        {
            label: 'Result EDF Graph',
            key: '7',
            children: (
                <TopographyImages
                    data={{
                        title: 'Result EDF Graph',
                        output1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EC_result_graph_path || '',
                        type1: '',
                        id: '7',
                        status: '',
                        output2: edfTopoInfos?.job_path_info?.edf_job_info?.EC_result_graph_path,
                        eooutput1: edfTopoInfos?.job_path_info?.edf_analyser_job_info?.EO_result_graph_path,
                        eooutput2: edfTopoInfos?.job_path_info?.edf_job_info?.EO_result_graph_path,
                    }}
                />
            ),
        },
    ];

    const items1 = topographySteps
        ? topographySteps?.map((acc: any) => {
              const matchingStepEC = topographyStepsEC?.filter((val) => val?.step_id == acc?.step_id).map((val) => val?.output_file);
              return {
                  label: acc?.step_name,
                  key: acc?.step_id,
                  children: (
                      <TopographyImages data={{ title: acc?.step_name, output1: acc?.output_file, type1: acc?.output_type, id: acc?.step_id, status: acc?.step_status, output2: matchingStepEC ? matchingStepEC[0] : null }} />
                  ),
              };
          })
        : [];
    const items2 = topographyStepsEC
        ? topographyStepsEC?.map((acc: any) => {
              return {
                  label: acc?.step_name,
                  key: acc?.step_id,
                  children: 'This page is under development',
              };
          })
        : [];

    return (
        <div className="p-0 text-start edf-top-most-outer m-2">
            <div className="row p-0 edf-top-outer">
                <div className="rounded-0 edf-outer">
                    <div className="d-flex">
                        <h5 className="">EDF Processing Details</h5>
                        <div className="ms-auto mb-1">
                            <Button type="primary" onClick={handleBackFunc}>
                                Back
                            </Button>
                        </div>
                    </div>
                    <div className="tab-pane bg-white fade show active p-2 mb-2" id="home" role="tabpanel" aria-labelledby="home-tab">
                        <div className="bg-light">
                            <div className="row p-2 mx-1 mt-1">
                                <div className="form-group col">
                                    <label className="fw-bold">Job # </label>
                                    <div className="ms-0 text-capitalize">
                                        {userRole === 'researcher' ? (
                                            <a className="text-decoration-none text-dark"> {edfProcessInfo ? edfProcessInfo?.Job_info[0]?.job_number : ' '} </a>
                                        ) : (
                                            <a className="text-decoration-none text-dark">{edfProcessInfo ? edfProcessInfo?.Job_info[0]?.job_number : ' '}</a>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group col">
                                    <label className="fw-bold">Request No </label>
                                    <div className="ms-1"> {edfProcessInfo ? edfProcessInfo?.data?.encoded_RequestNumber : '---'}</div>
                                </div>
                                {userRole=='researcher'?"":
                                <div className="form-group col">
                                    <label className="fw-bold">Account Name </label>
                                    <div className="ms-1 text-capitalize">
                                        {userRole === 'researcher' ? (
                                            <a className="text-decoration-none text-dark"> {edfProcessInfo ? edfProcessInfo?.data?.account_name : ' '} </a>
                                        ) : (
                                            <a className="text-decoration-none text-dark">{edfProcessInfo ? edfProcessInfo?.data?.account_name : ' '}</a>
                                        )}
                                    </div>
                                </div>}
                                <div className="form-group col">
                                    <label className="fw-bold">Submitted On </label>
                                    <div className="ms-1">{edfProcessInfo ? dayjs(new Date(edfProcessInfo?.Job_info[1]?.submitted_on)).format('MM-DD-YYYY') : ''}</div>
                                </div>
                                <div className="form-group col">
                                    <label className="fw-bold">Submitted by</label>
                                    <div className="ms-1"> Axon Solutions</div>
                                </div>
                                <div className="form-group col">
                                    <label className="fw-bold">Overall Status</label>
                                    <div
                                        className={`ms-1 text-capitalize fw-bold ${edfProcessInfo?.data?.overall_status == 'complete' ? 'text-success' : edfProcessInfo?.data?.overall_status?.toLowerCase() == 'inprogress' ? 'txt-warning' : edfProcessInfo?.data?.overall_status?.toLowerCase() == 'error' ? 'text-danger' : 'text-primary'}`}
                                    >
                                        {edfProcessInfo ? edfProcessInfo?.data?.overall_status : '---'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row m-0 edf-pcontainers">
                        <div className="left-nav-container bg-white p-2">
                            <Tabs className="ps-1" defaultActiveKey="1" tabPosition="left" items={tabItems} />
                        </div>
                    </div>
                </div>
            </div>

            {/* before after image comparison of edf */}
            <Modal title={title} open={open} onCancel={handleCancel} width={1300}>
                <div className="d-flex output-modal">
                    {loading7 ? (
                        <>
                            <Skeleton.Image active className="col p-2 w-100 h-100" />{' '}
                        </>
                    ) : (
                        <>
                            {xlsxInfo?.step_output?.output_file ? (
                                <Image className="col" src={xlsxInfo?.step_output?.output_file?.startsWith('https:') ? xlsxInfo?.step_output?.output_file  : ''} />
                            ) : (
                                <Image className="col" src={`data:image/png;base64,${xlsxInfo?.step_output?.output}`} />
                            )}
                        </>
                    )}
                </div>
            </Modal>

            {/* topography starts */}
            <Modal
                title="PDR Topography"
                open={open2}
                width={1000}
                onCancel={handleCancel2}
                footer={[
                    <Button type="primary" key='close' className="bg-danger text-white" onClick={handleCancel2}>
                        Close
                    </Button>,
                ]}
            >
                <div className="d-flex output-modal border-top">
                    {loading7 ? (
                        <>
                            <Skeleton.Image active className="col p-2 w-100 h-100" />{' '}
                        </>
                    ) : (
                        <>
                            <Image className="col " src={`data:image/png;base64,${xlsxInfo?.step_output?.output}`} />
                        </>
                    )}
                </div>
            </Modal>

            <Modal
                title={topoName}
                open={open3}
                width={1000}
                onCancel={handleCancel3}
                footer={[
                    <Button key="closespdf" type="primary" className="bg-danger text-white" onClick={handleCancel3}>
                        Close
                    </Button>,
                ]}
            >
                <div style={{ height: '550px', overflow: 'auto' }} className="row">
                    {hideprogress ? (
                        <Progress
                            type="circle"
                            className="text-center mx-auto my-auto"
                            percent={showprogress}
                            size={200}
                            strokeWidth={4}
                            strokeColor={{
                                '0%': '#1F98DF',
                                '100%': '#87d068',
                            }}
                            format={customFormat}
                        />
                    ) : outputType == 'png' ? (
                        <Image src={outputVal?.startsWith('https:') ? outputVal :''} />
                    ) : (
                        <>
                            {loadingIcon ? (
                                <Spin />
                            ) : (
                                <>
                                    <Image src={`data:image/png;base64,${outputVal}`} /> <Image src={`data:image/png;base64,${outputVal1}`} />
                                </>
                            )}
                        </>
                    )}
                </div>
            </Modal>

            {/* topography ends */}
            <Modal
                title={title}
                open={open1}
                onCancel={handleCancel1}
                height={200}
                footer={[
                    <Button key="closepdf" type="primary" className="bg-danger text-white" onClick={handleCancel1}>
                        Close
                    </Button>,
                ]}
            >
                <div className=" output-modal text-center my-auto">
                    <p className="text-center mt-5 mb-3">Downloading File...</p>

                    {hideprogress ? (
                        <Progress
                            type="circle"
                            className="text-center mx-auto my-auto"
                            percent={showprogress}
                            size={200}
                            strokeWidth={4}
                            strokeColor={{
                                '0%': '#1F98DF',
                                '100%': '#87d068',
                            }}
                            format={customFormat}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </Modal>

            {/* result preview */}
            <Modal
                title="Report Preview"
                open={open4}
                onCancel={handleCancel4}
                width={700}
                footer={[
                    <Button key="closepdf" type="primary" className="bg-danger text-white" onClick={handleCancel4}>
                        Close
                    </Button>,
                ]}
            >
                <div className=" output-modal text-center my-auto">
                    <DocViewer
                        documents={docs}
                        initialActiveDocument={docs[1]}
                        pluginRenderers={DocViewerRenderers}
                        theme={{
                            primary: '#5a53b2',
                            secondary: '#ffffff',
                            tertiary: 'rgb(102 96 176 / 40%)',
                            textPrimary: '#ffffff',
                            textSecondary: '#5a53b2',
                            textTertiary: '#ffffff',
                            disableThemeScrollbar: true,
                        }}
                    />
                </div>
            </Modal>
        </div>
    );
}