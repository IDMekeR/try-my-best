import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, NavigateOptions } from 'react-router-dom';
import { Table, Tooltip, Empty, TableProps } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { getGlobalSearch } from 'services/actions/searchAction';

interface DataType {
    key: any;
    sno: number;
    id: any;
    encoded_RequestNumber: any;
    encoded_PatientNumber: any;
    patient_name: string;
    account_name: string;
    TagName: string;
    flag_identification: any;
    status: any;
}

const GlobalSearchResult: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { searchInfo, loading } = useSelector((state: any) => state.searchData);
    const dataSource = searchInfo?.Data || [];
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const totalPage = !loading ? searchInfo?.DataFinder?.totalrecords : 0;
    const customMessage = () => <Empty className="p-2" description="Search Not Found" />;
    const userRole = sessionStorage.getItem('role');

    const customLocale = {
        emptyText: customMessage,
    };

    useEffect(() => {
        const loc = location.state;
        getSearchData(pageIndex, pageSize, sortField, sortOrder, loc.searchValue, loc.categoryValue, loc.statusValue, loc.startDate, loc.endDate, loc.emailValue, loc.tagValue);
    }, [location.state]);

    function getSearchData(
        page: number,
        pageSize: number,
        sortField: string,
        sortOrder: string,
        inputsearch: string,
        Category: string,
        status: string,
        sDate: any,
        eDate: any,
        mailSearch: string,
        tagSearch: any,
    ) {
        const inputJson = {
            ADSRInput: {
                status: status || '',
                fromdaterange: sDate || '',
                todaterange: eDate || '',
                tags: tagSearch || '',
                email: mailSearch || '',
                category: Category || 'Global',
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: inputsearch || '',
            },
        };
        dispatch(getGlobalSearch(inputJson) as any);
    }

    const tableChange = (pagination: any, ...sorted: any) => {
        const loc = location.state;
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
        getSearchData(pagination.current, pagination.pageSize, sortField, sortOrder, loc?.searchValue, loc?.categoryValue, loc?.statusValue, loc?.startDate, loc?.endDate, loc?.emailValue, loc?.tagValue);
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'S No',
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
            title: 'Number',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
            render: (row: any, record: any) => {
                if (record.archive_data && record.flag == 1) {
                    return (
                        <div className="d-flex">
                            <div>{record.encoded_RequestNumber}</div>
                            <Tooltip title="Archived Request" className="my-auto ">
                                <div className="dot my-auto ms-1"></div>
                            </Tooltip>
                        </div>
                    );
                } else {
                    return <a>{record.encoded_RequestNumber}</a>;
                }
            },
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
            render: (patient_name: any) => (patient_name ? <div>{patient_name}</div> : '----'),
        },
        {
            title: 'Account Name',
            dataIndex: 'account_name',
            key: 'account_name',
        },
        {
            title: 'Tags',
            dataIndex: 'TagName',
            key: 'TagName',
            render: (TagName: any) => {
                return (
                    <div className="d-flex flex-wrap">
                        {TagName &&
                            TagName?.split(',')?.map((item: any, i: number) => {
                                return (
                                    <div key={i} className="m-1 tags-bg px-2 py-1 rounded ">
                                        {item}
                                    </div>
                                );
                            })}
                    </div>
                );
            },
        },
        {
            title: 'Category',
            dataIndex: 'flag_identification',
            key: 'flag_identification',
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            align: 'center',
            render: (status: any) => {
                if (sessionStorage?.getItem('role') === 'staff') {
                    if (
                        status?.toLowerCase() === 'on review' ||
                        status?.toLowerCase() === 'acknowledged' ||
                        status?.toLowerCase() === 'reassessment' ||
                        status?.toLowerCase() === 'request review'||
                        status?.toLowerCase() === 'result review'
                    ) {
                        return <div className="text-lightblue fw-bold">Acknowledged</div>;
                    } else if (status?.toLowerCase() === 'request init') {
                        return <div className="text-warning fw-bold">Submitted</div>;
                    } else {
                        return <div className="text-danger fw-bold">{status}</div>;
                    }
                } else {
                    if (status?.toLowerCase() === 'on review') {
                        return <div className="text-warning fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'request init' || status?.toLowerCase() === 'inactive') {
                        return <div className="text-danger fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'reassessment') {
                        return <div className="text-lightpurple fw-bold">{status}</div>;
                    } else if (status?.toLowerCase() === 'result review') {
                        return <div className="text-lightblue fw-bold">{status}</div>;
                    } else {
                        return <div className="text-success fw-bold">{status}</div>;
                    }
                }
            },
        },
    ];

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="mb-1">Global Search Result</h5>
            </div>
            <div className="my-2">
                <Table
                    className="pointer"
                    rowKey="id"
                    dataSource={loading ? [] : dataSource}
                    columns={columns}
                    loading={loading}
                    locale={customLocale}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)'}}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                const flag = record?.flag;
                                if (
                                    flag === 1 &&
                                    userRole !== 'staff' &&
                                    userRole !== 'researcher' &&
                                    (record.status === 'Request Init' || record.status == 'On Review' || record.status === 'Reassessment' || record.status === 'Result Review')
                                ) {
                                    navigate('/view-request/pipeline-request', {
                                        state: {
                                            id: record?.id,
                                            request_from: 'search',
                                            is_billing: record?.is_billing,
                                            reqDetail: record,
                                            reqFrom:record?.request_from
                                        },
                                    } as NavigateOptions);
                                } else if (flag == 1 && record.status == 'Released') {
                                    navigate('/released-request/dataset-information', {
                                        state: {
                                            id: record.id,
                                            rowData: record
                                        },
                                    } as NavigateOptions);
                                } else if (flag == 1 && (record.status == 'Reassessment' || record.status == 'Result Review')) {
                                    navigate(`/view-request/order-management`, {
                                        state: {
                                            reqDetail: record,
                                            reqId: record.id,
                                            status: true,
                                            active: record.is_active,
                                            error: false,
                                            requestFrom: record.request_from,
                                        },
                                    } as NavigateOptions);
                                } else if (flag == 1 && record.status == 'Request Init') {
                                    navigate(`/view-request/order-management`, {
                                        state: {
                                            reqDetail: record,
                                            reqId: record.id,
                                            status: false,
                                            active: record.is_active,
                                            error: false,
                                            requestFrom: record.request_from,
                                        },
                                    } as NavigateOptions);
                                } else if (flag === 2) {
                                    navigate('/patient-list/patient-medication', {
                                        state: {
                                            patientId: record?.id,
                                            accountID: record?.accountid,

                                        },
                                    } as NavigateOptions);
                                } else if (flag === 3 && userRole !== 'researcher') {
                                    navigate('/account/account-details', {
                                        state: {
                                            uid: record.Acc_GUID,
                                            accountid: record.id,
                                            rowId: record.id,
                                            activeFrom: record.created_on,
                                        },
                                    } as NavigateOptions);
                                } else return;
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

export default GlobalSearchResult;
