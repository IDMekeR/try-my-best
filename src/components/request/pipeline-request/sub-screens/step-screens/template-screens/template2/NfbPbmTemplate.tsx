import React, { useState, useEffect } from 'react';
import {
    StepsImg1, SymptomsIcon, PbmIcon
} from 'components/shared/TemplateImages';
import background from 'assets/img/report-icons/background.png';
import { footerText, lifestyleText, pdrText, supplementText, url2 } from 'components/shared/CompVariables';
import { Image, message, Popconfirm, Tooltip, useDispatch, useSelector } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { saveAssociateCommon } from 'services/actions/commonServiceAction';
import { useLocation } from 'react-router-dom';
import { DeleteFilled } from '@ant-design/icons';
import dayjs from 'dayjs';
import { getNeuroFeedback } from 'services/actions/pipeline/recordingAnalysisAction';
import NeuroPbmEditor from '../../editors/NeuroPbmEditor';
import PbmEditor from '../../editors/PbmEditor';
import BrainWaveTemplate from './BrainWaveTemplate';

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

const NfbPbmTemplate: React.FC<ChildProps> = ({
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
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { resultInfo} = useSelector((state: any) => state.wizard);
    const location = useLocation();
    const dispatch = useDispatch();
    const { neuroFields, loading11 } = useSelector((state: any) => state.recAnalysis);
    const [showPBM, setShowPBM] = useState(false);
    const [pbmArr, setPbmArr] = useState([
        { id: 1, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 2, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 3, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 4, pulse_rate: '', intensity: '', location: '', duration: '' },
    ]);
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    function getNeuro() {
        dispatch(getNeuroFeedback(location?.state?.id) as any);
    }

    useEffect(() => {
        getNeuro();
    }, []);

    useEffect(() => {
        if (commonInfo) {
            const duration = commonInfo?.photobiomodulation_info?.duration?.split(',');
            const intensity = commonInfo?.photobiomodulation_info?.intensity?.split(',');
            const location = commonInfo?.photobiomodulation_info?.location?.split(',');
            const pulse_rate = commonInfo?.photobiomodulation_info?.pulse_rate?.split(',');
            const rowData = pbmArr;
            for (let i = 0; i < rowData?.length; i++) {
                if (duration?.length > 0) {
                    rowData[i].duration = duration[i] || '';
                } else {
                    rowData[i].duration = '';
                }
                if (intensity?.length > 0) {
                    rowData[i].intensity = intensity[i] || '';
                } else {
                    rowData[i].intensity = '';
                }
                if (location?.length > 0) {
                    rowData[i].location = location[i] || '';
                } else {
                    rowData[i].location = '';
                }
                if (pulse_rate?.length > 0) {
                    rowData[i].pulse_rate = pulse_rate[i] || '';
                } else {
                    rowData[i].pulse_rate = '';
                }
            }
            setPbmArr(rowData);
            if (duration) {
                setShowPBM(true);
            } else if (intensity) {
                setShowPBM(true);
            } else if (location) {
                setShowPBM(true);
            } else if (pulse_rate) {
                setShowPBM(true);
            } else {
                setShowPBM(false);
            }
        }
    }, [commonInfo]);
    return (
        <div>
            {(commonInfo?.nfb_flag || commonInfo?.nfb_flag == null) &&(
                (released && (!neuroFields?.neurofeedback_EO || !neuroFields?.neurofeedback_EC) ? (
                    <div className="page-fourteen" id="page114"></div>
                ):(
                    <div
                    className="page-two mt-2 bg-white mx-auto page border-0"
                    id="page114"
                    style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >
                        <div className="page-content">
                            <div className="d-flex  justify-content-between">
                                <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                    POSSIBLE TREATMENT OPTIONS
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
        
                            <div className="page-body mt-4 px-4 page-head" style={{ textAlign: 'justify' }}>
                                <p className=" para" style={{ fontSize: '17px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                    Based upon the clinical information presented along with the individual`s topographic maps, sLORETA images, and in consideration of database deviancies, the following
                                    recommendations are made for neurofeedback training. When qEEG guided, most individuals report changes after about 5-8 sessions and see lasting long-term results after about 40
                                    sessions.
                                </p>
                                <h4 className="mt-4 mb-3 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'bold',fontSize:'24px' }}>
                                    what is neurofeedback and how does it work?
                                </h4>
                                <div className="d-flex w-100">
                                    <div className="col-md-6">
                                        <p className="para" style={{ textAlign: 'justify', fontSize: '16px', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                            Neurofeedback is a technology-based, non-invasive therapeutic training tool that can be used to improve a variety of mental health conditions. Neurofeedback therapy helps
                                            you control the brain waves that, when imbalanced, are associated with conditions such as depression, anxiety, ADHD, and more. During neurofeedback sessions, an
                                            individual`s brain is trained how to bring abnormally fast or slow waves to within the normal range and improve daily symptoms. You may sit back and relax while playing a
                                            game, listening to music, or watching a show while a technician monitors your brain waves.
                                        </p>
                                    </div>
                                    <div className="col-md-6  text-center">
                                        <Image className="neuroImg" src={SymptomsIcon} height={250} style={{ width: 'auto', marginTop: '-20px', marginLeft: '16px' }} preview={false} />
                                    </div>
                                </div>
                                <div className="text-center my-3" style={{ marginTop: '-25px' }}>
                                    <Image className="stepImg" src={StepsImg1} height="170px" preview={false} />
                                </div>
                                <h4 className="text-dark text-center" style={{ fontFamily: 'RobotoMedium', fontWeight: 500 }}>
                                    based on your qeeg findings, treatment protocols may include:
                                    <span className="report-edit-icon edit-icon text-success pointer" onClick={handleNfbChange}>
                                        <EditIcon />
                                    </span>
                                </h4>
                                {/* <div
                                    className="d-flex w-100 p-3"
                                    style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: '210px' }}
                                > */}
                                    {nfbEdit ? (
                                        <div
                                            className="d-flex w-100 p-3"
                                            style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: '280px' }}
                                        >
                                            <div className="col px-3">
                                                <div className="d-flex w-100 markuphtml nfb-cont">
                                                    <p className="col-md-6 report-content para text-center" style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                                        Eyes Opened Condition
                                                    </p>
                                                    <p className="col-md-6 report-content para text-center" style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                                        Eyes Closed Condition
                                                    </p>
                                                </div>
                                                <NeuroPbmEditor handleNfbChange={handleNfbChange} getNeuro={getNeuro} />
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                        className="d-flex w-100 p-3 nfb-flex"
                                        style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: '210px' }}
                                        >
                                            <div className="col-md-6 ps-3 markuphtml nfb-cont">
                                                <p className="report-content para text-center" style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                                        Eyes Opened Condition
                                                </p>
                                                <div className="ps-2 nfb-txt">
                                                    {neuroFields && neuroFields?.data ? (
                                                        <div
                                                            className=" markuphtml1 text-overflow" 
                                                            style={{ fontFamily: 'RobotoRegular', lineHeight: 1.3,fontSize:'17px', overflowWrap:'break-word' }}
                                                            dangerouslySetInnerHTML={{ __html: neuroFields?.data?.neurofeedback_EO }}
                                                        ></div>
                                                    ) : (
                                                        <p className="" style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3,fontSize:'17px' }}></p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-md-6 ps-3">
                                                <p className="report-content para text-center" style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'RobotoRegular' }}>
                                                        Eyes Closed Condition
                                                </p>
                                                <div className="ps-3 nfb-txt">
                                                    {neuroFields && neuroFields?.data ? (
                                                        <div
                                                            className="markuphtml1 text-overflow"
                                                            style={{ fontFamily: 'RobotoRegular', lineHeight: 1.3 ,fontSize:'17px', overflowWrap:'break-word' }}
                                                            dangerouslySetInnerHTML={{ __html: neuroFields?.data?.neurofeedback_EC }}
                                                        ></div>
                                                    ) : (
                                                        <p className="" style={{ fontFamily: 'RobotoRegular', textAlign: 'justify', lineHeight: 1.3 }}></p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                {/* </div> */}
                            </div>
                        </div>
                        <div className="footer" style={{ textAlign: 'center' }}>
                            <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                            </h6>
                        </div>
                    </div>
                )
            ))}
            
            {(commonInfo?.pbm_flag || commonInfo?.pbm_flag == null) && (
                (released && !showPBM ? (
                    <div className="page-fifteen" id="page115"></div>

                ):(
                    <div
                        className="page-two mt-2 bg-white mx-auto page border-0"
                        id="page115"
                        style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
                    >
                        <div className="page-content">
                            <div className="d-flex  justify-content-between">
                                <h3 className="mb-0 col-auto ps-4 pt-4 pb-2 text-dark" style={{ fontFamily: 'AmiriBold', fontSize: '30px' }}>
                                    POSSIBLE TREATMENT OPTIONS
                                </h3>
                                <div className="patient-information d-flex flex-column justify-content-center" style={{ marginRight: '50px' }}>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        Name:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                            {commonInfo ? commonInfo?.patient_info?.pntname : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark" style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        Age:
                                        <div className="text-dark " style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                            {commonInfo ? commonInfo?.pnt_age : ''}
                                        </div>
                                    </h6>
                                    <h6 className="d-flex mb-0 text-dark " style={{ fontSize: '7px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                                        DOB:
                                        <div className=" text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight:500  }}>
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
                            <div style={{ borderBottom: '8px solid #3e4b69', width: '270px' }} />
                            <div className="page-body mt-4 px-4 page-head">
                                <p className="para" style={{ fontSize: '17px', textAlign: 'justify', lineHeight: 1.2, fontFamily: 'RobotoRegular' }}>
                                    Based upon the clinical information presented along with the individual&apos;s topographic maps, and in consideration of database deviancies, the following recommendations are made for
                                    transcranial photobiomodulation (tPBM). When qEEG guided, most individuals report changes after about 1-3 sessions and see lasting longterm results after just a couple months of
                                    treatment.
                                </p>
                                <h4 className="mt-5 mb-3 text-dark" style={{ fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>
                                    what is photobiomodulation and how does it work?
                                </h4>
                                <div className="d-flex w-100 ">
                                    <div className="col-md-6">
                                        <p className=" mt-2 para" style={{ fontSize: '17px', lineHeight: 1.2, textAlign: 'justify', fontFamily: 'RobotoRegular' }}>
                                            Transcranial photobiomodulation (PBM) is also known as light therapy. It is a power therapy that involves LEDs to deliver a specific wavelength that can penetrate the bones
                                            of the skull and be absorbed by the brain’s cells, much like plants do from the sun. The wavelength and frequency are based on specific conditions, organ treated, and over
                                            several thousand published studies on the utility of PBM in humans. This technology-based, non-invasive therapeutic training tool can be delivered in nearly any
                                            environment, including at home, with limited reported adverse effects. When present, tend to be minor, including temporary congestion, dizziness, headache, or fatigue.
                                        </p>
                                    </div>
                                    <div className="text-center col-md-6 " style={{ marginTop: '0px' }}>
                                        <Image className="neuroImg" src={PbmIcon} height={260} preview={false} style={{ height: 'auto', marginLeft: '15px', marginTop: '12px' }} />
                                    </div>
                                </div>
                                <div className="text-center my-4" style={{ marginTop: '50px' }}>
                                    <h5 className="text-dark text-center" style={{ fontSize: '24px', fontFamily: 'RobotoRegular' }}>
                                        based on your qeeg findings, treatment protocols may include:
                                        <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handlePbmChange()}>
                                            <EditIcon />
                                        </span>
                                    </h5>
                                </div>
                                <div className=" neuroEdit w-100 nfb-txt" style={{ border: '1px solid #dfe0e5', borderRadius: '0px 28px 0px 40px', background: '#dfe0e5', height: '210px', marginBottom: '160px' }}>
                                    {pbmEdit ? (
                                        <PbmEditor handlePbmChange={handlePbmChange} 
                                            getCommonService={() => { }}
                                            pbmArr={pbmArr} />
                                    ) : (
                                        <>
                                            <table className="w-100 m-2">
                                                <thead>
                                                    <tr>
                                                        <th className="text-center" style={{ fontSize: '17px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>Pulse Rate (Hz)</th>
                                                        <th className="text-center" style={{ fontSize: '17px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>Intensity (%)</th>
                                                        <th className="text-center" style={{ fontSize: '17px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>Location </th>
                                                        <th className="text-center" style={{ fontSize: '17px', fontFamily: 'RobotoRegular', fontWeight: 'bold' }}>Duration (min)</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {pbmArr?.map((item: any) => {
                                                        return (
                                                            <tr key={item.id}>
                                                                <td className="report-content p-2 text-center">{item.pulse_rate||'-'}</td>
                                                                <td className="report-content p-2 text-center">{item.intensity||'-'}</td>
                                                                <td className="report-content p-2 text-center">{item.location||'-'}</td>
                                                                <td className="report-content p-2 text-center">{item.duration||'-'}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="footer" style={{ textAlign: 'center' }}>
                            <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500 }}>
                                Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                            </h6>
                        </div>
                    </div>
                )
            ))}
              
            <BrainWaveTemplate
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
        </div >
    )
}

export default NfbPbmTemplate;