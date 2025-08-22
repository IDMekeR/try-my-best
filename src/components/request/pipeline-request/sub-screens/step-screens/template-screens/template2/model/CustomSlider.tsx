import React, { useEffect, useState } from 'react';
import { Slider } from 'antd';
import 'assets/styles/slider.scss';
import Brain from 'assets/img/report-icons/brain-png.png';
import { useSelector } from 'components/shared/CompVariables';

interface ChildProps {
    data: {
        value: any;
        size: string;
        markername: string;
    };
}

const CustomSlider: React.FC<ChildProps> = ({data}) =>{

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
            case 'Posterior Dominant Rhythm':{
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
            }
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

    const gradientStops = getGradientStops(maxValue, data?.markername);
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
        switch (data?.markername) {
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

    const getStyleAndText = (value, markername) => {
        const eyeData = parseFloat(value);
        const age = commonInfo?.pnt_age;

        const style: any = { lineHeight: 1.2 };

        let statusText = 'within normal limit';
        let color = '#3c4863';

        if (markername === 'Alpha/beta ratio' && isOutsideRange(eyeData, 6, 12)) {
            statusText = eyeData < 6 ? 'low' : 'elevated';
            color = 'red';
        } else if (markername === 'Posterior Dominant Rhythm') {
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
        } else if (markername === 'Theta/beta ratio' && value > 3) {
            statusText = 'elevated';
            color = 'red';
        } else if (markername === 'Theta/beta ratio' && value < 1.5) {
            statusText = 'low';
            color = 'red';
        }

        style.color = color;

        return { style, statusText };
    };
   
    const { style, statusText } = getStyleAndText(data?.value, data?.markername);


    return(
        <div className="d-flex flex-column  justify-content-center py-2 customSlider w-100">
            <div className="d-flex w-100 justify-content-center align-items-center">
                <div className="sliderWrapper mt-5 mx-2" style={{ width: '70%', ...sliderStyle }}>
                    <div className="slider-handle start-handle" />
                    <Slider range marks={getMarks()} value={[sliderValue, maxValue]} min={0} max={maxValue} step={0.1} disabled={true} />
                    <div className="slider-handle end-handle" />
                </div>
                <div className={`  ${data?.size === 'one' ? 'circle' : 'circle1'} d-flex flex-column justify-content-center align-items-center`}>
                    <div className="inner-ring d-flex flex-column justify-content-center align-items-center">
                        <div className="number" style={{ ...style }}>
                            {sliderValue}
                        </div>
                    </div>
                </div>
            </div>
            <div className="text-center mb-1 text-dark" style={{ fontWeight: 'bold', fontSize: '24px', color:'#000'}}>
                This value is <span style={{ color: 'red', fontSize: '25px', ...style }}>{statusText}</span>
            </div>
        </div>
    )
}

export default CustomSlider