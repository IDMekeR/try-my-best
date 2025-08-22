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
import MarkerTemplateCAI from './MarkerTemplateCAI';

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

const MarkerTemplateAAP: React.FC<ChildProps> = ({
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

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    
    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <div
                    className="page-two mt-2 bg-white mx-auto"
                    id="page107"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                >
                    <div className="page-content">
                        <div className="d-flex  justify-content-between">
                            <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                qEEG Findings: Mood Profile
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
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                    DOB:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular' , fontWeight:500}}>
                                    Date:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <div className="page-body mt-4 px-4">
                            <div className="d-flex w-100">
                                <div className="col pe-3 text-start">
                                    <h3 className="mb-1 text-start text-dark" style={{ fontSize: '34px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                        Alpha Asymmetry Profile (AAP)
                                    </h3>
                                    <p className="mb-0 para" style={{ fontSize: '15px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        <b style={{ fontSize: '15px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>Alpha Asymmetry Profile (AAP)</b> examines the balance of alpha wave
                                        activity across different brain regions, typically focusing on left and right hemispheric differences in frontal or parietal areas. Alpha asymmetries provide insights into an
                                        individual’s baseline emotional and cognitive processing styles, with different patterns linked to mood regulation, stress responses, and attentional focus. Generally, balanced
                                        alpha activity across hemispheres supports emotional resilience and adaptive cognitive flexibility. However, asymmetrical patterns, such as higher alpha in one hemisphere over
                                        the other, can highlight tendencies toward certain emotional or cognitive traits, such as approach versus avoidance behaviors, or introspective versus action-oriented
                                        processing styles. By identifying and understanding these patterns, clinicians can better tailor interventions that support emotional regulation and cognitive efficiency.
                                    </p>
                                    <small className=" py-2 para" style={{ fontFamily: 'RobotoRegular' }}>
                                        *No presentation distinction between eyes opened versus eyes closed
                                    </small>
                                </div>
                                <div className="col-auto">
                                    <img src={AlphaImg} width="295px" height="270px" alt="theta-beta-ratio" />
                                </div>
                            </div>
                            <div className="d-flex w-100 justify-content-between mt-3">
                                <div className="col-md-6">
                                    <h5 className=" fw-bold mb-3 text-start text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '18px' }}>
                                        Left frontal alpha asymmetry when present:
                                    </h5>
                                    <h5 className=" text-white text-center white" style={{ padding: '6px 8px', background: '#3e4b69', width: '150px', borderRadius: '30px', fontFamily: 'RobotoRegular', fontSize: '16px', fontWeight:300 }}>
                                        Strengths
                                    </h5>
                                    <ul className="text-start">
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular', paddingRight: '10px' }}>
                                            Improved detail-oriented tasks
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Strong verbal and language processing
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Heightened empathy and emotional sensitivity
                                        </li>
                                    </ul>
                                    <h5 className="text-white text-center white" style={{ padding: '6px 8px', background: '#3e4b69', width: '150px', borderRadius: '30px', fontFamily: 'RobotoRegular', fontSize: '16px', fontWeight:300 }}>
                                        Challenges
                                    </h5>
                                    <ul className="text-start">
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular', paddingRight: '10px' }}>
                                            Optimism and motivation may be lower
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Difficulty with adaptability
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Lower stress resilience
                                        </li>
                                    </ul>
                                </div>
                                <div className="col d-flex flex-column justify-content-center">
                                    {!loading5 ? (
                                        <div>
                                            <div className="d-flex flex-column align-items-center ">
                                                <h3 className="mb-1 text-dark" style={{ fontSize: '30px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                                    Frontal Asymmetry
                                                </h3>
                                            </div>
                                            <div>
                                                <div className=" mt-2  ">
                                                    <div className="text-container d-flex  justify-content-end w-100">
                                                        <div className="d-flex justify-content-center me-3" style={{ width: '70%' }}>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Left
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeclosed === 'true' ? (
                                                                    <ArrowLeftOutlined />
                                                                ) : (
                                                                    <ArrowRightOutlined />
                                                                )}
                                                            </div>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Right
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex frontal-imgCont">
                                                        <div className="frontal-eye-close-test d-flex justify-content-center ps-2 ms-1 pe-0" style={{ fontFamily: 'RobotoRegular', fontSize: '18px', color: '##423f3f' }}>
                                                            Eye-Closed
                                                        </div>
                                                        <div className="frontal-eye-close-dia d-flex ms-2" style={{ width: '70%' }}>
                                                            <div
                                                                className="left w-50"
                                                                style={{
                                                                    background: '#e9b7b7',
                                                                    height: '24px',
                                                                    borderTopLeftRadius: '22px',
                                                                    borderBottomLeftRadius: '22px',
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="right w-50"
                                                                style={{
                                                                    background: '#a6e8c8',
                                                                    height: '24px',
                                                                    borderTopRightRadius: '22px',
                                                                    borderBottomRightRadius: '22px',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-1  ">
                                                    <div className="text-container d-flex  justify-content-end w-100">
                                                        <div className="d-flex justify-content-center me-3 " style={{ width: '70%' }}>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Left
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeopen === 'true' ? (
                                                                    <ArrowLeftOutlined />
                                                                ) : (
                                                                    <ArrowRightOutlined />
                                                                )}
                                                            </div>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Right
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex frontal-imgCont">
                                                        <div className="frontal-eye-close-test d-flex justify-content-center ps-2 pe-1" style={{ fontFamily: 'RobotoRegular', fontSize: '18px', color: '##423f3f' }}>
                                                            Eye-Opened
                                                        </div>
                                                        <div className="frontal-eye-close-dia d-flex ms-1" style={{ width: '70%' }}>
                                                            <div
                                                                className="left w-50"
                                                                style={{
                                                                    background: '#e9b7b7',
                                                                    height: '24px',
                                                                    borderTopLeftRadius: '22px',
                                                                    borderBottomLeftRadius: '22px',
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="right w-50"
                                                                style={{
                                                                    background: '#a6e8c8',
                                                                    height: '24px',
                                                                    borderTopRightRadius: '22px',
                                                                    borderBottomRightRadius: '22px',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className="p-2" active />
                                    )}
                                </div>
                            </div>
                            <div className="d-flex w-100 justify-content-between">
                                <div className="col-md-6">
                                    <h5 className=" fw-bold mb-3 text-start text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '18px' }}>
                                        Right posterior alpha asymmetry when present:
                                    </h5>
                                    <h5 className=" text-white text-center white" style={{ padding: '6px 8px', background: '#3e4b69', width: '150px', borderRadius: '30px', fontFamily: 'RobotoRegular', fontSize: '16px', fontWeight:300 }}>
                                        Strengths
                                    </h5>
                                    <ul className="text-start">
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular', paddingRight: '10px' }}>
                                            Visual spacial processing
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Enhanced long-term visual memory
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Better performance in solitary tasks
                                        </li>
                                    </ul>
                                    <h5 className=" text-white text-center white" style={{ padding: '6px 8px', background: '#3e4b69', width: '150px', borderRadius: '30px', fontFamily: 'RobotoRegular', fontSize: '16px', fontWeight:300 }}>
                                        Challenges
                                    </h5>
                                    <ul className="text-start">
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular', paddingRight: '10px' }}>
                                            Inward ruminative thoughts
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Negative self-evaluations
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Low motivation
                                        </li>
                                        <li className="" style={{ fontSize: '14px', fontFamily: 'RobotoRegular' }}>
                                            Impaired response to emotional feedback
                                        </li>
                                    </ul>
                                </div>
                                <div className="col d-flex flex-column justify-content-center">
                                    {!loading5 ? (
                                        <div>
                                            <div className="d-flex flex-column align-items-center ">
                                                <h3 className="mb-1 text-dark" style={{ fontSize: '30px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                                    Posterior Asymmetry
                                                </h3>
                                            </div>
                                            <div>
                                                <div className=" mt-2  ">
                                                    <div className="text-container d-flex  justify-content-end w-100">
                                                        <div className="d-flex justify-content-center me-3" style={{ width: '70%' }}>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Left
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeclosed === 'true' ? (
                                                                    <ArrowRightOutlined />
                                                                ) : (
                                                                    <ArrowLeftOutlined />
                                                                )}
                                                            </div>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Right
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex frontal-imgCont">
                                                        <div className="frontal-eye-close-test d-flex justify-content-center ps-2 ms-1 pe-0 " style={{ fontFamily: 'RobotoRegular', fontSize: '18px', color: '##423f3f' }}>
                                                            Eye-Closed
                                                        </div>
                                                        <div className="frontal-eye-close-dia d-flex ms-2" style={{ width: '70%' }}>
                                                            <div
                                                                className="left w-50"
                                                                style={{
                                                                    background: '#a6e8c8',
                                                                    height: '26px',
                                                                    borderTopLeftRadius: '22px',
                                                                    borderBottomLeftRadius: '22px',
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="right w-50"
                                                                style={{
                                                                    background: '#e9b7b7',
                                                                    height: '26px',
                                                                    borderTopRightRadius: '22px',
                                                                    borderBottomRightRadius: '22px',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className=" mt-1  ">
                                                    <div className="text-container d-flex  justify-content-end w-100">
                                                        <div className="d-flex justify-content-center me-3" style={{ width: '70%' }}>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Left
                                                            </div>
                                                            <div className="d-flex align-items-center">
                                                                {commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeopen === 'true' ? (
                                                                    <ArrowRightOutlined />
                                                                ) : (
                                                                    <ArrowLeftOutlined />
                                                                )}
                                                            </div>
                                                            <div className="px-5" style={{ fontFamily: 'RobotoRegular', fontSize: '16px', color: '##423f3f' }}>
                                                                Right
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="d-flex frontal-imgCont">
                                                        <div className="frontal-eye-close-test d-flex justify-content-center px-2" style={{ fontFamily: 'RobotoRegular', fontSize: '18px', color: '##423f3f' }}>
                                                            Eye-Opened
                                                        </div>
                                                        <div className="frontal-eye-close-dia d-flex" style={{ width: '70%' }}>
                                                            <div
                                                                className="left w-50"
                                                                style={{
                                                                    background: '#a6e8c8',
                                                                    height: '26px',
                                                                    borderTopLeftRadius: '22px',
                                                                    borderBottomLeftRadius: '22px',
                                                                }}
                                                            ></div>
                                                            <div
                                                                className="right w-50"
                                                                style={{
                                                                    background: '#e9b7b7',
                                                                    height: '26px',
                                                                    borderTopRightRadius: '22px',
                                                                    borderBottomRightRadius: '22px',
                                                                }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Skeleton className="p-2" active />
                                    )}
                                </div>
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
            <MarkerTemplateCAI
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

export default MarkerTemplateAAP;