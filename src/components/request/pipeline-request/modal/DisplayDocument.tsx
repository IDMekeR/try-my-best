import React, { useEffect, useState } from 'react';
import { Modal, Progress, useSelector } from 'components/shared/AntComponent';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import { ProgressProps } from 'antd';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
}

const DisplayDocument: React.FC<ChildProps> = ({ openModal, closeModal }) => {
    const { consentDocInfo, loading8 } = useSelector((state: any) => state.pipeline);
    const { consentDownProgress } = useSelector((state: any) => state.download);
    const [fileData, setFileData] = useState('');
    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const docs = [
        {
            uri: fileData?fileData:'',
            fileName: 'consentForm.pdf',
        },
    ];
    useEffect(() => {
        if (openModal && consentDocInfo?.data) {
            setFileData(`data:application/pdf;base64,${consentDocInfo?.data}`);
        }
    }, [openModal, consentDocInfo?.data]);

    return (
        <div>
            <Modal
                title="Consent Form Template"
                width={1000}
                styles={{ body: { height: '500px' } }}
                open={openModal}
                onCancel={() => closeModal()}
                cancelText="Close"
                okButtonProps={{ style: { display: 'none' } }}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                {loading8 ? (
                    <div className="text-center h-100">
                        <Progress type="circle" percent={consentDownProgress} strokeColor={twoColors} />
                    </div>
                ) : (
                    openModal && consentDocInfo?.data ? <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> : ""
                )}
            </Modal>
        </div>
    );
};

export default DisplayDocument;
