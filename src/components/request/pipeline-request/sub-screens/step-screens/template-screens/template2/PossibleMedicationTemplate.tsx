import React, { useState, useEffect } from 'react';
import {
    HighAlphaImg2, Overwhelm2, TreeImg1, TreeImg2, HighThetaImg2, HighBetaImg2, TreeTheta, TreeOverwhelm
} from 'components/shared/TemplateImages';
import background from 'assets/img/report-icons/background.png';
import { footerText, lifestyleText, pdrText, supplementText, url2 } from 'components/shared/CompVariables';
import { Image, message, Popconfirm, Tooltip, useDispatch, useSelector } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { getAssociateCommon, saveAssociateCommon } from 'services/actions/commonServiceAction';
import { useLocation } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import NfbPbmTemplate from './NfbPbmTemplate';

interface ChildProps {
    zoom: any;
    intEdit: boolean;
    released: boolean;
    isMedicationPast: boolean;
    glanceEdit: boolean;
    pdrEdit: boolean;
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
    handlePdrChange: () => void;
    handleGlanceChange: () => void;
    handleInterpretChange: () => void;
}

const PossibleMedicationTemplate: React.FC<ChildProps> = ({
    zoom,
    intEdit,
    released,
    isMedicationPast,
    glanceEdit,
    pdrEdit,
    medicEdit,
    suppEdit,
    suppEdit1,
    lyfEdit,
    lyfEdit1,
    nfbEdit,
    pbmEdit,
    handlePbmChange,
    handleNfbChange,
    handleSuppChange,
    handleSuppChange1,
    handleLyfChange,
    handleLyfChange1,
    handleMedicChange,
    handlePdrChange,
    handleGlanceChange,
    handleInterpretChange,
}) => {
    const { commonInfo, loading6, success6, error6 } = useSelector((state: any) => state.commonData);
    const { resultInfo} = useSelector((state: any) => state.wizard);
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
    const [medicOptions,setMedicOptions]: any = useState([])
    const selectedMedic = commonInfo?.medic_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    useEffect(() => {
        const val: any = [];
        if (commonInfo?.medic_templ) {
            commonInfo?.medic_templ.forEach((item) => {
                if (item.ischoices === false && item.medication_name!='' && item.medication_name!=null) {
                    const autotxt = 'recommended';
                    val.push({
                        label: (
                            <>
                                <span className="pe-0">{item.medication_name}</span>
                                {item.is_automate && <span className="bg-lightprimary ms-2 px-2 py-1 rounded fw-bold fs-10 text-lowercase"> {autotxt}</span>}
                            </>
                        ),
                        value: item.id,
                        textLabel: item.medication_name + (item.is_automate ? ` ${autotxt}` : ''),
                    });
                }
            });
        }
        const arr: any = [];
        const myArray = commonInfo?.medic_templ;
        myArray?.forEach((item) => {
            if (item.ischoices === true) {
                arr.push({ name: item.medication_name, id: item.id, icon: item.filepath, desc: item.description, MdMedcRef: item.MdMedcRef });
            }
        });
        setMedicArr(arr);
        setMedicOptions(val);
        setMedicLength(arr.length);
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

    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }

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
                    const absurl =  item?.icon?.startsWith('https:') ? item?.icon : '';
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
        <div>
            {(commonInfo?.medicine_recommendatio_flag || commonInfo?.medicine_recommendatio_flag == null) && (
                <>
                    <div
                        className="page-two mt-2 bg-white mx-auto page border-0"
                        // number="4"
                        id="page113"
                        style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >
                        <div className="page-content">
                            <div className="d-flex  justify-content-between">
                                <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                    POSSIBLE APPROPRIATE MEDICATION
                                </h3>
                                <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Name:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Age:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? commonInfo?.pnt_age : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        DOB:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                        Date:
                                        <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                        </div>
                                    </h6>
                                </div>
                            </div>
                            <div style={{ borderBottom: '8px solid #3e4b69', width: '300px' }} />
                            <div className="page-body mt-4 px-4" style={{ textAlign: 'justify' }}>
                                <p className=" para" style={{ fontSize: '17px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    Based upon the individual&apos;s topographic maps, in consideration of database deviancies, known published references,
                                    internal studies, proprietary markers, and AI matching, the following recommendations are made for medications when clinically applicable.
                                    Please consult with your health care provider for appropriateness and possible interactions with current treatments. With conflicting qEEG patterns,
                                    single medication options may be difficult or contraindicated. Prediction accuracy is reduced without a complete medication washout.
                                </p>
                            </div>
                            <div className='page-head'>
                                <h4 className="text-dark text-center" style={{ fontFamily: 'RobotoMedium', fontWeight: 500,fontSize:'24px' }}>
                                    for your qeeg patterns, research supports:
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleMedicChange()}>
                                        <EditIcon />
                                    </span>
                                </h4>
                                {medicEdit ? (
                                    <div className=" border rounded p-3 mx-3">
                                        <div className='d-flex justify-content-between'>
                                            <label className="fs-16 d-flex justify-content-start">Select Recommended medication:</label>
                                            <p className="ms-auto w-auto para">
                                                <Tooltip title="close" className="mt-0">
                                                    <span className="pe-2 text-danger pointer" onClick={handleMedicChange}>
                                                        x
                                                    </span>
                                                </Tooltip>
                                            </p>
                                        </div>
                                        <div className="d-flex">
                                            <div className="col-md-10 ">
                                                <Select options={medicOptions} className="temp-input col-md-12 dropdown" mode="multiple" onChange={handleMedicSelect}
                                                maxCount={ selectedMedic?.length < 4
                                                    ? 4 - selectedMedic?.length 
                                                    : 0}
                                                />
                                                {medicLength >= 4 ? <div className="text-danger">Only 4 medications can be associated</div> : ''}
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
                                        <div className="row m-0 mt-2">
                                            {limitedMedicArr?.map((item: any) => {
                                                const img = base64Images?.[item.id] || '';
                                                return (
                                                    <div key={item.id} className="col-md-3 ps-0 my-2 pe-1">
                                                        <div className="d-flex p-2 rounded" style={{ background: '#dfe0e5' }}>
                                                            <div className="col-md-3">
                                                                <Image preview={false} src={img} height="30px" />
                                                            </div>
                                                            <div className="col fs-16">{item.name}</div>
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
                                    <div className="mt-4 row mx-0 approp-medic px-3">
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
                                                                <h4 className="text-dark my-auto" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                                    {item.name}
                                                                </h4>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-dark text-center my-2 match-txt" style={{ fontSize: '22px', fontWeight: 400, fontFamily: 'RobotoRegular' }}>
                                                        Why you matched
                                                    </h6>
                                                    <p className="col-md-11 mx-auto mb-2" style={{ fontSize: '15px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        {item.desc}
                                                    </p>
                                                    {item?.MdMedcRef?.slice(0, 2)?.map((itm: any, index: number) => {
                                                        return (
                                                            <p className="col-md-11 mx-auto mb-1" key={index} style={{ fontSize: '10px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
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
                        <div className="footer" style={{ width: '100%' }}>
                            <h6 className="footer-text text-start ps-0 mb-0 ps-2 pb-1 text-dark" style={{ marginTop: '2px', fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                            </h6>
                        </div>
                    </div>
                </>
            )}

            <NfbPbmTemplate
                zoom={zoom}
                intEdit={intEdit}
                handleInterpretChange={handleInterpretChange}
                isMedicationPast={isMedicationPast}
                glanceEdit={glanceEdit}
                released={false}
                handleGlanceChange={handleGlanceChange}
                pdrEdit={pdrEdit}
                handlePdrChange={handlePdrChange}
                medicEdit={medicEdit}
                handleMedicChange={handleMedicChange}
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
            />
        </div>
    )
}

export default PossibleMedicationTemplate;