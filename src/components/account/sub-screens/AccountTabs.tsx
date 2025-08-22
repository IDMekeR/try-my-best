import React, { useEffect, useState } from 'react';
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { QRCode, Table, Tooltip, Tabs, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { CheckCircleOutlined, CloseCircleOutlined } from 'components/shared/AntIcons';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { EditIcon } from 'assets/img/custom-icons';
import { useLocation } from 'react-router-dom';
import { getAccountUser } from 'services/actions/accountAction';
import 'assets/styles/account.scss';
import UserModal from '../modal/UserModal';
import BillingDetails from './BillingDetails';

const { Search } = Input;

const AccountTabs: React.FC = () => {

    const [selectedTab, setSelectedTab] = useState('1');

    const tabItems = [
        { key: '1', label: 'User Lists', children: <UserLists /> },
        {
            key: '2',
            label: 'Patient Intake Form',
            children: <PatientIntakeForm />,
        },
        {
            key: '3',
            label: 'Billing Details',
            children: <BillingDetails />,
        },
    ];

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    };

    return (
        <div className="my-4 acc-tabs">
            <div className="custom-tabs">
                <Tabs items={tabItems} defaultActiveKey={selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
            </div>
        </div>
    );
};

export default AccountTabs;

function UserLists() {
    const dispatch = useDispatch();
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { userProfileInfo, success6, loading6, error6 } = useSelector((state: any) => state.auth);
    const { userInfo, loading2 } = useSelector((state: any) => state.account);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [searchTableVal, setsearchTableval] = useState('');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [rowData, setRowData] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const data = loading2 ? [] : userInfo?.UserDetail || [];
    const totalPage = loading2 ? 0 : userInfo?.DataFinder.totalrecords || 0;
    const accountID: any = location?.state?.accountid
    const customLocale = {
        emptyText: <Empty className="p-2" description="No User Available" />,
    };

    const columns = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            render: (id: any, record: any, index: number) => {
                if (pageIndex === 1) {
                    return index + 1;
                } else {
                    return (pageIndex - 1) * pageSize + (index + 1);
                }
            },
        },

        {
            title: 'User Name',
            dataIndex: 'username',
            key: 'username',
           
            render: (username: any) => {
                return <div>{username ? username : '---'}</div>;
            },
            sorter: (a: any, b: any) => a.username?.length - b.username?.length,
            
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'firstname',
            sorter: (a: any, b: any) => a.first_name?.length - b.first_name?.length,
            render: (firstname: any) => {
                return <div>{firstname ? firstname : '---'}</div>;
            },
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'lastname',
            render: (lastname: any) => {
                return <div>{lastname ? lastname : '---'}</div>;
            },
            sorter: (a: any, b: any) => a.last_name?.length - b.last_name?.length,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'User role',
            dataIndex: 'groups',
            key: 'groups',
            render: (groups) => {
                return (
                    <div>
                        {groups?.length > 0
                            ? groups.length == 1
                                ? groups[0]?.toLowerCase() === 'accounts'
                                    ? 'Account Admin'
                                    : groups[0]?.toLowerCase() === 'billing'
                                        ? 'Lab Billing'
                                        : 'Lab Technician'
                                : groups
                                    ?.filter((item) => item?.toLowerCase() !== 'accounts')
                                    ?.map((item, index) => {
                                        return (
                                            <div key={index} className="text-capitalize">
                                                {item === 'billing' ? 'Lab Billing' : 'Lab Technician'}
                                            </div>
                                        );
                                    })
                            : groups
                                ?.filter((item) => item?.toLowerCase() !== 'accounts')
                                ?.map((item, index) => {
                                    return (
                                        <div key={index} className="text-capitalize">
                                            {item === 'billing' ? 'Lab Billing' : 'Lab Technician'}
                                        </div>
                                    );
                                })}
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'status',
            // align:'center',
            render: (_: any, record: any) => {
                if (record.is_active === true) {
                    return <CheckCircleOutlined size={50} className="text-success" />;
                } else {
                    return <CloseCircleOutlined size={50} className="text-danger" />;
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (_: any, record: any) => {
                return (
                    <div className='action-section'>
                        <div className="icon-edit">
                            {userRole === 'researcher' ? (
                                <span className="icon-edit-disabled">
                                    <EditIcon />
                                </span>
                            ) : (
                                <Tooltip title="Edit" className="mt-0">
                                    <span
                                        className="pointer edit-icon text-success"
                                        onClick={() => {
                                            showEdit(record);
                                        }}
                                    >
                                        <EditIcon />
                                    </span>
                                </Tooltip>
                            )}
                        </div>
                    </div>
                );
            },
        },
    ];

    const showEdit = (val: any) => {
        setOpenModal(true);
        setRowData(val);
    };

    function getAccountUserList(search: string, page: number, pageSize: number, sortField: string, sortOrder: string) {
        const inputJson = {
            UserInput: {
                acctid: userRole === 'staff' ? userProfileInfo?.data?.account_id : location?.state.accountid || 0,
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search,
            },
        };
        dispatch(getAccountUser(inputJson) as any);
    }

    useEffect(() => {
        getAccountUserList(searchTableVal, pageIndex, pageSize, sortField, sortOrder);
    }, [userProfileInfo]);

    const tableChange = (pagination: any, ...sorted: any) => {
        let sort = '';
        if (sorted[2].order === 'ascend') {
            sort = 'asc';
        } else sort = 'desc';
        setSortField(sorted[2].field);
        setSortOrder(sort);
        setPageIndex(pagination.current);
        setPageSize(pagination.pageSize);
        getAccountUserList(searchTableVal, pagination.current, pagination.pageSize, sorted[2].field, sort);
    };
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getAccountUserList(e.target.value, 1, pageSize, '', '');
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getAccountUserList(e.target.value, 1, pageSize, '', '');
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getAccountUserList(searchTableVal, 1, pageSize, '', '');
    };

    const showModal = () => {
        setOpenModal(true);
        setRowData(null);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };

    const callBackGrid = () => {
        setPageIndex(1);
        getAccountUserList(searchTableVal, 1, pageSize, '', '');
    };
    return (
        <div className="mt-2 py-2 px-3 bg-white">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto fs-17">List of Users</h6>
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
                    <Tooltip title="Add New User" >
                        <Button type="primary" onClick={showModal}>
                            Add
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="mt-2 border">
                <Table
                    className="pointer"
                    columns={columns}
                    dataSource={loading2 ? [] : data}
                    rowKey="id"
                    scroll={{ x: 'calc(230px + 50%)' }}
                    onChange={tableChange}
                    locale={customLocale}
                    loading={loading2}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalPage,
                    }}
                />
            </div>
            <UserModal openModal={openModal} rowData={rowData} closeModal={handleCancel} callBackGrid={callBackGrid} isAccount={true} accountID={accountID} />
        </div>
    );
}

function PatientIntakeForm() {
    const { acctInfo } = useSelector((state: any) => state.account);
    const [copyMsg, setCopyMsg] = useState('');

    const url = window.origin;
    const urlValue = `${url}/patient-form/${acctInfo?.data?.Acc_GUID}`;

    const copyUrl = () => {
        navigator.clipboard.writeText(urlValue);
        setCopyMsg('Url copied successfully');
        setTimeout(() => {
            setCopyMsg('');
        }, 3000);
    };
    return (
        <div className="mt-2 p-3 bg-white">
            <h6>Public Intake form QrCode Access :</h6>
            <div className="d-flex my-4">
                <QRCode value={urlValue} size={170} />
                <div className="ms-2 col-md-5">
                    <Search enterButton="Copy" value={urlValue} readOnly onSearch={copyUrl} />
                    {copyMsg ? <div className="bg-success text-white rounded my-2 p-2 col-auto"> {copyMsg}</div> : ''}
                </div>
            </div>
        </div>
    );
}
