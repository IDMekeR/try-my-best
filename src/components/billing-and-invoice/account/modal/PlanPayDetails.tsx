import React, { useState, useEffect } from "react";
import { Button } from 'components/shared/ButtonComponent';
import { Radio } from 'components/shared/FormComponent';
import { useDispatch } from "react-redux";
import { getCreditPayDetail, payCreditAmount } from "services/actions/billingAction";
import { useSelector } from "react-redux";
import { Spin } from "antd";

interface ChildProps {
    drawerCallbackFunc: (val: any) => void;
    planDetail: any;
    selectedPackage: any;
    edit: boolean;
    closeModal: () => void;
    resetBuyModal: () => void;
}

const PlanPayDetails: React.FC<ChildProps> = ({ drawerCallbackFunc, planDetail, selectedPackage, edit, closeModal, resetBuyModal }) => {
    const dispatch = useDispatch();
    const [paymentVia, setPaymentVia] = useState('card');
    const accountID = sessionStorage.getItem('accountid');
    const { payCreditInfo, loading5, loading6, success6, error6, payInfo } = useSelector((state: any) => state.billing);
    const creditAmount: any = parseFloat(payCreditInfo?.data?.actual_amount);
    const platformFee = creditAmount * (2.9642105263158 / 100);
    const [showSuccessmgs, setShowSuccessmsgs] = useState(false);
    const successmsgs = showSuccessmgs ? success6 : false;

    const roundToTwoDecimalPlaces = (num) => {
        return Math.round(num * 100) / 100;
    };
    const ccfee = roundToTwoDecimalPlaces((2.9 / 100) * parseFloat(payCreditInfo?.data?.actual_amount || 0) + 0.3);

    const handlePayChange = (e: any) => {
        setPaymentVia(e.target.value);
    };

    function getPayDetails() {
        const inputJson = `${accountID}/${selectedPackage?.id}`;
        dispatch(getCreditPayDetail(inputJson) as any);
    }
    const handlePayment = () => {
        const protocol = window.location.protocol;
        const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
        const success = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/credit-payment-success`;
        const error = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/credit-payment-error`;
        const inputJson = {
            payment_method: "stripe",
            accountid: Number(accountID),
            credit_packageid: Number(selectedPackage?.id),
            // amount: paymentVia === 'credit' ? Number(paymentDetail?.actual_amount) + parseFloat(ccfee) : Number(paymentDetail?.actual_amount),
            amount: Number(payCreditInfo?.data?.actual_amount),
            fee: Number(0),
            payment_method_type: paymentVia || '',
            processing_fee: paymentVia === 'card' ? ccfee : '0.00',
            success_url: success,
            cancel_url: error,
        };
        localStorage.setItem('paymentStatus', 'pending');
        dispatch(payCreditAmount(inputJson) as any);
        setShowSuccessmsgs(true);
    };

    useEffect(() => {
        if (successmsgs) {
            sessionStorage.setItem('paymentId', payInfo?.id);
            if (!edit) {
                window.location.href = payInfo?.url;
                setShowSuccessmsgs(false);
            } else {
                const popupWidth = 800;
                const popupHeight = 600;
                const left = window.innerWidth / 2 - popupWidth / 2;
                const top = window.innerHeight / 2 - popupHeight / 2;

                const popup: any = window.open(payInfo?.url, 'PaymentPopup', `width=${popupWidth},height=${popupHeight},top=${top},left=${left},scrollbars=yes`);
                localStorage.setItem('paymentPopup', popup?.name);
                setShowSuccessmsgs(false);
                closeModal();
                resetBuyModal();
            }
        }
    }, [successmsgs]);

    useEffect(() => {
        getPayDetails();
    }, []);

    return (
        <div className="p-2">
            <div className="row mx-0 pe-0 justify-content-between mb-1">
                <h5 className="ps-0 col my-auto"> Payment Details </h5>
                {!edit ? (
                    <div className="col-auto ms-auto pe-0">
                        <Button type="primary" className="buyBack-btn my-auto" onClick={() => drawerCallbackFunc(false)}>
                            Back
                        </Button>
                    </div>
                ) : (
                    ''
                )}
            </div>
            <div className="mt-2 d-flex bg-white p-3">
                <div className="col-md-6">
                    <h6 className="text-dark">Pay Via</h6>
                    <div className="mb-3">
                        <Radio.Group defaultValue={paymentVia} onChange={handlePayChange}>
                            <Radio value="card">Credit Card</Radio>
                            <Radio value="us_bank_account">ACH</Radio>
                            <Radio value="cashApp">Cash App</Radio>
                        </Radio.Group>
                    </div>
                    <Spin spinning={loading5}>
                        <table className="table-bordered edf-step-header w-100">
                            <thead>
                                <tr>
                                    <th className="p-2">Payment Description</th>
                                    <th className="p-2 text-center">Amount ($)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="p-2">Amount</td>
                                    <td className="p-2 text-end">${parseFloat(payCreditInfo?.data?.actual_amount || 0).toFixed(2)}</td>
                                </tr>
                                {paymentVia === 'card' ?
                                    <tr>
                                        <td className="p-2">Processing Fee </td>
                                        <td className="p-2 text-end">${paymentVia === 'card' ? ccfee?.toFixed(2) : "0.00"}</td>
                                    </tr> : ""}
                                <tr>
                                    <th className="p-2">Total Amount </th>
                                    <th className="p-2 text-end">
                                        {paymentVia === 'card' ? (
                                            <>${parseFloat(payCreditInfo?.data?.actual_amount + ccfee || 0).toFixed(2)}</>
                                        ) : (
                                            <>${parseFloat(payCreditInfo?.data?.actual_amount || 0).toFixed(2)}</>
                                        )}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </Spin>
                    <div>
                        <Button type="primary" loading={loading6} className="mt-3" onClick={handlePayment}>Proceed payment</Button>
                    </div>
                </div>
                <div className="col-md-6 ps-3">
                    <h6 className="text-dark">Selected Plan</h6>
                    <div className="bg-aliceblue h-75 p-3">
                        <h5 className="text-dark">{selectedPackage?.package_plan || '--'}</h5>
                        <h4>${selectedPackage?.package_price || 0}</h4>
                        <p className="fs-16">Credits: {selectedPackage?.credit_count}</p>
                        <Button className="yellow-btn text-white pointer" onClick={() => drawerCallbackFunc(false)}>Change Plan</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanPayDetails;