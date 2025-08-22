import React, { useEffect, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'components/shared/ButtonComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { saveAnalysisProcedures } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { message, Spin } from 'components/shared/AntComponent';

interface ChildProps {
    recCallbackFunc: () => void;
}

const RecordingAnalysisEditor: React.FC<ChildProps> = ({ recCallbackFunc }) => {
    const recEditor = useRef(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const { recFields, loading1, loading, success1, error1 } = useSelector((state: any) => state.recAnalysis);
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;
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
    }, []);

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

    useEffect(() => {
        if (successmsg) {
            message.success('Recording analysis saved successfully');
            setShowSuccessmsg(false);
            recCallbackFunc();
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

    return (
        <div>
            <Spin spinning={loading}>
                <JoditEditor ref={recEditor} value={content}
                onBlur={(newContent) => setContent(newContent)}
                config={{
                    width: "100%",
                    style: { overflowX: "hidden", wordBreak: "break-word" },
                }}/>
            </Spin>
            <div className="text-end">
                <Button type="primary" className="mt-2" loading={loading1} onClick={submitForm}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default RecordingAnalysisEditor;
