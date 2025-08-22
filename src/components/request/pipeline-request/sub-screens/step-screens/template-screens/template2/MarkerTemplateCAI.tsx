import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, footerText, url2, interpretText, pdrText, createMarkup } from 'components/shared/CompVariables';
import { ArrowRightOutlined, ArrowLeftOutlined } from 'components/shared/AntIcons';
import AlphaImg from 'assets/img/report-icons/alpha.png';
import { ApexOptions } from 'apexcharts';
import PdrImg from 'assets/img/report-icons/pdr.png';
import { Image, message, Skeleton } from 'components/shared/AntComponent';
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
import dayjs from 'dayjs';
// import CustomSlider from './model/CustomSlider';
import AlphabetaImg from 'assets/img/report-icons/alphabeta.png';
import SupplementationLifestyle from './SupplementationLifestyle';
import CustomSlider from './model/CustomSlider';
import graph from 'assets/img/report-icons/eeg-graph.png';

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

const MarkerTemplateCAI: React.FC<ChildProps> = ({
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
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
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
    const [pdrImg, setPdrImg] = useState('');

    const isMuRhythm = Boolean(commonInfo?.interpretationmakers?.find((item) => item.markername === 'Mu Rhythm Present' && (item?.eyeopen === 'true' || item?.eyeclosed === 'true')));
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <div
                    className="page-two mt-2 bg-white mx-auto"
                    id="page108"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                >
                    <div className="page-content">
                        <div className="d-flex  justify-content-between">
                            <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                qEEG Findings: Cognitive Arousal Index
                                <span style={{ fontSize: '26px', verticalAlign: 'middle', position: 'relative', top: '-3px' }}>{`(`}</span>
                                <span style={{ padding: '0px 2px 0px 0px', verticalAlign: 'middle', fontFamily: 'AmiriBold', fontSize: '28px' }}>CAI</span>
                                <span style={{ fontSize: '26px', verticalAlign: 'middle', position: 'relative', top: '-3px' }}>{`)`}</span>
                            </h3>
                            <div className="patient-information d-flex flex-column justify-content-center ms-2" style={{ marginRight: '50px' }}>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular' , fontWeight:500}}>
                                    Name:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular' , fontWeight:500}}>
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
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular' , fontWeight:500}}>
                                    Date:
                                    <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <div style={{ borderBottom: '10px solid #3e4b69', width: '270px' }} />
                        <div className="page-body mt-4 px-4">
                            <div className="d-flex w-100">
                                <div className="col pe-3">
                                    <h3 className="mb-1 text-start text-dark" style={{ fontSize: '34px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                        Cognitive Arousal Index (CAI)
                                    </h3>
                                    <p className="mb-0 para " style={{ fontSize: '18px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                        The Cognitive Arousal Index (CAI), also known as the alpha-beta ratio (ABR), measures the balance between relaxed (alpha) and engaged (beta) brain states in the posterior
                                        cortex, offering a snapshot of mental alertness or calmness. This index is a valuable tool for understanding shifts in mood, cognitive focus, and stress resilience, helping to
                                        determine whether the brain leans toward relaxation or heightened activation. Monitoring changes in CAI over time can provide insight into mental health trends and
                                        adaptability.
                                    </p>
                                </div>
                                <div className="col-auto">
                                    <img src={AlphabetaImg} width="295px" height="270px" alt="theta-beta-ratio" />
                                </div>
                            </div>
                            <div className="d-flex justify-content-center my-4 slider-coxnt">
                                <div className="col-md-9">
                                    {!loading5 ? (
                                        <CustomSlider
                                            data={{
                                                value: commonInfo?.Alpha_beta_ratio_value,
                                                size: 'one',
                                                markername: 'Alpha/beta ratio',
                                            }}
                                        />
                                    ) : (
                                        <Skeleton className="p-2" active />
                                    )}
                                </div>
                            </div>
                            <div className="my-2">
                                <h5 className="text-start text-dark" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    When Elevated
                                </h5>
                                <p className="para" style={{ fontSize: '17px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    When the CAI is elevated (&gt;12:1), the brain is generally in a more relaxed or under-aroused state. This can be beneficial in low-stress environments, supporting calmness and
                                    recovery; however, it may lead to lower focus and reduced mental engagement when alertness is required. In excess, an elevated CAI may contribute to symptoms of sluggishness,
                                    distractibility, or low motivation.
                                </p>
                                <h5 className="para text-start text-dark" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    When Low
                                </h5>
                                <p className="para" style={{ fontSize: '17px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    A low CAI (&lt;6:1), suggests a heightened cognitive arousal, often associated with alertness and readiness to respond to external demands. While this can be advantageous in
                                    high-demand situations requiring focus and quick thinking, a persistently low CAI may indicate stress or over-arousal. In chronic cases, it may be linked to symptoms of anxiety,
                                    restlessness, or difficulty relaxing.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            )}

            {isMuRhythm && (
                <div
                    className="page-two mt-2 bg-white mx-auto page border-0"
                    id="page120"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                >
                    <div className="page-content">
                        <div className="d-flex  justify-content-between">
                            <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                qEEG Findings: Social Engagement Index &#x0028;SEI&#x0029;
                            </h3>
                            <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                    Name:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                    Age:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {commonInfo ? commonInfo?.pnt_age : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    DOB:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular' , fontWeight:500 }}>
                                        {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    Date:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <div className="page-body mt-4 px-0">
                            <div className="d-flex w-100 px-4 flex-column">
                                <div className="col pe-3">
                                    <h3 className="mb-1 text-dark" style={{ fontWeight: 'bolder', fontSize: '34px', fontFamily: 'RobotoRegular' }}>
                                        Mu Rhythm - present
                                    </h3>
                                    <p className="mb-0 para" style={{ fontSize: '18px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        The mu rhythm, an 8-13 Hz brainwave pattern over the sensorimotor cortex, is associated with motor readiness and the brain’s mirror neuron system, playing a role in movement
                                        observation, empathy, and social processing. This rhythm usually appears during restful or passive states and typically decreases when a person is actively moving or observing
                                        movement in others. The presence or absence of mu rhythm can offer insights into motor control, sensory responsiveness, and social engagement.
                                    </p>
                                    <div className="col d-flex justify-content-center my-3">
                                        <Image src={graph} height="auto" />
                                    </div>
                                </div>
                                <div>
                                    <h5 className="mt-2 text-dark" style={{ fontSize: '24px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                        Associations
                                    </h5>
                                    <p className="mb-0 para" style={{ fontSize: '17px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        When the mu rhythm is present, as in this EEG recording, it suggests reduced engagement in social and cognitive processing, as the brain’s mirror neuron system remains less
                                        responsive to observed social cues or interactions. In mental health contexts, the persistent presence of mu rhythm has been linked to social cognitive processing deficits and may
                                        contribute to conditions such as social anxiety, where individuals experience difficulties in interpreting or reacting to social cues effectively. This pattern is often observed in
                                        individuals with autism spectrum disorder (ASD) and other conditions marked by social withdrawal or reduced empathy, where a muted mirror neuron response may limit natural social
                                        engagement and connection.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="footer" style={{ textAlign: 'center' }}>
                            <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                            </h6>
                        </div>
                    </div>
                </div>
            )}
            <SupplementationLifestyle
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

export default MarkerTemplateCAI;