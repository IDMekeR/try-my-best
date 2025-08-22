import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch, url2, footerText } from 'components/shared/CompVariables';
import { Image } from 'components/shared/AntComponent';
import { Template3Logo } from 'components/shared/TemplateImages';
import background from 'assets/img/report-icons/background.png';
import axios from 'axios';
import dayjs from 'dayjs';

interface ChildProps {
    zoom: any;
}

const TopographyTemplate2: React.FC<ChildProps> = ({ zoom }) => {
    const { topoResultInfo, resultInfo, success3, loading3, error3 } = useSelector((state: any) => state.wizard);
    const [ecResultGraph, setEcResultGraph] = useState('');
    const [ecFftAbs1, setEcFftAbs1] = useState('');
    const [ecFftAbs2, setEcFftAbs2] = useState('');
    const [ecFftRel1, setEcFftRel1] = useState('');
    const [ecFftRel2, setEcFftRel2] = useState('');
    const [eoResultGraph, setEoResultGraph] = useState('');
    const [eoFftAbs1, setEoFftAbs1] = useState('');
    const [eoFftAbs2, setEoFftAbs2] = useState('');
    const [eoFftRel1, setEoFftRel1] = useState('');
    const [eoFftRel2, setEoFftRel2] = useState('');
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    const ecGraphInfo = async (url: string) => {
        // setLoading(true);
        // setError(null);
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            if (response?.data) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    // Construct the data URL
                    const imageSrc = `data:image/png;base64,${base64.split(',')[1]}`;
                    setEcResultGraph(imageSrc);
                };
                const blob = new Blob([response.data], { type: 'image/png' });
                reader.readAsDataURL(blob);
            } else {
                // setError('No data received');
            }
        } catch (err) {
            // setError('Error fetching image');
            console.error('Error fetching image:', err);
        } finally {
            // setLoading(false);
        }
    };
    const eoGraphInfo = async (url: string) => {
        // setLoading(true);
        // setError(null);
        try {
            const response = await axios.get(url, { responseType: 'arraybuffer' });
            if (response?.data) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64 = reader.result as string;
                    // Construct the data URL
                    const imageSrc = `data:image/png;base64,${base64.split(',')[1]}`;
                    setEoResultGraph(imageSrc);
                };
                const blob = new Blob([response.data], { type: 'image/png' });
                reader.readAsDataURL(blob);
            } else {
                // setError('No data received');
            }
        } catch (err) {
            // setError('Error fetching image');
            console.error('Error fetching image:', err);
        } finally {
            // setLoading(false);
        }
    };

    const fftAbsPower = (url: any) => {
        axios
            .get(url)
            .then((res: any) => {
                if (res?.data) {
                    setEcFftAbs1(res.data?.page1_data);
                    setEcFftAbs2(res.data?.page2_data);
                }
            })
            .catch(function (error: any) {
                console.log('error', error);
            });
    };

    const fftRelPower = (url: any) => {
        axios
            .get(url)
            .then((res: any) => {
                if (res?.data) {
                    setEcFftRel1(res.data?.page1_data);
                    setEcFftRel2(res.data?.page2_data);
                }
            })
            .catch(function (error: any) {
                console.log('error', error);
            });
    };
    const fftAbsPowerEo = (url: any) => {
        axios
            .get(url)
            .then((res: any) => {
                if (res?.data) {
                    setEoFftAbs1(res.data?.page1_data);
                    setEoFftAbs2(res.data?.page2_data);
                }
            })
            .catch(function (error: any) {
                console.log('error', error);
            });
    };

    const fftRelPowerEo = (url: any) => {
        axios
            .get(url)
            .then((res: any) => {
                if (res?.data) {
                    setEoFftRel1(res.data?.page1_data);
                    setEoFftRel2(res.data?.page2_data);
                }
            })
            .catch(function (error: any) {
                console.log('error', error);
            });
    };

    useEffect(() => {
        if (topoResultInfo?.topo_path) {
            if (topoResultInfo?.topo_path?.EC_result_graph) {
                ecGraphInfo( topoResultInfo?.topo_path?.EC_result_graph?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_result_graph  : '');
            }
            if (topoResultInfo?.topo_path?.EC_FFT_absolute_power_path) {
                fftAbsPower(topoResultInfo?.topo_path?.EC_FFT_absolute_power_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_FFT_absolute_power_path  : '');
            }
            if (topoResultInfo?.topo_path?.EC_FFT_relative_power_path) {
                fftRelPower(topoResultInfo?.topo_path?.EC_FFT_relative_power_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EC_FFT_relative_power_path  : '');
            }
            if (topoResultInfo?.topo_path?.EO_result_graph) {
                eoGraphInfo(topoResultInfo?.topo_path?.EO_result_graph?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_result_graph  : '');
            }
            if (topoResultInfo?.topo_path?.EO_FFT_absolute_power_path) {
                fftAbsPowerEo(topoResultInfo?.topo_path?.EO_FFT_absolute_power_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_FFT_absolute_power_path : '');
            }
            if (topoResultInfo?.topo_path?.EO_FFT_relative_power_path) {
                fftRelPowerEo(topoResultInfo?.topo_path?.EO_FFT_relative_power_path?.startsWith('https:') ? topoResultInfo?.topo_path?.EO_FFT_relative_power_path : '');
            }
        }
    }, [topoResultInfo]);

    return (
        <div>
            <div id="page13" className="page-two bg-white p-2 mx-auto pt-2" 
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <p className="text-center w-75 mx-auto mt-5" style={{ fontFamily: 'RobotoRegular' }}>
                        The recordings were visually artifacted with noted movement and EMG artifacts removed. A fragment of EEG recorded in the eyes closed (EC) condition is presented
                        below.
                    </p>
                    <div className="page-body">
                        <Image src={`${ecResultGraph}`} alt="ec result graph" height="600px" />
                    </div>
                </div>
                <div className="footer" style={{ textAlign: 'center' }}>
                    <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                        Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                    </h6>
                </div>
            </div>
            <div className="p-1"></div>
            {/* Absolute power EC */}
            <div id="page14" className="page-two bg-white px-2 pt-4 pb-2 mx-auto text-center" 
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Closed
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo}  width={140} height={60} preview={false} alt="template logo"  />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Absolute Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${ecFftAbs1}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            <div id="page15" className="page-two bg-white px-2 pt-5 mx-auto text-center" 
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start ">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Closed
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Absolute Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${ecFftAbs2}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            {/* relative power EC */}
            <div id="page16" className="page-two bg-white px-2 pt-5 mx-auto text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header mt-1 d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Closed
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Relative Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${ecFftRel1}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            <div id="page17" className="page-two bg-white px-2 pt-5 mx-auto text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex mt-1 p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Closed
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Relative Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${ecFftRel2}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            {/* EO result graph */}
            <div id="page18" className="page-two bg-white px-2 pt-5 mx-auto text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <p className="text-center w-75 mx-auto mt-5 pt-5" style={{ fontFamily: 'RobotoRegular' }}>
                        The recordings were visually artifacted with noted movement and EMG artifacts removed. A fragment of EEG recorded in the eyes opened (EO) condition is presented
                        below.
                    </p>
                    <div className="page-body" style={{ height: '244mm' }}>
                        <Image src={`${eoResultGraph}`} alt="eo result graph" height="auto" />
                    </div>
                </div>
                <div className="footer" style={{ textAlign: 'center' }}>
                    <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                        Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                    </h6>
                </div>
            </div>
            <div className="p-1"></div>
            {/* absolute power EO */}
            <div id="page19" className="page-two bg-white px-2 pt-5 mx-auto text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Opened
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Absolute Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${eoFftAbs1}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            <div id="page20" className="page-two bg-white px-2 pt-5 mx-auto  text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Opened
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Absolute Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${eoFftAbs2}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            <div id="page21" className="page-two bg-white px-2 pt-5 mx-auto  text-center"
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Opened
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '235mm' }}>
                        <h5 className="text-dark my-3" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Relative Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${eoFftRel1}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
            <div className="p-1"></div>
            <div id="page22" className="page-two bg-white px-2 pt-5 mx-auto text-center" 
            style={{ zoom: zoom, backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            >
                <div className="page-content">
                    <div className="page-header d-flex p-2">
                        <div className="text-start">
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                EEG ID :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.pntid : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Test date :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? dayjs(new Date(resultInfo?.req_info?.servicerequest_info?.created_on)).format('MM-DD-YYYY') : '--'}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Age :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.servicerequest_info?.pnt_age : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Birth gender :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.sex_at_birth : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Gender identity :
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    {resultInfo ? resultInfo?.req_info?.patient_info?.gender_identity : ''}
                                </span>
                            </p>
                            <p className="mb-0" style={{ fontFamily: 'RobotoMedium' }}>
                                Condition:
                                <span className="ps-2" style={{ fontFamily: 'RobotoMedium' }}>
                                    Eyes Opened
                                </span>
                            </p>
                        </div>
                        <div className="text-end ms-auto col-auto my-auto">
                            <Image  src={Template3Logo} alt="template logo" width={140} height={60} preview={false} />
                        </div>
                    </div>
                    <div className="page-body mt-4" style={{ height: '237mm' }}>
                        <h5 className="text-dark my-4" style={{ fontFamily: 'RobotoMedium', fontWeight: 500, fontSize: '28px' }}>
                            FFT Relative Power
                        </h5>
                        <Image className="col mb-5 px-3" src={`data:image/png;base64,${eoFftRel2}`} alt="eo result graph" height="auto" />
                    </div>
                    <div className="footer" style={{ textAlign: 'center' }}>
                        <h6 className="footer-text text-start mb-0 ps-2 pb-1 text-dark" style={{ fontSize: '10px', fontFamily: 'RobotoRegular', fontWeight:500  }}>
                            Copyright &copy; {currentYear} Healthy Paths, Inc. All rights reserved
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopographyTemplate2;
