import React, { useEffect, useMemo, useState } from 'react';
import { Template3Logo, HeaderIcon, RibbonIcon } from 'components/shared/TemplateImages';
import { useSelector, useDispatch, footerText, url2, interpretText, pdrText, createMarkup } from 'components/shared/CompVariables';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Image, message } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import BgImage from 'assets/img/new-template-icons/bg-green1.png';
// import MedicationTemplate from './MedicationTemplate';
import { EditIcon } from 'assets/img/custom-icons';
import InterpretationEditor from '../../editors/InterpretationEditor';
import { getInterpretationFindings, getPdrData } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { Input } from 'components/shared/FormComponent';
import { saveInterpretationMarker } from 'services/actions/pipeline/stepwizardAction';
import { getAssociateCommon } from 'services/actions/commonServiceAction';
import PdrEditor from '../../editors/PdrEditor';
import background from 'assets/img/report-icons/background.png';
import ThetaImg from 'assets/img/report-icons/theta-beta.png';
import { Skeleton } from 'components/shared/AntComponent';


import dayjs from 'dayjs';
import CustomSlider from './model/CustomSlider';
import MarkerTemplate2 from './MarkerTemplate2';

const A4_PAGE_HEIGHT_PX = 548;
interface ChildProps {
    zoom: any;
    intEdit: boolean;
    released: boolean;
    isMedicationPast: boolean;
    glanceEdit: boolean;
    pdrEdit: boolean;
    medicEdit: boolean;
    suppEdit: boolean;
    suppEdit1: boolean;
    lyfEdit: boolean;
    lyfEdit1: boolean;
    nfbEdit: boolean;
    pbmEdit: boolean;
    handlePbmChange: () => void;
    handleNfbChange: () => void;
    handleSuppChange: () => void;
    handleSuppChange1: () => void;
    handleLyfChange: () => void;
    handleLyfChange1: () => void;
    handleMedicChange: () => void;
    handlePdrChange: () => void;
    handleGlanceChange: () => void;
    handleInterpretChange: () => void;
}

const MarkerTemplate: React.FC<ChildProps> = ({
    zoom,
    intEdit,
    released,
    isMedicationPast,
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
    handleSuppChange,
    handleSuppChange1,
    handleLyfChange,
    handleLyfChange1,
    handleMedicChange,
    handlePdrChange,
    handleGlanceChange,
    handleInterpretChange,
}) => {
    const { commonInfo,loading5 } = useSelector((state: any) => state.commonData);
    const { intFields } = useSelector((state: any) => state.recAnalysis);
    const dispatch = useDispatch();
    const location = useLocation();
    const { topoResultInfo, resultInfo, success3, loading3, error3 } = useSelector((state: any) => state.wizard);
    const [isOverflow, setIsOverflow] = useState(false);
    const [maxValue, setMaxValue]: any = useState();
    const ageValue = commonInfo?.pnt_age || null;
    const thetaBetaRatio = parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec);
    const thetaBetaRatioEo = parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo);
    const alphaBetaRatio = parseFloat(commonInfo?.Alpha_beta_ratio_value);
    const pdrValue = parseFloat(commonInfo?.pdr_value);
    const age = commonInfo?.pnt_age;
    const alphaAsymmetry = commonInfo?.Alpha_Asymmetry;
    const pafValue = parseFloat(commonInfo?.paf_value);
    const [markerData, setMarkerData] = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }

    useEffect(() => {
        if (resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_value) {
            const vals = resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_channels;
            const vals1 = resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_value;
            let val1 = 0,
                val2 = 0,
                val3 = 0,
                val4 = 0,
                val5 = 0,
                val6 = 0,
                val7 = 0,
                val8 = 0,
                val9 = 0,
                val10 = 0;
            for (let i = 0; i < vals.length; i++) {
                if (vals[i] === 'EEG P3' || vals[i] === 'EEG P3-LE' || vals[i] === 'P3') {
                    val1 = vals1[i];
                    val4 = i;
                } else if (vals[i] === 'EEG Pz' || vals[i] === 'EEG Pz-LE' || vals[i] === 'Pz') {
                    val2 = vals1[i];
                    val5 = i;
                } else if (vals[i] === 'EEG P4' || vals[i] === 'EEG P4-LE' || vals[i] === 'P4') {
                    val3 = vals1[i];
                    val6 = i;
                } else if (vals[i] === 'EEG O1' || vals[i] === 'EEG O1-LE' || vals[i] === 'O1') {
                    val7 = vals1[i];
                    val8 = i;
                } else if (vals[i] === 'EEG O2' || vals[i] === 'EEG O2-LE' || vals[i] === 'O2') {
                    val9 = vals1[i];
                    val10 = i;
                }
            }
            const max = Math.max(val1, val2, val3, val7, val9);
            if (max == val1) {
                setMaxValue(val4);
            } else if (max == val2) {
                setMaxValue(val5);
            } else if (max == val3) {
                setMaxValue(val6);
            } else if (max == val7) {
                setMaxValue(val8);
            } else if (max == val9) {
                setMaxValue(val10);
            }
        }
    }, [resultInfo]);

    useEffect(() => {
        if (commonInfo) {
            if (commonInfo?.interpretationmakers) {
                setMarkerData(commonInfo?.interpretationmakers);
            }
        }

        const checkOverflow = () => {
            const contentDiv = document.querySelector('.page-body');
            if (contentDiv) {
                const contentHeight = contentDiv.scrollHeight;
                setIsOverflow(contentHeight > A4_PAGE_HEIGHT_PX);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [commonInfo, topoResultInfo]);

    let categoryIndex;
    if (ageValue < 8) {
        categoryIndex = 0;
    } else if (ageValue < 45) {
        categoryIndex = 1;
    } else if (ageValue < 75) {
        categoryIndex = 2;
    } else {
        categoryIndex = 3;
    }

    function getInterpretContent() {
        dispatch(getInterpretationFindings(location.state?.id) as any);
    }

    useEffect(() => {
        getInterpretContent();
    }, []);


    function getPdrInfo() {
        dispatch(getPdrData(location.state?.id) as any);
    }

    useEffect(() => {
        getPdrInfo();
    }, []);

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Interpretation markers saved successfully');
            handleGlanceChange();
            getCommonService();
        }
        if (errormsg) {
            if (error3?.data) {
                message.error(error3?.data);
            } else {
                message.error("Interpretation couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <>
                    <div
                        className="page-two mt-2 bg-white mx-auto"
                        id="page105"
                        style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >
                        <div className="page-content">
                            <div className="d-flex  justify-content-between">
                                <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                    qEEG Findings: Focused Attention Index
                                </h3>
                                <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Name:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular' , fontWeight:500}}>
                                            {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Age:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? commonInfo?.pnt_age : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        DOB:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Date:
                                        <div className="text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                        </div>
                                    </h6>
                                </div>
                            </div>
                            <div style={{ borderBottom: '10px solid #3e4b69', width: '270px' }} />
                            <div className="page-body mt-4 px-0">
                                <div className="d-flex w-100 px-4">
                                    <div className="col pe-3">
                                        <h3 className="mb-1 text-start text-dark" style={{ fontWeight: 'bolder', fontSize: '34px', fontFamily: 'RobotoRegular' }}>
                                            Focused Attention Index (FAI)
                                        </h3>
                                        <p className="mb-0 mt-2 para" style={{ fontSize: '18px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                            The <b style={{ fontSize: '18px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>Focused Attention Index (FAI)</b>, measured through the Theta-Beta Ratio
                                            (TBR), evaluates the balance between theta (associated with relaxation/daydreaming) and beta (linked to focus/alertness) brainwave activity, providing insight into an
                                            individual’s natural focus levels. Typically, the FAI is assessed in an eyes-closed condition, but examining the TBR in both eyes-closed and eyes-opened states can reveal
                                            unique challenges, such as <b style={{ fontSize: '18px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>Demand Task Cognitive Slowing</b>. This
                                            phenomenon occurs when the TBR increases abnormally with eyes opened, suggesting a struggle to maintain focus under cognitive demand.
                                        </p>
                                    </div>
                                    <div className="col-auto">
                                        <img src={ThetaImg} width="270px" height="270px" alt="theta-beta-ratio" />
                                    </div>
                                </div>
                                <div className="d-flex justify-content-center my-4 slider-coxnt">
                                    <div className="col-md-9">
                                        {!loading5 ? (
                                         <CustomSlider
                                            data={{
                                                value: commonInfo?.Theta_Beta_Ratio_value_ec,
                                                size: 'one',
                                                markername: 'Theta/beta ratio',
                                            }}
                                        /> 
                                        ) : (
                                            <Skeleton className="p-2" active />
                                        )}
                                    </div>
                                </div>
                                <div className="my-2 px-4">
                                    <h5 className="text-start text-dark" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                        When Elevated
                                    </h5>
                                    <p className="para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        An elevated FAI, with higher theta relative to beta, generally reflects a calm or under-aroused baseline, supporting creativity and introspection but potentially leading to
                                        distractibility or lowered focus during tasks. Individuals with a high FAI may benefit from structured settings and external motivators to sustain engagement, especially in
                                        high-demand situations.
                                    </p>
                                    <h5 className="para text-start text-dark" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                        When Low
                                    </h5>
                                    <p className="para" style={{ textAlign: 'justify', fontFamily: 'FiraLight,RobotoRegular', fontSize: '17px', lineHeight: 1.2 }}>
                                        A low FAI, where beta activity is greater than theta, suggests a naturally heightened focus and attentiveness, beneficial for demanding tasks requiring concentration. While
                                        advantageous, a persistently low FAI can also indicate susceptibility to stress or over-arousal, necessitating techniques to promote balance and prevent mental fatigue.
                                    </p>

                                    {commonInfo?.Theta_Beta_Ratio_value_ec < commonInfo?.Theta_Beta_Ratio_value_eo && (
                                        <>
                                            <h5 className="para text-start" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                                Ratio Comparison: Eyes Opened vs Eyes Closed
                                            </h5>
                                            <p className="para" style={{ textAlign: 'justify', fontFamily: 'FiraLight,RobotoRegular', fontSize: '17px', lineHeight: 1.2 }}>
                                                In a typical pattern, the TBR decreases or remains stable when eyes are opened, supporting alertness under task demands. However, in
                                                <b style={{ fontSize: '17px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}> Demand Task Cognitive Slowing</b>, the TBR abnormally increases with
                                                eyes opened, suggesting cognitive “slowdown” and an increased difficulty sustaining attention. This phenomenon may manifest as mental fatigue, distractibility, or a sense
                                                of overwhelm under real-time cognitive demands, highlighting a need for strategies to improve cognitive resilience and adaptability.
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="footer" style={{ textAlign: 'center' }}>
                            <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                            </h6>
                        </div>
                    </div>
                </>
            )}
            <MarkerTemplate2
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
    )
}

export default MarkerTemplate;