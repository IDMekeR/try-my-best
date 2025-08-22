import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input, Select } from 'components/shared/FormComponent';
import { Table, Tooltip, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import type { TableProps } from 'antd';
import 'assets/styles/table.scss';
import { getReleasedRequest } from 'services/actions/releasedReqAction';
import { ResetIcon } from 'assets/img/custom-icons';
import { myFunc } from 'components/shared/DropdownOption';
import ReassesReq from './modal/ReassesReq';


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

const ReleasedRequest: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const options = myFunc();
    const userRole = sessionStorage.getItem('role');
    const { releasedInfo, loading } = useSelector((state: any) => state.released);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const totalPage = !loading ? releasedInfo?.DataFinder?.totalrecords : 0;
    const data = loading ? [] : releasedInfo?.ServiceRequestDetail || [];
    const [accid, setAccid]: any = useState(0);
    const [searchText, setSearchText] = useState('');
    const [openReassModal, setOpenReassModal] = useState(false);
    const [rowData, setRowData]: any = useState(null);
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Request Available" />,
    };

    function getServiceRequestData(search: string, page: number, pageSize: number, sortField: string, sortOrder: string, accountid: any) {
        const inputJson = {
            reqstatus: 'Released',
            accountid: parseInt(accountid),
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(getReleasedRequest(inputJson) as any);
    }

    useEffect(() => {
        if (userRole == 'staff') {
            setAccid(sessionStorage.getItem('accountid'));
            getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, sessionStorage.getItem('accountid'));
        } else {
            getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, accid);
        }

    }, []);

    const showReassModal = (val: any) => {
        setOpenReassModal(true);
        setRowData(val);
    };
    const closeResModal = (item: any) => {
        setOpenReassModal(false);
        if (item == true) {
            getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, accid);
        }
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
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'encoded_RequestNumber',
        },
        ...(userRole !== 'researcher'
            ? [{
                title: 'Patient Name',
                dataIndex: 'patient_name',
                key: 'patient_name',
                sorter: (a: any, b: any) => a.patient_name.length - b.patient_name.length,
            }] : []),
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: null) => {
                return releasedInfo ? dob : null;
            },
        },
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        ...(userRole !== 'staff' && userRole !== 'researcher'
            ? [{
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
            }] : []),
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return releasedInfo ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Released Date',
            dataIndex: 'modified_on',
            key: 'modified_on',
            render: (modified_on: any) => {
                const originalDate = new Date(modified_on) || null;
                return releasedInfo ? originalDate?.toLocaleString() : null;
            },
            sorter: (a: any, b: any) => new Date(a?.modified_on).getTime() - new Date(b?.modified_on).getTime(),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: string) => {
                return (
                    <div className="status-section mx-auto">
                        <Button className="success-btn fw-bold">{status}</Button>
                    </div>
                );
            },
        },
        ...(userRole !== 'staff' && userRole !== 'researcher'
            ? [{
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                align: 'center' as const,
                render: (id: any, record: any) => {
                    return (
                        <div className='d-flex justify-content-center' onClick={(event) => { event.stopPropagation() }}>
                            <Tooltip title="Reassessment Request" className="mt-0">
                                <div className='fs-20 pointer' onClick={() => showReassModal(record)}>
                                    <ResetIcon />
                                </div>
                            </Tooltip>
                        </div>
                    )
                },
            }] : []),
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

    const nextScreen = (id: any, rowData: any) => {
        navigate('/released-request/dataset-information', { state: { id: id, rowData: rowData } } as NavigateOptions);
    };

    const getFlag = (record, userRole) => {
        if (userRole === 'admin') {
            return record?.read_admin_flag;
        } else if (userRole === 'staff') {
            return record?.read_account_flag;
        }
        return false;
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Released Request</h5>
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
                    className="releaseReq-grid pointer"
                    rowKey="id"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    locale={customLocale}
                    onChange={tableChange}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    rowClassName={(record) => (getFlag(record, userRole) == false ? 'viewed-row' : 'unviewed-row')}
                    onRow={(record: any) => {
                        return {
                            onClick: () => {
                                nextScreen(record.id, record);
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
            <ReassesReq openModal={openReassModal} closeModal={closeResModal} rowData={rowData} />
        </div>
    );
};

export default ReleasedRequest;
