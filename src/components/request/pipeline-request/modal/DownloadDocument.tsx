import React, { useEffect, useState } from 'react';
import { Modal, Spin, Progress } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { documentDownload, getDocumentList } from 'services/actions/pipeline/pipelineAction';
import { DownloadIcon } from 'assets/img/custom-icons';
import { Button } from 'components/shared/ButtonComponent';
import FileSaver from 'file-saver';
import axios from 'axios';

interface ChildProps {
    rowData: any;
    openModal: boolean;
    closeModal: () => void;
}

const DownloadDocument: React.FC<ChildProps> = ({ rowData, openModal, closeModal }) => {
    const dispatch = useDispatch();
    const { loading2, docListInfo, downloadInfo } = useSelector((state: any) => state.pipeline);
    const excelDownProgress = useSelector((state: any) => state.download.excelDownProgress);
    const customFormat = (percent) => `${percent}%`;
    const docDetails = !loading2 ? docListInfo?.DocumentDetail : [];
    const [fileName, setFileName]: any = useState('');
    const [visible, setVisible] = useState(true);
    const [downProgress, setDownProgress] = useState(0);

    function getDownloadDocuments() {
        const inputJson = {
            service_request: rowData?.id,
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
        if (visible) {
            const timer = setTimeout(() => {
                if (downProgress == 100) {
                    setVisible(false);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }

        return undefined;
    }, [excelDownProgress]);

    useEffect(() => {
        if (downloadInfo && openModal) {
            downloadDocument();
        }
    }, [downloadInfo]);

    const downloadDocument = () => {
        const fileExt = fileName?.split('.').pop();
        if (fileExt == 'edf') {
            const bytes = new Uint8Array(
                atob(downloadInfo?.data?.encodefiledata)
                    .split('')
                    .map((char) => char.charCodeAt(0)),
            );
            const blob = new Blob([bytes], { type: 'text/plain;charset=utf-8;base64' });
            FileSaver.saveAs(blob, `${fileName}.edf`);
        } else return;
    };

    useEffect(() => {
        if (openModal) {
            getDownloadDocuments();
        }
    }, [openModal]);

    const handleDownload = async (urls: any, fname: string) => {
        try {
            const url = urls;
            // const fileFormat = getFileFormat(urls);
            const response = await axios.get(url, {
                responseType: 'blob', // Ensure that the response is treated as a blob
                headers: {
                    'Content-Type': 'application/pdf', // Adjust based on your server's response content type
                },
                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                         setDownProgress(percentCompleted);
                         setVisible(true);
                    }
                },
            });
            //  setDownloadPercent(0);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fname}`;
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('There was a problem with the download operation:', error);
        } finally {
             setDownProgress(0);
        }

    };
    return (
        <div>
            <Modal
                title="Download Document(s)"
                open={openModal}
                onCancel={() => closeModal()}
                footer={
                    <Button className="bg-danger text-white border-0" onClick={closeModal}>
                        Close
                    </Button>
                }
            >
                <div className="bg-aliceblue border d-flex ps-3 pe-2 py-2 mb-3">
                    <div className="col">
                        <h6>Request No</h6>
                        <p>{rowData?.encoded_RequestNumber}</p>
                    </div>
                    <div className="col">
                        <h6>Patient Name</h6>
                        <p>{rowData?.patient_name}</p>
                    </div>
                    <div className="col">
                        <h6>Account Name</h6>
                        <p>{rowData?.account_name}</p>
                    </div>
                </div>
                <div className="doc-list">
                    <Spin spinning={loading2}>
                        <h6 className="text-dark">List of Documents</h6>

                        {docDetails?.map((item: any) => {
                            return (
                                <div className="d-flex p-2 bg-light justify-content-between mb-2" key={item.id}>
                                    <div className="col-md-6 my-auto text-break">{item.orginal_name}</div>
                                    <div className="col my-auto ps-3">{item.doc_type}</div>
                                    <div className="col my-auto">{item.size}</div>
                                    <div className="col-auto my-auto ms-auto">
                                        <div className="px-2 py-1 pointer rounded-circle bg-ligtblue"
                                            // onClick={() => downloadFile(item?.id, item?.filename)}
                                            onClick={() => handleDownload(item.download_link, item.filename)}
                                        >
                                            {/* <a href={item.download_link} download={item?.filename}> */}
                                            <DownloadIcon />
                                            {/* </a> */}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {docDetails?.length === 0 ? <div className="bg-light p-5 text-center">{loading2 ? 'Loading...' : 'No Documents available'}</div> : ''}


                    </Spin>
                    {downProgress && visible ? (
                        <Progress
                            percent={downProgress}
                            strokeColor={{
                                '0%': '#1F98DF',
                                '100%': '#87d068',
                            }}
                            format={customFormat}
                        />
                    ) : (
                        ''
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default DownloadDocument;
