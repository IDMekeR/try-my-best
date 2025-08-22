import React, { useEffect, useState } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { useLocation } from 'react-router-dom';
import { deleteAssDocument, getDocumentList } from 'services/actions/pipeline/pipelineAction';
import { useSelector, useDispatch, url2 } from 'components/shared/CompVariables';
import { message, Popconfirm, Table, TableProps, Tooltip, Progress, Empty } from 'components/shared/AntComponent';
import { ExclamationCircleTwoTone } from 'components/shared/AntIcons';
import { DownloadIcon, EditIcon } from 'assets/img/custom-icons';
import { DeleteFilled } from '@ant-design/icons';
import UploadAssociateFile from '../../modal/UploadAssociateFile';
import axios from 'axios';
import { getWizardSteps } from 'services/actions/pipeline/stepwizardAction';

interface DataType {
    doc_type: any;
    equipment_type: string;
    created_on: any;
    id: any;
    orginal_name: string;
}

const AssociatedFile: React.FC = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { docListInfo, loading2, success13, error13 } = useSelector((state: any) => state.pipeline);
    const data = !loading2 ? docListInfo?.DocumentDetail : [];
    const [downloadPercent, setDownloadPercent] = useState(0);
    const [isDownload, setIsDownload] = useState(false);
    const [openUploadModal, setOpenUploadModal] = useState(false);
    const [rowData, setRowData]: any = useState(null);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success13 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error13 : false;
    const userRole = sessionStorage.getItem('role');
    const [docType, setDocType] = useState('');
    const customMessage = () => <Empty className="p-2" description="No File Associated" />;
    const customLocale = {
        emptyText: customMessage,
    };

    function getDocuments() {
        const inputJson = {
            service_request: location.state?.id,
            DataFinder: {
                pagesize: 1000,
                currentpage: 1,
                sortbycolumn: 'created_on',
                sortby: 'desc',
                searchdata: '',
            },
        };
        dispatch(getDocumentList(inputJson) as any);
    }

    useEffect(() => {
        getDocuments();
    }, []);

    const downloadFile = async (file: any, fileName: string) => {
        setDownloadPercent(0);
        setIsDownload(true);

        try {
            const url = file;
            const response = await axios.get(url, {
                responseType: 'blob', // Ensure that the response is treated as a blob
                headers: {
                    'Content-Type': 'application/octet-stream', // Adjust based on your server's response content type
                },
                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloadPercent(percentCompleted);
                    }
                },
            });
            setDownloadPercent(0);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName || 'download';
            link.click();
            setIsDownload(false);

            // Clean up the URL object
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('There was a problem with the download operation:', error);
        } finally {
            setDownloadPercent(0);
        }
    };

    const columns: TableProps<DataType>['columns'] = [
        { title: 'File Name', key: 'orginal_name', dataIndex: 'orginal_name' },
        {
            title: 'Document type',
            key: 'doc_type',
            dataIndex: 'doc_type',
            width: '200px',
            render: (doc_type: any) => {
                if (doc_type?.toLowerCase() === 'eye open') {
                    return <span className="bg-lightgreen px-2 py-1 rounded fw-bold fs-14 ">{doc_type}</span>;
                } else if (doc_type?.toLowerCase() === 'eye close') {
                    return <span className="bg-lightprimary px-2 py-1 fw-bold fs-14 rounded">{doc_type}</span>;
                } else {
                    return <span className="bg-lightred px-2 py-1 fw-bold fs-14 rounded">{doc_type}</span>;
                }
            },
        },
        {
            title: 'Equipment type',
            key: 'equipment_type',
            dataIndex: 'equipment_type',
            render: (equipment_type: any) => {
                return <div>{equipment_type || '---'}</div>;
            },
        },
        {
            title: 'Uploaded On',
            key: 'created_on',
            dataIndex: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return docListInfo ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'File size',
            key: 'size',
            dataIndex: 'size',
        },
        {
            title: 'Action',
            key: 'action',
            dataIndex: 'action',
            align: 'center',
            render: (_: any, record: any) => {
                return (
                    <div className="d-flex my-auto justify-content-center align-items-center">
                        {record.doc_type?.toLowerCase() === 'result' || userRole === 'researcher' || location?.state?.reqDetail?.archive_data ? (
                            <Tooltip title="Result document cannot be edited" className="">
                                <div className=" text-secondary mb-2 col-auto icon-edit-disabled">
                                    <EditIcon />
                                </div>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Edit" className="">
                                <div className="edit-icon text-success mt-1 col-auto" onClick={() => showEditModal(record)}>
                                    <EditIcon />
                                </div>
                            </Tooltip>
                        )}
                        {
                            (location?.state?.reqDetail?.archive_data || userRole === 'researcher' ?
                                <Tooltip title="Document cannot be deleted" className="">
                                    <span>
                                        <DeleteFilled className="text-secondary mb-1 col-auto me-2" />
                                    </span>
                                </Tooltip>
                                :
                                (record.doc_from == 3 ? (
                                    <Tooltip title="Datahub result file cannot be deleted" className="">
                                        <span>
                                            <ExclamationCircleTwoTone className="mb-1 col-auto me-2" twoToneColor="#ff9966" />
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <Tooltip title="Delete File" className="">
                                        <Popconfirm title="" description="Are you sure to delete this document?" onConfirm={() => removeDocument(record.id, record.doc_type)} okText="Yes" cancelText="No">
                                            <span>
                                                <DeleteFilled className="text-danger mb-1 col-auto me-2" />
                                            </span>
                                        </Popconfirm>
                                    </Tooltip>
                                ))
                            )
                        }
                        <div className="col-auto ">
                            {
                                location?.state?.reqDetail?.archive_data || userRole === 'researcher' ?
                                    <Tooltip title="Result document cannot be downloaded" className="">
                                        <div className="col-auto icon-download-disabled">
                                            <DownloadIcon />
                                        </div>
                                    </Tooltip>
                                    :
                                    <Tooltip title="Download" className="">
                                        <span className="pointer" onClick={() => downloadFile(record?.download_link, record?.orginal_name)}>
                                            <DownloadIcon />
                                        </span>
                                    </Tooltip>
                            }
                        </div>
                    </div>
                );
            },
        },
    ];

    const showUploadModal = () => {
        setOpenUploadModal(true);
        setRowData(null);
    };

    const removeDocument = (id: any, type: any) => {
        const inputJson = {
            docid: id,
        };
        setDocType(type);
        dispatch(deleteAssDocument(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    const showEditModal = (val: any) => {
        setRowData(val);
        setOpenUploadModal(true);
    };
    const closeUploadModal = () => {
        setOpenUploadModal(false);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Document deleted successfully');
            setShowSuccessmsg(false);
            getDocuments();
            if (docType?.toLowerCase() == 'result') {
                getStepsDetails();
            }
        }
        if (errormsg) {
            if (error13?.data) {
                message.error(error13?.data);
            } else {
                message.error("Document couldn't be deleted");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    function getStepsDetails() {
        dispatch(getWizardSteps(location?.state?.id) as any);
    }
    return (
        <div className="h-100 associated-file">
            <div className="bg-white p-3 h-100">
                <div className="d-flex">
                    <h6 className="fs-17 my-auto">List of Associated Files</h6>
                    {
                        userRole !== 'researcher' &&
                        <Tooltip title={location?.state?.reqDetail?.archive_data ? 'Document cannot be uploaded' : 'upload'} >
                            <Button
                                type="primary"
                                className="ms-auto col-auto"
                                disabled={location?.state?.reqDetail?.archive_data}
                                onClick={showUploadModal}
                            >
                                Upload
                            </Button>
                        </Tooltip>
                    }
                </div>
                <div className="custom-table custom-table-light associate-table mt-2 ">
                    <Table rowKey="id" columns={columns} dataSource={data} loading={loading2} className="border pointer" scroll={{ x: 'calc(230px + 50%)' }}
                        locale={customLocale} />
                </div>
                {!isDownload ? (
                    ''
                ) : (
                    <div className="mt-3">
                        Downloading...
                        <Progress size={['100%', 20]} percent={downloadPercent} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                    </div>
                )}
            </div>
            <UploadAssociateFile openModal={openUploadModal} closeModal={closeUploadModal} rowData={rowData} getDocuments={getDocuments} getStepsDetails={getStepsDetails} />
        </div>
    );
};

export default AssociatedFile;
