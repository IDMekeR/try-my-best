import React, { useEffect, useState } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { Form, Input, Select, Checkbox } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { addDiagnosis, addMarker, addSymptoms } from 'services/actions/master-data/diagnosisAction';
import { addLifestyle, addSupplement } from 'services/actions/master-data/lifestyleAction';

const { TextArea } = Input;

interface ChildProps {
    openModal: boolean;
    handleBack: () => void;
    title: string;
    mid: number;
    getTblData: () => void;
    rowData: any;
}

const DiagSympSupModal: React.FC<ChildProps> = ({ openModal, handleBack, title, mid, getTblData, rowData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const checkOptions = ['Eye Open', 'Eye Closed'];
    const { loading3, success3, error3, loading5, success5, error5, loading7, success7, error7 } = useSelector((state: any) => state.diagnosis);
    const { loading4, success4, error4, loading6, success6, error6 } = useSelector((state: any) => state.lifestyle);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 || success4 || success5 || success6 || success7 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 || error4 || error5 || error6 || error7 : false;

    const handleCancel1 = () => {
        handleBack();
        form.resetFields();
    };

    const handleSubmit = async () => {
        try {
            const value = await form.validateFields();
            if (mid === 1) {
                const inputJson = {
                    mddiagnosisid: rowData?.id || 0,
                    diagnosis_name: value.diagname || '',
                    diagnosis_hint: value.description || '',
                };
                dispatch(addDiagnosis(inputJson) as any);
            } else if (mid === 2) {
                const inputJson1 = {
                    mdlifestyleid: rowData?.id || 0,
                    lifestyle_name: value.diagname || '',
                    lifestyle_hint: value.description || '',
                };
                dispatch(addLifestyle(inputJson1) as any);
            } else if (mid === 3) {
                const inputJson2 = {
                    mdmarkerid: 0,
                    markername: value.diagname || '',
                    mfieldname: value.diagname || '',
                    mfieldtype: value.fieldType || '',
                    status: 'Active',
                    EC_isactive: value.eyeType == 'Eye Closed' ? false : true || false,
                    EO_isactive: value.eyeType == 'Eye Open' ? false : true || false,
                };
                dispatch(addMarker(inputJson2) as any);
            } else if (mid === 5) {
                const inputJson3 = {
                    Mdsupplementid: rowData?.id || 0,
                    supplement_name: value.diagname || '',
                    supplement_hint: value.description || '',
                };
                dispatch(addSupplement(inputJson3) as any);
            } else if (mid === 6) {
                const inputJson4 = {
                    mdsymptomsid: rowData?.id || 0,
                    symptoms_name: value.diagname,
                    symptoms_hint: value.description,
                };
                dispatch(addSymptoms(inputJson4) as any);
            }

            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            if (mid === 1) {
                if (rowData) {
                    message.success('Diagnosis Updated Successfully');
                } else {
                    message.success('Diagnosis Added Successfully');
                }
            } else if (mid === 2) {
                if (rowData) {
                    message.success('Lifestyle Updated Successfully');
                } else {
                    message.success('Lifestyle Added Successfully');
                }
            } else if (mid === 3) {
                message.success('Marker Added Successfully');
            } else if (mid === 4) {
                if (rowData) {
                    message.success('Recommended Medication Updated Successfully');
                } else {
                    message.success('Recommended Medication Added Successfully');
                }
            } else if (mid == 5) {
                if (rowData) {
                    message.success('Supplement Updated Successfully');
                } else {
                    message.success('Supplement Added Successfully');
                }
            } else {
                if (rowData) {
                    message.success('Symptoms Updated Successfully');
                } else {
                    message.success('Symptoms Added Successfully');
                }
            }
            form.resetFields();
            getTblData();
            handleBack();
        }
        if (errormsg) {
            if (error3?.data) {
                message.error(error3?.data?.non_field_errors[0]);
            } else if (error6?.data) {
                message.error(error6?.data?.non_field_errors[0]);
            } else if (error5?.data) {
                message.error(error5?.data);
            } else {
                if (mid === 1) {
                    message.error("Diagnosis couldn't be updated");
                } else if (mid === 2) {
                    message.error("Lifestyle couldn't be updated");
                } else if (mid === 3) {
                    message.error("Marker couldn't be updated");
                } else if (mid === 4) {
                    message.error("Recommended Medication couldn't be updated");
                } else if (mid === 5) {
                    message.error("Supplement couldn't be updated");
                } else {
                    message.error("Symptoms couldn't be updated");
                }
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const loadFormData = () => {
        form.setFieldsValue({
            diagname: rowData ? rowData?.name : '',
            description: rowData ? rowData?.desc : '',
        });
    };
    useEffect(() => {
        if (openModal) {
            loadFormData();
        }
    }, [mid, rowData]);

    const markerOptions = [
        { label: 'Dropdown', value: 'Dropdown' },
        { label: 'Radio', value: 'Radio' },
        { label: 'Textbox', value: 'Textbox' },
    ];

    return (
        <div>
            <Modal
                title={title}
                open={openModal}
                onCancel={handleCancel1}
                maskClosable={false}
                confirmLoading={loading3 || loading4 || loading5 || loading6 || loading7}
                onOk={handleSubmit}
                okText={rowData ? 'Update' : 'Save'}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form layout="vertical" form={form}>
                    <Form.Item
                        name="diagname"
                        label={
                            mid === 1
                                ? 'Diagnosis Name'
                                : mid === 2
                                  ? 'Lifestyle Name'
                                  : mid === 3
                                    ? 'Marker Name'
                                    : mid === 4
                                      ? 'Medication Name'
                                      : mid === 5
                                        ? 'Supplement Name'
                                        : 'Symptoms Name'
                        }
                        rules={[{ required: true, message: 'This field is required!' }]}
                    >
                        <Input />
                    </Form.Item>
                    {mid === 3 ? (
                        <>
                            <Form.Item name="fieldType" label="Field Type" rules={[{ required: true, message: 'This field is required!' }]}>
                                <Select options={markerOptions} />
                            </Form.Item>
                            <Form.Item label="Type" name="eyeType" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                                <Checkbox.Group options={checkOptions} />
                            </Form.Item>
                        </>
                    ) : (
                        <Form.Item name="description" label="Description">
                            <TextArea rows={3} />
                        </Form.Item>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default DiagSympSupModal;
