import React, { useState, useEffect } from 'react';
import { url2 } from 'components/shared/CompVariables';
import { Table, TableProps, Tooltip, Empty, Modal, Spin, Skeleton, Popconfirm, message } from 'components/shared/AntComponent';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { useSelector, useDispatch } from 'react-redux';
import dayjs from 'dayjs';
import SearchIcon from 'assets/img/search.svg';
import { PayIcon, ResetIcon } from 'assets/img/custom-icons';
import { FileTextOutlined } from '@ant-design/icons';
import ViewInvoice from '../modal/ViewInvoice';
import PaymentInfoModal from '../modal/PaymentInfoModal';
import { getInvoiceData, getTransactionDetails, invoiceReassessment } from 'services/actions/invoiceAction';
import { WarningTwoTone } from 'components/shared/AntIcons';
import { NavigateOptions, useNavigate } from 'react-router-dom';

interface DataType {
    key: any;
    sno: number;
    id: any;
    encoded_accountNumber: any;
    name: any;
    account_name: any;
    gender: any;
    contact_address: any;
    contact_phone: any;
    action: any;
    payment_status: any;
}

interface ChildProps {
    tabKey: any;
    updateStat: any;
}

const OpenInvoice: React.FC<ChildProps> = ({ tabKey, updateStat }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoiceInfo, loading2, transInfo, loading13, loading14, success14, error14 } = useSelector((state: any) => state.invoice);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const data = loading2 ? [] : invoiceInfo?.data || [];
    const [invoiceUrl, setInvoiceUrl] = useState('');
    const [statementUrl, setStatementUrl] = useState('');
    const [openPayment, setOpenPayment] = useState(false);
    const [detail, setDetail] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [acc, setAcc] = useState('0');
    const [sortField, setSortField] = useState('asc');
    const [sortOrder, setSortOrder] = useState('');
    const [accOptions, setAccOptions]: any = useState([]);
    const [searchTableVal, setsearchTableval] = useState('');
    const totalPage = !loading2 ? invoiceInfo?.DataFinder?.totalrecords : 0;
    const [invoiceDetails, setInvoiceDetails]: any = useState('')
    const userRole = sessionStorage.getItem('role');
    const [invoiceDetail, setInvoiceDetail]: any = useState(null);
    const [openTransaction, setOpenTransaction] = useState(false);
    const accountId = Number(sessionStorage.getItem('accountid'));
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success14 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error14 : false;

    const customLocale = {
        emptyText: <Empty className="p-2" description="No Invoices Available" />,
    };

    useEffect(() => {
        if (allAccountInfo?.data) {
            const arr: { label: string; value: string }[] = [];
            arr.push({ label: 'All', value: '0' });
            for (let i = 0; i < allAccountInfo?.data?.length; i++) {
                arr.push({
                    label: allAccountInfo?.data[i]?.account_name,
                    value: allAccountInfo?.data[i]?.id.toString(),
                });
            }
            setAccOptions(arr);
        }
    }, [allAccountInfo?.data]);

    const showModal = (file: any, val: any) => {
        setInvoiceDetails(val)
        setOpenModal(true);
        setInvoiceUrl(file);
        setStatementUrl(val?.invoicestatement_filepath);
    };

    const closeModal = () => {
        setOpenModal(false);
        setInvoiceUrl('');
        setStatementUrl('');
    };

    const showPaymentModal = (val: any) => {
        setOpenPayment(true);
        setDetail(val);
    };

    const handleOpenTrans = (id, val) => {
        setOpenTransaction(true);
        // setInvID(id);
        setInvoiceDetail(val);
        getTransaction(id);

    }
    const handleCloseTrans = () => {
        // setInvID(0);
        setOpenTransaction(false);
    }
    function getTransaction(id: number) {
        dispatch(getTransactionDetails(id) as any);
    }

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Invoice No',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 250,
            sorter: (a: any, b: any) => a?.invoice_number.length - b?.invoice_number.length,
            render: (_, record: any) => {
                return (
                    <div>{userRole === 'staff' ? <div>
                        {record.invoice_number} {record.billing_transaction_flag ? <Tooltip title="Transaction details" className="mt-0"><span
                            className="file-ico"
                            onClick={() => {
                                handleOpenTrans(record?.id, record);
                            }}
                        >
                            <WarningTwoTone className="text-warning ms-2 fs-16" twoToneColor="#ff9966" />
                        </span></Tooltip> : ""}
                    </div> : record.invoice_number}</div>
                )
            },
            // filteredValue: [searchedText],
            // onFilter: (value, record) => record.invoice_number.toLowerCase().includes(value.toLowerCase()),
        },
        ...(userRole !== 'staff'
            ? [{
                title: 'Account Name',
                dataIndex: 'account_name',
                key: 'account_name',
            }] : []),

        {
            title: 'No. of Requests',
            dataIndex: 'request_number',
            key: 'request_number',
            align: 'center',
            render: (request_number) => {
                return request_number && <div className="text-center">{request_number?.length}</div>;
            },
        },
        {
            title: 'Start Period',
            dataIndex: 'start_period',
            key: 'start_period',
            render: (start_period: any) => {
                return dayjs(start_period)?.format('MM-DD-YYYY');
            },
        },
        {
            title: 'End Period',
            dataIndex: 'end_period',
            key: 'end_period',
            render: (end_period: any) => {
                const utcDate = new Date(end_period);
                const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
                return dayjs(localDate)?.format('MM-DD-YYYY');
            },
        },
        {
            title: 'Amount ($)',
            dataIndex: 'inv_amount',
            key: 'inv_amount',
            align: 'end',
            width: 150,
            render: (_: any, record: any) => {
                const invoiceAmount = record?.invoice_discount_percentage_flag ? record?.invoiceprice : record?.inv_amount;
                return parseFloat(invoiceAmount || 0).toFixed(2);
            },
        },
        {
            title: 'Status',
            dataIndex: 'payment_status',
            key: 'payment_status',
            align: 'center',
            width: 250,
            render: (_: any, record: any) => {
                return (
                    <div>
                        {record?.payment_status?.toLowerCase() == 'unpaid' ? (
                            <Button className="warning-btn text-center fw-bold mx-auto px-4">{record?.payment_status.charAt(0).toUpperCase() + record?.payment_status.slice(1)}</Button>
                        )
                            : record?.payment_status?.toLowerCase() === 'pending' || record?.payment_status?.toLowerCase() === 'processing' || record?.payment_status?.toLowerCase() === 'processed' ? (
                                <Button className="primary-btn text-center fw-bold mx-auto px-4">Processing</Button>
                            )
                                : record?.payment_status?.toLowerCase() === 'succeeded' ? (
                                    <Button className="success-btn text-center fw-bold mx-auto px-4">Success</Button>
                                )
                                    : record?.payment_status?.toLowerCase() === 'aged' ? (
                                        <Button className="danger-btn text-center fw-bold mx-auto px-4 ">Aged</Button>
                                    )
                                        : (
                                            <Button className="primary-btn text-center fw-bold mx-auto px-4 ">{record?.payment_status}</Button>
                                        )}
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            align: 'center',
            render: (id: any, record: any) => {
                return (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div className="text-center"></div>
                        {
                            userRole !== 'staff' && 
                            <Tooltip title="Invoice Reassessment" className="mt-0">
                                <Popconfirm placement="topLeft" title="Do you want to move this invoice for review?" onConfirm={() => handleReassessment(record)} okText="Ok" cancelText="Cancel">
                                    <div className='fs-19 pointer ps-1 text-danger'>
                                        <ResetIcon />
                                    </div>
                                </Popconfirm>
                            </Tooltip>
                        }
                        <div className="text-center mx-2">
                            <Tooltip title="Pay" className="mt-0 pointer">
                                <span
                                    className="pay-icon fs-12"
                                    onClick={() => {
                                        showPaymentModal(record);
                                    }}
                                >
                                    <PayIcon />
                                </span>
                            </Tooltip>
                        </div>
                       
                        {/* <Tooltip title="Review Invoice" className="mt-0">
                                                    <Button type="primary" onClick={() => showDetail(record)}>
                                                        Review
                                                    </Button>
                                                </Tooltip> */}
                        <div className="text-center pt-0 pb-1">
                            <Tooltip title="Preview Invoice" className="mt-0 pointer">
                                <span
                                    className="text-warn pointer pb-1"
                                    onClick={() => {
                                        showModal(record?.invoice_url, record);
                                    }}
                                >
                                    <FileTextOutlined size={10} />
                                </span>
                            </Tooltip>
                        </div>
                       
                    </div>
                );
            },
        },
    ];

    const handleReassessment = (record: any) => {
        const inputJson = {
            "invoice_id": record.id,
            "account_id": record.accountid,
            "approve_status": "pending"
        }
        dispatch(invoiceReassessment(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    }

    useEffect(() => {
        if (successmsg) {
            message.success("This invoice has been moved for review successfully");
            setShowSuccessmsg(false);
            getInvoiceDetails('0', 1, pageSize, '', '', '');
            setAcc('0');
            setPageIndex(1);
            setsearchTableval('');
        }
        if (errormsg) {
            message.error("This invoice couldn't able to move for review");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const showDetail = (val: any) => {
        navigate('/invoice-manager/invoice', {
            state: {
                accId: val?.accountid,
                accData: val,
                invoiceId: val?.id,
            },
        } as NavigateOptions);
    };
    function getInvoiceDetails(acc, page, size, search, field, order) {
        const inputJson = {
            account_id: userRole == 'staff' ? accountId : Number(acc) || 0,
            start_period: '',
            end_period: '',
            amount_start: '',
            amount_end: '',
            approve_status: 'approved',
            payment_status: 'unpaid',
            status: 'all',
            DataFinder: {
                pagesize: size || 10,
                currentpage: page || 1,
                sortby: order || 'asc',
                searchdata: search || '',
            },
        };
        dispatch(getInvoiceData(inputJson) as any);
    }

    const closePaymentModal = () => {
        setOpenPayment(false);
        setDetail(null);
    };

    const handleOfflinePaymentUpdate = () => {
        getInvoiceDetails('0', 1, pageSize, '', sortField, sortOrder);
        setAcc('0');
        setPageIndex(1);
        setsearchTableval('');
    }

    useEffect(() => {
        if (tabKey == '3') {
            getInvoiceDetails('0', 1, pageSize, '', sortField, sortOrder);
            setAcc('0');
            setPageIndex(1);
            setsearchTableval('');
        }
    }, [dispatch, tabKey]);

    const handleAccountChange = (e) => {
        setAcc(e);
        setPageIndex(1);
        getInvoiceDetails(e, 1, pageSize, searchTableVal, sortField, sortOrder);
    };

    const handleSearchChange = (e) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getInvoiceDetails(acc, 1, pageSize, e.target.value, sortField, sortOrder);
        }
    };
    const resetSearch = (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getInvoiceDetails(acc, 1, pageSize, e.target.value, sortField, sortOrder);
        }
    };
    const tableChange = (pagination, ...sorted) => {
        let sort = '';
        if (sorted[1].order === 'ascend') {
            sort = 'asc';
        } else if (sorted[1].order === 'descend') {
            sort = 'desc';
        } else sort = '';
        setSortField(sorted[1].field);
        setSortOrder(sort);
        setPageIndex(pagination.current);
        getInvoiceDetails(acc, pagination.current, pageSize, searchTableVal, sorted[1].field, sort);
    };

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between grid-title-card">
                <h6 className="my-auto fs-16">List of Open Invoice</h6>
                <div className=" col-md-3 d-flex flex-row right-side  ps-0 mx-0">
                    {userRole == 'admin' && (
                        <div className="col-6 pe-2 select">
                            <Select
                                showSearch
                                getPopupContainer={(trigger) => trigger.parentNode}
                                placeholder=""
                                className="w-100 "
                                optionFilterProp="children"
                                defaultValue={acc}
                                value={acc}
                                onChange={handleAccountChange}
                                filterOption={(input, option: any) => {
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
                                            <span>No account found</span>
                                        )}
                                    </div>
                                }
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                options={accOptions}
                            />
                        </div>
                    )}
                    <div className="col-md pe-0">
                        <Input
                            prefix={<img src={SearchIcon} height="14px" />}
                            value={searchTableVal}
                            defaultValue={searchTableVal}
                            onChange={(e) => setsearchTableval(e.target.value)}
                            onKeyUp={(e) => resetSearch(e)}
                            onKeyDown={(e) => handleSearchChange(e)}
                            className="search-input me-2 col px-2 rounded fs-14"
                            placeholder="Search by Invoice number"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-2 border rounded">
                <Table
                    className="pointer"
                    columns={columns}
                    dataSource={data}
                    loading={loading2}
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    rowKey="id"
                    rowClassName={(record: any) => (record?.payment_status.toLowerCase() === 'aged' ? 'highlight-row' : '')}
                    onChange={tableChange}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalPage,
                        onChange: (page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                        },
                        showSizeChanger: false
                    }}
                />
            </div>
            <ViewInvoice openModal={openModal} closeModal={closeModal} invoiceUrl={invoiceUrl} statementUrl={statementUrl} detail={invoiceDetails} />
            <PaymentInfoModal openModal={openPayment} closeModal={closePaymentModal} detail={detail} updateStat={updateStat} callback={handleOfflinePaymentUpdate} />
            <Modal width={700} title="Transaction Details" open={openTransaction} onCancel={handleCloseTrans} okButtonProps={{
                style: { display: 'none' }
            }}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <div className="stripe-details bg-aliceblue p-3 rounded mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                        <div>
                            <h6 className="mb-1 fw-bold txt-primary">Invoice #</h6>
                            <span className="text-secondary fw-bold mb-0">{invoiceDetail?.invoice_number || "--"}</span>
                        </div>
                        <div>
                            <h6 className="mb-1 fw-bold txt-primary">Account #</h6>
                            <span className="text-secondary fw-bold mb-0">{invoiceDetail?.encoded_accountNumber || "--"}</span>
                        </div>
                        <div>
                            <h6 className="mb-1 fw-bold txt-primary">Account Name</h6>
                            <span className="text-secondary fw-bold mb-0">{invoiceDetail?.account_name || "--"}</span>
                        </div>
                    </div>
                </div>
                <div className=''>
                    {loading13 ? <Spin spinning={loading13}>
                        <Skeleton />
                    </Spin> : <div>{transInfo?.data?.length > 0 ? <div>
                        <table className='table-bordered w-100 border-light'>
                            <thead>
                                <tr>
                                    <th className='p-2 border bg-light'>Payment Detail</th>
                                    <th className='p-2 border bg-light text-center'>Paid On</th>
                                    <th className='p-2 border bg-light text-center'>Amount($)</th>
                                    <th className='p-2 border bg-light text-center'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transInfo?.data?.map((item, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className='p-2 text-start border'>{item?.payment_method}</td>
                                            <td className='p-2 border text-center'>{item?.paid_on ? dayjs(item?.paid_on)?.format('MM-DD-YYYY') : '-'}</td>
                                            <td className='p-2 text-end border'>{typeof item?.payment_amount === 'number' ? item?.payment_amount.toFixed(2) : item?.payment_amount}</td>

                                            <td className='p-2 text-center border '><Button className={`${item.payment_status === 'incomplete' ? 'danger-btn text-danger' : 'success-btn text-success'}`}>
                                                {item?.payment_status
                                                    ? item?.payment_status.charAt(0).toUpperCase() + item?.payment_status.slice(1)
                                                    : ""}
                                            </Button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div> : <div className='p-3 border bg-light text-center'>
                        <p className='mb-0'>No Transactions available</p></div>}</div>}
                </div>
            </Modal>
        </div>
    );
};

export default OpenInvoice;
