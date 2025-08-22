import React, { useEffect, useState } from 'react';
import {
    HighAlphaImg2, Overwhelm2, TreeImg1, TreeImg2, HighThetaImg2, HighBetaImg2, TreeTheta, TreeOverwhelm,
    HighThetaChart, OverwhelmChart, HighBetaChart, ExcessAlphaChart
} from 'components/shared/TemplateImages';
import background from 'assets/img/report-icons/background.png';
import { footerText, lifestyleText, pdrText, supplementText } from 'components/shared/CompVariables';
import { Divider, Image, message, Popconfirm, Tooltip, useDispatch, useSelector } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { saveAssociateCommon } from 'services/actions/commonServiceAction';
import { useLocation } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import PossibleMedicationTemplate from './PossibleMedicationTemplate';
import { getAssociateCommon } from 'services/actions/commonServiceAction';

type ItemType = { value: string };

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

const SupplementationLifestyle: React.FC<ChildProps> = ({
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
    const userRole = sessionStorage.getItem('role');
    const [selectedSupp, setSelectedSupp]: any = useState('');
    const [selectedSupp1, setSelectedSupp1]: any = useState('');
    const [selectedLyf, setSelectedLyf]: any = useState('');
    const [selectedLyf1, setSelectedLyf1]: any = useState('');
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    const [tempType, setTempType] = useState('');
    const [suppArr, setSuppArr]: any = useState([]);
    const [suppTemp, setSuppTemp]: any = useState([]);
    const [lyfTemp, setLyfTemp]: any = useState([]);
    const [lyfArr, setLyfArr]: any = useState([]);

    const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    useEffect(() => {
        if (commonInfo) {
            const val: any = [],
                val1: any = [],
                val2: any = [];
            const temp: any = [],
                temp1: any = [],
                temp2: any = [],
                temp3: any = [];
            let d: any = '',
                d1: any = '',
                d2: any = '',
                d3: any = '';
            let count: any = 0,
                count1: any = 0;
            setSelectedSupp('');
            setSelectedSupp1('');
            setSelectedLyf('');
            setSelectedLyf1('');

            if (commonInfo?.mdnutritional_supplementation_templ) {
                commonInfo?.mdnutritional_supplementation_templ?.forEach((item: any) => {
                    const autotxt = 'recommended';
                    val1.push({
                        label: (
                            <>
                                <span className="pe-0">{capitalizeFirstLetter(item.nutritional_supplementation_name)}</span>
                                {item.is_automate && <span className="bg-lightprimary ms-2 px-2 py-1 rounded fw-bold fs-10 text-lowercase"> {autotxt}</span>}
                            </>
                        ),
                        value: item.id?.toString(),
                    });
                    if (item.ischoices == true) {
                        count++;
                        if (count == 1) {
                            setSelectedSupp(item.id);
                            d = item.id;
                        } else {
                            setSelectedSupp1(item.id);
                            d1 = item.id;
                        }
                    }
                });
            }
            if (commonInfo?.lifestyle_templ) {
                commonInfo?.lifestyle_templ?.forEach((item: any) => {
                    const autotxt = 'recommended';
                    val2.push({
                        label: (
                            <>
                                <span className="pe-0">{capitalizeFirstLetter(item.lifestyle_name)}</span>
                                {item.is_automate && <span className="bg-lightprimary ms-2 px-2 py-1 rounded fw-bold fs-10 text-lowercase"> {autotxt}</span>}
                            </>
                        ),
                        value: item.id,
                    });
                    if (item.ischoices == true) {
                        count1++;
                        if (count1 == 1) {
                            setSelectedLyf(item.id);
                            d2 = item.id;
                        } else {
                            setSelectedLyf1(item.id);
                            d3 = item.id;
                        }
                    }
                });
            }

            if (val1.length > 0) {
                val1.forEach((item) => {
                    if (item.value != d) {
                        temp.push(item);
                    }
                    if (item.value != d1) {
                        temp1.push(item);
                    }
                });
            }
            if (val2.length > 0) {
                val2.forEach((item) => {
                    if (item.value != d2) {
                        temp2.push(item);
                    }
                    if (item.value != d3) {
                        temp3.push(item);
                    }
                });
            }

            setSuppTemp(temp);
            setSuppArr(temp1);
            setLyfTemp(temp3);
            setLyfArr(temp2);
        }
    }, [commonInfo]);

    function getCommonService() {
        const inputJson = {
            service_request_id: location?.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }

    useEffect(() => {
        if (commonInfo?.mdnutritional_supplementation_templ) {
            let count = 0;
            setSelectedSupp('');
            setSelectedSupp1('');
            commonInfo?.mdnutritional_supplementation_templ?.forEach((item: any) => {
                if (item.ischoices) {
                    count++;
                    if (count === 1) {
                        setSelectedSupp(item.id?.toString());
                    } else {
                        setSelectedSupp1(item.id?.toString());
                    }
                }
            });
        }
    }, [commonInfo]);

    const handleSupplementChange = (val: any, e: any) => {
        if (val === '1') {
            setSelectedSupp(e);
            const value = e == '1' ? '4' : e == '2' ? '3' : e == '3' ? '1' : e == '4' ? '2' : '';
            setSelectedLyf(value)
        } else if (val === '2') {
            setSelectedSupp1(e);
            const value = e == '1' ? '4' : e == '2' ? '3' : e == '3' ? '1' : e == '4' ? '2' : '';
            setSelectedLyf1(value)
        } else if (val === '3') {
            setSelectedLyf(e);
            //  const value = e == 4 ? 1 : e == 3 ? 2 : e == 1 ? 3 : e == 2 ? 4 : ''
            const value = e == '4' ? '1' : e == '3' ? '2' : e == '1' ? '3' : e == '2' ? '4' : '';
            setSelectedSupp(value);
        } else {
            setSelectedLyf1(e)
            //  const value = e == 4 ? 1 : e == 3 ? 2 : e == 1 ? 3 : e == 2 ? 4 : ''
            const value = e == '4' ? '1' : e == '3' ? '2' : e == '1' ? '3' : e == '2' ? '4' : '';
            setSelectedSupp1(value);
        }
    };

    const saveSupplyfTemplate = (id: any) => {
        const inputJson = {
            service_request_id: location.state.id,
            diagnosis_tps: '',
            undiagnosis_tps: '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            medic_tmpl: '',
            unmedic_tmpl: '',
            nutritional_supplementation: selectedSupp?.toString() + ',' + selectedSupp1?.toString(),
            unnutritional_supplementation: '',
            lifestyle_templ: selectedLyf?.toString() + ',' + selectedLyf1?.toString() || '',
            unlifestyle_templ: '',
            medic_tmpl_size: 1,
            lifestyle_templ_size: 1,
            nutritional_supplementation_size: 1,
        };
        if (id === 1 || id === 2) {
            setTempType('Supplement saved successfully');
        } else if (id === 3 || id == 4) {
            setTempType('Lifestyle saved successfully');
        }
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    const removeSupplyfTemplate = (id: any, val: any) => {
        const inputJson = {
            service_request_id: location.state.id,
            diagnosis_tps: '',
            undiagnosis_tps: '',
            symptoms_tps: '',
            unsymptoms_tps: '',
            medic_tmpl: '',
            unmedic_tmpl: '',
            nutritional_supplementation: '',
            unnutritional_supplementation: selectedSupp?.toString() || selectedSupp1?.toString() || '',
            lifestyle_templ: '',
            unlifestyle_templ: selectedLyf?.toString() || selectedLyf1?.toString() || '',
            medic_tmpl_size: 1,
            lifestyle_templ_size: 1,
            nutritional_supplementation_size: 1,
        };
        if (val === 1 || val === 2) {
            setTempType('Supplement removed successfully');
        } else if (val === 3 || val == 4) {
            setTempType('Lifestyle removed successfully');
        }
        if (val == '1') {
            setSelectedSupp('');
            setSelectedLyf('');
        } else if (val == '2') {
            setSelectedSupp1('');
            setSelectedLyf1('');
        } else if (val == '3') {
            setSelectedLyf('');
        } else if (val == '4') {
            setSelectedLyf1('');
        }
        dispatch(saveAssociateCommon(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success(tempType);
            setShowSuccessmsg(false);
            getCommonService()
            if (suppEdit) {
                handleSuppChange();
            } else if (suppEdit1) {
                handleSuppChange1();
            } else if (lyfEdit) {
                handleLyfChange();
            } else if (lyfEdit1) {
                handleLyfChange1();
            }
        }
        if (errormsg) {
            if (error6?.data) {
                message.error(error6?.data);
            } else {
                if (tempType === 'Supplement removed successfully') {
                    message.error("Supplement couldn't be removed");
                } else if (tempType === 'Lifestyle removed successfully') {
                    message.error("Lifestyle couldn't be saved");
                } else if (tempType == 'Supplement saved successfully') {
                    message.error("Supplement couldn't be saved");
                } else if (tempType === 'Lifestyle saved successfully') {
                    message.error("Lifestyle couldn't be saved");
                }
                message.error(`Supplementation couldn't be saved`);
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            {(commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null) && (
                <>
                {
                    released && !selectedSupp ? (
                        <div className="page-two mt-2 bg-white mx-auto" id="page109"> </div>
                    ) : (
                        <div className="page-two mt-2 bg-white mx-auto"
                        id="page109"
                        style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            <div className="page-content">
                                <div className="d-flex  justify-content-between">
                                    <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                        NUTRITIONAL SUPPLEMENTATION
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
                                            <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                                {commonInfo ? commonInfo?.pnt_age : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular' , fontWeight:500}}>
                                            DOB:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                                {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            Date:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                                {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                    </div>
                                </div>
                                <div style={{ borderBottom: '8px solid #3e4b69', width: '300px' }} />
                                <div className="page-body mt-4 px-4" style={{ textAlign: 'justify' }}>
                                    <p className=" para" style={{ fontSize: '17px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                        Based upon the individual&apos;s topographic maps, sLORETA images, in consideration of database deviancies, known published references, internal studies, proprietary markers, and AI
                                        matching, the following recommendations are made for supplementation when applicable. Consult with your health care provider for appropriateness and possible interactions with
                                        current treatments.
                                    </p>
                                </div>
                                <div className="page-body px-3 mt-5">
                                    <div className="text-center report-content page-head my-3">
                                        <h4 className="text-dark text-center " style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize:'24px' }}>
                                            {selectedSupp == '1'
                                                ? 'High Alpha'
                                                : selectedSupp == '2'
                                                    ? 'High Beta'
                                                    : selectedSupp == '3'
                                                        ? 'High Theta'
                                                        : selectedSupp == '4'
                                                            ? 'Overwhelm'
                                                            : '_________'}
                                            <span className="ps-1" style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize:'24px' }}>
                                                subtypes often respond well to:
                                            </span>
                                            
                                            {suppEdit || released || userRole === 'researcher' ? (
                                                ''
                                            ) : (
                                                <>
                                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={handleSuppChange}>
                                                        <EditIcon />
                                                    </span>
                                                    {selectedSupp !== '' ? (
                                                        <span className="report-edit-icon">
                                                            <Popconfirm
                                                                placement="topLeft"
                                                                title="Are you sure to remove this supplement?"
                                                                onConfirm={() => {
                                                                    removeSupplyfTemplate(selectedSupp, 1);
                                                                    setSelectedSupp('');
                                                                }}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Tooltip title="Remove" className="mt-0">
                                                                    <DeleteFilled className="text-danger fs-15" />
                                                                </Tooltip>
                                                            </Popconfirm>
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            )}
                                        </h4>
                                    </div>
                                    <div className="mt-0 w-100 justify-content-between suppImgCont" style={{ marginBottom: '50px', fontFamily: 'RobotoRegular' }}>
                                        {suppEdit ? (
                                            <div className="border rounded p-3">
                                                <div className='d-flex justify-content-between'>
                                                    <label className="fs-16">Select Nutritional supplementation: </label>
                                                    <p className="ms-auto w-auto para">
                                                        <Tooltip title="close" className="mt-0">
                                                            <span className="pe-2 text-danger pointer" onClick={()=>{
                                                            handleSuppChange()
                                                            setSelectedSupp('');
                                                            }}>
                                                                x
                                                            </span>
                                                        </Tooltip>
                                                    </p>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-md-6 ">
                                                        <Select options={suppArr} defaultValue={selectedSupp} className="temp-input w-100 dropdown" onChange={(e) => handleSupplementChange('1', e)} />
                                                    </div>
                                                    <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(1)} loading={loading6}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                {selectedSupp == '1' ? (
                                                    <Image preview={false}  src={HighAlphaImg2} width="auto" height="100%" />
                                                ) : selectedSupp == '2' ? (
                                                    <Image preview={false}  src={HighBetaImg2} width="auto" height="100%" />
                                                ) : selectedSupp == '3' ? (
                                                    <Image preview={false}  src={HighThetaImg2} width="auto" height="100%" />
                                                ) : selectedSupp == '4' ? (
                                                    <Image preview={false}  src={Overwhelm2} width="auto" height="100%" />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="footer" style={{ textAlign: 'center' }}>
                                <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '10px', fontWeight:500 }}>
                                    Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                                </h6>
                            </div>
                        </div>
                    )
                }
                {
                    released && !selectedSupp1 ? (
                        <div className="page-two mt-2 bg-white mx-auto" id="page110"> </div>
                    ) : (
                        <div className="page-two mt-2 bg-white mx-auto"
                            id="page110"
                            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            <div className="page-content page-head">
                                <div className="d-flex  justify-content-between">
                                    <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                        NUTRITIONAL SUPPLEMENTATION
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
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                                {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                    </div>
                                </div>
                                <div style={{ borderBottom: '8px solid #3e4b69', width: '300px' }} />
                                <div className="page-body mt-4 px-4" style={{ textAlign: 'justify' }}>
                                    <p className=" para" style={{ fontSize: '17px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                        Based upon the individual&apos;s topographic maps, sLORETA images, in consideration of database deviancies, known published references, internal studies, proprietary markers, and AI
                                        matching, the following recommendations are made for supplementation when applicable. Consult with your health care provider for appropriateness and possible interactions with
                                        current treatments.
                                    </p>
                                </div>
                                <div className="page-body px-3 mt-5">
                                    <div className="text-center report-content my-3">
                                        <h4 className="text-dark text-center" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 , fontSize:'24px'}}>
                                            {selectedSupp1 == '1'
                                                ? 'High Alpha'
                                                : selectedSupp1 == '2'
                                                    ? 'High Beta'
                                                    : selectedSupp1 == '3'
                                                        ? 'High Theta'
                                                        : selectedSupp1 == '4'
                                                            ? 'Overwhelm'
                                                            : '_________'}
                                            <span className="ps-1" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 , fontSize:'24px'}}>
                                                subtypes often respond well to:
                                            </span>
                                            
                                            {suppEdit1 || released || userRole === 'researcher' ? (
                                                ''
                                            ) : (
                                                <>
                                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={handleSuppChange1}>
                                                        <EditIcon />
                                                    </span>
                                                    {selectedSupp !== '' ? (
                                                        <span className="report-edit-icon">
                                                            <Popconfirm
                                                                placement="topLeft"
                                                                title="Are you sure to remove this supplement?"
                                                                onConfirm={() => {
                                                                    removeSupplyfTemplate(selectedSupp1, 2);
                                                                    setSelectedSupp1('');
                                                                }}
                                                                okText="Yes"
                                                                cancelText="No"
                                                            >
                                                                <Tooltip title="Remove" className="mt-0">
                                                                    <DeleteFilled className="text-danger fs-15" />
                                                                </Tooltip>
                                                            </Popconfirm>
                                                        </span>
                                                    ) : (
                                                        ''
                                                    )}
                                                </>
                                            )}
                                        </h4>
                                    </div>
                                    <div className="mt-0 w-100 justify-content-between suppImgCont" style={{ marginBottom: '50px', fontFamily: 'RobotoRegular' }}>
                                        {suppEdit1 ? (
                                            <div className="border rounded p-3">
                                                <div className='d-flex justify-content-between'>
                                                    <label className="fs-16">Select Nutritional supplementation: </label>
                                                    <p className="ms-auto w-auto para">
                                                        <Tooltip title="close" className="mt-0">
                                                            <span className="pe-2 text-danger pointer" onClick={ ()=>{
                                                            handleSuppChange1
                                                            setSelectedSupp1('');
                                                            }}>
                                                                x
                                                            </span>
                                                        </Tooltip>
                                                    </p>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-md-6 ">
                                                        <Select options={suppTemp} defaultValue={selectedSupp1} className="temp-input w-100 dropdown" onChange={(e) => handleSupplementChange('2', e)} />
                                                    </div>
                                                    <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(2)} loading={loading6}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                {selectedSupp1 == '1' ? (
                                                    <Image src={HighAlphaImg2} width="auto" height="100%" />
                                                ) : selectedSupp1 == '2' ? (
                                                    <Image src={HighBetaImg2} width="auto" height="100%" />
                                                ) : selectedSupp1 == '3' ? (
                                                    <Image src={HighThetaImg2} width="auto" height="100%" />
                                                ) : selectedSupp1 == '4' ? (
                                                    <Image src={Overwhelm2} width="auto" height="100%" />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="footer" style={{ textAlign: 'center' }}>
                                <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '10px', fontWeight:500 }}>
                                    Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                                </h6>
                            </div>
                        </div>
                    )
                }
                </>
            )}

            {/* lifestyle */}
            {(commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag == null) && (
                <>
                    {released && !selectedSupp && !selectedLyf ? (
                        <div className="page-two mt-2 bg-white mx-auto" id="page111"> </div>
                    ) : (
                        <div className="page-two mt-2 bg-white mx-auto"
                            id="page111"
                            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            <div className="page-content page-head">
                                <div className="d-flex  justify-content-between">
                                    <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                        RESTORATIVE DAILY PRACTICES
                                    </h3>
                                    <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Name:
                                            <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark " style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Age:
                                            <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? commonInfo?.pnt_age : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark " style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            DOB:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Date:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                    </div>
                                </div>
                                <div style={{ borderBottom: '8px solid #3e4b69', width: '300px' }} />
                                <div className="page-body mt-4 px-4" style={{ textAlign: 'justify' }}>
                                    <p className="para" style={{ fontSize: '17px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                        {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                            <>
                                                {selectedSupp == '1' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold">
                                                            Excess alpha
                                                        </span>{' '}
                                                        brains often report low motivation, mental rumination, negative
                                                        self-talk, and increased negative biases when out of balance. Integrated with accountability
                                                        coaching or therapy, the following techniques can be helpful to center these individuals:
                                                    </span>
                                                ) : selectedSupp == '2' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High beta
                                                        </span>{' '}
                                                        brains are going too fast. While this may help with productivity, it
                                                        is often a hindrance to things like relaxing self-care. Integrated with accountability coaching or
                                                        therapy, the following techniques can be helpful in calming the mind:
                                                    </span>
                                                ) : selectedSupp == '3' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High theta
                                                        </span>{' '}
                                                        brains are often easily distracted, impulsive, and often need
                                                        external stimulation to create motivation. Rewards, punishments, and deadlines are sometimes
                                                        motivators. Integrated with accountability coaching or therapy, the following techniques can be
                                                        helpful to refocus:
                                                    </span>
                                                ) : selectedSupp == '4' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            Feeling overwhelmed{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                ) : (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            _____________{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {selectedLyf == '4' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            Excess alpha
                                                        </span>{' '}
                                                        brains often report low motivation, mental rumination, negative
                                                        self-talk, and increased negative biases when out of balance. Integrated with accountability
                                                        coaching or therapy, the following techniques can be helpful to center these individuals:
                                                    </span>
                                                ) : selectedLyf == '3' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High beta
                                                        </span>{' '}
                                                        brains are going too fast. While this may help with productivity, it
                                                        is often a hindrance to things like relaxing self-care. Integrated with accountability coaching or
                                                        therapy, the following techniques can be helpful in calming the mind:
                                                    </span>
                                                ) : selectedLyf == '1' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High theta
                                                        </span>{' '}
                                                        brains are often easily distracted, impulsive, and often need
                                                        external stimulation to create motivation. Rewards, punishments, and deadlines are sometimes
                                                        motivators. Integrated with accountability coaching or therapy, the following techniques can be
                                                        helpful to refocus:
                                                    </span>
                                                ) : selectedLyf == '2' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            Feeling overwhelmed{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                ) : (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            _____________{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </p>

                                    <div className="text-center report-content mx-2 py-2 mt-4 my-2 bg-gray">
                                        {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                            <h6 className="mb-0 creative-cnt" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                                {selectedSupp == '4' ? 'For The Orderly Seeker:' : selectedSupp == '2' ? 'For The Focused Achiever:' : selectedSupp == '3' ? 'For The Creative Dreamer:' : selectedSupp == '1' ? 'For The Empathetic Harmonizer:' : ' For the _________'}{' '}
                                            </h6>
                                        ) : (
                                            <h6 className="mb-0 creative-cnt" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                                For 
                                                {selectedLyf == '4' ? 'The Empathetic Harmonizer:' : selectedLyf == '2' ? 'The Orderly Seeker:' : selectedLyf == '3' ? 'The Focused Achiever:' : selectedLyf == '1' ? 'The Creative Dreamer:' : '_________'}{' '}
                                                {released || userRole === 'researcher' ? (
                                                    ''
                                                ) : (
                                                    <>
                                                        {' '}
                                                        <Tooltip title="Edit">
                                                            <span className="report-edit-icon edit-icon text-success pointer" onClick={handleLyfChange}>
                                                                <EditIcon />
                                                            </span>
                                                        </Tooltip>
                                                        {selectedSupp !== '' ? (
                                                            <span className="report-edit-icon">
                                                                <Popconfirm
                                                                    placement="topLeft"
                                                                    title="Are you sure to remove this lifestyle?"
                                                                    onConfirm={() => {
                                                                        removeSupplyfTemplate(selectedSupp, 3);
                                                                        setSelectedSupp('');
                                                                    }}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Tooltip title="Remove" className="mt-0">
                                                                        <DeleteFilled className="text-danger fs-15" />
                                                                    </Tooltip>
                                                                </Popconfirm>
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </>
                                                )}
                                            </h6>
                                        )}
                                    </div>
                                </div>

                                {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                    ''
                                ) : (
                                        <div className="mt-0 w-100 justify-content-between suppImgCont">
                                            {lyfEdit ? (
                                                <div className="border rounded p-3 mx-3">
                                                    <div className='d-flex justify-content-between'>
                                                        <label className="fs-16 d-flex justify-content-start">Select Lifestyle intervention: </label>
                                                        <p className="ms-auto w-auto para">
                                                            <Tooltip title="close" className="mt-0">
                                                                <span className="pe-2 text-danger pointer" onClick={()=>{
                                                                handleLyfChange()
                                                                setSelectedLyf('')
                                                            }}>
                                                                    x
                                                                </span>
                                                            </Tooltip>
                                                        </p>
                                                    </div>
                                                    <div className="d-flex">
                                                        <div className="col-md-6 ">
                                                            <Select
                                                                options={lyfTemp}
                                                                defaultValue={selectedLyf}
                                                                className="temp-input w-100 text-start dropdown"
                                                                onChange={(e) => handleSupplementChange('3', e)}
                                                            />
                                                        </div>
                                                        <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(3)} loading={loading6}>
                                                            Save
                                                        </Button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-3 px-3">
                                                    {selectedLyf == '4' ? (
                                                        <Image preview={false} src={ExcessAlphaChart} width="100%" height="100%" />
                                                    ) : selectedLyf == '3' ? (
                                                        <Image preview={false} src={HighBetaChart} width="100%" height="100%" />
                                                    ) : selectedLyf == '1' ? (
                                                        <Image preview={false} src={HighThetaChart} width="100%" height="100%" />
                                                    ) : selectedLyf == '2' ? (
                                                        <Image preview={false} src={OverwhelmChart} width="100%" height="100%" />
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            )}
                                        </div>  
                                )}
                                {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                    <div className="mt-3 px-3">
                                        {selectedSupp == '1' ? (
                                            <Image preview={false} src={ExcessAlphaChart} width="100%" height="100%" />
                                        ) : selectedSupp == '2' ? (
                                            <Image preview={false} src={HighBetaChart} width="100%" height="100%" />
                                        ) : selectedSupp == '3' ? (
                                            <Image preview={false} src={HighThetaChart} width="100%" height="100%" />
                                        ) : selectedSupp == '4' ? (
                                            <Image preview={false} src={OverwhelmChart} width="100%" height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="footer" style={{ textAlign: 'center' }}>
                                <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '10px', fontWeight: 500 }}>
                                    Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                                </h6>
                            </div>
                        </div>
                    )}
                    {released && !selectedSupp1 && !selectedLyf1 ? (
                        <div className="page-two mt-2 bg-white mx-auto" id="page112"> </div>

                    ) : (
                        <div className="page-two mt-2 bg-white mx-auto"
                            id="page112"
                            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
                            <div className="page-content page-head">
                                <div className="d-flex  justify-content-between">
                                    <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                        RESTORATIVE DAILY PRACTICES
                                    </h3>
                                    <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Name:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark " style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Age:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? commonInfo?.pnt_age : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            DOB:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                        <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            Date:
                                            <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                                {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                            </div>
                                        </h6>
                                    </div>
                                </div>
                                <div style={{ borderBottom: '8px solid #3e4b69', width: '300px' }} />
                                <div className="page-body mt-4 px-4" style={{ textAlign: 'justify' }}>
                                    <p className="para" style={{ fontSize: '17px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                        {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                            <>
                                                {selectedSupp1 == '1' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold">
                                                            alpha deviations
                                                        </span>{' '}
                                                        including elevated Alpha-Beta Ratio (ABR), excess relative alpha activity, or alpha asymmetries—can leverage these patterns toward optimized functioning. These
                                                        profiles may be associated with tendencies toward low energy, reduced focus, or mood fluctuations, benefiting particularly from structured environments that
                                                        promote active engagement. Evidence-based strategies, such as targeted cognitive training, regular physical activity, and mindfulness practices, combined with
                                                        therapeutic or coaching support, can help individuals capitalize on their unique alpha profiles to improve clarity, motivation, and balanced cognitive arousal.
                                                    </span>
                                                ) : selectedSupp1 == '2' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        With the right environmental and lifestyle support, individuals with{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            excess beta EEG patterns
                                                        </span>{' '}
                                                        can channel their natural tendencies toward high focus and mental engagement into productive outcomes. High beta patterns are often linked to increased
                                                        alertness, though they may also correlate with stress, tension, or over-arousal. Structured relaxation techniques, mindfulness practices, and regular physical
                                                        activity, particularly those that promote calm, can be beneficial. When integrated with supportive coaching or therapy, these strategies help balance high beta
                                                        activity, allowing individuals to harness their heightened focus without the risk of burnout or anxiety.
                                                    </span>
                                                ) : selectedSupp1 == '3' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        With an optimal external environment and supportive lifestyle choices, even atypical brain patterns, such as{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            high theta profiles
                                                        </span>{' '}
                                                        , can excel. Individuals with elevated theta EEG patterns may be more prone to distraction and impulsivity and may rely on external sources of motivation, such
                                                        as structured rewards, consequences, and clear deadlines. When paired with accountability coaching or therapy, evidence-based techniques can help harness these
                                                        unique patterns, providing effective strategies to enhance focus and engagement.
                                                    </span>
                                                ) : selectedSupp1 == '4' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        With a supportive environment and intentional strategies, individuals exhibiting an{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            overwhelm EEG pattern{' '}
                                                        </span>
                                                        can improve their cognitive resilience and adaptability. These patterns are often associated with feelings of mental fatigue, slower processing, and challenges
                                                        in sustaining attention. Evidence-based approaches, such as structured cognitive exercises, frequent breaks, and physical activity to increase alertness,
                                                        combined with therapeutic support or coaching, can help individuals manage these patterns effectively, fostering greater cognitive efficiency and endurance in
                                                        demanding tasks.
                                                    </span>
                                                ) : (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        With a supportive environment and intentional strategies, individuals exhibiting an{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            _____________{' '}
                                                        </span>
                                                        can improve their cognitive resilience and adaptability. These patterns are often associated with feelings of mental fatigue, slower processing, and challenges
                                                        in sustaining attention. Evidence-based approaches, such as structured cognitive exercises, frequent breaks, and physical activity to increase alertness,
                                                        combined with therapeutic support or coaching, can help individuals manage these patterns effectively, fostering greater cognitive efficiency and endurance in
                                                        demanding tasks.
                                                    </span>
                                                )}
                                            </>
                                        ) : (
                                            <>
                                                {selectedLyf1 == '4' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold">
                                                            Excess alpha
                                                        </span>{' '}
                                                        brains often report low motivation, mental rumination, negative
                                                        self-talk, and increased negative biases when out of balance. Integrated with accountability
                                                        coaching or therapy, the following techniques can be helpful to center these individuals:
                                                    </span>
                                                ) : selectedLyf1 == '3' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High beta
                                                        </span>{' '}
                                                        brains are going too fast. While this may help with productivity, it
                                                        is often a hindrance to things like relaxing self-care. Integrated with accountability coaching or
                                                        therapy, the following techniques can be helpful in calming the mind:
                                                    </span>
                                                ) : selectedLyf1 == '1' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            High theta
                                                        </span>{' '}
                                                        brains are often easily distracted, impulsive, and often need
                                                        external stimulation to create motivation. Rewards, punishments, and deadlines are sometimes
                                                        motivators. Integrated with accountability coaching or therapy, the following techniques can be
                                                        helpful to refocus:
                                                    </span>
                                                ) : selectedLyf1 == '2' ? (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            Feeling overwhelmed{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                ) : (
                                                    <span className="" style={{ fontSize: '17px', width: '95%', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                                        When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!{' '}
                                                        <span style={{ fontSize: '17px', fontFamily: 'RobotoRegular' }} className="fw-bold ">
                                                            _____________{' '}
                                                        </span>
                                                        is akin to having too many windows open on a
                                                        computer causing it to slow down or even freeze. This happens when an individual’s perceived
                                                        stressors exceed their resilience. Integrated with accountability coaching or therapy, the
                                                        following techniques can be helpful:
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </p>

                                    <div className="text-center report-content  mx-2 py-2 mt-4 my-2 bg-gray">
                                        {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                            <h6 className="mb-0 creative-cnt" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                                {selectedSupp1 == '4' ? 'For The Orderly Seeker:' : selectedSupp1 == '2' ? 'For The Focused Achiever:' : selectedSupp1 == '3' ? 'For The Creative Dreamer:' : selectedSupp1 == '1' ? 'For The Empathetic Harmonizer:' : ' For the _________'}{' '}
                                            </h6>
                                        ) : (
                                            <h6 className="mb-0 creative-cnt" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                                For 
                                                {selectedLyf1 == '4' ? 'The Empathetic Harmonizer:' : selectedLyf1 == '2' ? 'The Orderly Seeker:' : selectedLyf1 == '3' ? 'The Focused Achiever:' : selectedLyf1 == '1' ? 'The Creative Dreamer:' : '_________'}{' '}
                                                {released || userRole === 'researcher' ? (
                                                    ''
                                                ) : (
                                                    <>
                                                        {' '}
                                                        <Tooltip title="Edit">
                                                            <span className="report-edit-icon edit-icon text-success pointer" onClick={handleLyfChange1}>
                                                                <EditIcon />
                                                            </span>
                                                        </Tooltip>
                                                        {selectedSupp1 !== '' ? (
                                                            <span className="report-edit-icon">
                                                                <Popconfirm
                                                                    placement="topLeft"
                                                                    title="Are you sure to remove this lifestyle?"
                                                                    onConfirm={() => {
                                                                        removeSupplyfTemplate(selectedSupp1, 4);
                                                                        setSelectedSupp1('');
                                                                    }}
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <Tooltip title="Remove" className="mt-0">
                                                                        <DeleteFilled className="text-danger fs-15" />
                                                                    </Tooltip>
                                                                </Popconfirm>
                                                            </span>
                                                        ) : (
                                                            ''
                                                        )}
                                                    </>
                                                )}
                                            </h6>
                                        )}
                                    </div>
                                </div>

                                {commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null ? (
                                    ''
                                ) : (
                                    <div className="mt-0 w-100 justify-content-between suppImgCont" style={{ marginBottom: '50px', fontFamily: 'RobotoRegular' }}>
                                        {lyfEdit1 ? (
                                            <div className="rounded border p-3 mx-3">
                                                <div className='d-flex justify-content-between'>
                                                    <label className="fs-16 d-flex justify-content-start">Select Lifestyle intervention: </label>
                                                    <p className="ms-auto w-auto para">
                                                        <Tooltip title="close" className="mt-0">
                                                            <span className="pe-2 text-danger pointer" onClick={()=>{
                                                                handleLyfChange1()
                                                                setSelectedLyf1('')
                                                            }}>
                                                                x
                                                            </span>
                                                        </Tooltip>
                                                    </p>
                                                </div>
                                                <div className="d-flex">
                                                    <div className="col-md-6 ">
                                                        <Select
                                                            options={lyfArr}
                                                            defaultValue={selectedLyf1}
                                                            className="temp-input w-100 text-start dropdown"
                                                            onChange={(e) => handleSupplementChange('4', e)}
                                                        />
                                                    </div>
                                                    <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(4)} loading={loading6}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3 px-3">
                                                {selectedLyf1 == '4' ? (
                                                    <Image src={ExcessAlphaChart} preview={false} width="100%" height="100%" />
                                                ) : selectedLyf1 == '3' ? (
                                                    <Image src={HighBetaChart} preview={false} width="100%" height="100%" />
                                                ) : selectedLyf1 == '1' ? (
                                                    <Image src={HighThetaChart} preview={false} width="100%" height="100%" />
                                                ) : selectedLyf1 == '2' ? (
                                                    <Image src={OverwhelmChart} preview={false} width="100%" height="100%" />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                                {(commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null) && (
                                    <div className="mt-3 px-3">
                                        {selectedSupp1 == '1' ? (
                                            <Image src={ExcessAlphaChart} preview={false} width="100%" height="100%" />
                                        ) : selectedSupp1 == '2' ? (
                                            <Image src={HighBetaChart} preview={false} width="100%" height="100%" />
                                        ) : selectedSupp1 == '3' ? (
                                            <Image src={HighThetaChart} preview={false} width="100%" height="100%" />
                                        ) : selectedSupp1 == '4' ? (
                                            <Image src={OverwhelmChart} preview={false} width="100%" height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="footer" style={{ textAlign: 'center' }}>
                                <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'RobotoRegular', fontSize: '10px', fontWeight: 500 }}>
                                    Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                                </h6>
                            </div>
                        </div>
                    )}
                </>
            )}

            <PossibleMedicationTemplate
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

export default SupplementationLifestyle;