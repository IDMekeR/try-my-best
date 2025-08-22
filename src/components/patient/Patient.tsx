import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, Popconfirm, Tooltip, message, Empty } from 'components/shared/AntComponent';
import { DeleteFilled } from 'components/shared/AntIcons';
import SearchIcon from 'assets/img/search.svg';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import 'assets/styles/table.scss';
import { deletePatient, getPatientList } from 'services/actions/patientAction';
import dayjs from 'dayjs';
import type { TableProps } from 'antd';
import PatientModal from './modal/PatientModal';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import ReconfirmDeleteModal from 'components/master-data/modal/ReconfirmDeleteModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    encoded_PatientNumber: any;
    name: any;
    dob: any;
    gender: any;
    address: any;
    contact_number: any;
    action?: any;
}

const Patient: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const accountId = Number(sessionStorage.getItem('accountid'));
    const { patientInfo, loading, success2, error2 } = useSelector((state: any) => state.patient);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const data = loading ? [] : patientInfo?.PatientsDetail || [];
    const totalPage = patientInfo?.DataFinder?.totalrecords || 0;
    const [openModal, setOpenModal] = useState(false);
    const [pntID, setPntID] = useState(0);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success2 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error2 : false;
    const userRole = sessionStorage.getItem('role');
    const customLocale = {
        emptyText: <Empty className="p-2" description="No Patient Available" />,
    };

    function getPatientDetails(search: string, page: number, pageSize: number, sortField: string, sortOrder: string) {
        const inputJson = {
            PntInput: {
                status: 'Active',
                acctid: accountId,
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(getPatientList(inputJson) as any);
    }

    useEffect(() => {
        getPatientDetails(searchTableVal, pageIndex, pageSize, sortField, sortOrder);
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
            title: userRole == 'researcher' ? 'Patient Name' : 'Patient No',
            dataIndex: 'encoded_PatientNumber',
            key: 'encoded_PatientNumber',
        },
        ...(userRole !== 'researcher'
            ? [{
                title: 'Patient Name',
                dataIndex: 'first_name',
                key: 'first_name',
                render: (id: number, record: any) => {
                    return record?.first_name + ' ' + record?.last_name;
                },
                sorter: (a: any, b: any) => a?.first_name.length - b?.first_name.length,
            }] : []),
        {
            title: 'Date of Birth',
            dataIndex: 'dob',
            key: 'dob',
            render: (dob: any) => {
                return patientInfo ? (dob ? dayjs(dob)?.format('MM-DD-YYYY') : null) : null;
            },
        },
        {
            title: 'Sex at birth',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
            render: (address: any) => {
                return <div>{address ? address : '---'}</div>;
            },
        },
        {
            title: 'Contact',
            dataIndex: 'contact_number',
            key: 'contact',
            render: (contact_number: any) => {
                const formattedPhone = `(${contact_number?.substring(0, 3)}) ${contact_number?.substring(3, 6)}-${contact_number?.substring(6)}` || '';
                return <div className="phone-no">{contact_number ? formattedPhone : '---'}</div>;
            },
        },
        ...(userRole !== 'researcher'
            ? [{
                title: 'Action',
                dataIndex: 'action',
                key: 'action',
                className: 'action-column',
                // align:'center',
                render: (_id: any, record: any) => {
                    return (
                        <div
                            className="p-2 text-center d-flex justify-content-center"
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {userRole === 'researcher' ? (
                                <DeleteFilled className="text-secondary" />
                            ) : (
                                <Popconfirm
                                    placement="topLeft"
                                    title="Are you sure to delete this patient?"
                                    description="Delete the patient"
                                    onConfirm={() => {
                                        confirmDelete('False', record.id);
                                        setShowSuccessmsg1(true);
                                        setShowErrormsg1(true);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip title="Delete" className="mt-0">
                                        <DeleteFilled className="fs-18 text-danger" />
                                    </Tooltip>
                                </Popconfirm>
                            )}
                        </div>
                    );
                },
            }] : []),
    ];

    const confirmDelete = (val: any, id: number) => {
        setPntID(id);
        const inputJson = {
            conform_data: val,
            patientid: id,
        };
        dispatch(deletePatient(inputJson) as any);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };

    useEffect(() => {
        if (successmsg1) {
            message.success('Patient Deleted successfully');
            setsearchTableval('');
            setPageIndex(1);
            setsearchTableval('');
            getPatientDetails('', 1, pageSize, '', '');
            setShowSuccessmsg1(false);
            setOpenDelModal(false);
            setShowErrormsg1(false);
        }
        if (errormsg1 && error2?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    const showModal = () => {
        setOpenModal(true);
    };

    const handleCancel = () => {
        setOpenModal(false);
    };
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            getPatientDetails(e.target.value, 1, pageSize, '', '');
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            getPatientDetails(e.target.value, 1, pageSize, '', '');
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getPatientDetails(searchTableVal, 1, pageSize, '', '');
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
        getPatientDetails(searchTableVal, pagination.current, pagination.pageSize, sortfield, sort);
    };

    const handleBack = () => {
        setOpenDelModal(false);
        setShowErrormsg1(false);
    };

    const callBackFunc = (val: any) => {
        confirmDelete(val, pntID);
        setShowErrormsg1(false);
    };

    const callBackGrid = (search: string, index: number, pagesize: number, sort: string, field: string) => {
        setsearchTableval(search);
        setPageIndex(index);
        getPatientDetails(search, index, pageSize, sort, field);
    };

    const nextScreen = (val: number, val1: number) => {
        navigate(`/patient-list/patient-medication`, {
            state: {
                patientId: val,
                accountID: val1,
            },
        } as NavigateOptions);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">List of Patients</h5>
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
                    {userRole == 'researcher' ? "" : <Tooltip title="Add New Patient" >
                        <Button type="primary" className='ms-2' onClick={showModal}>
                            Add
                        </Button>
                    </Tooltip>}
                </div>
            </div>
            <div className="my-2">
                <Table
                    className="pointer"
                    rowKey="id"
                    columns={columns}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    onChange={tableChange}
                    onRow={(record: any) => {
                        return {

                            onClick: () => {
                                if (userRole !== 'researcher') {
                                    nextScreen(record.id, record.accountid);
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
            <PatientModal openModal={openModal} closeModal={handleCancel} callBackGrid={callBackGrid} patientData={null} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={7} callBackFunc={callBackFunc} />
        </div>
    );
};

export default Patient;
