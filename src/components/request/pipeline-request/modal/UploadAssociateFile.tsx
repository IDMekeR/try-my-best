import React, { useState, useRef, useEffect } from 'react';
import { message, Modal, Progress, Upload, useDispatch, useSelector } from 'components/shared/AntComponent';
import { Form, Select, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { amplifierOptions } from 'components/shared/DropdownOption';
import { useLocation } from 'react-router-dom';
import { updateAssDocument, uploadAssociatedDocument } from 'services/actions/pipeline/pipelineAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
    getDocuments: () => void;
    getStepsDetails: () => void;
}
const { Dragger } = Upload;

const UploadAssociateFile: React.FC<ChildProps> = ({ openModal, closeModal, rowData, getDocuments,getStepsDetails }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const dispatch = useDispatch();
    const { uploadAssDocProgress } = useSelector((state: any) => state.upload);
    const { loading11, success11, error11, success12, loading12, error12 } = useSelector((state: any) => state.pipeline);
    const { stepsInfo } = useSelector((state: any) => state.wizard);

    const [ampName, setAmpName] = useState('');
    const inputRef: any = useRef(null);
    const [updateAmplifier, setUpdateAmplifier] = useState(amplifierOptions.map((option) => option.value));
    const [errorMsg, setErrorMsg] = useState('');
    const [eyeType, setEyeType] = useState('');
    const [uploadError, setUploadError] = useState('');
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success11 || success12 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error11 || error12 : false;

    const options = [
        {
            value: 'Eye Open',
            label: 'Eyes Opened',
        },
        {
            value: 'Eye Close',
            label: 'Eyes Closed',
        },
        {
            value: 'Result',
            label: `Result ${stepsInfo?.data?.result_flag ? '( Document already exists )' : ''}`,
            disabled: stepsInfo?.data?.result_flag,
        },
        {
            label: 'Others',
            value: 'Others',
        },
    ];
    const normalizeName = (name: any) => {
        return name.trim().replace(/\s+/g, ' ');
    };
    const addItem = (e: any) => {
        e.preventDefault();
        const normalizedAmpName = normalizeName(ampName);
        if (normalizedAmpName.length >= 3) {
            const lowercaseAmpName = normalizedAmpName.toLowerCase();
            if (!updateAmplifier.map((option) => option.toLowerCase()).includes(lowercaseAmpName)) {
                setUpdateAmplifier([...updateAmplifier, normalizedAmpName]);
                setAmpName('');
                setErrorMsg('');
            } else {
                setErrorMsg('Amplifier name already exists.');
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };
    const onNameChange = (event: any) => {
        setAmpName(event.target.value);
    };

    const handleEyeChange = (e: any) => {
        setEyeType(e);
        form.setFieldsValue({ equipmentType: '' });
        const file = form.getFieldValue('document');
        if (file) {
            changeFile(file, e)
        }
    };

    const changeFile = (info: any, eyetype?: string) => {
        // const eyetype = form.getFieldValue('fileType');
        const currentEyeType = eyetype || form.getFieldValue('fileType') || eyeType;
        const allowedFormats = currentEyeType === 'Result' ? ['pdf'] : currentEyeType == 'Others' ? ['pdf', 'edf', 'doc', 'docx', 'xls', 'xlsx','PDF','EDF','DOC','DOCX','XLS','XLSX'] : ['edf', 'doc', 'docx', 'xls', 'xlsx','EDF','DOC','DOCX','XLS','XLSX'];
        const fileType = info?.file?.name.split('.').pop()?.toLowerCase();

        if (!allowedFormats.includes(fileType)) {

            setUploadError(`Invalid file type. Please upload supported file type`);
            return;
        }
        setUploadError('');
    };

    const submitForm = async () => {
        const value = form.getFieldsValue();
        const formData = new FormData();
        try {
            await form.validateFields();
            formData.append('File', value.document?.fileList[0]?.originFileObj);
            const inputJson = {
                requestid: location.state?.id,
                userid: Number(sessionStorage.getItem('userid')),
                doctype: value.fileType,
                equipment_type: value?.equipmentType,
            };
            formData.append('InputJson', JSON.stringify(inputJson));
            dispatch(uploadAssociatedDocument(formData) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (successmsg) {
            if (rowData) {
                message.success('Document updated successfully');
            } else {
                message.success('Document uploaded successfully');
                if(eyeType==='Result'){
                    getStepsDetails();
                }
            }
            setShowSuccessmsg(false);
            closeModal();
            getDocuments();
        }
        if (errormsg) {
            if (rowData) {
                if (error12?.data) {
                    message.error(error12?.data);
                } else {
                    message.error("Document couldn't be updated");
                }
            } else {
                if (error11?.data) {
                    message.error(error11?.data);
                } else {
                    message.error("Document couldn't be uploaded");
                }
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const loadData = () => {
        if (rowData) {
            form.setFieldsValue({
                fileType: rowData?.doc_type || '',
                equipmentType: rowData?.equipment_type || '',
                document: '',
            });
        } else {
            form.resetFields();
        }

        if (rowData) {
            setEyeType(rowData?.doc_type);
        } else {
            setEyeType('');
        }
    };

    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [openModal]);

    const updateDocument = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                docid: rowData?.id,
                doc_type: value.fileType,
                equipment_type: value.equipmentType,
            };
            dispatch(updateAssDocument(inputJson) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    return (
        <div>
            <Modal
                title="Upload Associated File(s)"
                open={openModal}
                confirmLoading={loading11 || loading12}
                onOk={rowData ? updateDocument : submitForm}
                onCancel={() => {
                    closeModal();
                    setUploadError('');
                }}
                okText={rowData ? 'Update' : 'Upload'}
                okButtonProps={{ disabled: uploadError !== '' }}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="fileType" label="Select File Type">
                        <Select options={options} onChange={handleEyeChange} />
                    </Form.Item>
                    {eyeType === 'Eye Open' || eyeType === 'Eye Close' ? (
                        <Form.Item
                            name="equipmentType"
                            label="Select Equipment Type"
                            rules={[{ required: eyeType === 'Eye Close' || eyeType === 'Eye Open' ? true : false, message: 'This field is required' }]}
                        >
                            <Select
                                showSearch
                                dropdownRender={(menu) => (
                                    <>
                                        {menu}
                                        <hr className="my-2" />
                                        <div className="px-2">
                                            <span className="fw-bold">Other</span>
                                        </div>
                                        <div className="d-flex align-items-end  w-75  p-2">
                                            <Input
                                                className="h-100 p-1"
                                                placeholder="Enter the Amplifier Name"
                                                ref={inputRef}
                                                value={ampName}
                                                onChange={onNameChange}
                                                onPressEnter={addItem}
                                                onKeyDown={(e) => e.stopPropagation()}
                                            />
                                            <Button className="mx-2 h-100 " type="primary" onClick={addItem} disabled={ampName.length < 3}>
                                                Add
                                            </Button>
                                        </div>
                                        {errorMsg === 'Amplifier name already exists.' ? <div className="text-danger fw-bold fs-15 ps-2">{errorMsg}</div> : ''}
                                    </>
                                )}
                            // disabled={(reqId && !defaultValues?.session_is_draft && isActive) || location?.state?.error}
                            >
                                {updateAmplifier.map((item) => (
                                    <Select.Option key={item} value={item}>
                                        {item}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                    ) : (
                        ''
                    )}
                    {!rowData ? (
                        <Form.Item name="document" valuePropName="document" rules={[{ required: rowData ? false : true, message: 'This field is required' }]}>
                            <Dragger
                                name="file"
                                multiple={false}
                                maxCount={1}
                                beforeUpload={() => false}
                                listType="picture-card"
                                accept=".edf,.xls,.xlsx,.doc,.docx,.pdf,.EDF,.XLS,.XLSX,.DOC,.DOCX,.PDF'"
                                onChange={(info) => changeFile(info)}
                            >
                                <p className="ant-upload-drag-icon"></p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">
                                    Upload
                                    {eyeType === 'Result' ? ' pdf ' : eyeType === 'Eye Open' || eyeType === 'Eye Close' ? ' xls, xlsx, doc, docx ' : ' pdf, xls, xlsx, doc, docx '}
                                    file here
                                </p>
                            </Dragger>
                        </Form.Item>
                    ) : (
                        ''
                    )}
                    {loading11 ? (
                        <Progress size={[485, 20]} percent={uploadAssDocProgress} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                    ) : (
                        ''
                    )}
                    {uploadError ? <div className="text-danger fw-bold bg-lightred p-1 text-center rounded">{uploadError}</div> : ''}
                </Form>
            </Modal>
        </div>
    );
};

export default UploadAssociateFile;
