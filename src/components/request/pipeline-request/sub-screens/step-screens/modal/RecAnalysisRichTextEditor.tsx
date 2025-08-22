import React, { useEffect, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'components/shared/ButtonComponent';
import { Modal } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { saveAdjunctTherapy, saveAnalysisProcedures, saveInterpretFindings, saveNeurofeedback } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { message, Spin } from 'components/shared/AntComponent';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    callbackFunc: () => void;
    type: string;
}
const RecAnalysisRichTextEditor: React.FC<ChildProps> = ({ openModal, closeModal, type, callbackFunc }) => {
    const recEditor = useRef(null);
    const neuroEditor = useRef(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const { resultInfo } = useSelector((state: any) => state.wizard);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const {
        recFields,
        loading1,
        loading,
        success1,
        error1,
        intFields,
        neuroFields,
        adjunctFields,
        loading8,
        loading6,
        loading2,
        loading3,
        success3,
        error3,
        loading7,
        error7,
        success7,
        success9,
        loading9,
        error9,
    } = useSelector((state: any) => state.recAnalysis);
    //recording analysis
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;
    //interpretation
    const [showsuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showsuccessmsg1 ? success3 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error3 : false;
    //neuro
    const [showsuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showsuccessmsg2 ? success7 : false;
    const [showErrormsg2, setShowErrormsg2] = useState(false);
    const errormsg2 = showErrormsg2 ? error7 : false;
    //adjunct
    const [showsuccessmsg3, setShowSuccessmsg3] = useState(false);
    const successmsg3 = showsuccessmsg3 ? success9 : false;
    const [showErrormsg3, setShowErrormsg3] = useState(false);
    const errormsg3 = showErrormsg3 ? error9 : false;

    const [isMedicationPast, setIsMedicationPast] = useState(false);
    const [intContent, setIntContent] = useState(``);
    const [neuroEC, setNeuroEC] = useState('');
    const [neuroEO, setNeuroEO] = useState('');
    const [adjContent, setAdjContent] = useState('');
    const [content, setContent] = useState(`The electroencephalograph (EEG) was digitally recorded utilizing 19 electrodes with the International 
    10/20 System of electrode placement. Electrode impedances were reduced to below 5 kohms. The EEG was recorded continuously 
    in the awake state with eyes closed and eyes opened. The EEG has been visually inspected, and the artifact was rejected utilizing 
    EEG DataHub™ ICA and Components Artifactual Rejection System (CARS). The absolute and relative spectral analysis has been computed 
    for each task. When age-appropriate, the client's data has been compared to the EEG DataHub™ qEEG database with AI consisting of over 
    10,000 studies in eyes opened and eyes closed conditions. The output is displayed in tables and topographical maps. The output of magnitude, 
    power, ratio, and coherence have been included. This analysis and report are generated using EEG DataHub™ software and AI 
    technology. A summary of findings, along with interpretation and recommendations, have been provided by Dr. Steven Rondeau BCIA-EEG. 
    A shared variance (connectivity) analysis may have been completed.`);

    useEffect(() => {
        if (recFields && recFields?.data) {
            setContent(recFields?.data?.description);
        }
    }, [recFields]);

    useEffect(() => {
        if (adjunctFields && adjunctFields?.data) {
            setAdjContent(adjunctFields?.data?.description);
        }
    }, [adjunctFields]);

    useEffect(() => {
        if (neuroFields) {
            if (neuroFields?.data) {
                setNeuroEO(neuroFields?.data?.neurofeedback_EO);
                setNeuroEC(neuroFields?.data?.neurofeedback_EC);
            }
        }
    }, [neuroFields]);

    const submitForm = () => {
        const inputJson = {
            sr_analysisprocedures: recFields?.data?.id || 0,
            service_request: location.state.id,
            description: content,
        };
        dispatch(saveAnalysisProcedures(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    const submitIntForm = () => {
        const inputJson = {
            sr_associate_interpretation: intFields?.data?.id || 0,
            service_request: location.state.id,
            description: intContent,
        };

        dispatch(saveInterpretFindings(inputJson) as any);
        setShowErrormsg1(true);
        setShowSuccessmsg1(true);
    };
    const submitNeuroForm = () => {
        const inputJson = {
            sr_associate_neurofeedback: neuroFields?.data?.id || 0,
            service_request: location.state.reqId,
            description: null,
            neurofeedback_EO: neuroEO,
            neurofeedback_EC: neuroEC,
        };
        dispatch(saveNeurofeedback(inputJson) as any);
        setShowErrormsg2(true);
        setShowSuccessmsg2(true);
    };
    const submitAdjForm = () => {
        const inputJson = {
            sr_associate_adjunctTherapies: adjunctFields?.data?.id || 0,
            service_request: location.state?.id,
            description: adjContent,
        };
        dispatch(saveAdjunctTherapy(inputJson) as any);
        setShowSuccessmsg3(true);
        setShowErrormsg3(true);
    };
    // Functions to generate dynamic messages
    const getThetaBetaRatioMessage = () => {
        const thetaBetaRatio = parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec);
        const thetaBetaRatioEo = parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo);
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
    };

    const getAlphaAsymmetryMessage = () => {
        const alphaAsymmetry = commonInfo?.Alpha_Asymmetry;
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
        const alphaBetaRatio = parseFloat(commonInfo?.Alpha_beta_ratio_value);
        if (alphaBetaRatio < 6.0) {
            return ' The ABR is low and will frequently accompany anxiety spectrum concerns and sleep disturbances.';
        }
        if (alphaBetaRatio > 12.0) {
            return ' Additionally, the ABR is quite elevated and will frequently accompany lower cognitive energy, daytime fatigue, and mood lability.';
        }
        return '';
    };

    const getPdrValueMessage = () => {
        const pdrValue = parseFloat(commonInfo?.pdr_value);
        const age = commonInfo?.pnt_age;
        const ageRanges = [
            { minAge: 0, maxAge: 10, thresholds: [10.0, 8.0] },
            { minAge: 10, maxAge: 45, thresholds: [12.0, 10.0] },
            { minAge: 45, maxAge: 55, thresholds: [12.0, 9.5] },
            { minAge: 55, maxAge: 65, thresholds: [12.0, 9.0] },
            { minAge: 65, maxAge: Infinity, thresholds: [12.0, 8.5] },
        ];

        const range = ageRanges.find((r) => age >= r.minAge && age < r.maxAge);
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
        const pafValue = parseFloat(commonInfo?.paf_value);
        if (commonInfo?.interpretationmakers?.some((marker) => marker?.markername === 'Mu Rhythm Present' && (marker?.eyeopen === 'true' || marker?.eyeclosed === 'true'))) {
            if (pafValue >= 7.0 && pafValue <= 15.0) {
                return ' Finally, there is a mu rhythm present in this recording, which is commonly associated with ASD and ADHD populations. Clinically, this often accompanies social anxiety and social cognitive processing deficits. In some populations, including youth and the elderly, this may be considered a normal variant.';
            }
        }
        return '';
    };

    useEffect(() => {
        if (intFields && intFields?.data) {
            setIntContent(intFields?.data?.description);
        }
    }, [intFields]);

    useEffect(() => {
        if (resultInfo && resultInfo?.req_info) {
            const isMedicationDataAvailable = resultInfo?.req_info?.medication_data?.medications_past?.length > 0 || resultInfo?.req_info?.medication_data?.medications_present?.length > 0;
            setIsMedicationPast(isMedicationDataAvailable);
        }
    }, [resultInfo]);
    useEffect(() => {
        // Combine all messages into a single HTML string
        const theta = getThetaBetaRatioMessage();
        const alpha = getAlphaAsymmetryMessage();
        const alphabeta = getAlphaBetaRatioMessage();
        const pdr = getPdrValueMessage();
        const murh = getMuRhythmMessage();
        const medicPast = isMedicationPast ? 'Medications may normalize an otherwise abnormal EEG.' : '';
        const comb = theta + alpha + alphabeta + pdr + murh + medicPast;
        const final = `The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms.${comb}
Careful clinical correlation is advised. A follow-up qEEG is recommended
after therapeutic interventions to objectively assess treatment efficacy and monitor any changes in brain function.`

        if (!intFields?.data) {
            setIntContent(final);
        }
    }, [commonInfo, isMedicationPast, intFields]);

    const changeContent = (e: any) => {
        if (type === '1') {
            setContent(e);
        } else if (type === '2') {
            setIntContent(e);
        } else if (type === '3') {
            setNeuroEC(e);
        } else {
            setAdjContent(e);
        }
    };
    useEffect(() => {
        if (successmsg) {
            message.success('Recording analysis saved successfully');
            setShowSuccessmsg(false);
            closeModal();
            callbackFunc();
        }
        if (errormsg) {
            if (error1?.data) {
                message.error(error1?.data);
            } else {
                message.error("Recording analysis couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg1) {
            message.success('Interpretation saved successfully');
            setShowSuccessmsg1(false);
            closeModal();
            callbackFunc();
        }
        if (errormsg1) {
            if (error3?.data) {
                message.error(error3?.data);
            } else {
                message.error("Interpretation couldn't be saved");
            }
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    useEffect(() => {
        if (successmsg2) {
            message.success('Neurofeedback saved successfully');
            setShowSuccessmsg2(false);
            closeModal();
            callbackFunc();
        }
        if (errormsg2) {
            if (error7?.data) {
                message.error(error7?.data);
            } else {
                message.error("Neurofeedback couldn't be saved");
            }
            setShowErrormsg2(false);
        }
    }, [successmsg2, errormsg2]);

    useEffect(() => {
        if (successmsg3) {
            message.success('Adjunct saved successfully');
            setShowSuccessmsg3(false);
            closeModal();
            callbackFunc();
        }
        if (errormsg3) {
            if (error9?.data) {
                message.error(error9?.data);
            } else {
                message.error("Adjunct couldn't be saved");
            }
            setShowErrormsg3(false);
        }
    }, [successmsg3, errormsg3]);

    return (
        <div>
            <Modal
                title={type === '1' ? 'Recording Analysis & Procedures' : type === '2' ? 'Interpretation of findings' : type === '3' ? 'Neurofeedback Recommendations' : 'Adjunct Therapies'}
                confirmLoading={loading1 || loading3 || loading7 || loading9}
                width={800}
                okText="Save"
                open={openModal}
                onCancel={() => closeModal()}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
                onOk={type === '1' ? submitForm : type === '2' ? submitIntForm : type === '3' ? submitNeuroForm : submitAdjForm}
            >
                <Spin spinning={loading || loading2 || loading6 || loading8}>
                    {type == '3' ? <h6 className="text-dark">With Eyes Closed Condition</h6> : ''}
                    <JoditEditor ref={recEditor} value={type === '1' ? content : type === '2' ? intContent : type === '3' ? neuroEC : adjContent}
                        // onChange={(e) => changeContent(e)}
                        onBlur={(newContent) => changeContent(newContent)}
                        config={{
                            width: "100%",
                            style: { overflowX: "hidden", wordBreak: "break-word" },
                        }} />
                    {type == '3' ? <h6 className="mt-4 text-dark">With Eyes Opened Condition</h6> : ''}
                    {type === '3' ? <JoditEditor ref={neuroEditor} value={neuroEO}
                        // onChange={(e) => setNeuroEO(e)}
                        onBlur={(newContent) => setNeuroEO(newContent)}
                        config={{
                            width: "100%",
                            style: { overflowX: "hidden", wordBreak: "break-word" },
                        }} /> : ''}
                </Spin>
            </Modal>
        </div>
    );
};

export default RecAnalysisRichTextEditor;
