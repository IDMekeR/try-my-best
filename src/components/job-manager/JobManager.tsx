import React, { useState, useEffect } from 'react';
import { Tabs, TableProps, Switch, Table, Empty } from 'components/shared/AntComponent';
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import SearchIcon from 'assets/img/search.svg';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { getAllJobs, getEdfAnalyzerJobs } from 'services/actions/jobManagerAction';
import ErrorJobManager from './ErrorJobManager';
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
    selectedTab: any;
}

const JobManager: React.FC = () => {
    const [selectedTab, setSelectedTab] = useState('1');
    const { userProfileInfo } = useSelector((state: any) => state.auth);

    const tabItems = [
        { key: '1', label: 'All Jobs', children: <AllJobs selectedTab={selectedTab} /> },
        {
            key: '2',
            label: (
                <span>
                    <span className={`${selectedTab === '2' ? 'bg-white text-danger' : 'bg-danger text-white'} rounded-circle job-circle`}>{userProfileInfo?.error_job_count || 0}</span>{' '}
                    Error Jobs
                </span>
            ),
            children: <ErrorJobManager selectedTab={selectedTab} />,
        },
        {
            key: '3',
            label: "EDF Analyzer",
            children: <EdfAnalyzer selectedTab={selectedTab} />,
        },
    ];

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">Job Manager</h5>
            </div>
            <div className="mt-3">
                <div className="custom-tabs">
                    <Tabs items={tabItems} defaultActiveKey={selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
                </div>
            </div>
        </div>
    );
};

export default JobManager;

const AllJobs: React.FC<ChildProps> = ({ selectedTab }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTableVal, setsearchTableval] = useState('');
    const { allJobInfo, loading3 } = useSelector((state: any) => state.jobManager);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [status, setStatus] = useState(false);
    const data = loading3 ? [] : allJobInfo?.ServiceRequestDetail || [];
    const totalPage = loading3 ? 0 : allJobInfo?.DataFinder?.totalrecords || 0;
    const userRole = sessionStorage.getItem('role');
    const customMessage = () => <Empty className="p-2" description="No Job Available" />;
    const customLocale = {
        emptyText: customMessage,
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
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
            sorter: (a: any, b: any) => a?.encoded_RequestNumber.length - b?.encoded_RequestNumber.length,
            width: 150,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },
        ...(userRole !== 'researcher'
            ? [{
                title: 'Account Name',
                dataIndex: 'account_name',
                key: 'account_name',
            }] : []),
        {
            title: 'Request Type',
            dataIndex: 'request_type',
            key: 'request_type',
        },
        {
            title: 'Submitted Date',
            dataIndex: 'submitted_on',
            key: 'submitted_on',
            render: (_: any, record: any) => {
                const originalDate = new Date(record.submitted_on) || null;
                return record?.submitted_on ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Request Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: any) => {
                if (status == 'Released') {
                    return <div className="text-success fw-bold mx-auto border-0 px-4">{status}</div>;
                } else if (status === 'On Review' || status === 'acknowledged') {
                    return <div className="text-warning fw-bold mx-auto border-0 px-3">{status}</div>;
                } else if (status == 'Result Review') {
                    return <div className="text-blue fw-bold mx-auto border-0 px-2">{status}</div>;
                } else if (status == 'Reassessment') {
                    return <div className="text-purple fw-bold border-0 mx-auto px-1">{status}</div>;
                } else {
                    return <div className="fw-bold text-danger px-2 mx-auto border-0">{status}</div>;
                }
            },
        },

        {
            title: 'Status',
            dataIndex: 'jobstatus',
            key: 'jobstatus',
            align: 'center',
            render: (status: any) => {
                return (
                    <div className='status-section'>
                        {status === 'in progress' ? (
                            <Button className="warning-btn mx-auto border-0 px-2 text-capitalize">{status}</Button>
                        ) : status === 'error' ? (
                            <Button className="danger-btn text-capitalize mx-auto border-0">{status}</Button>
                        ) : status === 'revaluation' ? (
                            <Button className="primary-btn mx-auto px-1">{status}</Button>
                        ) : status == 'Yet to Start' ? (
                            <Button className="bg-light text-dark text-capitalize px-2 mx-auto border-0">{status}</Button>
                        ) : (
                            <Button className="success-btn text-capitalize border-0 mx-auto">{status}</Button>
                        )}
                    </div>
                );
            },
        },
    ];

    function getAllJobsDetails(page: number, pageSize: number, sort: string, order: string, search: string, status: boolean) {
        const inputJson = {
            JobInput: {
                status: status ? 'complete' : 'all',
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sort || '',
                sortby: order || '',
                searchdata: search || '',
            },
        };
        dispatch(getAllJobs(inputJson) as any);
    }

    useEffect(() => {
        if (selectedTab == 1) {
            getAllJobsDetails(pageIndex, pageSize, sortField, sortOrder, searchTableVal, status);
        }
    }, [selectedTab]);

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
        getAllJobsDetails(pagination.current, pagination.pageSize, sortfield, sort, searchTableVal, status);
    };

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getAllJobsDetails(1, pageSize, '', '', e.target.value, status);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getAllJobsDetails(1, pageSize, '', '', e.target.value, status);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getAllJobsDetails(1, pageSize, '', '', searchTableVal, status);
    };

    const changeStatus = (e: any) => {
        setStatus(e);
        getAllJobsDetails(1, pageSize, '', '', searchTableVal, e);
    };

    const navigateScreen = (val: any) => {
        navigate('/edf_job_manager/edf-processing', { state: { id: val?.id, pntname: val?.patient_name, is_billing: val?.is_billing, rowData: val } } as NavigateOptions);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto ms-2 fs-16">{status ? 'List of completed jobs' : 'List of All jobs'}</h6>
                <div className="ms-auto d-flex">
                    <div className="my-auto me-2 ">
                        <Switch size="small" className="pe-2 me-1" value={status} onChange={changeStatus} />
                        <span className="fs-16">Show Completed Jobs</span>
                    </div>
                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="mt-2 border rounded mx-2">
                <Table
                    className="pointer"
                    columns={columns}
                    dataSource={data}
                    loading={loading3}
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    rowKey="id"
                    onChange={tableChange}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                navigateScreen(record);
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

const EdfAnalyzer: React.FC<ChildProps> = ({ selectedTab }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [pageSize, setPageSize] = useState(10);
    const [pageIndex, setPageIndex] = useState(1);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const { edfAnalyzerInfos, loading11 } = useSelector((state: any) => state.jobManager);
    const dataSource = loading11 ? [] : edfAnalyzerInfos ? edfAnalyzerInfos?.ServiceRequestDetail : [];
    const totalPage = edfAnalyzerInfos?.DataFinder?.totalrecords || 0;
    const [status, setStatus] = useState('complete');
    const [searchValue, setSearchValue] = useState('');
    const customMessage = () => <Empty className="p-2" description="No Job Available" />;
    const customLocale = {
        emptyText: customMessage,
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
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
            sorter: (a: any, b: any) => a?.encoded_RequestNumber?.length - b?.encoded_RequestNumber?.length,
            width: 150,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: 'Request Type',
            dataIndex: 'request_type',
            key: 'request_type',
        },
        {
            title: 'Submitted Date',
            dataIndex: 'submitted_on',
            key: 'submitted_on',
            render: (_: any, record: any) => {
                const originalDate = new Date(record.submitted_on) || null;
                return record?.submitted_on ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Request Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: any) => {
                if (status == 'Released') {
                    return <div className="text-success fw-bold mx-auto border-0 px-4">{status}</div>;
                } else if (status === 'On Review' || status === 'acknowledged') {
                    return <div className="text-warning fw-bold mx-auto border-0 px-3">{status}</div>;
                } else if (status == 'Result Review') {
                    return <div className="text-blue fw-bold mx-auto border-0 px-2">{status}</div>;
                } else if (status == 'Reassessment') {
                    return <div className="text-purple fw-bold border-0 mx-auto px-1">{status}</div>;
                } else {
                    return <div className="fw-bold text-danger px-2 mx-auto border-0">{status}</div>;
                }
            },
        },

        {
            title: 'Status',
            dataIndex: 'jobstatus',
            key: 'jobstatus',
            align: 'center',
            render: (status: any) => {
                return (
                    <div className='status-section'>
                        {status === 'in progress' ? (
                            <Button className="warning-btn mx-auto border-0 px-2 text-capitalize">{status}</Button>
                        ) : status === 'error' ? (
                            <Button className="danger-btn text-capitalize mx-auto border-0">{status}</Button>
                        ) : status === 'revaluation' ? (
                            <Button className="primary-btn mx-auto px-1">{status}</Button>
                        ) : status == 'Yet to Start' ? (
                            <Button className="bg-light text-dark text-capitalize px-2 mx-auto border-0">{status}</Button>
                        ) : (
                            <Button className="success-btn text-capitalize border-0 mx-auto">{status}</Button>
                        )}
                    </div>
                );
            },
        },
    ];


    function getJobManager2(search, page, pageSize, sortField, sortOrder, status) {
        const inputJson = {
            JobInput: {
                status: 'all',
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };

        dispatch(getEdfAnalyzerJobs(inputJson) as any);
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getJobManager2(e.target.value, 1, pageSize, null, null, status);
        }
    };

    const resetSearch = (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getJobManager2(searchTableVal, 1, pageSize, null, null, status);
        }
    };

    const tableChange = (pagination, ...sorted) => {
        let sort = '';
        if (sorted[1].order === "ascend") {
            sort = "asc";
        } else if (sorted[1].order === 'descend') {
            sort = "desc";
        } else sort = "";
        setSortField(sorted[1].field);
        setSortOrder(sort);
        setPageIndex(pagination.current);
        getJobManager2(searchTableVal, pagination.current, pagination.pageSize, sorted[1].field, sort, status);
    };

    const performSearch = (value) => {
        setSearchValue(value);
        getJobManager2(value, pageIndex, pageSize, null, null, status);
    };

    const searchbyBtn = () => {
        performSearch(searchValue);
    };

    useEffect(() => {
        if (selectedTab == 3) {
            getJobManager2(searchTableVal, pageIndex, pageSize, sortField, sortOrder, status);
        }
    }, [selectedTab]);

    return (
        <div>
            <div className="d-flex grid-title-card p-2">
                <h6 className="my-auto ms-2 fs-18">List of Jobs</h6>
                <div className="ms-auto d-flex">
                    <Input
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                        value={searchValue}
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                        onKeyDown={(e) => handleSearch(e)}
                        onChange={(e) => setSearchValue(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                    ></Input>
                </div>


            </div>
            <div className="mb-3 border rounded mx-3">
                <Table
                    rowKey="id"
                    className="pointer"
                    columns={columns}
                    locale={customLocale}
                    dataSource={loading11 ? [] : dataSource}
                    loading={loading11}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    onRow={(record: any, rowIndex: any) => {
                        return {
                            onClick: (event) => {
                                navigate(`/edf_job_manager/edf-analyzer`, {
                                    state: {
                                        sid: record?.id,
                                        reqFrom: record?.request_from,
                                        is_billing: record?.is_billing,
                                    },
                                } as NavigateOptions);
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
                    }}
                />
            </div>
        </div>
    )
}