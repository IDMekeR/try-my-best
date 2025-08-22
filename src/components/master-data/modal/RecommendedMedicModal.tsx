import React, { useEffect, useState } from 'react';
import { Image, message, Modal, Upload } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { DeleteFilled, PlusSquareOutlined, CloseSquareOutlined } from 'components/shared/AntIcons';
import { useDispatch, useSelector, url2 } from 'components/shared/CompVariables';
import { addRecoMedication } from 'services/actions/master-data/lifestyleAction';

const { TextArea } = Input;
const { Dragger } = Upload;

interface ChildProps {
    openModal: boolean;
    handleBack: () => void;
    title: string;
    mid: number;
    getTblData: () => void;
    rowData: any;
}
const RecommendedMedicModal: React.FC<ChildProps> = ({ openModal, handleBack, title, getTblData, rowData }) => {
    const [form] = Form.useForm();
    const [fileList, setFileList]: any = useState([]);
    const dispatch = useDispatch();
    const { loading11, success11, error11 } = useSelector((state: any) => state.lifestyle);
    const [rows, setRows]: any = useState([{ id: 1, fieldValue: '', fieldUrl: '' }]);
    const [nextId, setNextId] = useState(1);
    const [showImg, setShowImg] = useState(false);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success11 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error11 : false;

    const handleCancel = () => {
        handleBack();
    };

    const props1 = {
        onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList,
    };

    const changeFile = (info: any) => {
        setFileList(info?.fileList);
    };

    const handleAddClick = () => {
        const newRow = { id: nextId + 1, fieldValue: '' };
        setRows([...rows, newRow]);
        setNextId(nextId + 1);
    };

    const handleRemoveClick = (id: any) => {
        const updatedRows = rows.filter((row: any) => row.id != id);
        setRows(updatedRows);
    };
    const loadData = () => {
        form.setFieldsValue({ medication: rowData ? rowData.medication_name : '', description: rowData ? rowData.description : '' });
        const arr: any = [];
        if (rowData?.MdMedcRef) {
            rowData?.MdMedcRef.forEach((item: any, i: number) => {
                arr.push({ id: i + 1, fieldValue: item.ref_name, fieldUrl: item.ref_url });
            });
            setRows(arr);
        } else {
            setRows([{ id: 1, fieldValue: '', fieldUrl: '' }]);
        }
        if (rowData?.filepath) {
            setShowImg(false);
        } else {
            setShowImg(true);
        }
    };

    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [rowData]);

    const submitMedic = async () => {
        const formData = new FormData();
        const refData = rows
            .map(function (elem: any) {
                return elem.fieldValue;
            })
            .join('|');
        const refUrl = rows
            .map(function (elem: any) {
                return elem.fieldUrl;
            })
            .join('|');
        try {
            const value = await form.validateFields();
            const inputJson = {
                medication_id: rowData?.id || 0,
                medication_name: value.medication,
                description: value.description,
                ref_name: refData,
                ref_url: refUrl,
            };
            let file = '';
            if (value.uploadLogo) {
                file = value.uploadLogo?.fileList[0]?.originFileObj;
            } else {
                file = '';
            }
            formData.append('File', file);
            formData.append('InputJson', JSON.stringify(inputJson));
            dispatch(addRecoMedication(formData) as any);
            setShowSuccessmsg(true);
            setShowErrormsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg) {
            if (rowData) {
                message.success('Recommended Updated Added Successfully');
            } else {
                message.success('Recommended Medication Added Successfully');
            }
            form.resetFields();
            handleBack();
            getTblData();
            setShowSuccessmsg(false);
        }
        if (errormsg) {
            if (error11?.data) {
                message.error(error11?.data?.non_field_errors[0]);
                setShowSuccessmsg(false);
            } else {
                message.error("Recommended Medication couldn't be added");
                setShowErrormsg(false);
            }
        }
    }, [successmsg]);

    const changeVal = (val: any, id: any, fieldName: any) => {
        if (!val.target.value && fieldName === 'fieldValue') {
            const updatedRows1 = rows.map((row: any) => {
                if (row.id === id) {
                    return { ...row, fieldValue: val.target.value, fieldUrl: '' };
                }
                return row;
            });
            setRows(updatedRows1);
        } else {
            const updatedRows = rows.map((row: any) => {
                if (row.id === id) {
                    return { ...row, [fieldName]: val.target.value };
                }
                return row;
            });
            setRows(updatedRows);
        }
    };

    return (
        <div>
            <Modal title={title} open={openModal} confirmLoading={loading11} onCancel={handleCancel} maskClosable={false} onOk={submitMedic}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}
            okText="Save" 
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="medication" label="Medication Name">
                        <Input />
                    </Form.Item>
                    <Form.Item name="description" label="Description">
                        <TextArea rows={3} />
                    </Form.Item>
                    {rowData?.filepath !== 'None' && rowData?.filepath !== '' && rowData?.filepath !== null && !showImg ? (
                        <Form.Item label="Uploaded Icon">
                            <div className="row m-0">
                                <Image className="col-auto" src={rowData?.filepath?.startsWith('https:') ? rowData?.filepath : ''} alt="account logo" width="100px" height="auto" />
                                <div className="col">
                                    <CloseSquareOutlined className="text-danger pointer" onClick={() => setShowImg(true)} />
                                </div>
                            </div>
                        </Form.Item>
                    ) : (
                        <Form.Item label="Upload Icon" name="uploadLogo" className="col w-100">
                            <Dragger
                                {...props1}
                                name="file"
                                multiple={false}
                                className="mt-2"
                                // disabled={loading1}
                                maxCount={1}
                                beforeUpload={() => false}
                                fileList={fileList || []}
                                listType="picture-card"
                                onChange={changeFile}
                                accept={'.png,.jpg,.jpeg'}
                            >
                                <p className="ant-upload-drag-icon"></p>
                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                <p className="ant-upload-hint">Support for a single upload.</p>
                            </Dragger>
                        </Form.Item>
                    )}
                    <div className="d-flex my-auto bg-lightblue p-2 mb-3">
                        <h6 className="my-auto">Add Reference</h6> <PlusSquareOutlined className="ms-auto text-primary" onClick={handleAddClick} />
                    </div>
                    {rows.map((item: any, i: number) => {
                        return (
                            <div className="d-flex mb-2 " key={i}>
                                <div className="col">
                                    <Form.Item className="w-100" label={`Reference ${i + 1}`}>
                                        <TextArea className="w-100" value={item.fieldValue} defaultValue={item.fieldValue} rows={2} onChange={(e) => changeVal(e, item.id, 'fieldValue')} />
                                    </Form.Item>
                                    <Form.Item className="w-100" label={`Url ${i + 1}`}>
                                        <TextArea
                                            className="w-100"
                                            disabled={item.fieldValue?.length == 0}
                                            value={item.fieldUrl}
                                            defaultValue={item.fieldValue}
                                            rows={2}
                                            onChange={(e) => changeVal(e, item.id, 'fieldUrl')}
                                        />
                                    </Form.Item>
                                </div>
                                <div>
                                    <DeleteFilled className="text-danger" onClick={() => handleRemoveClick(item.id)} />
                                </div>
                            </div>
                        );
                    })}
                </Form>
            </Modal>
        </div>
    );
};

export default RecommendedMedicModal;
