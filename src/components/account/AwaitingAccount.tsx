import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, useDispatch, useSelector, TableProps, Empty, Popconfirm, message, Modal, Tooltip } from 'components/shared/AntComponent';
import ApproveIcon from 'assets/img/other-icons/approve-icon.svg';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate } from 'react-router-dom';
import 'assets/styles/table.scss';
import { approveAccount, getAccountList } from 'services/actions/accountAction';
import AccountModal from './modal/AccountModal';
import PreviewAccount from './modal/PreviewAccount';
import { EyeIcon } from 'assets/img/custom-icons';

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

const AwaitingAccount: React.FC<ChildProps> = ({ tabKey }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accountInfo, loading, loading14, success14, error14 } = useSelector((state: any) => state.account);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isStatus, setIsStatus] = useState('Active');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const data = loading ? [] : accountInfo?.AccountDetail || [];
    const totalPage = loading ? 0 : accountInfo?.DataFinder.totalrecords;
    const [openModal, setOpenModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success14 : false;
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const errormsg = showErrorMsg ? error14 : false;

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [alternativeEmail, setAlternativeEmail] = useState("");
    const [selectedRecord, setSelectedRecord]: any = useState();
    const [isAlternate, setIsAlternate] = useState(false)
    const [emailError, setEmailError] = useState(false);

    const customLocale = {
        emptyText: <Empty className="p-2" description="No Account Details" />,
    };

    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const email = e.target.value;
        setAlternativeEmail(email);
        setEmailError(!isValidEmail(email) && email.length > 0);
    };

    function getAccount(search: string, page: number, pageSize: number, sortField: string, sortOrder: string, isStatus: string) {
        const inputJson = {
            AcctInput: {
                status: isStatus,
                is_approved: false
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder,
                searchdata: search,
            },
        };
        dispatch(getAccountList(inputJson) as any);
    }

    const tableChange = (pagination: any, ...sorted: any) => {
        let sort = '',
            sortfield = '';
        if (sorted[1].order === 'ascend') {
            sort = 'asc';
        } else if (sorted[1].order === 'descend') {
            sort = 'desc';
        } else sort = '';
        setPageIndex(pagination.current);
        if (sort == '') {
            sortfield = '';
            setSortField('');
        } else {
            setSortField(sorted[1].field);
            sortfield = sorted[1].field;
        }
        setSortOrder(sort);
        setPageSize(pagination.pageSize);
        getAccount(searchTableVal, pagination.current, pagination.pageSize, sortfield, sort, isStatus);
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            render: (id: number, record: any, index: number) => {
                if (pageIndex === 1) {
                    return index + 1;
                } else {
                    return (pageIndex - 1) * pageSize + (index + 1);
                }
            },
        },
        {
            title: 'Account No',
            dataIndex: 'encoded_accountNumber',
            key: 'accno',
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'accname',
            sorter: (a: any, b: any) => a?.account_name.length - b?.account_name.length,

        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (id: any, record: any) => {
                return record.first_name + ' ' + record.last_name;
            },
        },
        {
            title: 'Address',
            dataIndex: 'contact_address',
            key: 'address',
            render: (address: string) => {
                return <div>{address ? address : '---'}</div>;
            },
        },
        {
            title: 'Phone No',
            dataIndex: 'contact_phone',
            key: 'contact',
            render: (contact_phone: any) => {
                const formattedPhone = `(${contact_phone.substring(0, 3)}) ${contact_phone.substring(3, 6)}-${contact_phone.substring(6)}`;
                return <div className="phone-no">{contact_phone ? formattedPhone : '---'}</div>;
            },
        },
        {
            title: 'Fax',
            dataIndex: 'contact_fax',
            key: 'fax',
            render: (fax: any) => {
                return <div>{fax ? fax : '---'}</div>;
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
                        className="d-flex justify-content-center p-2 text-center approves-icon"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >

                        {/* <Tooltip title="Approve Request">
                            <img src={ApproveIcon} height={18} onClick={()=>{
                                 setSelectedRecord(record);
                                 setOpenModal(true)
                            }} />
                        </Tooltip> */}
                        <Tooltip title="Approve Request" className="mt-0">
                                <span
                                    className="icon-eye"
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        setOpenModal(true)
                                    }}
                                >
                                    <EyeIcon />
                                </span>
                            </Tooltip>

                        {/* <Popconfirm
                            title={
                                "Approve Account"
                            }
                            description="Are you sure you want to proceed?"
                            onConfirm={() => {
                                setSelectedRecord(record);
                                // setIsModalVisible(true);
                                setOpenModal(true)
                            }}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Tooltip title="Approve Request">
                            <img src={ApproveIcon} height={18} />
                            </Tooltip>
                        </Popconfirm> */}

                    </div>
                )
            },
        },
    ];

    const showDetail = (val: any, isAlternate: any) => {
        const inputJson = {
            accountid: val.id,
            loginmail: isAlternate ? alternativeEmail : val.contact_email,
            groups: ['Accounts'],
            domain: window.origin
        }
        dispatch(approveAccount(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrorMsg(true);
    }

    const handleApprove = (val: any, isAlternate: any) => {
        showDetail(val, isAlternate);
        setIsModalVisible(false);
        setAlternativeEmail("");
        setIsAlternate(false)
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Account approved successfully');
            setShowSuccessmsg(false);
            setPageIndex(1);
            getAccount(searchTableVal, 1, pageSize, '', '', isStatus);
        }

        if (errormsg) {
            if (error14?.errors) {
                Object.keys(error14.errors).forEach((key) => {
                    const errorMessages = error14.errors[key];
                    if (Array.isArray(errorMessages)) {
                        errorMessages.forEach((msg) => {
                            message.error(`${key}: ${msg}`); 
                        });
                    }
                });
            } else {
                message.error("Account couldn't be approved");
            }
            setShowErrorMsg(false);
        }
    }, [successmsg, errormsg]);

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getAccount(e.target.value, 1, pageSize, '', '', isStatus);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getAccount(e.target.value, 1, pageSize, '', '', isStatus);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getAccount(searchTableVal, 1, pageSize, '', '', isStatus);
    };

    const handleBack = () => {
        setOpenModal(false);
    };

    const callBackGrid = () => {
        setPageIndex(1);
        getAccount(searchTableVal, 1, pageSize, '', '', isStatus);
    };

    useEffect(() => {
        if (tabKey == '1') {
            getAccount(searchTableVal, pageIndex, pageSize, sortField, sortOrder, isStatus);
        }
    }, [tabKey]);


    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">List of Accounts</h5>

                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={searchbyBtn} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="my-2">
                <Table
                    rowKey="id"
                    className="pointer border"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading || loading14}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    locale={customLocale}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalPage,
                    }}
                />
            </div>
            <PreviewAccount openModal={openModal} closeModal={handleBack} rowData={selectedRecord} callBackGrid={callBackGrid} />
            <Modal
                title="Approve Account"
                visible={isModalVisible}
                onCancel={() => {
                    setIsModalVisible(false)
                    setEmailError(false)
                    setIsAlternate(false)
                    setAlternativeEmail('')
                }}
                footer={isAlternate ? (
                    <div>
                        <Button className="bg-danger text-white me-2" onClick={() => {
                            setIsModalVisible(false)
                            setEmailError(false)
                            setIsAlternate(false)
                            setAlternativeEmail('')
                        }}>Cancel</Button>
                        <Button
                            type="primary"
                            disabled={!isValidEmail(alternativeEmail)}
                            onClick={() => {
                                handleApprove(selectedRecord, true)
                            }}
                        >
                            Approve with Alternative Email
                        </Button>
                    </div>
                ) : null}
            >
                <p>Would you like to use the same email <strong>({selectedRecord?.contact_email})</strong> for creating the new user?</p>

                <div className="d-flex justify-content-between">
                    <Button type="primary" onClick={() => {
                        handleApprove(selectedRecord, false)
                        setIsAlternate(false);
                    }}>
                        Yes, Use Same Email
                    </Button>
                    <Button
                        onClick={() => {
                            setIsAlternate(true);
                        }}
                    >
                        No, Use Alternative Email
                    </Button>
                </div>

                {isAlternate && (
                    <div className="mt-3">
                        <Input
                            placeholder="Enter alternative email"
                            value={alternativeEmail}
                            onChange={handleEmailChange}
                            status={emailError ? "error" : ""}
                        />

                        {emailError ? <div className="text-danger text-end me-3">⚠ Please enter a valid email address</div> : ''}

                    </div>
                )}
            </Modal>
        </div>
    );
};

export default AwaitingAccount;
