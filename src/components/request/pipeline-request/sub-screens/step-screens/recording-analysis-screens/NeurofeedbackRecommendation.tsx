import { EditIcon } from 'assets/img/custom-icons';
import React, { useEffect, useState } from 'react';
import RecAnalysisRichTextEditor from '../modal/RecAnalysisRichTextEditor';
import { Spin, useDispatch, useSelector } from 'components/shared/AntComponent';
import { getAnalysisProcedures, getNeuroFeedback } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { createMarkup } from 'components/shared/CompVariables';

const NeurofeedbackRecommendation: React.FC = (props) => {
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { neuroFields, loading6 } = useSelector((state: any) => state.recAnalysis);

    const showModal = () => {
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    function getNeuro() {
        dispatch(getNeuroFeedback(location?.state?.id) as any);
    }
    useEffect(() => {
        getNeuro();
    }, []);

    return (
        <div className="p-3 border h-100">
            <h6 className="text-dark fs-17">
                Neurofeedback Recommendation
                <span className="report-edit-icon edit-icon text-success pointer" onClick={showModal}>
                    <EditIcon />
                </span>
            </h6>
            <div>
                <p className="fs-15 text-secondary fw-600">
                    Approx. 40 sessions amplitude training. Based upon the clinical information presented along with the individual`s topographic maps, sLORETA images and in consideration of
                    database deviancies, the following recommendations are made for neurofeedback training.
                </p>
            </div>
            <Spin spinning={loading6}>
                <p className="fs-15 text-secondary fw-600 mt-4 mb-1">With Eyes closed condition:</p>
                <div className='text-overflow' dangerouslySetInnerHTML={{ __html: neuroFields?.data?.neurofeedback_EC }}></div>
                <p className="fs-15 text-secondary fw-600 mt-5 pt-4 mb-1">With Eyes opened condition:</p>
                <div className='text-overflow' dangerouslySetInnerHTML={{ __html: neuroFields?.data?.neurofeedback_EO }}></div>
            </Spin>
            <RecAnalysisRichTextEditor openModal={openModal} closeModal={closeModal} type="3" callbackFunc={getNeuro} />
        </div>
    );
};

export default NeurofeedbackRecommendation;
