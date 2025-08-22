import React, { useEffect, useState } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { Radio, Form, Input, Checkbox } from 'components/shared/FormComponent';
import { proceedToInvPayment } from 'services/actions/invoiceAction';
import { menuDetails } from 'services/actions/dashboardAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    detail: any;
    updateStat: any;
    callback: any
}

const { TextArea } = Input;

const PaymentInfoModal: React.FC<ChildProps> = ({ openModal, closeModal, detail, updateStat, callback }) => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const { loading6, success6, error6, invPayInfo } = useSelector((state: any) => state.invoice);
    const [selectedPayment, setSelectedPayment] = useState('stripe');
    const [paymentVia, setPaymentVia] = useState('card');
    const invoiceAmount: any = parseFloat(detail?.invoice_discount_percentage_flag ? detail?.invoiceprice : detail?.inv_amount);
    const roundToTwoDecimalPlaces = (num: any) => {
        return Math.round(num * 100) / 100;
    };
    const val: any = (2.9 / 100) * invoiceAmount + 0.3;
    const ccfee: any = invoiceAmount == 0 ? '0.00' : roundToTwoDecimalPlaces(parseFloat(val));
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    const isAutopayEnabled = detail?.is_autopay;
    const [isAutoPay, setIsAutoPay] = useState(false);
    const userRole = sessionStorage.getItem('role');

    const options: { label: string; value: string }[] = [
        { label: 'Online Payment', value: 'stripe' },
        { label: 'Cheque', value: 'cheque' },
        { label: 'Cash', value: 'cash' },
        { label: 'Other', value: 'other' },
    ];

    const handleChangePaymentType = (e: any) => {
        setSelectedPayment(e.target.value);
    };

    const handlePayViaChange = (e: any) => {
        setPaymentVia(e.target.value);
    };

    const submitPayment = async () => {
        try {
            const value = await form.validateFields();
            const protocol = window.location.protocol;
            const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
            const success = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/invsuccess-payment`;
            const error = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/inverror-payment`;
            const inputJson = {
                payment_method: selectedPayment,
                accountid: userRole === 'staff' ? Number(sessionStorage.getItem('accountid')) : detail?.accountid,
                reference: value.comment || '',
                invoice_id: detail?.id || 0,
                amount: Number(invoiceAmount),
                fee: Number(0),
                payment_method_type: paymentVia || '',
                processing_fee: paymentVia === 'card' ? ccfee : '0.00',
                success_url: success,
                cancel_url: error,
                save_details_for_future_payment: isAutoPay || false,
            };
            dispatch(proceedToInvPayment(inputJson) as any);
            setShowSuccessmsg(true);
            setShowErrormsg(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (successmsg) {
            sessionStorage.setItem('invoice-session', invPayInfo?.id);
            sessionStorage.setItem('invoice-id', detail?.id);
            form.resetFields();
            if (selectedPayment == 'stripe') {
                window.location.href = invPayInfo?.url;
            } else {
                message.success('Payment Done Successfully');
                closeModal();
                updateStat(true);
                callback()
            }
            setShowSuccessmsg(false);
        }
        if (errormsg) {
            setShowErrormsg(false);
            if (error6.data) {
                message.error(error6.data);
            } else {
                message.error("Payment couldn't be proceed further");
            }
        }
    }, [successmsg, errormsg]);
    return (
        <div>
            <Modal
                title="Payment Option"
                width={700}
                confirmLoading={loading6}
                open={openModal}
                onCancel={() =>{
                    closeModal()
                } }
                okText={selectedPayment === 'stripe' ? 'Proceed to pay' : 'Save'}
                onOk={submitPayment}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <div className="bg-aliceblue p-2 d-flex mb-3">
                    <div className="col">
                        <p className="mb-0 fs-15 fw-bold">Invoice #</p>
                        <p className="fs-15 mb-0 text-dark">{detail?.invoice_number}</p>
                    </div>
                    <div className="col">
                        <p className="mb-0 fs-15 fw-bold">Account #</p>
                        <p className="fs-15 mb-0 text-dark">{detail?.encoded_accountNumber}</p>
                    </div>
                    <div className="col">
                        <p className="mb-0 fs-15 fw-bold">Account Name</p>
                        <p className="fs-15 mb-0 text-dark">{detail?.account_name}</p>
                    </div>
                </div>
                {userRole !== 'staff' ? (
                    <>
                        <div className="">
                            <p className="fs-15 mb-1">Payment Option</p>
                        </div>
                        <Radio.Group options={options} optionType="button" defaultValue={selectedPayment} value={selectedPayment} onChange={handleChangePaymentType} buttonStyle="solid" />
                    </>
                ) : (
                    ''
                )}
                {selectedPayment === 'stripe' ? (
                    <>
                        <div className="my-3">
                            <p className="mb-1">Pay Via</p>
                            <div>
                                <Radio.Group defaultValue={paymentVia} onChange={handlePayViaChange}>
                                    <Radio value="card">Credit card</Radio>
                                    <Radio value="us_bank_account">ACH</Radio>
                                    <Radio value="cashApp">Cash App</Radio>
                                </Radio.Group>
                            </div>
                        </div>
                        <table className="table-bordered w-100 edf-step-header">
                            <thead>
                                <tr>
                                    <th className="p-2">Payment Description</th>
                                    <th className="p-2 text-center">Amount ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2">Invoice Amount</td>
                                    <td className="p-2 text-end">{parseFloat(invoiceAmount).toFixed(2)}</td>
                                </tr>
                                {paymentVia === 'card' ? (
                                    <tr>
                                        <td className="p-2">Processing fees</td>
                                        <td className="p-2 text-end"> {paymentVia === 'card' ? <>{ccfee}</> : '0.00'}</td>
                                    </tr>
                                ) : (
                                    ''
                                )}
                                <tr>
                                    <td className="p-2 fw-bold">Total Amount</td>
                                    <td className="p-2 text-end">
                                        {paymentVia === 'card' ? <>{parseFloat(invoiceAmount + ccfee).toFixed(2)}</> : <>{parseFloat(invoiceAmount).toFixed(2)}</>}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {isAutopayEnabled && (
                            <Checkbox className="fw-normal" checked={isAutoPay} defaultChecked={isAutoPay} onChange={(e) => setIsAutoPay(e.target.checked)}>
                                Save this method for future payment
                            </Checkbox>
                        )}
                    </>
                ) : (
                    <Form layout="vertical" form={form}>
                        <Form.Item name="comment" label="Comment" className="mt-3" rules={[{ required: selectedPayment === 'stripe' ? false : true, message: 'This field is required' }]}>
                            <TextArea className="pt-2" rows={2} />
                        </Form.Item>
                    </Form>
                )}
            </Modal>
        </div>
    );
};

export default PaymentInfoModal;
