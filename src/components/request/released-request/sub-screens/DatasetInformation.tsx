import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Tabs, Progress, Spin, Avatar, Tooltip, Divider, message, } from 'components/shared/AntComponent';
import ReportBaseTemplate from 'components/request/pipeline-request/sub-screens/step-screens/template-screens/template1/ReportBaseTemplate';
import InterpretationDetails from './InterpretationDetails';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import html2pdf from 'html2pdf.js';
import { useSelector, useDispatch } from 'react-redux';
import { getResultDocDownload, validateRequest } from 'services/actions/releasedReqAction';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProgressProps } from 'antd';
import { getAssociateCommon } from 'services/actions/commonServiceAction';
import { getDataset, getResultInfo, getTopoResultInfo } from 'services/actions/pipeline/stepwizardAction';
import { ExclamationCircleOutlined, SyncOutlined, UserOutlined } from '@ant-design/icons';
import { url2 } from 'components/shared/CompVariables';
import { getRequestInfo } from 'services/actions/pipeline/pipelineAction';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import ReassesReq from '../modal/ReassesReq';
import { getPhqQuesAns } from 'services/actions/newRequestAction';
import TermsAgreement from 'components/request/modal/sub-screens/TermsAgreement';
import { Select } from 'components/shared/FormComponent';
import BaseTemplate from 'components/request/pipeline-request/sub-screens/step-screens/template-screens/template2/BaseTemplate';
import dayjs from 'dayjs';
import axios from 'axios';

interface Document {
    uri: string;
    fileName?: string;
}

const DatasetInformation: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { resultInfo, loading4, datasetInfo, loading16 } = useSelector((state: any) => state.wizard);
    const { resultData, loading4: resultLoading, error4 } = useSelector((state: any) => state.released);
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { requestInfo, loading5 } = useSelector((state: any) => state.pipeline);
    const { loading4: phqLoading, phqAnsInfo } = useSelector((state: any) => state.newreq);
    const [downloading, setDownloading] = useState(0);
    const requestData = !loading5 ? requestInfo?.data?.reqinfo : [];
    const { resultDownProgress } = useSelector((state: any) => state.download);
    const { neuroFields } = useSelector((state: any) => state.recAnalysis);
    const [selectedTab, setSelectedTab] = useState('1');
    const [showEdit, setShowEdit] = useState(false);
    const [recEdit, setRecEdit] = useState(false);
    const [intEdit, setIntEdit] = useState(false);
    const [glanceEdit, setGlanceEdit] = useState(false);
    const [pdrEdit, setPdrEdit] = useState(false);
    const [medicEdit, setMedicEdit] = useState(false);
    const [suppEdit, setSuppEdit] = useState(false);
    const [suppEdit1, setSuppEdit1] = useState(false);
    const [lyfEdit, setLyfEdit] = useState(false);
    const [lyfEdit1, setLyfEdit1] = useState(false);
    const [nfbEdit, setNfbEdit] = useState(false);
    const [pbmEdit, setPbmEdit] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [downloadPercent, setDownloadPercent] = useState(0);
    const [isDownload, setIsDownload] = useState(false);
    const [openReassModal, setOpenReassModal] = useState(false);
    const addReqInfo1 = resultInfo?.req_info || [];
    const [phq, setPhq] = useState([]);
    const [termModal, setTermModal] = useState(false);
    const [selectedOption, setSelectedOption] = useState('3');
    const [datahubFile, setDatahubFile]: any = useState();
    const isMuRhythm = Boolean(commonInfo?.interpretationmakers?.find((item) => item.markername === 'Mu Rhythm Present' && (item?.eyeopen === 'true' || item?.eyeclosed === 'true')));
    const hasMedicChoice = commonInfo?.medic_templ?.some((item) => item.ischoices === true) || false;
    const dataUri = resultData?.data?.encodefiledata ? `data:application/pdf;base64,${resultData?.data?.encodefiledata}` : '';
    document.querySelectorAll('.report-edit-icon').forEach((el: any) => (el.style.visibility = 'hidden'));
    const [docLoad, setDocLoad] = useState(false);

    const [neuroEC, setNeuroEC] = useState();
    const [neuroEO, setNeuroEO] = useState();
    const [showPBM, setShowPBM] = useState(false);

    useEffect(() => {
        if (neuroFields) {
            setNeuroEO(neuroFields?.data?.neurofeedback_EO);
            setNeuroEC(neuroFields?.data?.neurofeedback_EC);
        }
    }, [neuroFields])

    useEffect(() => {
        if (commonInfo) {
            const duration = commonInfo?.photobiomodulation_info?.duration;
            const intensity = commonInfo?.photobiomodulation_info?.intensity;
            const location = commonInfo?.photobiomodulation_info?.location;
            const pulse_rate = commonInfo?.photobiomodulation_info?.pulse_rate;

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
    }, [commonInfo])

    // Example Usage:
    //   const documentUri = await fetchDocumentBlob(yourUrl);
    const accountDocs = useMemo(() => {
        return [
            {
                uri: dataUri?.toString() || '',
                fileName: addReqInfo1?.servicerequest_info?.encoded_RequestNumber ? `${addReqInfo1?.servicerequest_info?.encoded_RequestNumber}_Manual_report.pdf` : `Manual_report.pdf`,
            },
        ];
    }, [resultData, addReqInfo1]);

    const accountDocs2 = useMemo(() => {
        return [
            {
                uri: datasetInfo?.data?.RequestResultpath?.startsWith('https:') ? datasetInfo?.data?.RequestResultpath : '',
                fileName: addReqInfo1?.servicerequest_info?.encoded_RequestNumber ? `${addReqInfo1?.servicerequest_info?.encoded_RequestNumber}_Datahub_report.pdf` : `Datahub_report.pdf`,
            },
        ];
    }, [datasetInfo, addReqInfo1]);

    const showReassModal = () => {
        setOpenReassModal(true);
    };

    const showTermModal = () => {
        setTermModal(true);
    };

    const closeTermModal = () => {
        setTermModal(false)
    }

    const fileOptions1 = [
        { label: 'Datahub Template 1', value: '2' },
        { label: 'Datahub Template 2', value: '3' },
    ];

    const closeResModal = (item: any) => {
        setOpenReassModal(false);
        if (item == true) {
            navigate('/released-request');
        }
    };
    const convertBlobToBase64 = (blob: Blob) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);  // Converts the blob to base64
        });
    };
    const getFileBlob = async (file: any) => {
        try {
            const url = file;
            setDownloading(0);
            const response = await axios.get(url, {
                responseType: 'blob', // Ensure that the response is treated as a blob
                headers: {
                    'Content-Type': 'application/pdf', // Adjust based on your server's response content type
                },

                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloading(percentCompleted);
                        setDocLoad(false);
                    }
                },
            });
            // setDownloadPercent(0);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // const link = document.createElement('a');
            const fileUrl = window.URL.createObjectURL(blob);
            const base64String = await convertBlobToBase64(blob);
            const pdfBase64String = base64String.replace("data:application/octet-stream;base64,", "data:application/pdf;base64,");
            // Set the Base64 string into the state
            setDatahubFile(pdfBase64String);
            setDocLoad(true);
            // link.download =  'download.pdf';
            // link.click();
            // setIsDownload(false);

            // Clean up the URL object
            window.URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error('There was a problem with the download operation:', error);
        } finally {
            setDownloading(0);
        }
    }

    useEffect(() => {
        if (datasetInfo?.data?.RequestResultpath && datasetInfo?.data?.RequestResultpath !== 'None') {
            getFileBlob(datasetInfo?.data?.RequestResultpath);
            setDocLoad(false);
        }
    }, [datasetInfo?.data?.RequestResultpath, selectedTab])

    const validateReleaseReq = (id) => {
        const inputJson = {
            servicerequestid: id,
            file_validate: false,
        };
        dispatch(validateRequest(inputJson) as any);
    };
    function getPhqDetails() {
        dispatch(getPhqQuesAns(location.state?.rowData?.id) as any);
    }
    useEffect(() => {
        validateReleaseReq(location?.state?.rowData?.id);
    }, []);

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const docs = [
        {
            uri: docLoad ? datahubFile : '',
            fileName: addReqInfo1?.servicerequest_info
                ? `${addReqInfo1.servicerequest_info.encoded_RequestNumber}_Datahub_report.pdf`
                : '_Datahub_report.pdf',
        }
    ];

    function getResultInfor(id: any) {
        const inputJson = {
            resultdocid: id,
        };
        dispatch(getResultDocDownload(inputJson) as any);
    }

    useEffect(() => {
        if (resultInfo?.req_info?.servicerequest_info?.result_docid && resultInfo?.req_info?.servicerequest_info?.result_docid != 0) {
            getResultInfor(resultInfo?.req_info?.servicerequest_info?.result_docid);
        }
    }, [resultInfo?.req_info]);

    function getReleasedData() {
        const inputJson = {
            servicerequestid: location.state.id,
        };
        dispatch(getResultInfo(inputJson) as any);
    }

    useEffect(() => {
        getReleasedData();
    }, []);

    const handlePntChange = () => {
        setShowEdit(!showEdit);
    };
    const handleRecChange = () => {
        setRecEdit(!recEdit);
    };
    const handleInterpretChange = () => {
        setIntEdit(!intEdit);
    };
    const handleGlanceChange = () => {
        setGlanceEdit(!glanceEdit);
    };
    const handlePdrChange = () => {
        setPdrEdit(!pdrEdit);
    };
    const handleMedicChange = () => {
        setMedicEdit(!medicEdit);
    };
    const handleSuppChange = () => {
        setSuppEdit(!suppEdit);
    };
    const handleSuppChange1 = () => {
        setSuppEdit1(!suppEdit1);
    };
    const handleLyfChange = () => {
        setLyfEdit(!lyfEdit);
    };
    const handleLyfChange1 = () => {
        setLyfEdit1(!lyfEdit1);
    };
    const handleNfbChange = () => {
        setNfbEdit(!nfbEdit);
    };
    const handlePbmChange = () => {
        setPbmEdit(!pbmEdit);
    };

    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        };
        dispatch(getAssociateCommon(inputJson) as any);
    }

    const downloadPDF = () => {
        setLoading(true);
        // !isDownload && setIsResultApprove(true)
        setShowEdit(false);
        setRecEdit(false);
        setIntEdit(false);
        setGlanceEdit(false);
        setPdrEdit(false);
        setMedicEdit(false);
        setSuppEdit(false);
        setSuppEdit1(false);
        setLyfEdit(false);
        setLyfEdit1(false);
        setNfbEdit(false);
        setPbmEdit(false);
        setTimeout(() => {
            if (selectedOption === '2') {
                handleDownloadPDF();
            } else if (selectedOption === '3') {
                handleDownloadPDF1();
            }

        }, 2000);
    };
    function getRequestDetails() {
        dispatch(getRequestInfo(location.state?.id) as any);
    }

    const handleDownloadPDF = async () => {
        let selectedSupp = [];
        let selectedLyf = [];
        selectedSupp = commonInfo?.mdnutritional_supplementation_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        selectedLyf = commonInfo?.lifestyle_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        setProgress(0);
        const opt = {
            margin: [0, 0, 0, 0],
            filename: resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_Datahub_report.pdf` : `Datahub_report.pdf`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'Portrait' },
            enableLinks: true,
        };

        document.querySelectorAll('.report-edit-icon').forEach((el: any) => (el.style.visibility = 'hidden'));

        const element1: any = document.getElementById('page1');
        const element2: any = document.getElementById('page2');
        const element3: any = document.getElementById('page3');
        const element4: any = document.getElementById('page4');
        const element5: any = document.getElementById('page5');
        const element6: any = document.getElementById('page6');
        const element7: any = document.getElementById('page7');
        const element8: any = document.getElementById('page8');
        const element9: any = document.getElementById('page9');
        const element10: any = document.getElementById('page10');
        const element11: any = document.getElementById('page11');
        const element12: any = document.getElementById('page12');
        const element13: any = document.getElementById('page13');
        const element14: any = document.getElementById('page14');
        const element15: any = document.getElementById('page15');
        const element16: any = document.getElementById('page16');
        const element17: any = document.getElementById('page17');
        const element18: any = document.getElementById('page18');
        const element19: any = document.getElementById('page19');
        const element20: any = document.getElementById('page20');
        const element21: any = document.getElementById('page21');
        const element22: any = document.getElementById('page22');

        const originalZoom = {
            page1: element1?.style.zoom,
            page2: element2?.style.zoom,
            page3: element3?.style.zoom,
            page4: element4?.style.zoom,
            page5: element5?.style.zoom,
            page6: element6?.style.zoom,
            page7: element7?.style.zoom,
            page8: element8?.style.zoom,
            page9: element9?.style.zoom,
            page10: element10?.style.zoom,
            page11: element11?.style.zoom,
            page12: element12?.style.zoom,
            page13: element13?.style.zoom,
            page14: element14?.style.zoom,
            page15: element15?.style.zoom,
            page16: element16?.style.zoom,
            page17: element17?.style.zoom,
            page18: element18?.style.zoom,
            page19: element19?.style.zoom,
            page20: element20?.style.zoom,
            page21: element21?.style.zoom,
            page22: element22?.style.zoom,
        };

        const resetZoom = () => {
            if (element1) element1.style.zoom = '1';
            if (element2) element2.style.zoom = '1';
            if (element3) element3.style.zoom = '1';
            if (element4) element4.style.zoom = '1';
            if (element5) element5.style.zoom = '1';
            if (element6) element6.style.zoom = '1';
            if (element7) element7.style.zoom = '1';
            if (element8) element8.style.zoom = '1';
            if (element9) element9.style.zoom = '1';
            if (element10) element10.style.zoom = '1';
            if (element11) element11.style.zoom = '1';
            if (element12) element12.style.zoom = '1';
            if (element13) element13.style.zoom = '1';
            if (element14) element14.style.zoom = '1';
            if (element15) element15.style.zoom = '1';
            if (element16) element16.style.zoom = '1';
            if (element17) element17.style.zoom = '1';
            if (element18) element18.style.zoom = '1';
            if (element19) element19.style.zoom = '1';
            if (element20) element20.style.zoom = '1';
            if (element21) element21.style.zoom = '1';
            if (element22) element22.style.zoom = '1';

        };

        const restoreZoom = () => {
            if (element1) element1.style.zoom = originalZoom.page1 || '1';
            if (element2) element2.style.zoom = originalZoom.page2 || '1';
            if (element3) element3.style.zoom = originalZoom.page3 || '1';
            if (element4) element4.style.zoom = originalZoom.page4 || '1';
            if (element5) element5.style.zoom = originalZoom.page5 || '1';
            if (element6) element6.style.zoom = originalZoom.page6 || '1';
            if (element7) element7.style.zoom = originalZoom.page7 || '1';
            if (element8) element8.style.zoom = originalZoom.page8 || '1';
            if (element9) element9.style.zoom = originalZoom.page9 || '1';
            if (element10) element10.style.zoom = originalZoom.page10 || '1';
            if (element11) element11.style.zoom = originalZoom.page11 || '1';
            if (element12) element12.style.zoom = originalZoom.page12 || '1';
            if (element13) element13.style.zoom = originalZoom.page13 || '1';
            if (element14) element14.style.zoom = originalZoom.page14 || '1';
            if (element15) element15.style.zoom = originalZoom.page15 || '1';
            if (element16) element16.style.zoom = originalZoom.page16 || '1';
            if (element17) element17.style.zoom = originalZoom.page17 || '1';
            if (element18) element18.style.zoom = originalZoom.page18 || '1';
            if (element19) element19.style.zoom = originalZoom.page19 || '1';
            if (element20) element20.style.zoom = originalZoom.page20 || '1';
            if (element21) element21.style.zoom = originalZoom.page21 || '1';
            if (element22) element22.style.zoom = originalZoom.page22 || '1';

        };
        resetZoom();
        if (element1) {
            const element1Clone = element1?.cloneNode(true) as HTMLElement;
            const element2Clone = element2?.cloneNode(true) as HTMLElement;
            const element3Clone = element3?.cloneNode(true) as HTMLElement;
            const element4Clone = element4?.cloneNode(true) as HTMLElement;
            const element5Clone = element5?.cloneNode(true) as HTMLElement;
            const element6Clone = element6?.cloneNode(true) as HTMLElement;
            const element7Clone = element7?.cloneNode(true) as HTMLElement;
            const element8Clone = element8?.cloneNode(true) as HTMLElement;
            const element9Clone = element9?.cloneNode(true) as HTMLElement;
            const element10Clone = element10?.cloneNode(true) as HTMLElement;
            const element11Clone = element11?.cloneNode(true) as HTMLElement;
            const element12Clone = element12?.cloneNode(true) as HTMLElement;
            const element13Clone = element13?.cloneNode(true) as HTMLElement;
            const element14Clone = element14?.cloneNode(true) as HTMLElement;
            const element15Clone = element15?.cloneNode(true) as HTMLElement;
            const element16Clone = element16?.cloneNode(true) as HTMLElement;
            const element17Clone = element17?.cloneNode(true) as HTMLElement;
            const element18Clone = element18?.cloneNode(true) as HTMLElement;
            const element19Clone = element19?.cloneNode(true) as HTMLElement;
            const element20Clone = element20?.cloneNode(true) as HTMLElement;
            const element21Clone = element21?.cloneNode(true) as HTMLElement;
            const element22Clone = element22?.cloneNode(true) as HTMLElement;

            const wrapper = document.createElement('div');
            wrapper.appendChild(element1Clone);
            wrapper.appendChild(element2Clone);
            {
                (commonInfo?.interpretation_flag || commonInfo?.interpretation_flag === null) && wrapper.appendChild(element3Clone);
            }

            wrapper.appendChild(element4Clone);
            {
                (commonInfo?.medicine_recommendatio_flag || commonInfo?.medicine_recommendatio_flag === null) && hasMedicChoice && wrapper.appendChild(element5Clone);
            }
            {
                (commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag === null) && selectedSupp?.length > 0 && wrapper.appendChild(element6Clone);
            }
            {
                (commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag === null) && selectedSupp?.length === 2 && wrapper.appendChild(element7Clone);
            }
            {
                (commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) &&
                    (selectedSupp?.length > 0 || selectedLyf?.length > 0) &&
                    wrapper.appendChild(element8Clone);
            }
            {
                (commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) &&
                    (selectedSupp?.length == 2 || selectedLyf?.length == 2) &&
                    wrapper.appendChild(element9Clone);
            }
            {
                (commonInfo?.nfb_flag || commonInfo?.nfb_flag === null) && (neuroEC || neuroEO) && wrapper.appendChild(element10Clone);
            }
            {
                (commonInfo?.pbm_flag || commonInfo?.pbm_flag === null) && showPBM && wrapper.appendChild(element11Clone);
            }
            wrapper.appendChild(element12Clone);
            if (commonInfo?.images_only_flag || commonInfo?.images_only_flag == null) {
                wrapper.appendChild(element13Clone);
                wrapper.appendChild(element14Clone);
                wrapper.appendChild(element15Clone);
                wrapper.appendChild(element16Clone);
                wrapper.appendChild(element17Clone);
                wrapper.appendChild(element18Clone);
                wrapper.appendChild(element19Clone);
                wrapper.appendChild(element20Clone);
                wrapper.appendChild(element21Clone);
                wrapper.appendChild(element22Clone);
            }

            try {
                const pdf = html2pdf().from(wrapper).set(opt);
                // if (isDownload) {
                let simulatedProgress = 0;
                const progressInterval = setInterval(() => {
                    if (simulatedProgress >= 100) {
                        clearInterval(progressInterval);
                        setLoading(false);
                    } else {
                        simulatedProgress += 10;
                        setProgress(simulatedProgress);
                    }
                }, 100);
                // Save the PDF
                await pdf.save();

            } catch (error: any) {
                console.log('');
            }
        } else {
            console.log("element with ID 'page1' not found");
            setLoading(false);
        }
        restoreZoom();
        document.querySelectorAll('.report-edit-icon').forEach((el: any) => (el.style.visibility = 'visible'));
    };

    const handleDownloadPDF1 = async () => {
        let selectedSupp = [];
        let selectedLyf = [];
        selectedSupp = commonInfo?.mdnutritional_supplementation_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        selectedLyf = commonInfo?.lifestyle_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        setProgress(0);
        const opt = {
            margin: [0, 0, 0, 0],
            filename: resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_Datahub_report.pdf` : `Datahub_report.pdf`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas: { scale: 1.6, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'Portrait' },
            enableLinks: true,
        };

        document.querySelectorAll('.report-edit-icon').forEach((el: any) => (el.style.visibility = 'hidden'));

        //template 2
        const element101: any = document.getElementById('page101');
        const element102: any = document.getElementById('page102');
        const element103: any = document.getElementById('page103');
        const element104: any = document.getElementById('page104');
        const element105: any = document.getElementById('page105');
        const element106: any = document.getElementById('page106');
        const element107: any = document.getElementById('page107');
        const element108: any = document.getElementById('page108');
        const element109: any = document.getElementById('page109');
        const element110: any = document.getElementById('page110');
        const element111: any = document.getElementById('page111');
        const element112: any = document.getElementById('page112');
        const element113: any = document.getElementById('page113');
        const element114: any = document.getElementById('page114');
        const element115: any = document.getElementById('page115');
        const element116: any = document.getElementById('page116');
        // const element117: any = document.getElementById('page117');
        // const element118: any = document.getElementById('page118');
        const element119: any = document.getElementById('page119');
        const element200: any = document.getElementById('page120');
        //images only
        const element13: any = document.getElementById('page13');
        const element14: any = document.getElementById('page14');
        const element15: any = document.getElementById('page15');
        const element16: any = document.getElementById('page16');
        const element17: any = document.getElementById('page17');
        const element18: any = document.getElementById('page18');
        const element19: any = document.getElementById('page19');
        const element20: any = document.getElementById('page20');
        const element21: any = document.getElementById('page21');
        const element22: any = document.getElementById('page22');


        const originalZoom = {
            page13: element13?.style.zoom,
            page14: element14?.style.zoom,
            page15: element15?.style.zoom,
            page16: element16?.style.zoom,
            page17: element17?.style.zoom,
            page18: element18?.style.zoom,
            page19: element19?.style.zoom,
            page20: element20?.style.zoom,
            page21: element21?.style.zoom,
            page22: element22?.style.zoom,
            //template 2
            page23: element101?.style.zoom,
            page24: element102?.style.zoom,
            page25: element103?.style.zoom,
            page26: element104?.style.zoom,
            page27: element105?.style.zoom,
            page28: element106?.style.zoom,
            page29: element107?.style.zoom,
            page30: element108?.style.zoom,
            page31: element109?.style.zoom,
            page32: element110?.style.zoom,
            page33: element111?.style.zoom,
            page34: element112?.style.zoom,
            page35: element113?.style.zoom,
            page36: element114?.style.zoom,
            page37: element115?.style.zoom,
            page38: element116?.style.zoom,
            // page39: element117?.style.zoom,
            // page40: element118?.style.zoom,
            page41: element119?.style.zoom,
            page42: element200?.style.zoom,
        };

        const resetZoom = () => {
            if (element13) element13.style.zoom = '1';
            if (element14) element14.style.zoom = '1';
            if (element15) element15.style.zoom = '1';
            if (element16) element16.style.zoom = '1';
            if (element17) element17.style.zoom = '1';
            if (element18) element18.style.zoom = '1';
            if (element19) element19.style.zoom = '1';
            if (element20) element20.style.zoom = '1';
            if (element21) element21.style.zoom = '1';
            if (element22) element22.style.zoom = '1';
            //template 2
            if (element101) element101.style.zoom = '1';
            if (element102) element102.style.zoom = '1';
            if (element103) element103.style.zoom = '1';
            if (element104) element104.style.zoom = '1';
            if (element105) element105.style.zoom = '1';
            if (element106) element106.style.zoom = '1';
            if (element107) element107.style.zoom = '1';
            if (element108) element108.style.zoom = '1';
            if (element109) element109.style.zoom = '1';
            if (element110) element110.style.zoom = '1';
            if (element111) element111.style.zoom = '1';
            if (element112) element112.style.zoom = '1';
            if (element113) element113.style.zoom = '1';
            if (element114) element114.style.zoom = '1';
            if (element115) element115.style.zoom = '1';
            if (element116) element116.style.zoom = '1';
            // if (element117) element117.style.zoom = '1';
            // if (element118) element118.style.zoom = '1';
            if (element119) element119.style.zoom = '1';
            if (element200) element200.style.zoom = '1';
        };

        const restoreZoom = () => {
            if (element13) element13.style.zoom = originalZoom.page13 || '1';
            if (element14) element14.style.zoom = originalZoom.page14 || '1';
            if (element15) element15.style.zoom = originalZoom.page15 || '1';
            if (element16) element16.style.zoom = originalZoom.page16 || '1';
            if (element17) element17.style.zoom = originalZoom.page17 || '1';
            if (element18) element18.style.zoom = originalZoom.page18 || '1';
            if (element19) element19.style.zoom = originalZoom.page19 || '1';
            if (element20) element20.style.zoom = originalZoom.page20 || '1';
            if (element21) element21.style.zoom = originalZoom.page21 || '1';
            if (element22) element22.style.zoom = originalZoom.page22 || '1';
            //template 2
            if (element101) element101.style.zoom = originalZoom.page23 || '1';
            if (element102) element102.style.zoom = originalZoom.page24 || '1';
            if (element103) element103.style.zoom = originalZoom.page25 || '1';
            if (element104) element104.style.zoom = originalZoom.page26 || '1';
            if (element105) element105.style.zoom = originalZoom.page27 || '1';
            if (element106) element106.style.zoom = originalZoom.page28 || '1';
            if (element107) element107.style.zoom = originalZoom.page29 || '1';
            if (element108) element108.style.zoom = originalZoom.page30 || '1';
            if (element109) element109.style.zoom = originalZoom.page31 || '1';
            if (element110) element110.style.zoom = originalZoom.page32 || '1';
            if (element111) element111.style.zoom = originalZoom.page33 || '1';
            if (element112) element112.style.zoom = originalZoom.page34 || '1';
            if (element113) element113.style.zoom = originalZoom.page35 || '1';
            if (element114) element114.style.zoom = originalZoom.page36 || '1';
            if (element115) element115.style.zoom = originalZoom.page37 || '1';
            if (element116) element116.style.zoom = originalZoom.page38 || '1';
            // if (element117) element117.style.zoom = originalZoom.page39 || '1';
            // if (element118) element118.style.zoom = originalZoom.page40 || '1';
            if (element119) element119.style.zoom = originalZoom.page41 || '1';
            if (element200) element200.style.zoom = originalZoom.page42 || '1';
        };
        resetZoom();
        if (element101) {
            const element13Clone = element13?.cloneNode(true) as HTMLElement;
            const element14Clone = element14?.cloneNode(true) as HTMLElement;
            const element15Clone = element15?.cloneNode(true) as HTMLElement;
            const element16Clone = element16?.cloneNode(true) as HTMLElement;
            const element17Clone = element17?.cloneNode(true) as HTMLElement;
            const element18Clone = element18?.cloneNode(true) as HTMLElement;
            const element19Clone = element19?.cloneNode(true) as HTMLElement;
            const element20Clone = element20?.cloneNode(true) as HTMLElement;
            const element21Clone = element21?.cloneNode(true) as HTMLElement;
            const element22Clone = element22?.cloneNode(true) as HTMLElement;
            //template 2
            const element101Clone = element101?.cloneNode(true) as HTMLElement;
            const element102Clone = element102?.cloneNode(true) as HTMLElement;
            const element103Clone = element103?.cloneNode(true) as HTMLElement;
            const element104Clone = element104?.cloneNode(true) as HTMLElement;
            const element105Clone = element105?.cloneNode(true) as HTMLElement;
            const element106Clone = element106?.cloneNode(true) as HTMLElement;
            const element107Clone = element107?.cloneNode(true) as HTMLElement;
            const element108Clone = element108?.cloneNode(true) as HTMLElement;
            const element109Clone = element109?.cloneNode(true) as HTMLElement;
            const element110Clone = element110?.cloneNode(true) as HTMLElement;
            const element111Clone = element111?.cloneNode(true) as HTMLElement;
            const element112Clone = element112?.cloneNode(true) as HTMLElement;
            const element113Clone = element113?.cloneNode(true) as HTMLElement;
            const element114Clone = element114?.cloneNode(true) as HTMLElement;
            const element115Clone = element115?.cloneNode(true) as HTMLElement;
            const element116Clone = element116?.cloneNode(true) as HTMLElement;
            // const element117Clone = element117?.cloneNode(true) as HTMLElement;
            // const element118Clone = element118?.cloneNode(true) as HTMLElement;
            const element119Clone = element119?.cloneNode(true) as HTMLElement;
            const element200Clone = element200?.cloneNode(true) as HTMLElement;

            const wrapper1 = document.createElement('div1');
            wrapper1.appendChild(element101Clone);
            wrapper1.appendChild(element102Clone);
            {
                if (commonInfo?.interpretation_flag || commonInfo?.interpretation_flag === null) {
                    wrapper1.appendChild(element103Clone);
                    wrapper1.appendChild(element104Clone);
                    wrapper1.appendChild(element105Clone);
                    wrapper1.appendChild(element106Clone);
                    wrapper1.appendChild(element107Clone);
                    wrapper1.appendChild(element108Clone);
                    if (isMuRhythm) {
                        wrapper1.appendChild(element200Clone);
                    }
                }
                if (commonInfo?.supplement_recommendation_flag || commonInfo?.supplement_recommendation_flag == null) {
                    selectedSupp?.length > 0 && wrapper1.appendChild(element109Clone);
                    selectedSupp?.length === 2 && wrapper1.appendChild(element110Clone);
                }
                if (commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) {
                    (selectedSupp?.length > 0 || selectedLyf?.length > 0) && wrapper1.appendChild(element111Clone);
                    (selectedSupp?.length == 2 || selectedLyf?.length == 2) && wrapper1.appendChild(element112Clone);
                }
                if (commonInfo?.medicine_recommendatio_flag || commonInfo?.medicine_recommendatio_flag == null) {
                    hasMedicChoice && wrapper1.appendChild(element113Clone);
                }
                if (commonInfo?.nfb_flag || commonInfo?.nfb_flag == null) {
                    (neuroEC || neuroEO) && wrapper1.appendChild(element114Clone);
                }
                if (commonInfo?.pbm_flag || commonInfo?.pbm_flag == null) {
                    showPBM && wrapper1.appendChild(element115Clone);
                }
                if (commonInfo?.interpretation_flag || commonInfo?.interpretation_flag == null) {
                    wrapper1.appendChild(element116Clone);
                    // wrapper1.appendChild(element117Clone);
                    // wrapper1.appendChild(element118Clone);
                }
                wrapper1.appendChild(element119Clone);
                if (commonInfo?.images_only_flag || commonInfo?.images_only_flag == null) {
                    wrapper1.appendChild(element13Clone);
                    wrapper1.appendChild(element14Clone);
                    wrapper1.appendChild(element15Clone);
                    wrapper1.appendChild(element16Clone);
                    wrapper1.appendChild(element17Clone);
                    wrapper1.appendChild(element18Clone);
                    wrapper1.appendChild(element19Clone);
                    wrapper1.appendChild(element20Clone);
                    wrapper1.appendChild(element21Clone);
                    wrapper1.appendChild(element22Clone);
                }
            }
            try {
                // if (isDownload) {

                setLoading(true);
                let simulatedProgress = 0;
                const progressInterval = setInterval(() => {
                    if (simulatedProgress >= 100) {
                        clearInterval(progressInterval);
                        setLoading(false);
                    } else {
                        simulatedProgress += 10;
                        setProgress(simulatedProgress);
                    }
                }, 100);

                html2pdf()
                    .from(wrapper1)
                    .set(opt)
                    .toPdf()
                    .get('pdf')
                    .then(function (pdf) {
                        const totalPages = pdf.internal.getNumberOfPages();
                        for (let i = 1; i <= totalPages; i++) {
                            pdf.setPage(i);
                            pdf.setFontSize(10);
                            pdf.setTextColor(100);
                            // Positioning page numbers at the bottom-center of each page
                            pdf.text('Page ' + i + ' of ' + totalPages, pdf.internal.pageSize.getWidth() - 24, pdf.internal.pageSize.getHeight() - 5);
                        }
                    })
                    .save()
                    .then(() => {
                        // Ensure the progress is set to 100% once the save is completed
                        clearInterval(progressInterval);
                        setProgress(100);
                        setLoading(false);
                    });

            } catch (error: any) {
                console.log('');
            }
        } else {
            console.log("element with ID 'page1' not found");
            setLoading(false);
        }
        restoreZoom();
        document.querySelectorAll('.report-edit-icon').forEach((el: any) => (el.style.visibility = 'visible'));
    };
    useEffect(() => {
        if (userRole == 'staff' && datasetInfo?.data?.RequestResultpath == '' || datasetInfo?.data?.RequestResultpath == null) {
            getCommonService();
        } else if (userRole == 'admin' && datasetInfo?.data?.RequestResultpath == '' || datasetInfo?.data?.RequestResultpath == null) {
            getCommonService();
        }
    }, []);

    const LoadingIndicator = () => {
        return <Progress type="circle" percent={progress} strokeColor={twoColors} />;
    };

    const MyLoadingRenderer = () => {
        const fileText = datahubFile || "";

        if (fileText) {
            return <div>Loading Renderer ({fileText})...</div>;
        }

        return <div>Loading Renderer...</div>;
    };

    const tabItems = [
        { key: '1', label: 'Manual Result', children: <ManualResult /> },
        {
            key: '2',
            label: 'Dataset Information',
            children: <InterpretationDetails />,
        },
        {
            key: '3',
            label: 'Datahub Result',
            children: (
                <div className="template-height released-req datahub m-1 shadow-sm pb-2 border-bottom ">
                    <Spin spinning={loading || loading16} tip={loading16 ? '' : <LoadingIndicator />}>
                        {datasetInfo?.data?.RequestResultpath ? (
                            docLoad ? <DocViewer key="dsfs" documents={docs} pluginRenderers={DocViewerRenderers}
                            // config={{
                            //     header: {
                            //       overrideComponent: MyLoadingRenderer,
                            //     },
                            //   }} 
                            /> : <div>
                                <div className="text-center mt-4">
                                    <Progress type="circle" percent={downloading} strokeColor={twoColors} />
                                </div>
                            </div>
                        ) : (
                            <>
                                {
                                    resultInfo?.req_info?.edferror_flag || resultInfo?.req_info?.edfprocessing_flag || (!resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag)
                                        ? (
                                            <Spin
                                                indicator={
                                                    !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag && !resultInfo?.req_info?.edfcomplete_flag ?
                                                        <ExclamationCircleOutlined className="text-warm" />
                                                        :
                                                        resultInfo?.req_info?.edfprocessing_flag
                                                            ? (
                                                                <SyncOutlined spin className="text-warn" size={40} />
                                                            ) : (
                                                                <ExclamationCircleOutlined className="text-danger" />
                                                            )
                                                }
                                                tip={
                                                    !resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag ?
                                                        (
                                                            <span className="fs-20">Job is not started yet, you can download result file only if the job is completed or result file is uploaded manually</span>
                                                        ) : resultInfo?.req_info?.edfprocessing_flag ? (
                                                            <span className="text-warn  fs-20">Job processing is in queue</span>
                                                        ) : (
                                                            <span className="text-danger fs-20">Job has been stopped for this request</span>
                                                        )
                                                }
                                            >
                                                <div className='admin-release-request'>
                                                    {selectedOption === '3' ?
                                                        <BaseTemplate
                                                            showEdit={showEdit}
                                                            recEdit={recEdit}
                                                            handlePntChange={handlePntChange}
                                                            handleRecChange={handleRecChange}
                                                            intEdit={intEdit}
                                                            handleInterpretChange={handleInterpretChange}
                                                            glanceEdit={glanceEdit}
                                                            handleGlanceChange={handleGlanceChange}
                                                            pdrEdit={pdrEdit}
                                                            handlePdrChange={handlePdrChange}
                                                            medicEdit={medicEdit}
                                                            handleMedicChange={handleMedicChange}
                                                            suppEdit={suppEdit}
                                                            suppEdit1={suppEdit1}
                                                            lyfEdit={lyfEdit}
                                                            lyfEdit1={lyfEdit1}
                                                            released={false}
                                                            handleSuppChange={handleSuppChange}
                                                            handleSuppChange1={handleSuppChange1}
                                                            handleLyfChange={handleLyfChange}
                                                            handleLyfChange1={handleLyfChange1}
                                                            pbmEdit={pbmEdit}
                                                            nfbEdit={nfbEdit}
                                                            handleNfbChange={handleNfbChange}
                                                            handlePbmChange={handlePbmChange}
                                                        /> : <ReportBaseTemplate
                                                            showEdit={showEdit}
                                                            recEdit={recEdit}
                                                            handlePntChange={handlePntChange}
                                                            handleRecChange={handleRecChange}
                                                            intEdit={intEdit}
                                                            handleInterpretChange={handleInterpretChange}
                                                            glanceEdit={glanceEdit}
                                                            handleGlanceChange={handleGlanceChange}
                                                            pdrEdit={pdrEdit}
                                                            handlePdrChange={handlePdrChange}
                                                            medicEdit={medicEdit}
                                                            handleMedicChange={handleMedicChange}
                                                            suppEdit={suppEdit}
                                                            suppEdit1={suppEdit1}
                                                            lyfEdit={lyfEdit}
                                                            lyfEdit1={lyfEdit1}
                                                            released={false}
                                                            handleSuppChange={handleSuppChange}
                                                            handleSuppChange1={handleSuppChange1}
                                                            handleLyfChange={handleLyfChange}
                                                            handleLyfChange1={handleLyfChange1}
                                                            pbmEdit={pbmEdit}
                                                            nfbEdit={nfbEdit}
                                                            handleNfbChange={handleNfbChange}
                                                            handlePbmChange={handlePbmChange}
                                                        />}
                                                </div>
                                            </Spin>
                                        ) : (
                                            <Spin spinning={loading}
                                            //  tip={<LoadingIndicator />}
                                            >
                                                <div className='admin-release-request'>
                                                    {selectedOption === '3' ?
                                                        <BaseTemplate
                                                            showEdit={showEdit}
                                                            recEdit={recEdit}
                                                            handlePntChange={handlePntChange}
                                                            handleRecChange={handleRecChange}
                                                            intEdit={intEdit}
                                                            handleInterpretChange={handleInterpretChange}
                                                            glanceEdit={glanceEdit}
                                                            handleGlanceChange={handleGlanceChange}
                                                            pdrEdit={pdrEdit}
                                                            handlePdrChange={handlePdrChange}
                                                            medicEdit={medicEdit}
                                                            handleMedicChange={handleMedicChange}
                                                            suppEdit={suppEdit}
                                                            suppEdit1={suppEdit1}
                                                            lyfEdit={lyfEdit}
                                                            lyfEdit1={lyfEdit1}
                                                            released={false}
                                                            handleSuppChange={handleSuppChange}
                                                            handleSuppChange1={handleSuppChange1}
                                                            handleLyfChange={handleLyfChange}
                                                            handleLyfChange1={handleLyfChange1}
                                                            pbmEdit={pbmEdit}
                                                            nfbEdit={nfbEdit}
                                                            handleNfbChange={handleNfbChange}
                                                            handlePbmChange={handlePbmChange}
                                                        /> : <ReportBaseTemplate
                                                            showEdit={showEdit}
                                                            recEdit={recEdit}
                                                            handlePntChange={handlePntChange}
                                                            handleRecChange={handleRecChange}
                                                            intEdit={intEdit}
                                                            handleInterpretChange={handleInterpretChange}
                                                            glanceEdit={glanceEdit}
                                                            handleGlanceChange={handleGlanceChange}
                                                            pdrEdit={pdrEdit}
                                                            handlePdrChange={handlePdrChange}
                                                            medicEdit={medicEdit}
                                                            handleMedicChange={handleMedicChange}
                                                            suppEdit={suppEdit}
                                                            suppEdit1={suppEdit1}
                                                            lyfEdit={lyfEdit}
                                                            lyfEdit1={lyfEdit1}
                                                            released={false}
                                                            handleSuppChange={handleSuppChange}
                                                            handleSuppChange1={handleSuppChange1}
                                                            handleLyfChange={handleLyfChange}
                                                            handleLyfChange1={handleLyfChange1}
                                                            pbmEdit={pbmEdit}
                                                            nfbEdit={nfbEdit}
                                                            handleNfbChange={handleNfbChange}
                                                            handlePbmChange={handlePbmChange}
                                                        />}
                                                </div>
                                            </Spin>
                                        )}
                            </>
                        )}
                    </Spin>
                </div>
            ),
        },
    ];

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    };

    const filteredTabItems = tabItems.filter((item) => item.key !== '1' || resultInfo?.req_info?.servicerequest_info?.result_docid !== 0);

    const handleOpenEDFfile = (type: string) => {
        const cleanUrl = `/edf?${new URLSearchParams({
            url: url2,
            selectedEdf: type || 'EC',
            Eo: resultInfo?.req_info?.associate_edf_doc?.EO_edf_file_path,
            Ec: resultInfo?.req_info?.associate_edf_doc?.EC_edf_file_path,
            reqId: resultInfo?.req_info?.encoded_RequestNumber,
            pntInfo: resultInfo?.req_info?.patient_info?.pntname,
            accInfo: resultInfo?.req_info?.account_info?.account_name,
            EoArtifact: resultInfo?.req_info?.artifact_removed_edf_doc?.EO_edf_file_path,
            EcArtifact: resultInfo?.req_info?.artifact_removed_edf_doc?.EC_edf_file_path,
            EoDownload: resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path[0],
            EcDownload: resultInfo?.req_info?.plot_pdf_doc?.EC_plot_doc_path[0],
        })}`;
        window.open(cleanUrl, '_blank');
    };
    const downloadFile = (base64String: string, fileName: string) => {
        const link = document.createElement('a');
        link.href = `data:application/pdf;base64,${base64String}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const downloadEdfFile = (path: any, type: string) => {
        const fileUrl = path?.startsWith('https:') ? path : '';
        setDownloadPercent(0);
        setIsDownload(true);
        if (fileUrl && fileUrl != '') {
            fetch(fileUrl)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const contentLength = response.headers.get('Content-Length');
                    const total = contentLength ? parseInt(contentLength, 10) : 0;
                    const reader = response.body?.getReader();
                    const stream = new ReadableStream({
                        start(controller) {
                            let loaded = 0;
                            reader?.read().then(function processText({ done, value }) {
                                if (done) {
                                    controller.close();
                                    return;
                                }
                                loaded += value.length;
                                setDownloadPercent(Math.round((loaded / total) * 100));
                                controller.enqueue(value);
                                reader.read().then(processText);
                            });
                        },
                    });

                    return new Response(stream);
                })
                .then((response) => response.blob())
                .then((blob) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(blob);
                    reader.onloadend = () => {
                        const base64String = (reader.result as string).split(',')[1];
                        const fileName = `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_${type}_edf_graph.pdf`;
                        downloadFile(base64String, fileName);
                        message.success('Download complete!');
                    };
                })
                .catch((error) => {
                    console.error('Error fetching PDF file:', error);
                    message.error('Error fetching PDF file.');
                })
                .finally(() => {
                    setDownloadPercent(0);
                    setIsDownload(false);
                });
        }

    };
    function getDatasetDetails() {
        dispatch(getDataset(location?.state?.id) as any);
    }

    useEffect(() => {
        // if (userRole !== 'staff') {
        getDatasetDetails();
        // }

    }, []);

    useEffect(() => {
        if (userRole !== 'staff') {
            getRequestDetails();
        }

    }, []);

    const goBack = () => {
        navigate('/released-request');
    };

    useEffect(() => {
        getPhqDetails();
    }, []);
console.log("resultInfo?.req_info",resultInfo?.req_info);
    function getTemplateTopography() {
        const inputJson = {
            servicerequestid: location.state?.id,
        };
        dispatch(getTopoResultInfo(inputJson) as any);
    }

    useEffect(() => {
        getTemplateTopography();
    }, []);


    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <div className="d-flex justify-content-between w-75 select">
                    <h5 className="my-auto ">{userRole === 'staff' ? "Datahub Result" : "Dataset Information"} </h5>
                    <div className='col-md-2 me-2 cus-select'>
                        {!resultInfo?.req_info?.servicerequest_info?.result_docid && resultInfo?.req_info?.servicerequest_info?.result_docid === '' ? (
                            userRole === 'staff' &&
                            <Select
                                value={selectedOption.toString()}
                                options={fileOptions1}
                                optionFilterProp="children"
                                className="w-25 text-start ms-auto  mt-2"
                                onChange={(e: any) => setSelectedOption(e)}
                            />
                        ) : (
                            ""
                        )}
                    </div>
                </div>
                <div className="ms-auto d-flex">
                    {userRole === 'staff' ? <>{resultInfo?.req_info?.edfcomplete_flag && datasetInfo?.data?.RequestResultpath == '' && resultData?.data?.encodefiledata == '' ?
                        <Button type="default" className="me-2 yellow-btn" onClick={downloadPDF} loading={loading}>
                            Download
                        </Button>
                        : ""}</> :
                        <Button className="yellow-btn border text-white shadow-sm me-2 fw-bold" onClick={() => showReassModal()}>
                            Reassessment
                        </Button>}
                    <Button type="primary" onClick={() => goBack()}>
                        Back
                    </Button>
                </div>
            </div>
            <Spin spinning={loading4}>
                <div className="row mx-0 mt-2 ">
                    <div className="col-md-9 p-0">
                        <div className="custom-tabs h-100">
                            {userRole === 'staff' ? <div className="template-height released-req m-1 shadow-sm pb-2 border ">
                                <Spin spinning={loading || loading16 || loading4} tip={loading16 ? '' : <LoadingIndicator />}>
                                    {resultLoading || loading16 ? (
                                        // Case 1: While `resultLoading` or `loading16` is true, show the loading state
                                        <div className="bg-white p-5 text-center">
                                            <Progress
                                                type="dashboard"
                                                steps={8}
                                                percent={resultDownProgress}
                                                trailColor="rgba(0, 0, 0, 0.06)"
                                                strokeWidth={5}
                                            />
                                        </div>
                                    ) : datasetInfo?.data?.result_docid !== 0 && resultData?.data?.encodefiledata ? (
                                        // Case 2: After loading, if `resultData` has valid `encodefiledata`, show DocViewer
                                        <div>
                                            <DocViewer
                                                key="docs-result"
                                                documents={accountDocs}
                                                pluginRenderers={DocViewerRenderers}
                                            />
                                        </div>
                                    ) : datasetInfo?.data?.RequestResultpath ? (
                                        <div>{docLoad ?
                                            <DocViewer
                                                key="docs-result"
                                                documents={docs}
                                                pluginRenderers={DocViewerRenderers}
                                            /> : <div>
                                                <div className="text-center mt-4">
                                                    <Progress type="circle" percent={downloading} strokeColor={twoColors} />
                                                </div>
                                            </div>}
                                        </div>
                                    ) : (
                                        <>
                                            {

                                                datasetInfo?.data?.result_docid == 0 && datasetInfo?.data?.result_docid == null && resultInfo?.req_info?.edferror_flag || resultInfo?.req_info?.edfprocessing_flag || (!resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag)
                                                    ? (
                                                        <Spin
                                                            indicator={
                                                                !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag && !resultInfo?.req_info?.edfcomplete_flag ?
                                                                    <ExclamationCircleOutlined className="text-warm" />
                                                                    :
                                                                    resultInfo?.req_info?.edfprocessing_flag
                                                                        ? (
                                                                            <SyncOutlined spin className="text-warn" size={40} />
                                                                        ) : resultInfo?.req_info?.edferror_flag ? (
                                                                            <ExclamationCircleOutlined className="text-danger" />
                                                                        ) : <></>
                                                            }
                                                            tip={
                                                                !resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag ?
                                                                    (
                                                                        <span className="fs-20">Job is not started yet, you can download result file only if the job is completed or result file is uploaded manually</span>
                                                                    ) : resultInfo?.req_info?.edfprocessing_flag ? (
                                                                        <span className="text-warn  fs-20">Job processing is in queue</span>
                                                                    ) : resultInfo?.req_info?.edferror_flag ? (
                                                                        <span className="text-danger fs-20">Job has been stopped for this request</span>
                                                                    ) : ""
                                                            }
                                                        >
                                                            <div className='admin-release-request'>
                                                                {selectedOption === '3' ?
                                                                    <BaseTemplate
                                                                        showEdit={showEdit}
                                                                        recEdit={recEdit}
                                                                        handlePntChange={handlePntChange}
                                                                        handleRecChange={handleRecChange}
                                                                        intEdit={intEdit}
                                                                        handleInterpretChange={handleInterpretChange}
                                                                        glanceEdit={glanceEdit}
                                                                        handleGlanceChange={handleGlanceChange}
                                                                        pdrEdit={pdrEdit}
                                                                        handlePdrChange={handlePdrChange}
                                                                        medicEdit={medicEdit}
                                                                        handleMedicChange={handleMedicChange}
                                                                        suppEdit={suppEdit}
                                                                        suppEdit1={suppEdit1}
                                                                        lyfEdit={lyfEdit}
                                                                        lyfEdit1={lyfEdit1}
                                                                        released={false}
                                                                        handleSuppChange={handleSuppChange}
                                                                        handleSuppChange1={handleSuppChange1}
                                                                        handleLyfChange={handleLyfChange}
                                                                        handleLyfChange1={handleLyfChange1}
                                                                        pbmEdit={pbmEdit}
                                                                        nfbEdit={nfbEdit}
                                                                        handleNfbChange={handleNfbChange}
                                                                        handlePbmChange={handlePbmChange}
                                                                    /> : <ReportBaseTemplate
                                                                        showEdit={showEdit}
                                                                        recEdit={recEdit}
                                                                        handlePntChange={handlePntChange}
                                                                        handleRecChange={handleRecChange}
                                                                        intEdit={intEdit}
                                                                        handleInterpretChange={handleInterpretChange}
                                                                        glanceEdit={glanceEdit}
                                                                        handleGlanceChange={handleGlanceChange}
                                                                        pdrEdit={pdrEdit}
                                                                        handlePdrChange={handlePdrChange}
                                                                        medicEdit={medicEdit}
                                                                        handleMedicChange={handleMedicChange}
                                                                        suppEdit={suppEdit}
                                                                        suppEdit1={suppEdit1}
                                                                        lyfEdit={lyfEdit}
                                                                        lyfEdit1={lyfEdit1}
                                                                        released={false}
                                                                        handleSuppChange={handleSuppChange}
                                                                        handleSuppChange1={handleSuppChange1}
                                                                        handleLyfChange={handleLyfChange}
                                                                        handleLyfChange1={handleLyfChange1}
                                                                        pbmEdit={pbmEdit}
                                                                        nfbEdit={nfbEdit}
                                                                        handleNfbChange={handleNfbChange}
                                                                        handlePbmChange={handlePbmChange}
                                                                    />}
                                                            </div>
                                                        </Spin>
                                                    ) :
                                                    (
                                                        <Spin spinning={loading}
                                                            tip={<LoadingIndicator />}
                                                        >
                                                            <div className='admin-release-request'>
                                                                {selectedOption === '3' ?
                                                                    <BaseTemplate
                                                                        showEdit={showEdit}
                                                                        recEdit={recEdit}
                                                                        handlePntChange={handlePntChange}
                                                                        handleRecChange={handleRecChange}
                                                                        intEdit={intEdit}
                                                                        handleInterpretChange={handleInterpretChange}
                                                                        glanceEdit={glanceEdit}
                                                                        handleGlanceChange={handleGlanceChange}
                                                                        pdrEdit={pdrEdit}
                                                                        handlePdrChange={handlePdrChange}
                                                                        medicEdit={medicEdit}
                                                                        handleMedicChange={handleMedicChange}
                                                                        suppEdit={suppEdit}
                                                                        suppEdit1={suppEdit1}
                                                                        lyfEdit={lyfEdit}
                                                                        lyfEdit1={lyfEdit1}
                                                                        released={false}
                                                                        handleSuppChange={handleSuppChange}
                                                                        handleSuppChange1={handleSuppChange1}
                                                                        handleLyfChange={handleLyfChange}
                                                                        handleLyfChange1={handleLyfChange1}
                                                                        pbmEdit={pbmEdit}
                                                                        nfbEdit={nfbEdit}
                                                                        handleNfbChange={handleNfbChange}
                                                                        handlePbmChange={handlePbmChange}
                                                                    /> : <ReportBaseTemplate
                                                                        showEdit={showEdit}
                                                                        recEdit={recEdit}
                                                                        handlePntChange={handlePntChange}
                                                                        handleRecChange={handleRecChange}
                                                                        intEdit={intEdit}
                                                                        handleInterpretChange={handleInterpretChange}
                                                                        glanceEdit={glanceEdit}
                                                                        handleGlanceChange={handleGlanceChange}
                                                                        pdrEdit={pdrEdit}
                                                                        handlePdrChange={handlePdrChange}
                                                                        medicEdit={medicEdit}
                                                                        handleMedicChange={handleMedicChange}
                                                                        suppEdit={suppEdit}
                                                                        suppEdit1={suppEdit1}
                                                                        lyfEdit={lyfEdit}
                                                                        lyfEdit1={lyfEdit1}
                                                                        released={false}
                                                                        handleSuppChange={handleSuppChange}
                                                                        handleSuppChange1={handleSuppChange1}
                                                                        handleLyfChange={handleLyfChange}
                                                                        handleLyfChange1={handleLyfChange1}
                                                                        pbmEdit={pbmEdit}
                                                                        nfbEdit={nfbEdit}
                                                                        handleNfbChange={handleNfbChange}
                                                                        handlePbmChange={handlePbmChange}
                                                                    />}
                                                            </div>

                                                        </Spin>
                                                    )

                                            }
                                        </>
                                    )}
                                </Spin>
                            </div>
                                :
                                <div className="d-flex flex-row justify-content-between position-relative">
                                    <Tabs className="w-100" items={filteredTabItems} defaultActiveKey={selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
                                    {selectedTab === '3' && !datasetInfo?.data?.RequestResultpath && datasetInfo?.data?.RequestResultpath === '' ? (

                                        <div className='col-auto ms-auto w-auto text-start ms-auto position-absolute end-0 mt-2'>

                                            <Select
                                                value={selectedOption.toString()}
                                                options={fileOptions1}
                                                optionFilterProp="children"
                                                className="ms-auto"
                                                onChange={(e: any) => setSelectedOption(e)}
                                            />
                                            <Tooltip title={!resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag ? "Job is not started yet, you can download result file only if the job is completed or result file is uploaded manually"
                                                : resultInfo?.req_info?.edfprocessing_flag ? "Job processing is in queue" : resultInfo?.req_info?.edferror_flag ? "Job has been stopped for this request" : ""} className="mt-0">
                                                <Button type="primary" className="mt-2 ms-2" onClick={downloadPDF} loading={loading} disabled={!resultInfo?.req_info?.edfcomplete_flag || resultInfo?.req_info?.edferror_flag || resultInfo?.req_info?.edfprocessing_flag}>
                                                    {((!loading && loading5)) ?
                                                        <span className="loading-dots">Loading<span className="dot-animation"></span></span> :
                                                        'Download'
                                                    }
                                                </Button>
                                            </Tooltip>
                                        </div>
                                    ) : (
                                        ""
                                    )}
                                </div>
                            }
                        </div>

                    </div>
                    <div className="col-md-3 py-0 ps-3 pe-0 mt-2 ">
                        <div className="bg-white shadow-sm">
                            <div className="text-center pt-3">
                                <Avatar size={120} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                                {userRole == 'researcher' ?
                                    <div className="col fs-15">
                                        <div className="text-primary fw-bold fs-16">{resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber : '-'}</div>

                                    </div>
                                    : <h6 className="text-capitalize fs-20 mt-2 mb-1">
                                        {resultInfo?.req_info ? resultInfo?.req_info?.patient_info?.first_name + ' ' + resultInfo?.req_info?.patient_info?.last_name || '' : '-'}
                                    </h6>}
                                <p className="text-secondary fs-15 fw-bold">{resultInfo?.req_info?.patient_info?.sex_at_birth}</p>
                            </div>
                            {userRole !== 'researcher' ?
                                <div className="d-flex border-top border-bottom py-2 px-3 bg-aliceblue">
                                    <div className="col fs-15">
                                        <div className="text-primary fw-bold fs-16">REQUEST ID</div>
                                        {resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber : '-'}
                                    </div>

                                    <div className="col fs-15">
                                        <div className="text-primary fw-bold fs-16">ACCOUNT NAME</div>
                                        {resultInfo?.req_info?.servicerequest_info?.account_name ? resultInfo?.req_info?.servicerequest_info?.account_name : '-'}
                                    </div>
                                </div> : <div className="d-flex border-top bg-aliceblue"></div>}
                            <div className='released-req template-height sub-section px-3 pb-3'>
                                <h6 className="pb-2 mt-3 d-flex w-100">Associated Tags</h6>
                                <Spin spinning={loading4}>
                                    <div className="d-flex flex-wrap ">
                                        {resultInfo?.req_info?.patient_tag && resultInfo?.req_info?.patient_tag?.length > 0 ? (
                                            <>
                                                {resultInfo?.req_info?.patient_tag?.map((item: any, index: number) => (
                                                    <div className="me-1 mb-1 tag-height" key={index}>
                                                        <div className="bg-lightorange px-3 py-1 tags d-flex flex-wrap">
                                                            <div className="col me-3"> {item}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="p-3 text-gray text-center bg-light w-100">{loading4 ? 'Loading...' : 'No tags associated with this request'}</div>
                                        )}
                                    </div>
                                </Spin>
                                {userRole === 'staff' ? "" : <>
                                    <h6 className="pb-1 mt-3 d-flex w-100 border-top pt-3">EDF Preview</h6>
                                    {resultInfo?.req_info?.associate_edf_doc?.EC_edf_file_path.length !== 0 && resultInfo?.req_info?.associate_edf_doc?.EO_edf_file_path.length !== 0 ? (
                                        <div className="mb-3">
                                            <div>
                                                To view Eyes Closed EDF file,
                                                <a className="text-blue text-decoration-underline ps-1" onClick={() => handleOpenEDFfile('EC')}>
                                                    Click here
                                                </a>
                                            </div>
                                            <div>
                                                To view Eyes Opened EDF file,
                                                <a className="text-blue text-decoration-underline ps-1" onClick={() => handleOpenEDFfile('EO')}>
                                                    Click here
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-3 text-gray text-center bg-light w-100">{loading4 ?
                                            <span className="loading-dots">Loading<span className="dot-animation"></span></span>
                                            : 'No EDF file available for previewing'}</div>
                                    )}
                                    <h6 className="pb-1 mt-3 d-flex w-100 border-top pt-3">Download EDF Graph</h6>
                                    {resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path?.[0] ? (
                                        <>
                                            <div>
                                                To download Eyes Closed EDF file,
                                                <a
                                                    className="text-blue text-decoration-underline ps-1"
                                                    onClick={() => downloadEdfFile(resultInfo?.req_info?.plot_pdf_doc?.EC_plot_doc_path[0], 'Eyeclose')}
                                                >
                                                    Click here
                                                </a>
                                            </div>
                                            <div>
                                                To download Eyes Opened EDF file,
                                                <a
                                                    className="text-blue text-decoration-underline ps-1"
                                                    onClick={() => downloadEdfFile(resultInfo?.req_info?.plot_pdf_doc?.EO_plot_doc_path[0], 'Eyeopen')}
                                                >
                                                    Click here
                                                </a>
                                            </div>
                                            {!isDownload ? (
                                                ''
                                            ) : (
                                                <div className="mt-3">
                                                    Downloading...
                                                    <Progress
                                                        size={['100%', 20]}
                                                        percent={downloadPercent}
                                                        percentPosition={{ align: 'center', type: 'inner' }}
                                                        strokeColor={{ from: '#108ee9', to: '#87d068' }}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="p-3 text-gray text-center bg-light w-100">{loading4 ? 'Loading...' : 'No EDF graph available for download'}</div>
                                    )}</>}
                                <h6 className="pb-1 mt-3 d-flex w-100 border-top pt-3">Session Questionnaire</h6>
                                {
                                    addReqInfo1?.phqsession_flag ? (
                                        <Spin spinning={loading5}>
                                            <>
                                                <div className="fs-15 fw-bold text-secondary">1. Clinician and amplifier used</div>
                                                <div className="fs-15 ms-3 mb-2">{(addReqInfo1?.sessionquestionaire_data?.clinician_and_amplifier_used || 'N/A') + ', ' + (addReqInfo1?.sessionquestionaire_data?.amplifierUsed || 'N/A')}</div>
                                                <div className="fs-15 fw-bold text-secondary">2. Past/Present clinical diagnosis (if applicable)</div>
                                                <div className="fs-15 ms-3 mb-2">
                                                    {commonInfo?.diagnosis?.length > 0 ? (
                                                        <>
                                                            {commonInfo.diagnosis.some((item: any) => item.ischoices && item.diagnosis_name) ? (
                                                                commonInfo.diagnosis?.filter((item: any) => item.ischoices && item.diagnosis_name)?.map((item: any, index: number, array: any[]) => {
                                                                    return (
                                                                        <span key={item.id} className="py-2 px-1">
                                                                            {item.diagnosis_name}
                                                                            {index < array.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    );
                                                                })
                                                            ) : (
                                                                <span className="py-2 px-1">-</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </div>
                                                <div className="fs-15 fw-bold text-secondary">3. Patient symptoms/concerns</div>
                                                <div className="fs-15 ms-3 mb-2">
                                                    {commonInfo?.symptoms?.length > 0 ? (
                                                        <>
                                                            {commonInfo.symptoms.some((item: any) => item.ischoices && item.symptoms_name) ? (
                                                                commonInfo.symptoms.filter((item: any) => item.ischoices && item.symptoms_name).map((item: any, index: number, array: any[]) => {
                                                                    return (
                                                                        <span key={item.id} className="py-2 px-1">
                                                                            {item.symptoms_name}
                                                                            {index < array.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    );
                                                                })
                                                            ) : (
                                                                <span className="py-2 px-1">-</span>
                                                            )}
                                                        </>
                                                    ) : (
                                                        'N/A'
                                                    )}
                                                </div>
                                                <div className="fs-15 fw-bold text-secondary">4. Were meds taken within 48 hours of appointment?</div>
                                                <div className="fs-15 ms-3 mb-2">
                                                    {addReqInfo1?.sessionquestionaire_data?.were_meds_taken_within_48_hours_of_appointment == true
                                                        ? 'Yes'
                                                        : addReqInfo1?.sessionquestionaire_data?.were_meds_taken_within_48_hours_of_appointment == false
                                                            ? 'No'
                                                            : 'N/A'}
                                                </div>
                                                <div className="fs-15 fw-bold text-secondary">5. Did client have stimulants day of scan? (caffeine, soda, cannabis, etc)</div>
                                                <div className="fs-15 ms-3 mb-2">
                                                    {addReqInfo1?.sessionquestionaire_data?.did_client_have_stimulants_day_of_scan == true
                                                        ? 'Yes'
                                                        : addReqInfo1?.sessionquestionaire_data?.did_client_have_stimulants_day_of_scan == false
                                                            ? 'No'
                                                            : 'N/A'}
                                                </div>
                                                <div className="fs-15 fw-bold text-secondary">6. Past psychiatric medication response (if known)</div>
                                                <div className="fs-15 ms-3 mb-2">{addReqInfo1?.sessionquestionaire_data?.past_psychiatric_medication_response || 'N/A'}</div>
                                                <div className="fs-15 fw-bold text-secondary">7. Does patient require</div>
                                                <div className="fs-15 ms-3 mb-2">{addReqInfo1?.sessionquestionaire_data?.does_patient_require || 'N/A'}</div>
                                                <div className="fs-15 fw-bold text-secondary">8. Brief history</div>
                                                <div className="fs-15 ms-3 mb-2">{addReqInfo1?.sessionquestionaire_data?.brief_history || 'N/A'}</div>
                                            </>
                                        </Spin>
                                    ) : (
                                        <div className="p-3 text-gray text-center bg-light w-100">{loading4 ? 'Loading...' : 'No session questionnaire associated'}</div>
                                    )
                                }
                                <div className="">
                                    {addReqInfo1?.phq8_flag && (
                                        <>
                                            <Divider className="header-divider  mb-2" />
                                            <div className="d-flex mt-0">
                                                <div className="col-auto">
                                                    <p className="fw-bold sub-title">Patient Health Questionnaire</p>
                                                </div>
                                            </div>
                                            <Spin spinning={loading4} className="h-100">
                                                <table className="w-100 edf-step-header table-bordered bg-white ">
                                                    <thead>
                                                        <tr className="heading bg-primary">
                                                            <th className="p-2 question-heading text-white">Questions</th>
                                                            <th className="p-2 text-center r-check text-white">R1</th>
                                                            <th className="p-2 text-center r-check text-white">R2</th>
                                                            <th className="p-2 text-center r-check text-white">R3</th>
                                                            <th className="p-2 text-center r-check text-white">R4</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {phqAnsInfo?.data?.map((item: any, index: number) => {
                                                            return (
                                                                <tr key={item.phqid} className={`phq-ans-section ${index % 2 === 0 ? 'bg-light' : 'even'}`}>
                                                                    <td className="p-2">{item.phq}</td>
                                                                    <td className={`p-2 text-center`}>{item.phq_score === 0 ? <div className="div green-div"></div> : ''}</td>
                                                                    <td className={`p-2 text-center`}>{item.phq_score === 1 ? <div className="div orange-div"></div> : ''}</td>
                                                                    <td className={`p-2 text-center`}>{item.phq_score === 2 ? <div className="div pink-div"></div> : ''}</td>
                                                                    <td className={`p-2 text-center`}>{item.phq_score === 3 ? <div className="div purple-div"></div> : ''}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                                <div className="bg-lightprimary phq-ans-section my-2 p-2 d-flex flex-wrap">
                                                    <div className="col-md-6 d-flex mb-2 fw-bold">
                                                        <div className="div green-div me-1"></div>R1 - Not at all
                                                    </div>
                                                    <div className="col-md-6 d-flex mb-2 fw-bold">
                                                        <div className="div orange-div me-1"></div>R2 - Several days
                                                    </div>
                                                    <div className="col-md-6 d-flex fw-bold">
                                                        <div className="div pink-div me-1"></div>R3 - More than half days
                                                    </div>
                                                    <div className="col-md-6 d-flex fw-bold">
                                                        <div className="div purple-div me-1"></div>R4 - Nearly every day
                                                    </div>
                                                </div>
                                            </Spin>
                                        </>
                                    )}
                                </div>
                                <h6 className="pb-1 mt-3 d-flex w-100 border-top pt-3">Patient Consent Form</h6>
                                {location.state.rowData?.request_from == 3 ? <div className="fs-15 py-0">
                                    Consent is uploaded on <span className='fw-bold'>{location.state.rowData?.created_on ? dayjs(location.state.rowData?.created_on).format('DD/MM/YYYY') : ""}.</span> Click here to preview the <a className="text-underline" onClick={showTermModal}>terms and conditions</a>
                                </div> : resultInfo?.req_info?.consent_doc_id !== 0 ? (
                                    <div className="fs-15 py-0">
                                        Consent is uploaded on <span className='fw-bold'>{resultInfo?.req_info?.consent_upload_date ? dayjs(resultInfo?.req_info?.consent_upload_date).format('DD/MM/YYYY') : ""}.</span> Click here to preview the <a className="text-underline" onClick={showTermModal}>terms and conditions</a>
                                    </div>
                                ) : (
                                    <div className="p-3 text-gray text-center bg-light w-100">{loading4 ? 'Loading...' : 'This request does not contain patient consent'}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>

            <ReassesReq openModal={openReassModal} closeModal={closeResModal} rowData={location?.state?.rowData} />
            <TermsAgreement openModal={termModal} closeModal={closeTermModal} />
        </div>
    );
};

export default DatasetInformation;

function ManualResult() {
    const { resultInfo, loading4: resultInfoLoading } = useSelector((state: any) => state.wizard);
    const { resultData, loading4 } = useSelector((state: any) => state.released);
    const { resultDownProgress } = useSelector((state: any) => state.download);
    const dataUri = resultData?.data?.encodefiledata && resultData?.data?.encodefiledata !== 'None' ? `data:application/pdf;base64,${resultData?.data?.encodefiledata}` : '';
    const addReqInfo1 = resultInfo?.req_info || null;
    const docs: Document[] = [{ uri: dataUri, fileName: addReqInfo1?.servicerequest_info?.encoded_RequestNumber ? `${addReqInfo1?.servicerequest_info?.encoded_RequestNumber}_manual_report.pdf` : `Axon_manual_report.pdf` }];

    return (
        <div>
            <Spin spinning={resultInfoLoading}>
                {loading4 && resultDownProgress < 100 ? (
                    <div className="bg-white p-5 text-center">
                        <Progress type="dashboard" steps={8} percent={resultDownProgress} trailColor="rgba(0, 0, 0, 0.06)" strokeWidth={5} />
                    </div>
                ) : (
                    <div className="relDocHeight">{resultData?.data?.encodefiledata ? <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> : ''}</div>
                )}
            </Spin>
        </div>
    );
}
