import React, { useState, useEffect } from 'react';
import {  url2 } from 'components/shared/CompVariables';
import { Table, TableProps, Tooltip, Empty } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { useSelector, useDispatch } from 'react-redux';
import { getInvoiceData } from 'services/actions/invoiceAction';
import dayjs from 'dayjs';
import SearchIcon from 'assets/img/search.svg';
import { FileTextOutlined } from '@ant-design/icons';
import ViewInvoice from '../modal/ViewInvoice';
import { LoadingOutlined } from 'components/shared/AntIcons';

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
}

type ExpandableCommentProps = {
    text: string;
    maxLength: number;
};

const ClosedInvoice: React.FC<ChildProps> = ({ tabKey }) => {
    const dispatch = useDispatch();
    const { invoiceInfo, loading2 } = useSelector((state: any) => state.invoice);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const data = loading2 ? [] : invoiceInfo?.data || [];
    const [invoiceUrl, setInvoiceUrl] = useState('');
    const [statementUrl, setStatementUrl] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [searchTableVal, setsearchTableval] = useState('');
    const totalPage = !loading2 ? invoiceInfo?.DataFinder?.totalrecords : 0;
    const [sortField, setSortField] = useState('asc');
    const [sortOrder, setSortOrder] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [acc, setAcc] = useState('0');
    const [accOptions, setAccOptions]: any = useState([]);
    const [invoiceDetails, setInvoiceDetails]:any = useState('')
    const userRole = sessionStorage.getItem('role');
    const accountId = Number(sessionStorage.getItem('accountid'));
    
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Invoices Available" />,
    };

    const ExpandableComment: React.FC<ExpandableCommentProps> = ({ text, maxLength }) => {
        const [expanded, setExpanded] = useState(false);
        const shouldShowExpandButton = text && text.length > maxLength;
    
        const handleClick = () => {
            setExpanded(!expanded);
        };
    
        return (
            <span>
                {shouldShowExpandButton ? (
                    <a
                        onClick={handleClick}
                        className=""
                        style={{ marginLeft: '5px', cursor: 'pointer' }}
                    >
                        <Tooltip
                            title={
                                expanded
                                    ? 'Click here to collapse comment'
                                    : 'Click here to expand comment'
                            }
                        >
                           <span className='ps-2'>{expanded ? text : text.slice(0, maxLength) + '...'}</span> 
                        </Tooltip>
                    </a>
                ) : (
                    <span className="ps-2">{text ? text : '-'}</span>
                )}
            </span>
        );
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
    
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Invoice No',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 220,
            sorter: (a: any, b: any) => a?.invoice_number.length - b?.invoice_number.length,
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
            className:'req-nos',
            render: (request_number) => {
                return request_number && <div className="text-center">{request_number?.length}</div>;
            },
        },
        {
            title: 'Start Period',
            dataIndex: 'start_period',
            key: 'start_period',
            className:'date-width',
            render: (start_period: any) => {
                return dayjs(start_period)?.format('MM-DD-YYYY');
            },
        },
        {
            title: 'End Period',
            dataIndex: 'end_period',
            key: 'end_period',
            className:'date-width',
            render: (end_period: any) => {
                const utcDate = new Date(end_period);
                const localDate = new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60000);
                return dayjs(localDate)?.format('MM-DD-YYYY');
            },
        },
        {
            title: 'Payment Mode',
            dataIndex: 'payment_method',
            key: 'payment_method',
            align: 'center',
            width:150
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
            title: 'Comment',
            dataIndex: 'message',
            key: 'message',
            render: (text) => <ExpandableComment text={text} maxLength={50} />,
            width: 300,
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
                        <Button className="success-btn text-center mx-auto px-2 fw-bold">Paid</Button>
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
                        <div className="text-center pt-0 pb-1">
                            <Tooltip title="Preview Invoice" className="mt-0">
                                <span
                                    className="text-warning pointer pb-1"
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

    function getInvoiceDetails(acc, page, size, search, field, order) {
        const inputJson = {
            account_id: userRole == 'staff' ? accountId : Number(acc) || 0,
            start_period: "",
            end_period: "",
            amount_start: "",
            amount_end: "",
            approve_status: "approved",
            payment_status: "paid",
            status: "all",
            DataFinder:{pagesize:size||10,
                          currentpage:page||1,
                          sortby:order||"asc",
                          searchdata:search||""}
        };
        dispatch(getInvoiceData(inputJson) as any);
    }

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
    
    useEffect(() => {
        if (tabKey == '4') {
            getInvoiceDetails('0', 1, pageSize, '', sortField, sortOrder);
        }
    }, [dispatch, tabKey]);

    return (
        <div className="p-3">
            <div className="d-flex justify-content-between grid-title-card">
                <h6 className="my-auto fs-16">List of Closed Invoice</h6>
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
                    scroll={{ x: 'calc(230px + 50%)'}}
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
            <ViewInvoice openModal={openModal} closeModal={closeModal} invoiceUrl={invoiceUrl} statementUrl={statementUrl} detail={invoiceDetails}/>
        </div>
    );
};

export default ClosedInvoice;
