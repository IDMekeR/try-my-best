import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { Empty, Table, TableProps, Tooltip } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { getNewRequest } from 'services/actions/newRequestAction';
import 'assets/styles/table.scss';
import { myFunc } from 'components/shared/DropdownOption';

interface DataType {
    key: any;
    sno: number;
    id: any;
    encoded_RequestNumber: any;
    patient_name: any;
    dob: any;
    gender: any;
    account_name: any;
    created_on: any;
    status: any;
    action: any;
}

const NewRequest: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { newReqInfo, loading } = useSelector((state: any) => state.newreq);
    const totalPage = !loading ? newReqInfo?.DataFinder?.totalrecords : 0;
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const options = myFunc();
    const [searchText, setSearchText] = useState('');
    const data = loading ? [] : newReqInfo?.ServiceRequestDetail || [];
    const [accid, setAccid] = useState(0);
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Request Available" />,
    };

    function getServiceRequestData(search: string, page: number, pageSize: number, sortField: string, sortOrder: string, accountid: any) {
        const inputJson = {
            req_from: sessionStorage.getItem('role') == 'admin' ? 1 : 2,
            reqstatus: 'Request Init',
            accountid: parseInt(accountid),
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(getNewRequest(inputJson) as any);
    }

    useEffect(() => {
        getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, accid);
    }, []);

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
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
            // fixed: 'left',
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
            sorter: (a: any, b: any) => a?.patient_name.length - b?.patient_name.length,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: null) => {
                return newReqInfo ? dob : null;
            },
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
            render: (text: string) => text,
            filterDropdown: () => {
                return (
                    <div style={{ padding: 8 }}>
                        <div className="w-100">
                            <p className="mb-1 ">Enter the Account Name to Search</p>
                            <Select
                                className="w-100"
                                value={searchText}
                                onChange={(option: any) => {
                                    onSelect(option);
                                }}
                                placeholder="Search Account Name"
                                showSearch
                                optionFilterProp="children"
                                options={options?.accOptions}
                                filterOption={(input: any, option: any) => {
                                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}
                            ></Select>
                        </div>
                        <div className="d-flex justify-content-end">
                            <Button type="primary" className="me-2" onClick={handleReset}>
                                Reset
                            </Button>
                            <Button type="primary" className="" onClick={searchbyBtn}>
                                Search
                            </Button>
                        </div>
                    </div>
                );
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return newReqInfo ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                return (
                    <div className="status-section mx-auto">
                        <Button className="danger-btn fw-bold w-100">{status}</Button>
                    </div>
                );
            },
        },
    ];

    const navigateAddScreen = () => {
        navigate('/new-request/order-management', { state: { id: 0, requestFrom: 0, error: false, reqId: null } } as NavigateOptions);
    };

    const navigateStepWizard = (record: any) => {
        navigate('/view-request/pipeline-request', {
            state: {
                reqDetail: record,
                id: record?.id,
                request_from: 'newReq',
                is_billing: record?.is_billing,
            },
        } as NavigateOptions);
    };

    const onSelect = (option: any) => {
        setSearchText(option);
        setAccid(option);
    };

    const handleReset = () => {
        setSearchText('');
        setPageIndex(1);
        setAccid(0);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, 0);
    };

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, accid);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, accid);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, accid);
    };

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
        getServiceRequestData(searchTableVal, pagination.current, pagination.pageSize, sortfield, sort, accid);
    };
    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">New Request</h5>
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
                    <Tooltip title="Add New Request">
                        <Button type="primary" onClick={navigateAddScreen}>
                            Add
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="my-2">
                <Table
                    className="pointer"
                    rowKey="id"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    locale={customLocale}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                navigateStepWizard(record);
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
        </div>
    );
};

export default NewRequest;
