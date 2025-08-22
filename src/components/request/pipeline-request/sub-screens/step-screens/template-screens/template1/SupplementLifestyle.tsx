import React, { useEffect, useState } from 'react';
import {
    Template3Logo,
    HeaderIcon,
    RibbonIcon,
    InfoRoundIcon,
    HighAlphaImg1,
    HighBetaImg1,
    HighThetaImg,
    OverwhelmImg,
    TreeImg2,
    TreeImg1,
    TreeTheta,
    TreeOverwhelm,
} from 'components/shared/TemplateImages';
import { footerText, lifestyleText, pdrText, supplementText } from 'components/shared/CompVariables';
import { Image, message, Popconfirm, Tooltip, useDispatch, useSelector } from 'components/shared/AntComponent';
import NeurofeedbackPBM from './NeurofeedbackPBM';
import { EditIcon } from 'assets/img/custom-icons';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { saveAssociateCommon } from 'services/actions/commonServiceAction';
import { useLocation } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';

interface ChildProps {
    zoom: any;
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
    getCommonService: () => void;
}

const SupplementLifestyle: React.FC<ChildProps> = ({
    zoom,
    suppEdit,
    suppEdit1,
    lyfEdit,
    lyfEdit1,
    nfbEdit,
    pbmEdit,
    handlePbmChange,
    handleNfbChange,
    handleLyfChange,
    handleLyfChange1,
    handleSuppChange,
    handleSuppChange1,
    getCommonService,
}) => {
    const { commonInfo, loading6, success6, error6 } = useSelector((state: any) => state.commonData);
    const location = useLocation();
    const dispatch = useDispatch();
    // const [selectedSupp, setSelectedSupp] = useState('');
    // const [selectedSupp1, setSelectedSupp1] = useState('');
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    const [tempType, setTempType] = useState('');
    const autotxt = 'recommended';


    const [selectedSupp, setSelectedSupp]: any = useState('');
    const [selectedSupp1, setSelectedSupp1]: any = useState('');
    const [selectedLyf, setSelectedLyf]: any = useState('');
    const [selectedLyf1, setSelectedLyf1]: any = useState('');

    const [suppArr, setSuppArr]: any = useState([]);
    const [suppTemp, setSuppTemp]: any = useState([]);
    const [lyfTemp, setLyfTemp]: any = useState([]);
    const [lyfArr, setLyfArr]: any = useState([]);

    const capitalizeFirstLetter = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

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
        <>
            {!commonInfo?.supplement_recommendation_flag ? (
                ''
            ) : (
                <>
                    <div id="page6" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                        <div className="page-content page-hd">
                            <div className="page-header d-flex">
                                <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                                <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                    nutritional supplementation
                                </h5>
                                <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                            </div>
                            <div className="page-body">
                                <div className="mb-3 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                    <div className="col-auto">
                                        <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                    </div>
                                    <div className="col my-auto pe-2">
                                        <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px' }}>
                                            Based upon the individual`s topographic maps, sLORETA images, in consideration of database deviancies, known published references, internal
                                            studies, proprietary markers, and AI matching, the following recommendations are made for supplementation when applicable. Consult with your
                                            health care provider for appropriateness and possible interactions with current treatments.
                                        </p>
                                    </div>
                                </div>
                                <div className="">
                                    <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize: '24px' }}>
                                        {selectedSupp == '1'
                                            ? 'high Alpha'
                                            : selectedSupp == '2'
                                                ? 'high beta'
                                                : selectedSupp == '3'
                                                    ? 'high theta'
                                                    : selectedSupp == '4'
                                                        ? 'overwhelm'
                                                        : '_________'}
                                        <span className="ps-1 fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500, fontSize: '24px' }}>
                                            subtypes often respond well to:
                                        </span>
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
                                    </h4>
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
                                                    <Select options={suppArr} defaultValue={selectedSupp} className="temp-input w-100" onChange={(e) => handleSupplementChange('1', e)} />
                                                </div>
                                                <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(1)} loading={loading6}>
                                                    Save
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="mt-3">
                                            {selectedSupp == '1' ? (
                                                <Image src={HighAlphaImg1} width="auto" height="100%" />
                                            ) : selectedSupp == '2' ? (
                                                <Image src={HighBetaImg1} width="auto" height="100%" />
                                            ) : selectedSupp == '3' ? (
                                                <Image src={HighThetaImg} width="auto" height="100%" />
                                            ) : selectedSupp == '4' ? (
                                                <Image src={OverwhelmImg} width="auto" height="100%" />
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="footer fs-12 px-2" style={{ fontFamily: 'RobotoRegular' }}>
                                <div className="mb-0 d-flex my-auto">
                                    <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                        {supplementText}
                                    </p>
                                    <div className="col-md-2 my-auto text-center pe-0">
                                        <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                    </div>
                                </div>
                                {footerText}
                            </div>
                        </div>
                    </div>
                    <div id="page7" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                        <div className="page-content page-hd">
                            <div className="page-header d-flex">
                                <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                                <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                    nutritional supplementation
                                </h5>
                                <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                            </div>
                            <div className="page-body">
                                <div className="mb-3 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                    <div className="col-auto">
                                        <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                    </div>
                                    <div className="col my-auto pe-2">
                                        <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px' }}>
                                            Based upon the individual`s topographic maps, sLORETA images, in consideration of database deviancies, known published references, internal
                                            studies, proprietary markers, and AI matching, the following recommendations are made for supplementation when applicable. Consult with your
                                            health care provider for appropriateness and possible interactions with current treatments.
                                        </p>
                                    </div>
                                </div>
                                <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                    {selectedSupp1 == '1'
                                        ? 'high Alpha'
                                        : selectedSupp1 == '2'
                                            ? 'high beta'
                                            : selectedSupp1 == '3'
                                                ? 'high theta'
                                                : selectedSupp1 == '4'
                                                    ? 'overwhelm'
                                                    : '_________'}
                                    <span className="ps-1 fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500,fontSize:'24px' }}>
                                        subtypes often respond well to:
                                    </span>
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleSuppChange1()}>
                                        <EditIcon />
                                    </span>
                                    {selectedSupp1 !== '' ? (
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
                                </h4>
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
                                                <Select options={suppTemp} defaultValue={selectedSupp1} className="temp-input w-100" onChange={(e) => handleSupplementChange('2', e)} />
                                            </div>
                                            <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(2)} loading={loading6}>
                                                Save
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-3">
                                        {selectedSupp1 == '1' ? (
                                            <Image src={HighAlphaImg1} width="auto" height="100%" />
                                        ) : selectedSupp1 == '2' ? (
                                            <Image src={HighBetaImg1} width="auto" height="100%" />
                                        ) : selectedSupp1 == '3' ? (
                                            <Image src={HighThetaImg} width="auto" height="100%" />
                                        ) : selectedSupp1 == '4' ? (
                                            <Image src={OverwhelmImg} width="auto" height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="footer fs-12 px-2" style={{ fontFamily: 'RobotoRegular' }}>
                                <div className="mb-0 d-flex my-auto">
                                    <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                        {supplementText}
                                    </p>
                                    <div className="col-md-2 my-auto text-center pe-0">
                                        <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                    </div>
                                </div>
                                {footerText}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {/* restorative daily practices */}
            {commonInfo?.lifestyle_flag || commonInfo?.supplement_recommendation_flag ? (
                <>
                    <div id="page8" className={`page-three bg-white mx-auto mt-2 `} style={{ zoom: zoom }}>
                        <div className="page-content page-hd">
                            <div className="page-header d-flex px-2 pt-2">
                                <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                                <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                    restorative daily practices
                                </h5>
                                <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                            </div>
                            <div className="page-body px-0">
                                <div className="px-4">
                                    <div className="my-2 d-flex w-100 " style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                        <div className="col-auto">
                                            <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                        </div>
                                        <div className="col my-auto pe-2">
                                            <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px' }}>
                                                When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!
                                                {selectedSupp === '1'
                                                    ? ' Excess alpha '
                                                    : selectedSupp === '2'
                                                        ? ' High beta '
                                                        : selectedSupp === '3'
                                                            ? ' High theta '
                                                            : selectedSupp === '4'
                                                                ? ' Feeling overwhelmed '
                                                                : ' _____________ '}
                                                subtype’s brains are going too fast. While this may help with productivity, it is often a hindrance to things like relaxing self-care.
                                                Integrated with accountability coaching or therapy, the following techniques can be helpful to calm the mind:
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {commonInfo?.lifestyle_flag && !commonInfo?.supplement_recommendation_flag ? (
                                    <>
                                        <h4 className="text-dark text-center report-edit-icon fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            {selectedSupp == '1'
                                                ? 'high Alpha'
                                                : selectedSupp == '2'
                                                    ? 'high beta'
                                                    : selectedSupp == '3'
                                                        ? 'high theta'
                                                        : selectedSupp == '4'
                                                            ? 'overwhelm'
                                                            : '_________'}
                                            <span className="ps-1 fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500,fontSize:'24px' }}>
                                                subtypes often respond well to:
                                            </span>
                                            <span className="report-edit-icon edit-icon text-success pointer" onClick={handleLyfChange}>
                                                <EditIcon />
                                            </span>
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
                                        </h4>
                                        {lyfEdit ? (
                                            <div className="border rounded p-3 m-3">
                                                <div className='d-flex justify-content-between'>
                                                    <label className="fs-16">Select Lifestyle intervention: </label>
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
                                                            className="temp-input w-100"
                                                            onChange={(e) => handleSupplementChange('3', e)}
                                                        />
                                                    </div>
                                                    <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(3)} loading={loading6}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                {selectedSupp == '1' ? (
                                                    <Image src={TreeImg2} width="100%" height="100%" />
                                                ) : selectedSupp == '2' ? (
                                                    <Image src={TreeImg1} width="100%" height="100%" />
                                                ) : selectedSupp == '3' ? (
                                                    <Image src={TreeTheta} width="100%" height="100%" />
                                                ) : selectedSupp == '4' ? (
                                                    <Image src={TreeOverwhelm} width="100%" height="100%" />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-3">
                                        {selectedSupp == '1' ? (
                                            <Image src={TreeImg2} width="100%" height="100%" />
                                        ) : selectedSupp == '2' ? (
                                            <Image src={TreeImg1} width="100%" height="100%" />
                                        ) : selectedSupp == '3' ? (
                                            <Image src={TreeTheta} width="100%" height="100%" />
                                        ) : selectedSupp == '4' ? (
                                            <Image src={TreeOverwhelm} width="100%" height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="footer fs-12 ps-2 mt-auto w-100" style={{ fontFamily: 'RobotoRegular' }}>
                                <div className="mb-0 d-flex my-auto">
                                    <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                        {lifestyleText}
                                    </p>
                                    <div className="col-md-2 my-auto text-center pe-0">
                                        <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                    </div>
                                </div>
                                {footerText}
                            </div>
                        </div>
                    </div>
                    <div id="page9" className={`page-three bg-white mx-auto mt-2 `} style={{ zoom: zoom }}>
                        <div className="page-content page-hd">
                            <div className="page-header d-flex px-2 pt-2">
                                <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                                <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                    restorative daily practices
                                </h5>
                                <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                            </div>
                            <div className="page-body px-0">
                                <div className="px-4">
                                    <div className="my-2 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                        <div className="col-auto">
                                            <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                        </div>
                                        <div className="col my-auto pe-2">
                                            <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px' }}>
                                                When given an optimal external environment and lifestyle choice, even the most aberrant brain patterns can thrive!
                                                {selectedSupp1 === '1'
                                                    ? ' Excess alpha '
                                                    : selectedSupp1 === '2'
                                                        ? ' High beta '
                                                        : selectedSupp1 === '3'
                                                            ? ' High theta '
                                                            : selectedSupp1 === '4'
                                                                ? ' Feeling overwhelmed '
                                                                : ' _____________ '}
                                                subtype’s brains are going too fast. While this may help with productivity, it is often a hindrance to things like relaxing self-care.
                                                Integrated with accountability coaching or therapy, the following techniques can be helpful to calm the mind:
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {commonInfo?.lifestyle_flag && !commonInfo?.supplement_recommendation_flag ? (
                                    <>
                                        <h4 className="text-dark text-center report-edit-icon fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500 }}>
                                            {selectedSupp1 == '1'
                                                ? 'high Alpha'
                                                : selectedSupp1 == '2'
                                                    ? 'high beta'
                                                    : selectedSupp1 == '3'
                                                        ? 'high theta'
                                                        : selectedSupp1 == '4'
                                                            ? 'overwhelm'
                                                            : '_________'}
                                            <span className="ps-1 fs-24" style={{ fontFamily: 'RobotoRegular', fontWeight: 500,fontSize:'24px' }}>
                                                subtypes often respond well to:
                                            </span>
                                            <span className="report-edit-icon edit-icon text-success pointer" onClick={handleLyfChange1}>
                                                <EditIcon />
                                            </span>
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
                                        </h4>
                                        {lyfEdit1 ? (
                                            <div className="border rounded p-3 m-3">
                                                <div className='d-flex justify-content-between'>
                                                    <label className="fs-16">Select Lifestyle intervention: </label>
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
                                                            className="temp-input w-100"
                                                            onChange={(e) => handleSupplementChange('4', e)}
                                                        />
                                                    </div>
                                                    <Button type="primary" className="col-auto py-0 ms-2 me-auto" onClick={() => saveSupplyfTemplate(4)} loading={loading6}>
                                                        Save
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="mt-3">
                                                {selectedSupp1 == '1' ? (
                                                    <Image src={TreeImg2} width="100%" height="100%" />
                                                ) : selectedSupp1 == '2' ? (
                                                    <Image src={TreeImg1} width="100%" height="100%" />
                                                ) : selectedSupp1 == '3' ? (
                                                    <Image src={TreeTheta} width="100%" height="100%" />
                                                ) : selectedSupp1 == '4' ? (
                                                    <Image src={TreeOverwhelm} width="100%" height="100%" />
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="mt-3">
                                        {selectedSupp1 == '1' ? (
                                            <Image src={TreeImg2} width="100%" height="100%" />
                                        ) : selectedSupp1 == '2' ? (
                                            <Image src={TreeImg1} width="100%" height="100%" />
                                        ) : selectedSupp1 == '3' ? (
                                            <Image src={TreeTheta} width="100%" height="100%" />
                                        ) : selectedSupp1 == '4' ? (
                                            <Image src={TreeOverwhelm} width="100%" height="100%" />
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="footer fs-12 px-2 mt-auto w-100" style={{ fontFamily: 'RobotoRegular' }}>
                                <div className="mb-0 d-flex my-auto">
                                    <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                        {lifestyleText}
                                    </p>
                                    <div className="col-md-2 my-auto text-center pe-0">
                                        <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                    </div>
                                </div>
                                {footerText}
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                ''
            )}
            <div className="p-1"></div>
            <NeurofeedbackPBM zoom={zoom} pbmEdit={pbmEdit} nfbEdit={nfbEdit} handleNfbChange={handleNfbChange} handlePbmChange={handlePbmChange} getCommonService={getCommonService} />
        </>
    );
};

export default SupplementLifestyle;
