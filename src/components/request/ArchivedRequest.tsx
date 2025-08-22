import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { Table, TableProps, Tooltip, Popconfirm, message, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { getArchivedRequest } from 'services/actions/newRequestAction';
import 'assets/styles/table.scss';
import { ResetIcon } from 'assets/img/custom-icons';
import { myFunc } from 'components/shared/DropdownOption';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { saveArchiveRequest } from 'services/actions/pipeline/pipelineAction';

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

const ArchivedRequest: React.FC = () => {
    const options = myFunc();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { archiveInfo, loading1 } = useSelector((state: any) => state.newreq);
    const { success3, error3 } = useSelector((state: any) => state.pipeline);

    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const data = loading1 ? [] : archiveInfo?.ServiceRequestDetail || [];
    const totalPage = !loading1 ? archiveInfo?.DataFinder?.totalrecords : 0;
    const [accid, setAccid] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [showsuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success3 : null;
    const [showErrmsg, setShowErrmsg] = useState(false);
    const errmsg = showErrmsg ? error3 : null;
    const customMessage = () => <Empty className="p-2" description="No Archived Request Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getServiceRequestData(search: string, page: number, pageSize: number, sortField: string, sortOrder: string, accountid: any) {
        const inputJson = {
            reqstatus: 'Archived Request',
            accountid: parseInt(accountid),
            is_active: true,
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(getArchivedRequest(inputJson) as any);
    }

    useEffect(() => {
        getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, accid);
    }, []);

    const restoreRequest = (id: any) => {
        const inputJson = {
            ServiceRequestid: id,
        };
        dispatch(saveArchiveRequest(inputJson) as any);
        setShowsuccessmsg(true);
        setShowErrmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Request restored successfully');
            getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, accid);
            setShowsuccessmsg(false);
        }
        if (errmsg) {
            message.error("Request couldn't be restored");
            setShowErrmsg(false);
        }
    }, [successmsg, errmsg]);

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
        },
        {
            title: 'Patient Name',
            dataIndex: 'patient_name',
            key: 'patient_name',
            sorter: (a: any, b: any) => a.patient_name.length - b.patient_name.length,
        },
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: null) => {
                return archiveInfo ? dob : null;
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
                                options={options.accOptions}
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
                return archiveInfo ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                if (status?.toLowerCase() === 'on review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="warning-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'request init' || status?.toLowerCase() === 'inactive') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="danger-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'reassessment') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="purple-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'result review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="primary-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="success-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                }
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (id: any, record: any) => {
                return (
                    <div
                        className="d-flex justify-content-center"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div className="fs-20 pointer">
                            <Tooltip title="Restore Request" className="mt-0">
                                <Popconfirm
                                    title="Restore Request"
                                    description="Are you sure to restore this request?"
                                    onConfirm={() => restoreRequest(record?.id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <span>
                                        <ResetIcon />
                                    </span>
                                </Popconfirm>
                            </Tooltip>
                        </div>
                    </div>
                );
            },
        },
    ];

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
            getServiceRequestData(e.target.value, 1, pageSize, sortField, sortOrder, accid);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getServiceRequestData(e.target.value, 1, pageSize, sortField, sortOrder, accid);
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

    const navigateStepWizard = (record: any) => {
        if (record?.status == "Released") {
            navigate('/released-request/dataset-information',
                 { state: { id: record?.id, rowData: record } } as NavigateOptions);
        } else {
            navigate('/view-request/pipeline-request', {
                state: {
                    id: record?.id,
                    request_from: 'archieveReq',
                    is_billing: record?.is_billing,
                    reqDetail: record,
                },
            } as NavigateOptions);
        }
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">Archived Request</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                </div>
            </div>
            <div className="my-2">
                <Table
                    rowKey="id"
                    className="pointer"
                    columns={columns}
                    dataSource={loading1 ? [] : data}
                    loading={loading1}
                    locale={customLocale}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)'}}
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

export default ArchivedRequest;
