import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { Empty } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Table, Tooltip, TableProps } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { Input } from 'components/shared/FormComponent';
import SearchIcon from 'assets/img/search.svg';
import AddAmplifier from './modal/AddAmplifier';
import dayjs from 'dayjs';
import { getAmplifierList } from 'services/actions/master-data/amplifierAction';


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

const Amplifier: React.FC = () => {
    const dispatch = useDispatch();
    const { amplifierInfo, loading } = useSelector((state: any) => state.amplifier);
    const [searchTableVal, setsearchTableval] = useState('');
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const data = loading ? [] : amplifierInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [rowData, setRowData]: any = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const customMessage = () => <Empty className="p-2" description="No Amplfier Available" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getAmpliifier() {
        const payload = {};
        dispatch(getAmplifierList(payload) as any);
    }

    useEffect(() => {
        getAmpliifier();
    }, []);

    const showModal = () => {
        setOpenModal(true);
        setModalTitle('Add Amplifier');
    };

    const handleBack = () => {
        setOpenModal(false);
    };

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
            title: 'Amplifier Name',
            dataIndex: 'amplifier_name',
            key: 'amplifier_name',
            filteredValue: [searchTableVal],
            onFilter: (value: any, record: any) => record?.amplifier_name.toLowerCase()?.includes(value?.toLowerCase()),
            sorter: (a: any, b: any) => a?.amplifier_name.length - b?.amplifier_name.length,
        },
        {
            title: 'Electrode Type',
            dataIndex: 'electrode_type',
            key: 'electrode_type',
            render: (electrode_type: any) => {
                return <div>{electrode_type ? electrode_type : '---'}</div>;
            },
        },
        {
            title: 'Communication Method',
            dataIndex: 'communication_method',
            key: 'communication_method',
            render: (communication_method: any) => {
                return <div>{communication_method ? communication_method : '---'}</div>;
            },
        },
        {
            title: 'Allowed Electrode',
            dataIndex: 'allowed_electrode',
            key: 'allowed_electrode',
            render: (allowed_electrode: any) => {
                return <div>{allowed_electrode ? allowed_electrode : '---'}</div>;
            },
        },
        {
            title: 'Max Electrode',
            dataIndex: 'max_electrode',
            key: 'max_electrode',
            render: (max_electrode: any) => {
                return <div>{max_electrode ? max_electrode : '---'}</div>;
            },
        },
        {
            title: 'Allowed Duration',
            dataIndex: 'allowed_duration',
            key: 'allowed_duration',
            render: (allowed_duration: any) => {
                return <div>{allowed_duration ? allowed_duration : '---'}</div>;
            },
        },
        {
            title: 'Submitted Date',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                return amplifierInfo ? dayjs(created_on).format('MM-DD-YYYY') : null;
            },
        },
        {
            title: 'Action',
            dataIndex: 'action',
            key: 'action',
            render: (action, record) => {
                return (
                    <>
                        <Tooltip title="Edit" className="mt-0">
                            <div className="fs-20 edit-icon-master pointer my-auto me-1 text-success pb-1"
                                onClick={() => {
                                    setOpenModal(true);
                                    setRowData(record);
                                    setModalTitle('Update Amplifier');
                                }}
                            >
                                <EditIcon  />
                            </div   >
                        </Tooltip>
                    </>
                );
            },
        },
    ];

    return (
        <div className="p-2">
             <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Amplifier</h5>
                <div className="ms-auto d-flex">
                    <Input
                        prefix={<img src={SearchIcon} height="14px" />}
                        value={searchTableVal}
                        defaultValue={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        className="search-input me-2 col px-2 rounded fs-14"
                        placeholder="Search"
                    />
                    <Button type="primary" onClick={showModal}>
                        Add
                    </Button>
                </div>
             </div>

             <div className="my-2">
                <Table
                    className="pointer"
                    rowKey="id"
                    locale={customLocale}
                    columns={columns}
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
            <AddAmplifier openModal={openModal} title={modalTitle} handleBack={handleBack} mid={4} getTblData={getAmpliifier} rowData={rowData} />

        </div>
    )
};

export default Amplifier;
