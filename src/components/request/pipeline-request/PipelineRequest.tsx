import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { Table, TableProps, Switch, Tooltip, Popconfirm, message, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import { downloadConsentForm, getPipelineRequest, saveArchiveRequest } from 'services/actions/pipeline/pipelineAction';
import { myFunc } from 'components/shared/DropdownOption';
import { ArchiveIcon, DownloadIcon, UploadIcon, EditIcon } from 'assets/img/custom-icons';
import UploadDocument from './modal/UploadDocument';
import { FileTextOutlined } from 'components/shared/AntIcons';
import DownloadDocument from './modal/DownloadDocument';
import ExportRequestModal from './modal/ExportRequestModal';
import Rush2 from 'assets/img/timerush2.svg';
import { EyeIcon,DocViewIcon } from 'assets/img/custom-icons';
import Ic from 'assets/img/other-icons/preview-doc-upload.svg';

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

const PipelineRequest: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const userRole = sessionStorage.getItem('role');
    const options = myFunc();
    const { pipelineInfo, loading, success3, error3 } = useSelector((state: any) => state.pipeline);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [isActive, setIsActive] = useState(true);
    const [isRush, setIsRush] = useState(false);
    const [searchTableVal, setsearchTableval] = useState('');
    const totalPage = !loading ? pipelineInfo?.DataFinder?.totalrecords : 0;
    const data = loading ? [] : pipelineInfo?.ServiceRequestDetail || [];
    const [accid, setAccid] = useState(0);
    const [searchText, setSearchText] = useState('');
    const [openDocModal, setOpenDocModal] = useState(false);
    const [openDownloadModal, setOpenDownloadModal] = useState(false);
    const [openExportModal, setOpenExportModal] = useState(false);
    const [rowData, setRowData]: any = useState(null);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;
    const [reqNo, setReqNo] = useState('');
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Request Available" />,
    };

    function getServiceRequestData(search: string, page: number, pageSize: number, sortField: any, sortOrder: any, isactive: any, rush: any, accountid: any) {
        const inputJson = {
            reqstatus: 'On Review',
            rush_order: sessionStorage.getItem('role') === 'staff' ? false : rush,
            accountid: parseInt(accountid),
            is_active: sessionStorage.getItem('role') === 'staff' ? (isactive === false ? 1 : 0) : 1,
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(getPipelineRequest(inputJson) as any);
    }

    useEffect(() => {
        getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
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
            render: (_: any, record: any) => {
                return (
                    <div>
                        {record?.encoded_RequestNumber}
                        <Tooltip title="Rush order request" className="mt-0 mb-1">
                            <span className="ms-2 rush-icon">{record?.rushorder_flag && userRole !== 'staff' ? <img src={Rush2} alt="rushorder" height="20px" /> : ''}</span>
                        </Tooltip>
                    </div>
                );
            },
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
                return pipelineInfo ? dob : null;
            },
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        ...(userRole !== 'staff'
            ? [
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
            ]
            : []),
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return pipelineInfo ? originalDate?.toLocaleString() : null;
            },
        },
    ];

    if (userRole === 'admin') {
        columns.push(
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
                                <Button className="purple-btn fw-bold w-100 text-break">{status}</Button>
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
                                <Button className="text-success fw-bold w-100">{status}</Button>
                            </div>
                        );
                    }
                },
            }, {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (id: any, record: any) => {
                return (
                    <div
                        className="action-section"
                        onClick={(event) => {
                            event.stopPropagation();
                        }}
                    >
                        <div className="d-flex icons align-items-center justify-content-center icon-edit">
                            <Tooltip title="Edit Request" className="mt-0 mb-1">
                                <span
                                    className="edit-icon icon-edit text-success pointer pb-0"
                                    onClick={() => {
                                        navigate(`/view-request/order-management`, {
                                            state: {
                                                reqDetail: record,
                                                reqId: record.id,
                                                status: record.status == 'Request Init' ? false : true,
                                                active: record.is_active,
                                                error: false,
                                                requestFrom: record.request_from,
                                                isReqUpdate: true,
                                            },
                                        } as NavigateOptions);
                                    }}
                                >
                                    <EditIcon />
                                </span>
                            </Tooltip>
                            {record?.status?.toLowerCase() === 'result review' ? (
                                <div className="px-2 fs-16 text-warning">
                                    <Tooltip title="Result document already exists">
                                        <FileTextOutlined />
                                    </Tooltip>
                                </div>
                            ) : (
                                <Tooltip title="Upload Result">
                                    <div className="px-2 fs-20 upload" onClick={() => showDocModal(record)}>
                                        <UploadIcon />
                                    </div>
                                </Tooltip>
                            )}
                            <Tooltip title="Download">
                                <div className="px-2 fs-16 download" onClick={() => showDownloadModal(record)}>
                                    <DownloadIcon />
                                </div>
                            </Tooltip>
                            <div className="px-2 fs-20 archive">
                                <Tooltip title="Archive Request">
                                    <Popconfirm
                                        title="Archive Request"
                                        description="Are you sure to archive this request?"
                                        okText="Yes"
                                        cancelText="No"
                                        onConfirm={() => archivedRequest(record)}
                                    >
                                        <span>
                                            <ArchiveIcon />
                                        </span>
                                    </Popconfirm>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                );
            },
        });
    } else if (userRole === 'staff') {
        columns.push({
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                if (status?.toLowerCase() === 'on review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="primary-btn fw-bold w-100">Acknowledged</Button>
                        </div>
                    );
                } else if ((status?.toLowerCase() === 'request init' || status?.toLowerCase() === 'inactive') && isActive) {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="danger-btn fw-bold w-100">Patient Submitted</Button>
                        </div>
                    );
                } else if ((status?.toLowerCase() === 'request init' || status?.toLowerCase() === 'inactive') && !isActive) {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="warning-btn fw-bold w-100">Submitted</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'reassessment') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="primary-btn fw-bold w-100 text-break">Acknowledged</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'result review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="primary-btn fw-bold w-100">Acknowledged</Button>
                        </div>
                    );
                } else {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="text-success fw-bold w-100">{status}</Button>
                        </div>
                    );
                }
            },
        },
            {
                title: 'Action',
                dataIndex: 'Action',
                key: 'Action',
                align: 'center',
                render: (id: any, record: any) => {
                    return (
                        <div
                            className="d-flex justify-content-end w-25 mx-auto ps-1 align-items-center justify-content-center"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {record?.is_active !== false && (
                                <Tooltip title="Edit Report Item" className="mt-1 pb-1">
                                    <span
                                        className=" edit-report text-warning pointer"
                                        onClick={() => {
                                            navigate(`/report-rate`, {
                                                state: {
                                                    serviceReqID: record.id,
                                                    accountId: record.accountid,
                                                    isUpdate: true,
                                                    details: record,
                                                },
                                            } as NavigateOptions);
                                        }}
                                    >
                                        <FileTextOutlined />
                                    </span>
                                </Tooltip>
                            )}
                            <div className="ps-2">
                                <Tooltip title="Preview" className="mt-0">
                                    <span
                                        className="icon-eye"
                                        onClick={() => {
                                            navigate(`/view-request/order-management`, {
                                                state: {
                                                    reqId: record.id,
                                                    status: record.status == 'Request Init' ? false : true,
                                                    active: record.is_active,
                                                    error: false,
                                                    requestFrom: record.request_from,
                                                },
                                            } as NavigateOptions);
                                        }}
                                    >
                                        <EyeIcon />
                                    </span>
                                </Tooltip>

                            </div>
                            {isActive ? <div>
                                {/* <Tooltip title="Already this request contains ">
                                    <span className="px-2 fs-20 gray-upload text-gray" >
                                        <UploadIcon />
                                    </span>
                                </Tooltip> */}
                            </div> :
                                <div>

                                    <Tooltip title={record.consentupload_flag ? "View Consent Form" : "Upload Consent Form"}>
                                        {record.consentupload_flag ?
                                            <span className="px-2 fs-20 upload" onClick={() => showDocModal(record)}>
                                                <DocViewIcon /></span> :
                                            <span className="px-2 fs-20 upload" onClick={() => showDocModal(record)}>
                                                <UploadIcon />
                                            </span>}
                                    </Tooltip>
                                </div>}
                        </div>
                    );
                },

            }
        )

    }

    const showDocModal = (val: any) => {
        setOpenDocModal(true);
        setRowData(val);
    };

    const archivedRequest = (val: any) => {
        const inputJson = {
            ServiceRequestid: val.id,
        };
        dispatch(saveArchiveRequest(inputJson) as any);
        setReqNo(val.encoded_RequestNumber);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success(`${reqNo} moved to archived successfully`);
            getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
            setReqNo('');
        }
        if (errormsg) {
            setShowErrormsg(false);
            message.error(`${reqNo} couldn't moved to archived`);
        }
    }, [successmsg, errormsg]);

    const showDownloadModal = (val: any) => {
        setOpenDownloadModal(true);
        setRowData(val);
    };

    const showExportModal = () => {
        setOpenExportModal(true);
    };

    const closeExportModal = () => {
        setOpenExportModal(false);
    };

    const closeDocModal = () => {
        setOpenDocModal(false);
    };
    const closeDownloadModal = () => {
        setOpenDownloadModal(false);
    };
    const onSelect = (option: any) => {
        setSearchText(option);
        setAccid(option);
    };

    const handleReset = () => {
        setSearchText('');
        setPageIndex(1);
        setAccid(0);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, isRush, 0);
    };
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, isRush, accid);
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
        getServiceRequestData(searchTableVal, pagination.current, pagination.pageSize, sortfield, sort, isActive, isRush, accid);
    };

    const navigateStepWizard = (record: any) => {
        navigate('/view-request/pipeline-request', {
            state: {
                id: record?.id,
                request_from: 'pipelineReq',
                is_billing: record?.is_billing,
                reqDetail: record,
                reqFrom: record.request_from
            },
        } as NavigateOptions);
    };

    const changeRushOrder = (e: any) => {
        setIsRush(e);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, e, accid);
    };

    const changePntOrder = (e: any) => {
        setIsActive(e);
        getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, e, e, accid);
    };

    const navigateAddScreen = () => {
        navigate('/view-request/order-management', { state: { id: 0, requestFrom: 0, error: false, reqId: null } } as NavigateOptions);
    };

    return (
        <div className="p-2">
            {/* {userRole?.toLowerCase() === 'staff' ? (
                <AccountPipeline />
            ) : (
                <> */}
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">{userRole === 'staff' ? 'Order Management' : 'Service Request in Pipeline'}</h5>
                <div className="ms-auto d-flex">
                    {userRole !== 'staff' ? (
                        <div className="me-2 my-auto">
                            <Switch size="small" className="me-2" onChange={changeRushOrder} />
                            <span className="fs-16">Rush Order</span>
                        </div>
                    ) : (
                        <div className="me-2 my-auto">
                            <Switch size="small" className="me-2" defaultChecked={isActive} onChange={changePntOrder} />
                            <span className="fs-16">Patient submitted request</span>
                        </div>
                    )}
                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input col px-2 rounded fs-14 me-2"
                        placeholder="Search"
                    />
                    {/* {userRole === 'staff' ? "" :  */}
                    <Button type="primary" onClick={showExportModal}>
                        Export
                    </Button>
                    {/* } */}
                    {userRole === 'staff' ? (
                        <Button type="primary" className="ms-1" onClick={navigateAddScreen}>
                            New Service Request
                        </Button>
                    ) : (
                        ''
                    )}
                </div>
            </div>
            <div className="my-2">
                <Table
                    rowKey="id"
                    className="pointer"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    locale={customLocale}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                if (userRole !== 'staff') {
                                    navigateStepWizard(record);
                                } else {
                                    navigate('/view-request/order-management', {
                                        state: {
                                            reqDetail: record,
                                            reqId: record.id,
                                            status: record.status == 'Request Init' ? false : true,
                                            active: record.is_active,
                                            error: false,
                                            requestFrom: record.request_from,
                                            isReqUpdate: true,
                                        }
                                    } as NavigateOptions)
                                }

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
            {/* </>
            )} */}
            <UploadDocument openModal={openDocModal} closeModal={closeDocModal} rowData={rowData} />
            <DownloadDocument openModal={openDownloadModal} closeModal={closeDownloadModal} rowData={rowData} />
            <ExportRequestModal openModal={openExportModal} closeModal={closeExportModal} />
        </div>
    );
};

export default PipelineRequest;
