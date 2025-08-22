import React, {useState, useEffect} from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { Form, Input, InputNumber } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { addAmplifier } from 'services/actions/master-data/amplifierAction';

interface ChildProps {
    openModal: boolean;
    handleBack: () => void;
    title: string;
    mid: number;
    getTblData: () => void;
    rowData: any;
}

const AddAmplifier: React.FC<ChildProps> = ({ openModal, handleBack, title, getTblData, rowData }) =>{
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const {success1,error1,loading1} = useSelector((state: any) => state.amplifier);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;
    const id = rowData?.id || 0;
    
    const handleOk = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                id: id,
                amplifier_name: value?.amplifier_name,
                electrode_type: value?.electrode_type,
                allowed_electrode: value?.allowed_electrode,
                max_electrode: value?.max_electrode,
                communication_method: value?.communication_method,
                allowed_duration: value?.allowed_duration,
            };
            dispatch(addAmplifier(inputJson)as any);
            setShowSuccessmsg(true)
            setShowErrormsg(true)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const loadData = () => {
        form.setFieldsValue({
            amplifier_name: rowData?.amplifier_name || '',
            electrode_type: rowData?.electrode_type || '',
            communication_method: rowData?.communication_method || '',
            allowed_electrode: rowData?.allowed_electrode || '',
            max_electrode: rowData?.max_electrode || '',
            allowed_duration: rowData?.allowed_duration || '',
        });
    };

    const handleClose = () => {
        handleBack();
        form.resetFields()
    };

    useEffect(() => {
        if (successmsg) {
            if (rowData) {
                message.success('Amplifier Updated Successfully');
            } else {
                message.success('Amplifier Added Successfully');
            }
            form.resetFields();
            handleBack();
            getTblData();
            setShowSuccessmsg(false);
        }
        if (errormsg) {
            if (error1?.data) {
                message.error(error1?.data);
                setShowErrormsg(false);
            } else {
                message.error("Amplifier couldn't be added");
                setShowErrormsg(false);
            }
        }
    }, [successmsg, errormsg] )

    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [rowData]);

    return(
        <Modal
            title={title}
            confirmLoading={loading1}
            open={openModal}
            onOk={handleOk}
            onCancel={handleClose}
            width={500}
            okText={title == 'Add Amplifier' ? 'Save' : 'Update'}
            maskClosable={false}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}
        >
            <Form form={form} preserve={false} layout="vertical" className="">
                <Form.Item label="Amplifier Name" name="amplifier_name" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Electrode Type" name="electrode_type" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Communication Method" name="communication_method" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Allowed Electrode" name="allowed_electrode" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <InputNumber className="w-100" />
                </Form.Item>
                <Form.Item label="Max Electrode" name="max_electrode" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <InputNumber className="w-100" />
                </Form.Item>
                <Form.Item label="Allowed Duration" name="allowed_duration" className="w-100" rules={[{ required: true, message: 'This field is required!' }]}>
                    <InputNumber className="w-100" />
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default AddAmplifier;