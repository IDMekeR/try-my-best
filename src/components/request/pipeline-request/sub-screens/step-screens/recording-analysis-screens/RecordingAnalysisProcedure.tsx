import { EditIcon } from 'assets/img/custom-icons';
import React, { useEffect, useState } from 'react';
import RecAnalysisRichTextEditor from '../modal/RecAnalysisRichTextEditor';
import { Spin, useDispatch, useSelector } from 'components/shared/AntComponent';
import { getAnalysisProcedures } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';

const RecordingAnalysisProcedure: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { recFields, loading1, loading, success1, error1 } = useSelector((state: any) => state.recAnalysis);

    const showModal = () => {
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    function getRecAnalysis() {
        dispatch(getAnalysisProcedures(location.state.id) as any);
    }
    useEffect(() => {
        getRecAnalysis();
    }, []);

    return (
        <div className="p-3 border h-100">
            <h6 className="text-dark fs-17">
                Recording Analysis and procedures
                <span className="report-edit-icon edit-icon text-success pointer" onClick={showModal}>
                    <EditIcon />
                </span>
            </h6>
            <Spin spinning={loading}>
                {recFields && recFields?.data ? (
                    <div className="fs-15 text-overflow" dangerouslySetInnerHTML={{ __html: recFields?.data?.description }}></div>
                ) : (
                    <p className="fs-15">
                        The electroencephalograph (EEG) was digitally recorded utilizing 19 electrodes with the International 10/20 System of electrode placement. Electrode impedances were
                        reduced to below 5 kohms. The EEG was recorded continuously in the awake state with eyes closed and eyes opened. The EEG has been visually inspected, and the artifact
                        was rejected utilizing EEG DataHub™ ICA and Components Artifactual Rejection System (CARS). The absolute and relative spectral analysis has been computed for each
                        task. When age-appropriate, the client`s data has been compared to the EEG DataHub™ qEEG database with AI consisting of over 10,000 studies in eyes opened and eyes
                        closed conditions. The output is displayed in tables and topographical maps. The output of magnitude, power, ratio, and coherence have been included. This analysis
                        and report are generated using EEG DataHub™ software and AI technology. A summary of findings, along with interpretation and recommendations, have been provided by
                        Dr. Steven Rondeau BCIA-EEG. A shared variance (connectivity) analysis may have been completed.
                    </p>
                )}
            </Spin>
            <RecAnalysisRichTextEditor openModal={openModal} closeModal={closeModal} type="1" callbackFunc={getRecAnalysis} />
        </div>
    );
};

export default RecordingAnalysisProcedure;
