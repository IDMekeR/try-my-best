import React, { useEffect, useState } from 'react';
import { Table, TableProps, Tooltip, Empty } from 'components/shared/AntComponent';
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useSelector, useDispatch } from 'react-redux';
import { getInvoiceData } from 'services/actions/invoiceAction';
import SearchIcon from 'assets/img/search.svg';
import dayjs from 'dayjs';
import { useNavigate, NavigateOptions } from 'react-router-dom';

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
}

interface ChildProps {
    tabKey: any;
}

const ReviewInvoice: React.FC<ChildProps> = ({ tabKey }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoiceInfo, loading2 } = useSelector((state: any) => state.invoice);
    const userRole=sessionStorage.getItem('role');
    const data = loading2 ? [] : invoiceInfo?.data || [];
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [acc, setAcc] = useState(0);
    const [sortField, setSortField] = useState('asc');
    const [sortOrder, setSortOrder] = useState('');
    const [searchedText, setSearchedText] = useState('');
    const totalPage = !loading2 ? invoiceInfo?.DataFinder?.totalrecords : 0;
    const accountId = sessionStorage.getItem('accountid');

    const customLocale = {
        emptyText: <Empty className="p-2" description="No Invoices Available" />, 
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Invoice No',
            dataIndex: 'invoice_number',
            key: 'invoice_number',
            width: 200,
            sorter: (a: any, b: any) => a?.invoice_number?.length - b?.invoice_number?.length,
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: 'Created On',
            dataIndex: 'created_on',
            key: 'created_on',
            align: 'center',
            render: (created_on: any) => {
                const originalDate = new Date(created_on);
                return invoiceInfo?.data ? originalDate?.toLocaleDateString() : '--';
            },
        },
        {
            title: 'No. of Request',
            dataIndex: 'request_number',
            key: 'request_number',
            align: 'center',
            render: (request_number: any) => {
                return <div className="text-center">{(request_number && request_number?.length) || 0}</div>;
            },
        },
        {
            title: 'Start Period',
            dataIndex: 'start_period',
            key: 'start_period',
            render: (start_period: any) => {
                const originalDate = new Date(start_period);
                return invoiceInfo?.data ? originalDate?.toLocaleDateString() : '--';
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
            key: 'amt',
            align: 'center',
            width: 130,
            render: (_: any, record: any) => {
                if (record?.invoice_discount == '') {
                    return parseFloat(record?.inv_amount || 0).toFixed(2);
                    
                } else {
                    return parseFloat(record?.invoiceprice || 0).toFixed(2);
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div
                        className="d-flex justify-content-center p-2 text-center"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <Tooltip title="Review Invoice" className="mt-0">
                            <Button type="primary" onClick={() => showDetail(record)}>
                                Review
                            </Button>
                        </Tooltip>
                    </div>
                );
            },
        },
    ];

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
            approve_status: 'pending',
            payment_status: 'unpaid',
            status: 'all',
            DataFinder: { pagesize: size || 10, currentpage: page || 1, sortby: order || 'asc', searchdata: search || '' },
        };
        dispatch(getInvoiceData(inputJson) as any);
    }

    useEffect(() => {
        if (tabKey == '2') {
            setPageIndex(1);
            setAcc(0);
            setSearchedText('');
            setsearchTableval('')
            getInvoiceDetails('0', 1, pageSize, '', sortField, sortOrder);
        }
    }, [dispatch, tabKey]);

    const handleSearchChange = (e) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value)
            setSearchedText(e?.target?.value);
            setPageIndex(1);
            getInvoiceDetails(acc, 1, pageSize, e?.target?.value, sortField, sortOrder);
        }
    };

    const resetSearch = (e) => {
        if (e.key === 'Backspace' && !e?.target?.value) {
            setsearchTableval(e.target.value)
            setSearchedText('');
            setPageIndex(1);
            getInvoiceDetails(acc, 1, pageSize, e?.target?.value, sortField, sortOrder);
        }
    };

    const tableChange = (pagination, ...sorted) => {
        let sort = '';
        if (sorted[1]?.order === 'ascend') {
            sort = 'asc';
        } else if (sorted[1]?.order === 'descend') {
            sort = 'desc';
        } else sort = '';
        setSortField(sorted[1]?.field);
        setSortOrder(sort);
        setPageIndex(pagination?.current);
        getInvoiceDetails(acc, pagination.current, pageSize, searchedText, sorted[1]?.field, sort);
    };

    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto fs-16">List of Invoice review</h6>
                <div className="col-md-2 ms-auto">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyDown={(e) => handleSearchChange(e)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search by Invoice number"
                    />
                </div>
            </div>
            <div className="mt-2 border rounded">
                <Table 
                    className="pointer"
                    rowKey="id"
                    columns={columns} 
                    dataSource={data} 
                    loading={loading2} 
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)'}}
                    onChange={tableChange}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                showDetail(record)
                            },
                        };
                    }}
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
        </div>
    );
};

export default ReviewInvoice;
