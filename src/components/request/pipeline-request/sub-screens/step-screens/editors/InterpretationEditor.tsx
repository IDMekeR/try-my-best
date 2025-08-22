import React, { useEffect, useMemo, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'components/shared/ButtonComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { saveInterpretFindings } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { message, Spin, Tooltip } from 'components/shared/AntComponent';

interface ChildProps {
    intCallbackFunc: () => void;
    isMedicationPast: boolean;
}

const InterpretationEditor: React.FC<ChildProps> = ({ intCallbackFunc, isMedicationPast }) => {
    const intEditor = useRef<any>(null);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const dispatch = useDispatch();
    const location = useLocation();
    const { intFields, loading2, loading3, success3, error3 } = useSelector((state: any) => state.recAnalysis);
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;
    const [content, setContent] = useState(``);
    const [charCount, setCharCount] = useState<number>(0);
    const maxCharCount = 2900;

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
        if (intFields && intFields?.data && intFields?.data?.description !== '<p><br></p>' && intFields?.data?.description !== '<p></p>') {
            setContent(intFields?.data?.description);
        } else {
            const theta = getThetaBetaRatioMessage();
            const alpha = getAlphaAsymmetryMessage();
            const alphabeta = getAlphaBetaRatioMessage();
            const pdr = getPdrValueMessage();
            const murh = getMuRhythmMessage();
            const medicPast = isMedicationPast ? ' Medications may normalize an otherwise abnormal EEG.' : '';
            const comb = theta + alpha + alphabeta + pdr + murh + medicPast;
            const final = `The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms.&nbsp ${comb}
    Careful clinical correlation is advised. A follow-up qEEG is recommended
    after therapeutic interventions to objectively assess treatment efficacy and monitor any changes in brain function.`
            setContent(final);
        }
    }, [commonInfo, isMedicationPast, intFields]);

    const submitForm = () => {
        const inputJson = {
            sr_associate_interpretation: intFields?.data?.id || 0,
            service_request: location.state.id,
            description: content,
        };

        dispatch(saveInterpretFindings(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Interpretation of findings saved successfully');
            setShowSuccessmsg(false);
            intCallbackFunc();
        }
        if (errormsg) {
            if (error3?.data) {
                message.error(error3?.data);
            } else {
                message.error("Interpretation of findings couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);
   
    useEffect(() => {
       
        const theta = getThetaBetaRatioMessage();
        const alpha = getAlphaAsymmetryMessage();
        const alphabeta = getAlphaBetaRatioMessage();
        const pdr = getPdrValueMessage();
        const murh = getMuRhythmMessage();
        const comb = theta + alpha + alphabeta + pdr + murh;
        const final = `The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms. ${comb}${isMedicationPast ? 'Medications may normalize an otherwise abnormal EEG.' : ''}
        Careful clinical correlation is advised. A follow-up qEEG is recommended
        after therapeutic interventions to objectively assess treatment efficacy and monitor any changes in brain function.`
        if (!intFields?.data) {
            setContent(final);
           
        } else if (intFields?.data && intFields?.data?.description == '<p><br></p>' && intFields?.data?.description == '<p></p>') {
            setContent(final);
        }
    }, [commonInfo, isMedicationPast, intFields]);

    const updateCharCount = (newContent: string) => {
        const plainText = newContent.replace(/<[^>]*>/g, ''); // Remove HTML tags
        setCharCount(plainText.length); // Set character count
    };
     
    const handleChange = (newContent: string) => {
        updateCharCount(newContent); // Update character count
    };

    const handleBlur = () => {
        if (intEditor?.current) {
            setContent(intEditor?.current.value); // Update content when focus is lost
        }
    };

    useEffect(() => {
        if (content) {
          updateCharCount(content); // Initialize character count on load
        }
    }, [content]);

    const config = useMemo(() => ({
        height: 350,
        width: "100%",
    }), [content]);

    return (
        <div className='interpretation-editor'>
            <Spin spinning={loading2}>
                <JoditEditor ref={intEditor} value={content} config={config}
                    onChange={handleChange}
                    onBlur={handleBlur} 
                    // onChange={(e) => setContent(e)}
                    // onBlur={(newContent) => setContent(newContent)}
                // config={{
                //     width: "100%",
                //     style: { overflowX: "hidden", wordBreak: "break-word" },
                // }}
                />
                <div className='d-flex justify-content-end'>
                    <strong>Character Count: </strong> {charCount} / 2900
                </div>
                {
                    charCount > maxCharCount &&
                    <div className="text-warn fw-bold mb-2 bg-lightorange px-3 py-1 text-center">
                        Content exceeds the maximum allowed length of <strong>2900</strong> characters.
                    </div>
                }
            </Spin>
            <div className="text-end mb-5">
                <Tooltip title={charCount > maxCharCount ? "The character count exceeds the maximum limit of 2900 characters." : ''}>
                    <Button type="primary" className="mt-2" loading={loading3} disabled={charCount > maxCharCount} onClick={submitForm}>
                        Save
                    </Button>
                </Tooltip>
            </div>
        </div>
    );
};

export default InterpretationEditor;
