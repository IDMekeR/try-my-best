import React, { useState, useRef, useEffect, useMemo } from 'react';
import JoditEditor from 'jodit-react';
import { EditIcon } from 'assets/img/custom-icons';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { useLocation } from 'react-router-dom';
import { downloadConsentForm, getAssociatedMedicines, getRequestInfo, saveClinicalHistory, sentConsentToPatient, uploadConsentForm } from 'services/actions/pipeline/pipelineAction';
import { getPhqQuesAns } from 'services/actions/newRequestAction';
import { message, Progress, Spin, Upload } from 'components/shared/AntComponent';
import DisplayDocument from '../../modal/DisplayDocument';
import dayjs from 'dayjs';
import { getResultInfo } from 'services/actions/pipeline/stepwizardAction';

const RequestInformation: React.FC = () => {
    const editor = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { stepsInfo, loading6: stepLoading, resultInfo } = useSelector((state: any) => state.wizard);
    const { requestInfo, loading5, loading6, success6, error6, loading7, success7, error7, success9, loading9, error9, loading10, assMedicInfo } = useSelector(
        (state: any) => state.pipeline,
    );
    const { loading4, phqAnsInfo } = useSelector((state: any) => state.newreq);
    const { uploadConsentProgress } = useSelector((state: any) => state.upload);
    const [content, setContent] = useState('');
    const [editHistory, setEditHistory] = useState(true);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const errormsg = showErrorMsg ? error6 : false;
    const [showConsentSuccessmsg, setShowConsentSuccessmsg] = useState(false);
    const consentSuccessmsg = showConsentSuccessmsg ? success7 : false;
    const [showConsentErrormsg, setShowConsentErrormsg] = useState(false);
    const consentErrormsg = showConsentErrormsg ? error7 : false;
    const [isFileUploaded, setIsFileUploaded] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [showEmailSuccessMsg, setShowEmailSuccessMsg] = useState(false);
    const emailSuccessmsg = showEmailSuccessMsg ? success9 : false;
    const [showEmailErrormsg, setShowEmailErrormsg] = useState(false);
    const emailErrormsg = showEmailErrormsg ? error9 : false;
    const userId = Number(sessionStorage.getItem('userid'));
    function getRequestDetails() {
        dispatch(getRequestInfo(location.state?.id) as any);
    }

    function getPhqDetails() {
        dispatch(getPhqQuesAns(location.state?.id) as any);
    }

    function getAssMedicDetails() {
        const inputJson = {
            patientid: requestInfo?.data?.reqinfo?.patientid,
            servicerequestid: location.state.id,
        };
        dispatch(getAssociatedMedicines(inputJson) as any);
    }

    useEffect(() => {
        getRequestDetails();
    }, []);

    useEffect(() => {
        getPhqDetails();
    }, []);

    useEffect(() => {
        if (requestInfo?.data) {
            setContent(requestInfo?.data?.reqinfo?.clinical_history);
            getAssMedicDetails();
        }
        if (resultInfo?.req_info?.servicerequest_info?.consentupload_flag) {
            setIsFileUploaded(true);
        } else {
            setIsFileUploaded(false);
        }
    }, [location.state, resultInfo]);

    const saveHistory = () => {
        const inputJson = {
            id: location.state.id,
            clinicalhistory: content,
            objectiveassesment: '',
        };
        dispatch(saveClinicalHistory(inputJson) as any);
        setShowErrorMsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Clinical history saved successfully');
            setEditHistory(true);
            getRequestDetails();
        }
        if (errormsg) {
            if (error6?.data) {
                message.error(error6?.data);
            } else {
                message.error("Clinical history couldn't be saved");
            }
            setShowErrorMsg(false);
        }
    }, [successmsg, errormsg]);

    const saveUploadConsent = (file: any) => {
        const formData = new FormData();
        const InputJson = {
            requestid: location.state?.id,
            userid: userId,
        };
        formData.append('File', file.fileList[0].originFileObj);
        formData.append('InputJson', JSON.stringify(InputJson));
        dispatch(uploadConsentForm(formData) as any);
        setShowConsentSuccessmsg(true);
        setShowConsentErrormsg(true);
    };
    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getResultInfo(inputJson) as any);
    }
    useEffect(() => {
        if (consentSuccessmsg) {
            setShowConsentSuccessmsg(false);
            message.success('Patient consent form uploaded successfully');
            getRequestDetails();
            getTemplateDetails();
        }
        if (consentErrormsg) {
            if (error7?.data) {
                message.error(error7?.data);
            } else {
                message.error("Consent couldn't be uploaded");
            }
            setShowConsentErrormsg(false);
        }
    }, [consentErrormsg, consentSuccessmsg]);

    const getConsentTemplate = () => {
        setOpenModal(true);
        const inputJson = {
            requestid: location.state?.id,
        };
        dispatch(downloadConsentForm(inputJson) as any);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    const sendEmail = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                email: value.patientEmail,
                servicerequestid: location.state.id,
            };
            dispatch(sentConsentToPatient(inputJson) as any);
            setShowEmailErrormsg(true);
            setShowEmailSuccessMsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (emailSuccessmsg) {
            message.success('Email sent successfully');
            setShowEmailSuccessMsg(false);
            getRequestDetails();
        }
        if (emailErrormsg) {
            if (error9?.data) {
                message.error(error9?.data);
            } else {
                message.error("Email couldn't send");
            }
            setShowEmailErrormsg(false);
        }
    }, [emailErrormsg, emailSuccessmsg]);

    const config = useMemo(() => ({
        readonly: editHistory,
        width: "100%",
        style: { overflowX: "hidden", wordBreak: "break-word" },
    }), [editHistory]);

    return (
        <div className="h-100 request-information">
            <Spin spinning={loading5}>
                <div className="bg-white p-3 row m-0 h-100">
                    <div className="col-md-6 ps-0 pe-3">
                        <h6 className="text-dark edit-icon-sm">
                            Clinical History
                            <span onClick={() => setEditHistory(!editHistory)} className="pointer">
                                <EditIcon />
                            </span>
                        </h6>
                        <JoditEditor ref={editor} config={config} value={content}
                            // onChange={(e) => setContent(e)} 
                            onBlur={(newContent) => setContent(newContent)}
                        />
                        {!editHistory ? (
                            <div className="text-end mt-2">
                                <Button type="primary" loading={loading6} onClick={saveHistory}>
                                    Save
                                </Button>
                            </div>
                        ) : (
                            ''
                        )}
                        <div className="my-3 pnt-consent-upload">
                            <div className="d-flex mt-3">
                                <h6 className="text-dark my-auto col-auto">Patient Consent Form</h6>
                                {!isFileUploaded ? (
                                    <div className="my-auto ms-auto mb-1 col-auto bg-lightred pointer fw-bold py-0 px-2 rounded" onClick={() => setIsFileUploaded(!isFileUploaded)}>
                                        {requestInfo?.data?.reqinfo?.consentdoc?.toLowerCase() === 'yes' ? 'Back' : ''}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            {(!isFileUploaded && location.state.reqFrom != 3) ? (
                                <Form layout="vertical" form={form} className="bg-light p-3">
                                    <Form.Item
                                        name="patientEmail"
                                        label="Enter email to request for consent form"
                                        rules={[
                                            { required: true, message: 'This field is required' },
                                            { type: 'email', message: 'Enter valid mail address' },
                                        ]}
                                    >
                                        <Input
                                            placeholder="Patient Email"
                                            addonAfter={
                                                <Button className='consent-submit' type="primary" loading={loading9} onClick={() => sendEmail()}>
                                                    Submit
                                                </Button>
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item label="Upload Patient Consent Form">
                                        <Upload.Dragger
                                            name="file"
                                            multiple={false}
                                            maxCount={1}
                                            beforeUpload={() => false}
                                            listType="picture-card"
                                            accept=".pdf"
                                            className="bg-white"
                                            onChange={(info: any) => {
                                                saveUploadConsent(info);
                                            }}
                                        >
                                            <p className="ant-upload-drag-icon"></p>
                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                            <p className="ant-upload-hint">Upload PDF file here</p>
                                        </Upload.Dragger>
                                    </Form.Item>
                                    <div>
                                        <span className="text-decoration-underline text-blue pointer" onClick={() => getConsentTemplate()}>
                                            Click here to view the patient consent template
                                        </span>
                                    </div>
                                </Form>
                            ) : (
                                <div className="my-2 text-start bg-light p-3 fs-15 upload-consent">
                                    The consent form is uploaded on <span className='fw-bold'>{location.state.reqFrom == 3 ? resultInfo?.req_info?.servicerequest_info?.created_on ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('DD/MM/YYYY') : null : resultInfo?.req_info?.consent_upload_date ? dayjs(resultInfo?.req_info?.consent_upload_date).format('DD/MM/YYYY') : null}.</span>
                                    <a className="text-underline px-2" onClick={() => getConsentTemplate()}>
                                        click here to view
                                    </a>
                                    {location.state.reqFrom == 3 ? "" : "or"}
                                    {location.state.reqFrom == 3 ? "" : <a className="text-underline text-danger ps-2" onClick={() => setIsFileUploaded(!isFileUploaded)}>
                                        upload again
                                    </a>}
                                </div>
                            )}
                        </div>
                        {loading7 ? (
                            <Progress
                                size={['100%', 20]}
                                percent={uploadConsentProgress}
                                percentPosition={{ align: 'center', type: 'inner' }}
                                strokeColor={{ from: '#108ee9', to: '#87d068' }}
                            />
                        ) : (
                            ''
                        )}
                        <h6 className="text-dark mt-3">Medication Details</h6>
                        <div className="my-2">
                            <label className='medication-label'>Provide all the medications you have taken past 30 days</label>
                        </div>
                        <Spin spinning={loading10}>
                            <div className="my-2">
                                {assMedicInfo && assMedicInfo?.data?.length > 0 ? (
                                    <table className="edf-step-header table-bordered w-100">
                                        <thead>
                                            <tr className="bg-light">
                                                <th className="p-2">Medicine Name</th>
                                                <th className="p-2">Medicine Dosage</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {assMedicInfo?.data?.map((item: any) => {
                                                return (
                                                    <tr key={item.id}>
                                                        <td className="p-2">{item.medicine_name}</td>
                                                        <td className="p-2">{item.dosage}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                ) : (
                                    <div className="bg-light text-center p-3 text-secondary fs-15 medication-label">No medicines associated</div>
                                )}
                            </div>
                        </Spin>
                    </div>
                    <div className="col-md-6 ps-3 border-start pe-0">
                        <div className="d-flex mb-2">
                            <h6 className="text-dark col my-auto">Patient Health Questionnaire</h6>
                            {stepLoading ? "" : stepsInfo?.data?.phq8_flag ? '' : <div className="bg-lightred text-danger rounded px-2 py-0 fw-bold">PHQ not available for this request</div>}
                        </div>
                        <Spin spinning={loading4} className="h-100">
                            <table className="w-100 edf-step-header table-bordered bg-white ">
                                <thead>
                                    <tr className="heading bg-primary">
                                        <th className="p-2 question-heading text-white">Questions</th>
                                        <th className="p-2 text-center r-check text-white">R1</th>
                                        <th className="p-2 text-center r-check text-white">R2</th>
                                        <th className="p-2 text-center r-check text-white">R3</th>
                                        <th className="p-2 text-center r-check text-white">R4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {phqAnsInfo?.data?.map((item: any, index: number) => {
                                        return (
                                            <tr key={item.phqid} className={`phq-ans-section ${index % 2 === 0 ? 'bg-light' : 'even'}`}>
                                                <td className="p-2">{item.phq}</td>
                                                <td className={`p-2 text-center`}>{item.phq_score === 0 ? <div className="div green-div"></div> : ''}</td>
                                                <td className={`p-2 text-center`}>{item.phq_score === 1 ? <div className="div orange-div"></div> : ''}</td>
                                                <td className={`p-2 text-center`}>{item.phq_score === 2 ? <div className="div pink-div"></div> : ''}</td>
                                                <td className={`p-2 text-center`}>{item.phq_score === 3 ? <div className="div purple-div"></div> : ''}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            <div className="bg-lightprimary phq-ans-section my-2 p-2 d-flex flex-wrap">
                                <div className="col-md-6 d-flex mb-2 fw-bold">
                                    <div className="div green-div me-1"></div>R1 - Not at all
                                </div>
                                <div className="col-md-6 d-flex mb-2 fw-bold">
                                    <div className="div orange-div me-1"></div>R2 - Several days
                                </div>
                                <div className="col-md-6 d-flex fw-bold">
                                    <div className="div pink-div me-1"></div>R3 - More than half days
                                </div>
                                <div className="col-md-6 d-flex fw-bold">
                                    <div className="div purple-div me-1"></div>R4 - Nearly every day
                                </div>
                            </div>
                        </Spin>
                    </div>
                </div>
            </Spin>
            <DisplayDocument openModal={openModal} closeModal={closeModal} />
        </div>
    );
};

export default RequestInformation;
