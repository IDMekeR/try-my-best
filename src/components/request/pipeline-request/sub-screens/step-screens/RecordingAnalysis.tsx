import React from 'react';
import { Tabs, useDispatch } from 'components/shared/AntComponent';
import Diagnosis from './recording-analysis-screens/Diagnosis';
import RecordingAnalysisProcedure from './recording-analysis-screens/RecordingAnalysisProcedure';
import SummaryFindings from './recording-analysis-screens/SummaryFindings';
import InterpretationFindings from './recording-analysis-screens/InterpretationFindings';
import NeurofeedbackRecommendation from './recording-analysis-screens/NeurofeedbackRecommendation';
import AdjunctTherapy from './recording-analysis-screens/AdjunctTherapy';
import PossibleSupplementation from './recording-analysis-screens/PossibleSupplementation';
import LifestyleIntervention from './recording-analysis-screens/LifestyleIntervention';
import RecommendedMedication from './recording-analysis-screens/RecommendedMedication';
import Symptoms from './recording-analysis-screens/Symptoms';
import { useLocation } from 'react-router-dom';
import { getAssociateCommon } from 'services/actions/commonServiceAction';

const RecordingAnalysis: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const items = [
        { label: 'Diagnosis', key: '1', children: <Diagnosis /> },
        { label: 'Symptoms', key: '2', children: <Symptoms /> },
        { label: 'Recording and analysis procedures', key: '3', children: <RecordingAnalysisProcedure /> },
        { label: 'Summary of findings', key: '4', children: <SummaryFindings /> },
        { label: 'Interpretation of findings', key: '5', children: <InterpretationFindings /> },
        { label: 'Neurofeedback recommendations', key: '6', children: <NeurofeedbackRecommendation /> },
        { label: 'Adjunct therapies', key: '7', children: <AdjunctTherapy /> },
        { label: 'Possible appropriate supplementation', key: '8', children: <PossibleSupplementation /> },
        { label: 'Lifestyle interventions', key: '9', children: <LifestyleIntervention /> },
        { label: 'Recommended Medications', key: '11', children: <RecommendedMedication /> },
    ];
    
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }

    return (
        <div className="h-100">
            <div className="bg-white p-3 h-100">
                <h6 className="fs-17">Recording Analysis</h6>
                <div className="recording-analysis-tab">
                    <Tabs items={items} tabPosition="left" />
                </div>
            </div>
        </div>
    );
};

export default RecordingAnalysis;
