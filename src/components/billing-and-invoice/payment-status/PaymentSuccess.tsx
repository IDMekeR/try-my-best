import React, { useEffect } from 'react';
import CheckGif from 'assets/img/verified.gif';
import { Button } from 'components/shared/ButtonComponent';
import { Spin } from 'components/shared/AntComponent';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { updatePaymentStatus } from 'services/actions/invoiceAction';
import { useDispatch, useSelector } from 'react-redux';

const PaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { updateStatus, loading8 } = useSelector((state: any) => state.invoice);
    const sessionId = sessionStorage.getItem('invoice-session');
    const invoiceId = sessionStorage.getItem('invoice-id');
    const paidDate = updateStatus?.inv_datas?.paid_on ? new Date(updateStatus?.inv_datas?.paid_on).toLocaleDateString() : 'N/A';

    const handlePaymentStatus = () => {
        const inputJson = {
            invoice_id: Number(invoiceId),
            session_id: sessionId,
        };
        dispatch(updatePaymentStatus(inputJson) as any);
    };

    useEffect(() => {
        if (sessionId && invoiceId) {
            handlePaymentStatus();
        }
    }, [sessionId, invoiceId]);

    return (
        <div className="mx-2 my-3">
            <Spin spinning={loading8}>
                {
                    updateStatus?.data?.status === "processing" ?
                        <div className="p-5 text-center bg-white h-100">
                            <img src={CheckGif} alt="check-mark" height="100px" />
                            <h4 className="txt-success">Payment Processing</h4>
                            <h5 className="text-dark">
                                Your payment is currently being processed. Please wait a few moments.
                            </h5>
                            <div className="mt-5">
                                <p>
                                    You will receive a confirmation once the payment is successfully
                                    completed.
                                </p>
                            </div>
                            <div className="mt-5">
                                <Button type="primary" className=""
                                    onClick={() => navigate('/invoice-manager', {
                                        state: { tab: '3' }
                                    } as NavigateOptions)}
                                >
                                    Back to Invoice manager
                                </Button>
                            </div>
                        </div> :

                        <div className="p-5 text-center bg-white h-100">
                            <img src={CheckGif} alt="check-mark" height="100px" />
                            <h4 className="txt-success">Payment Successful !</h4>
                            <h5 className="text-dark">Thank you! your payment of ${parseFloat(updateStatus?.inv_datas?.total_amount || 0).toFixed(2)} has been received.</h5>
                            <div className="mt-5 w-50 mx-auto">
                                <p className="fs-16 mb-2">Payment Details</p>
                                <div className="bg-light row m-0 p-2">
                                    <div className="col">
                                        <p className="mb-0 fw-bold">Invoice Number</p>
                                        <p className="mb-0 fw-bold">{updateStatus?.inv_datas?.invoice_number ? updateStatus?.inv_datas?.invoice_number : '-'}</p>
                                    </div>
                                    <div className="col">
                                        <p className="mb-0 fw-bold">Invoice Amount</p>
                                        <p className="mb-0 fw-bold">${parseFloat(updateStatus?.inv_datas?.total_amount || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="col">
                                        <p className="mb-0 fw-bold">Payment made via</p>
                                        <p className="mb-0 fw-bold">{updateStatus?.inv_datas?.paid_via ? updateStatus?.inv_datas?.paid_via : '-'}</p>
                                    </div>
                                    {/* <div className="col">
                                    <p className="mb-0 fw-bold">Payment Date</p>
                                    <p className="mb-0 fw-bold">{paidDate ? paidDate : '-'}</p>
                                </div> */}
                                </div>
                            </div>
                            <div className="mt-5">
                                <p>Please wait for some time for the amount to show up in the datahub</p>
                                <Button type="primary" className="mt-3"
                                    onClick={() => navigate('/invoice-manager', {
                                        state: { tab: '3' }
                                    } as NavigateOptions)}
                                >
                                    Back to Invoice manager
                                </Button>
                            </div>
                        </div>
                }
            </Spin>
        </div>
    );
};

export default PaymentSuccess;
