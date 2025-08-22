import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, Tooltip, Popconfirm, message, TableProps, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import dayjs from 'dayjs';
import { deleteLifestyle, getLifestyleList } from 'services/actions/master-data/lifestyleAction';
import { EditIcon } from 'assets/img/custom-icons';
import { DeleteFilled } from 'components/shared/AntIcons';
import DiagSympSupModal from './modal/DiagSympSupModal';
import ReconfirmDeleteModal from './modal/ReconfirmDeleteModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    lifestyle_name: any;
    lifestyle_hint: any;
    created_on: any;
    status: any;
    action: any;
}

const Lifestyle: React.FC = () => {
    const dispatch = useDispatch();
    const { lifestyleInfo, loading, loading12, success12, error12 } = useSelector((state: any) => state.lifestyle);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading ? [] : lifestyleInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [rowData, setRowData]: any = useState(null);
    const [sympID, setSympID] = useState(0);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const delSuccessmsg = showSuccessmsg ? success12 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error12 : null;
    const customMessage = () => <Empty className="p-2" description="No Lifestyle Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getLifestyle() {
        dispatch(getLifestyleList() as any);
    }

    useEffect(() => {
        getLifestyle();
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
            title: 'Lifestyle Name',
            dataIndex: 'lifestyle_name',
            key: 'lifestyle_name',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record.lifestyle_name.toLowerCase().includes(value.toLowerCase()),
            sorter: (a: any, b: any) => a.lifestyle_name.length - b.lifestyle_name.length,
        },
        {
            title: 'Hint',
            dataIndex: 'lifestyle_hint',
            key: 'lifestyle_hint',
            render: (lifestyle_hint: any) => {
                return <div>{lifestyle_hint ? lifestyle_hint : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                return lifestyleInfo ? dayjs(created_on).format('MM-DD-YYYY') : null;
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
                        <Tooltip title="Edit">
                            <div className="fs-20 edit-icon pointer my-auto me-1 text-success pb-1" onClick={() => editModal(record)}>
                                <EditIcon />
                            </div>
                        </Tooltip>
                        <div className="fs-18 pointer my-auto">
                            <Popconfirm
                                placement="topLeft"
                                title="Are you sure to delete this lifestyle?"
                                description="Delete the lifestyle"
                                onConfirm={() => {
                                    confirm('False', record.id);
                                    setShowSuccessmsg(true);
                                    setSympID(record.id);
                                }}
                                okText="Yes"
                                cancelText="No"
                            >
                                <Tooltip title="Delete" className="mt-0 delete-icon">
                                    <DeleteFilled className="text-danger " />
                                </Tooltip>
                            </Popconfirm>
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (loading12) {
            setShowErrormsg(true);
        }
    }, [loading12]);

    const confirm = (val: any, id: any) => {
        const inputJson = {
            conform_data: val,
            lifestyleid: id,
        };
        dispatch(deleteLifestyle(inputJson) as any);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };
    useEffect(() => {
        if (delSuccessmsg) {
            message.success('Lifestyle Deleted successfully');
            setsearchTableval('');
            getLifestyle();
            setShowSuccessmsg(false);
            setOpenDelModal(false);
            setShowErrormsg(false);
        }
        if (error12?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg(false);
        }
    }, [delSuccessmsg, errormsg]);

    const editModal = (val: any) => {
        setOpenModal(true);
        setModalTitle('Update Lifestyle');
        const value = { id: val?.id, name: val.lifestyle_name, desc: val.lifestyle_hint };
        setRowData(value);
    };

    const showModal = () => {
        setOpenModal(true);
        setModalTitle('Add Lifestyle');
        setRowData(null);
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
                <h5 className="my-auto ">Lifestyle</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title="Add New Lifestyle" >
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
            <DiagSympSupModal openModal={openModal} title={modalTitle} handleBack={handleBack} mid={2} getTblData={getLifestyle} rowData={rowData} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={2} callBackFunc={callBackFunc} />
        </div>
    );
};

export default Lifestyle;
