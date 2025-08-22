import React, { useEffect, useState } from 'react';
import { useSelector } from 'components/shared/CompVariables';
import dayjs from 'dayjs';

interface ChildProps {
    zoom: any;
    data: any;
}

const InvoiceStatement: React.FC<ChildProps> = ({ data, zoom }) => {
    const [pages, setPages]: any = useState([]);
    const { invoicePageInfo } = useSelector((state: any) => state.invoice);
    const selectedTab = data?.selectedTab;
    const currentTime = new Date()
    const currentYear = currentTime.getFullYear()

    useEffect(() => {
        const generatePages = () => {
            const itemsPerPage = 10;
            const pageCount = Math.ceil(invoicePageInfo?.data?.req_Data?.length / itemsPerPage);
            const pagesArray: Array<any> = [];

            for (let i = 0; i < pageCount; i++) {
                const startIndex = i * itemsPerPage;
                const endIndex = (i + 1) * itemsPerPage;
                const pageData = invoicePageInfo?.data?.req_Data?.slice(startIndex, endIndex);
                pagesArray.push(pageData);
            }

            setPages(pagesArray);
        };
        generatePages();
    }, [invoicePageInfo]);

    const formatName = (name) => {
        const nameParts = name.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts[nameParts.length - 1];
        const formattedFirstName = firstName.substring(0, 2).toLowerCase();
        const formattedLastName = lastName.substring(0, 2).toLowerCase();
        // Capitalize the first letter of the formatted parts
        const capitalizedFirstName = formattedFirstName.charAt(0).toUpperCase() + formattedFirstName.slice(1);
        const capitalizedLastName = formattedLastName.charAt(0).toUpperCase() + formattedLastName.slice(1);
        return `${capitalizedFirstName}${capitalizedLastName}`;
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

    return (
        <>
            {pages?.map((pageData, index) => (
                <React.Fragment key={`page${index + 2}`}>
                    <div id={`page${index + 2}`} className="page-one bg-white p-3 mx-auto mt-2" style={{ zoom: zoom, display: selectedTab == 'b' ? 'block' : 'none' }}>
                        <h6 className="pb-2" style={{ borderBottom: '3px solid #5f4ce1' }}>
                            INVOICE STATEMENT
                        </h6>
                        <div className="d-flex mb-2">
                            <div>
                                <span className="fw-bold">ACCOUNT NAME: </span>
                                <span className="ps-1">{invoicePageInfo?.data?.account_info?.account_name}</span>
                            </div>
                            <div className="ms-auto">
                                <span className="fw-bold">INVOICE NUMBER: </span>
                                <span className="ps-1">{invoicePageInfo?.data?.invoicedata?.invoice_number}</span>
                            </div>
                        </div>
                        <table className="invoiceTable" style={{ borderCollapse: 'collapse', width: '100%' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#d4d4d8', border: '1px solid lightgray', color: '#000' }}>
                                    <th
                                        style={{
                                            padding: '5px',
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
                                            padding: '5px',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                            fontFamily: "'Lato',sans-serif",
                                            fontWeight: 'bold',
                                            borderRight: '1px solid lightgray',
                                        }}
                                    >
                                        Request Number
                                    </th>
                                    <th
                                        style={{
                                            padding: '5px',
                                            fontSize: '14px',
                                            textAlign: 'left',
                                            fontFamily: "'Lato',sans-serif",
                                            fontWeight: 'bold',
                                            borderRight: '1px solid lightgray',
                                        }}
                                    >
                                        Patient Name
                                    </th>
                                    <th
                                        style={{
                                            padding: '5px',
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
                                            padding: '5px',
                                            fontSize: '14px',
                                            textAlign: 'center',
                                            fontFamily: "'Lato',sans-serif",
                                            fontWeight: 'bold',
                                            borderRight: '1px solid lightgray',
                                        }}
                                    >
                                        Service date
                                    </th>
                                    <th
                                        style={{
                                            padding: '5px',
                                            fontSize: '14px',
                                            textAlign: 'center',
                                            fontFamily: "'Lato',sans-serif",
                                            fontWeight: 'bold',
                                            borderRight: '1px solid lightgray',
                                        }}
                                    >
                                        Amount
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageData?.map((item, i) => (
                                    <tr key={i} style={{ borderBottom: '1px solid lightgray', fontFamily: "'Lato',sans-serif" }}>
                                        <td
                                            style={{
                                                width: '5%',
                                                fontSize: '14px',
                                                padding: '5px',
                                                textAlign: 'center',
                                                fontFamily: "'Lato',sans-serif",
                                                fontWeight: 300,
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                                borderLeft: '1px solid lightgray',
                                            }}
                                        >
                                            {i + 1 + index * 10}
                                        </td>
                                        <td
                                            style={{
                                                width: '12%',
                                                fontSize: '14px',
                                                padding: '5px',
                                                textAlign: 'start',
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                            }}
                                        >
                                            {item.encoded_RequestNumber}
                                        </td>
                                        <td
                                            style={{
                                                width: '17%',
                                                fontSize: '14px',
                                                padding: '5px',
                                                textAlign: 'start',
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                                // textTransform: 'capitalize',
                                            }}
                                        >
                                            {formatName(item.patient_name)}
                                        </td>
                                        <td
                                            style={{
                                                width: '35%',
                                                fontSize: '14px',
                                                padding: '5px',
                                                textAlign: 'start',
                                                fontFamily: "'Lato',sans-serif",
                                                fontWeight: 300,
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                            }}
                                        >
                                            {formatReportItems(item?.request_reports)}
                                        </td>
                                        <td
                                            style={{
                                                width: '12%',
                                                fontSize: '14px',
                                                padding: '5px',
                                                textAlign: 'center',
                                                fontFamily: "'Lato',sans-serif",
                                                fontWeight: 300,
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                            }}
                                        >
                                            {item?.created_on ? dayjs(new Date(item.created_on))?.format('MM-DD-YYYY') : ''}
                                        </td>
                                        <td
                                            style={{
                                                width: '12%',
                                                fontSize: '14px',
                                                padding: '5px 15px',
                                                textAlign: 'end',
                                                fontFamily: "'Lato',sans-serif",
                                                fontWeight: 300,
                                                verticalAlign: 'top',
                                                borderRight: '1px solid lightgray',
                                            }}
                                        >
                                            {parseFloat(item?.request_amount || 0)?.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="footer" style={{ position: 'absolute', bottom: 0, width: '100%', padding: '10px' }}>
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
                </React.Fragment>
            ))}
        </>
    );
};

export default InvoiceStatement;
