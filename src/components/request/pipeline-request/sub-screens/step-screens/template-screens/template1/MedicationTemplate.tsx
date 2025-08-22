import React, { useEffect, useState } from 'react';
import { Template3Logo, HeaderIcon, RibbonIcon, InfoRoundIcon } from 'components/shared/TemplateImages';
import { footerText, url2 } from 'components/shared/CompVariables';
import { Image, message, Popconfirm, Tooltip } from 'components/shared/AntComponent';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import SupplementLifestyle from './SupplementLifestyle';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { EditIcon } from 'assets/img/custom-icons';
import { DeleteFilled } from '@ant-design/icons';
import { useLocation } from 'react-router-dom';
import { saveAssociateCommon } from 'services/actions/commonServiceAction';

interface ChildProps {
    zoom: any;
    medicEdit: boolean;
    suppEdit: boolean;
    suppEdit1: boolean;
    lyfEdit: boolean;
    lyfEdit1: boolean;
    nfbEdit: boolean;
    pbmEdit: boolean;
    handlePbmChange: () => void;
    handleNfbChange: () => void;
    handleSuppChange: () => void;
    handleSuppChange1: () => void;
    handleLyfChange: () => void;
    handleLyfChange1: () => void;
    handleMedicChange: () => void;
    getCommonService: () => void;
}
const MedicationTemplate: React.FC<ChildProps> = ({
    zoom,
    suppEdit,
    suppEdit1,
    lyfEdit,
    lyfEdit1,
    handleLyfChange,
    handleLyfChange1,
    handleSuppChange,
    handleSuppChange1,
    medicEdit,
    nfbEdit,
    pbmEdit,
    handlePbmChange,
    handleNfbChange,
    handleMedicChange,
    getCommonService,
}) => {
    const { commonInfo, loading6, success6, error6 } = useSelector((state: any) => state.commonData);
    const location = useLocation();
    const dispatch = useDispatch();
    const [medicArr, setMedicArr]: any = useState([]);
    const [medicLength, setMedicLength] = useState(0);
    const [selectedDiag, setSelectedDiag] = useState([]);
    const [unselectedDiag, setUnselectedDiag] = useState([]);
    const [base64Images, setBase64Images] = useState({});
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    //remove medication
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success6 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error6 : false;
    const medicOptions = commonInfo?.medic_templ
        ?.filter((item: any) => !item.ischoices && item.medication_name!='' && item.medication_name!=null)
        ?.map((item: any) => {
            return {
                label: (
                    <span>
                        {item.medication_name}
                        {item.is_automate ? <span className="bg-lightprimary ms-2 px-2 py-1 rounded fw-bold fs-10 text-lowercase">recommended</span> : ''}
                    </span>
                ),
                value: item.id?.toString(),
            };
        });
    useEffect(() => {
        if (commonInfo?.medic_templ) {
            let medic = [];
            const arr = commonInfo?.medic_templ?.filter((item: any) => item.ischoices);
            medic = arr;
            if (medic?.length > 0) {
                setMedicArr(medic);
                setMedicLength(medic.length);
            }
        }
    }, [commonInfo]);

    const handleMedicSelect = (e: any) => {
        const len = e.length + medicArr.length;
        setMedicLength(len);
        setSelectedDiag(e);
    };
    const saveMedicTemplate = () => {
        const inputJson = {
            service_request_id: location.state.id,
            diagnosis_tps: '',
            undiagnosis_tps: '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            medic_tmpl: selectedDiag?.toString() || '',
            unmedic_tmpl: '',
            nutritional_supplementation: '',
            unnutritional_supplementation: '',
            lifestyle_templ: '',
            unlifestyle_templ: '',
            medic_tmpl_size: 1,
            lifestyle_templ_size: 1,
            nutritional_supplementation_size: 1,
        };
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };
    const removeMedicTemplate = (id: any) => {
        const inputJson = {
            service_request_id: location.state.id,
            diagnosis_tps: '',
            undiagnosis_tps: '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            medic_tmpl: '',
            unmedic_tmpl: id?.toString() || '',
            nutritional_supplementation: '',
            unnutritional_supplementation: '',
            lifestyle_templ: '',
            unlifestyle_templ: '',
            medic_tmpl_size: 1,
            lifestyle_templ_size: 1,
            nutritional_supplementation_size: 1,
        };
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowSuccessmsg1(true);
        setShowErrormsg1(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Medication saved successfully');
            setShowSuccessmsg(false);
            getCommonService();
            handleMedicChange();
        }
        if (errormsg) {
            if (error6?.data) {
                message.error(error6?.data);
            } else {
                message.error("Medication couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg1) {
            message.success('Medication removed successfully');
            setShowSuccessmsg1(false);
            getCommonService();
            handleMedicChange();
        }
        if (errormsg1) {
            if (error6?.data) {
                message.error(error6?.data);
            } else {
                message.error("Medication couldn't be removed");
            }
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const promises = medicArr.map(async (item: any) => {
                    const absurl = item?.filepath?.startsWith('https:') ? item?.filepath : '';
                    const response = await fetch(absurl);
                    const blob = await response.blob();
                    const reader = new FileReader();

                    reader.onloadend = () => {
                        const base64String = reader.result;
                        setBase64Images((prevImages: any) => ({
                            ...prevImages,
                            [item.id]: base64String, // Use item.id as a key to uniquely identify images
                        }));
                    };

                    reader.readAsDataURL(blob);
                });

                // Wait for all promises to resolve
                await Promise.all(promises);
            } catch (error) {
                console.error('Error converting images to Base64:', error);
            }
        };

        fetchImages();
    }, [medicArr]);
    const limitedMedicArr = medicArr.slice(0, 4);
    return (
        <>
            {!commonInfo?.medicine_recommendatio_flag ? (
                ''
            ) : (
                <div id="page5" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                    <div className="page-content page-hd">
                        <div className="page-header d-flex">
                            <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                            <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                possible appropriate medication
                            </h5>
                            <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                        </div>
                        <div className="page-body page-hd">
                            <div className="mb-2 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                <div className="col-auto">
                                    <Image src={InfoRoundIcon} preview={false}  style={{ height: '130px', width: 'auto' }} />
                                </div>
                                <div className="col my-auto pe-2">
                                    <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px' }}>
                                        Based upon the individual`s topographic maps, in consideration of database deviancies, known published references, internal studies, proprietary
                                        markers, and AI matching, the following recommendations are made for medications when clinically applicable. Please consult with your health care
                                        provider for appropriateness and possible interactions with current treatments. With conflicting qEEG patterns, single medication options may be
                                        difficult or contraindicated. Prediction accuracy is reduced without a complete medication washout
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500,fontSize:'24px' }}>
                                    for your qeeg patterns, research supports:
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleMedicChange()}>
                                        <EditIcon />
                                    </span>
                                </h4>
                                {medicEdit ? (
                                    <div>
                                        <label className="fs-16">Select Recommended medication: </label>
                                        <div className="d-flex ">
                                            <div className="col-md-10 ">
                                                <Select options={medicOptions} className="temp-input col-md-12" mode="multiple" onChange={handleMedicSelect} />
                                                {medicLength >= 4 ? <div className="text-danger mt-3">Only 4 medications can be associated</div> : ''}
                                            </div>
                                            <Button
                                                type="primary"
                                                className="col-auto py-0 ms-2"
                                                onClick={saveMedicTemplate}
                                                loading={loading6}
                                                disabled={medicLength > 4 || medicArr?.length === 4}
                                            >
                                                Save
                                            </Button>
                                        </div>
                                        <div className="row m-0">
                                            {limitedMedicArr?.map((item: any) => {
                                                const img = base64Images?.[item.id] || '';
                                                return (
                                                    <div key={item.id} className="col-md-3 ps-0 my-2 pe-1">
                                                        <div className="d-flex p-2 rounded" style={{ background: '#dfe0e5' }}>
                                                            <div className="col-md-3">
                                                                <Image preview={false} src={img} height="30px" />
                                                            </div>
                                                            <div className="col fs-16">{item.medication_name}</div>
                                                            <div className="col-auto ms-auto my-auto">
                                                                <Popconfirm
                                                                    placement="topLeft"
                                                                    title="Are you sure to remove this medicine?"
                                                                    onConfirm={() => {
                                                                        removeMedicTemplate(item.id);
                                                                        setShowSuccessmsg1(true);
                                                                        setShowErrormsg1(true);
                                                                    }}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Tooltip title="Remove Medication" className="mt-0">
                                                                        <DeleteFilled className="fs-18 text-danger" />
                                                                    </Tooltip>
                                                                </Popconfirm>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-4 row mx-0  approp-medic">
                                        {limitedMedicArr?.map((item: any) => {
                                            const img = base64Images?.[item.id] || '';
                                            return (
                                                <div key={item.id} className="col-md-6 mb-2">
                                                    <div className="py-2" style={{ background: '#dfe0e5', borderTopRightRadius: '30px', borderBottomLeftRadius: '30px' }}>
                                                        <div className="row m-0 medic-imgs">
                                                            <div className="col-md-4 text-start">
                                                                <Image src={img} alt={item.medication_name} height="80px" className="me-auto" preview={false} />
                                                            </div>
                                                            <div className="col text-start my-auto">
                                                                <h4 className="text-dark my-auto fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500,fontSize:'24px' }}>
                                                                    {item.medication_name}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-dark text-center my-2 fs-20" style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize: '20px' }}>
                                                        Why you matched
                                                    </h6>
                                                    <p className="col-md-11 mx-auto mb-2 fs-14" style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize: '14px' }}>
                                                        {item.description}
                                                    </p>
                                                    {item.MdMedcRef?.slice(0, 2)?.map((itm: any, index: number) => {
                                                        return (
                                                            <p className="col-md-11 mx-auto mb-1 fs-8" key={index} style={{ fontFamily: 'RobotoRegular', fontSize: '8px' }}>
                                                                {itm.ref_name}
                                                            </p>
                                                        );
                                                    })}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="footer fs-12 ps-2 d-flex mt-auto w-100 pe-2" style={{ fontFamily: 'RobotoRegular' }}>
                            <div className="col-md-9 mt-auto" style={{ fontFamily: 'RobotoRegular' }}>
                                {footerText}
                            </div>
                            <div className="col-md-2 my-auto text-center pe-0">
                                <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                            </div> 
                        </div>
                    </div>
                </div>
            )}
            <SupplementLifestyle
                zoom={zoom}
                suppEdit={suppEdit}
                suppEdit1={suppEdit1}
                lyfEdit={lyfEdit}
                lyfEdit1={lyfEdit1}
                pbmEdit={pbmEdit}
                nfbEdit={nfbEdit}
                handleNfbChange={handleNfbChange}
                handlePbmChange={handlePbmChange}
                handleSuppChange={handleSuppChange}
                handleSuppChange1={handleSuppChange1}
                handleLyfChange={handleLyfChange}
                handleLyfChange1={handleLyfChange1}
                getCommonService={getCommonService}
            />
        </>
    );
};

export default MedicationTemplate;
