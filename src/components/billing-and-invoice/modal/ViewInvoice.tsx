import React, { useEffect, useState } from 'react';
import { Modal, Progress } from 'components/shared/AntComponent';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import axios from 'axios';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    invoiceUrl: any;
    statementUrl: any;
    detail: any;
}

const ViewInvoice: React.FC<ChildProps> = ({ openModal, closeModal, invoiceUrl, statementUrl, detail }) => {
    const [downloadPercent, setDownloadPercent] = useState(0);
    const [url, setUrl]: any = useState();

    const docs = [
        {
            uri: url,
            fileName: `${detail ? detail?.invoice_number : 'Datahub_invoice'}.pdf`,
        },
        // {
        //     uri: statementUrl,
        //     fileName: `${detail ? detail?.invoice_number : 'Datahub_invoice'}.pdf`,
        // },
    ];
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
    const getFileBlob = async (file: any) => {
        if(file && file!='None'){
            try {
                const url = file;
                const response = await axios.get(url, {
                    responseType: 'blob', // Ensure that the response is treated as a blob
                    headers: {
                        'Content-Type': 'application/pdf', // Adjust based on your server's response content type
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
                // const link = document.createElement('a');
                const fileUrl = window.URL.createObjectURL(blob);
                const base64String = await convertBlobToBase64(blob);
                const pdfBase64String = base64String.replace("data:application/octet-stream;base64,", "data:application/pdf;base64,");
                // Set the Base64 string into the state
                setUrl(pdfBase64String);
                // Clean up the URL object
                window.URL.revokeObjectURL(fileUrl);
            } catch (error) {
                console.error('There was a problem with the download operation:', error);
            } finally {
                setDownloadPercent(0);
            }
        }
        
    }

    useEffect(() => {
        if (openModal) {
            if (invoiceUrl && invoiceUrl != 'None') {
                getFileBlob(invoiceUrl);
            }
            setUrl();
            setDownloadPercent(0);
        }
    }, [openModal, invoiceUrl])

    return (
        <div>
            <Modal className="invoice-modal" title="Invoice Preview" width={600} height={500} open={openModal} onCancel={closeModal}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
                cancelText="Close"
                okButtonProps={{
                    style: { display: 'none' },
                }}
            >
                <div className='doc-overflow'>
                    {invoiceUrl && invoiceUrl !== 'None' ? <>
                        {url ? (
                            // For PDFs, you can use an iframe to preview the file
                            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
                        ) : (
                            <div className="bg-white p-5 text-center">
                                <Progress type="dashboard" steps={8} percent={downloadPercent} trailColor="rgba(0, 0, 0, 0.06)" strokeWidth={5} />
                            </div>
                        )}
                    </> : <div className='text-center bg-light p-5 mt-3'>No invoice available</div>}
                </div>
            </Modal>
        </div>
    );
};

export default ViewInvoice;
