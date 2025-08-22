import React, { useEffect, useState } from 'react';
import { Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import html2pdf from 'html2pdf.js';
import ReportBaseTemplate from './template-screens/template1/ReportBaseTemplate';
import { message, Popconfirm, Progress, ProgressProps, Spin, Tooltip, Alert } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { getDataset, releaseRequest } from 'services/actions/pipeline/stepwizardAction';
import { url2 } from 'components/shared/CompVariables';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ExclamationCircleOutlined, SyncOutlined } from '@ant-design/icons';
import UploadResult from '../../modal/UploadResult';
import BaseTemplate from './template-screens/template2/BaseTemplate';
import { getResultDocDownload } from 'services/actions/releasedReqAction';
interface Document {
    uri: string;
    fileName?: string;
}

const ApproveRequest: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { commonInfo, loading5 } = useSelector((state: any) => state.commonData);
    const { resultInfo, loading15, error15, success15, loading4: resultLoading, stepsInfo, datasetInfo } = useSelector((state: any) => state.wizard);
    const { resultData, loading4 } = useSelector((state: any) => state.released);
    const { resultDownProgress } = useSelector((state: any) => state.download);
    const { neuroFields } = useSelector((state: any) => state.recAnalysis);
    const dataUri = resultData?.data?.encodefiledata ? `data:application/pdf;base64,${resultData?.data?.encodefiledata}` : '';
    const docs: Document[] = [{ uri: dataUri ? dataUri : '', fileName: resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_manual_report.pdf` : `Axon_manual_report.pdf` }];
    const [selectedOption, setSelectedOption] = useState('3');
    const isMuRhythm = Boolean(commonInfo?.interpretationmakers?.find((item) => item.markername === 'Mu Rhythm Present' && (item?.eyeopen === 'true' || item?.eyeclosed === 'true')));
    const hasMedicChoice = commonInfo?.medic_templ?.some((item) => item.ischoices === true) || false;
    const [selectedApprove, setSelectedApprove] = useState('1');
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
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success15 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error15 : false;
    const [openResModal, setOpenResModal] = useState(false);
    const [isResultApprove, setIsResultApprove] = useState(false)

    const [neuroEC, setNeuroEC] = useState();
    const [neuroEO, setNeuroEO] = useState();
    const [showPBM, setShowPBM] = useState(false);

    useEffect(()=>{
        if (neuroFields) {
            setNeuroEO(neuroFields?.data?.neurofeedback_EO);
            setNeuroEC(neuroFields?.data?.neurofeedback_EC);
        }
    },[neuroFields])

    useEffect(()=>{
        if(commonInfo){
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
    },[commonInfo])

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const fileOptions = [
        { label: 'Manual Result', value: '1' },
        { label: 'Datahub Template 1', value: '2' },
        { label: 'Datahub Template 2', value: '3' },
    ];

    const fileOptions1 = [
        { label: 'Datahub Template 1', value: '2' },
        { label: 'Datahub Template 2', value: '3' },
    ];

    const approveOption = [{ label: 'Steve Rondeau', value: '1' }];

    const showResModal = (val: boolean) => {
        setOpenResModal(val);
    };
    const closeResModal = () => {
        setOpenResModal(false);
    };
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

    const downloadPDF = (id: any, isDownload: any) => {
        isDownload && setLoading(true);
        !isDownload && setIsResultApprove(true)
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
            if (selectedOption == '1') {
                releaseReq();
            } else if (selectedOption === '2') {
                handleDownloadPDF(id, isDownload);
            } else if (selectedOption === '3') {
                handleDownloadPDF1(id, isDownload);
            }

        }, 2000);
    };

    const handleDownloadPDF = async (id: any, isDownload: any) => {
        let selectedSupp = [];
        let selectedLyf = [];
        selectedSupp = commonInfo?.mdnutritional_supplementation_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        selectedLyf = commonInfo?.lifestyle_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
        setProgress(0);
        const opt = {
            margin: [0, 0, 0, 0],
            filename: resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber ? `${resultInfo?.req_info?.servicerequest_info?.encoded_RequestNumber}_Datahub_report.pdf` : `Datahub_report.pdf`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas: { scale: 2,  useCORS: true, letterRendering: true },
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
                ( commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) &&
                    (selectedSupp?.length > 0 || selectedLyf?.length > 0) &&
                    wrapper.appendChild(element8Clone);
            }
            {
                ( commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) &&
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
                if (isDownload) {
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
                } else {
                    let base64String = '';
                    const pdfDataUrl = await html2pdf().from(wrapper).set(opt).output('datauristring');
                    base64String = pdfDataUrl.split(',')[1];
                    setIsResultApprove(false)
                    releaseReq(base64String);
                }
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

    const handleDownloadPDF1 = async (id: any, isDownload: any) => {
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

            const wrapper1 = document.createElement('div');
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
                if ( commonInfo?.lifestyle_flag || commonInfo?.lifestyle_flag === null) {
                    (selectedSupp?.length > 0 || selectedLyf?.length > 0) && wrapper1.appendChild(element111Clone);
                    (selectedSupp?.length == 2 || selectedLyf?.length == 2) && wrapper1.appendChild(element112Clone);
                }
                if ((commonInfo?.medicine_recommendatio_flag || commonInfo?.medicine_recommendatio_flag == null) && hasMedicChoice) {
                    wrapper1.appendChild(element113Clone);
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
                if (isDownload) {

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
                } else {
                    let base64String = '';
                    const pdfWithPageNumbers = await html2pdf()
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
                            return pdf;
                        });
                    const pdfDataUrl = await pdfWithPageNumbers.output('datauristring');
                    base64String = pdfDataUrl.split(',')[1];
                    setIsResultApprove(false)
                    releaseReq(base64String);
                }
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

    const LoadingIndicator = () => {
        return <Progress type="circle" percent={progress} strokeColor={twoColors} />;
    };

    const releaseReq = (val: any = '') => {
        const inputJson = {
            ServiceRequestid: location.state?.id,
            RequestResult: resultInfo?.req_info?.result_docid === 0 ? val : null,
        };
        dispatch(releaseRequest(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
        setIsResultApprove(false);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Request released successfully');
            handleGlanceChange();
            navigate('/view-request');
        }
        if (errormsg) {
            if (error15?.data) {
                message.error(error15?.data);
            } else {
                message.error("Request couldn't be released");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    function getResultDoc() {
        const inputJson = {
            resultdocid: stepsInfo?.data?.result_docid,
        };
        dispatch(getResultDocDownload(inputJson) as any);
    }

    useEffect(() => {
        if (stepsInfo?.data?.result_flag ) {
            setSelectedOption('1')
            getResultDoc();
        }
    }, [stepsInfo?.data]);

    return (
        <div className="h-100 approve-wizard">
            <div className="bg-white p-3 h-100">
                <div className="d-flex w-100 header-flex flex-wrap">
                    <h6 className="fs-17 col-auto my-auto">Result Preview</h6>
                    <div className="ms-auto ps-3">{stepsInfo?.data?.result_flag ?
                        <Alert message="The results are overwritten by results from external" type="warning" showIcon closable /> : ""}
                    </div>
                    <div className="col ms-auto text-end result-preview-header">
                        {stepsInfo?.data?.result_flag ? (
                            <Select
                                value={selectedOption.toString()}
                                options={fileOptions}
                                optionFilterProp="children"
                                className="w-25 text-start ms-auto"
                                onChange={(e: any) => setSelectedOption(e)}
                            />
                        ) : (
                            <Select
                                value={selectedOption.toString()}
                                options={fileOptions1}
                                optionFilterProp="children"
                                className="w-25 text-start ms-auto"
                                onChange={(e: any) => setSelectedOption(e)}
                            />
                        )}
                        {stepsInfo?.data?.result_flag && selectedOption === '1' ? (
                            ''
                        ) : (
                            <>
                                <Button type="primary" className="mx-2" onClick={() => downloadPDF(selectedOption, true)} loading={loading || loading5}
                                    disabled={loading5
                                        || (!resultInfo?.req_info?.edfcomplete_flag && !resultInfo?.req_info?.edferror_flag && !resultInfo?.req_info?.edfprocessing_flag) ||
                                        (!resultInfo?.req_info?.edferror_flag && resultInfo?.req_info?.edfprocessing_flag)}
                                >
                                    {((!loading && loading5)) ?
                                        <span className="loading-dots">Loading<span className="dot-animation"></span></span> :
                                        'Download'
                                    }
                                </Button>
                                {
                                    !resultInfo?.req_info?.result_flag &&
                                    <Button type="default" className="text-primary fw-bold border-primary" onClick={() => showResModal(true)}>
                                        Upload Result
                                    </Button>
                                }
                            </>
                        )}
                    </div>
                </div>

                <div className="template-height mt-3 pb-2 border-bottom ">
                    {selectedOption === '1' && stepsInfo?.data?.result_flag ? (
                        <>
                            {loading4 && resultDownProgress < 100 ? (
                                <div className="bg-white p-5 text-center">
                                    <Progress type="dashboard" steps={8} percent={resultDownProgress} trailColor="rgba(0, 0, 0, 0.06)" strokeWidth={5} />
                                </div>
                            ) : (
                                <>{resultData?.data?.encodefiledata ? <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> : ''}</>
                            )}
                        </>
                    ) : (
                        <>
                            {
                                stepsInfo?.data?.edferror_flag || stepsInfo?.data?.edfprocessing_flag || (!resultLoading && !stepsInfo?.data?.edfcomplete_flag && !stepsInfo?.data?.edferror_flag && !stepsInfo?.data?.edfprocessing_flag)
                                    ? (
                                        <Spin
                                            indicator={
                                                !stepsInfo?.data?.edferror_flag && !stepsInfo?.data?.edfprocessing_flag && !stepsInfo?.data?.edfcomplete_flag ?
                                                    <ExclamationCircleOutlined className="text-warm" />
                                                    :
                                                    stepsInfo?.data?.edfprocessing_flag
                                                        ? (
                                                            <SyncOutlined spin className="text-warn" size={40} />
                                                        ) : (
                                                            <ExclamationCircleOutlined className="text-danger" />
                                                        )
                                            }
                                            tip={
                                                !stepsInfo?.data?.edfcomplete_flag && !stepsInfo?.data?.edferror_flag && !stepsInfo?.data?.edfprocessing_flag ?
                                                    (
                                                        <span className="fs-20">Job is not started yet, you can download result file only if the job is completed or result file is uploaded manually</span>
                                                    ) : resultInfo?.req_info?.edfprocessing_flag ? (
                                                        <span className="text-warn  fs-20">Job processing is in queue</span>
                                                    ) : (
                                                        <span className="text-danger fs-20">Job has been stopped for this request</span>
                                                    )
                                            }
                                        >
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
                                        </Spin>
                                    ) : (
                                        <Spin spinning={loading}
                                            tip={<LoadingIndicator />}
                                        >
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
                                        </Spin>
                                    )}
                        </>
                    )}
                </div>

                <div className="mt-2">
                    <label className="fw-600 text-gray">Result Approve & Released by</label>
                    <div className="d-flex result-preview-header mt-1 flex-wrap" >
                        <Select options={approveOption} className="col-md-2 me-2" defaultValue={selectedApprove} onChange={(e: any) => setSelectedApprove(e)} />
                        <Popconfirm placement="topLeft" title="Are you sure to release this request?" onConfirm={() => downloadPDF(selectedApprove, false)} okText="Yes" cancelText="No">
                            <Tooltip title={(loading5 || loading) ? "Tempate is loading..." : ""}>
                                <Button type="primary" loading={loading15 || isResultApprove} disabled={(loading5 || loading || ((resultInfo?.req_info?.edferror_flag || resultInfo?.req_info?.edfprocessing_flag) && !resultInfo?.req_info?.result_flag))}>
                                    Result Approve
                                </Button>
                            </Tooltip>
                        </Popconfirm>
                        {resultInfo?.req_info?.result_flag ? <div className="text-warn fw-bold ms-2 bg-lightorange px-3 py-1">Manually uploaded result will be released</div> :
                            resultInfo?.req_info?.edfprocessing_flag ? <div className="text-warn fw-bold ms-2 bg-lightorange px-3 py-1">Job processing is in queue...</div> :
                                resultInfo?.req_info?.edferror_flag ? <div className="text-danger fw-bold ms-2 bg-lightred px-3 py-1">Job has been stopped</div> : ''}
                    </div>
                </div>
            </div>

            <UploadResult openModal={openResModal} closeModal={closeResModal} requestId={location?.state?.id} />
        </div>
    );
};

export default ApproveRequest;
