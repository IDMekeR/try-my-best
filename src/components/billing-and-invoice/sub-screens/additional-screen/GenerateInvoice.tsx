import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Checkbox } from 'components/shared/FormComponent';
import { Avatar, Empty, Table, TableProps } from 'components/shared/AntComponent';
import { message } from 'components/shared/AntComponent';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { UserOutlined } from '@ant-design/icons';
import { generateCustomInvoice } from 'services/actions/invoiceAction';

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

const GenerateInvoice: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const [selectedReqIds, setSelectedReqIds]: any = useState([]);
    const { success5, loading5 } = useSelector((state: any) => state.invoice);
    const accountDetail = location?.state?.data;
    const accountId = location?.state?.data?.accountid;
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success5 : null;
    let totalCredits = 0;
    const customMessage = () => <Empty className="p-2" description="No Request Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    accountDetail?.request_list?.forEach((itm: any) => {
        totalCredits += Number(itm?.usage_credits);
    });

    const handleCheckboxChange = (req_id: any) => {
        setSelectedReqIds((prevSelectedReqIds: any) => {
            if (prevSelectedReqIds?.includes(req_id)) {
                return prevSelectedReqIds?.filter((id: any) => id !== req_id);
            } else {
                return [...prevSelectedReqIds, req_id];
            }
        });
    };

    const handleRowClick = (record: any) => {
        handleCheckboxChange(record?.req_id);
    };

    const handleSelectAllChange = (e: any) => {
        if (e.target.checked) {
            const allReqIds = accountDetail?.request_list?.map((item: any) => item?.req_id) || [];
            setSelectedReqIds(allReqIds);
        } else {
            setSelectedReqIds([]);
        }
    };

    const handleGenerate = () => {
        const inputJson = {
            accountid: accountId,
            reqids: selectedReqIds,
        };
        dispatch(generateCustomInvoice(inputJson) as any);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Invoice Generated Successfully');
            setShowSuccessmsg(false);
            handlegoBack();
        }
    }, [successmsg]);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: (
                <Checkbox
                    checked={selectedReqIds.length === (accountDetail?.request_list.length || 0)}
                    indeterminate={selectedReqIds.length > 0 && selectedReqIds.length < (accountDetail?.request_list.length || 0)}
                    onChange={handleSelectAllChange}
                />
            ),
            render: (text: any, record: any) => (
                <Checkbox checked={selectedReqIds.includes(record?.req_id)} onChange={() => handleCheckboxChange(record?.req_id)} onClick={(e) => e.stopPropagation()} />
            ),
            width: 50,
        },
        {
            title: 'Request Number',
            dataIndex: 'encoded_RequestNumber',
            width: 350,
        },
        {
            title: 'Billable Credits Incurred',
            dataIndex: 'usage_credits',
            width: 350,
        },
        {
            title: 'Report Item',
            dataIndex: 'report_items',
            align: 'start',
            render: (text) => {
                const filteredText = text
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
                return <div style={{ padding: '16px 10px' }}>{filteredText ? filteredText : '-'}</div>;
            },
        },
    ];

    const handlegoBack = () => {
        navigate('/invoice-manager', { state: { tab: '1' } } as NavigateOptions);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">Generate Invoice</h5>
                <div className="ms-auto d-flex">
                    <Button type="primary" onClick={handlegoBack}>
                        Back
                    </Button>
                </div>
            </div>
            <div className="row mx-0 mt-2">
                <div className="px-0 col">
                    <Table
                        className="pointer"
                        columns={columns}
                        locale={customLocale}
                        scroll={{ x: 'calc(230px + 50%)'}}
                        dataSource={accountDetail?.request_list || []}
                        rowKey="id"
                        onRow={(record) => ({
                            onClick: () => handleRowClick(record),
                        })}
                    />
                    <div className="d-flex justify-content-end  my-3 ">
                        <Button
                            className=""
                            type="primary"
                            loading={loading5}
                            disabled={selectedReqIds.length == 0}
                            onClick={() => {
                                handleGenerate();
                            }}
                        >
                            Generate Invoice
                        </Button>
                    </div>
                </div>
                <div className="col-md-3 pe-0">
                    <div className=" border bg-white p-2 shadow-sm">
                        <div className="text-center">
                            <Avatar size={120} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                            <h6 className="text-capitalize fs-20 mt-2 mb-1">{accountDetail?.account_name || ''}</h6>
                        </div>
                        <div className="row mx-0 border-top pt-3 mt-3">
                            <div className="col-md-6 ">
                                <h6 className="mb-1 text-dark">Account Number</h6>
                                <p>{accountDetail?.encoded_accountNumber}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="mb-1 text-dark">Invoice Period</h6>
                                <p>{accountDetail?.invoice_period}</p>
                            </div>
                            <div className="col-md-6">
                                <h6 className="mb-1 text-dark">Billing Type</h6>
                                <p>{accountDetail?.billing_type?.charAt(0).toUpperCase() + accountDetail?.billing_type?.slice(1)}</p>
                            </div>
                            <div className="col">
                                <h6 className="mb-1 text-dark">Overall billable Credits Incurred</h6>
                                <p>{totalCredits}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GenerateInvoice;
