import React, {useState, useEffect} from 'react';
import * as XLSX from 'xlsx';
import { Modal } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { DatePicker, Form } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { message,} from 'components/shared/AntComponent';
import { exportRequest } from 'services/actions/pipeline/pipelineAction';
import dayjs from 'dayjs';


interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
}
interface RequestData {
    'Request Number': string;
    'Request Type': string;
    'Patient Name': string;
    'Account Name': string;
    'D.O.B': string;
    'Gender': string;
    'Request Created': string;
    'Request Status': string;
}
const { RangePicker } = DatePicker;

const ExportRequestModal: React.FC<ChildProps> = ({ openModal, closeModal }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { exportReqInfo, loading4 } = useSelector((state: any) => state.pipeline);
    const data: RequestData[] = !loading4 ? exportReqInfo?.data : [];
    const [showDownload,setShowDownload]= useState(false);
    
    const exportRequestDetails = async () => {
        const value = form.getFieldsValue();
        try {
            await form.validateFields();
            const inputJson = {
                list: 'all',
                start_on: dayjs(value.dateRange[0]).format('YYYY-MM-DD') || '2024-08-05',
                end_on: dayjs(value.dateRange[1]).format('YYYY-MM-DD') || '2024-09-30',
            };
            dispatch(exportRequest(inputJson) as any);
            setShowDownload(true);
            
        } catch (error: any) {
            console.log('Failed', error);
        }
    };

    const disableDates = (current: dayjs.Dayjs) => {
        return current >= dayjs().endOf('day'); // Disable today and future dates
    };

    useEffect(()=>{
        if(exportReqInfo?.data?.length>0 && exportReqInfo?.data && showDownload){
            downloadExcel();
        }
    },[exportReqInfo]);

    const downloadExcel = () => {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportReqInfo?.data, { cellStyles: true });
        const wscols = [
            { wch: 10 },
            { wch: 20 }, // "characters"
            { wch: 10 },
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
        XLSX.writeFile(workbook, 'EEGRequestDetails.xlsx');
        setShowDownload(false);
        closeModal();
        message.success('Request export downloaded successfully')
    };

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
        a.setAttribute('download', 'EEGRequestDetails.xlsx'); // Set the desired file name
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        // Create CSV content
        // const csvRows: string[] = [];

        // // Get the headers
        // const headers = Object.keys(data[0]);
        // csvRows.push(headers.join(',')); // Push the headers as the first row

        // // Loop through the data and add each row to the CSV
        // for (const row of data) {
        //     const values: string[] = headers.map((header) => {
        //         const escaped = ('' + row[header]).replace(/"/g, '""'); // Escape double quotes
        //         return `"${escaped}"`; // Wrap each value in double quotes
        //     });
        //     csvRows.push(values.join(',')); // Push the joined values as a new row
        // }

        // // Create a Blob from the CSV content
        // const csvString = csvRows.join('\n');
        // const blob = new Blob([csvString], { type: 'text/csv' });

        // // Create a link element and trigger the download
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.setAttribute('href', url);
        // a.setAttribute('download', 'EEGRequestDetails.csv'); // Set the desired file name
        // document.body.appendChild(a);
        // a.click();
        // document.body.removeChild(a);
    };

    return (
        <div>
            <Modal title="Export Request" open={openModal} onOk={exportRequestDetails} onCancel={closeModal} okText="Submit" 
            confirmLoading={loading4}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}>
                <Form form={form} layout="vertical" className='export-form'>
                    <Form.Item label="Select Date Range" name="dateRange">
                        <RangePicker disabledDate={disableDates} format="MM-DD-YYYY" />
                    </Form.Item>
                </Form>

                {exportReqInfo?.data?.length==0 && showDownload ? (
                    <>
                        <div className="bg-aliceblue p-2 d-flex">
                            No Details available
                        </div>
                </>
                ) : null}
                {/* {data?.length > 0 ? (
                    <div className="bg-aliceblue p-2 d-flex">
                        <div className="col text-dark fw-bold my-auto">EEG Request Details</div>
                        <div className="col text-dark fw-bold my-auto">xlsx</div>
                        <div className="col-auto ms-auto"></div>
                        <Button type="primary" onClick={downloadExcel}>
                            Download
                        </Button>
                    </div>
                ) : (
                    ''
                )} */}
            </Modal>
        </div>
    );
};

export default ExportRequestModal;
