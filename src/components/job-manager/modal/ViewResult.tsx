import React, { useEffect, useState } from 'react';
import { triggerBase64Download } from 'common-base64-downloader-react';
import { Modal, Spin, Image, Progress, ProgressProps } from 'components/shared/AntComponent';
import { url2, useDispatch, useSelector } from 'components/shared/CompVariables';
import axios from 'axios';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { Button } from 'components/shared/ButtonComponent';
import { getXlsxData } from 'services/actions/jobManagerAction';

interface ChildProps {
    data: any;
    reqNo: string;
    jobID: any;
}
const ViewResult: React.FC<ChildProps> = ({ data, reqNo, jobID }) => {
    const dispatch = useDispatch();
    const [pageData1, setPageData1] = useState('');
    const [pageData2, setPageData2] = useState('');
    const [loading, setLoading] = useState(false);
    const [imgData, setImgData] = useState('');
    const { xlsxInfo, loading7 } = useSelector((state: any) => state.jobManager);
    const { downloadProgress } = useSelector((state: any) => state.download);
    const [showDownload, setShowDownload] = useState(false);
    const [fileData, setFileData] = useState('');
    const [count, setCount] = useState(1);
    const [downloading, setDownloading] = useState(0);
    const [docLoad, setDocLoad] = useState(false);

    const docs = [{ uri: docLoad ? fileData : "", fileName: reqNo + data?.rowData?.step_name + '.' + data?.rowData?.output_type }];

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    function getTxtFile() {
        setPageData1('');
        setPageData2('');
        if (data?.rowData?.output_type == 'txt') {
            setLoading(true);
            const url = data?.rowData?.output_file && data?.rowData?.output_file != 'None' ? data?.rowData?.output_file : '';
            axios
                .get(url)
                .then((res: any) => {
                    const page1Data = res.data?.page1_data;
                    const page2Data = res.data?.page2_data;
                    setPageData1(page1Data);
                    setPageData2(page2Data);
                    setLoading(false);
                })
                .catch((error: any) => {
                    console.log('Error fetching data:', error);
                });
        }
    }

    const convertBlobToBase64 = (blob: Blob) => {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                resolve(base64String);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);  // Converts the blob to base64
        });
    };
    const getFileBlob = async (file: any, type: any) => {
        try {
            const url = file;
            const response = await axios.get(url, {
                responseType: 'blob', // Ensure that the response is treated as a blob
                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloading(percentCompleted);
                        setDocLoad(false);
                    }
                },
            });
            setDownloading(0);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            // const link = document.createElement('a');
            const fileUrl = URL.createObjectURL(blob);
            const base64String = await convertBlobToBase64(blob);
            const pdfBase64String = base64String.replace("data:application/octet-stream;base64,", "data:application/pdf;base64,");

            setFileData(pdfBase64String);
            setDocLoad(true);
            // Clean up the URL object
            URL.revokeObjectURL(fileUrl);
        } catch (error) {
            console.error('There was a problem with the download operation:', error);
        } finally {
            setDownloading(0);
        }
    }

    useEffect(() => {
        if (data?.openModal) {
            setCount(1);
            setLoading(true);
            setImgData('');
            setPageData1('');
            setPageData2('');
            if (data?.rowData?.output_type === 'txt') {
                getTxtFile();
            } else if (data?.rowData?.output_type == 'png') {
                setImgData(data?.rowData?.output_file?.startsWith('https:') ? data?.rowData?.output_file : '');
            } else if (data?.rowData?.output_type == 'pdf' && data?.rowData?.output_file && data?.rowData?.output_file !== 'None') {
                getFileBlob(data?.rowData?.output_file, data?.rowData?.output_type);
            }
            // else if (data?.rowData?.output_type == 'xlsx' || data?.rowData?.output_type == 'xls') {
            //     getFileBlob(data?.rowData?.output_file, data?.rowData?.output_type);
            // }
        }
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [data?.rowData, data.openModal]);


    const downloadFile = async () => {
        if (data?.rowData?.output_file && data?.rowData?.output_file !== '') {
            try {
                const url = data?.rowData?.output_file?.startsWith('https:') ? data?.rowData?.output_file : ''; // Replace with your file URL
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const blob = await response.blob();
                const href = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = href;
                link.download = reqNo + data?.rowData?.step_name + '.' + data?.rowData?.output_type || 'download.xlsx'; // Set your desired file name here
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (error) {
                console.error('Error downloading the file: ', error);
                // Handle error as needed
            }
        } else {
            if (count == 1) {
                const inputJson = {
                    job_id: jobID || 0,
                    step_id: data?.rowData?.step_id || 0,
                };
                dispatch(getXlsxData(inputJson) as any);
            }
            setShowDownload(true);
        }
    };

    useEffect(() => {
        if (xlsxInfo?.step_output?.output && showDownload) {
            triggerBase64Download(
                `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${xlsxInfo?.step_output?.output}`,
                `${reqNo + data?.rowData?.step_name + '.' + data?.rowData?.output_type}`,
            );
            setShowDownload(false);
            setCount(2);
        }
    }, [showDownload, xlsxInfo]);

    return (
        <div>
            <Modal
                title={data?.rowData?.step_name + ': ' + data?.docType}
                open={data.openModal}
                onCancel={data.handleCancel}
                width={data.rowData?.step_name === 'PDR-Topography' ? 800 : data.rowData?.output_type === 'txt' ? 1500 : 1200}
                footer={null}
            >
                <Spin spinning={loading}>
                    <div className="text-center">
                        {data?.rowData?.output_type === 'png' ? (
                            !loading && imgData ? (
                                <Image src={imgData} alt="edf-step-result" />
                            ) : (
                                <div className='p-4 w-100  text-center'>
                                    <span className="loading-dots">Loading<span className="dot-animation"></span></span>
                                </div>
                            )
                        ) : data?.rowData?.output_type === 'txt' ? (
                            !loading && pageData1 && pageData2 ? (
                                <div className="d-flex">
                                    <Image src={`data:image/png;base64,${pageData1}`} alt="first-image" />
                                    <Image src={`data:image/png;base64,${pageData2}`} alt="last-image" />
                                </div>
                            ) : (
                                <div className='p-4 w-100 text-center'>
                                    <span className="loading-dots">Loading<span className="dot-animation"></span></span>
                                </div>
                            )
                        ) : (
                            <div className="set-height overflow-auto">
                                {docLoad ? <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> : <div>
                                    <div className="text-center mt-4">
                                        <Progress type="circle" percent={downloading} strokeColor={twoColors} />
                                    </div>
                                </div>}
                            </div>
                        )}
                    </div>
                    <div className="footer text-end my-auto p-2 d-flex justify-content-end">
                        {data?.rowData?.output_type === 'xlsx' || data?.rowData?.output_type === 'xls' ? (
                            <Button type="primary" className="me-2 ms-auto" onClick={downloadFile}>
                                {loading7 ? `Downloading... ${downloadProgress}%` : 'Download File'}
                            </Button>
                        ) : (
                            ''
                        )}

                        <Button type="default" className="bg-danger text-white border-0" onClick={() => data.handleCancel()}>
                            Close
                        </Button>
                    </div>
                </Spin>
            </Modal>
        </div>
    );
};

export default ViewResult;
