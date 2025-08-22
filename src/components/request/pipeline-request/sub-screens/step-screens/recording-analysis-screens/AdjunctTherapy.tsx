import { EditIcon } from 'assets/img/custom-icons';
import React, { useEffect, useState } from 'react';
import RecAnalysisRichTextEditor from '../modal/RecAnalysisRichTextEditor';
import { Spin, useDispatch, useSelector } from 'components/shared/AntComponent';
import { getAdjunct, getAnalysisProcedures } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';

const AdjunctTherapy: React.FC = () => {
    const [openModal, setOpenModal] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const { adjunctFields, loading8 } = useSelector((state: any) => state.recAnalysis);

    const showModal = () => {
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };
    function getAdjunctData() {
        dispatch(getAdjunct(location?.state?.id) as any);
    }
    useEffect(() => {
        getAdjunctData();
    }, []);

    console.log("adju", adjunctFields);
    return (
        <div className="p-3 border h-100">
            <h6 className="text-dark fs-17">
                Adjunct Therapies
                <span className="report-edit-icon edit-icon text-success pointer" onClick={showModal}>
                    <EditIcon />
                </span>
            </h6>
            <div>
                <p className="fs-15 text-secondary fw-600">
                    Based upon individual`s topographic maps, sLORETA images, in consideration of database deviancies and known published references, the following recommendations are made
                    for medications and supplementation when applicable.
                </p>
            </div>
            <Spin spinning={loading8}>
                {adjunctFields?.data?
                <div className='text-overflow' dangerouslySetInnerHTML={{ __html: adjunctFields?.data?.description }}></div>:
                <div className="p-3 text-gray text-center bg-light w-100 d-flex justify-content-center align-items-center">
                {loading8 ? 'Loading...' : 'No adjunct therapies found'}
            </div>}
            </Spin>
            <RecAnalysisRichTextEditor openModal={openModal} closeModal={closeModal} type="4" callbackFunc={getAdjunctData} />
        </div>
    );
};

export default AdjunctTherapy;
