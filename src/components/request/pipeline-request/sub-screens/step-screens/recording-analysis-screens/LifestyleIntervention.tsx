import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { PlusCircleTwoTone } from 'components/shared/AntIcons';
import { message, Popconfirm, Spin, Tooltip } from 'components/shared/AntComponent';
import DiagnosisModal from '../modal/DiagnosisModal';
import { useLocation } from 'react-router-dom';
import { getAssociateCommon, saveAssociateCommon } from 'services/actions/commonServiceAction';

const LifestyleIntervention: React.FC = () => {
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
    const removeLifestyle = (id: any) => {
        const inputJson = {
            service_request_id: location.state?.id,
            diagnosis_tps: '',
            undiagnosis_tps: '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            lifestyle_templ: '',
            unlifestyle_templ: id?.toString() || '',
            medic_tmpl_size: '',
            lifestyle_templ_size: '',
            nutritional_supplementation_size: '',
            medic_tmpl: '',
            unmedic_tmpl: '',
            nutritional_supplementation: '',
            unnutritional_supplementation: id?.toString() === '1' ? '3' : id?.toString() === '2' ? '4' : id?.toString() === '3' ? '2' : id?.toString() === '4' ? '1' : '' ,
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
            message.success('Lifestyle removed successfully');
            setShowSuccessmsg(false);
            closeModal();
            getCommonService();
        }
        if (errormsg) {
            message.error("Lifestyle couldn't be removed");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div className="p-3 border h-100">
            <div className="d-flex mb-3 pb-1">
                <h6 className="text-dark fs-17 my-auto">Lifestyle Intervention</h6>
                <PlusCircleTwoTone twoToneColor="#5a53b2" className="ms-auto fs-18" onClick={showModal} />
            </div>
            <Spin spinning={loading5}>
                <div className="d-flex flex-wrap section-height">
                    {commonInfo?.lifestyle_templ && commonInfo?.lifestyle_templ?.some((item: any) => item.ischoices) ? (
                        commonInfo?.lifestyle_templ
                            ?.filter((item: any) => item.ischoices)
                            .map((item: any) => (
                                <div className="bg-lightorange px-3 me-1 mb-1 py-1 tags d-flex flex-wrap" key={item.id}>
                                    <div className="col me-3"> {item.lifestyle_name}</div>
                                    <div className="col-auto ms-auto pointer">
                                        <Popconfirm
                                            placement="topLeft"
                                            title="Are you sure to remove this lifestyle?"
                                            onConfirm={() => {
                                                removeLifestyle(item.id);
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <Tooltip title="Remove" className="mt-0">
                                                X
                                            </Tooltip>
                                        </Popconfirm>
                                    </div>
                                </div>
                            ))
                    ) : (
                        <div className="p-3 text-gray text-center bg-light mt-2 w-100 no-data">{loading5 ? 'Loading...' : 'No lifestyle associated with this request'}</div>
                    )}
                </div>
            </Spin>
            <DiagnosisModal openModal={openModal} closeModal={closeModal} getCommonService={getCommonService} type="4" />
        </div>
    );
};

export default LifestyleIntervention;
