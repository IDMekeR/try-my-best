import React, { useEffect } from 'react';
import CheckGif from 'assets/img/verified.gif';
import { Button } from 'components/shared/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { updateCreditPaymentStatus, updatePaymentStatus } from 'services/actions/invoiceAction';
import { useDispatch, useSelector } from 'react-redux';

const CrPaymentSuccess: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { crdUpdateStauts } = useSelector((state: any) => state.invoice);
    const sessionId = sessionStorage.getItem('invoice-session');
    const crdSession = sessionStorage.getItem('paymentId');

    const handlePaymentStatus = () => {
        const inputJson = {
            session_id: crdSession,
        };
        dispatch(updateCreditPaymentStatus(inputJson) as any);
    };

    useEffect(() => {
        if (crdSession) {
            handlePaymentStatus();
        }
    }, [crdSession]);

    useEffect(() => {
        const popup = localStorage.getItem('order');
        localStorage.setItem('paymentStatus', 'succeed');

        if (popup) {
            setTimeout(() => {
                window.close();
            }, 3500);
        }
    }, [dispatch]);

    return (
        <div className="mx-2 my-3">
            <div className="p-5 text-center bg-white h-100">
                <img src={CheckGif} alt="check-mark" height="100px" />
                <h4 className="txt-success">Payment Successful !</h4>
                {/* <h5 className="text-dark">Thank you! your payment of ${parseFloat(updateStatus?.inv_datas?.total_amount || 0).toFixed(2)} has been received.</h5> */}
                {/* <div className="mt-5 w-50 mx-auto">
                    <p className="fs-16 mb-2">Payment Details</p>
                    <div className="bg-light row m-0 p-2">
                        <div className="col">
                            <p className="mb-0 fw-bold">Invoice Amount</p>
                            <p className="mb-0 fw-bold">{updateStatus?.inv_datas?.invoice_Number || '--'}</p>
                        </div>
                        <div className="col">
                            <p className="mb-0 fw-bold">Invoice Amount</p>
                            <p className="mb-0 fw-bold">${parseFloat(updateStatus?.inv_datas?.total_amount || 0).toFixed(2)}</p>
                        </div>
                        <div className="col">
                            <p className="mb-0 fw-bold">Payment made via</p>
                            <p className="mb-0 fw-bold">{updateStatus?.inv_datas?.paid_via}</p>
                        </div>
                        <div className="col">
                            <p className="mb-0 fw-bold">Payment Date</p>
                            <p className="mb-0 fw-bold">{paidDate}</p>
                        </div>
                    </div>
                </div> */}
                <div className="mt-3">
                    <p>Please wait for some time for the amount to show up in the datahub</p>
                    <Button type="primary" className="mt-3" onClick={() => navigate('/my-credit')}>
                        Back to My Credit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CrPaymentSuccess;
