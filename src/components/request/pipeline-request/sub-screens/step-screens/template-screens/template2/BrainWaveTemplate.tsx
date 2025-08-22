import React,{useState,useEffect} from 'react';
import { Image, useSelector } from 'components/shared/AntComponent';
import Delta from 'assets/img/report-icons/delta-wave.png';
import Alpha from 'assets/img/report-icons/alpha-waves.png';
import Theta from 'assets/img/report-icons/theta-wave.png';
import Beta from 'assets/img/report-icons/beta-wave.png';
import Gamma from 'assets/img/report-icons/gamma-wave.png';
import background from 'assets/img/report-icons/background.png';
// import ImagesTemplate from './ImagesTemplate';
import QrCode from 'assets/img/report-icons/qrCode.png';
import dayjs from 'dayjs';
import TopographyTemplate from '../template1/TopographyTemplate';
import Ebook from 'assets/img/report-icons/ebook-qr.png';
import TopographyTemplate2 from './TopographyTemplate2';


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

const BrainWaveTemplate:React.FC<ChildProps>=({
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
})=>{
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { resultInfo} = useSelector((state: any) => state.wizard);

    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()
    return(
        <div>
            {/* <div
                className="page-two mt-2 bg-white mx-auto page border-0"
                id="page116"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            THE BRAIN WAVE GUIDE
                        </h3>
                        <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '100px' }}>
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
                                    {commonInfo? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Date:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.created_on).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                        </div>
                    </div>
                    <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body mt-4 px-4">
                        <div className=" d-flex justify-content-center mt-3">
                            <img className=" col-md-9 " src={Delta} height="86px" alt="psychedelic" />
                        </div>
                        <div className=" d-flex mt-4 justify-content-around mt-3  ">
                            <div className="col-md-3px-3 ">
                                <h3 className="text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Optimal
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Healing
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Regeneration
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Restorative Sleep
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Much
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Learning Disorders
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Cognitive Overwhelm
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Memory Deficits
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Little
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Sleep Dysfunction
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Anxiety
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Mood Disorders
                                </p>
                            </div>
                        </div>
                        <p
                            className="mb-0  px-5 mt-5 para"
                            style={{
                                textAlign: 'center',
                                fontSize: '18px',
                                lineHeight: 1.2,
                                margin: '0 auto',
                                maxWidth: '800px',
                                fontFamily: 'RobotoRegular',
                            }}
                        >
                            Delta waves, dominant during deep sleep, aid in rest and memory consolidation. Too much may signal sleep disorders, impaired cognitive processing, or underlying pathology, while too little
                            could mean sleep disturbances. Delta excess is often correlated with neurological damage. Balancing delta waves is key to quality sleep and cognitive function.
                        </p>

                        <div className=" d-flex justify-content-center " style={{ marginTop: '50px' }}>
                            <img className=" col-md-9 " src={Theta} height="86px" alt="psychedelic" />
                        </div>
                        <div className=" d-flex mt-4 justify-content-around mt-3  ">
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Optimal
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Creative / Imagination
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Sustained Focus
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Calculated Decisions
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Much
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Scattered Thoughts
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Impulsive
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Forgetfulness
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Little
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Anxiety
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Disturbed Sleep
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    On Edge
                                </p>
                            </div>
                        </div>
                        <p
                            className="mb-0  px-5 mt-5 para"
                            style={{
                                textAlign: 'center',
                                fontSize: '18px',
                                lineHeight: 1.2,
                                margin: '0 auto',
                                maxWidth: '800px',
                                fontFamily: 'RobotoRegular',
                            }}
                        >
                            Theta waves, prominent during light sleep and deep relaxation, foster creativity and intuition. Excessive theta activity might lead to frequent daydreaming or distractibility, while
                            insufficient levels can impact learning and memory. Maintaining a healthy balance of theta waves supports mental clarity and emotional well-being.
                        </p>
                    </div>

                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; 2024 Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div> */}

            {/* BRian wave page2 */}

            {/* <div
                className="page-two mt-2 bg-white mx-auto page border-0"
                id="page117"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            THE BRAIN WAVE GUIDE
                        </h3>
                        <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '100px' }}>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Name:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
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
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.created_on).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                        </div>
                    </div>
                    <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body mt-4 px-4">
                        <div className=" d-flex justify-content-center mt-3">
                            <img className=" col-md-9 " src={Alpha} height="86px" alt="psychedelic" />
                        </div>
                        <div className=" d-flex mt-4 justify-content-around mt-3  ">
                            <div className="col-md-3px-3 ">
                                <h3 className="text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Optimal
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Restorative Sleep
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Sustained Focus
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Self-Regulation
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Much
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Brain Fog
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Rumination
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Low Mood
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Little
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Anxiety
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Insomnia
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Irritability
                                </p>
                            </div>
                        </div>
                        <p
                            className="mb-0  px-5 mt-5 para"
                            style={{
                                textAlign: 'center',
                                fontSize: '18px',
                                lineHeight: 1.2,
                                margin: '0 auto',
                                maxWidth: '800px',
                                fontFamily: 'RobotoRegular',
                            }}
                        >
                            Alpha waves, present during wakeful relaxation, promote a calm and focused state of mind. Optimal alpha levels enhance concentration and creativity, while too much alpha activity may indicate
                            mental sluggishness or mood disturbances. Conversely, low alpha levels might lead to anxiety or stress. Striving for a balanced alpha wave pattern supports a relaxed yet alert mental state.
                        </p>

                        <div className=" d-flex justify-content-center " style={{ marginTop: '50px' }}>
                            <img className=" col-md-9 " src={Beta} height="86px" alt="psychedelic" />
                        </div>
                        <div className=" d-flex mt-4 justify-content-around mt-3  ">
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Optimal
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Mental Clarity
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Executive Functioning
                                </p>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Stable Mood
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Much
                                </h3>
                                <p className="mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Anxiety
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Insomnia
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Obsessiveness
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Little
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Unmotivated
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Attention Deficits
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Fatigue
                                </p>
                            </div>
                        </div>
                        <p
                            className="mb-0  px-5 mt-5 para"
                            style={{
                                textAlign: 'center',
                                fontSize: '18px',
                                lineHeight: 1.2,
                                margin: '0 auto',
                                maxWidth: '800px',
                                fontFamily: 'RobotoRegular',
                            }}
                        >
                            Beta waves, associated with active concentration and alertness, are prominent during wakefulness and problem-solving tasks. Healthy beta activity supports mental sharpness and quick thinking,
                            while excessive beta waves can lead to stress, overthinking, and poor sleep. Conversely, low beta levels might indicate fatigue or lack of focus. Maintaining a balanced beta wave pattern is
                            essential for optimal cognitive function, productivity and restorative sleep
                        </p>
                    </div>

                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; 2024 Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div> */}

            {/* brain wave page 3 */}
            {/* <div
                className="page-two mt-2 bg-white mx-auto page border-0"
                id="page118"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            THE BRAIN WAVE GUIDE
                        </h3>
                        <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '100px' }}>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Name:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ?commonInfo?.patient_info?.pntname : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Age:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? commonInfo?.pnt_age : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                DOB:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular' , fontWeight:500 }}>
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Date:
                                <div className="text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.created_on).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                        </div>
                    </div>
                    <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body mt-4 px-4">
                        <div className=" d-flex justify-content-center mt-3">
                            <img className=" col-md-9 " src={Gamma} height="86px" alt="psychedelic" />
                        </div>
                        <div className=" d-flex mt-4 justify-content-around mt-3  ">
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Optimal
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Enlightened States
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Peak Concentration
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Working Memory
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Much
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Hyperalertness
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Mood Disorders
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Agitation
                                </p>
                            </div>
                            <div className="col-md-3px-3 ">
                                <h3 className=" text-center mb-2" style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                    Too Little
                                </h3>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Learning Disorders
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Difficulty Processing
                                </p>
                                <p className=" mb-1 text-bold text-center para" style={{ textAlign: 'justify', fontSize: '17px', lineHeight: 1.2, color: '#000', fontFamily: 'RobotoRegular' }}>
                                    Memory Problems
                                </p>
                            </div>
                        </div>
                        <p
                            className="mb-0  px-5 my-5 para"
                            style={{
                                textAlign: 'center',
                                fontSize: '18px',
                                lineHeight: 1.2,
                                margin: '0 auto',
                                maxWidth: '800px',
                                fontFamily: 'RobotoRegular',
                            }}
                        >
                            Gamma waves, the fastest brainwave pattern, are linked to heightened cognitive function, perception, consciousness, and information processing. Optimal gamma activity is associated with peak
                            mental performance and enhanced perception. However, excessively high gamma waves may indicate hyperarousal or anxiety, while insufficient levels can impact cognitive flexibility and
                            problem-solving abilities. Striving for a balanced gamma wave pattern supports optimal brain function and cognitive agility.
                        </p>

                        <h3 className="mb-0 col-auto py-4 mt-5 text-start text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            THE BRAIN WAVES: PUTTING IT ALL TOGETHER
                        </h3>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <p className="mb-0 pe-2 mt-4 para" style={{ textAlign: 'justify', fontSize: '18px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                            Understanding the intricate interplay of brain waves provides a window into the dynamic nature of our mental processes and overall well-being. From the restorative depths of delta waves during
                            sleep to the creative flow facilitated by theta waves, and the focused alertness encouraged by alpha waves, each wave contributes uniquely to our cognitive experience. Beta waves energize our
                            concentration, while gamma waves elevate our cognitive prowess. Together, these waves orchestrate a symphony of neural activity, shaping our perceptions, emotions, and actions. Achieving
                            harmony among these waves is essential for optimal brain function, facilitating cognitive agility, emotional stability, and overall mental health.
                        </p>
                    </div>

                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; 2024 Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div> */}

            <div
                className="page-two mt-2 bg-white mx-auto page border-0"
                id="page116"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 col-auto ps-4 py-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            THE BRAIN WAVE GUIDE
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
                                    {commonInfo? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
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
                    <div  style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body mt-1 px-4 page-head">
                        <h5 className="mt-4 mb-3 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                            THE BRAIN WAVES: PUTTING IT ALL TOGETHER 
                        </h5>
                        <h5 className="my-4 text-dark" style={{ fontFamily: 'RobotoRegular',fontWeight:'normal',textAlign: 'justify'  }}>
                            Understanding the intricate interplay of brain waves provides a window into the dynamic nature of our mental processes end overall well-being. 
                            From the restorative depths of<span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}> delta waves</span> during sleep to the creative flow facilitated by <span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}>theta waves</span>, 
                            and the focused alertness encouraged by <span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}>alpha waves</span>, each wave contributes uniquely to our cognitive experience. <span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}>Beta waves</span> energize our concentration,
                            while <span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}>gamma waves</span> elevate our cognitive prowess, enabling peek mental performance and heightened perception. Together, these waves
                            orchestrate a symphony of neural activity. shaping our perceptions, emotions, and actions.
                        </h5>
                        <h5 className="my-4 text-dark" style={{ fontFamily: 'RobotoRegular',fontWeight:'normal', textAlign: 'justify'  }}>
                            It&apos;s important to recognize that these brainwave patterns cen be both strengths and challenges, depending on the situation and environment. For example,<span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}> theta waves </span>
                            foster creativity and intuition. but excessive theta activity might lead to distractibility or impulsivity. Similarly, <span style={{fontFamily: 'RobotoRegular',fontWeight:'bold'}}>gamma waves </span>are essential for advanced
                            cognitive processing, but too much gamma activity cen result in hyperarousal or anxiety. Achieving harmony among these waves is essential for optimal brain function, facilitating
                            cognitive agility, emotional stability, and overall mental health.
                        </h5>
                        <div style={{ borderBottom: '4px solid #a0a0a0' }} />
                        <h5 className="my-4 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                            Take the Next Step: Maximize Your Brain&apos;s Potential with Our Exclusive E-Books
                        </h5>
                        <h5 className="mt-3 mb-3 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'normal', textAlign: 'justify'  }}>
                            Most people who receive their reports find our e-books invaluable for understanding their
                            results and taking actionable steps to improve their brain health. These guides ere tailored
                            to help make the most of your brainwave analysis, offering practical tips. exercises. and
                            insights to optimize your mental performance and well-being.
                        </h5>
                        <h5 className="my-4 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'bold', textAlign: 'justify'  }}>
                            Scan the QR code below to access our exclusive e-books and start your journey toward
                            better brain health today!
                        </h5>
                        <div className='tempQR'>
                            <Image className="neuroImg" src={Ebook} height={160} style={{ width: 'auto', marginTop: '10px', marginLeft: '30px' }} preview={false} />
                        </div>
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>

            {/* conclusion */}
            <div
                className="page-two mt-2 bg-white mx-auto"
                id="page119"
                style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="d-flex  justify-content-between">
                        <h3 className="mb-0 pb-2 col-auto ps-4 pt-4 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            CONCLUSION
                        </h3>
                        <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Name:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                Age:
                                <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? commonInfo?.pnt_age : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                DOB:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {commonInfo ? dayjs(commonInfo?.patient_info?.dob).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                            <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Date:
                                <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                    {resultInfo ? dayjs(resultInfo?.req_info?.servicerequest_info?.created_on).format('MM/DD/YYYY') : ''}
                                </div>
                            </h6>
                        </div>
                    </div>
                    <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                    <div className="page-body mt-4 px-0">
                        <p className=" px-4 para" style={{ textAlign: 'justify', fontSize: '18px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                            These suggestions are offered as a starting point for diagnostic support and treatments. Individual patient responses will vary. The specific treatments and the sequencing will likely require
                            modification based on response. Suggestions may be implemented differently depending on the instrumentation used, past responses to medication, or current medication regimen. The results of
                            this analysis should be considered together with other measures in assessing, diagnosing, and treating clients. Healthy Paths, Inc. and its affiliates assume no responsibility whatsoever for
                            the application of any therapies or interventions based on the information contained in this report, including medication interactions. With the delivery and reading of this report, the
                            referral requesting this service agrees with the terms and conditions and assumes all responsibility for any clinical intervention.
                        </p>
                        <div className="mt-5 px-4 text-start">
                            <p className="mb-0 para " style={{ fontSize: '18px', fontFamily: 'RobotoRegular' }}>
                                Dr. Steven Rondeau, BCN (EEG), qEEG-DL
                            </p>
                            <p className="mb-0  para" style={{ fontSize: '18px', fontFamily: 'RobotoRegular' }}>
                                Medical Director of Axon Solutions
                            </p>
                        </div>
                        <h3 className="mb-0 mt-2 pb-2 col-auto ps-4 pt-3 text-start text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            REFERENCES
                        </h3>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        {/* <QRCode value={externalUrl} size={170} className="border-0 ps-4" /> */}
                        <div className='tempQR'>
                            <Image className="neuroImg" src={QrCode} height={160} style={{ width: 'auto', marginTop: '10px', marginLeft: '30px' }} preview={false} />
                        </div>
                        <h3 className="mb-0 pb-2 col-auto ps-4 pt-4 text-start text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                            LEGAL
                        </h3>
                        <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                        <h6 className=" legalContent p-4 text-start text-dark" style={{ fontSize: '10px', lineHeight: 1, fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            <span className=" sm-text text-dark" style={{ fontSize: '10px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                The information and recommendations provided by Healthy Paths Inc. dba Axon EEG Solutions (&quot;Axon&quot;, &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) in this TIEReport (the &quot;Report&quot;) is for general informational and
                                educational purposes and is intended to be used solely as a diagnostic aid.
                            </span>
                            <div className="sm-text text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular' }}>
                                While reviewing the Report it is important that you understand the following:
                            </div>
                            <div>
                                <span className="text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    1.
                                </span>
                                <span className="ps-2 sm-text text-decoration-underline text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    NOT MEDICAL ADVICE/CONSULT YOUR PHYSICIAN.
                                </span>
                                <span className=" ps-1 text-dark" style={{ fontSize: '9px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    THE REPORT DOES NOT CONTAIN MENTAL HEALTH OR MEDICAL ADVICE AND IS NOT A SUBSTITUTE FOR PROFESSIONAL THERAPY OR MEDICAL ADVICE. BEFORE TAKING ANY ACTIONS, INCLUDING ANY LIFESTYLE
                                    CHANGES OR STARTING A NEW MEDICATION (WHETHER PRESCRIPTION, OVER THE COUNTER OR NATURAL SUPPLEMENTS) BASED UPON THE REPORT, WE STRONGLY RECOMMEND THAT YOU TO CONSULT WITH THE
                                    APPROPRIATE MENTAL HEALTH AND/OR MEDICAL PROFESSIONALS, INCLUDING YOUR PRIMARY CARE PHYSICIAN. YOU SHOULD NEVER DELAY SEEKING MEDICAL TREATMENT OR DISREGARD PROFESSIONAL MEDICAL ADVICE
                                    DUE TO INFORMATION OR RECOMMENDATIONS CONTAINED IN THIS REPORT. THE USE OR RELIANCE OF ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK.
                                </span>
                            </div>
                            <div>
                                <span className="text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    2.
                                </span>
                                <span className="ps-1 text-dark" style={{ fontSize: '9px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    NO AXON AGENT OR EMPLOYEE SHALL PROVIDE ANY ADVICE OR SERVICES OUTSIDE THE SCOPE OF THEIR EXPERTISE OR LICENSURE.
                                </span>
                            </div>
                            <div>
                                <span className="text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    3.
                                </span>
                                <span className="ps-1 sm-text text-decoration-underline text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    NO REPRESENTATIONS OR WARRANTIES ARE MADE OR GIVEN.
                                </span>

                                <span className="text-dark" style={{ fontSize: '9px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    ALL INFORMATION AND RECOMMENDATIONS IN THE REPORT ARE PROVIDED IN GOOD FAITH BUT ARE PROVIDED “AS-IS”, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
                                    LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR SATISFACTORY QUALITY. WE MAKE NO REPRESENTATION OF ANY KIND, EXPRESS OR IMPLIED, REGARDING
                                    THE ACCURACY, ADEQUACY, VALIDITY, RELIABILITY, AVAILABILITY, OR COMPLETENESS OF ANY INFORMATION OR RECOMMENDATION IN THE REPORT.
                                </span>
                            </div>
                            <div>
                                <span className="text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    4.
                                </span>
                                <span className=" ps-1 text-dark" style={{ fontSize: '9px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    QEEG DEVICES ARE CONSIDERED BY FDA A MEDICAL DEVICE. HOWEVER, FDA DOES NOT REGULATE THE USE OF THESE QEEG DEVICES IN THE CONTEXT OF AXON’S SERVICES.
                                </span>
                            </div>
                            <div>
                                <span className="text-dark" style={{ fontSize: '9px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    5.
                                </span>
                                <span className="ps-2 sm-text text-decoration-underline text-dark" style={{ fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                    NO LIABILITY.
                                </span>
                                <span className=" ps-1 text-dark" style={{ fontSize: '8px', textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE REPORT OR RELIANCE ON ANY INFORMATION OR
                                    RECOMMENDATIONS PROVIDED IN THE REPORT. YOUR USE OF THE REPORT AND YOUR RELIANCE ON ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK. WE HEREBY DISCLAIM ANY AND ALL
                                    LIABILITY FOR ANY INJURY OR DAMAGE TO OR OTHER IMPACT ON YOUR HEALTH OR MEDICAL CONDITION, WHETHER OR NOT CAUSED BY OR RELATED TO (EITHER DIRECTLY OR INDIRECTLY) YOUR USE OF THE
                                    INFORMATION OR RECOMMENDATIONS CONTAINED WITHIN THE REPORT. IN NO CASE SHALL AXON’S LIABILITY, IF ANY, EXCEED THE AMOUNT YOU PAID FOR THE SERVICES PROVIDED.
                                </span>
                            </div>
                        </h6>
                    </div>
                </div>

                <div className="footer">
                    <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontFamily: 'RobotoLight', marginTop: '2px', fontSize: '10px', fontWeight:500  }}>
                        Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                    </h6>
                </div>
            </div>
            {!commonInfo?.images_only_flag ? '' : <TopographyTemplate2 zoom={zoom} />}
        </div>
    )
}

export default BrainWaveTemplate;