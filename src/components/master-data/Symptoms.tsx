import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { message, Table, Tooltip, Popconfirm, TableProps, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import dayjs from 'dayjs';
import { deleteSymptoms, getSymptomsList } from 'services/actions/master-data/diagnosisAction';
import { DeleteFilled } from 'components/shared/AntIcons';
import { EditIcon } from 'assets/img/custom-icons';
import DiagSympSupModal from './modal/DiagSympSupModal';
import ReconfirmDeleteModal from './modal/ReconfirmDeleteModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    symptoms_name: any;
    symptoms_hint: any;
    created_on: any;
    status: any;
    action: any;
}

const Symptoms: React.FC = () => {
    const dispatch = useDispatch();
    const { symptomsInfo, loading1, success10, error10, loading10 } = useSelector((state: any) => state.diagnosis);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading1 ? [] : symptomsInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [rowData, setRowData]: any = useState(null);
    const [sympID, setSympID] = useState(0);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const delSuccessmsg = showSuccessmsg ? success10 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error10 : null;
    const customMessage = () => <Empty className="p-2" description="No Symptoms Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getSymptoms() {
        dispatch(getSymptomsList() as any);
    }

    useEffect(() => {
        getSymptoms();
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
            title: 'Symptoms Name',
            dataIndex: 'symptoms_name',
            key: 'symptoms_name',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record.symptoms_name.toLowerCase().includes(value.toLowerCase()),
            sorter: (a: any, b: any) => a.symptoms_name.length - b.symptoms_name.length,
        },
        {
            title: 'Hint',
            dataIndex: 'symptoms_hint',
            key: 'symptoms_hint',
            render: (symptoms_hint: any) => {
                return <div>{symptoms_hint ? symptoms_hint : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                return symptomsInfo ? dayjs(created_on).format('MM-DD-YYYY') : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align:'center',
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
                        <Tooltip title="Edit" >
                            <div className="fs-20 edit-icon pointer my-auto me-1 text-success pb-1" onClick={() => editModal(record)}>
                                <EditIcon />
                            </div>
                        </Tooltip>
                        <div className="fs-18 pointer my-auto">
                            <Popconfirm
                                placement="topLeft"
                                title="Are you sure to delete this symptoms?"
                                description="Delete the symptoms"
                                onConfirm={() => {
                                    confirm('False', record.id);
                                    setShowSuccessmsg(true);
                                    setSympID(record.id);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Delete" className="mt-0 delete-icon">
                                    <DeleteFilled className="text-danger" />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    </div>
                );
            },
        },
    ];
    useEffect(() => {
        if (loading10) {
            setShowErrormsg(true);
        }
    }, [loading10]);

    const confirm = (val: any, id: any) => {
        const inputJson = {
            conform_data: val,
            mdsymptomid: id,
        };
        dispatch(deleteSymptoms(inputJson) as any);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };
    useEffect(() => {
        if (delSuccessmsg) {
            message.success('Symptoms Deleted successfully');
            setsearchTableval('');
            getSymptoms();
            setShowSuccessmsg(false);
            setOpenDelModal(false);
            setShowErrormsg(false);
        }
        if (error10?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg(false);
        }
    }, [delSuccessmsg, errormsg]);

    const editModal = (val: any) => {
        setOpenModal(true);
        const value = { id: val.id, name: val.symptoms_name, desc: val.symptoms_hint };
        setRowData(value);
        setModalTitle('Update Symptoms');
    };
    const showModal = () => {
        setOpenModal(true);
        setModalTitle('Add Symptoms');
    };

    const handleBack = () => {
        setOpenModal(false);
        setOpenDelModal(false);
        setShowErrormsg(false);
    };
    const callBackFunc = (val2: any) => {
        confirm(val2, sympID);
        setShowErrormsg(false);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Symptoms</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title="Add New Symptoms" >
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
                    dataSource={loading1 ? [] : data}
                    loading={loading1}
                    locale={customLocale}
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
            <DiagSympSupModal openModal={openModal} title={modalTitle} handleBack={handleBack} mid={6} getTblData={getSymptoms} rowData={rowData} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={6} callBackFunc={callBackFunc} />
        </div>
    );
};

export default Symptoms;
