import React, { useEffect, useState } from 'react';
import { Slider } from 'antd';
import 'assets/styles/slider.scss';
import Brain from 'assets/img/report-icons/brain-png.png';
import { useSelector } from 'components/shared/CompVariables';

interface ChildProps {
    data: {
        value: any;
        title: any;
        mfieldtype: any;
        type: string;
        eyeType: string;
        item: any;
    };
}

const Sliders: React.FC<ChildProps> = ({ data}) => {
    const [sliderValue, setSliderValue] = useState(2.5);
    const [maxValue, setMaxValue] = useState(15.0);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { resultInfo } = useSelector((state: any) => state.wizard);
    const age = commonInfo?.pnt_age;

    const getGradientStops = (max, markername) => {
        let stop1, stop2;

        switch (markername) {
            case 'Alpha/beta ratio':
                stop1 = (6 / max) * 100;
                stop2 = (12 / max) * 100;
                break;
            case 'Posterior Dominant Rhythm':
                if (age < 10) {
                    stop1 = (8 / max) * 100;
                    stop2 = (10 / max) * 100;
                } else if (age >= 10 && age < 45) {
                    stop1 = (10 / max) * 100;
                    stop2 = (12 / max) * 100;
                } else if (age >= 45 && age < 55) {
                    stop1 = (9.5 / max) * 100;
                    stop2 = (12 / max) * 100;
                } else if (age >= 55 && age < 65) {
                    stop1 = (9 / max) * 100;
                    stop2 = (12 / max) * 100;
                } else if (age >= 65 && age < 75) {
                    stop1 = (8.5 / max) * 100;
                    stop2 = (12 / max) * 100;
                } else {
                    stop1 = (8 / max) * 100;
                    stop2 = (12 / max) * 100;
                }
                break;
            case 'Theta/beta ratio':
                stop1 = (1.5 / max) * 100;
                stop2 = (3.0 / max) * 100;
                break;
            case 'Peak alpha frequency':
                stop1 = (10 / max) * 100;
                stop2 = (12 / max) * 100;
                break;
            default:
                stop1 = (1.5 / max) * 100;
                stop2 = (3.0 / max) * 100;
        }

        return { stop1, stop2 };
    };

    const gradientStops = getGradientStops(maxValue, data?.title);
    const sliderStyle = {
        '--stop1': `${gradientStops.stop1}%`,
        '--stop2': `${gradientStops.stop2}%`,
    };

    useEffect(() => {
        setSliderValue(data?.value);
        if (data?.value > maxValue) {
            setMaxValue(data?.value + 3);
        }
    }, [data?.value, maxValue]);

    const getMarks = () => {
        let marks = {};
        switch (data?.title) {
            case 'Alpha/beta ratio':
                marks = {
                    6: { label: '6' },
                    12: { label: '12' },
                };
                break;
            case 'Posterior Dominant Rhythm':{
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

                marks = {
                    [lowerBound]: { label: `${lowerBound}` },
                    [upperBound]: { label: `${upperBound}` },
                };
                break;
            }
            case 'Theta/beta ratio':
                marks = {
                    1.5: { label: '1.5' },
                    3.0: { label: '3.0' },
                };
                break;
            case 'Peak alpha frequency':
                marks = {
                    10: { label: '10' },
                    12: { label: '12' },
                };
                break;
            default:
                marks = {
                    1.5: { label: '1.5' },
                    3.0: { label: '3.0' },
                };
        }

        marks[sliderValue] = {
            label: <span className="current-position">You</span>,
        };

        return marks;
    };

    const isOutsideRange = (value, min, max) => {
        return value < min || value > max;
    };


    const getStyleAndText = (item, markerType) => {
        const eyeClosedThetaBeta = parseFloat(item.eyeclosed);
        const eyeOpenThetaBeta = parseFloat(item.eyeopen);
        const eyeData = markerType === 'eyeClosed' ? parseFloat(item.eyeclosed) : parseFloat(item.eyeopen);
        const eyeData1 = markerType === 'eyeClosed' ? item.eyeclosed === 'true' : item.eyeopen === 'true';

        const style: any = { lineHeight: 1.2 };
        let statusText = item.markername === 'Peak alpha frequency' ? 'within expected limits' : 'within normal limit';
        let color = '#3c4863';

        if (item.markername === 'Alpha/beta ratio' && isOutsideRange(eyeData, 6, 12)) {
            statusText = eyeData < 6 ? 'low' : 'elevated';
            color = 'red';
        } else if (item.markername === 'Peak alpha frequency' && isOutsideRange(eyeData, 10, 12)) {
            statusText = eyeData < 10 ? 'low' : 'outside expected limits';
            color = 'red';
        } else if (item.markername === 'Posterior Dominant Rhythm') {
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
                statusText = eyeData < lowerBound ? 'low' : 'elevated';
                color = 'red';
            }
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeClosed' && eyeClosedThetaBeta > 3) {
            statusText = 'elevated';
            color = 'red';
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeClosed' && eyeClosedThetaBeta < 1.5) {
            statusText = 'low';
            color = 'red';
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeOpened' && eyeOpenThetaBeta > eyeClosedThetaBeta) {
            statusText = 'higher than eyes closed';
            color = 'red';
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeOpened' && eyeOpenThetaBeta > 3) {
            statusText = 'elevated';
            color = 'red';
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeOpened' && eyeOpenThetaBeta < 1.5) {
            statusText = 'low';
            color = 'red';
        } else if (item.markername === 'Mu Rhythm Present' && eyeData1) {
            statusText = 'elevated';
            color = 'red';
        } else if (item.markername === 'F7>F8 Asymmetry Present' && eyeData1) {
            statusText = 'elevated';
            color = 'red';
        } else if (item.markername === 'F3>F4 Asymmetry Present' && eyeData1) {
            statusText = 'elevated';
            color = 'red';
        } else if (item.markername === 'P4>P3 Asymmetry Present' && eyeData1) {
            statusText = 'elevated';
            color = 'red';
        }

        style.color = color;

        return { style, statusText };
    };

    const { style, statusText } = getStyleAndText(data?.item, data?.eyeType);


    function capitalizeTitle(title) {
        if (!title) return '';
        // Capitalize the title
        const capitalizedTitle = title.replace(/\b\w+/g, (word) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        });
    
        // Append abbreviations based on conditions
        switch (capitalizedTitle) {
            case 'Alpha/Beta Ratio':
                return `${capitalizedTitle} (ABR)`;
            case 'Theta/Beta Ratio':
                return `${capitalizedTitle} (TBR)`;
            case 'Posterior Dominant Rhythm':
                return `${capitalizedTitle} (PDR)`;
            default:
                return capitalizedTitle;
        }
    }

    return (
        <div className="px-1 tempSlider">
            <div className="d-flex " style={{ padding: '2px 4px 0px', border: '2px solid #636c82', borderRadius: '30px', position: 'relative' }}>
                <div className="top-circle" style={{ position: 'absolute', top: '-27px', left: '-5px' }}>
                    <img src={Brain} style={{ zIndex: 2, position: 'relative', width: '78%', height: '78%', top: '6px', left: '6px' }} />
                    <div className="inner-circle"></div>
                </div>
                <div className="rectangle marker-size" style={{ position: 'absolute', top: '-21px', left: '28px' }}>
                    <h6
                        className="m-0 white "
                        style={{
                            position: 'absolute',
                            top:
                                data?.title === 'Posterior Dominant Rhythm' ||
                                data?.title === 'Alpha/beta ratio' ||
                                data?.title === 'Theta/beta ratio'
                                    ? '2px'
                                    : '10px',
                            left: data?.title === 'Peak alpha frequency' ? '23px' : '26px',
                            color: '#fff',
                        }}
                        >
                        {capitalizeTitle(data?.title)}
                    </h6>
                </div>
                <div className="w-100">
                    <div className="d-flex w-100 align-items-center">
                        <div className="sliderWrapper mt-5 mx-2" style={{ width: '75%', ...sliderStyle }}>
                            <div className="slider-handle start-handle" />
                            <Slider range marks={getMarks()}  value={[sliderValue, maxValue]} min={0} max={maxValue} step={0.1} disabled={true} />
                            <div className="slider-handle end-handle" />
                        </div>

                        <div className="circle d-flex flex-column justify-content-center align-items-center" style={{ marginTop: '10px' }}>
                            <div className="inner-ring d-flex flex-column justify-content-center align-items-center">
                                <div className="number" style={{  ...style }} >{sliderValue}</div>
                            </div>
                        </div>
                    </div>
                    <h5 className="text-center text-dark" style={{ fontWeight: 'bold', fontSize: '16px', marginTop: '-8px', marginBottom: '4px' }}>
                        This value is <span style={{ color: 'red', fontSize: '17px', ...style }}>{statusText}</span>
                    </h5>
                </div>
            </div>
        </div>
    );
}

export default Sliders;