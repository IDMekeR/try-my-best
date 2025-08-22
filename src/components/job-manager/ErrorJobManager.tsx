import React, { useState, useEffect } from 'react';
import { TableProps, Table, Empty } from 'components/shared/AntComponent';
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import SearchIcon from 'assets/img/search.svg';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { getErrorJobs } from 'services/actions/jobManagerAction';
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

interface ChildProps{
    selectedTab:any
}

const ErrorJobManager: React.FC <ChildProps>= ({selectedTab}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTableVal, setsearchTableval] = useState('');
    const { jobErrorInfo, loading4 } = useSelector((state: any) => state.jobManager);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const data = loading4 ? [] : jobErrorInfo?.ServiceRequestDetail || [];
    const totalPage = loading4 ? 0 : jobErrorInfo?.DataFinder?.totalrecords || 0;
    const userRole = sessionStorage.getItem('role');
    const customMessage = () => <Empty className="p-2" description="No Error Job Available" />;
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
            sorter: (a: any, b: any) => a.encoded_RequestNumber.length - b.encoded_RequestNumber.length,
            width: 150,
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
        },
        ...( userRole !== 'researcher'
            ? [{ 
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
        }]:[]),
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
                    <div className='status-section mx-auto'>
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

    function getAllJobsDetails(page: number, pageSize: number, sort: string, order: string, search: string) {
        const inputJson = {
            JobInput: {
                status: 'error',
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sort || '',
                sortby: order || '',
                searchdata: search || '',
            },
        };
        dispatch(getErrorJobs(inputJson) as any);
    }

    useEffect(() => {
        if(selectedTab==2){
            getAllJobsDetails(pageIndex, pageSize, sortField, sortOrder, searchTableVal);
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
        getAllJobsDetails(pagination.current, pagination.pageSize, sortfield, sort, searchTableVal);
    };

    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getAllJobsDetails(1, pageSize, '', '', e.target.value);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getAllJobsDetails(1, pageSize, '', '', e.target.value);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getAllJobsDetails(1, pageSize, '', '', searchTableVal);
    };

    const navigateScreen = (val: any) => {
        navigate('/edf_job_manager/edf-processing', { state: { id: val.id, pntname: val.patient_name } } as NavigateOptions);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto ms-2 fs-18">List of Error Jobs</h6>
                <div className="ms-auto d-flex">
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
                    loading={loading4}
                    locale={customLocale}
                    rowKey="id"
                    scroll={{ x: 'calc(230px + 50%)' }}
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

export default ErrorJobManager;
