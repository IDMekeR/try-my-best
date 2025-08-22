import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { PlusCircleTwoTone } from 'components/shared/AntIcons';
import { message, Popconfirm, Spin, Tooltip } from 'components/shared/AntComponent';
import DiagnosisModal from '../modal/DiagnosisModal';
import { useLocation } from 'react-router-dom';
import { getAssociateCommon, saveAssociateCommon } from 'services/actions/commonServiceAction';

const Diagnosis: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const [openModal, setOpenModal] = useState(false);
    const { commonInfo, loading5, success6, error6 } = useSelector((state: any) => state.commonData);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;

    const showModal = () => {
        setOpenModal(true);
    };
    const closeModal = () => {
        setOpenModal(false);
    };

    const removeDiagnosis = (id: any) => {
        const inputJson = {
            service_request_id: location.state?.id,
            diagnosis_tps: '',
            undiagnosis_tps: id?.toString() || '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            medic_tmpl_size: '',
            lifestyle_templ_size: '',
            nutritional_supplementation_size: '',
            medic_tmpl: '',
            unmedic_tmpl: '',
            lifestyle_templ: '',
            unlifestyle_templ: '',
            nutritional_supplementation: '',
            unnutritional_supplementation: '',
        };
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }
    useEffect(() => {
        if (successmsg) {
            message.success('Diagnosis removed successfully');
            setShowSuccessmsg(false);
            closeModal();
            getCommonService();
        }
        if (errormsg) {
            message.error("Diagnosis couldn't be removed");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div className="p-3 border h-100">
            <div className="d-flex mb-3 pb-1">
                <h6 className="text-dark fs-17 my-auto">Diagnosis</h6>
                <PlusCircleTwoTone twoToneColor="#5a53b2" className="ms-auto fs-18" onClick={showModal} />
            </div>
            <Spin spinning={loading5}>
                <div className="d-flex flex-wrap">
                    {commonInfo?.diagnosis && commonInfo?.diagnosis?.some((item: any) => item.ischoices) ? (
                        commonInfo?.diagnosis
                            ?.filter((item: any) => item.ischoices)
                            .map((item: any) => (
                                <div className="bg-lightorange px-3 me-1 mb-1 py-1 tags d-flex flex-wrap" key={item.id}>
                                    <div className="col me-3">{item.diagnosis_name}</div>
                                    <div className="col-auto ms-auto pointer">
                                        <Popconfirm
                                            placement="topLeft"
                                            title="Are you sure to remove this diagnosis?"
                                            onConfirm={() => {
                                                removeDiagnosis(item.id);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Tooltip title="Remove" className="mt-0 text-gray">
                                                x
                                            </Tooltip>
                                        </Popconfirm>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="p-3 mt-2 text-gray text-center bg-light h-100 w-100">{loading5 ? 'Loading...' : 'No diagnosis associated with this request'}</div>
                    )}
                </div>
            </Spin>
            <DiagnosisModal openModal={openModal} closeModal={closeModal} getCommonService={getCommonService} type="1" />
        </div>
    );
};

export default Diagnosis;
