import React, { useState, useEffect } from 'react';
import { message, Modal, Progress, Upload } from 'components/shared/AntComponent';
import { Form } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { uploadAssociatedDocument } from 'services/actions/pipeline/pipelineAction';
import { getResultInfo, getWizardSteps } from 'services/actions/pipeline/stepwizardAction';

const { Dragger } = Upload;

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    requestId: any;
}

const UploadResult: React.FC<ChildProps> = ({ openModal, closeModal, requestId }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading11, success11, error11 } = useSelector((state: any) => state.pipeline);
    const { uploadAssDocProgress } = useSelector((state: any) => state.upload);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success11 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error11 : false;

    const submitForm = async () => {
        const value = form.getFieldsValue();
        const formData = new FormData();
        try {
            await form.validateFields();
            formData.append('File', value?.document?.fileList[0]?.originFileObj);
            const inputJson = {
                requestid: requestId,
                userid: Number(sessionStorage.getItem('userid')),
                doctype: 'result',
            };
            formData.append('InputJson', JSON.stringify(inputJson));
            dispatch(uploadAssociatedDocument(formData) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('Failed', error);
        }
    };

    function getTemplateDetails() {
        const inputJson = {
            servicerequestid: requestId,
        };
        dispatch(getResultInfo(inputJson) as any);
    }

    function getStepsDetails() {
        dispatch(getWizardSteps(requestId) as any);
    }

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            closeModal();
            message.success('Result document uploaded successfully');
            getTemplateDetails();
            getStepsDetails();
            form.resetFields();
        }
        if (errormsg) {
            if (error11?.data) {
                message.error(error11?.data);
            } else {
                message.error("Result document couldn't be uploaded");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Modal open={openModal} onCancel={() => closeModal()} onOk={submitForm} confirmLoading={loading11} title="Upload Result Document" okText="Upload">
                <div className="mb-1">
                    <span className="text-danger">If you upload the result file, then it will be overwritten by the result produced by Datahub</span>
                </div>
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
                                form.setFieldValue('document', info);
                            }}
                        >
                            <p className="ant-upload-drag-icon"></p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                            <p className="ant-upload-hint">Upload PDF file here</p>
                        </Dragger>
                    </Form.Item>
                    {loading11 ? (
                        <Progress size={[485, 20]} percent={uploadAssDocProgress} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                    ) : (
                        ''
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default UploadResult;
