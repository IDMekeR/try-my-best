import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import BgImage from 'assets/img/new-template-icons/bg-green1.png';
import { useSelector, url2, createMarkup } from 'components/shared/CompVariables';
import { Skeleton, Image, useDispatch } from 'components/shared/AntComponent';
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
import Sliders from './model/Sliders';
import Brain from 'assets/img/report-icons/brain-png.png';
import MarkerTemplate from './MarkerTemplate';

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

const SummaryInterpretation: React.FC<ChildProps> = ({
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
    const dispatch = useDispatch();
    const location = useLocation();
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
    const { intFields } = useSelector((state: any) => state.recAnalysis);
    const { topoResultInfo, resultInfo, success3, loading3, error3 } = useSelector((state: any) => state.wizard);
    const userRole = sessionStorage.getItem('role');
    const [isMedicPresent, setIsMedicPresent] = useState(false);
    const thetaBetaRatio = parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec);
    const thetaBetaRatioEo = parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo);
    const alphaBetaRatio = parseFloat(commonInfo?.Alpha_beta_ratio_value);
    const pdrValue = parseFloat(commonInfo?.pdr_value);
    const age = commonInfo?.pnt_age;
    const alphaAsymmetry = commonInfo?.Alpha_Asymmetry;
    const pafValue = parseFloat(commonInfo?.paf_value);
    const [imageBases, setImageBases] = useState({
        ecAbs: '',
        eoAbs: '',
        ecRel: '',
        eoRel: '',
        pdrImg: '',
    });
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    const [charCount, setCharCount] = useState(0);

    useEffect(() => {
        const paragraph = document.querySelector(".eeg-text") as HTMLElement;
        if (paragraph) {
            const plainText = paragraph.innerText.replace(/<[^>]*>/g, '');
            setCharCount(plainText?.length);
        }
    }, [intFields]);

    const imageUrlToBase64 = async (url: string) => {
        if (url && url != '') {
            try {
                const response = await fetch(url);
                const blob = await response?.blob();
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Error converting image to Base64:', error);
                return '';
            }
        }
        return '';
    };
    const intCallbackFunc = () => {
        handleInterpretChange();
        getInterpretContent();
    };

    function getInterpretContent() {
        dispatch(getInterpretationFindings(location.state?.id) as any);
    }


    const getThetaBetaRatioMessage = () => {
        const results: any = [];

        if (thetaBetaRatio >= 3.0) {
            results.push(' The TBR is elevated and regularly presents with symptoms of ADHD, including distractibility, inattentiveness, and lowered impulse control.');
        }
        if (thetaBetaRatio < 3.0 && thetaBetaRatio < thetaBetaRatioEo) {
            results.push(' While the TBR is in the expected range, it increases in the eyes-opened condition. This phenomenon is known as demand task cognitive slowing and regularly presents with symptoms of panic, OCD, or feelings of overwhelm. It should be noted that this profile responds poorly to most medications targeting these symptoms.');
        }
        if (thetaBetaRatio >= 3.0 && thetaBetaRatio < thetaBetaRatioEo) {
            results.push(' Moreover, this ratio increases in the eyes-opened conditions. This phenomenon is known as demand task cognitive slowing and regularly presents with symptoms of panic, OCD, or feelings of overwhelm. It should be noted, this profile responds poorly to most medications targeting these symptoms.');
        }

        // If no conditions were met, return a default value
        if (results.length === 0) {
            return '';
        }
        // Return all results joined by a space
        return results.join(' ');
    }

    const getAlphaAsymmetryMessage = () => {
        switch (alphaAsymmetry) {
            case 'F3>F4,F7>F8,P4>P3':
                return ' FAA and PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            case 'F3>F4,F7>F8':
            case 'F3>F4':
            case 'F7>F8':
                return ' FAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, and low motivation.';
            case 'F3>F4,P4>P3':
            case 'F7>F8,P4>P3':
                return ' FAA and PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            case 'P4>P3':
                return ' PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            default:
                return '';
        }
    };

    const getAlphaBetaRatioMessage = () => {
        if (alphaBetaRatio < 6.0) {
            return ' The ABR is low and will frequently accompany anxiety spectrum concerns and sleep disturbances.';
        }
        if (alphaBetaRatio > 12.0) {
            return ' Additionally, the ABR is quite elevated and will frequently accompany lower cognitive energy, daytime fatigue, and mood lability.';
        }
        return '';
    };

    const getPdrValueMessage = () => {
        const ageRanges = [
            { minAge: 0, maxAge: 10, thresholds: [10.0, 8.0] },
            { minAge: 10, maxAge: 45, thresholds: [12.0, 10.0] },
            { minAge: 45, maxAge: 55, thresholds: [12.0, 9.5] },
            { minAge: 55, maxAge: 65, thresholds: [12.0, 9.0] },
            { minAge: 65, maxAge: Infinity, thresholds: [12.0, 8.5] },
        ];

        const range = ageRanges?.find((r) => age >= r.minAge && age < r.maxAge);
        if (!range) return '';

        if (pdrValue > range.thresholds[0]) {
            return ' The PDR is elevated in this recording and often associated with anxiety spectrum concerns and sleep disturbances. It should be noted that this pattern responds poorly to many medications.';
        }
        if (pdrValue >= range.thresholds[1] && pdrValue <= range.thresholds[0]) {
            return '';
        }
        return ' The PDR is low and will often present with non-specific cognitive processing difficulties and feelings of overwhelm due to difficulty processing.';
    };

    const getMuRhythmMessage = () => {
        if (commonInfo?.interpretationmakers?.some((marker: any) => marker?.markername === 'Mu Rhythm Present' && (marker?.eyeopen === 'true' || marker?.eyeclosed === 'true'))) {
            if (pafValue >= 7.0 && pafValue <= 15.0) {
                return ' Finally, there is a mu rhythm present in this recording, which is commonly associated with ASD and ADHD populations. Clinically, this often accompanies social anxiety and social cognitive processing deficits. In some populations, including youth and the elderly, this may be considered a normal variant.';
            }
        }
        return '';
    };


    useEffect(() => {
        getInterpretContent();
    }, []);

    useEffect(() => {
        if (topoResultInfo?.topo_path) {
            const fetchImages = async () => {
                const urls = {
                    ecAbs: topoResultInfo?.topo_path?.EC_absolutepow_path ? topoResultInfo?.topo_path?.EC_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path.EC_absolutepow_path : '' : null,
                    eoAbs: topoResultInfo?.topo_path?.EO_absolutepow_path ? topoResultInfo?.topo_path?.EO_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_absolutepow_path : '' : null,
                    ecRel: topoResultInfo?.topo_path?.EC_relativepow_path ? topoResultInfo?.topo_path?.EC_relativepow_path.startsWith('https:') ? topoResultInfo?.topo_path?.EC_relativepow_path : '' : null,
                    eoRel: topoResultInfo?.topo_path?.EO_relativepow_path ? topoResultInfo?.topo_path?.EO_relativepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_relativepow_path : '' : null,
                    pdrImg: topoResultInfo?.topo_path?.EC_pdr_path ? topoResultInfo?.topo_path?.EC_pdr_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_pdr_path : '' : null,
                };
                const [ecAbs, eoAbs, ecRel, eoRel, pdrImg] = await Promise.all(Object.values(urls)?.map((url: any) => imageUrlToBase64(url)));

                setImageBases({ ecAbs, eoAbs, ecRel, eoRel, pdrImg });
            };
            fetchImages();
        }
    }, [topoResultInfo]);
    useEffect(() => {
        const isMedicationDataAvailable = commonInfo?.medication_data?.medications_past?.length > 0 || commonInfo?.medication_data?.medications_present?.length > 0;
        setIsMedicPresent(isMedicationDataAvailable);
    }, [commonInfo]);

    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <div
                    className="page-two mt-2 bg-white mx-auto page border-0"
                    id="page104"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                >
                    <div className="page-content">
                        <div className="d-flex  justify-content-between">
                            <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                qEEG : Impression and Images
                            </h3>
                            <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Name:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Age:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {commonInfo ? commonInfo?.pnt_age : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    DOB:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    Date:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                        {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px', fontFamily: 'RobotoRegular' }} />
                        <div className="page-body mt-2 px-0 ">
                            <div className="d-flex w-100 px-4">
                                <div className="col pe-3 text-justify page-head">
                                    <h4 className="fw-bold text-start text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '24px !important' }}>
                                        Eyes Closed
                                    </h4>
                                    <p className="para" style={{ textAlign: 'justify', fontSize: '18px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        These images capture your brain activity in a relaxed state, free from visual input, providing insight into baseline neural functioning and potential deviations in resting brain
                                        rhythms. These images help identify patterns in brain wave activity that can be indicative of various psychological conditions as well as strengths.
                                    </p>
                                </div>
                                <div className="col ps-2 page-head">
                                    <h4 className="fw-bold text-start text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '24px !important' }}>
                                        Eyes Opened
                                    </h4>
                                    <p className="para" style={{ textAlign: 'justify', fontSize: '18px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                        These images capture brain activity while you are visually engaged, reflecting responses to sensory input and cognitive demands. These images help identify how the brain processes
                                        external stimuli and can reveal abnormalities in electrical patterns associated with attention, perception, and cognitive function in addition to accompanying advantages.
                                    </p>
                                </div>
                            </div>
                            <div className="my-4 px-4">
                                {loading3 ? (
                                    <Skeleton active paragraph />
                                ) : (
                                    <>
                                        <div className="d-flex my-3 topoImg container px-0" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
                                            <div className="topoImgEc" style={{ marginRight: '-20px', position: 'relative', zIndex: 999 }}>
                                                {topoResultInfo?.topo_path?.EC_absolutepow_path !== '' || topoResultInfo?.topo_path?.EC_absolutepow_path !== 'None' ? (
                                                    <Image src={topoResultInfo?.topo_path?.EC_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_absolutepow_path : ''} style={{ height: '85px', position: 'relative', zIndex: 999 }} />
                                                ) : null}
                                            </div>

                                            <div className="topoImgEo" style={{ marginLeft: '-10px', marginRight: '-30px', position: 'relative', zIndex: 1 }}>
                                                {topoResultInfo?.topo_path?.EO_absolutepow_path !== '' || topoResultInfo?.topo_path?.EO_absolutepow_path !== 'None' ? (
                                                    <Image src={topoResultInfo?.topo_path?.EO_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_absolutepow_path : ''} style={{ height: '85px', position: 'relative', zIndex: 1 }} />
                                                ) : null}
                                            </div>
                                        </div>
                                        <div className="d-flex mx-auto topoImg container px-0" style={{ marginTop: '0px', marginRight: 'auto' }}>
                                            <div className="topoImgEc" style={{ marginRight: '-20px', position: 'relative', zIndex: 999 }}>
                                                {topoResultInfo?.topo_path?.EC_relativepow_path !== '' || topoResultInfo?.topo_path?.EC_relativepow_path !== 'None' ? (
                                                    <Image src={topoResultInfo?.topo_path?.EC_relativepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_relativepow_path : ''} style={{ height: '85px', position: 'relative', zIndex: 999 }} />
                                                ) : null}
                                            </div>

                                            <div className="topoImgEo" style={{ marginLeft: '-10px', marginRight: '-30px', position: 'relative', zIndex: 1 }}>
                                                {topoResultInfo?.topo_path?.EO_relativepow_path !== '' || topoResultInfo?.topo_path?.EO_relativepow_path !== 'None' ? (
                                                    <Image src={topoResultInfo?.topo_path?.EO_relativepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_relativepow_path : ''} style={{ height: '85px', position: 'relative', zIndex: 1 }} />
                                                ) : null}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="findings px-4 mt-4 page-head">
                                <h4 className="mb-2 text-start px-0 fw-bold text-dark" style={{ fontFamily: 'RobotoRegular' }}>
                                    Summary Interpretation : Results {released || userRole === 'researcher' ? '' :
                                        <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleInterpretChange()}>
                                            <EditIcon />
                                        </span>}
                                </h4>
                                {intEdit ? (
                                    <InterpretationEditor intCallbackFunc={intCallbackFunc} isMedicationPast={isMedicationPast} />
                                ) : (
                                    <>
                                        {intFields && intFields?.data ? (
                                           <div
                                                className={`markuphtml text-overflow eeg-text 
                                                    ${charCount > 2000 ? 'small-font template2' : ''} 
                                                    ${charCount > 1400 && charCount <= 2000 ? 'medium-font template2' : ''} 
                                                    ${charCount <= 1400 ? 'large-font template2' : ''}`}
                                                style={{ fontFamily: 'RobotoRegular',  textAlign: 'justify', 
                                                    textAlignLast: 'left',  lineHeight: 1.3,fontSize:'16px' }}
                                                dangerouslySetInnerHTML={createMarkup(intFields?.data?.description)}
                                            ></div>
                                        ) : (
                                            <p style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3, fontSize: '16px' }}>
                                                The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms.
                                                {getThetaBetaRatioMessage()}
                                                {getAlphaAsymmetryMessage()}
                                                {getAlphaBetaRatioMessage()}
                                                {getPdrValueMessage()}
                                                {getMuRhythmMessage()}
                                                {isMedicationPast ? ' Medications may normalize an otherwise abnormal EEG. ' : ''}
                                                Careful clinical correlation is advised. A follow-up qEEG is recommended
                                                after therapeutic interventions to objectively assess treatment efficacy and monitor any changes in brain function.
                                            </p>
                                        )}
                                    </>
                                )}

                            </div>
                        </div>
                    </div>
                    <div className="footer" style={{ width: '100%' }}>
                        <h6 className="footer-text text-start ps-0 mb-0 ps-2 pb-1 text-dark" style={{ marginTop: '2px', fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            )}
            <MarkerTemplate
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

export default SummaryInterpretation;