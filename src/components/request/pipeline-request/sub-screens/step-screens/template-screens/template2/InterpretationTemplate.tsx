import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch} from 'components/shared/CompVariables';
import { Image, message, Skeleton } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { getInterpretationFindings, getPdrData } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { Input,Select } from 'components/shared/FormComponent';
import { saveInterpretationMarker } from 'services/actions/pipeline/stepwizardAction';
import { getAssociateCommon } from 'services/actions/commonServiceAction';
import background from 'assets/img/report-icons/background.png';
import dayjs from 'dayjs';
import Sliders from './model/Sliders';
import SummaryInterpretation from './SummaryInterpretation';
import Brain from 'assets/img/report-icons/brain-png.png';
import Ebook from 'assets/img/report-icons/ebook-qr.png';

const { Option } = Select;


const A4_PAGE_HEIGHT_PX = 548;

interface SlidersProps { 
    data: {
        value: any;
        title: any;
        mfieldtype: any;
        type: string;
        eyeType: string;
        item: any;
    };
}
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

interface DataType {
    id: any;
    checked: string;
    eyeopen: any;
    eyeclosed: any;
}
const InterpretationTemplate: React.FC<ChildProps> = ({
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
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
    const { intFields } = useSelector((state: any) => state.recAnalysis);
    const dispatch = useDispatch();
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { topoResultInfo, resultInfo, success3, loading3, error3 } = useSelector((state: any) => state.wizard);
    // const {loading3:intloading} = useSelector((state: any) => state.interpretation)
    const {loading3:intloading  } = useSelector((state: any) => state.wizard);
    
    const [isOverflow, setIsOverflow] = useState(false);
    const [maxValue, setMaxValue]: any = useState();
    const ageValue = commonInfo?.pnt_age || null;
    const [markerData, setMarkerData] = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;
    const [intArr, setIntArr]: any = useState([]);

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }

    useEffect(() => {
        if (resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_value) {
            const vals = resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_channels;
            const vals1 = resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_value;
            let val1 = 0,
                val2 = 0,
                val3 = 0,
                val4 = 0,
                val5 = 0,
                val6 = 0,
                val7 = 0,
                val8 = 0,
                val9 = 0,
                val10 = 0;
            for (let i = 0; i < vals.length; i++) {
                if (vals[i] === 'EEG P3' || vals[i] === 'EEG P3-LE' || vals[i] === 'P3') {
                    val1 = vals1[i];
                    val4 = i;
                } else if (vals[i] === 'EEG Pz' || vals[i] === 'EEG Pz-LE' || vals[i] === 'Pz') {
                    val2 = vals1[i];
                    val5 = i;
                } else if (vals[i] === 'EEG P4' || vals[i] === 'EEG P4-LE' || vals[i] === 'P4') {
                    val3 = vals1[i];
                    val6 = i;
                } else if (vals[i] === 'EEG O1' || vals[i] === 'EEG O1-LE' || vals[i] === 'O1') {
                    val7 = vals1[i];
                    val8 = i;
                } else if (vals[i] === 'EEG O2' || vals[i] === 'EEG O2-LE' || vals[i] === 'O2') {
                    val9 = vals1[i];
                    val10 = i;
                }
            }
            const max = Math.max(val1, val2, val3, val7, val9);
            if (max == val1) {
                setMaxValue(val4);
            } else if (max == val2) {
                setMaxValue(val5);
            } else if (max == val3) {
                setMaxValue(val6);
            } else if (max == val7) {
                setMaxValue(val8);
            } else if (max == val9) {
                setMaxValue(val10);
            }
        }
    }, [resultInfo]);

    const handleIntChange = (val, id, status) => (e) => {
        const value = e.target.value;

        if (status == 'close') {
            if (val.mfieldtype == 'radio') {
                setIntArr((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: value?.toLowerCase?.() === 'yes' ? 'true' : 'false' };
                        }

                        return obj;
                    })
                );
            } else {
                setIntArr((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: value };
                        }

                        return obj;
                    })
                );
            }
        } else {
            if (val.mfieldtype == 'radio') {
                setIntArr((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeopen: value?.toLowerCase?.() == 'yes' ? 'true' : 'false' };
                        }

                        return obj;
                    })
                );
            } else {
                setIntArr((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeopen: value };
                        }

                        return obj;
                    })
                );
            }
        }
    };

    useEffect(() => {
        if (commonInfo) {
            if (commonInfo?.interpretationmakers) {
                setIntArr(commonInfo?.interpretationmakers);
            }
        }

        const checkOverflow = () => {
            const contentDiv = document.querySelector('.page-body');
            if (contentDiv) {
                const contentHeight = contentDiv.scrollHeight;
                setIsOverflow(contentHeight > A4_PAGE_HEIGHT_PX);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [commonInfo, topoResultInfo]);

    let categoryIndex;
    if (ageValue < 8) {
        categoryIndex = 0;
    } else if (ageValue < 45) {
        categoryIndex = 1;
    } else if (ageValue < 75) {
        categoryIndex = 2;
    } else {
        categoryIndex = 3;
    }

    const isOutsideRange = (value, min, max) => {
        return value < min || value > max;
    };

    const getStyle = (item, markerType, age) => {
        const eyeClosedThetaBeta = parseFloat(item?.eyeclosed);
        const eyeOpenThetaBeta = parseFloat(item?.eyeopen);
        const eyeData = markerType === 'eyeClosed' ? parseFloat(item?.eyeclosed) : parseFloat(item?.eyeopen);
        const eyeData1 = markerType === 'eyeClosed' ? item?.eyeclosed === 'true' : item?.eyeopen === 'true';
        const style = { color: '' };
        if (item?.markername === 'Alpha/beta ratio' && isOutsideRange(eyeData, 6, 12)) {
            style.color = 'red';
        } else if (item?.markername === 'Posterior Dominant Rhythm') {
            let lowerBound, upperBound;
            if (age < 10) {
                lowerBound = 8;
                upperBound = 10;
            } else if (age >= 10 && age < 45) {
                lowerBound = 10;
                upperBound = 12;
            } else if (age >= 45 && age < 55) {
                lowerBound = 9.5;
                upperBound = 12;
            } else if (age >= 55 && age < 65) {
                lowerBound = 9;
                upperBound = 12;
            } else if (age >= 65 && age < 75) {
                lowerBound = 8.5;
                upperBound = 12;
            } else {
                lowerBound = 8;
                upperBound = 12;
            }

            if (isOutsideRange(eyeData, lowerBound, upperBound)) {
                style.color = 'red';
            }
        } else if (item?.markername === 'Theta/beta ratio' && markerType == 'eyeClosed' && eyeClosedThetaBeta > 3) {
            style.color = 'red';
        } else if (item?.markername === 'Theta/beta ratio' && markerType == 'eyeOpen' && eyeOpenThetaBeta > eyeClosedThetaBeta) {
            style.color = 'red';
        } else if (item?.markername === 'Mu Rhythm Present' && eyeData1) {
            style.color = 'red';
        } else if (item?.markername === 'F7>F8 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        } else if (item?.markername === 'F3>F4 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        } else if (item?.markername === 'P4>P3 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        }
        return style;
    };

    function getInterpretContent() {
        dispatch(getInterpretationFindings(location.state?.id) as any);
    }

    useEffect(() => {
        getInterpretContent();
    }, []);

    function getPdrInfo() {
        dispatch(getPdrData(location.state?.id) as any);
    }

    useEffect(() => {
        getPdrInfo();
    }, []);
    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Interpretation markers saved successfully');
            handleGlanceChange();
            getCommonService();
        }
        if (errormsg) {
            if (error3?.data) {
                message.error(error3?.data);
            } else {
                message.error("Interpretation couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const submitIntpForm = () => {

        const fdata: DataType[] = [];
        intArr?.forEach((items, i) => {
            if (items?.id != 0) {
                fdata.push({
                    id: items.id,
                    checked: 'true',
                    eyeopen: items.eyeopen || '',
                    eyeclosed: items.eyeclosed || '',
                });
            }
        });
        dispatch(saveInterpretationMarker(fdata) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };
    
    return (
        <div>
            {(commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) && (
                <div
                    className="page-two mt-2 bg-white mx-auto page border-0"
                    id="page103"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                >
                    <div className="page-content">
                        <div className="d-flex  justify-content-between">
                            <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                qEEG : Summary of Findings {released || userRole === 'researcher' ? '' : <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleGlanceChange()}>
                                    <EditIcon />
                                </span>}
                            </h3>
                            <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                    Name:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark " style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    Age:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        {commonInfo ? commonInfo?.pnt_age : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    DOB:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                                <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    Date:
                                    <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                    </div>
                                </h6>
                            </div>
                        </div>
                        <div style={{ borderBottom: '10px solid #3e4b69', width: '100%', marginBottom: '1px' }} />
                        <div className="d-flex w-100 py-1" style={{ background: '#3e4b69' }}>
                            <div className="col py-2 text-center">
                                <h3 className="text-white mb-0 fw-normal white " style={{ fontFamily: 'RobotoRegular' }}>
                                    Eyes Closed
                                </h3>
                            </div>
                            <div className="col py-2 text-center">
                                <h3 className="text-white mb-0 fw-normal white" style={{ fontFamily: 'RobotoRegular' }}>
                                    Eyes Opened
                                </h3>
                            </div>
                        </div>
                        {glanceEdit ? (
                            <div className="row m-0 px-4 justify-content-around glanceData">
                                <div className="col-md-6 mt-3" style={{ zIndex: 999 }}>
                                    <div className="ms-3 mt-2">
                                        {commonInfo
                                            ? commonInfo?.interpretationmakers?.map((item: any) => {
                                                if (item.EC_isactive) {
                                                    return (
                                                        <div className="text-start d-flex eyeDataCont mb-1" key={item.id} style={{ lineHeight: 1.2 }}>
                                                            {item.markername !== 'Peak alpha frequency' && (
                                                                <>
                                                                    <span className="eyeData text-capitalize" style={{ fontFamily: 'RobotoRegular', fontWeight: 600, fontSize: '15px' }}>
                                                                        {item.markername}
                                                                    </span>
                                                                    :
                                                                    <span className="ms-1 text-end" style={{ fontSize: '15px', fontFamily: 'RobotoRegular', fontWeight: 200 }}>
                                                                        {item?.mfieldtype === 'textbox' ? (
                                                                            <Input
                                                                                className="rounded-0 ms-auto temp-input"
                                                                                onChange={handleIntChange(item, item.id, 'close')}
                                                                                defaultValue={
                                                                                    typeof item?.eyeclosed === 'string' && item?.eyeclosed?.toLowerCase?.() === 'true'
                                                                                        ? 'Yes'
                                                                                        : typeof item?.eyeclosed === 'string' && item?.eyeclosed?.toLowerCase?.() === 'false'
                                                                                            ? 'No'
                                                                                            : item?.eyeclosed
                                                                                }
                                                                                style={{ height: '24px', width: '100px' }}
                                                                            />
                                                                        ) : (
                                                                            <Select
                                                                                className="rounded-0 ms-auto temp-input"
                                                                                onChange={(value) => handleIntChange(item, item.id, 'close')({ target: { value } })}
                                                                                defaultValue={
                                                                                    typeof item?.eyeclosed === 'string'
                                                                                        ? item?.eyeclosed.toLowerCase?.() === 'true'
                                                                                            ? 'Yes'
                                                                                            : item?.eyeclosed.toLowerCase?.() === 'false'
                                                                                                ? 'No'
                                                                                                : item?.eyeclosed.toLowerCase?.() === 'none'
                                                                                                ? ''
                                                                                                : item?.eyeclosed
                                                                                        : item?.eyeclosed == null || item?.eyeclosed === 'none'
                                                                                            ? ''
                                                                                            : item?.eyeclosed
                                                                                }
                                                                                style={{ height: '24px', width: '100px', textAlign: 'left' }}
                                                                            >
                                                                                <Option value="Yes">Yes</Option>
                                                                                <Option value="No">No</Option>
                                                                            </Select>
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                            : ''}
                                    </div>
                                </div>
                                <div className="col-md-6 mt-3" style={{ zIndex: 999 }}>
                                    <div className="ms-3 mt-2">
                                        {commonInfo
                                            ? commonInfo?.interpretationmakers?.map((item) => {
                                                if (item.EO_isactive) {
                                                    return (
                                                        <div className="text-start d-flex eyeDataCont text-capitalize mb-1" key={item.id} style={{ lineHeight: 1.2 }}>
                                                            {item.markername !== 'Peak alpha frequency' && (
                                                                <>
                                                                    <span className="eyeData text-capitalize" style={{ fontFamily: 'RobotoRegular', fontWeight: 600, fontSize: '15px' }}>
                                                                        {item.markername}
                                                                    </span>
                                                                    :
                                                                    <span className="ms-1 text-end" style={{ fontSize: '15px', fontFamily: 'RobotoRegular', fontWeight: 200 }}>
                                                                        {item?.mfieldtype === 'textbox' ? (
                                                                            <Input
                                                                                className="rounded-0 ms-auto temp-input"
                                                                                onChange={handleIntChange(item, item.id, 'open')}
                                                                                defaultValue={
                                                                                    typeof item?.eyeopen === 'string' && item?.eyeopen?.toLowerCase?.() === 'true'
                                                                                        ? 'Yes'
                                                                                        : typeof item?.eyeopen === 'string' && item?.eyeopen?.toLowerCase?.() === 'false'
                                                                                            ? 'No'
                                                                                            : item?.eyeopen
                                                                                }
                                                                                style={{ height: '24px', width: '100px' }}
                                                                            />
                                                                        ) : (
                                                                            <Select
                                                                                className="rounded-0 ms-auto temp-input"
                                                                                onChange={(value) => handleIntChange(item, item.id, 'open')({ target: { value } })}
                                                                                defaultValue={
                                                                                    typeof item?.eyeopen === 'string'
                                                                                        ? item?.eyeopen.toLowerCase?.() === 'true'
                                                                                            ? 'Yes'
                                                                                            : item?.eyeopen.toLowerCase?.() === 'false'
                                                                                                ? 'No'
                                                                                                : item?.eyeopen.toLowerCase?.() === 'none'
                                                                                                ? ''
                                                                                                : item?.eyeopen
                                                                                        : item?.eyeopen == null || item?.eyeopen === 'none'
                                                                                            ? ''
                                                                                            : item?.eyeopen
                                                                                }
                                                                                style={{ height: '24px', width: '100px', textAlign: 'left' }}
                                                                            >
                                                                                <Option value="Yes">Yes</Option>
                                                                                <Option value="No">No</Option>
                                                                            </Select>
                                                                        )}
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                                return null;
                                            })
                                            : ''}
                                    </div>
                                </div>
                                <div className="text-end mb-3 ms-auto">
                                    <Button type="primary" className="btn-save ms-auto" loading={intloading} onClick={submitIntpForm}>
                                        Save
                                    </Button>
                                </div>
                            </div>
                        ) : !loading5 ? (
                            <div>
                                {commonInfo ? (
                                    <div className="d-flex w-100">
                                       <div className="mt-2 w-50">
                                            {commonInfo?.interpretationmakers?.map((item, index) => {
                                                if (item.EC_isactive) {
                                                    if (item.markername === 'F3>F4 Asymmetry Present') {
                                                        return (
                                                            <div
                                                                key={`asymmetry-${item.markername}-${index}`}
                                                                className="d-flex px-1  asyCont"
                                                                style={{ margin: '24px 13px', padding: '12px 4px 4px', border: '2px solid #636c82', borderRadius: '30px', position: 'relative' }}
                                                            >
                                                                <div className="top-circle" style={{ position: 'absolute', top: '-27px', left: '-5px' }}>
                                                                    <img src={Brain} style={{ zIndex: 2, position: 'relative', width: '78%', height: '78%', top: '6px', left: '6px' }} />
                                                                    <div className="inner-circle"></div>
                                                                </div>
                                                                <div className="rectangle marker-size" style={{ position: 'absolute', top: '-21px', left: '28px' }}>
                                                                    <h6 className="m-0 white" style={{ position: 'absolute', top: '10px', left: '26px', color: '#fff' }}>
                                                                        Alpha Asymmetries
                                                                    </h6>
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100 px-4  " style={{ marginTop: '14px' }}>
                                                                    {/* F3 > F4 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                            <div
                                                                                className={`number ${
                                                                                    typeof commonInfo?.interpretationmakers?.find((item) => item?.markername === 'F3>F4 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                    commonInfo?.interpretationmakers?.find((item) => item?.markername === 'F3>F4 Asymmetry Present').eyeclosed.toLowerCase?.() === 'true'
                                                                                    ? 'text-indication'
                                                                                    : ''
                                                                                }`}
                                                                                >
                                                                                {typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                commonInfo?.interpretationmakers?.find((item) => item?.markername === 'F3>F4 Asymmetry Present').eyeclosed.toLowerCase?.() === 'true'
                                                                                    ? 'Yes'
                                                                                    : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            F3 &gt; F4
                                                                        </h5>
                                                                    </div>

                                                                    {/* F7 > F8 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div
                                                                                    className={`number ${ typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                        commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeclosed.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}
                                                                                >
                                                                                    { typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                    commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeclosed.toLowerCase?.() === 'true'
                                                                                        ? 'Yes'
                                                                                        : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            F7 &gt; F8
                                                                        </h5>
                                                                    </div>

                                                                    {/* P4 > P3 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div
                                                                                    className={`number ${ typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                        commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeclosed.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}
                                                                                >
                                                                                    { typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeclosed === 'string' &&
                                                                                     commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeclosed.toLowerCase?.() === 'true'
                                                                                        ? 'Yes'
                                                                                        : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            P4 &gt; P3
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (item?.markername === 'Mu Rhythm Present' && item?.eyeclosed !== '' && item?.eyeclosed !== null && item?.eyeclosed?.toLowerCase?.() !== 'none') {
                                                        return (
                                                            <div
                                                                key={`mu-rhythm-${item.markername}-${index}`}
                                                                className="d-flex px-1 asyCont"
                                                                style={{ margin: '24px 13px 32px 13px', padding: '2px 4px 0px', border: '2px solid #636c82', borderRadius: '30px', position: 'relative' }}
                                                            >
                                                                <div className="top-circle" style={{ position: 'absolute', top: '-27px', left: '-5px' }}>
                                                                    <img src={Brain} style={{ zIndex: 2, position: 'relative', width: '78%', height: '78%', top: '6px', left: '6px' }} />
                                                                    <div className="inner-circle"></div>
                                                                </div>
                                                                <div className="rectangle marker-size" style={{ position: 'absolute', top: '-21px', left: '28px' }}>
                                                                    <h6 className="m-0 white" style={{ position: 'absolute', top: '10px', left: '25px', color: '#fff' }}>
                                                                        Mu Rhythm
                                                                    </h6>
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100 align-items-center px-4" style={{ padding: '37px 0px 16px 0px' }}>
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div className={`number ${typeof item?.eyeclosed === 'string' &&
                                                                                     item?.eyeclosed.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}>{item?.eyeclosed.toLowerCase?.() === 'true' ? 'Yes' : 'No'}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item?.eyeclosed.toLowerCase?.() === 'true' ? (
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                                                            {' '}
                                                                            This rhythm appears in the eyes closed condition{' '}
                                                                        </h5>
                                                                    ) : (
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                                                            {' '}
                                                                            This rhythm does not appear
                                                                        </h5>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (
                                                        item.markername !== 'F3>F4 Asymmetry Present' &&
                                                        item.markername !== 'F7>F8 Asymmetry Present' &&
                                                        item.markername !== 'P4>P3 Asymmetry Present' &&
                                                        item.markername !== 'Peak alpha frequency' &&
                                                        item.markername !== 'Mu Rhythm Present'
                                                    ) {
                                                        return (
                                                            <div key={`slider-${item.markername}-${index}`} className="p-2 mt-3">
                                                                <Sliders
                                                                    // className="p-2"
                                                                    data={{
                                                                        value: item.eyeclosed,
                                                                        title: item.markername,
                                                                        mfieldtype: item.mfieldtype,
                                                                        type: 'normal',
                                                                        eyeType: 'eyeClosed',
                                                                        item: item,
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                }
                                                return null
                                            })}
                                        </div>

                                        <div className="mt-2 w-50">
                                            {commonInfo?.interpretationmakers?.map((item, index) => {
                                                if (item.EO_isactive) {
                                                    if (item.markername === 'F3>F4 Asymmetry Present') {
                                                        return (
                                                            <div
                                                                key={`asymmetry-${item.markername}-${index}`}
                                                                className="d-flex px-1 asyCont"
                                                                style={{ margin: '24px 13px', padding: '12px 4px 4px', border: '2px solid #636c82', borderRadius: '30px', position: 'relative' }}
                                                            >
                                                                <div className="top-circle" style={{ position: 'absolute', top: '-27px', left: '-5px' }}>
                                                                    <img src={Brain} style={{ zIndex: 2, position: 'relative', width: '78%', height: '78%', top: '6px', left: '6px' }} />
                                                                    <div className="inner-circle"></div>
                                                                </div>
                                                                <div className="rectangle marker-size" style={{ position: 'absolute', top: '-21px', left: '28px' }}>
                                                                    <h6 className="m-0 white" style={{ position: 'absolute', top: '10px', left: '26px', color: '#fff' }}>
                                                                        Alpha Asymmetries
                                                                    </h6>
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100 px-4  " style={{ marginTop: '14px' }}>
                                                                    {/* F3 > F4 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div
                                                                                    className={`number ${ typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                        commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeopen.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}
                                                                                >
                                                                                    { typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                     commonInfo?.interpretationmakers?.find((item) => item.markername === 'F3>F4 Asymmetry Present')?.eyeopen.toLowerCase?.() === 'true' ? 'Yes' : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            F3 &gt; F4
                                                                        </h5>
                                                                    </div>

                                                                    {/* F7 > F8 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div
                                                                                    className={`number ${ typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                        commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeopen.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}
                                                                                >
                                                                                    { typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                    commonInfo?.interpretationmakers?.find((item) => item.markername === 'F7>F8 Asymmetry Present')?.eyeopen.toLowerCase?.() === 'true' ? 'Yes' : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            F7 &gt; F8
                                                                        </h5>
                                                                    </div>

                                                                    {/* P4 > P3 */}
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div
                                                                                    className={`number ${ typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                        commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeopen.toLowerCase() === 'true' ? 'text-indication' : ''}`}
                                                                                >
                                                                                    {typeof commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeopen === 'string' &&
                                                                                    commonInfo?.interpretationmakers?.find((item) => item.markername === 'P4>P3 Asymmetry Present')?.eyeopen.toLowerCase() === 'true' ? 'Yes' : 'No'}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px', marginBottom: '4px' }}>
                                                                            P4 &gt; P3
                                                                        </h5>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (item?.markername === 'Mu Rhythm Present' && item?.eyeopen !== '' && item?.eyeopen !== null && item?.eyeopen?.toLowerCase?.() !== 'none') {
                                                        return (
                                                            <div
                                                                key={`mu-rhythm-${item.markername}-${index}`}
                                                                className="d-flex px-1 asyCont"
                                                                style={{ margin: '32px 13px 32px 13px', padding: '2px 4px 0px', border: '2px solid #636c82', borderRadius: '30px', position: 'relative' }}
                                                            >
                                                                <div className="top-circle" style={{ position: 'absolute', top: '-27px', left: '-5px' }}>
                                                                    <img src={Brain} style={{ zIndex: 2, position: 'relative', width: '78%', height: '78%', top: '6px', left: '6px' }} />
                                                                    <div className="inner-circle"></div>
                                                                </div>
                                                                <div className="rectangle marker-size" style={{ position: 'absolute', top: '-21px', left: '28px' }}>
                                                                    <h6 className="m-0 white" style={{ position: 'absolute', top: '10px', left: '25px', color: '#fff' }}>
                                                                        Mu Rhythm
                                                                    </h6>
                                                                </div>
                                                                <div className="d-flex justify-content-between w-100 align-items-center px-4" style={{ padding: '37px 0px 16px 0px' }}>
                                                                    <div className="d-flex flex-column">
                                                                        <div className="circle d-flex flex-column justify-content-center align-items-center">
                                                                            <div className="inner-ring d-flex justify-content-center align-items-center">
                                                                                <div className={`number ${typeof item?.eyeopen === 'string' &&
                                                                                    item?.eyeopen.toLowerCase?.() === 'true' ? 'text-indication' : ''}`}>{item?.eyeopen.toLowerCase?.() === 'true' ? 'Yes' : 'No'}</div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {item?.eyeopen.toLowerCase?.() === 'true' ? (
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                                                            {' '}
                                                                            This rhythm appears in the eyes opened condition{' '}
                                                                        </h5>
                                                                    ) : (
                                                                        <h5 className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '17px' }}>
                                                                            {' '}
                                                                            This rhythm does not appear
                                                                        </h5>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    } else if (
                                                        item.markername !== 'F3>F4 Asymmetry Present' &&
                                                        item.markername !== 'F7>F8 Asymmetry Present' &&
                                                        item.markername !== 'P4>P3 Asymmetry Present' &&
                                                        item.markername !== 'Peak alpha frequency' &&
                                                        item.markername !== 'Mu Rhythm Present'
                                                    ) {
                                                        return (
                                                            <div key={`slider-${item.markername}-${index}`} className="p-2 mt-3">
                                                                <Sliders
                                                                    data={{
                                                                        value: item.eyeopen,
                                                                        title: item.markername,
                                                                        mfieldtype: item.mfieldtype,
                                                                        type: 'nomal',
                                                                        eyeType: 'eyeOpened',
                                                                        item: item,
                                                                    }}
                                                                />
                                                            </div>
                                                        );
                                                    }
                                                }
                                                return null
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>
                        ) : (
                            <>
                                <div className="d-flex">
                                    <div className="w-50 pt-2">
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                    </div>
                                    <div className="w-50 pt-2">
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                        <Skeleton className="p-2" active />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                    <div className="footer" style={{ textAlign: 'center', position:'relative' }}>
                        <div style={{position:'absolute', right: '50px', bottom:'50px'}}> 
                            <div className=''>
                                <Image className="neuroImg" src={Ebook} width={120} height={80} style={{ width: 'auto' }} preview={false} />
                            </div>
                            <h6 className='' style={{width:'250px', fontSize:'10px'}}>
                                Scan the QR code to access our exclusive e-books, tailored to help you understand 
                                your report results and take actionable steps to improve your brain health
                            </h6>
                        </div>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'FiraRegular', fontSize: '10px', fontWeight:500 }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            )}
            <SummaryInterpretation
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

export default InterpretationTemplate;