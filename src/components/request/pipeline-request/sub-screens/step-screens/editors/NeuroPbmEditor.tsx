import React, { useEffect, useRef, useState } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'components/shared/ButtonComponent';
import { pbmText, useDispatch, useSelector } from 'components/shared/CompVariables';
import { saveNeurofeedback } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { message, Spin } from 'components/shared/AntComponent';

interface ChildProps {
    getNeuro: () => void;
    handleNfbChange: () => void;
}

const NeuroPbmEditor: React.FC<ChildProps> = ({ getNeuro, handleNfbChange }) => {
    const nfbEditor = useRef(null);
    const nfbEditor1 = useRef(null);
    const dispatch = useDispatch();
    const location = useLocation();
    const { neuroFields, loading6, loading7, success7, error7 } = useSelector((state: any) => state.recAnalysis);
    const [content, setContent] = useState(``);
    const [content1, setContent1] = useState(``);
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success7 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error7 : false;

    useEffect(() => {
        if (neuroFields) {
            if (neuroFields?.data) {
                setContent(neuroFields?.data?.neurofeedback_EO);
                setContent1(neuroFields?.data?.neurofeedback_EC);
            }
        }
    }, [neuroFields]);

    const submitNeuroForm = () => {
        const inputJson = {
            sr_associate_neurofeedback: neuroFields?.data?.id || 0,
            service_request: location?.state?.id,
            description: null,
            neurofeedback_EO: content,
            neurofeedback_EC: content1,
        };
        dispatch(saveNeurofeedback(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Neurofeedback saved successfully');
            setShowSuccessmsg(false);
            getNeuro();
            handleNfbChange();
        }
        if (errormsg) {
            if (error7?.data) {
                message.error(error7?.data);
            } else {
                message.error("Neurofeedback couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);
    return (
        <div>
            <Spin spinning={loading6}>
                <div className="d-flex w-100">
                    <div className="col-md-6 pe-2 nfb-editor">
                        <JoditEditor ref={nfbEditor} className="nfb-eo" value={content}
                        //  onChange={(e) => setContent(e)}
                        onBlur={(newContent) => setContent(newContent)}
                        config={{
                            width: "100%",
                            style: { overflowX: "hidden", wordBreak: "break-word" },
                        }}
                        />
                    </div>
                    <div className="col-md-6 nfb-editor">
                        <JoditEditor ref={nfbEditor1} className="nfb-ec" value={content1}
                        // onChange={(e) => setContent1(e)}
                        onBlur={(newContent) => setContent1(newContent)}
                        config={{
                            width: "100%",
                            style: { overflowX: "hidden", wordBreak: "break-word" },
                        }}
                        />
                    </div>
                </div>
            </Spin>
            <div className="text-end mt-2">
                <Button type="primary" className="mt-2" loading={loading7} onClick={submitNeuroForm}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default NeuroPbmEditor;
