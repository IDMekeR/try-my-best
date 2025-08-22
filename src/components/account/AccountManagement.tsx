import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Radio } from 'components/shared/FormComponent';
import { Table, useDispatch, useSelector, TableProps, Tooltip, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import 'assets/styles/table.scss';
import { getAccountList } from 'services/actions/accountAction';
import AccountModal from './modal/AccountModal';

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

const AccountManagement: React.FC<ChildProps> = ({ tabKey }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { accountInfo, loading } = useSelector((state: any) => state.account);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isStatus, setIsStatus] = useState('Active');
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const data = loading ? [] : accountInfo?.AccountDetail || [];
    const totalPage = loading ? 0 : accountInfo?.DataFinder.totalrecords;
    const [openModal, setOpenModal] = useState(false);
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Account Details" />,
    };

    function getAccount(search: string, page: number, pageSize: number, sortField: string, sortOrder: string, isStatus: string) {
        const inputJson = {
            AcctInput: {
                status: isStatus,
                is_approved: true
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
            title: 'Status',
            dataIndex: 'status',
            key: 'action',
            align: 'center',
            render: (status: any) => {
                const val=status?.toLowerCase();
                if (status === 'Active') {
                    return <div className='status-section mx-auto'><Button className="success-btn fw-bold text-center mx-auto px-2">{status}</Button></div>;
                } else {
                    return <div className='status-section mx-auto'><Button className="danger-btn text-center mx-auto px-2 text-capitalize">{val}</Button></div>;
                }
            },
        },
    ];

    const navigateNextScreen = (id: any) => {
        navigate('/account/account-details', { state: { accountid: id } } as NavigateOptions);
    };

    const handleStatusChange = (e: any) => {
        setIsStatus(e.target.value);
        setPageIndex(1);
        getAccount(searchTableVal, 1, pageSize, '', '', e.target.value);
    };
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

    const showModal = () => {
        setOpenModal(true);
    };

    const handleBack = () => {
        setOpenModal(false);
    };

    const callBackGrid = () => {
        setPageIndex(1);
        getAccount(searchTableVal, 1, pageSize, '', '', isStatus);
    };

    useEffect(() => {
        if (tabKey == '2') {
            getAccount(searchTableVal, pageIndex, pageSize, sortField, sortOrder, isStatus);
        }
    }, [tabKey]);


    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">List of Accounts</h5>

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
                        prefix={<img src={SearchIcon} height="14px" onClick={searchbyBtn} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title="Add new account">
                        <Button type="primary" onClick={showModal}>
                            Add
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="my-2">
                <Table
                    rowKey="id"
                    className="pointer border"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    locale={customLocale}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                navigateNextScreen(record?.id);
                            },
                        };
                    }}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: totalPage,
                    }}
                />
            </div>
            <AccountModal openModal={openModal} closeModal={handleBack} rowData={null} callBackGrid={callBackGrid} />
        </div>
    );
};

export default AccountManagement;
