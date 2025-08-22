import React, { useEffect, useState } from 'react';
import loadable from '@loadable/component';
import { Button } from 'components/shared/ButtonComponent';
import { Steps, useDispatch, useSelector, Spin, Popconfirm, Tooltip, message, Progress, Skeleton } from 'components/shared/AntComponent';
import { Checkbox, Form, Input } from 'components/shared/FormComponent';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import dayjs from 'dayjs';
import { getRequestAssMarkers, getResultInfo, getTopoResultInfo, getWizardSteps, removeRequestTag, saveAdditionalReportItems } from 'services/actions/pipeline/stepwizardAction';
import { getAssociateCommon, saveAssociateCommon } from 'services/actions/commonServiceAction';
import { PlusCircleFilled } from '@ant-design/icons';
import DiagnosisModal from './step-screens/modal/DiagnosisModal';
import { url2 } from 'components/shared/CompVariables';
import { getRequestCredit } from 'services/actions/billingAction';
import TermsAgreement from 'components/request/modal/sub-screens/TermsAgreement';
const RequestInformation = loadable(() => import('./step-screens/RequestInformation'), { fallback: <LoadingIndicator /> });
const AssociatedFile = loadable(() => import('./step-screens/AssociatedFile'), { fallback: <LoadingIndicator /> });
const EdfProcess = loadable(() => import('./step-screens/EdfProcess'), { fallback: <LoadingIndicator /> });
const Interpretation = loadable(() => import('./step-screens/Interpretation'), { fallback: <LoadingIndicator /> });
const RecordingAnalysis = loadable(() => import('./step-screens/RecordingAnalysis'), { fallback: <LoadingIndicator /> });
const ApproveRequest = loadable(() => import('./step-screens/ApproveRequest'), { fallback: <LoadingIndicator /> });

type StepProps = {
    key: number;
    status: 'finish' | 'wait' | 'process' | 'error' | undefined;
    title: string;
    icon: number;
    content: any;
};

const { TextArea } = Input;

const PipelineWizard: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { requestInfo, loading5 } = useSelector((state: any) => state.pipeline);
    const { creditReqInfo, loading2 } = useSelector((state: any) => state.billing);
    const { stepsInfo, error7, success7, loading4, resultInfo, loading10, success10, error10, topoResultInfo } = useSelector((state: any) => state.wizard);
    const { commonInfo, loading5: commonLoading, success6, error6 } = useSelector((state: any) => state.commonData);
    const [openModal, setOpenModal] = useState(false);
    const [current, setCurrent] = useState(0);
    const requestData = !loading5 ? requestInfo?.data?.reqinfo : [];
    const accountAss = creditReqInfo?.data?.filter((item: any) => item.req_associate && !item.is_admin_associate) || [];
    const adminAss = creditReqInfo?.data?.filter((item: any) => (item?.is_associate && !item.req_associate) || ((item?.req_associate && item?.is_admin_associate) || !item.req_associate)) || [];
    const [selectedItm, setSelectedItm]: any = useState([]);
    const [type, setType] = useState('');
    const [downloadPercent, setDownloadPercent] = useState(0);
    const [isDownload, setIsDownload] = useState(false);
    //diagnosis and symptoms
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    // remove tag
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success7 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error7 : false;
    //additional report items
    const [showSuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showSuccessmsg2 ? success10 : false;
    const [showErrormsg2, setShowErrormsg2] = useState(false);
    const errormsg2 = showErrormsg2 ? error10 : false;
    const [termModal, setTermModal] = useState(false);

    const stepItems: StepProps[] = [
        { key: 1, status: stepsInfo?.data?.request_initation === true ? 'finish' : 'wait', title: 'Request Information', icon: 1, content: <RequestInformation /> },
        { key: 2, status: stepsInfo?.data?.associated_documents === true ? 'finish' : 'wait', title: 'Associated File', icon: 2, content: <AssociatedFile /> },
        { key: 3, status: stepsInfo?.data?.edf_processing === true ? 'finish' : 'wait', title: 'EDF processing', icon: 3, content: <EdfProcess /> },
        { key: 4, status: stepsInfo?.data?.Interpretation === true ? 'finish' : 'wait', title: 'Interpretation', icon: 4, content: <Interpretation /> },
        { key: 5, status: stepsInfo?.data?.recording_analysis === true ? 'finish' : 'wait', title: 'Recording Analysis', icon: 5, content: <RecordingAnalysis /> },
        { key: 6, status: stepsInfo?.data?.approve_request === true ? 'finish' : 'wait', title: 'Approve Request', icon: 6, content: <ApproveRequest /> },
    ];

    const showTermModal = () => {
        setTermModal(true);
    };

    const closeTermModal = () => {
        setTermModal(false)
    }

    const showModal = (id: any) => {
        setOpenModal(true);
        setType(id);
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    const goBack = () => {
        navigate(
            location?.state?.request_from == 'newReq'
                ? '/new-request'
                : location?.state?.request_from == 'pipelineReq'
                    ? '/view-request'
                    : location?.state?.request_from == 'archieveReq'
                        ? '/archive-list'
                        : location?.state?.request_from == 'jobMng'
                            ? '/edf_job_manager'
                            : location?.state?.request_from == 'patient'
                                ? '/patient-list'
                                : location?.state?.request_from == 'amazon'
                                    ? '/amazon-search'
                                    : '/view-request',
        );
    };
    function getMarkers() {
        const inputJson = {
            sr_interpretation: location.state?.id,
        };
        dispatch(getRequestAssMarkers(inputJson) as any);
    }
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }

    function getAllCredits() {
        dispatch(getRequestCredit(location?.state?.id) as any);
    }

    function getStepsDetails() {
        dispatch(getWizardSteps(location?.state?.id) as any);
    }

    const handleRateChange = (item: any) => {
        const isChecked = !selectedItm?.includes(item?.id);
        if (isChecked) {
            setSelectedItm((prevItems: any) => [...prevItems, item?.id]);
        } else {
            setSelectedItm((prevItems: any) => prevItems?.filter((id: any) => id !== item?.id));
        }
    };
    useEffect(() => {
        getStepsDetails();
    }, []);

    useEffect(() => {
        getMarkers();
    }, []);

    useEffect(() => {
        getAllCredits();
    }, []);

    useEffect(() => {
        getCommonService();
    }, []);
    useEffect(() => {
        if (creditReqInfo?.data) {
            const selectedItem1 = creditReqInfo?.data?.filter((item: any) => item?.req_associate || item?.is_default || item?.is_associate);
            const arr = selectedItem1?.map((item: any) => item?.id);
            setSelectedItm(arr);
        }
    }, [creditReqInfo]);
    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getResultInfo(inputJson) as any);
    }

    function getTemplateTopography() {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getTopoResultInfo(inputJson) as any);
    }

    useEffect(() => {
        getTemplateDetails();
    }, []);

    useEffect(() => {
        getTemplateTopography();
    }, []);

    const removeDiagnosis = (id: any, type: string) => {
        const inputJson = {
            service_request_id: location.state?.id,
            diagnosis_tps: '',
            undiagnosis_tps: type == '1' ? id?.toString() : '',
            symptoms_tps: '',
            unsymptoms_tps: type == '2' ? id?.toString() : '',
            medic_tmpl_size: '',
            lifestyle_templ_size: '',
            nutritional_supplementation_size: '',
            medic_tmpl: '',
            unmedic_tmpl: '',
            lifestyle_templ: '',
            unlifestyle_templ: '',
            nutritional_supplementation: '',
            unnutritional_supplementation: '',
        };
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    const removeTag = (id: any) => {
        dispatch(removeRequestTag(id) as any);
        setShowSuccessmsg1(true);
        setShowSuccessmsg1(true);
    };
    const submitSectionForm = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            const newArr: any[] = Array.from(new Set(selectedItm));
            const inputJson = {
                accountid: resultInfo?.req_info?.account_info?.accountid,
                servicerequestid: location?.state?.id,
                commend: values?.comments,
                creditids: newArr,
            };
            dispatch(saveAdditionalReportItems(inputJson) as any);
            setShowSuccessmsg2(true);
            setShowErrormsg2(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
            setShowSuccessmsg2(false);
        }
    };

    useEffect(() => {
        if (successmsg1) {
            message.success(`Tag removed successfully`);
            setShowSuccessmsg1(false);
            getCommonService();
        }
        if (errormsg1) {
            message.error(`Tag couldn't be removed`);
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    useEffect(() => {
        if (successmsg2) {
            message.success(`Report items updated successfully`);
            setShowSuccessmsg2(false);
            getCommonService();
            form.resetFields();
        }
        if (errormsg2) {
            message.error(`Report items couldn't be removed`);
            setShowErrormsg2(false);
        }
    }, [successmsg2, errormsg2]);

    useEffect(() => {
        if (successmsg) {
            message.success(`${type === '1' ? 'Diagnosis' : 'Symptoms'} removed successfully`);
            setShowSuccessmsg(false);
            getCommonService();
        }
        if (errormsg) {
            message.error(`${type === '1' ? 'Diagnosis' : 'Symptoms'} couldn't be removed`);
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const handleOpenEDFfile = (type: string) => {
        const cleanUrl = `/edf?${new URLSearchParams({
            url: url2,
            selectedEdf: type || 'EC',
            Eo: resultInfo?.req_info?.associate_edf_doc?.EO_edf_file_path,
            Ec: resultInfo?.req_info?.associate_edf_doc?.EC_edf_file_path,
            reqId: resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber,
            pntInfo: resultInfo?.req_info?.patient_info?.pntname,
            accInfo: resultInfo?.req_info?.account_info?.account_name,
            EoArtifact: resultInfo?.req_info?.artifact_removed_edf_doc?.EO_edf_file_path,
            EcArtifact: resultInfo?.req_info?.artifact_removed_edf_doc?.EC_edf_file_path,
            EoDownload: resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path[0],
            EcDownload: resultInfo?.req_info?.plot_pdf_doc?.EC_plot_doc_path[0],
        })}`;
        window.open(cleanUrl, '_blank');
    };
    const downloadFile = (base64String: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const downloadEdfFile = (path: any, type: string) => {
        const fileUrl = path?.startsWith('https:') ? path : '';
        setDownloadPercent(0);
        setIsDownload(true);
        fetch(fileUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const contentLength = response.headers.get('Content-Length');
                const total = contentLength ? parseInt(contentLength, 10) : 0;
                const reader = response.body?.getReader();
                const stream = new ReadableStream({
                    start(controller) {
                        let loaded = 0;
                        reader?.read().then(function processText({ done, value }) {
                            if (done) {
                                controller.close();
                                return;
                            }
                            loaded += value.length;
                            setDownloadPercent(Math.round((loaded / total) * 100));
                            controller.enqueue(value);
                            reader.read().then(processText);
                        });
                    },
                });

                return new Response(stream);
            })
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = () => {
                    const base64String = (reader.result as string).split(',')[1];
                    const fileName = `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_${type}_edf_graph.pdf`;
                    downloadFile(base64String, fileName);
                    message.success('Download complete!');
                };
            })
            .catch((error) => {
                console.error('Error fetching PDF file:', error);
                message.error('Error fetching PDF file.');
            })
            .finally(() => {
                setDownloadPercent(0);
                setIsDownload(false);
            });
    };

    return (
        <div className="p-2 mt-2 pipeline-wizard">
            <div className="d-flex">
                <h5 className="col">Service Request</h5>
                <div>
                    <Button type="primary" onClick={goBack}>
                        Back
                    </Button>
                </div>
            </div>
            <div className="mt-3">
                <Steps current={current} onChange={(e: any) => setCurrent(e)} className={`site-navigation-steps bg-white rounded ${current}`} items={stepItems} />
                <div className="d-flex row mx-0 mt-3 wizard-container">
                    <div className="col ps-0 wizard-cont1">{stepItems[current].content}</div>
                    <div className="col-md-3  wizard-cont2 bg-white py-3">
                        <div className="bg-light p-3 d-flex mb-3 flex-wrap">
                            <div className="col-md-6 mb-2">
                                <h6 className="text-primary mb-1">Request ID</h6>
                                {loading5 ? (
                                    <Skeleton.Button active />
                                ) : (
                                    <h6>{requestData?.encoded_RequestNumber ? requestData?.encoded_RequestNumber : '-'}</h6>
                                )
                                }
                            </div>
                            <div className="col-md-6 mb-2">
                                <h6 className="text-primary mb-1">Patient Name</h6>
                                {loading4 ? (
                                    <Skeleton.Button active />
                                ) : (
                                    <h6>{resultInfo?.req_info ? resultInfo?.req_info?.patient_info?.pntname : '-'}</h6>
                                )
                                }
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-primary mb-1">Account Name</h6>
                                {loading4 ? (
                                    <Skeleton.Button active />
                                ) : (
                                    <h6>{resultInfo?.req_info?.account_info?.account_name ? resultInfo?.req_info?.account_info?.account_name : '-'}</h6>
                                )
                                }
                            </div>
                            <div className="col-md-6">
                                <h6 className="text-primary mb-1">Gender & DOB</h6>
                                {loading4 ? (
                                    <Skeleton.Button active />
                                ) : (
                                    <h6>
                                        {resultInfo?.req_info?.patient_info?.gender_identity ? resultInfo?.req_info?.patient_info?.gender_identity + ' & ' : '-'}
                                        {resultInfo?.req_info?.patient_info?.dob ? dayjs(new Date(resultInfo?.req_info?.patient_info?.dob)).format('MM-DD-YYYY') : ''}
                                    </h6>
                                )
                                }
                            </div>
                        </div>
                        {current === 0 ? (
                            <div>
                                {/* <h6 className="pb-2 border-bottom">Patient Consent Form</h6>
                                {
                                    stepsInfo?.data?.phqsession_flag ? (
                                        <div className="fs-15 py-0">
                                            Click here to preview the <a className="text-underline" onClick={showTermModal}>terms and conditions</a>
                                        </div> 
                                    ): (
                                        <div className=" p-4 bg-light text-center w-100">This request does not contain patient consent</div>
                                    )
                                } */}
                                <div className="mt-2">
                                    <Spin spinning={commonLoading}>
                                        <h6 className="pt-2 pb-2 border-bottom ">Session Questionnaire</h6>
                                        {
                                            stepsInfo?.data?.phqsession_flag ? (
                                                <>
                                                    <div className="fs-15 fw-bold text-secondary session-content">1. Clinician and amplifier used</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">{(requestData?.clinician_and_amplifier_used || 'N/A') + ', ' + (requestData?.amplifierUsed || 'N/A')}</div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">2. Past/Present clinical diagnosis (if applicable)</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">
                                                        {commonInfo?.diagnosis?.length > 0 ? (
                                                            <>
                                                                {commonInfo.diagnosis.some((item: any) => item.ischoices && item.diagnosis_name) ? (
                                                                    commonInfo.diagnosis?.filter((item: any) => item.ischoices && item.diagnosis_name).map((item: any, index: number, array: any[]) => {
                                                                        return (
                                                                            <span key={item.id} className="py-2 pe-1 ps-0">
                                                                                {item.diagnosis_name}
                                                                                {index < array.length - 1 ? ', ' : ''}
                                                                            </span>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <span className="py-2 px-1">-</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">3. Patient symptoms/concerns</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">
                                                        {commonInfo?.symptoms?.length > 0 ? (
                                                            <>
                                                                {commonInfo.symptoms.some((item: any) => item.ischoices && item.symptoms_name) ? (
                                                                    commonInfo.symptoms?.filter((item: any) => item.ischoices && item.symptoms_name).map((item: any, index: number, array: any[]) => {
                                                                        return (
                                                                            <span key={item.id} className="py-2 pe-1 ps-0">
                                                                                {item.symptoms_name}
                                                                                {index < array.length - 1 ? ', ' : ''}
                                                                            </span>
                                                                        );
                                                                    })
                                                                ) : (
                                                                    <span className="py-2 px-1">-</span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">4. Were meds taken within 48 hours of appointment?</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">
                                                        {requestData?.were_meds_taken_within_48_hours_of_appointment == true
                                                            ? 'Yes'
                                                            : requestData?.were_meds_taken_within_48_hours_of_appointment == false
                                                                ? 'No'
                                                                : 'N/A'}
                                                    </div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">5. Did client have stimulants day of scan? (caffeine, soda, cannabis, etc)</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">
                                                        {requestData?.did_client_have_stimulants_day_of_scan == true
                                                            ? 'Yes'
                                                            : requestData?.did_client_have_stimulants_day_of_scan == false
                                                                ? 'No'
                                                                : 'N/A'}
                                                    </div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">6. Past psychiatric medication response (if known)</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">{requestData?.past_psychiatric_medication_response || 'N/A'}</div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">7. Does patient require</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">{requestData?.does_patient_require || 'N/A'}</div>
                                                    <div className="fs-15 fw-bold text-secondary session-content">8. Brief history</div>
                                                    <div className="fs-15 ms-3 mb-2 session-content">{requestData?.brief_history || 'N/A'}</div>
                                                </>
                                            ) : (
                                                <div className=" p-4 bg-light text-center w-100 session-content"> No session questionnaire associated</div>
                                            )
                                        }
                                    </Spin>
                                </div>
                            </div>
                        ) : current === 5 ? (
                            <div>
                                <h6 className="pb-2 border-bottom d-flex w-100">EDF Preview</h6>
                                {
                                    (!resultInfo?.req_info?.edfcomplete_flag && resultInfo?.req_info?.edfprocessing_flag) ||
                                        (!resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edfprocessing_flag) || location.state.reqDetail?.archive_data
                                        // (resultInfo?.req_info?.associate_edf_doc?.EO_edf_file_path && resultInfo?.req_info?.associate_edf_doc?.EC_edf_file_path)
                                        ?

                                        <div className="p-3 text-gray text-center bg-aliceblue w-100">{commonLoading ?
                                            // 'Loading...' 
                                            <span className="loading-dots">Loading<span className="dot-animation"></span></span>
                                            : 'No EDF file available for previewing'}</div>
                                        : ((resultInfo?.req_info?.associate_edf_doc?.EO_edf_file_path && resultInfo?.req_info?.associate_edf_doc?.EC_edf_file_path) ?
                                            <div className="mb-2">
                                                <div>
                                                    To view Eyes Closed EDF file,
                                                    <a className="text-blue text-decoration-underline ps-1" onClick={() => handleOpenEDFfile('EC')}>
                                                        Click here
                                                    </a>
                                                </div>
                                                <div>
                                                    To view Eyes Opened EDF file,
                                                    <a className="text-blue text-decoration-underline ps-1" onClick={() => handleOpenEDFfile('EO')}>
                                                        Click here
                                                    </a>
                                                </div>
                                            </div>
                                            : <div className="p-3 text-gray text-center bg-aliceblue w-100">{commonLoading ?
                                                // 'Loading...' 
                                                <span className="loading-dots">Loading<span className="dot-animation"></span></span>
                                                : 'No EDF file available for previewing'}</div>
                                        )}

                                <h6 className="pb-2 border-bottom d-flex w-100 mt-3">Download EDF Graph</h6>
                                <div className="">
                                    {resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path?.[0] ? (
                                        <>
                                            <div>
                                                To download Eyes Closed EDF file,
                                                <a
                                                    className="text-blue text-decoration-underline ps-1"
                                                    onClick={() => downloadEdfFile(resultInfo?.req_info?.plot_pdf_doc?.EC_plot_doc_path[0], 'Eyeclose')}
                                                >
                                                    Click here
                                                </a>
                                            </div>
                                            <div>
                                                To download Eyes Opened EDF file,
                                                <a
                                                    className="text-blue text-decoration-underline ps-1"
                                                    onClick={() => downloadEdfFile(resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path[0], 'Eyeopen')}
                                                >
                                                    Click here
                                                </a>
                                            </div>
                                            {!isDownload ? (
                                                ''
                                            ) : (
                                                <div className="mt-3">
                                                    Downloading...
                                                    <Progress
                                                        size={['100%', 20]}
                                                        percent={downloadPercent}
                                                        // percentPosition={{ align: 'center', type: 'inner' }}
                                                        strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-3 text-gray text-center bg-aliceblue w-100 d-flex justify-content-center align-items-center">{commonLoading ?
                                            // 'Loading...' 
                                            <span className="loading-dots">Loading<span className="dot-animation"></span></span>

                                            : 'No EDF graph available for download'}</div>
                                    )}
                                </div>
                                {location?.state?.is_billing && (
                                    <>
                                        <h6 className="pb-2 border-bottom d-flex w-100 mt-3">Associate Template sections</h6>
                                        <div>
                                            <p className="fw-bold mb-1">Report items selected by account user</p>
                                            {accountAss?.length > 0 ? (
                                                accountAss
                                                    ?.filter((item: any) => item?.credit_code !== 'RPT')
                                                    ?.map((item: any, i: number) => (
                                                        <Checkbox
                                                            key={i}
                                                            onChange={() => handleRateChange(item)}
                                                            defaultChecked={item?.is_associate || item?.req_associate}
                                                            disabled={item?.is_associate || item?.req_associate}
                                                        >
                                                            <span>{item?.credit_item}</span>
                                                        </Checkbox>
                                                    ))
                                            ) : (
                                                <div className="bg-light p-2 text-center m-0 row mb-2 d-flex justify-content-center align-items-center">
                                                    <p className="my-auto text-start text-secondary">No Report items were associated</p>
                                                </div>
                                            )}
                                            <p className="fw-bold mt-3 mb-1">Available report items</p>
                                            <div className="d-flex flex-column mb-2">
                                                <Spin spinning={loading2}>
                                                    {adminAss?.length > 0 ? (
                                                        adminAss
                                                            ?.filter((item: any) => item?.credit_code !== 'RPT')
                                                            ?.map((item: any, i: number) => (
                                                                <div key={i}>
                                                                    <Checkbox key={i} onChange={() => handleRateChange(item)} defaultChecked={item?.req_associate}>
                                                                        <span>{item?.credit_item}</span>
                                                                    </Checkbox>
                                                                </div>
                                                            ))
                                                    ) : (
                                                        <div className="bg-light p-2 text-center m-0 row mb-2">
                                                            <p className="my-auto text-start text-secondary d-flex justify-content-center align-items-center">{loading2 ? 'Loading...' : 'No Report Items is Available'}</p>
                                                        </div>
                                                    )}
                                                </Spin>
                                            </div>
                                            <Form form={form} layout="vertical">
                                                <Form.Item name="comments" label="Reason" rules={[{ required: true, message: 'This field is required' }]}>
                                                    <TextArea rows={3} className='py-2'/>
                                                </Form.Item>
                                                <div className="text-end">
                                                    <Button type="primary" onClick={submitSectionForm} loading={loading10}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </Form>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <h6 className="pb-2 border-bottom d-flex w-100">
                                    Diagnosis
                                    <div className="ms-auto">
                                        <PlusCircleFilled className="text-primary fs-20" onClick={() => showModal('1')} />
                                    </div>
                                </h6>
                                <div>
                                    <Spin spinning={commonLoading}>
                                        <div className="d-flex flex-wrap section-height">
                                            {commonInfo?.diagnosis && commonInfo?.diagnosis?.some((item: any) => item.ischoices) ? (
                                                commonInfo?.diagnosis
                                                    ?.filter((item: any) => item?.ischoices)
                                                    ?.map((item: any) => (
                                                        <div className="me-1 mb-1" key={item?.id}>
                                                            <div className="bg-lightorange py-1 tags px-3 d-flex flex-wrap">
                                                                <div className="col me-3">{item?.diagnosis_name}</div>
                                                                <div className="col-auto ms-auto pointer">
                                                                    <Popconfirm
                                                                        placement="topLeft"
                                                                        title="Are you sure to remove this diagnosis?"
                                                                        onConfirm={() => {
                                                                            removeDiagnosis(item?.id, '1');
                                                                            setType('1');
                                                                        }}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <Tooltip title="Remove" className="mt-0 text-gray">
                                                                            x
                                                                        </Tooltip>
                                                                    </Popconfirm>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="p-3 text-gray text-center bg-aliceblue w-100 d-flex justify-content-center align-items-center">
                                                    {commonLoading ? 'Loading...' : 'No diagnosis associated with this request'}
                                                </div>
                                            )}
                                        </div>
                                    </Spin>
                                </div>
                                <h6 className="pb-2 border-bottom mt-5 d-flex w-100">
                                    Symptoms
                                    <div className="ms-auto">
                                        <PlusCircleFilled className="text-primary fs-20" onClick={() => showModal('2')} />
                                    </div>
                                </h6>
                                <div>
                                    <Spin spinning={commonLoading}>
                                        <div className="d-flex flex-wrap section-height">
                                            {commonInfo?.symptoms && commonInfo?.symptoms?.some((item: any) => item?.ischoices) ? (
                                                commonInfo?.symptoms
                                                    ?.filter((item: any) => item?.ischoices)
                                                    ?.map((item: any) => (
                                                        <div className="me-1 mb-1" key={item.id}>
                                                            <div className="bg-lightorange px-3 py-1 tags d-flex flex-wrap">
                                                                <div className="col me-3">{item.symptoms_name}</div>
                                                                <div className="col-auto ms-auto pointer">
                                                                    <Popconfirm
                                                                        placement="topLeft"
                                                                        title="Are you sure to remove this symptom?"
                                                                        onConfirm={() => {
                                                                            removeDiagnosis(item.id, '2');
                                                                            setType('2');
                                                                        }}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <Tooltip title="Remove" className="mt-0 text-gray">
                                                                            x
                                                                        </Tooltip>
                                                                    </Popconfirm>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                            ) : (
                                                <div className="p-3 text-gray text-center bg-aliceblue w-100 d-flex justify-content-center align-items-center">
                                                    {commonLoading ? 'Loading...' : 'No symptoms associated with this request'}
                                                </div>
                                            )}
                                        </div>
                                    </Spin>
                                </div>
                                <h6 className="pb-2 border-bottom mt-5 d-flex w-100">
                                    Associated Tags
                                    <div className="ms-auto">
                                        <PlusCircleFilled className="text-primary fs-20" onClick={() => showModal('6')} />
                                    </div>
                                </h6>
                                <div>
                                    <Spin spinning={commonLoading}>
                                        <div className="d-flex flex-wrap section-height">
                                            {commonInfo?.patient_tag && commonInfo?.patient_tag?.length > 0 ? (
                                                <>
                                                    {commonInfo?.patient_tag?.map((item: any) => (
                                                        <div className="me-1 mb-1" key={item.id}>
                                                            <div className="bg-lightorange px-3 py-1 tags d-flex flex-wrap">
                                                                <div className="col me-3"> {item.TagName}</div>
                                                                <div className="col-auto ms-auto pointer">
                                                                    <Popconfirm
                                                                        placement="topLeft"
                                                                        title="Are you sure to remove this tag?"
                                                                        onConfirm={() => {
                                                                            removeTag(item.id);
                                                                        }}
                                                                        okText="Yes"
                                                                        cancelText="No"
                                                                    >
                                                                        <Tooltip title="Remove" className="mt-0 text-gray">
                                                                            x
                                                                        </Tooltip>
                                                                    </Popconfirm>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <div className="p-3 text-gray text-center bg-aliceblue w-100 d-flex justify-content-center align-items-center">
                                                    {commonLoading ? 'Loading...' : 'No tags associated with this request'}
                                                </div>
                                            )}
                                        </div>
                                    </Spin>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <DiagnosisModal openModal={openModal} closeModal={closeModal} getCommonService={getCommonService} type={type} />
            <TermsAgreement openModal={termModal} closeModal={closeTermModal} />
        </div>
    );
};

export default PipelineWizard;
