import React, { useState, useEffect } from 'react';
import { Input, Radio } from 'components/shared/FormComponent';
import { Table, Tooltip, TableProps, Tabs, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { Button } from 'components/shared/ButtonComponent';
import { getAllUsers } from 'services/actions/securityAction';
import ServiceReference from './sub-screens/ServiceReference';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { EditIcon } from 'assets/img/custom-icons';
import UserModal from 'components/account/modal/UserModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    first_name: any;
    last_name: any;
    accountname: any;
    date_joined: any;
    username: any;
    user_role: any;
    is_active: any;
}

const Security: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('1');

    const tabItems = [
        { key: '1', label: 'User Account Management', children: <UserManagement /> },
        {
            key: '2',
            label: 'Role Reference',
            children: <ServiceReference />,
        },
    ];

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    };
    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Access and Permission Management</h5>
            </div>
            <div className="mt-3">
                <div className="custom-tabs">
                    <Tabs items={tabItems} defaultActiveKey={selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
                </div>
            </div>
        </div>
    );
};

export default Security;

const UserManagement = () => {
    const dispatch = useDispatch();
    const { allUserInfo, loading1 } = useSelector((state: any) => state.security);
    const [searchTableVal, setsearchTableval] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('');
    const totalPage = !loading1 ? allUserInfo?.DataFinder?.totalrecords : 0;
    const [rowData, setRowData]: any = useState(null);
    const [isStatus, setIsStatus] = useState('Active');
    const userRole = sessionStorage.getItem('role');
    const customMessage = () => <Empty className="p-2" description="No User Available" />;
    const customLocale = {
        emptyText: customMessage,
    };
    function getAllUserData(page: number, size: number, sort: string, sortField: string, search: string, status: string) {
        const inputJson = {
            UserInput: {
                acctid: 0,
                status: status || '',
                role: '',
            },
            DataFinder: {
                pagesize: size,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sort || 'asc',
                searchdata: search || '',
            },
        };
        dispatch(getAllUsers(inputJson) as any);
    }

    useEffect(() => {
        getAllUserData(pageIndex, pageSize, sortOrder, sortField, searchTableVal, isStatus);
    }, []);

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getAllUserData(1, pageSize, '', '', e.target.value, isStatus);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getAllUserData(1, pageSize, '', '', e.target.value, isStatus);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getAllUserData(1, pageSize, '', '', searchTableVal, isStatus);
    };

    const showModal = () => {
        setOpenModal(true);
        setRowData(null);
    };
    const handleStatusChange = (e: any) => {
        getAllUserData(1, pageSize, '', '', searchTableVal, e.target.value);
        setIsStatus(e.target.value);
        setPageIndex(1);
    };
    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            render: (id, record, index) => {
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
            render: (username) => {
                return <div>{username ? username : '---'}</div>;
            },
            sorter: (a, b) => a.username?.length - b.username?.length,
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'firstname',
            sorter: (a, b) => a.first_name?.length - b.first_name?.length,
            render: (firstname) => {
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
            sorter: (a, b) => a.last_name?.length - b.last_name?.length,
        },
        {
            title: 'Account Name',
            dataIndex: 'accountname',
            key: 'accountname',
            render: (accountname: any) => {
                return <div>{accountname ? accountname : '---'}</div>;
            },
        },
        {
            title: 'Login From',
            dataIndex: 'date_joined',
            key: 'date_joined',
            render: (date_joined: any) => {
                const originalDate = new Date(date_joined);
                return <div>{allUserInfo ? originalDate?.toLocaleDateString() : '--'}</div>;
            },
        },
        {
            title: 'User Role',
            dataIndex: 'user_role',
            key: 'user_role',
            render: (_: any, record: any) => {
                return (
                    <div>
                        {record.is_superuser
                            ? record.groups?.length == 0
                                ? 'Admin'
                                : record.groups[0]?.toLowerCase() === 'accounts'
                                    ? 'Account Admin'
                                    : record.groups[0]?.toLowerCase() === 'billing'
                                        ? 'Billing'
                                        : record.groups[0]?.toLowerCase() === 'admin'
                                            ? 'Admin'
                                            : 'Technician'
                            : record.groups?.length == 1
                                ? record.groups[0]?.toLowerCase() === 'accounts'
                                    ? 'Account Admin'
                                    : record.groups[0]?.toLowerCase() === 'billing'
                                        ? 'Lab Billing'
                                        : 'Lab Technician'
                                : record.groups[1]?.toLowerCase() === 'billing'
                                    ? 'Lab Billing'
                                    : 'Lab Technician'}
                    </div>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div className='status-section'>
                        {record.is_active ? (
                            <Button className="success-btn border-0 px-4 mx-auto">Active</Button>
                        ) : (
                            <Button className="danger-btn border-0 px-3 text-danger mx-auto">InActive</Button>
                        )}
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action, record) => {
                return (
                    <div className='action-section'>
                        <div className="icon-edit">
                            {userRole === 'researcher' ? (
                                <span className="icon-edit-disabled edit-icon text-secondary'">
                                    <EditIcon />
                                </span>
                            ) : (
                                <Tooltip title="Edit" className="mt-0">
                                    <span
                                        className="edit-icon text-success pointer"
                                        onClick={() => {
                                            setOpenModal(true);
                                            setRowData(record);
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
        getAllUserData(pagination.current, pagination.pageSize, sort, sortfield, searchTableVal, isStatus);
    };

    const handleBack = () => {
        setOpenModal(false);
    };

    const callBackGrid = () => {
        setPageIndex(1);
        getAllUserData(1, pageSize, sortOrder, sortField, searchTableVal, isStatus);
        setOpenModal(false);
    };

    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto fs-17">List of Users</h6>
                <div className="ms-auto d-flex">
                    <Radio.Group defaultValue={isStatus} buttonStyle="solid" className="col pe-0" onChange={handleStatusChange}>
                        <Radio.Button className="active" value="Active">
                            Active
                        </Radio.Button>
                        <Radio.Button className="inactive px-2" value="InActive">
                            Inactive
                        </Radio.Button>
                    </Radio.Group>
                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
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
            <div className="mt-2 border rounded">
                <Table
                    className="pointer"
                    loading={loading1}
                    columns={columns}
                    dataSource={allUserInfo?.UserDetail || []}
                    onChange={tableChange}
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    rowKey="id"
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalPage,
                    }}
                />
            </div>
            <UserModal openModal={openModal} rowData={rowData} closeModal={handleBack} callBackGrid={callBackGrid} isAccount={false} accountID={0} />
        </div>
    );
};
