import React, { useEffect, useState } from "react";
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useDispatch, useSelector } from "components/shared/CompVariables";
import { TableProps, Table, Tooltip, Empty, Spin } from 'components/shared/AntComponent';
import { getAccountWithCredit, getCreditPurchaseHistory } from "services/actions/billingAction";
import { ClosedInvoiceIcon, CreditPriceIcon, OpenInvoiceIcon, TotalAmountIcon, WaitingIcon } from 'assets/img/custom-icons';
import SearchIcon from 'assets/img/search.svg';
import dayjs from 'dayjs';
import { useNavigate } from "react-router-dom";

interface DataType {
    key: any;
    sno: number;
    id: any;
    diagnosis_name: any;
    diagnosis_hint: any;
    created_on: any;
    status: any;
    action: any;
}

const MyCredit: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userProfileInfo, success6, loading6, error6 } = useSelector((state: any) => state.auth);
    const { accCreditInfo, purchaseHistoryInfo, loading3, loading } = useSelector((state: any) => state.billing);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const tblData = !loading3 && purchaseHistoryInfo ? purchaseHistoryInfo?.data : [];
    const customMessage = () => <Empty className="p-2" description="No Plan Available" />;
    const customLocale = {
        emptyText: customMessage,
    };
    const statCards = [
        { id: 1, label: 'Total Credit', amount: accCreditInfo?.data?.total_credit || 0, icon: <TotalAmountIcon /> },
        { id: 2, label: 'Credit Used', amount: accCreditInfo?.data?.usedcredits || 0, icon: <WaitingIcon /> },
        { id: 3, label: 'Available Credit', amount: accCreditInfo?.data?.belance_credit || 0, icon: <CreditPriceIcon /> },
        { id: 4, label: 'Most Used Plan', amount: accCreditInfo?.data?.most_used_plan || 0, icon: <OpenInvoiceIcon /> },
        { id: 5, label: 'Previous Plan', amount: accCreditInfo?.data?.previous_plan || 0, icon: <ClosedInvoiceIcon /> },
    ];

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            width: '10%',
            render: (id: any, record: any, index: number) => {
                if (pageIndex === 1) {
                    return index + 1;
                } else {
                    return (pageIndex - 1) * pageSize + (index + 1);
                }
            },
        },
        {
            title: 'Plan',
            dataIndex: 'package_plan',
            key: 'package_plan',
            width: '30%',
        },
        {
            title: 'Credit',
            dataIndex: 'credit_count',
            key: 'credit_count',
            width: '30%',
            render: (credit_count: any) => {
                return <div>{credit_count ? credit_count : '---'}</div>;
            },
        },
        {
            title: 'Purchased On',
            dataIndex: 'purchased_on',
            key: 'purchased_on',
            render: (purchased_on: any) => {
                return purchaseHistoryInfo ? dayjs(purchased_on).format('MM-DD-YYYY') : null;
            },
        },
        {
            title: 'Payment Status',
            dataIndex: 'payment_status',
            key: 'payment_status',
            align: 'center',
            render: (payment_status: string) => {
                if (payment_status?.toLowerCase() === 'paid') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="success-btn text-capitalize fw-bold w-100">Success</Button>
                        </div>
                    );
                } else {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="danger-btn text-capitalize fw-bold w-100">{payment_status?.toLowerCase() === 'unpaid' ? 'Failed' : payment_status}</Button>
                        </div>
                    );
                }
            },
        },

    ];

    const buyNewCredit = () => {
        navigate('/buy-credit');
    }

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
    };

    function getPurchaseHistory() {
        dispatch(getCreditPurchaseHistory(userProfileInfo?.data?.account_id || 0) as any);
    }

    function getCreditStatistics() {
        const id = userProfileInfo?.data?.account_id || 0;
        dispatch(getAccountWithCredit(id) as any)
    }

    useEffect(() => {
        if (userProfileInfo?.data) {
            getPurchaseHistory();
        }
    }, [userProfileInfo]);

    useEffect(() => {
        if (userProfileInfo?.data) {
            getCreditStatistics();
        }
    }, [userProfileInfo]);

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto">Credit Manager</h5>
            </div>
            <Spin spinning={loading}>
                <div className="my-3 row m-0 invoice-stats">
                    {statCards?.map((item: any) => {
                        return (
                            <div className={`invoice-card col ps-0 ${item.id === 5 ? 'pe-0' : ''}`} key={item.id}>
                                <div className={`d-flex p-2 scard card${item.id} align-items-center`}>
                                    <div className="col-md-4 invoice-icon text-center me-2 ">{item.icon}</div>
                                    <div className="text-center">
                                        <h6 className="text-white fs-18 mb-1">{item.label}</h6>
                                        <h4 className="text-white mb-0">{item.amount ? item.amount
                                            : item.id == 1 || item.id == 2 || item.id == 3 ? '0' : '-'}</h4>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Spin>
            <div className="custom-tabs">
                <div className="d-flex">
                    <h5 className="text-dark">List of Purchased plans</h5>
                    <div className="ms-auto d-flex">
                        <Input
                            prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                            onKeyDown={(e) => handleSearch(e)}
                            value={searchTableVal}
                            onChange={(e) => setsearchTableval(e.target.value)}
                            onKeyUp={(e) => resetSearch(e)}
                            className="search-input col px-2 rounded fs-14 me-2"
                            placeholder="Search"
                        />
                        <Tooltip title="Buy Credit">
                            <Button type="primary" onClick={() => {
                                buyNewCredit()
                                localStorage.setItem('order', 'false');
                            }
                            }>Buy Credit</Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="my-2">
                    <Table
                        rowKey="id"
                        className="pointer"
                        columns={columns}
                        dataSource={loading3 ? [] : tblData}
                        loading={loading3}
                        locale={customLocale}
                        scroll={{ x: 'calc(230px + 50%)' }}
                        pagination={{
                            current: pageIndex,
                            pageSize: pageSize,
                            onChange: (page, pageSize) => {
                                setPageIndex(page);
                                setPageSize(pageSize);
                            },
                            showSizeChanger: false
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default MyCredit;