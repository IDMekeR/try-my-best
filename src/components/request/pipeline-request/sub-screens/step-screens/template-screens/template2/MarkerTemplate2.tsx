import React, { useEffect, useMemo, useState } from 'react';
import { Template3Logo, HeaderIcon, RibbonIcon } from 'components/shared/TemplateImages';
import { useSelector, useDispatch, footerText, url2, interpretText, pdrText, createMarkup } from 'components/shared/CompVariables';
import Chart from 'react-apexcharts';
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
import MarkerTemplateAAP from './MarkerTemplateAAP';
import CustomSlider from './model/CustomSlider';

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

const MarkerTemplate2: React.FC<ChildProps> = ({
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
    handleInterpretChange, }) => {
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
    const [pdrImg,setPdrImg] = useState('');

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    const imageUrlToBase641 = async (url:any) => {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Error converting image to Base64:', error);
            return null;
        }
    };

    useEffect(() => {
        if (topoResultInfo?.topo_path) {
            if (topoResultInfo?.topo_path?.EC_pdr_path) {
                const absurl = topoResultInfo?.topo_path?.EC_pdr_path?.startsWith('https:')  ? topoResultInfo?.topo_path?.EC_pdr_path :  '';
                imageUrlToBase641(absurl)
                    .then((base64String:any) => {
                        setPdrImg(base64String);
                    })
                    .catch((error) => {
                        console.error('Error Converting image:', error);
                    });
            }
        }
    }, [topoResultInfo?.topo_path]);
    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <>
                    <div
                        className="page-two mt-2 bg-white mx-auto"
                        id="page106"
                        style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >
                        <div className="page-content">
                            <div className="d-flex  justify-content-between">
                                <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                    qEEG Findings: Processing Profile
                                </h3>
                                <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Name:
                                        <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
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
                                        <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Date:
                                        <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}   
                                        </div>
                                    </h6>
                                </div>
                            </div>
                            <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                            <div className="page-body mt-4 px-4">
                                <div className="d-flex w-100">
                                    <div className="col pe-2">
                                        <h3 className="mb-1 text-start text-dark" style={{ fontWeight: 'bold', fontSize: '34px', fontFamily: 'RobotoRegular' }}>
                                            Mental Readiness Index (MRI)
                                        </h3>
                                        <p className="mb-0  pe-2 para" style={{ textAlign: 'justify', fontSize: '18px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                            The <b style={{ fontSize: '18px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>Mental Readiness Index (MRI)</b>, assessed in part by the Posterior
                                            Dominant Rhythm (PDR), serves as a “resting rate” for the brain, much like a resting heart rate does for physical health. The optimal PDR typically falls within an 8-12 Hz
                                            range for adults, but is lower in children, with values adjusted according to age-matched norms. This rhythm supports balanced cognitive processing and attentional readiness,
                                            with deviations from these norms indicating shifts in mental clarity, processing speed, and cognitive resilience.
                                        </p>
                                    </div>
                                    <div className="col-auto" style={{ marginTop: '-13px' }}>
                                        <img src={PdrImg} width="295px" height="270px" alt="theta-beta-ratio" />
                                    </div>
                                </div>

                                <div className=" d-flex ">
                                    <div className="w-50">
                                        {loading3 ? (
                                            <Skeleton active />
                                        ) : (
                                            <div style={{ zIndex: 1, marginLeft: '-20px', position: 'relative' }}>
                                                {topoResultInfo?.topo_path?.EC_pdr_path !== '' || topoResultInfo?.topo_path?.EC_pdr_path !== 'media/' ? (
                                                    <Image src={pdrImg} className="col" height={300} style={{ zIndex: -1, width: 'auto' }} />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-center my-4 w-50 d-flex flex-column" style={{ position: 'relative' }}>
                                        {!loading5 ? (
                                            <CustomSlider
                                                data={{
                                                    value: commonInfo?.pdr_value,
                                                    size: 'two',
                                                    markername: 'Posterior Dominant Rhythm',
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
                                    <p className="para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        An elevated MRI, with PDR values above the age-appropriate range, is comparable to a rapid resting heart rate, suggesting heightened mental alertness or tension. While this can
                                        enhance quick processing in the short term, it may also lead to restlessness or difficulty relaxing, similar to feeling “wired.” Persistent elevation is often linked to stress or
                                        anxiety, indicating a need for strategies that promote cognitive relaxation and flexibility.
                                    </p>
                                    <h5 className="para text-start text-dark" style={{ fontSize: '24px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                        When Low
                                    </h5>
                                    <p className="para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        A low MRI, with PDR below age-based norms, resembles a low resting heart rate and may indicate reduced alertness or slower cognitive response. This pattern can lead to mental
                                        sluggishness, fatigue, and, importantly, a sense of overwhelm, as slower processing may make it difficult to keep up with cognitive demands. Individuals with a low MRI may benefit
                                        from interventions that “warm up” cognitive readiness, such as structured cognitive exercises and physical activity, to boost focus and support cognitive endurance.
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
                </>
            )}
             <MarkerTemplateAAP
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

export default MarkerTemplate2;