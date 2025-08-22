import React, { useEffect, useState } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { Form, Input, InputNumber } from 'components/shared/FormComponent';
import { updateCreditDetails } from 'services/actions/billingAction';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

interface ChildProps {
    rowData: any;
    openModal: boolean;
    handleClose: () => void;
    getReportItems: () => void;
}

const { TextArea } = Input;

const UpdateReportItem: React.FC<ChildProps> = ({ rowData, openModal, handleClose, getReportItems }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading1, success1, error1 } = useSelector((state: any) => state.billing);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;

    const loadData = () => {
        form.setFieldsValue({
            creditValue: rowData?.credit_Value || 0,
            description: rowData?.description || '',
        });
    };

    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [openModal, rowData]);

    const submitFunc = async () => {
        const value = await form.validateFields();
        const inputJson = {
            creditid: rowData?.id,
            credit_code: rowData?.credit_code,
            credit_item: rowData?.credit_item,
            description: value.description,
            credit_Value: Number(value.creditValue),
        };
        dispatch(updateCreditDetails(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Credit details updated successfully');
            setShowSuccessmsg(false);
            getReportItems();
            handleClose();
        }
        if (errormsg) {
            message.error("Credit details couldn't be updated");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Modal title="Update Credit Rate" open={openModal} confirmLoading={loading1} onCancel={() => handleClose()} okText="Update" onOk={submitFunc}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}
            >
                <div className="d-flex bg-tblHeadblue p-3 justify-content-around mb-3">
                    <div className="col-md-4">
                        <h6 className="text-dark mb-1">Credit Code</h6>
                        <p className="mb-0">{rowData?.credit_code}</p>
                    </div>
                    <div className="col-md-4">
                        <h6 className="text-dark mb-1">Credit Item</h6>
                        <p className="mb-0">{rowData?.credit_item}</p>
                    </div>
                </div>
                <Form form={form} layout="vertical">
                    <Form.Item name="creditValue" label="Credit Value" rules={[{ required: true, message: 'This field is required!' }]}>
                        <InputNumber className="w-100" />
                    </Form.Item>
                    <Form.Item name="description" label="Credit Description">
                        <TextArea rows={3} className="py-2" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default UpdateReportItem;
