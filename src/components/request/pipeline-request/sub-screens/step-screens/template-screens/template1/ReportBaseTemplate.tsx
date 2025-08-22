import React, { useEffect, useState } from 'react';
import { Template3Logo, TextContentImg, HeaderIcon, RibbonIcon } from 'components/shared/TemplateImages';
import { EnvironmentFilled, HomeFilled, MailFilled, MenuOutlined } from 'components/shared/AntIcons';
import { footerText, useSelector, useDispatch, createMarkup, url2 } from 'components/shared/CompVariables';
import { DatePicker, Input, Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import 'assets/styles/template.scss';
import InterpretationPDR from './InterpretationPDR';
import dayjs from 'dayjs';
import { EditIcon } from 'assets/img/custom-icons';
import { GenderIdtOptions, genderOptions } from 'components/shared/DropdownOption';
import RecordingAnalysisEditor from '../../editors/RecordingAnalysisEditor';
import { getAnalysisProcedures } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { addPntDetail, getResultInfo } from 'services/actions/pipeline/stepwizardAction';
import { getAssociateCommon } from 'services/actions/commonServiceAction';
import { Image, message } from 'antd';

interface ChildProps {
    showEdit: boolean;
    recEdit: boolean;
    intEdit: boolean;
    glanceEdit: boolean;
    pdrEdit: boolean;
    medicEdit: boolean;
    suppEdit: boolean;
    suppEdit1: boolean;
    lyfEdit: boolean;
    lyfEdit1: boolean;
    nfbEdit: boolean;
    pbmEdit: boolean;
    released: boolean;
    handlePbmChange: () => void;
    handleNfbChange: () => void;
    handleSuppChange: () => void;
    handleSuppChange1: () => void;
    handleLyfChange: () => void;
    handleLyfChange1: () => void;
    handlePntChange: () => void;
    handleRecChange: () => void;
    handleInterpretChange: () => void;
    handleGlanceChange: () => void;
    handlePdrChange: () => void;
    handleMedicChange: () => void;
}

const ReportBaseTemplate: React.FC<ChildProps> = ({
    showEdit,
    recEdit,
    intEdit,
    glanceEdit,
    pdrEdit,
    medicEdit,
    suppEdit,
    suppEdit1,
    lyfEdit,
    lyfEdit1,
    nfbEdit,
    pbmEdit,
    handlePbmChange,
    handleNfbChange,
    handleLyfChange,
    handleLyfChange1,
    handleSuppChange,
    handleSuppChange1,
    handleMedicChange,
    handleInterpretChange,
    handlePntChange,
    handleRecChange,
    handleGlanceChange,
    handlePdrChange,
}) => {
    const { resultInfo, loading4, loading17, success17, error17 } = useSelector((state: any) => state.wizard);
    const location = useLocation();
    const { recFields, loading } = useSelector((state: any) => state.recAnalysis);
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
    const patientInfo: any = !loading5 && commonInfo ? commonInfo?.patient_info : null;
    const dispatch = useDispatch();
    const [isMedicationPast, setIsMedicationPast] = useState(false);
    const [zoom, setZoom] = useState(1); // Zoom level state
    const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom-in level
    const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom-out level
    const [pntInfo, setPntInfo]: any = useState({ fname: '', lname: '', dob: null, gender: '', genderIdentity: '' });
    const wurl = window.location.href;
    const lastSegment = wurl.substring(wurl.lastIndexOf("/") + 1);
    const [ageValidate, setAgeValidate]: any = useState('');

    const [pntDob, setPntDob]: any = useState(null);
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [firstName, setFirstName]: any = useState('');
    const [lastName, setLastName]: any = useState('');

    const [showSuccesspnt, setShowSuccesspnt] = useState(false);
    const successpnt = showSuccesspnt ? success17 : false;
    const [showErrpnt, setShowErrpnt] = useState(false);
    const errpnt = showErrpnt ? error17 : false;

    useEffect(() => {
        if (commonInfo) {
            const fname = commonInfo?.patient_info?.first_name;
            const lname = commonInfo?.patient_info?.last_name;
            setFirstName(fname);
            setLastName(lname);
            setPntDob(dayjs(commonInfo?.patient_info?.dob));
            setSelectedSex(commonInfo?.patient_info?.sex_at_birth || '');
            setSelectedGender(commonInfo?.patient_info?.gender_identity || '');
        }
    }, [commonInfo]);
    function initializeDatepicker(_defaultDate: dayjs.Dayjs) { }
    const defaultDate = dayjs().subtract(3, 'year');

    // Call the function with the default date
    initializeDatepicker(defaultDate);

    const submitPnt = () => {
        const inputJson = {
            patientid: resultInfo?.req_info?.patient_info?.pntid || 0,
            first_name: firstName || '',
            last_name: lastName || '',
            gender: selectedSex,
            dob: pntDob ? dayjs(pntDob).format('YYYY-MM-DD') : '',
            gender_indentity: selectedGender,
        }
        dispatch(addPntDetail(inputJson) as any);
        setShowSuccesspnt(true);
        setShowErrpnt(true);
    };

    function getCommonService() {
        const inputJson = {
            service_request_id: location?.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }

    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: location?.state?.id
        };
        dispatch(getResultInfo(inputJson) as any);
    }

    useEffect(() => {
        if (successpnt) {
            message.success('Patient Information updated successfully');
            handlePntChange()
            getCommonService();
            getTemplateDetails()
            setShowSuccesspnt(false);
            setAgeValidate('');
        }
        if (errpnt) {
            if (error17?.data) {
                message.error("Patient Information couldn't be updated");
            }
            setShowErrpnt(false);
            handlePntChange()
            setAgeValidate('');
        }
    }, [successpnt, errpnt]);

    const handleDateChange = (date) => {
        const birth = new Date(date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        setAgeValidate('');
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        if (age < 3) {
            setAgeValidate('Age must be at least 3 years old.');
            setPntDob(null);
        } else {
            setAgeValidate('');
            setPntDob(date);
        }
    };

    const disableDate = (date: dayjs.Dayjs): boolean => {
        return date.isAfter(defaultDate, 'day');
    };
    function getRecAnalysis() {
        dispatch(getAnalysisProcedures(location.state.id) as any);
    }
    useEffect(() => {
        getRecAnalysis();
    }, []);

    const recCallbackFunc = () => {
        getRecAnalysis();
        handleRecChange();
    };

    useEffect(() => {
        if (resultInfo && resultInfo?.req_info) {
            const isMedicationDataAvailable = resultInfo?.req_info?.medication_data?.medications_past?.length > 0 || resultInfo?.req_info?.medication_data?.medications_present?.length > 0;
            setIsMedicationPast(isMedicationDataAvailable);
        }
    }, [resultInfo]);

    return (
        <div className="bg-light report-template ">
            <div className="template-controls bg-aliceblue py-2">
                <Button type="primary" className="mx-2 rounded-circle fw-bold shadow-sm fs-20" onClick={handleZoomIn}>
                    +
                </Button>
                <Button type="default" className="mx-2 rounded-circle fw-bold shadow-sm fs-20" onClick={handleZoomOut}>
                    -
                </Button>
            </div>

            <div id="page1" className="page-one bg-white p-2 mx-auto" style={{ zoom: zoom }}>
                <div className="page-content">
                    <div className="text-end me-0 headLogo">
                        <img src={HeaderIcon} alt="" width="auto" height="150px" />
                    </div>
                    <div className="text-center mt-5">
                        <img src={Template3Logo} alt="" width="auto" height="250px" />
                    </div>
                    <div className="text-center mt-3">
                        <img src={TextContentImg} alt="" width="auto" height="62px" />
                    </div>
                    <div className="mt-5 pt-5 text-center">
                        <h2 className="text-dark mt-4" style={{ fontFamily: 'RobotoLight' }}>
                            Prepared for:
                        </h2>
                        {resultInfo?.req_info?.account_info ? (
                            resultInfo?.req_info?.account_info?.iconpath !== '' || resultInfo?.req_info?.account_info?.iconpath !== 'None' ? (
                                <Image className="clientInfoImg" src={resultInfo?.req_info?.account_info?.iconpath?.startsWith('https:') ? resultInfo?.req_info?.account_info?.iconpath : ''} alt="account logo" height="100px" width="auto" style={{ marginLeft: 'auto', marginRight: 'auto', width: 'auto' }} />
                            ) : (
                                <h1 className="text-capitalize clientInfoText" style={{ fontFamily: 'RobotoRegular', height: '100px' }}>
                                    {resultInfo?.req_info?.account_info?.account_name}
                                </h1>
                            )
                        ) : (
                            ''
                        )}
                    </div>
                </div>
                <div className="footer fs-12" style={{ fontFamily: 'RobotoRegular' }}>
                    {footerText}
                </div>
            </div>
            <div className="html2pdf__page-break"></div>
            {/* recording analysis page 2 */}
            <div id="page2" className="page-two bg-white p-2 mx-auto mt-2" style={{ zoom: zoom }}>
                <div className="page-content">
                    <div className="page-header d-flex ">
                        <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                        <img src={TextContentImg} width="560px" className="img-txt" height="62px" alt="tie report translational imaging qeeg report" />
                        <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                    </div>
                    <div className="page-body page-hd">
                        <h6 className=" text-dark " style={{ fontFamily: 'RobotoRegular', lineHeight: lastSegment == 'dataset-information' ? 1.3 : 0.3, fontSize: '17px' }}>
                            Quantitative Electroencephalograph and Standardized Low-Resolution Electromagnetic Tomography Evaluation with Interpretation and Clinical Applications.
                            <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handlePntChange()}>
                                <EditIcon />
                            </span>
                        </h6>
                        <br />
                        <div className={`${showEdit ? 'bg-aliceblue p-2' : ''} page-hd`}>
                            <div className="d-flex">
                                <h6 className=" mb-1 text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '17px' }}>
                                    Patient:
                                </h6>
                                {showEdit ? (
                                    <div className="d-flex w-100 mb-1 ">
                                        <Input className="temp-input ms-2 col-md-4" onChange={(e) => setFirstName(e.target.value)} defaultValue={firstName} />
                                        <Input className="temp-input ms-2 col-md-4" onChange={(e) => setLastName(e.target.value)} defaultValue={lastName} />
                                    </div>
                                ) : (
                                    <div className="fw-normal ms-1  mb-1  text-capitalize text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '17px ' }}>
                                        {commonInfo ? commonInfo?.patient_info?.pntname : '--'}
                                    </div>
                                )}
                            </div>
                            <div className="d-flex text-dark">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Birthdate:
                                </h6>
                                {showEdit ? (
                                    <DatePicker
                                        className="temp-input mb-1 ms-2"
                                        format="MM-DD-YYYY"
                                        defaultValue={pntDob}
                                        defaultPickerValue={defaultDate}
                                        onChange={handleDateChange}
                                        disabledDate={disableDate}
                                    />
                                ) : (
                                    <h6 className="fw-normal ms-1 mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                        {patientInfo ? dayjs(new Date(patientInfo?.dob)).format('MM-DD-YYYY') : '--'}
                                    </h6>
                                )}
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Sex at Birth:
                                </h6>
                                {showEdit ? (
                                    <Select options={genderOptions} className="ms-2 col-md-3 temp-input my-1" onChange={(e) => setSelectedSex(e)} defaultValue={selectedSex} />
                                ) : (
                                    <h6 className="fw-normal ms-1 mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                        {patientInfo ? patientInfo?.sex_at_birth : '--'}
                                    </h6>
                                )}
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Gender Identity:
                                </h6>
                                {showEdit ? (
                                    <Select options={GenderIdtOptions} className="ms-2 col-md-3 temp-input" defaultValue={selectedGender} onChange={(e) => setSelectedGender(e)} />
                                ) : (
                                    <h6 className="fw-normal ms-1 mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                        {patientInfo ? patientInfo?.gender_identity : '--'}
                                    </h6>
                                )}
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Patient ID:
                                </h6>
                                <h6 className="fw-normal ms-1 fs-17 mb-1 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    {patientInfo?.pntid || '--'}
                                </h6>
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Presenting concerns:
                                </h6>
                                <h6 className="fw-normal ms-1 mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    {!loading4 && resultInfo ? resultInfo?.req_info?.Symptoms?.join(', ') : 'denies'}
                                </h6>
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Medications:
                                </h6>
                                <h6 className="fw-normal ms-1 mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    {resultInfo?.req_info?.medication_data?.medications_present?.map((item: any, index: number, array: any[]) => (
                                        <span key={index} className="text-dark">
                                            {item.medic_name}
                                            {index < array.length - 1 ? ', ' : ''}
                                        </span>
                                    ))}
                                    {resultInfo?.req_info?.medication_data?.medications_present?.length == 0 || resultInfo?.req_info?.medication_data?.medications_present === null
                                        ? 'denies'
                                        : ''}
                                </h6>
                            </div>
                            <div className="d-flex">
                                <h6 className=" mb-1 fs-17 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Date:
                                </h6>
                                <h6 className="fw-normal ms-1 fs-17 mb-1 text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM-DD-YYYY') : ''}
                                </h6>
                                {showEdit ? (
                                    <div className="col-auto ms-auto">
                                        <Button type="primary" className="px-2 py-1" loading={loading17} onClick={submitPnt}>
                                            Save
                                        </Button>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div className="mt-4 page-hd">
                            <h6 className="text-primary" style={{ fontFamily: 'RobotoRegular', fontSize: '19px' }}>
                                Recording and Analysis Procedures:
                                <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleRecChange()}>
                                    <EditIcon />
                                </span>
                            </h6>
                            {recEdit ? (
                                <RecordingAnalysisEditor recCallbackFunc={recCallbackFunc} />
                            ) : (
                                <>
                                    {recFields && recFields?.data ? (
                                        <div
                                            className="fs-16 markuphtml text-overflow"
                                            style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3 }}
                                            dangerouslySetInnerHTML={createMarkup(recFields?.data?.description)}
                                        ></div>
                                    ) : (
                                        <p className="fs-16" style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3 }}>
                                            The electroencephalograph (EEG) was digitally recorded utilizing 19 electrodes with the International 10/20 System of electrode placement.
                                            Electrode impedances were reduced to below 5 kohms. The EEG was recorded continuously in the awake state with eyes closed and eyes opened. The EEG
                                            has been visually inspected, and the artifact was rejected utilizing EEG DataHub™ ICA and Components Artifactual Rejection System (CARS). The
                                            absolute and relative spectral analysis has been computed for each task. When age-appropriate, the client`s data has been compared to the EEG
                                            DataHub™ qEEG database with AI consisting of over 10,000 studies in eyes opened and eyes closed conditions. The output is displayed in tables and
                                            topographical maps. The output of magnitude, power, ratio, and coherence have been included. This analysis and report are generated using EEG
                                            DataHub™ software and AI technology. A summary of findings, along with interpretation and recommendations, have been provided by Dr. Steven
                                            Rondeau BCIA-EEG. A shared variance (connectivity) analysis may have been completed.
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="footer fs-12">
                    <div className="d-flex justify-content-center mb-3">
                        <div>
                            <img src={Template3Logo} alt="axon logo" height="80px" width="auto" />
                        </div>
                        <div className="ms-1">
                            <div className="fs-17">
                                <HomeFilled />
                                <span className="ps-2 fs-14" style={{ fontFamily: 'RobotoRegular' }}>
                                    https://axoneegsolutions.com
                                </span>
                            </div>
                            <div className="fs-17">
                                <MailFilled />
                                <span className="ps-2 fs-14" style={{ fontFamily: 'RobotoRegular' }}>
                                    info@axoneegsolutions.com
                                </span>
                            </div>
                            <div className="fs-17">
                                <EnvironmentFilled />
                                <span className="ps-2 fs-14" style={{ fontFamily: 'RobotoRegular' }}>
                                    Fort Collins, CO 80528
                                </span>
                            </div>
                        </div>
                    </div>
                    <div style={{ fontFamily: 'RobotoRegular' }}>{footerText}</div>
                </div>
            </div>

            <div className="html2pdf__page-break"></div>
            <InterpretationPDR
                zoom={zoom}
                intEdit={intEdit}
                handleInterpretChange={handleInterpretChange}
                isMedicationPast={isMedicationPast}
                glanceEdit={glanceEdit}
                released={false}
                handleGlanceChange={handleGlanceChange}
                pdrEdit={pdrEdit}
                handlePdrChange={handlePdrChange}
                medicEdit={medicEdit}
                handleMedicChange={handleMedicChange}
                suppEdit={suppEdit}
                suppEdit1={suppEdit1}
                lyfEdit={lyfEdit}
                lyfEdit1={lyfEdit1}
                pbmEdit={pbmEdit}
                nfbEdit={nfbEdit}
                handleNfbChange={handleNfbChange}
                handlePbmChange={handlePbmChange}
                handleSuppChange={handleSuppChange}
                handleSuppChange1={handleSuppChange1}
                handleLyfChange={handleLyfChange}
                handleLyfChange1={handleLyfChange1}
            />
        </div>
    );
};

export default ReportBaseTemplate;
