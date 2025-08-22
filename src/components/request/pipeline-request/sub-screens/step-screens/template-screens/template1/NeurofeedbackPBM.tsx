/* eslint-disable react/no-unescaped-entities */
import React, { useEffect, useState } from 'react';
import { Template3Logo, HeaderIcon, RibbonIcon, InfoRoundIcon, ChemIcon, SymptomsIcon, StepsImg } from 'components/shared/TemplateImages';
import { footerText, nfbText, pbmText } from 'components/shared/CompVariables';
import { Image, useSelector } from 'components/shared/AntComponent';
import TopographyTemplate from './TopographyTemplate';
import { EditIcon } from 'assets/img/custom-icons';
import NeuroPbmEditor from '../../editors/NeuroPbmEditor';
import { useDispatch } from 'react-redux';
import { getNeuroFeedback } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import PbmEditor from '../../editors/PbmEditor';

interface ChildProps {
    zoom: any;
    nfbEdit: boolean;
    pbmEdit: boolean;
    handlePbmChange: () => void;
    handleNfbChange: () => void;
    getCommonService: () => void;
}

const NeurofeedbackPBM: React.FC<ChildProps> = ({ zoom, nfbEdit, pbmEdit, handlePbmChange, handleNfbChange, getCommonService }) => {
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const location = useLocation();
    const dispatch = useDispatch();
    const { neuroFields, loading11 } = useSelector((state: any) => state.recAnalysis);
    const [pbmArr, setPbmArr] = useState([
        { id: 1, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 2, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 3, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 4, pulse_rate: '', intensity: '', location: '', duration: '' },
    ]);

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
        }
    }, [commonInfo]);

    return (
        <>
            {!commonInfo?.nfb_flag ? (
                ''
            ) : (
                <div id="page10" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                    <div className="page-content page-hd">
                        <div className="page-header d-flex">
                            <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                            <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                possible treatment options
                            </h5>
                            <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                        </div>
                        <div className="page-body">
                            <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, marginTop: '-20px' }}>
                                neurofeedback recommendations
                            </h4>
                            <div className="mb-3 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                <div className="col-auto">
                                    <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                </div>
                                <div className="col my-auto pe-2">
                                    <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px', lineHeight: 1.7 }}>
                                        Based upon the clinical information presented along with the individual`s topographic maps, sLORETA images, and in consideration of database
                                        deviancies, the following recommendations are made for neurofeedback training. When qEEG guided, most individuals report changes after about 5-8
                                        sessions and see lasting long-term results after about 40 sessions.
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex w-100">
                                <div className="col-md-1 chem-icon" style={{ marginTop: '-15px' }}>
                                    <img src={ChemIcon} width="auto" height="90px"  />
                                </div>
                                <div className="col">
                                    <h4 className="text-dark text-center w-75 ms-5 ps-2 fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500 }}>
                                        What is neurofeedback and how does it work?
                                    </h4>
                                </div>
                            </div>
                            <div className="d-flex w-100 " style={{ marginTop: '-6px' }}>
                                <div className="col-md-6 px-3">
                                    <p className='chem-text' style={{ fontFamily: 'RobotoRegular', fontSize: '14px', textAlign: 'center', lineHeight: 1.4 }}>
                                        Neurofeedback is a technology-based, non-invasive therapeutic training tool that can be used to improve a variety of mental health conditions.
                                        Neurofeedback therapy helps you control the brain waves that, when imbalanced, are associated with conditions such as depression, anxiety, ADHD, and
                                        more. During neurofeedback sessions, an individual`s brain is trained how to bring abnormally fast or slow waves to within the normal range and
                                        improve daily symptoms. You may sit back and relax while playing a game, listening to music, or watching a show while a technician monitors your brain
                                        waves.
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <Image className="neuroImg" src={SymptomsIcon} height={250} style={{ width: 'auto', marginTop: '-20px'}} preview={false} />
                                </div>
                            </div>
                            <div className="text-center" style={{ marginTop: '-25px' }}>
                                <Image className="stepImg" src={StepsImg} height="170px" preview={false} />
                            </div>
                            <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500 }}>
                                based on your qeeg findings, treatment protocols may include:
                                <span className="report-edit-icon edit-icon text-success pointer" onClick={handleNfbChange}>
                                    <EditIcon />
                                </span>
                            </h4>
                            {/* <div
                                className="d-flex w-100 p-3 nfb-flex"
                                style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: nfbEdit ? 'auto' : '190px',  marginBottom:'150px' }}
                            > */}
                                {nfbEdit ? (
                                    <div
                                    className="d-flex w-100 p-3"
                                    style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: '280px',marginBottom: nfbEdit? '100px' : '' }}
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
           
                                        <NeuroPbmEditor handleNfbChange={handleNfbChange} getNeuro={getNeuro}  />
                                   
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
                                                            style={{ fontFamily: 'RobotoRegular', lineHeight: 1.3 , overflowWrap:'break-word',fontSize:'17px' }}
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
                        <div className="footer fs-12 px-2" style={{ fontFamily: 'RobotoRegular'  }}>
                            <div className="mb-0 d-flex my-auto">
                                <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                    {nfbText}
                                </p>
                                <div className="col-md-2 my-auto text-center pe-0">
                                    <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                </div>
                            </div>
                            {footerText}
                        </div>
                    </div>
                </div>
            )}
            {!commonInfo?.pbm_flag ? (
                ''
            ) : (
                <div id="page11" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                    <div className="page-content page-hd">
                        <div className="page-header d-flex">
                            <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                            <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                                possible treatment options
                            </h5>
                            <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                        </div>
                        <div className="page-body">
                            <h4 className="text-dark text-center fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, marginTop: '-20px' }}>
                                photobiomodulation recommendations
                            </h4>
                            <div className="mb-3 d-flex w-100" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px' }}>
                                <div className="col-auto">
                                    <Image src={InfoRoundIcon} preview={false} style={{ height: '130px', width: 'auto' }} />
                                </div>
                                <div className="col my-auto pe-2">
                                    <p className="my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '12px', lineHeight: 1.7 }}>
                                        Based upon the clinical information presented along with the individual`s topographic maps, and in consideration of database deviancies, the following
                                        recommendations are made for transcranial photobiomodulation (tPBM). When qEEG guided, most individuals report changes after about 1-3 sessions and
                                        see lasting longterm results after just a couple months of treatment.
                                    </p>
                                </div>
                            </div>
                            <div className="d-flex w-100">
                                <div className="col-md-1">
                                    <img src={ChemIcon} width="auto" height="90px" style={{ marginTop: '-15px' }}/>
                                </div>
                                <div className="col">
                                    <h4 className="text-dark text-center w-75 ms-5 ps-2 fs-24" style={{ fontFamily: 'RobotoMedium', fontWeight: 500 }}>
                                        What is photobiomodulation and how does it work?
                                    </h4>
                                </div>
                            </div>
                            <div className="d-flex w-100" style={{ marginTop: '-6px' }}>
                                <div className="col-md-6 px-3">
                                    <p style={{ fontFamily: 'RobotoRegular', textAlign: 'center', fontSize: '14px' }}>
                                        Transcranial photobiomodulation (PBM) is also known as light therapy. It is a power therapy that involves LEDs to deliver a specific wavelength that
                                        can penetrate the bones of the skull and be absorbed by the brain’s cells, much like plants do from the sun. The wavelength and frequency are based on
                                        specific conditions, organ treated, and over several thousand published studies on the utility of PBM in humans. This technology-based, non-invasive
                                        therapeutic training tool can be delivered in nearly any environment, including at home, with limited reported adverse effects. When present, tend to
                                        be minor, including temporary congestion, dizziness, headache, or fatigue.
                                    </p>
                                </div>
                                <div className="col-md-6">
                                    <Image className="neuroImg" src={SymptomsIcon} height={250} style={{ width: 'auto', marginTop: '-20px' }} preview={false} />
                                </div>
                            </div>
                            <h5 className="text-dark text-center fs-24 me-0" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '24px',marginRight:'0px' }}>
                                based on your qeeg findings, treatment protocols may include:
                                <span className="report-edit-icon edit-icon text-success pointer" onClick={() => handlePbmChange()}>
                                    <EditIcon />
                                </span>
                            </h5>
                            <div className="w-100 p-3" style={{ background: '#dfe0e5', borderTopRightRadius: '40px', borderBottomLeftRadius: '40px', height: '232px' }}>
                                {pbmEdit ? (
                                    <PbmEditor handlePbmChange={handlePbmChange} getCommonService={getCommonService} pbmArr={pbmArr} />
                                ) : (
                                    <>
                                        <table className="w-100">
                                            <thead>
                                                <tr>
                                                    <th className="text-center fs-17">Pulse Rate (Hz)</th>
                                                    <th className="text-center fs-17">Intensity (%)</th>
                                                    <th className="text-center fs-17">Location </th>
                                                    <th className="text-center fs-17">Duration (min)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pbmArr?.map((item: any) => {
                                                    return (
                                                        <tr key={item.id}>
                                                            <td className="text-center p-2 fs-17">{item.pulse_rate || '-'}</td>
                                                            <td className="text-center p-2 fs-17">{item.intensity || '-'}</td>
                                                            <td className="text-center p-2 fs-17">{item.location || '-'}</td>
                                                            <td className="text-center p-2 fs-17">{item.duration || '-'}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="footer fs-12 px-2" style={{ fontFamily: 'RobotoRegular' }}>
                            <div className="mb-0 d-flex my-auto">
                                <p className="col-md-9 my-auto" style={{ fontFamily: 'RobotoMedium', fontSize: '6px' }}>
                                    {pbmText}
                                </p>
                                <div className="col-md-2 my-auto text-center pe-0">
                                    <img src={Template3Logo} height="69px" width="auto" className="mx-auto" alt="axon logo" />
                                </div>
                            </div>
                            {footerText}
                        </div>
                    </div>
                </div>
            )}
            <div id="page12" className={`page-three bg-white p-2 mx-auto mt-2 `} style={{ zoom: zoom }}>
                <div className="page-content">
                    <div className="page-header d-flex">
                        <img src={RibbonIcon} width="auto" className="left-icon" height="140px" alt="ribbon icon" />
                        <h5 className="text-dark heading" style={{ fontFamily: 'RobotoRegular', width: '550px' }}>
                            conclusion
                        </h5>
                        <img src={HeaderIcon} width="auto" height="130px" alt="axon icon" />
                    </div>
                    <div className="page-body">
                        <p className="fs-15" style={{ fontFamily: 'RobotoRegular', textAlign: 'justify' }}>
                            These suggestions are offered as a starting point for diagnostic support and treatments. Individual patient responses will vary. The specific treatments and the
                            sequencing will likely require modification based on clinical response. Suggestions may be implemented differently depending on the instrumentation used, past
                            responses to medication, or current medication regimen. The results of this analysis should be considered together with other measures in assessing, diagnosing,
                            and treating clients. Healthy Paths, Inc and its affiliates assume no responsibility whatsoever for the application of any therapies or interventions based on the
                            information contained in this report, including medication interactions. With the delivery and reading of this report, the referral requesting this service agrees
                            with the terms and conditions and assumes all responsibility for any clinical intervention.
                        </p>
                        <p className="mt-5 mb-0 fs-15 pt-2" style={{ fontFamily: 'RobotoRegular' }}>
                            Dr. Steve Rondeau BCN (EEG)
                        </p>
                        <p className="fs-15" style={{ fontFamily: 'RobotoRegular' }}>
                            Medical Director
                        </p>
                        <div>
                            <p className="fs-11 fw-500 mb-2" style={{fontSize: '9px', fontFamily: 'RobotoRegular', textDecoration: 'underline' }}>
                                Legal
                            </p>
                            <p className="fs-11 fw-500" style={{fontSize: '9px', fontFamily: 'RobotoRegular', lineHeight: 2.3 }}>
                                The information and recommendations provided by Healthy Paths Inc. dba Axon EEG Solutions (“Axon”, “we," "us," or "our") in this TIEReport (the "Report") is
                                for general informational and educational purposes and is intended to be used solely as a diagnostic aid.
                            </p>
                            <p className="fs-11 fw-bold " style={{fontSize: '9px', fontFamily: 'RobotoRegular' }}>
                                While reviewing the Report it is important that you understand the following:
                            </p>
                            <p className="fs-10 " style={{fontSize: '9px', fontFamily: 'RobotoRegular', lineHeight: 2.3 }}>
                                1.
                                <span className="px-2 fs-10 fw-bold" style={{fontSize: '9px', fontFamily: 'RobotoRegular', textDecoration: 'underline' }}>
                                    NOT MEDICAL ADVICE/CONSULT YOUR PHYSICIAN.
                                </span>
                                THE REPORT DOES NOT CONTAIN HEALTH OR MEDICAL ADVICE AND IS NOT A SUBSTITUTE FOR PROFESSIONAL MEDICAL ADVICE. BEFORE TAKING ANY ACTIONS, INCLUDING ANY
                                LIFESTYLE CHANGES OR STARTING A NEW MEDICATION (WHETHER PRESCRIPTION, OVER THE COUNTER OR NATURAL SUPPLEMENTS) BASED UPON THE REPORT, WE STRONGLY RECOMMEND
                                THAT YOU TO CONSULT WITH THE APPROPRIATE PROFESSIONALS, INCLUDING YOUR PRIMARY CARE PHYSICIAN. YOU SHOULD NEVER DELAY SEEKING MEDICAL TREATMENT OR DISREGARD
                                PROFESSIONAL MEDICAL ADVICE DUE TO INFORMATION OR RECOMMENDATIONS CONTAINED IN THIS REPORT. THE USE OR RELIANCE OF ANY INFORMATION OR RECOMMENDATIONS IS
                                SOLELY AT YOUR OWN RISK.
                            </p>
                            <p className="fs-10 " style={{fontSize: '9px', fontFamily: 'RobotoRegular', lineHeight: 2.3 }}>
                                2.
                                <span className="px-2 fs-10 fw-bold" style={{fontSize: '9px', fontFamily: 'RobotoRegular', textDecoration: 'underline' }}>
                                    NO REPRESENTATIONS OR WARRANTIES ARE MADE OR GIVEN.
                                </span>
                                ALL INFORMATION AND RECOMMENDATIONS IN THE REPORT ARE PROVIDED IN GOOD FAITH BUT ARE PROVIDED “AS-IS”, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR
                                IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNRESS FOR A PARTICULAR PURPOSE, OR SATISFACTORY QUALITY. WE MAKE NO
                                REPRESENTATION OF ANY KIND, EXPRESS OR IMPLIED, REGARDING THE ACCURACY, ADEQUACY, VALIDITY, RELIABILITY, AVAILABILITY, OR COMPLETENESS OF ANY INFORMATION OR
                                RECOMMENDATION IN THE REPORT
                            </p>
                            <p className="fs-10 " style={{fontSize: '9px', fontFamily: 'RobotoRegular', lineHeight: 2.3 }}>
                                3.
                                <span className="px-2 fs-10 fw-bold" style={{fontSize: '9px', fontFamily: 'RobotoRegular', textDecoration: 'underline' }}>
                                    NO LIABILITY.
                                </span>
                                UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE REPORT OR RELIANCE ON ANY
                                INFORMATION OR RECOMMENDATIONS PROVIDED IN THE REPORT. YOUR USE OF THE REPORT AND YOUR RELIANCE ON ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN
                                RISK. WE HEREBY DISCLAIM ANY AND ALL LIABILTY FOR ANY INJURY OR DAMAGE TO OR OTHER IMPACT ON YOUR HEALTH OR MEDICAL CONDITION, WHETHER OR NOT CAUSED BY OR
                                RELATED TO (EITHER DIRECTLY OR INDIRECTLY) YOUR USE OF THE INFORMATION OR RECOMMENDATIONS CONTAINED WITHIN THE REPORT
                            </p>
                        </div>
                    </div>
                    <div className="footer fs-12 ps-2" style={{ fontFamily: 'RobotoRegular' }}>
                        <div className="text-center">
                            <img src={Template3Logo} height="100px" width="auto" />
                            <div className="mt-2">
                                <a className="fs-14" style={{ fontFamily: 'RobotoRegular', color: 'black' }} href="https://axoneegsolutions.com/education-materials-and-publications/">
                                    https://axoneegsolutions.com/education-materials-and-publications/
                                </a>
                                <p className="mb-0 fs-14" style={{ fontFamily: 'RobotoRegular' }}>
                                    Click here for more resources or to read about our research
                                </p>
                            </div>
                        </div>

                        <div style={{ fontFamily: 'RobotoRegular' }}>{footerText}</div>
                    </div>
                </div>
            </div>
            {!commonInfo?.images_only_flag ? '' : <TopographyTemplate zoom={zoom} />}
        </>
    );
};

export default NeurofeedbackPBM;
