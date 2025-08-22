import React, { useState, useEffect } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Input } from 'components/shared/FormComponent';
import { Table, Tooltip, Popconfirm, message, TableProps, Empty } from 'components/shared/AntComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import 'assets/styles/table.scss';
import dayjs from 'dayjs';
import { deleteRecoMedic, getRecommendedMedicList } from 'services/actions/master-data/lifestyleAction';
import { url2 } from 'components/shared/CompVariables';
import { EditIcon } from 'assets/img/custom-icons';
import { DeleteFilled } from 'components/shared/AntIcons';
import ReconfirmDeleteModal from './modal/ReconfirmDeleteModal';
import RecommendedMedicModal from './modal/RecommendedMedicModal';

interface DataType {
    key: any;
    sno: number;
    id: any;
    medication_name: any;
    icon: any;
    description: any;
    created_on: any;
    status: any;
    action: any;
}

const RecommendedMedic: React.FC = () => {
    const dispatch = useDispatch();
    const { recomedicInfo, loading1, loading13, success13, error13 } = useSelector((state: any) => state.lifestyle);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading1 ? [] : recomedicInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [rowData, setRowData] = useState(null);
    const [sympID, setSympID] = useState(0);
    const [openDelModal, setOpenDelModal] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const delSuccessmsg = showSuccessmsg ? success13 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error13 : null;
    const [reference, setReference]: any = useState(null);
    const customMessage = () => <Empty className="p-2" description="No Recommended Medication Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getMedicList() {
        dispatch(getRecommendedMedicList() as any);
    }

    useEffect(() => {
        getMedicList();
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
            title: 'Icon',
            dataIndex: 'filepath',
            key: 'filepath',
            render: (filepath: any) => {
                return <div>{filepath !== 'None' && filepath !== null && filepath !== '' ? <img src={`${filepath?.startsWith('https:') ? filepath : ''}`} alt="medic icon" width={60} height={50} /> : '--'}</div>;
            },
            width: '10%',
            align: 'center',
        },
        {
            title: 'Medication Name',
            dataIndex: 'medication_name',
            key: 'medication_name',
            filteredValue: [searchTableVal],
            width: '20%',
            onFilter: (value: any, record: any) => record.medication_name?.toLowerCase().includes(value?.toLowerCase()),
            sorter: (a: any, b: any) => a.medication_name.length - b.medication_name.length,
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            width: '42%',
            render: (description: any) => {
                return <div>{description ? description : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'Created_on',
            key: 'created_on',
            align: 'center',
            render: (Created_on: any) => {
                return recomedicInfo ? dayjs(Created_on).format('MM-DD-YYYY') : null;
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
                                title="Are you sure to delete this medication?"
                                description="Delete the medication"
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
        if (loading13) {
            setShowErrormsg(true);
        }
    }, [loading13]);

    const confirm = (val: any, id: any) => {
        const inputJson = {
            conform_data: val,
            medication_id: id,
        };
        dispatch(deleteRecoMedic(inputJson) as any);
        if (openDelModal === true) {
            setOpenDelModal(false);
        }
    };
    useEffect(() => {
        if (delSuccessmsg) {
            message.success('Recommended Medication Deleted successfully');
            setsearchTableval('');
            getMedicList();
            setShowSuccessmsg(false);
            setOpenDelModal(false);
            setShowErrormsg(false);
        }
        if (error13?.data === 'Associate with Service Request') {
            setOpenDelModal(true);
            setShowErrormsg(false);
        }
    }, [delSuccessmsg, errormsg]);

    const editModal = (val: any) => {
        setOpenModal(true);
        setRowData(val);
        setModalTitle('Update Recommended Medication');
    };

    const showModal = () => {
        setOpenModal(true);
        setRowData(null);
        setModalTitle('Add Recommended Medication');
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
                <h5 className="my-auto">Recommended Medication</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Tooltip title="Add New Medication" >
                        <Button type="primary" onClick={showModal}>
                            Add
                        </Button>
                    </Tooltip>
                </div>
            </div>
            <div className="my-2 row mx-0">
                <div className="col-md-9 ps-0">
                    <Table
                        className="pointer"
                        rowKey="id"
                        columns={columns}
                        dataSource={loading1 ? [] : data}
                        loading={loading1}
                        locale={customLocale}
                        scroll={{ x: 'calc(230px + 50%)' }}
                        onRow={(record: any) => {
                            return {
                                onClick: () => {
                                    setReference(record);
                                },
                                className: record.id === (reference?.id ?? null) ? 'selected-reference' : '',
                            };
                        }}
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
                <div className="col-md-3 bg-white rounded right-card-border p-0">
                    <div className="bg-lightblue p-3">
                        <h6 className="text-center fs-17 my-auto">References</h6>
                    </div>
                    {reference ? (
                        <div className="p-2 text-sm">
                            <h6>
                                Medication Name: <span className="text-secondary">{reference.medication_name}</span>
                            </h6>
                            <h6>References: </h6>
                            <div className="ref-section">
                                {reference?.MdMedcRef?.map((item: any, i: number) => {
                                    return (
                                        <div className="report-content border-bottom" key={i}>
                                            {item.ref_name}
                                            <p>
                                                <a className="text-primary ">{item.ref_url}</a>
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="p-2 text-center mt-5 text-secondary report-content">No Medication Selected</div>
                    )}
                </div>
            </div>
            <RecommendedMedicModal openModal={openModal} title={modalTitle} handleBack={handleBack} mid={4} getTblData={getMedicList} rowData={rowData} />
            <ReconfirmDeleteModal openModal={openDelModal} handleBack={handleBack} mid={4} callBackFunc={callBackFunc} />
        </div>
    );
};

export default RecommendedMedic;
