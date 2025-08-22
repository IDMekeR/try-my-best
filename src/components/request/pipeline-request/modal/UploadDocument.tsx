import React, { useState, useEffect } from 'react';
import { message, Modal, Progress, ProgressProps, Upload } from 'components/shared/AntComponent';
import { Form } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { downloadConsentForm, uploadConsentForm, uploadResultDocument } from 'services/actions/pipeline/pipelineAction';
import { WarningTwoTone } from 'components/shared/AntIcons';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

const { Dragger } = Upload;

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
}
const UploadDocument: React.FC<ChildProps> = ({ openModal, closeModal, rowData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading1, success1, error1, consentDocInfo, loading8, loading7, error7, success7 } = useSelector((state: any) => state.pipeline);
    const { resultDocProgress } = useSelector((state: any) => state.upload);
    const { consentDownProgress } = useSelector((state: any) => state.download);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 || success7 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 || error7 : false;
    const userRole = sessionStorage.getItem('role');
    const userId = Number(sessionStorage.getItem('userid'));
    const [fileData, setFileData]: any = useState('');

    const twoColors: ProgressProps['strokeColor'] = {
        '0%': '#108ee9',
        '100%': '#87d068',
    };

    const submitForm = async () => {
        const value = await form.getFieldsValue();
        const formData = new FormData();
        if (userRole == 'staff') {
            try {

                const InputJson = {
                    requestid: rowData?.id,
                    userid: userId,
                };
                formData.append('File', value.document.fileList[0].originFileObj);
                formData.append('InputJson', JSON.stringify(InputJson));
                dispatch(uploadConsentForm(formData) as any);
                setShowErrormsg(true);
                setShowSuccessmsg(true);
            } catch (errorInfo) {
                console.log('Failed:', errorInfo);
            }
        }
        else {
            try {
                await form.validateFields();
                formData.append('File', value.document?.fileList[0]?.originFileObj);
                const inputJson = {
                    requestid: rowData?.id,
                    userid: Number(sessionStorage.getItem('userid')),
                    doctype: 'result',
                };
                formData.append('InputJson', JSON.stringify(inputJson));
                dispatch(uploadResultDocument(formData) as any);
                setShowErrormsg(true);
                setShowSuccessmsg(true);
            } catch (error: any) {
                console.log('Failed', error);
            }
        }
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            closeModal();
            setFileData(null);
            form.resetFields();
            message.success(`${userRole == 'staff' ? 'Consent Form' : 'Result document'} uploaded successfully`);
            form.resetFields();
        }
        if (errormsg) {
            if (error1?.data) {
                message.error(error1?.data);
            } else {
                message.error(`${userRole == 'staff' ? 'Consent Form' : 'Result document'} couldn't be uploaded`);
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const getConsentTemplate = () => {
        const inputJson = {
            requestid: rowData?.id,
        };
        dispatch(downloadConsentForm(inputJson) as any);
    };

    useEffect(() => {
        if (rowData?.consentupload_flag && openModal) {
            getConsentTemplate();
        }
    }, [rowData, openModal]);

    const docs = [
        {
            uri: fileData ? fileData : '',
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
            <Modal open={openModal}
                confirmLoading={loading7 || loading1}
                onCancel={() => { closeModal(); setFileData(null); form.resetFields() }} onOk={submitForm}
                title={userRole === 'staff' ? 'Upload Consent Form' : "Upload Result Document"} okText="Upload"
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
                okButtonProps={{
                    style: { display: rowData?.consentupload_flag ? 'none' : 'block' }
                }}
            >
                <div className="bg-aliceblue border d-flex ps-3 pe-2 py-2 mb-3">
                    <div className="col px-2">
                        <h6>Request No</h6>
                        <p className='mb-0'>{rowData?.encoded_RequestNumber}</p>
                    </div>
                    <div className="col px-2">
                        <h6>Patient Name</h6>
                        <p className='mb-0'>{rowData?.patient_name}</p>
                    </div>
                    <div className="col px-2">
                        <h6>Account Name</h6>
                        <p className='mb-0'>{rowData?.account_name}</p>
                    </div>
                </div>
                {rowData?.consentupload_flag && userRole == 'staff' ? <div>
                    {loading8 ? (
                        <div className="text-center h-100">
                            <Progress type="circle" percent={consentDownProgress} strokeColor={twoColors} />
                        </div>
                    ) : (
                        openModal && consentDocInfo?.data ? <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} /> : ""
                    )}
                </div> :
                    <Form form={form} layout="vertical">
                        <Form.Item name="document" valuePropName="document" rules={[{ required: true, message: 'This field is required' }]}>
                            <Dragger
                                name="file"
                                multiple={false}
                                maxCount={1}
                                beforeUpload={() => false}
                                listType="picture-card"
                                accept=".pdf"
                                onChange={(info: any) => {
                                    form.setFieldsValue({ 'document': info });
                                }}
                            >
                                <p className="ant-upload-drag-icon"></p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Upload PDF file here</p>
                            </Dragger>
                        </Form.Item>
                        {loading1 ? (
                            <Progress size={[485, 20]} percent={resultDocProgress} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                        ) : (
                            ''
                        )}
                        {rowData?.edfprocessing_flag && userRole !== 'staff' ? (
                            <div className="fs-16 text-warn">
                                <WarningTwoTone className="text-warning fs-16" twoToneColor="#ff9966" /> Job processing is in queue
                            </div>
                        ) : rowData?.edfcomplete_flag && userRole !== 'staff' ? (
                            <div className="fs-16 text-warn">
                                <WarningTwoTone className="text-warning fs-16" twoToneColor="#ff9966" /> Job request is completed. If you upload result manually, this will overwrite the datahub
                                result.
                            </div>
                        ) : (
                            ''
                        )}
                    </Form>
                }
            </Modal>
        </div>
    );
};

export default UploadDocument;
