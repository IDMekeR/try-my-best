import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { message, Spin, Popconfirm, Tooltip, Progress,Alert } from 'components/shared/AntComponent';
import { Radio } from 'components/shared/FormComponent';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { Button } from 'components/shared/ButtonComponent';
import {
    getEdfDocList,
    getNonAssociateMarkers,
    getRequestAssMarkers,
    getResultInfo,
    getResultRatio,
    getWizardSteps,
    removeInterpretationMarker,
    startEdfJob,
} from 'services/actions/pipeline/stepwizardAction';
import { SyncOutlined } from 'components/shared/AntIcons';
import { PlusCircleFilled } from '@ant-design/icons';
import MarkerModal from './modal/MarkerModal';
import { saveAs } from 'file-saver';
import { triggerBase64Download } from 'common-base64-downloader-react';
import { documentDownload } from 'services/actions/pipeline/pipelineAction';

const EdfProcess: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const { assMarkerInfo, loading, edfDocInfo, loading1, ratioResultInfo, loading2, resultInfo, loading11, success11, error11, loading14, success14, error14, stepsInfo } = useSelector(
        (state: any) => state.wizard,
    );
    const { loading14: downloadLoading, downloadInfo, success14: downloadSuccess, error14: downloadError, requestInfo, loading5 } = useSelector((state: any) => state.pipeline);
    const { excelDownProgress } = useSelector((state: any) => state.download);
    const [selectedEoFile, setSelectedEoFile] = useState<any>(null);
    const [selectedEcFile, setSelectedEcFile] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);
    const [fileName, setFileName] = useState('');
    const flag = stepsInfo ? stepsInfo.data?.edfprocessing_flag : false;
    const flag1 = stepsInfo ? stepsInfo?.data?.edfcomplete_flag : false;
    const processingFlag = resultInfo?.req_info?.edfprocessing_flag || false;
    const completeFlag = resultInfo?.req_info?.edfcomplete_flag || false;
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success11 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error11 : false;
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success14 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error14 : false;
    //download document
    const [showSuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showSuccessmsg2 ? downloadSuccess : false;
    const [showErrormsg2, setShowErrormsg2] = useState(false);
    const errormsg2 = showErrormsg2 ? downloadError : false;
    const requestData = !loading5 ? requestInfo?.data?.reqinfo : [];

    function getEDFlist() {
        dispatch(getEdfDocList(location.state?.id) as any);
    }
    function getExcellist() {
        dispatch(getResultRatio(location.state?.id) as any);
    }

    useEffect(() => {
        if (edfDocInfo?.edf_list) {
            const initialEoFile = edfDocInfo.edf_list.find((list: any) => list.doc_type === 'Eye Open');
            const initialEcFile = edfDocInfo.edf_list.find((list: any) => list.doc_type === 'Eye Close');

            setSelectedEoFile(initialEoFile);
            setSelectedEcFile(initialEcFile);
        }
    }, [edfDocInfo]);

    const DownloadFile = (id: any, fileName: string) => {
        setFileName(fileName);
        const inputJson = {
            docid: id,
        };
        dispatch(documentDownload(inputJson) as any);
        setShowSuccessmsg2(true);
        setShowErrormsg2(true);
    };

    const showModal = () => {
        setOpenModal(true);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const handleEoFileChange = (item: any) => {
        setSelectedEoFile((prev) => (prev && prev.id === item.id ? null : item));
    };

    const handleEcFileChange = (item: any) => {
        setSelectedEcFile((prev) => (prev && prev.id === item.id ? null : item));
    };
    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getResultInfo(inputJson) as any);
    }
    function getUnAssMarkers() {
        const inputJson = { sr_interpretation: location.state?.id };
        dispatch(getNonAssociateMarkers(inputJson) as any);
    }
    function getMarkers() {
        const inputJson = {
            sr_interpretation: location.state?.id,
        };
        dispatch(getRequestAssMarkers(inputJson) as any);
    }
    const gotoEDFScreen = () => {
        const patientName = requestData?.first_name ? requestData?.first_name + ' ' + requestData?.last_name : '-'
        navigate('/edf_job_manager/edf-processing', {
            state: {
                id: location?.state?.id,
                // reqFromEdf: location?.state.request_from,
                pntname: patientName

            },
        } as NavigateOptions);
    };

    useEffect(() => {
        getUnAssMarkers();
    }, []);

    const submitEdfJob = () => {
        const fileIDs: any = [];
        if (selectedEoFile) {
            fileIDs.push(selectedEoFile?.id);
            setSelectedEoFile(null);
        }

        if (selectedEcFile) {
            fileIDs.push(selectedEcFile.id);
            setSelectedEcFile(null);
        }

        const inputJson = {
            req_id: location.state?.id,
            docid: fileIDs.toString() || '',
        };
        dispatch(startEdfJob(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Job started successfully');
            getTemplateDetails();
            getEDFlist();
            getStepsDetails();
        }
        if (errormsg) {
            if (error11?.data) {
                message.error(error11?.data);
            } else {
                message.error("Job couldn't be started");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        getEDFlist();
    }, [dispatch, location.state?.id]);

    useEffect(() => {
        getExcellist();
    }, [location.state?.id]);

    const handleRemoveMarker = (id: any) => {
        const inputJson = {
            markerid: id.toString(),
            requestid: location.state?.id,
        };
        dispatch(removeInterpretationMarker(inputJson) as any);
        setShowSuccessmsg1(true);
        setShowErrormsg1(true);
    };
    const removeFileExtension = (filename) => {
        const lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex !== -1 && lastDotIndex !== 0) {
            return filename.slice(0, lastDotIndex);
        } else {
            return filename;
        }
    };

    useEffect(() => {
        if (successmsg2) {
            downloadDocument();
        }
        if (errormsg2) {
            message.error("Document couldn't be downloaded");
        }
    }, [successmsg2, errormsg2]);

    function getStepsDetails() {
        dispatch(getWizardSteps(location?.state?.id) as any);
    }

    const downloadDocument = () => {
        const fileExt = fileName?.split('.').pop();
        const filenameWithoutExtension = removeFileExtension(fileName);
        if (fileExt == 'xlsx' || fileExt == 'xls') {
            triggerBase64Download(`data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'docx') {
            triggerBase64Download(
                `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64, ${downloadInfo?.data?.encodefiledata}`,
                `${filenameWithoutExtension}`,
            );
        } else if (fileExt == 'doc') {
            triggerBase64Download(`data:application/msword;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'pdf') {
            triggerBase64Download(`data:application/pdf;base64,${downloadInfo?.data?.encodefiledata}`, `${filenameWithoutExtension}`);
        } else if (fileExt == 'edf') {
            const bytes = new Uint8Array(
                atob(downloadInfo?.data?.encodefiledata)
                    .split('')
                    .map((char) => char.charCodeAt(0)),
            );
            const blob = new Blob([bytes], { type: 'text/plain;charset=utf-8;base64' });
            saveAs(blob, `${fileName}`);
        } else return;
    };
    useEffect(() => {
        if (successmsg1) {
            message.success(`Markers removed from this request successfully`);
            setShowSuccessmsg1(false);
            getMarkers();
            getUnAssMarkers();
        }
        if (errormsg1) {
            message.error(`Markers couldn't be removed from this request`);
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    return (
        <div className="h-100 edf-processing">
            <div className="bg-white p-3 h-100">
                <h6 className="fs-17 text-primary">Data Processing</h6>
                {stepsInfo?.data?.result_flag ?
                        <Alert message="The results are overwritten by results from external" type="warning" showIcon closable /> : ""}
                <Spin spinning={loading}>
                    <div className="mt-3">
                        <div className="d-flex mb-1">
                            <h6 className="text-dark my-auto">Markers to be calculated</h6>
                            {
                                location.state.archive ? "" :
                                    <div className="col-auto ms-auto fs-20">{processingFlag ? '' :
                                        <Tooltip title="Add" className="">
                                            <PlusCircleFilled className="text-primary fs-16" onClick={showModal} />
                                        </Tooltip>
                                    }</div>
                            }
                        </div>
                        <div className="bg-white border p-2 d-flex flex-wrap">
                            {assMarkerInfo?.data?.map((item: any) => (
                                <div key={item.id} className="col-auto fw-600 rounded bg-lightteal py-1 px-2 m-1 marker-list">
                                    {item.markername}
                                    {!item.default_select && (
                                        <span className="col-auto ps-3 py-1 pe-1 ms-auto close-tag pointer">
                                            <Popconfirm
                                                placement="topLeft"
                                                title="Are you sure to remove this marker?"
                                                onConfirm={() => {
                                                    handleRemoveMarker(item.markerid);
                                                }}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Tooltip title="Remove" className="mt-0 text-danger ">
                                                    X
                                                </Tooltip>
                                            </Popconfirm>
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </Spin>
                <div className="my-4">
                    <h6 className="text-dark my-auto">Data File</h6>
                    <Spin spinning={loading1}>
                        <div className="row mx-0 mt-2 p-0 border">
                            <div className="col-md-6 px-0 border-end">
                                <div className="p-2 bg-lightprimary text-primary fs-15 fw-bold text-center">Eyes Opened</div>
                                <div className='text-overflow'>
                                    {edfDocInfo?.edf_list
                                        ?.filter((item: any) => item.doc_type === 'Eye Open')
                                        .map((item: any) => (
                                            <Radio key={item.id} className="p-2 fs-14" checked={selectedEoFile?.id === item.id}
                                                disabled={flag || flag1} onChange={() => handleEoFileChange(item)}>
                                                {item.filename}
                                            </Radio>
                                        ))}
                                </div>
                            </div>
                            <div className="col-md-6 px-0">
                                <div className="p-2 bg-lightprimary text-primary fs-15 fw-bold text-center">Eyes Closed</div>
                                <div className='text-overflow'>
                                    {edfDocInfo?.edf_list
                                        ?.filter((item: any) => item.doc_type === 'Eye Close')
                                        .map((item: any) => (
                                            <Radio key={item.id} className="p-2 fs-14" checked={selectedEcFile?.id === item.id}
                                                disabled={flag || flag1} onChange={() => handleEcFileChange(item)}>
                                                {item.filename}
                                            </Radio>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </Spin>
                </div>
                <div>
                    {ratioResultInfo?.report_excel_list?.length > 0 ? (
                        <>
                            <h6 className="text-dark mb-3">Final Output Documents</h6>
                            <Spin spinning={loading2}>
                                {ratioResultInfo.report_excel_list.map((item: any) => (
                                    <div className="bg-light border p-2 d-flex mb-2 w-75" key={item.id}>
                                        <div className="col-md-6 my-auto text-overflow">{item.filename}</div>
                                        <div className="col-auto my-auto mx-auto">{item.doc_type}</div>
                                        <div className="col-auto my-auto mx-auto">{item.size}</div>
                                        <div className="col-auto my-auto">
                                            <Button type="primary" onClick={() => DownloadFile(item.id, item.filename)}>
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </Spin>
                        </>
                    ) : (
                        ''
                    )}
                </div>
                {downloadLoading ? (
                    <Progress size={[485, 20]} percent={excelDownProgress} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                ) : (
                    ''
                )}
                <div className="mt-5 pt-5 text-end">
                    {!processingFlag && !completeFlag ? (
                        <Button type="primary" onClick={submitEdfJob} loading={loading11}>
                            Start EDF Processing
                        </Button>
                    ) : (
                        <div className="d-flex w-100">
                            {!completeFlag ? (
                                <div className="text-warn fs-17 ms-auto me-2 px-2 py-1 sync-div my-auto">
                                    <SyncOutlined spin className="fs-17 text-warn" /> Job processing is in queue
                                </div>
                            ) : (
                                ''
                            )}
                            <Button type="primary" className={`${completeFlag ? 'ms-auto' : ''}`} onClick={gotoEDFScreen}>
                                View EDF Processing
                            </Button>
                        </div>
                    )}
                </div>
            </div>
            <MarkerModal openModal={openModal} closeModal={closeModal} getUnAssMarkers={getUnAssMarkers} getMarkers={getMarkers} />
        </div>
    );
};

export default EdfProcess;
