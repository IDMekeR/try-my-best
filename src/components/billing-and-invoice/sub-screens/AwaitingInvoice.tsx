import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAwaitingInvoice } from 'services/actions/invoiceAction';
import { Table, Tooltip, Empty } from 'components/shared/AntComponent';
import { Input } from 'components/shared/FormComponent';
import { EyeIcon } from 'assets/img/custom-icons';
import SearchIcon from 'assets/img/search.svg';
import { TableProps } from 'antd';
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

const AwaitingInvoice: React.FC<ChildProps> = ({ tabKey }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole=sessionStorage.getItem('role');
    const { awaitingInfo, loading1 } = useSelector((state: any) => state.invoice);
    const data = loading1 ? [] : awaitingInfo?.data || [];
    const [searchTableVal, setsearchTableval] = useState('');
    
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Invoices Available" />, 
    };

    function getAwaitingList() {
        dispatch(getAwaitingInvoice() as any);
    }

    useEffect(() => {
        if (tabKey == '1') {
            getAwaitingList();
        }
    }, [dispatch, tabKey]);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Account Number',
            dataIndex: 'encoded_accountNumber',
            key: 'encoded_accountNumber',
        },
        ...(userRole !== 'staff'
            ? [{
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record?.account_name?.toLowerCase()?.includes(value?.toLowerCase() || ""),
            sorter: (a: any, b: any) => a.account_name.length - b.account_name.length,
        }]:[]),

        {
            title: 'Request Details',
            dataIndex: 'request_list',
            key: 'req_list',
            width: 500,
            render: (request_list: any) => {
                const joinedString = request_list?.map((item: any) => item.encoded_RequestNumber).join(', ');
                return <div className="text-start text-wrap text-break">{joinedString}</div>;
            },
        },
        {
            title: 'No. of Requests',
            dataIndex: 'request_list',
            key: 'req_list',
            align: 'center',
            render: (request_list: any) => {
                return <div className="text-center">{request_list?.length}</div>;
            },
        },
        {
            title: 'Billable Credits Incurred',
            dataIndex: 'request_list',
            key: 'credit_used',
            align: 'center',
            render: (request_list: any) => {
                let totalCredits = 0;
                request_list?.forEach((itm: any) => {
                    totalCredits += Number(itm.usage_credits);
                });
                return (
                    <div className="text-center">
                        <span>{totalCredits}</span>
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            key: 'Action',
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div
                        className="d-flex justify-content-center"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div className="text-center">
                            <Tooltip title="View Details" className="mt-0">
                                <span
                                    className="icon-eye"
                                    onClick={() => {
                                        navigateScreen(record);
                                    }}
                                >
                                    <EyeIcon />
                                </span>
                            </Tooltip>
                        </div>
                    </div>
                );
            },
        },
    ];

    const navigateScreen = (val: any) => {
        navigate('/invoice-manager/generate-invoice', { state: { data: val } } as NavigateOptions);
    };

    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto fs-16">List of Awaiting for Invoice</h6>
                <div className="col-md-2 ms-auto">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search by Account name"
                    />
                </div>
            </div>
            <div className="mt-2 border rounded">
                <Table
                    className="pointer"
                    columns={columns}
                    rowKey="id"
                    dataSource={data}
                    loading={loading1}
                    scroll={{ x: 'calc(230px + 50%)'}}
                    locale={customLocale}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                navigateScreen(record);
                            },
                        };
                    }}
                />
            </div>
        </div>
    );
};

export default AwaitingInvoice;
