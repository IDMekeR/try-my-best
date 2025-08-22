import React, {useState, useEffect} from 'react';
import 'assets/styles/account.scss';
import { message,} from 'components/shared/AntComponent';
import { DatePicker, Select, Form, Radio } from 'components/shared/FormComponent';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { Modal} from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import dayjs from 'dayjs';
import { getInvoiceExport } from 'services/actions/billingAction';
import * as XLSX from 'xlsx';

const { RangePicker } = DatePicker;

interface ChildProps {
    isOpen: any;
    callbackExport: any;
}

interface RequestData {
    'invoice_number': any;
    'account_name': any;
    'no_of_request': any;
    'amount': any;
    'credit_used': any;
    'status': any;
    'Payment_Mode':any;
}

const ExportInvoice : React.FC<ChildProps> = ({isOpen,callbackExport}) =>{
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { invExport, loading7 } = useSelector((state: any) => state.billing);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const [startDate, setStartDate] = useState(dayjs().startOf('week').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().endOf('week').format('YYYY-MM-DD'));
    const [exportModal, setExportModal] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState("paid")
    const [accOptions, setAccOptions] = useState([]);
    const [acc, setAcc] = useState('0');
    const [showLoading, setShowLoading] = useState(false)
    const [rangeType,setRangeType ] = useState("weekly");
    const [showDownload,setShowDownload]= useState(false);
    const data: RequestData[] = !loading7 ? invExport?.data : [];


    useEffect(()=>{
        setExportModal(isOpen)
    },[isOpen])

    const disableDates = (current) => {
        return current >= dayjs().endOf('day'); 
    };
    
    const handleExportCancel = () => {
        setExportModal(false)
        setShowLoading(false)
        setAcc('0')
        setPaymentStatus('paid')
        setRangeType("weekly")
        form.resetFields();
        callbackExport(false)
    }

    const handlePayStatus = (e) => {
        setPaymentStatus(e.target.value)
    }

    const options = [
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Yearly', value: 'yearly' },
        { label: 'Custom', value: 'custom' },
    ];

    const reportInvoice = async() => {
        try {
            const values = await form.validateFields();
            const formattedStartDate = dayjs(startDate).format('YYYY-MM-DD');
            const formattedEndDate = dayjs(endDate).format('YYYY-MM-DD');

            const inputJson = {
                start_on: formattedStartDate,
                end_on: formattedEndDate,
                account_id: acc !== "0" ? Number(acc) : 0,
                payment_status: paymentStatus,
            };
            dispatch(getInvoiceExport(inputJson) as any);
            setShowDownload(true);
        } catch (error) {
            console.error("Validation failed:", error);
        }
    }

    const handleAccountChange = (e) => {
        setAcc(e);
    };

    useEffect(() => {
        if (allAccountInfo?.data) {
            const arr: any = [];
            arr.push({ label: 'All', value: '0' });
            for (let i = 0; i < allAccountInfo?.data?.length; i++) {
                arr.push({ label: allAccountInfo?.data[i]?.account_name, value: allAccountInfo?.data[i]?.id });
            }
            setAccOptions(arr);
        }
    }, [allAccountInfo?.data]);

    const downloadCSV = () => {
        // Create HTML table from data
        let html = '<html><head><meta charset="utf-8"></head><body>';
        html += '<table border="1"><tr>';

        // Add headers
        const headers = Object.keys(data[0]);
        for (const header of headers) {
            html += `<th>${header}</th>`;
        }
        html += '</tr>';

        // Add rows
        for (const row of data) {
            html += '<tr>';
            for (const header of headers) {
                html += `<td>${row[header]}</td>`;
            }
            html += '</tr>';
        }

        html += '</table></body></html>';

        // Create a Blob from the HTML content
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });

        // Create a link element and trigger the download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('href', url);
        a.setAttribute('download', 'EEGInvoiceDetails.xlsx'); // Set the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setShowDownload(false)
        handleExportCancel()
        message.success('Invoice export downloaded successfully')
    };

    const downloadExcel = () => {
        const filteredData = data.map(({ credit_used, ...rest }) => rest);
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(filteredData, { cellStyles: true });
        const wscols = [
            { wch: 30 },
            { wch: 20 }, 
            { wch: 30 },
            { wch: 10 },
            { wch: 20 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 40 },
            { wch: 50 },
            { wch: 50 },
            { wch: 50 },
        ];
        worksheet['!cols'] = wscols;
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1', true);
        XLSX.writeFile(workbook, 'invoiceData.xlsx');
        handleExportCancel();
        setShowLoading(false);
        setAcc('0')
        setPaymentStatus('paid');
        setShowDownload(false);
        message.success('Invoice export downloaded successfully')
    };

    useEffect(()=>{
        if(invExport?.data?.length>0 && invExport?.data && showDownload){
            downloadExcel();
        }
    },[invExport]);

    const handleRangeTypeChange = (e) => {
        const value = e.target.value; 
        const now = dayjs();
        let start, end;
        switch (value) {
          case 'weekly':{
            start = now.startOf('week');
            end = now.endOf('week');
            break;
          }
          case 'monthly':{
            start = now.startOf('month');
            end = now.endOf('month');
            break;
          }
          case 'quarterly':{
            const month = now.month();
            if (month >= 0 && month <= 2) {
            start = now.startOf('year');
            end = now.startOf('year').add(2, 'month').endOf('month');
            } else if (month >= 3 && month <= 5) {
            start = now.startOf('year').add(3, 'month');
            end = now.startOf('year').add(5, 'month').endOf('month');
            } else if (month >= 6 && month <= 8) {
            start = now.startOf('year').add(6, 'month');
            end = now.startOf('year').add(8, 'month').endOf('month');
            } else {
            start = now.startOf('year').add(9, 'month');
            end = now.endOf('year');
            }
            break;
          }
          case 'yearly':{
            start = now.startOf('year');
            end = now.endOf('year');
            break;
          }
          default:{
            start = null;
            end = null;
          }
        }
    
        if (start && end) {
          setStartDate(start.toDate());
          setEndDate(end.toDate());
        }
        setRangeType(value);
    };

    const handleCustomRangeChange = (dates) => {
        setStartDate(dates[0].toDate());
        setEndDate(dates[1].toDate());
    };

    
    return(
        <div>
        <Modal
        title="Export Invoice Filter"
        open={exportModal}
        onCancel={handleExportCancel}
        width={500}
        height={'auto'}
        maskClosable={false}
        onOk={reportInvoice} 
        okText="Export"
        confirmLoading={loading7}
        cancelButtonProps={{
            style: { backgroundColor: '#ff4242', color: 'white' }
        }}
        >
            <div>
                <Form form={form} onFinish={reportInvoice} layout="vertical">
                    <Form.Item label="Select Date Range" className="w-100">
                        <Radio.Group
                            options={options}
                            onChange={handleRangeTypeChange}
                            value={rangeType}
                            optionType="button"
                            buttonStyle="solid"
                            className='mt-1'
                        />
                    </Form.Item>
                    {rangeType === 'custom' && (
                    <Form.Item label="Custom Date Range" className="w-100">
                        <RangePicker format="MM-DD-YYYY" disabledDate={disableDates} onChange={handleCustomRangeChange} />
                    </Form.Item>
                    )}
                    
                    <Form.Item
                        label="Select Account"
                        className="w-100"
                        name="account"
                        // span={24}
                    >
                        <Select
                            showSearch
                            getPopupContainer={(trigger) => trigger.parentNode}
                            placeholder=""
                            className="w-100"
                            optionFilterProp="children"
                            defaultValue={acc}
                            value={acc}
                            onChange={handleAccountChange}
                            filterOption={(input: any, option: any) => {
                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                            }}
                            notFoundContent={
                                <div className="text-center p-4">
                                    {loading4 ? (
                                        <span>
                                            <LoadingOutlined />
                                            Loading...
                                        </span>
                                    ) : (
                                        <span>No account available</span>
                                    )}
                                </div>
                            }
                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            options={accOptions}
                        />
                    </Form.Item>
                    <Form.Item
                        label="Payment Status"
                        className="w-100"
                        name="payment"
                        // span={24}
                    >
                        <Radio.Group defaultValue={paymentStatus} onChange={handlePayStatus}>
                            <Radio value="paid">Paid</Radio>
                            <Radio value="unpaid">Unpaid</Radio>
                        </Radio.Group>
                    </Form.Item>

                    {invExport?.data?.length==0 && showDownload ? (
                    <>
                        <div className="bg-aliceblue p-2 d-flex">
                            No Details available
                        {/* <div className="col text-dark fw-bold my-auto">EEG Invoice Details</div>
                        <div className="col text-dark fw-bold my-auto">xlsx</div>
                        <div className="col-auto ms-auto"></div>
                        <Button type="primary"  onClick={() => downloadExcel()}>
                            Download
                        </Button> */}
                        </div>
                    </>
                    ) : null}
                </Form>
            </div>
        </Modal>
        </div>
    )
}

export default ExportInvoice