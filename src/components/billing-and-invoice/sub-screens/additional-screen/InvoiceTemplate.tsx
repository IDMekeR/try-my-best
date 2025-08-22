import React, { useEffect, useState } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Template3Logo } from 'components/shared/TemplateImages';
import { message, Popconfirm, Spin } from 'components/shared/AntComponent';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { url2, useDispatch, useSelector } from 'components/shared/CompVariables';
import { getInvoiceInfo, approveInvoice } from 'services/actions/invoiceAction';
import InvoiceAdjustment from 'components/billing-and-invoice/modal/InvoiceAdjustment';
import { Radio } from 'components/shared/FormComponent';
import { Avatar } from 'antd';
import html2pdf from 'html2pdf.js';
import dayjs from 'dayjs';
import InvoiceStatement from './InvoiceStatement';
import { UserOutlined } from '@ant-design/icons';
import 'assets/styles/template2.scss';

const InvoiceTemplate: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { invoicePageInfo, loading3, loading7, success7 } = useSelector((state: any) => state.invoice);
    const { countryInfo } = useSelector((state: any) => state.commonData);
    const [countryDetail, setCountryDetail]: any = useState();
    const startDate = new Date();
    const formattedStartDate = startDate ? dayjs(startDate)?.format('MM-DD-YYYY') : '';
    const [zoom, setZoom] = useState(1); // Zoom level state
    const [totalPrice, setTotalPrice]: any = useState();
    const [isDiscount, setIsDiscount] = useState(false);
    const [totalAmount, setTotalAmount] = useState('');
    const handleZoomIn = () => setZoom((prevZoom) => Math.min(prevZoom + 0.1, 2)); // Max zoom-in level
    const handleZoomOut = () => setZoom((prevZoom) => Math.max(prevZoom - 0.1, 0.5)); // Min zoom-out level
    const accData = location?.state?.accData ? location?.state?.accData : [];
    const [selectedTab, setSelectedTab] = useState('a');
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success7 : null;
    const [openModal, setOpenModal] = useState(false);
    const [tempLoading, setTempLoading] = useState(false);
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    function getInvoiceDetails() {
        dispatch(getInvoiceInfo(accData?.id) as any);
    }

    useEffect(() => {
        if (
            invoicePageInfo?.data?.invoicedata?.invoice_discount &&
            invoicePageInfo?.data?.invoicedata?.invoice_discount !== null &&
            invoicePageInfo?.data?.invoicedata?.invoice_discount !== ''
        ) {
            setTotalPrice(invoicePageInfo?.data?.invoicedata?.invoiceprice);
        } else {
            setTotalPrice(invoicePageInfo?.data?.invoicedata?.inv_amount);
        }
        setTotalAmount(invoicePageInfo?.data?.invoicedata?.inv_amount);
        setIsDiscount(invoicePageInfo?.data?.invoicedata?.invoice_discount_percentage_flag);
    }, [invoicePageInfo]);

    useEffect(() => {
        const countryId = Number(invoicePageInfo?.data?.account_info?.country);
        const country = countryInfo?.data?.find((country) => country.id === countryId);
        setCountryDetail(country);
    }, [countryInfo, invoicePageInfo?.data?.account_info?.country]);

    useEffect(() => {
        getInvoiceDetails();
    }, []);

    const handleClose = () => {
        setOpenModal(false);
    };

    const handelInvoiceApprove = async () => {
        setTempLoading(true);
        const base64String = await downloadPDF(false);
        const inputJson = {
            account_id: location?.state?.accId,
            invoice_id: location?.state?.invoiceId,
            approve_status: 'approved',
            invoicestatement_base64: base64String?.remaining,
            invoice_base64: base64String?.full,
        };
        dispatch(approveInvoice(inputJson) as any);
        setShowSuccessmsg1(true);
    };

    useEffect(() => {
        if (successmsg1) {
            message.success('Invoice Approved Successfully');
            setShowSuccessmsg1(false);
            handlegoBack();
        }
    }, [successmsg1]);

    const handlegoBack = () => {
        navigate('/invoice-manager', { state: { tab: '2' } } as NavigateOptions);
    };

    const formatReportItems = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .split(' , ')
            .filter((item) => item !== 'reports' && item !== 'report' && item !== 'rpt' && item !== 'base datahub reports')
            .map((item) => {
                if (item.length === 3) {
                    return item.toUpperCase();
                } else {
                    return item
                        .split(' ')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                }
            })
            .join(' , ');
    };

    const downloadPDF = async (isDownload: boolean): Promise<void | { full: string; page1: string; remaining: string }> => {
        const opt = {
            margin: [0, 0, 0, 0],
            filename: `invoice.pdf`,
            image: { type: 'jpeg', quality: 0.8 },
            html2canvas: { scale: 2, loggin: true, dpi: 280, letterRendering: true },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            enableLinks: true,
        };

        const itemsPerPage = 10;
        const pageCount = Math.ceil(invoicePageInfo?.data?.req_Data?.length / itemsPerPage);
        const elements = {};

        for (let currentPage = 1; currentPage <= pageCount + 1; currentPage++) {
            elements[`element${currentPage}`] = document.getElementById(`page${currentPage}`);
        }

        const wrapper = document.createElement('div');
        const wrapperPage1 = document.createElement('div');
        const wrapperRemaining = document.createElement('div');

        // Make all pages temporarily visible before generating the PDF
        const originalDisplayValues: { [key: string]: string } = {};
        for (let currentPage = 1; currentPage <= pageCount + 1; currentPage++) {
            const page = document.getElementById(`page${currentPage}`);
            if (page) {
                originalDisplayValues[`page${currentPage}`] = page.style.display;
                page.style.display = 'block';
            }
        }

        for (let currentPage = 1; currentPage <= pageCount + 1; currentPage++) {
            const currentElement = document.getElementById(`page${currentPage}`);
            if (currentElement) {
                const currentElementClone = currentElement.cloneNode(true) as HTMLElement;
                wrapper.appendChild(currentElementClone);
                if (currentPage === 1) {
                    wrapperPage1.appendChild(currentElementClone.cloneNode(true)) as HTMLElement;
                } else {
                    wrapperRemaining.appendChild(currentElementClone.cloneNode(true) as HTMLElement);
                }
            } else {
                console.log(`Element with ID 'page${currentPage}' not found.`);
            }
        }

        let base64StringFull = '';
        let base64StringPage1 = '';
        let base64StringRemaining = '';

        try {
            // Full PDF
            if (isDownload) {
                html2pdf().from(wrapper).set(opt).save();
                return;
            }
            const pdfDataUrlFull = await html2pdf().from(wrapper).set(opt).output('datauristring');
            base64StringFull = pdfDataUrlFull.split(',')[1];

            // Page 1 PDF
            const pdfDataUrlPage1 = await html2pdf().from(wrapperPage1).set(opt).output('datauristring');
            base64StringPage1 = pdfDataUrlPage1.split(',')[1];

            // Remaining Pages PDF
            const pdfDataUrlRemaining = await html2pdf().from(wrapperRemaining).set(opt).output('datauristring');
            base64StringRemaining = pdfDataUrlRemaining.split(',')[1];
        } catch (error) {
            console.log('Error generating PDF:', error);
        }
        if (!isDownload) {
            setTimeout(async () => {
                // Revert all pages back to their original display values after download
                setTimeout(() => {
                    for (let currentPage = 1; currentPage <= pageCount + 1; currentPage++) {
                        const page = document.getElementById(`page${currentPage}`);
                        if (page) {
                            // Check the selected tab and hide/show pages accordingly
                            if (selectedTab === 'a') {
                                // If 'a' is selected, only show pages related to 'a'
                                if (currentPage === 1) {
                                    page.style.display = 'block'; // Show Page 1 (or Tab A's content)
                                } else {
                                    page.style.display = 'none'; // Hide all other pages
                                }
                            } else if (selectedTab === 'b') {
                                // If 'b' is selected, only show pages related to 'b'
                                if (currentPage !== 1) {
                                    page.style.display = 'block'; // Show Page 2 (or Tab B's content)
                                } else {
                                    page.style.display = 'none'; // Hide Page 1
                                }
                            }
                        }
                    }
                    setTempLoading(false);
                }, 100);
            }, 100);

            return {
                full: base64StringFull,
                page1: base64StringPage1,
                remaining: base64StringRemaining,
            };
        }
        return;
    };

    return (
        <div className="p-2">
            <div className="mt-2 d-flex justify-content-between mb-1">
                <h5>Invoice Details</h5>
                <Button type="primary" className="ms-auto col-auto" onClick={handlegoBack}>
                    Back
                </Button>
            </div>
            <Spin spinning={loading3}>
                <div className="row m-0">
                    <div className="col-md-9 bg-white ps-0 py-2 shadow-sm">
                        <div className="d-flex">
                            <div className="ms-2">
                                <Radio.Group defaultValue={selectedTab} value={selectedTab} buttonStyle="solid" onChange={(e) => setSelectedTab(e.target.value)}>
                                    <Radio.Button value="a">Invoice</Radio.Button>
                                    <Radio.Button value="b">Invoice Statement</Radio.Button>
                                </Radio.Group>
                            </div>
                            <div className="ms-auto d-flex me-2">
                                <Button type="primary" className="me-2" onClick={() => setOpenModal(true)}>
                                    Adjustment
                                </Button>
                                <Popconfirm placement="topLeft" title="Are you sure to approve this invoice?" onConfirm={() => handelInvoiceApprove()} okText="Yes" cancelText="No">
                                    <Button className="" loading={loading7} type="primary">
                                        Approve
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                        <Spin spinning={tempLoading}>
                            <div className="invoice-template bg-light  m-2 template-heights">
                                <div className="template-controls mt-0 p-2 bg-lightprimary">
                                    <Button type="primary" className="mx-2 rounded-circle fw-bold shadow-sm fs-20" onClick={handleZoomIn}>
                                        +
                                    </Button>
                                    <Button type="default" className="mx-2 rounded-circle fw-bold shadow-sm fs-20" onClick={handleZoomOut}>
                                        -
                                    </Button>
                                </div>
                                <div id="page1" className="page-one bg-white  mx-auto" style={{ zoom: zoom, display: selectedTab == 'a' ? 'block' : 'none' }}>
                                    <div>
                                        <div
                                            style={{ display: 'flex', flexDirection: 'row', padding: '0px 0px 0px 0px', justifyContent: 'space-between', borderBottom: '2px solid #5f4ce1' }}
                                        >
                                            <div style={{ flex: '1', marginLeft: '0px', marginTop: '0px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <img src={Template3Logo} alt="Logo" style={{ marginTop: '20px', width: '265px' }} />
                                                </div>
                                            </div>
                                            <div
                                                style={{
                                                    flex: '2',
                                                    marginLeft: '20px',
                                                    backgroundColor: '#5f4ce1',
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'end',
                                                }}
                                            >
                                                <div style={{ display: 'flex', padding: '10px', paddingRight: '20px', flexDirection: 'column', textAlign: 'right' }}>
                                                    <h6 style={{ fontSize: '15px', fontFamily: "'Lato',sans-serif", color: '#ffff', fontWeight: 'bold' }}>Axon EEG Solutions</h6>
                                                    <h6 style={{ fontSize: '15px', fontFamily: "'Lato',sans-serif", color: '#ffff', fontWeight: 'bold' }}>EEG Data Hub </h6>
                                                    <h6 style={{ fontSize: '15px', fontFamily: "'Lato',sans-serif", color: '#ffff', fontWeight: 'bold' }}>Fort Collins,CO </h6>
                                                    <h6 style={{ fontSize: '15px', fontFamily: "'Lato',sans-serif", color: '#ffff', fontWeight: 'bold' }}>USA</h6>
                                                    <h6 style={{ fontSize: '15px', fontFamily: "'Lato',sans-serif", color: '#ffff', marginBottom: '0px', fontWeight: 'bold' }}>
                                                        info@axoneegsolutions.com
                                                    </h6>
                                                </div>
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        top: '0',
                                                        left: '0',
                                                        width: '0px',
                                                        height: '0px',
                                                        borderLeft: '130px solid #ffffff',
                                                        borderBottom: '143px solid #5f4ce1',
                                                        borderLeftColor: '#ffffff',
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="page-body">
                                            <div
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    marginBottom: '30px',
                                                    marginTop: '20px',
                                                    justifyContent: 'space-between',
                                                    padding: '14px',
                                                }}
                                            >
                                                <div style={{ flex: '1' }}>
                                                    <div style={{ textAlign: 'left' }}>
                                                        <h3 className="text-dark" style={{ marginBottom: '10px', fontWeight: 'bold', fontSize: '14px', fontFamily: "'Lato',sans-serif" }}>
                                                            INVOICE TO:
                                                        </h3>
                                                        <h6 className="text-dark" style={{ fontSize: '14px', fontFamily: "'Lato',sans-serif", marginBottom: '5px' }}>
                                                            {invoicePageInfo?.data?.account_info?.account_name}
                                                        </h6>
                                                        <h6 className="text-dark" style={{ fontSize: '14px', fontFamily: "'Lato',sans-serif", marginBottom: '5px' }}>
                                                            {invoicePageInfo?.data?.account_info?.contact_address}
                                                        </h6>
                                                        <h6 className="text-dark" style={{ fontSize: '14px', fontFamily: "'Lato',sans-serif", marginBottom: '5px' }}>
                                                            {invoicePageInfo?.data?.account_info?.countryname || 'United States'}
                                                        </h6>
                                                        <h6 className="text-dark" style={{ fontSize: '14px', fontFamily: "'Lato',sans-serif", marginBottom: '5px' }}>
                                                            {invoicePageInfo?.data?.account_info?.city}
                                                        </h6>
                                                    </div>
                                                </div>
                                                <div style={{ flex: '1', textAlign: 'right', fontFamily: 'Lato', display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'end' }}>
                                                        <div>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                INVOICE NUMBER:
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                DATE:
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                INVOICE DUE DATE:
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontWeight: 'bold',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                INVOICE PERIOD:
                                                            </h3>
                                                        </div>
                                                        <div>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'normal',
                                                                    marginLeft: '5px',
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                {invoicePageInfo?.data?.invoicedata?.invoice_number}
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'normal',
                                                                    marginLeft: '5px',
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                {formattedStartDate}
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'normal',
                                                                    marginLeft: '5px',
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                {invoicePageInfo?.data?.invoice_due_date ? dayjs(invoicePageInfo?.data?.invoice_due_date)?.format('MM-DD-YYYY') : null}
                                                            </h3>
                                                            <h3
                                                                className="text-dark"
                                                                style={{
                                                                    marginBottom: '10px',
                                                                    fontSize: '14px',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'normal',
                                                                    marginLeft: '5px',
                                                                    textAlign: 'start',
                                                                }}
                                                            >
                                                                {' '}
                                                                -{' '}
                                                            </h3>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div style={{ padding: '14px' }}>
                                                <table className="invoiceTable" style={{ borderCollapse: 'collapse', width: '100%' }}>
                                                    <thead>
                                                        <tr style={{ backgroundColor: '#d4d4d8', border: '1px solid lightgray', color: '#000' }}>
                                                            <th
                                                                style={{
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'bold',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                S.No
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'left',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'bold',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                Description
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'bold',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                Unit Price
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'bold',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                Quantity
                                                            </th>
                                                            <th
                                                                style={{
                                                                    padding: '10px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 'bold',
                                                                    width: '5%',
                                                                }}
                                                            >
                                                                Amount
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr style={{ borderBottom: '1px solid lightgray', fontFamily: "'Lato',sans-serif" }}>
                                                            <td
                                                                style={{
                                                                    width: '10%',
                                                                    fontSize: '14px',
                                                                    padding: '10px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 300,
                                                                    verticalAlign: 'top',
                                                                    borderRight: '1px solid lightgray',
                                                                    borderLeft: '1px solid lightgray',
                                                                }}
                                                            >
                                                                1
                                                            </td>
                                                            <td
                                                                style={{
                                                                    width: '45%',
                                                                    fontSize: '14px',
                                                                    padding: '10px',
                                                                    textAlign: 'start',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 300,
                                                                    verticalAlign: 'top',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                {invoicePageInfo?.data?.invoice_report_description
                                                                    ? formatReportItems(invoicePageInfo?.data?.invoice_report_description)
                                                                    : '-'}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    width: '15%',
                                                                    fontSize: '14px',
                                                                    padding: '10px',
                                                                    textAlign: 'end',
                                                                    verticalAlign: 'top',
                                                                    borderRight: '1px solid lightgray',
                                                                    paddingRight: '15px',
                                                                }}
                                                            >
                                                                ${parseFloat(invoicePageInfo?.data?.invoicedata?.inv_amount || 0).toFixed(2)}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    width: '15%',
                                                                    fontSize: '14px',
                                                                    padding: '10px',
                                                                    textAlign: 'center',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 300,
                                                                    verticalAlign: 'top',
                                                                    borderRight: '1px solid lightgray',
                                                                }}
                                                            >
                                                                {accData?.request_ids?.includes(',') ? accData?.request_ids?.split(',')?.length : 1 || 1}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    width: '15%',
                                                                    fontSize: '14px',
                                                                    padding: '10px',
                                                                    textAlign: 'end',
                                                                    fontFamily: "'Lato',sans-serif",
                                                                    fontWeight: 300,
                                                                    verticalAlign: 'top',
                                                                    borderRight: '1px solid lightgray',
                                                                    paddingRight: '15px',
                                                                }}
                                                            >
                                                                ${parseFloat(invoicePageInfo?.data?.invoicedata?.inv_amount || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        {isDiscount && (
                                                            <tr style={{ height: '18px' }}>
                                                                <td colSpan={3} style={{ borderLeft: 'none' }}></td>
                                                                <td
                                                                    style={{
                                                                        padding: '5px 15px',
                                                                        fontSize: '14px',
                                                                        textAlign: 'left',
                                                                        fontFamily: '"Lato",sans-serif',
                                                                        background: '#eee',
                                                                        border: '1px solid lightgray',
                                                                        fontWeight: 'bold',
                                                                        paddingRight: '0px',
                                                                    }}
                                                                >
                                                                    <span style={{ fontSize: '14px' }}>Adjustment (discount)</span>
                                                                </td>
                                                                <td
                                                                    style={{
                                                                        padding: '5px 15px',
                                                                        fontFamily: '"Lato",sans-serif',
                                                                        textAlign: 'right',
                                                                        fontWeight: 300,
                                                                        border: '1px solid lightgray',
                                                                        fontSize: '14px',
                                                                    }}
                                                                >
                                                                    ${parseFloat(invoicePageInfo?.data?.invoicedata?.invoice_discount || 0).toFixed(2)}
                                                                </td>
                                                            </tr>
                                                        )}
                                                        <tr style={{ height: '18px' }}>
                                                            <td colSpan={3} style={{ borderLeft: 'none' }}></td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    fontSize: '14px',
                                                                    textAlign: 'left',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    background: '#eee',
                                                                    border: '1px solid lightgray',
                                                                    fontWeight: 'bold',
                                                                    paddingRight: '0px',
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '14px' }}>Sub Total</span>
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    textAlign: 'right',
                                                                    fontWeight: 300,
                                                                    border: '1px solid lightgray',
                                                                    fontSize: '14px',
                                                                }}
                                                            >
                                                                ${parseFloat(invoicePageInfo?.data?.invoicedata?.inv_amount || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                        <tr style={{ height: '18px' }}>
                                                            <td colSpan={3}></td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    textAlign: 'left',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    background: '#eee',
                                                                    border: '1px solid lightgray',
                                                                    fontWeight: 'bold',
                                                                    paddingRight: '0px',
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '14px' }}>Tax (0.0%)</span>
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    textAlign: 'right',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    fontWeight: 300,
                                                                    fontSize: '14px',
                                                                    border: '1px solid lightgray',
                                                                }}
                                                            >
                                                                $0.00
                                                            </td>
                                                        </tr>
                                                        <tr style={{ height: '18px' }}>
                                                            <td colSpan={3}></td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    textAlign: 'left',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    border: '1px solid lightgray',
                                                                    fontWeight: 'bold',
                                                                    paddingRight: '0px',
                                                                    background: '#6495ed38',
                                                                }}
                                                            >
                                                                <span style={{ fontSize: '14px', color: '#5a53b2' }}>Total</span>
                                                            </td>
                                                            <td
                                                                style={{
                                                                    padding: '5px 15px',
                                                                    textAlign: 'right',
                                                                    fontFamily: '"Lato",sans-serif',
                                                                    border: '1px solid lightgray',
                                                                    fontSize: '14px',
                                                                    color: '#5a53b2',
                                                                    fontWeight: 'bold',
                                                                    background: '#6495ed38',
                                                                }}
                                                            >
                                                                ${parseFloat(totalPrice || 0).toFixed(2)}
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="footer" style={{ position: 'absolute', bottom: 0, width: '100%', padding: '10px' }}>
                                            <div style={{ textAlign: 'left', marginTop: accData?.invoice_report_description?.length >= 400 ? '120px' : '320px', padding: '14px 0px' }}>
                                                <h3 className="text-dark" style={{ marginBottom: '8px', fontWeight: 'bold', fontSize: '16px', fontFamily: "'Lato',sans-serif" }}>
                                                    Terms:
                                                </h3>
                                                <h6 className="text-dark fw-500" style={{ fontSize: '14px', fontFamily: "'Lato',sans-serif" }}>
                                                    {accData?.invoice_terms === 0 || accData?.invoice_terms === '' || accData?.invoice_terms === null
                                                        ? 'Payment is due upon receipt of the invoice.'
                                                        : `Payment is due within ${accData?.invoice_term} days from the date of the invoice`}
                                                </h6>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                                <div style={{ flexGrow: 1, borderBottom: '1.5px solid #c0c0c0' }}></div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <div style={{ flex: '1' }}>
                                                    <div>
                                                        <h5 style={{ fontSize: '12px', fontFamily: '"Lato",sans-serif', color: '#595959' }}>© {currentYear} Invoice All Rights Reserved</h5>
                                                    </div>
                                                </div>
                                                <div style={{ flex: '1', display: 'flex', flexDirection: 'row', textAlign: 'left', alignContent: 'center' }}>
                                                    <div style={{ flexGrow: 1, padding: '0px 0px 0px 10px', display: 'flex', alignItems: 'center' }}>
                                                        <h5 style={{ fontSize: '12px', fontFamily: '"Lato",sans-serif', marginLeft: 'auto', color: '#595959' }}>
                                                            For any billing enquiries, please contact our billing department at info@axoneegsolutions.com
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <InvoiceStatement zoom={zoom} data={{ selectedTab: selectedTab }} />
                            </div>
                        </Spin>
                    </div>
                    <div className="col ms-2 bg-white p-2">
                        <div className="text-center">
                            {invoicePageInfo ? (
                                invoicePageInfo?.data?.account_info?.iconpath ? (
                                    <Avatar size={120} src={invoicePageInfo ?  invoicePageInfo?.data?.account_info?.iconpath?.startsWith('https:') ? invoicePageInfo?.data?.account_info?.iconpath : "": ""} className="bg-lightprimary text-primary" />
                                ) : (
                                    <Avatar size={120} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                                )
                            ) : (
                                <Avatar size={120} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                            )}
                            <h6 className="text-capitalize fs-20 mt-2 mb-1">
                                { (invoicePageInfo?.data?.account_info?.first_name || invoicePageInfo?.data?.account_info?.last_name ) ? invoicePageInfo?.data?.account_info?.first_name + ' ' + invoicePageInfo?.data?.account_info?.last_name || '' : '-'}
                            </h6>
                        </div>
                        <div className="d-flex border-top p-2 flex-wrap">
                            <div className="col-md-6 fs-15">
                                <div className="text-dark fw-bold fs-16">ACCOUNT ID</div>
                                {invoicePageInfo ? invoicePageInfo?.data?.account_info?.encoded_accountNumber : '-'}
                            </div>
                            <div className="col-md-6 fs-15 mb-3">
                                <div className="text-dark fw-bold fs-16">ACCOUNT NAME</div>
                                {invoicePageInfo ? invoicePageInfo?.data?.account_info?.account_name : '-'}
                            </div>
                            <div className="col-md-6 fs-15 email-wrap">
                                <div className="text-dark fw-bold fs-16">EMAIL</div>
                                {invoicePageInfo ? invoicePageInfo?.data?.account_info?.contact_email : '-'}
                            </div>
                            <div className="col-md-6 fs-15 mb-3">
                                <div className="text-dark fw-bold fs-16">CONTACT PHONE</div>
                                {invoicePageInfo ? invoicePageInfo?.data?.account_info?.contact_phone : '-'}
                            </div>
                            <div className="col-md-6 fs-15">
                                <div className="text-dark fw-bold fs-16">COUNTRY</div>
                                {countryDetail?.countryname ? countryDetail?.countryname : '-'}
                            </div>
                        </div>
                    </div>
                </div>
            </Spin>
            <InvoiceAdjustment openModal={openModal} handleClose={handleClose} totalAmount={totalAmount} invoiceId={location?.state?.invoiceId} />
        </div>
    );
};

export default InvoiceTemplate;
