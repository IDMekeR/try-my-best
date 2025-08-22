import { EditIcon } from 'assets/img/custom-icons';
import React, { useState, useEffect } from 'react';
import RecAnalysisRichTextEditor from '../modal/RecAnalysisRichTextEditor';
import { createMarkup, useDispatch, useSelector } from 'components/shared/CompVariables';
import { useLocation } from 'react-router-dom';
import { getInterpretationFindings } from 'services/actions/pipeline/recordingAnalysisAction';

const InterpretationFindings: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { resultInfo } = useSelector((state: any) => state.wizard);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { intFields, loading2 } = useSelector((state: any) => state.recAnalysis);
    const [openModal, setOpenModal] = useState(false);
    const ageValue = commonInfo?.pnt_age || null;
    const alphaAsymmetry = commonInfo?.Alpha_Asymmetry;
    const pafValue = parseFloat(commonInfo?.paf_value);
    const thetaBetaRatio = parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec);
    const thetaBetaRatioEo = parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo);
    const alphaBetaRatio = parseFloat(commonInfo?.Alpha_beta_ratio_value);
    const pdrValue = parseFloat(commonInfo?.pdr_value);
    const age = commonInfo?.pnt_age;
    const [isMedicationPast, setIsMedicationPast] = useState(false);

    const showModal = () => {
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    function getInterpretContent() {
        dispatch(getInterpretationFindings(location?.state?.id) as any);
    }
    useEffect(() => {
        if (resultInfo && resultInfo?.req_info) {
            const isMedicationDataAvailable = resultInfo?.req_info?.medication_data?.medications_past?.length > 0 || resultInfo?.req_info?.medication_data?.medications_present?.length > 0;
            setIsMedicationPast(isMedicationDataAvailable);
        }
    }, [resultInfo]);
    useEffect(() => {
        getInterpretContent();
    }, []);
    const getThetaBetaRatioMessage = () => {
        const results: any = [];
    
        if (thetaBetaRatio >= 3.0) {
            results.push('  The TBR is elevated and regularly presents with symptoms of ADHD, including distractibility, inattentiveness, and lowered impulse control.');
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
        if (commonInfo?.interpretationmakers?.some((marker: any) => marker?.markername === 'Mu Rhythm Present' && (marker?.eyeopen === 'true' || marker?.eyeclosed === 'true'))) {
            if (pafValue >= 7.0 && pafValue <= 15.0) {
                return ' Finally, there is a mu rhythm present in this recording, which is commonly associated with ASD and ADHD populations. Clinically, this often accompanies social anxiety and social cognitive processing deficits. In some populations, including youth and the elderly, this may be considered a normal variant.';
            }
        }
        return '';
    };

    return (
        <div className="p-3 border h-100">
            <h6 className="text-dark fs-17">
                Interpretation of findings
                <span className="report-edit-icon edit-icon text-success pointer" onClick={showModal}>
                    <EditIcon />
                </span>
            </h6>
            <div>
                <p className="fs-15 text-secondary fw-600">The quantitative EEG topographical analysis demonstrates trends consistent with reported clinical symptoms of</p>
                <div className="h-75 p-2 mb-3">
                    {intFields && intFields?.data ? (
                        <div className="fs-15 markuphtml text-overflow" dangerouslySetInnerHTML={{ __html: intFields?.data?.description }}></div>
                    ) : (
                        <p className="fs-15">
                            The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms.
                            {getThetaBetaRatioMessage()}
                            {getAlphaAsymmetryMessage()}
                            {getAlphaBetaRatioMessage()}
                            {getPdrValueMessage()}
                            {getMuRhythmMessage()}
                            {isMedicationPast ? ' Medications may normalize an otherwise abnormal EEG. ' : ''}
                            Careful clinical correlation is advised. A follow-up qEEG is recommended after therapeutic interventions to objectively assess treatment efficacy and monitor any
                            changes in brain function.
                        </p>
                    )}
                </div>
                <p className="fs-15 text-secondary fw-600">
                    While there are numerous aberrant patterns present, healthy adaptive strategies, skills, and environments may allow for great success in a variety of settings. Treatments
                    addressing specific presenting concerns should account for patterns reflective of symptomatology. Repeat testing may be done to monitor treatment progress.
                </p>
            </div>
            <RecAnalysisRichTextEditor openModal={openModal} closeModal={closeModal} type="2" callbackFunc={getInterpretContent} />
        </div>
    );
};

export default InterpretationFindings;
