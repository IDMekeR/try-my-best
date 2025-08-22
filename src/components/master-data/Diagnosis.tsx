import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, Tooltip, message, Popconfirm, TableProps, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import dayjs from 'dayjs';
import { DeleteFilled } from 'components/shared/AntIcons';
import { deleteDiagnosis, getDiagnosisList } from 'services/actions/master-data/diagnosisAction';
import { EditIcon } from 'assets/img/custom-icons';
import DiagSympSupModal from './modal/DiagSympSupModal';
import ReconfirmDeleteModal from './modal/ReconfirmDeleteModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    diagnosis_name: any;
    diagnosis_hint: any;
    created_on: any;
    status: any;
    action: any;
}

const Diagnosis: React.FC = () => {
    const dispatch = useDispatch();
    const { diagnosisInfo, loading, loading8, success8, error8 } = useSelector((state: any) => state.diagnosis);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading ? [] : diagnosisInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [diagID, setDiagID] = useState(0);
    const [rowData, setRowData]: any = useState(null);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const delSuccessmsg = showSuccessmsg ? success8 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error8 : null;
    const customMessage = () => <Empty className="p-2" description="No Diagnosis Available" />;
    const customLocale = {
        emptyText: customMessage,
    };
    function getDiagnosis() {
        dispatch(getDiagnosisList() as any);
    }

    useEffect(() => {
        getDiagnosis();
    }, []);

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'S.no',
            dataIndex: 'sno',
            key: 'sno',
            render: (id: any, record: any, index: number) => {
                if (pageIndex === 1) {
                    return index + 1;
                } else {
                    return (pageIndex - 1) * pageSize + (index + 1);
                }
            },
        },
        {
            title: 'Diagnosis Name',
            dataIndex: 'diagnosis_name',
            key: 'diagnosis_name',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record.diagnosis_name.toLowerCase().includes(value.toLowerCase()),
            sorter: (a: any, b: any) => a.diagnosis_name.length - b.diagnosis_name.length,
        },
        {
            title: 'Hint',
            dataIndex: 'diagnosis_hint',
            key: 'diagnosis_hint',
            render: (diagnosis_hint: any) => {
                return <div>{diagnosis_hint ? diagnosis_hint : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                return diagnosisInfo ? dayjs(created_on).format('MM-DD-YYYY') : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center' as const,
            render: (status: any) => {
                return (
                    <div className="status-section mx-auto">
                        <Button className="success-btn fw-bold">{status}</Button>
                    </div>
                );
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div className="d-flex justify-content-center action-section">
                        <Tooltip title="Edit" className="mt-0">
                            <div className="fs-20 edit-icon pointer my-auto me-1 text-success pb-1" onClick={() => editModal(record)}>
                                    <EditIcon />
                            </div>
                        </Tooltip>
                        <div className="fs-18 pointer my-auto">
                            <Popconfirm
                                placement="topLeft"
                                title="Are you sure to delete this diagnosis?"
                                description="Delete the diagnosis"
                                onConfirm={() => {
                                    confirm('False', record.id);
                                    setShowSuccessmsg(true);
                                    setDiagID(record.id);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Delete" className="mt-0">
                                    <DeleteFilled className="text-danger delete-icon " />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (loading8) {
            setShowErrormsg(true);
        }
    }, [loading8]);

    const confirm = (val: any, id: any) => {
        const inputJson = {
            conform_data: val,
            mddiagnosisid: id,
        };
        dispatch(deleteDiagnosis(inputJson) as any);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };
    useEffect(() => {
        if (delSuccessmsg) {
            message.success('Diagnosis Deleted successfully');
            setsearchTableval('');
            getDiagnosis();
            setShowSuccessmsg(false);
            setOpenDelModal(false);
            setShowErrormsg(false);
        }
        if (errormsg && error8?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg(false);
        }
    }, [delSuccessmsg, errormsg]);

    const editModal = (val: any) => {
        setOpenModal(true);
        const value = { id: val.id, name: val.diagnosis_name, desc: val.diagnosis_hint };
        setRowData(value);
        setModalTitle('Update Diagnosis');
    };
    const showModal = () => {
        setOpenModal(true);
        setRowData(null);
        setModalTitle('Add Diagnosis');
    };

    const handleBack = () => {
        setOpenModal(false);
        setOpenDelModal(false);
        setShowErrormsg(false);
    };
    const callBackFunc = (val2: any) => {
        confirm(val2, diagID);
        setShowErrormsg(false);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Diagnosis</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title="Add New Diagnosis" className="mt-0">
                        <Button type="primary" onClick={showModal}>
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
                    locale={customLocale}
                    dataSource={loading ? [] : data}
                    loading={loading}
                    scroll={{ x: 'calc(230px + 50%)'}}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        onChange: (page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                        },
                    }}
                />
            </div>
            <DiagSympSupModal openModal={openModal} title={modalTitle} handleBack={handleBack} mid={1} getTblData={getDiagnosis} rowData={rowData} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={1} callBackFunc={callBackFunc} />
        </div>
    );
};

export default Diagnosis;
