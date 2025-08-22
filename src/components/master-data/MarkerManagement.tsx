import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, message, TableProps, Tooltip, Popconfirm, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import dayjs from 'dayjs';
import { deleteMarker, getMarkerList } from 'services/actions/master-data/diagnosisAction';
import DiagSympSupModal from './modal/DiagSympSupModal';
import ReconfirmDeleteModal from './modal/ReconfirmDeleteModal';
import { DeleteFilled } from '@ant-design/icons';

interface DataType {
    key: any;
    sno: number;
    id: any;
    markername: any;
    mfieldname: any;
    mfieldtype: any;
    created_on: any;
    status: any;
    action: any;
}

const MarkerManagement: React.FC = () => {
    const dispatch = useDispatch();
    const { markerInfo, loading2, success9, error9, loading9 } = useSelector((state: any) => state.diagnosis);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading2 ? [] : markerInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [markID, setMarkID] = useState(0);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const delSuccessmsg = showSuccessmsg ? success9 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error9 : null;
    const customMessage = () => <Empty className="p-2" description="No Marker Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getMarker() {
        dispatch(getMarkerList() as any);
    }

    useEffect(() => {
        getMarker();
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
            title: 'Marker Name',
            dataIndex: 'markername',
            key: 'markername',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record.markername.toLowerCase().includes(value.toLowerCase()),
            sorter: (a: any, b: any) => a.markername.length - b.markername.length,
        },
        {
            title: 'Field Name',
            dataIndex: 'mfieldname',
            key: 'mfieldname',
            render: (mfieldname: any) => {
                return <div>{mfieldname ? mfieldname : '---'}</div>;
            },
        },
        {
            title: 'Field Type',
            dataIndex: 'mfieldtype',
            key: 'mfieldtype',
            render: (mfieldtype: any) => {
                return <div>{mfieldtype ? mfieldtype : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                return markerInfo ? dayjs(created_on).format('MM-DD-YYYY') : null;
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
            align: 'center' as const,
            render: (_: any, record: any) => {
                return (
                    <div className="d-flex justify-content-center action-section">
                        <div className="fs-18 pointer my-auto">
                            {record.default_select ? (
                                <Tooltip title="Default marker cannot be deleted" className="mt-0">
                                    <DeleteFilled className="text-danger" />
                                </Tooltip>
                            ) : (
                                <Popconfirm
                                    placement="topLeft"
                                    title="Are you sure to delete this marker?"
                                    description="Delete the marker"
                                    onConfirm={() => {
                                        confirm('False', record.id);
                                        setShowSuccessmsg(true);
                                        setMarkID(record.id);
                                    }}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Tooltip title="Delete" className="mt-0 delete-icon">
                                        <DeleteFilled className="text-danger" />
                                    </Tooltip>
                                </Popconfirm>
                            )}
                        </div>
                    </div>
                );
            },
        },
    ];

    useEffect(() => {
        if (loading9) {
            setShowErrormsg(true);
        }
    }, [loading9]);

    const confirm = (val: any, id: any) => {
        const inputJson = {
            conform_data: val,
            mdmarkerid: id,
        };
        dispatch(deleteMarker(inputJson) as any);
        setMarkID(id);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };
    useEffect(() => {
        if (delSuccessmsg) {
            if (success9?.data === 'Associate with Service Request') {
                setOpenDelModal(true);
                setShowErrormsg(false);
            } else {
                message.success('Marker Deleted successfully');
                setsearchTableval('');
                getMarker();
                setShowSuccessmsg(false);
                setOpenDelModal(false);
                setShowErrormsg(false);
            }
        }
        if (error9?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg(false);
        }
    }, [delSuccessmsg, errormsg]);
    const showModal = () => {
        setOpenModal(true);
        setModalTitle('Add Marker');
    };

    const handleBack = () => {
        setOpenModal(false);
        setOpenDelModal(false);
        setShowErrormsg(false);
    };
    const callBackFunc = (val2: any) => {
        confirm(val2, markID);
        setShowErrormsg(false);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Marker Management</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title='Add New Marker' >
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
                    dataSource={loading2 ? [] : data}
                    loading={loading2}
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
            <DiagSympSupModal openModal={openModal} title={modalTitle} handleBack={handleBack} mid={3} getTblData={getMarker} rowData={null} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={3} callBackFunc={callBackFunc} />
        </div>
    );
};

export default MarkerManagement;
