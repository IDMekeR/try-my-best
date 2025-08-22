import React, { useEffect } from 'react';
import ErrorImg from 'assets/img/error.png';
import { Button } from 'components/shared/ButtonComponent';
import { useNavigate } from 'react-router-dom';
import { updatePaymentStatus, updateCreditPaymentStatus } from 'services/actions/invoiceAction';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';

const CrPaymentFailure: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { updateStatus, crdUpdateStauts } = useSelector((state: any) => state.invoice);
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
        localStorage.setItem('paymentStatus', 'failed');
        if (popup) {
            setTimeout(() => {
                window.close()
              
            }, 3500);
        }
    }, [dispatch]);

    return (
        <div className="mx-2 my-3">
            <div className="p-5 text-center bg-white h-100">
                <img src={ErrorImg} alt="check-mark" height="100px" />
                <h4 className="text-danger mt-3">Payment Unsuccessful !</h4>
                <h5 className="text-dark w-50 mx-auto mt-4 fs-18">
                    <span className="fw-normal">If money was debited from your account, it will be refunded automatically in 5-14 working days.</span>
                </h5>
                {/* <div className="mt-5 w-50 mx-auto">
                    <p className="fs-16 mb-2 text-primary fw-bold fs-17">Payment Details</p>
                    <div className="bg-light row m-0 p-2">
                        <div className="col">
                            <p className="mb-1 fw-bold">Invoice Number</p>
                            <p className="mb-0 fw-500">{updateStatus?.inv_datas?.invoice_Number}</p>
                        </div>
                        <div className="col">
                            <p className="mb-1 fw-bold">Invoice Amount</p>
                            <p className="mb-0 fw-500">${updateStatus?.inv_datas?.total_amount}</p>
                        </div>
                        <div className="col">
                            <p className="mb-1 fw-bold">Payment made via</p>
                            <p className="mb-0 fw-500">{updateStatus?.inv_datas?.paid_via}</p>
                        </div>
                        <div className="col">
                            <p className="mb-1 fw-bold">Payment Failed on</p>
                            <p className="mb-0 fw-500">{dayjs(new Date(updateStatus?.inv_datas?.payment_failed_on)).format('MM-DD-YYYY')}</p>
                        </div>
                    </div>
                </div> */}
                <div className="mt-3">
                    <Button type="primary" className="mt-3" onClick={() => navigate('/my-credit')}>
                        Back to My Credit
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CrPaymentFailure;
