import React, { useState, useRef, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import { Button } from 'components/shared/ButtonComponent';
import { message, Spin } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { useLocation } from 'react-router-dom';
import { savePdrInfo } from 'services/actions/pipeline/recordingAnalysisAction';

interface ChildProps {
    pdrCallbackFunc: () => void;
}

const PdrEditor: React.FC<ChildProps> = ({ pdrCallbackFunc }) => {
    const pdrEditor = useRef(null);
    const location = useLocation();
    const dispatch = useDispatch();
    const { pdrInfo, loading5, success5, error5, loading4 } = useSelector((state: any) => state.recAnalysis);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const [content, setContent] = useState('');
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success5 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error5 : false;

    useEffect(() => {
        if (commonInfo && !pdrInfo?.data?.description) {
            setContent(`  Alpha is the baseline rhythm of the brain. It should have the greatest amplitude at the back of the head. Alpha should peak posteriorly between
                                        ${
                                            commonInfo?.pnt_age < 10
                                                ? '8-10Hz. '
                                                : commonInfo?.pnt_age >= 10 && commonInfo?.pnt_age < 45
                                                  ? '10-12Hz. '
                                                  : commonInfo?.pnt_age >= 45 && commonInfo?.pnt_age < 55
                                                    ? '9.5-12Hz. '
                                                    : commonInfo?.pnt_age >= 55 && commonInfo?.pnt_age < 65
                                                      ? '9-12Hz. '
                                                      : commonInfo?.pnt_age >= 65 && commonInfo?.pnt_age < 75
                                                        ? '8.5-12Hz. '
                                                        : commonInfo?.pnt_age >= 75
                                                          ? ' 8-12Hz. '
                                                          : ''
                                        }Your PDR is ${commonInfo?.pdr_value}`);
        }
    }, [commonInfo]);

    useEffect(() => {
            if (pdrInfo && pdrInfo?.data) {
                setContent(pdrInfo?.data?.description);
            }
        }, []);

    const submitForm = () => {
        const inputJson = {
            sr_pdr: pdrInfo?.data?.id || 0,
            servicerequestid: location.state.id,
            description: content,
        };
        dispatch(savePdrInfo(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('PDR saved successfully');
            setShowSuccessmsg(false);
            pdrCallbackFunc();
        }
        if (errormsg) {
            if (error5?.data) {
                message.error(error5?.data);
            } else {
                message.error("PDR couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Spin spinning={loading4}>
                <JoditEditor ref={pdrEditor} value={content}
                //  onChange={(e) => setContent(e)} 
                onBlur={(newContent) => setContent(newContent)}
                config={{
                    width: "100%",
                    style: { overflowX: "hidden", wordBreak: "break-word" },
                }}
                 />
            </Spin>
            <div className="text-end">
                <Button type="primary" className="mt-2 mb-3" loading={loading5} onClick={submitForm}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default PdrEditor;
