import React, { useEffect, useMemo, useState } from 'react';
import { Template3Logo, HeaderIcon, RibbonIcon } from 'components/shared/TemplateImages';
import { useSelector, useDispatch, footerText, url2, interpretText, pdrText, createMarkup } from 'components/shared/CompVariables';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Image, message } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import BgImage from 'assets/img/new-template-icons/bg-green1.png';
import MedicationTemplate from './MedicationTemplate';
import { EditIcon } from 'assets/img/custom-icons';
import InterpretationEditor from '../../editors/InterpretationEditor';
import { getInterpretationFindings, getPdrData } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { Input, Select } from 'components/shared/FormComponent';
import { saveInterpretationMarker } from 'services/actions/pipeline/stepwizardAction';
import { getAssociateCommon } from 'services/actions/commonServiceAction';
import PdrEditor from '../../editors/PdrEditor';

const { Option } = Select;
const A4_PAGE_HEIGHT_PX = 548;
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
const InterpretationPDR: React.FC<ChildProps> = ({
    zoom,
    intEdit,
    released,
    handleInterpretChange,
    isMedicationPast,
    glanceEdit,
    handleGlanceChange,
    handlePdrChange,
    pdrEdit,
    medicEdit,
    handleMedicChange,
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
}) => {
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { pdrInfo, intFields } = useSelector((state: any) => state.recAnalysis);
    const dispatch = useDispatch();
    const location = useLocation();
    const { topoResultInfo, resultInfo, success3, loading3, error3 } = useSelector((state: any) => state.wizard);
    const [isOverflow, setIsOverflow] = useState(false);
    const [maxValue, setMaxValue]: any = useState();
    const ageValue = commonInfo?.pnt_age || null;
    const thetaBetaRatio = parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec);
    const thetaBetaRatioEo = parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo);
    const alphaBetaRatio = parseFloat(commonInfo?.Alpha_beta_ratio_value);
    const pdrValue = parseFloat(commonInfo?.pdr_value);
    const age = commonInfo?.pnt_age;
    const alphaAsymmetry = commonInfo?.Alpha_Asymmetry;
    const pafValue = parseFloat(commonInfo?.paf_value);
    const [markerData, setMarkerData]: any = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;
    const [imageBases, setImageBases] = useState({
        ecAbs: '',
        eoAbs: '',
        ecRel: '',
        eoRel: '',
        pdrImg: '',
    });
    const [charCount, setCharCount] = useState(0);
    const paragraph = document.querySelector(".eeg-text") as HTMLElement;
    const plainText = paragraph?.innerText?.replace(/<[^>]*>/g, '');
    const intLength = plainText?.length;

    useEffect(() => {
        const paragraph = document.querySelector(".eeg-text") as HTMLElement;
        if (paragraph) {
            const plainText = paragraph.innerText.replace(/<[^>]*>/g, '');
            setCharCount(plainText?.length);
        }
    }, [intFields?.data?.description, intLength]);

    const containerStyle = {
        // Other CSS properties for the container
        backgroundSize: 'cover' /* Adjust to your needs */,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: 'auto' /* Adjust to your needs */,
        width: '123px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '5px',
        backgroundImage: `url(${BgImage})`,
    };
    const pdrTblCell = {
        borderTop: '1px solid #978a63',
        borderLeft: '1px solid #978a63',
        fontWeight: 500,
        borderRight: '1px solid #978a63',
        fontSize: '10px',
        fontFamily: 'RobotoRegular',
    };

    const imageUrlToBase64 = async (url: string) => {
        if (url && url !== '') {
            try {
                const response = await fetch(url);
                const blob = await response?.blob();
                return new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (error) {
                console.error('Error converting image to Base64:', error);
                return '';
            }
        }
        return '';
    };
    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }
    useEffect(() => {
        if (topoResultInfo?.topo_path) {
            const fetchImages = async () => {
                const urls = {
                    ecAbs: topoResultInfo?.topo_path?.EC_absolutepow_path ? topoResultInfo?.topo_path?.EC_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path.EC_absolutepow_path : '' : null,
                    eoAbs: topoResultInfo?.topo_path?.EO_absolutepow_path ? topoResultInfo?.topo_path?.EO_absolutepow_path?.startsWith('https:') ? topoResultInfo?.topo_path.EO_absolutepow_path : '' : null,
                    ecRel: topoResultInfo?.topo_path?.EC_relativepow_path ? topoResultInfo?.topo_path?.EC_relativepow_path?.startsWith('https:') ? topoResultInfo?.topo_path.EC_relativepow_path : '' : null,
                    eoRel: topoResultInfo?.topo_path?.EO_relativepow_path ? topoResultInfo?.topo_path?.EO_relativepow_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_relativepow_path : '' : null,
                    pdrImg: topoResultInfo?.topo_path?.EC_pdr_path ? topoResultInfo?.topo_path?.EC_pdr_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_pdr_path : '' : null,
                };
                const [ecAbs, eoAbs, ecRel, eoRel, pdrImg] = await Promise.all(Object.values(urls)?.map((url: any) => imageUrlToBase64(url)));

                setImageBases({ ecAbs, eoAbs, ecRel, eoRel, pdrImg });
            };
            fetchImages();
        }
    }, [topoResultInfo]);

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

    // const handleIntChange = (val: any, id: any, status: string, e: any) => {
    //     const value = e.target.value.toLowerCase();
    //     setMarkerData((current: any) =>
    //         current?.map((obj: any) => {
    //             if (obj?.id === id) {
    //                 if (status === 'closed') {
    //                     return { ...obj, eyeclosed: value?.toLowerCase() === 'yes' ? 'true' : value?.toLowerCase() === 'no' ? 'false' : value };
    //                 } else {
    //                     return { ...obj, eyeopen: value?.toLowerCase() === 'yes' ? 'true' : value?.toLowerCase() === 'no' ? 'false' : value };
    //                 }
    //             }
    //             return obj;
    //         }),
    //     );
    // };
    const handleIntChange = (val, id, status) => (e) => {
        const value = e.target.value;

        if (status == 'close') {
            if (val.mfieldtype == 'radio') {
                setMarkerData((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: value?.toLowerCase?.() === 'yes' ? 'true' : 'false' };
                        }

                        return obj;
                    })
                );
            } else {
                setMarkerData((current) =>
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
                setMarkerData((current) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeopen: value?.toLowerCase?.() == 'yes' ? 'true' : 'false' };
                        }

                        return obj;
                    })
                );
            } else {
                setMarkerData((current) =>
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
    const submitForm = () => {
        const fdata: any = [];
        markerData?.forEach((items, i) => {
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
    const renderMarkers = (isActive: boolean) =>
        markerData
            ?.filter((item: any) => item[isActive ? 'EC_isactive' : 'EO_isactive'])
            ?.map((item: any) => (
                <div className="text-start d-flex eyeDataCont" key={item.id} style={{ lineHeight: 1.2 }}>
                    {glanceEdit ? (
                        <>
                            <div className="eyeData col-md-8" style={{ fontFamily: 'RobotoRegular', fontWeight: 600, fontSize: '15px' }}>
                                {item.markername}:
                            </div>
                            <div className="ms-1 col" style={{ fontSize: '15px', fontFamily: 'RobotoRegular', fontWeight: 200, ...getStyle(item, 'eyeOpen', commonInfo?.pnt_age) }}>
                                {isActive ? (
                                    <Input
                                        onChange={(e) => handleIntChange(item, item.id, 'closed')}
                                        className="temp-input mb-1"
                                        value={item?.eyeclosed?.toLowerCase?.() === 'true' ? 'Yes' : item?.eyeclosed.toLowerCase?.() === 'false' ? 'No' : item?.eyeclosed}
                                    />
                                ) : (
                                    <Input
                                        onChange={(e) => handleIntChange(item, item.id, 'open')}
                                        className="temp-input mb-1"
                                        value={item?.eyeopen?.toLowerCase?.() === 'true' ? 'Yes' : item?.eyeopen?.toLowerCase?.() === 'false' ? 'No' : item?.eyeopen}
                                    />
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <span className="eyeData text-capitalize" style={{ fontFamily: 'RobotoRegular', fontWeight: 600, fontSize: '15px' }}>
                                {item?.markername}
                            </span>
                            :
                            <span className="ms-1 text-end" style={{ fontSize: '15px', fontFamily: 'RobotoRegular', fontWeight: 200, ...getStyle(item, isActive ? 'eyeClosed' : 'eyeOpen', commonInfo?.pnt_age) }}>
                                {isActive ? (
                                    <>{item?.eyeclosed?.toLowerCase?.() === 'true' ? 'Yes' : item?.eyeclosed?.toLowerCase?.() === 'false' ? 'No' : item?.eyeclosed}</>
                                ) : (
                                    <>{item?.eyeopen?.toLowerCase?.() === 'true' ? 'Yes' : item?.eyeopen?.toLowerCase?.() === 'false' ? 'No' : item?.eyeopen}</>
                                )}
                            </span>
                        </>
                    )}
                </div>
            ));

    useEffect(() => {
        if (commonInfo) {
            if (commonInfo?.interpretationmakers) {
                setMarkerData(commonInfo?.interpretationmakers);
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
    const series1 = [
        {
            name: 'High PDR',
            data: [12, 12, 12, 12],
            type: 'area',
        },
        {
            name: 'Within expected range',
            data: [11, 11.9, 11.4, 10.5],
            type: 'area',
        },
        {
            name: 'Low PDR',
            data: [8, 10, 9, 8],
            type: 'area',
        },
        {
            name: 'Your PDR (at Pz)',
            data: ageValue !== null ? Array.from({ length: 4 }, (_, index) => (index === categoryIndex ? commonInfo?.pdr_value : null)) : [],
            type: 'scatter',
        },
        {
            name: 'Peak Alpha site',
            data: ageValue !== null ? Array.from({ length: 4 }, (_, index) => (index === categoryIndex ? commonInfo?.paf_value : null)) : [],
            type: 'scatter',
        },
    ];
    const options: ApexOptions = useMemo(() => {
        return {
            chart: {
                type: 'area',
                stacked: true,
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            legend: {
                show: true,
                position: 'bottom',
                fontFamily: 'RobotoRegular',
                offsetY: -10,
                markers: {
                    // Customize marker properties if needed; otherwise, remove this section
                    strokeColor: '#000', // Example of a valid property
                    strokeWidth: 2, // Example of a valid property
                    shape: 'square', // Example of a valid property
                    fillColors: ['#008FFB', '#00E396', '#FEB019', '#FF0000', '#630436'], // Example of a valid property
                },
            },
            xaxis: {
                categories: [
                    ['<8 year', 'old'],
                    ['9-45 year', 'old'],
                    ['45-75 year', 'old'],
                    ['75+ year', 'old'],
                ],
            },
            yaxis: {
                min: 6,
                max: 12,
                tickAmount: 3,
                tickInterval: 2,
            },
            fill: {
                opacity: 1,
            },
            grid: {
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
            },
            colors: ['#008FFB', '#00E396', '#FEB019', '#FF0000', '#630436'],
        };
    }, []);

    const isOutsideRange = (value, min, max) => {
        return value < min || value > max;
    };

    const getStyle = (item, markerType, age) => {
        const eyeClosedThetaBeta = parseFloat(item?.eyeclosed);
        const eyeOpenThetaBeta = parseFloat(item?.eyeopen);
        const eyeData = markerType === 'eyeClosed' ? parseFloat(item?.eyeclosed) : parseFloat(item?.eyeopen);
        const eyeData1 = markerType === 'eyeClosed' ? item?.eyeclosed?.toLowerCase?.() === 'true' : item?.eyeopen?.toLowerCase?.() === 'true';
        const style = { color: '' };
        if (item?.markername === 'Alpha/beta ratio' && isOutsideRange(eyeData, 6, 12)) {
            style.color = 'red';
        } else if (item.markername === 'Peak alpha frequency' && isOutsideRange(eyeData, 10, 12)) {
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

    const intCallbackFunc = () => {
        handleInterpretChange();
        getInterpretContent();
    };
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

    const getThetaBetaRatioMessage = () => {
        const results: any = [];

        if (thetaBetaRatio >= 3.0) {
            results.push(' The TBR is elevated and regularly presents with symptoms of ADHD, including distractibility, inattentiveness, and lowered impulse control.');
        }
        if (thetaBetaRatio < 3.0 && thetaBetaRatio < thetaBetaRatioEo) {
            results.push(' While the TBR is in the expected range, it increases in the eyes-opened condition. This phenomenon is known as demand task cognitive slowing and regularly presents with symptoms of panic, OCD, or feelings of overwhelm. It should be noted that this profile responds poorly to most medications targeting these symptoms.');
        }
        if (thetaBetaRatio >= 3.0 && thetaBetaRatio < thetaBetaRatioEo) {
            results.push(' Moreover, this ratio increases in the eyes-opened conditions. This phenomenon is known as demand task cognitive slowing and regularly presents with symptoms of panic, OCD, or feelings of overwhelm. It should be noted, this profile responds poorly to most medications targeting these symptoms.');
        }

        // If no conditions were met, return a default value
        if (results.length === 0) {
            return '';
        }
        // Return all results joined by a space
        return results.join(' ');
    };

    const getAlphaAsymmetryMessage = () => {
        switch (alphaAsymmetry) {
            case 'F3>F4,F7>F8,P4>P3':
                return ' FAA and PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            case 'F3>F4,F7>F8':
            case 'F3>F4':
            case 'F7>F8':
                return ' FAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, and low motivation.';
            case 'F3>F4,P4>P3':
            case 'F7>F8,P4>P3':
                return ' FAA and PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            case 'P4>P3':
                return ' PAA presence, as demonstrated in this recording, has been reported in populations with depressed mood, ruminating thought patterns, lower motivation, and negative self-referencing.';
            default:
                return '';
        }
    };

    const getAlphaBetaRatioMessage = () => {
        if (alphaBetaRatio < 6.0) {
            return ' The ABR is low and will frequently accompany anxiety spectrum concerns and sleep disturbances.';
        }
        if (alphaBetaRatio > 12.0) {
            return ' Additionally, the ABR is quite elevated and will frequently accompany lower cognitive energy, daytime fatigue, and mood lability.';
        }
        return '';
    };

    const getPdrValueMessage = () => {
        const ageRanges = [
            { minAge: 0, maxAge: 10, thresholds: [10.0, 8.0] },
            { minAge: 10, maxAge: 45, thresholds: [12.0, 10.0] },
            { minAge: 45, maxAge: 55, thresholds: [12.0, 9.5] },
            { minAge: 55, maxAge: 65, thresholds: [12.0, 9.0] },
            { minAge: 65, maxAge: Infinity, thresholds: [12.0, 8.5] },
        ];

        const range = ageRanges?.find((r) => age >= r.minAge && age < r.maxAge);
        if (!range) return '';

        if (pdrValue > range.thresholds[0]) {
            return ' The PDR is elevated in this recording and often associated with anxiety spectrum concerns and sleep disturbances. It should be noted that this pattern responds poorly to many medications.';
        }
        if (pdrValue >= range.thresholds[1] && pdrValue <= range.thresholds[0]) {
            return '';
        }
        return ' The PDR is low and will often present with non-specific cognitive processing difficulties and feelings of overwhelm due to difficulty processing.';
    };

    const getMuRhythmMessage = () => {
        if (commonInfo?.interpretationmakers?.some((marker: any) => marker?.markername === 'Mu Rhythm Present' && (marker?.eyeopen === 'true' || marker?.eyeclosed === 'true'))) {
            if (pafValue >= 7.0 && pafValue <= 15.0) {
                return ' Finally, there is a mu rhythm present in this recording, which is commonly associated with ASD and ADHD populations. Clinically, this often accompanies social anxiety and social cognitive processing deficits. In some populations, including youth and the elderly, this may be considered a normal variant.';
            }
        }
        return '';
    };

    const pdrCallbackFunc = () => {
        handlePdrChange();
        getPdrInfo();
    };
    return (
        <>
            {!commonInfo?.interpretation_flag ? (
                ''
            ) : (
                <div id="page3" className={`page-three bg-white p-2 mx-auto mt-2 ${isOverflow ? 'page-overflow' : ''}`} style={{ zoom: zoom }}>
                    <div className="page-content">
                        <div className="page-header d-flex">
                            <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                            <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                here are your qeeg results
                            </h5>
                            <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                        </div>
                        <div className="page-body page-hd">
                            <div style={{ height: '430px' }}>
                                <h4 className="text-primary" style={{ fontFamily: 'RobotoRegular', fontSize: '33px', fontWeight: 500 }}>
                                    Interpretation
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleInterpretChange()}>
                                        <EditIcon />
                                    </span>
                                </h4>
                                {intEdit ? (
                                    <InterpretationEditor intCallbackFunc={intCallbackFunc} isMedicationPast={isMedicationPast} />
                                ) : (
                                    <>
                                        {intFields && intFields?.data ? (
                                             <div
                                             className={`markuphtml text-overflow eeg-text 
                                                 ${charCount > 2000 ? 'small-font template1' : ''} 
                                                 ${charCount > 1400 && charCount <= 2000 ? 'medium-font template1' : ''} 
                                                 ${charCount <= 1400 ? 'large-font template1' : ''}`}
                                             style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3}}
                                             dangerouslySetInnerHTML={createMarkup(intFields?.data?.description)}
                                         ></div>
                                        ) : (
                                            <p className="fs-16" style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3 }}>
                                                The quantitative EEG topographical analysis reveals potential patterns that align with the reported clinical symptoms.
                                                {getThetaBetaRatioMessage()}
                                                {getAlphaAsymmetryMessage()}
                                                {getAlphaBetaRatioMessage()}
                                                {getPdrValueMessage()}
                                                {getMuRhythmMessage()}
                                                {isMedicationPast ? ' Medications may normalize an otherwise abnormal EEG. ' : ''}
                                                Careful clinical correlation is advised. A follow-up qEEG is recommended after therapeutic interventions to objectively assess treatment efficacy and monitor any
                                                changes in brain function.
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="mb-5 ">
                                <h4 className="text-primary text-center" style={{ fontFamily: 'RobotoRegular', fontSize: '33px', fontWeight: 500 }}>
                                    Your numbers at a glance
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handleGlanceChange()}>
                                        <EditIcon />
                                    </span>
                                </h4>
                                <div className="d-flex w-100 mx-auto mark-flex">
                                    <div className="col-md-6">
                                        <h6 className="text-center text-primary fs-18" style={{ fontFamily: 'RobotoLight' }}>
                                            Eyes-closed condition
                                        </h6>
                                        {glanceEdit ? "" : <div className="w-75 mx-auto">{renderMarkers(true)}</div>}
                                    </div>
                                    <div className="col-md-6">
                                        <h6 className="text-center text-primary fs-18" style={{ fontFamily: 'RobotoLight' }}>
                                            Eyes-opened condition
                                        </h6>
                                        {glanceEdit ? "" : <div className="w-75 mx-auto">{renderMarkers(false)}</div>}
                                    </div>
                                </div>

                                {glanceEdit ? (
                                    <>
                                        <div className="row m-0 px-4 justify-content-around glanceData">
                                            <div className="col-md-6 mt-3" style={{ zIndex: 999 }}>
                                                <div className="ms-3 mt-2">
                                                    {commonInfo
                                                        ? commonInfo?.interpretationmakers?.map((item: any) => {
                                                            if (item.EC_isactive) {
                                                                return (
                                                                    <div className="text-start d-flex eyeDataCont mb-1" key={item.id} style={{ lineHeight: 1.2 }}>
                                                                        {(
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
                                                                                                    ? item?.eyeclosed?.toLowerCase?.() === 'true'
                                                                                                        ? 'Yes'
                                                                                                        : item?.eyeclosed?.toLowerCase?.() === 'false'
                                                                                                            ? 'No'
                                                                                                            : item?.eyeclosed?.toLowerCase?.() === 'none'
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
                                                                        {(
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
                                                                                                    ? item?.eyeopen?.toLowerCase?.() === 'true'
                                                                                                        ? 'Yes'
                                                                                                        : item?.eyeopen?.toLowerCase?.() === 'false'
                                                                                                            ? 'No'
                                                                                                            : item?.eyeopen?.toLowerCase?.() === 'none'
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

                                        </div>
                                        <div className="text-end">
                                            <Button type="primary" loading={loading3} onClick={submitForm}>
                                                Save
                                            </Button>
                                        </div></>
                                ) : (
                                    ''
                                )}
                            </div>
                            <div>
                                <div className="d-flex ms-2">
                                    <Image src={imageBases?.ecAbs} height="80px" width="auto" />
                                    <Image src={imageBases?.eoAbs} height="80px" width="auto" />
                                </div>
                                <div className="d-flex ms-2">
                                    <Image src={imageBases?.ecRel} height="80px" width="auto" />
                                    <Image src={imageBases?.eoRel} height="80px" width="auto" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer fs-12 ps-2 pe-2" style={{ fontFamily: 'RobotoRegular' }}>
                        <div className="mb-0 d-flex my-auto">
                            <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '8px' }}>
                                {interpretText}
                            </p>
                            <div className="col-md-2 my-auto text-center pe-0">
                                <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                            </div>
                        </div>
                        {footerText}
                    </div>
                </div>
            )}
            <div className="html2pdf__page-break"></div>
            <div id="page4" className={`page-four bg-white p-2 mx-auto mt-2 ${isOverflow ? 'page-overflow' : ''}`} style={{ zoom: zoom }}>
                <div className="page-content">
                    <div className="page-header d-flex">
                        <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                        <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                            understanding your qeeg results
                        </h5>
                        <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                    </div>
                    <div className="page-body page-hd">
                        <div className="d-flex">
                            <div className="col-md-5">
                                <h3 className="text-primary text-center" style={{ fontFamily: 'RobotoRegular', fontSize: '30px' }}>
                                    Posterior Dominant Rhythm (PDR)
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handlePdrChange()}>
                                        <EditIcon />
                                    </span>
                                </h3>
                                {pdrEdit ? (
                                    <PdrEditor pdrCallbackFunc={pdrCallbackFunc} />
                                ) : (
                                    <>
                                        {pdrInfo && pdrInfo?.data ? (
                                            <div
                                                className="fs-16 markuphtml text-overflow"
                                                style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3 }}
                                                dangerouslySetInnerHTML={createMarkup(pdrInfo?.data?.description)}
                                            ></div>
                                        ) : (
                                            <p className="fs-16" style={{ fontFamily: 'RobotoRegular', paddingLeft: '20px', textAlign: 'center' }}>
                                                Alpha is the baseline rhythm of the brain. It should have the greatest amplitude at the back of the head. Alpha should peak posteriorly between
                                                {commonInfo?.pnt_age < 10
                                                    ? '8-10Hz.'
                                                    : commonInfo?.pnt_age >= 10 && commonInfo?.pnt_age < 45
                                                        ? '10-12Hz.'
                                                        : commonInfo?.pnt_age >= 45 && commonInfo?.pnt_age < 55
                                                            ? '9.5-12Hz.'
                                                            : commonInfo?.pnt_age >= 55 && commonInfo?.pnt_age < 65
                                                                ? '9-12Hz.'
                                                                : commonInfo?.pnt_age >= 65 && commonInfo?.pnt_age < 75
                                                                    ? '8.5-12Hz.'
                                                                    : commonInfo?.pnt_age >= 75
                                                                        ? ' 8-12Hz.'
                                                                        : ''}
                                                <span style={{ fontFamily: 'RobotoMedium' }}>Your PDR is {commonInfo?.pdr_value}.</span>
                                            </p>
                                        )}
                                    </>
                                )}
                            </div>
                            <div className="col" style={{ marginTop: '-20px' }}>
                                <h4 className="text-dark text-center ms-3" style={{ fontFamily: 'RobotoRegular', fontSize: '18px', fontWeight: 500 }}>
                                    PDR by Age
                                </h4>
                                <Chart className="pdrChart" options={options} series={series1} type="area" height={260} width={440} style={{ marginTop: '-20px', marginLeft: '15px' }} />
                            </div>
                        </div>
                        <div className="d-flex" style={{ marginTop: '-10px' }}>
                            <div className="col-md-8 text-end">
                                <Image src={imageBases.pdrImg} height="370px" width="auto" />
                            </div>
                            <div className="col">
                                <div className="bg-green px-2 tabl-cont" style={containerStyle}>
                                    <div className=" d-flex" style={{ width: '100%' }}>
                                        <div className="w-100 pt-0">
                                            <div className="fw-bold text-center" style={{ fontSize: '10px', fontFamily: 'RobotoRegular' }}>
                                                Ch
                                            </div>
                                            {resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_channels?.map((item, i) => {
                                                return (
                                                    <div className="pdr-tbl-cell text-center bg-white me-1 px-1 right-border" key={i} style={pdrTblCell}>
                                                        {item}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="w-100 pt-0">
                                            <div className="fw-bold text-center" style={{ fontSize: '10px', fontFamily: 'RobotoRegular' }}>
                                                APF
                                            </div>
                                            {resultInfo?.req_info?.alpha_peak_EC?.alpha_peak_value?.map((item, i) => {
                                                return (
                                                    <div
                                                        className={`pdr-tbl-cell px-1 text-center right-border ${maxValue == i ? 'bg-success text-white' : 'bg-white'}`}
                                                        key={i}
                                                        style={pdrTblCell}
                                                    >
                                                        {item}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex mb-2">
                                    <div className="me-1 my-auto" style={{ width: '14px', height: '14px', background: 'green' }}></div>
                                    <span className="ms-1" style={{ fontFamily: 'RobotoRegular' }}>
                                        Alpha Peak Value
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex">
                            <div className="col text-center">
                                <h5 className="text-primary  text-center fs-24 mb-0 mx-auto" style={{ fontFamily: 'RobotoRegular', fontSize: '24px' }}>
                                    Alpha Asymmetry
                                </h5>
                                <h5 className="text-dark my-1 text-center fs-20 mx-auto" style={{ fontFamily: 'RobotoRegular', fontWeight: 400 }}>
                                    {commonInfo?.Alpha_Asymmetry || ''}
                                </h5>
                                <p style={{ fontFamily: 'RobotoRegular', fontSize: '13px', lineHeight: 1.3, paddingLeft: '10px', paddingRight: '10px' }}>
                                    These patterns, when present, have been associated with depressed mood and negative biases. It refers to the asymmetry of alpha power in the left frontal
                                    or right posterior sites, which are responsible for negative thoughts, emotions, and self-talk.
                                </p>
                            </div>
                            <div className="col text-center">
                                <h5 className="text-primary text-center fs-24 mb-0 mx-auto" style={{ fontFamily: 'RobotoRegular', fontSize: '24px' }}>
                                    Alpha/beta Ratio
                                </h5>
                                <h5 className="text-dark text-center my-1 fs-20 mx-auto" style={{ fontFamily: 'RobotoRegular', fontWeight: 400 }}>
                                    {commonInfo?.Alpha_beta_ratio_value || ''}
                                </h5>
                                <p style={{ fontFamily: 'RobotoRegular', fontSize: '13px', paddingLeft: '10px', paddingRight: '10px', lineHeight: 1.3 }}>
                                    The alpha/beta ratio (ABR) is measured in the posterior sites and is related to your brain’s arousal level. A value below 6 is often associated with
                                    anxiety, whereas a value above 12 may present with low cognitive energy or fatigue.
                                    <span style={{ fontFamily: 'RobotoMedium', fontSize: '13px', fontWeight: 400 }}> Your ABR is {commonInfo?.Alpha_beta_ratio_value}</span>.
                                </p>
                            </div>
                        </div>
                        <div className="col text-center">
                            <h5 className="text-primary text-center mb-0 fs-24 mx-auto" style={{ fontFamily: 'RobotoRegular' }}>
                                Theta/beta Ratio
                            </h5>
                            <h5 className="text-dark my-1 text-center fs-20 mx-auto" style={{ fontFamily: 'RobotoRegular', fontWeight: 400 }}>
                                {commonInfo?.Theta_Beta_Ratio_value_ec || ''}
                            </h5>
                            <div className="px-3">
                                {parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec) < 3.0 ? (
                                    <p className="text-center m-0 report-content" style={{ fontFamily: 'RobotoRegular', fontSize: '13px', lineHeight: 1.3 }}>
                                        The theta/beta (TBR) at Cz is a common measure in the medical literature related to attention. A high TBR (&gt;3.0) is commonly observed among
                                        individuals who report inattentiveness and distractibility, whereas a value below 1.5 can be seen in individuals with anxiety.
                                        <span className="report-content" style={{ fontFamily: 'RobotoMedium', lineHeight: 1.1, fontSize: '13px', fontWeight: 400 }}>
                                            Your TBR in the eyes-closed condition is {commonInfo?.Theta_Beta_Ratio_value_ec}
                                        </span>
                                        .
                                    </p>
                                ) : parseFloat(commonInfo?.Theta_Beta_Ratio_value_ec) < parseFloat(commonInfo?.Theta_Beta_Ratio_value_eo) ? (
                                    <p className=" text-center m-0 report-content" style={{ fontFamily: 'RobotoRegular', fontSize: '13px', lineHeight: 1.3 }}>
                                        The theta/beta (TBR) at Cz is a common measure in the medical literature related to attention. A high TBR (&gt;3.0) is commonly observed among
                                        individuals who report inattentiveness and distractibility, whereas a value below 1.5 can be seen in individuals with anxiety.
                                        <span className="report-content" style={{ fontFamily: 'RobotoMedium', fontSize: '13px', lineHeight: 1.1, fontWeight: 400 }}>
                                            Your TBR in the eyes-closed condition is {commonInfo?.Theta_Beta_Ratio_value_ec}
                                        </span>
                                        .
                                        <span className="report-content" style={{ fontFamily: 'RobotoMedium' }}>
                                            This value increases to {commonInfo?.Theta_Beta_Ratio_value_eo} in the eyes-opened condition.
                                        </span>
                                    </p>
                                ) : (
                                    <p className="report-content text-center m-0" style={{ fontFamily: 'RobotoRegular', lineHeight: 1.3, fontSize: '13px', }}>
                                        The theta/beta (TBR) at Cz is a common measure in the medical literature related to attention. A high TBR (&gt;3.0) is commonly observed among
                                        individuals who report inattentiveness and distractibility, whereas a value below 1.5 can be seen in individuals with anxiety.
                                        <span className="report-content" style={{ fontFamily: 'RobotoMedium', fontSize: '13px', fontWeight: 'bold' }}>
                                            Your TBR in the eyes-closed condition is {commonInfo?.Theta_Beta_Ratio_value_ec}
                                        </span>
                                        .
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer fs-12 px-2" style={{ fontFamily: 'RobotoRegular' }}>
                    <div className="mb-0 d-flex my-auto">
                        <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                            {pdrText}
                        </p>
                        <div className="col-md-2 my-auto text-center pe-0">
                            <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                        </div>
                    </div>
                    {footerText}
                </div>
            </div>
            <MedicationTemplate
                zoom={zoom}
                medicEdit={medicEdit}
                handleMedicChange={handleMedicChange}
                getCommonService={getCommonService}
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
        </>
    );
};

export default InterpretationPDR;
