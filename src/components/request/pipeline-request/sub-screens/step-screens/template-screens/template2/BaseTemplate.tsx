import React, { useEffect, useState } from 'react';
import { Template3Logo, TextContentImg, HeaderIcon, RibbonIcon } from 'components/shared/TemplateImages';
import { EnvironmentFilled, HomeFilled, MailFilled, MenuOutlined } from 'components/shared/AntIcons';
import { footerText, useSelector, useDispatch, createMarkup } from 'components/shared/CompVariables';
import { DatePicker, Input, Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import 'assets/styles/template2.scss';
import dayjs from 'dayjs';
import { EditIcon } from 'assets/img/custom-icons';
import { GenderIdtOptions, genderOptions } from 'components/shared/DropdownOption';
import RecordingAnalysisEditor from '../../editors/RecordingAnalysisEditor';
import { getAnalysisProcedures } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import MarkerTemplate from './MarkerTemplate';
import FirstPageImg from 'assets/img/report-icons/first-page.png';
import RecordingAnalysisProcedure from '../../recording-analysis-screens/RecordingAnalysisProcedure';
import background from 'assets/img/report-icons/background.png';
import InterpretationTemplate from './InterpretationTemplate';
import { Skeleton } from 'components/shared/AntComponent';
import { addPntDetail, getResultInfo } from 'services/actions/pipeline/stepwizardAction';
import { message, Progress, ProgressProps, Spin } from 'components/shared/AntComponent';
import { getAssociateCommon } from 'services/actions/commonServiceAction';

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

const BaseTemplate: React.FC<ChildProps> = ({
    showEdit,
    released,
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
    const { resultInfo, loading4 , loading17, success17, error17} = useSelector((state: any) => state.wizard);
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { recFields, loading } = useSelector((state: any) => state.recAnalysis);
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
    const patientInfo: any = !loading5 && commonInfo ? commonInfo?.patient_info : null;
    const dispatch = useDispatch();
    const [isMedicationPast, setIsMedicationPast] = useState(false);
    const [zoom, setZoom] = useState(1); // Zoom level state
    const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom-in level
    const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom-out level
    // const [pntInfo, setPntInfo]: any = useState({ fname: '', lname: '', dob: null, gender: '', genderIdentity: '' });
    const [ageValidate, setAgeValidate]: any = useState('');
    const [pntDob, setPntDob]:any = useState(null);
    const [selectedSex, setSelectedSex] = useState('');
    const [selectedGender, setSelectedGender] = useState('');
    const [firstName, setFirstName]:any = useState('');
    const [lastName, setLastName]:any = useState('');

    const [showSuccesspnt, setShowSuccesspnt] = useState(false);
    const successpnt = showSuccesspnt ? success17: false;
    const [showErrpnt, setShowErrpnt] = useState(false);
    const errpnt = showErrpnt ? error17 : false;

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

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

    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: location?.state?.id
        };
        dispatch(getResultInfo(inputJson) as any);
    }

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

    function getCommonService() {
        const inputJson = {
            service_request_id: location?.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }

    function initializeDatepicker(_defaultDate: dayjs.Dayjs) { }
    const defaultDate = dayjs().subtract(3, 'year');

    // Call the function with the default date
    initializeDatepicker(defaultDate);

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
            {/* page 1 */}
            <div className={`page-one bg-white mx-auto page border-0`} id="page101" style={{ position: 'relative', zoom: zoom }}>
                <div className="page-content mt-5 pt-5">
                    <img src={FirstPageImg} alt="first-page" width="100%" />
                </div>
                <div className="footer" style={{ textAlign: 'center' }}>
                    <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                        Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                    </h6>
                </div>
            </div>
            {/* page 2 */}
            <div
                className="page-two bg-white mx-auto px-0 pt-3 pb-0 mt-2 page border-0"
                id="page102"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 pb-2 col-auto ps-4 pt-3 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '27px !important' }}>
                            CLIENT {released || userRole === 'researcher' ? '' : <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handlePntChange()}>
                                <EditIcon />
                            </span>}
                        </h3>
                        <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                Name:
                                <div className=" text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                Age:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular' }}>
                                    {commonInfo ? commonInfo?.pnt_age : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                DOB:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular' }}>
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                Date:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular' }}>
                                    {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                        </div>
                    </div>
                    <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body px-0">
                        <div className="text-start mt-3 ps-4" style={{ lineHeight: 1 }}>
                            <div className="patient-information result-report" style={{ lineHeight: 1 }}>
                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Patient Name:
                                    <span className="sm-text text-capitalize text-end " style={{ marginLeft: '4px', fontSize: '17px !important', fontWeight: 200, fontFamily: 'RobotoRegular' }}>
                                        {loading5 ? (
                                                <Skeleton.Button active />
                                        ) :(
                                            <>
                                                {showEdit ? (
                                                    <div className="d-flex w-100 mb-1">
                                                        <Input className="temp-input ms-2 col-md-4" onChange={(e) => setFirstName(e.target.value)} defaultValue={firstName} />
                                                        <Input className="temp-input ms-2 col-md-4" onChange={(e) => setLastName(e.target.value)} defaultValue={lastName} />
                                                    </div>
                                                ) : (
                                                    <div className="fw-normal mb-0 fs-17 text-capitalize text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                                        {commonInfo ? commonInfo?.patient_info?.pntname : '--'}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </h6>
                                <h6 className="d-flex mb-1 text-dark " style={{ fontSize: '17px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Birthdate:
                                    <span className="sm-text " style={{ fontSize: '17px !important', fontWeight: 200, marginLeft: '4px' }}>
                                        {loading5 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <>
                                                {showEdit ? (
                                                    <DatePicker defaultPickerValue={defaultDate} disabledDate={disableDate} onChange={handleDateChange} format="MM/DD/YYYY" defaultValue={pntDob} className="ms-1 template temp-input" />
                                                ) : (
                                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular' }}>
                                                        {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </span>
                                    <div>
                                        <small className="text-danger ms-2 text-dark" style={{ fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                            {ageValidate}
                                        </small>
                                    </div>
                                </h6>

                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Sex at Birth:
                                    <span className=" text-capitalize sm-text " style={{ marginLeft: '4px', fontSize: '17px', fontFamily: 'RobotoRegular' }}>
                                        {loading5 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <>
                                                {showEdit ? (
                                                    <div className="d-flex">
                                                        <Select
                                                            
                                                            className=" temp-input"
                                                            style={{ width: 120 }}
                                                            defaultValue={selectedSex}
                                                            onChange={(e) => setSelectedSex(e)}
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            options={[
                                                                {
                                                                    value: 'Male',
                                                                    label: 'Male',
                                                                },
                                                                {
                                                                    value: 'Female',
                                                                    label: 'Female',
                                                                },
                                                                {
                                                                    value: 'Others',
                                                                    label: 'Others',
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className=" text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                                        {commonInfo ? commonInfo?.patient_info?.sex_at_birth : ''}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </h6>
                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Gender Identity:
                                    <span className=" text-capitalize sm-text " style={{ fontSize: '17px', fontWeight: 200, marginLeft: '4px', fontFamily: 'RobotoRegular' }}>
                                        {loading5 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <>
                                                {showEdit ? (
                                                    <div className="d-flex">
                                                        <Select
                                                           
                                                            className=" temp-input"
                                                            style={{ width: 120 }}
                                                            defaultValue={selectedGender}
                                                            onChange={(e) => setSelectedGender(e)}
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            options={[
                                                                {
                                                                    label: 'Male',
                                                                    value: 'Male',
                                                                },
                                                                {
                                                                    label: 'Female',
                                                                    value: 'Female',
                                                                },
                                                                {
                                                                    label: 'Non-binary',
                                                                    value: 'Non-binary',
                                                                },
                                                                {
                                                                    label: 'Transgender',
                                                                    value: 'Transgender',
                                                                },
                                                            ]}
                                                        />
                                                    </div>
                                                ) : (
                                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular' }}>
                                                        {commonInfo ? commonInfo?.patient_info?.gender_identity : ''}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </span>
                                </h6>
                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', whiteSpace: 'nowrap', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Presenting concerns:
                                    <span className="sm-text " style={{ fontSize: '17px !important', marginLeft: '4px', whiteSpace: 'normal', fontFamily: 'RobotoRegular' }}>
                                        {loading4 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <>
                                                 {!loading4 && resultInfo ? resultInfo?.req_info?.Symptoms?.join(', ') : 'denies'}
                                            </>
                                        )}
                                    </span>
                                </h6>
                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', whiteSpace: 'nowrap', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Present Medications:{' '}
                                    <span className="" style={{ marginLeft: '4px', whiteSpace: 'normal', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {loading5 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <>
                                                {resultInfo?.req_info?.medication_data?.medications_present?.map((item: any, index: number, array: any[]) => (
                                                    <span key={index} className="text-dark">
                                                        {item.medic_name}
                                                        {index < array.length - 1 ? ', ' : ''}
                                                    </span>
                                                ))}
                                                {resultInfo?.req_info?.medication_data?.medications_present?.length == 0 || resultInfo?.req_info?.medication_data?.medications_present === null
                                                    ? 'denies'
                                                    : ''}
                                            </>
                                        )}
                                    </span>
                                </h6>
                                <h6 className="d-flex mb-1 text-dark" style={{ fontSize: '17px !important', fontFamily: 'RobotoRegular' , fontWeight: 500}}>
                                    Date:{' '}
                                    <span className="text-dark" style={{ marginLeft: '4px', fontSize: '17px !important', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {loading5 ? (
                                            <Skeleton.Button active />
                                        ) : (
                                            <div className=" text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                                {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                            </div>
                                        )}
                                    </span>
                                </h6>
                            </div>
                        </div>
                        {showEdit ? (
                            <Button type="primary" className="ms-3" loading={loading17} onClick={submitPnt}>
                                Save
                            </Button>
                        ) : (
                            ''
                        )}
                        <h3 className="mb-0 pb-2 col-auto ps-4 pt-3 text-start text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '27px !important' }}>
                            RECORDING
                            {released || userRole === 'researcher'|| showEdit ? '' : <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleRecChange()}>
                                <EditIcon />
                            </span>}
                        </h3>

                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <div className="record-findings pb-3 mt-2 px-4">
                            {recEdit ? (
                                <RecordingAnalysisEditor recCallbackFunc={recCallbackFunc} />
                            ) : (
                                <>
                                    {recFields && recFields?.data ? (
                                        <div
                                            className="fs-16 markuphtml text-overflow"
                                            style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3,fontSize: '17px' }}
                                            dangerouslySetInnerHTML={createMarkup(recFields?.data?.description)}
                                        ></div>
                                    ) : (
                                        <div className="" style={{ fontFamily: 'RobotoRegular',fontSize: '17px', textAlign: 'justify', lineHeight: 1.2 }}>
                                            The electroencephalograph (EEG) was digitally recorded utilizing 19 electrodes with the International 10/20 System of electrode placement. Electrode impedances were reduced to
                                            below 5 kohms. The EEG was recorded continuously in the awake state with eyes closed and eyes opened. The EEG has been visually inspected, and the artifact was rejected utilizing
                                            EEG DataHub™ ICA and Components Artifactual Rejection System (CARS). The absolute and relative spectral analysis has been computed for each task. When age-appropriate, the
                                            client&apos;s data has been compared to the EEG DataHub™ qEEG database with AI consisting of over 10,000 studies in eyes opened and eyes closed conditions. The output is displayed in
                                            tables and topographical maps. The output of magnitude, power, ratio, and coherence have been included. This analysis and report are generated using EEG DataHub™ software and
                                            AI technology. A summary of findings, along with interpretation and recommendations, have been provided by Dr. Steven Rondeau, BCN (EEG), qEEG-DL. A shared variance
                                            (connectivity) analysis may have been completed.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <h3 className="mb-0 pb-2 col-auto ps-4 pt-3 text-start text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '27px' }}>
                            EEG ANALYSIS
                        </h3>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <div className="py-3 px-4 " style={{ fontSize: '17px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                The journey from EEG to qEEG, or quantitative EEG, has been quite transformative. Initially, EEG, or electroencephalography, was primarily used to detect electrical activity in the brain. Over
                            time, advancements in technology and analysis techniques allowed us to extract more detailed information from EEG recordings, leading to the emergence of qEEG. This quantitative approach
                            provides a deeper understanding of brain function by measuring various aspects of brain activity, such as frequency, amplitude, and connectivity patterns. During the analysis process, our
                            skilled team reviews your EEG data carefully, looking for patterns and abnormalities that could indicate different qualities of brain function. By comparing your data to a large database of
                            individuals, we can gain insights into how your brain activity compares to others and identify areas for improvement or support. Our medical team meticulously examines your results and
                            provides personalized recommendations to optimize your brain health and function. Through this comprehensive approach, we aim to provide you with valuable insights and strategies for enhancing
                            your overall well-being.
                        </div>
                    </div>
                </div>
                <div className="footer" style={{ width: '100%', textAlign: 'center' }}>
                    <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                        Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                    </h6>
                </div>
            </div>
            <InterpretationTemplate
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

export default BaseTemplate;
