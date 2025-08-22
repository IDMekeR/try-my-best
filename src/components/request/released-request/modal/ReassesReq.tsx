import React, { useState, useEffect } from 'react';
import { message, Modal, Progress, Upload } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { reassessmentReq } from 'services/actions/releasedReqAction';

interface ChildProps {
    openModal: boolean;
    closeModal: any;
    rowData: any;
}

const ReassesReq: React.FC<ChildProps> = ({ openModal, closeModal, rowData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading5, success5, error5 } = useSelector((state: any) => state.released);
    const [reason, setReason] = useState('');
    const [showsuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success5 : null;
    const [showErrmsg, setShowErrmsg] = useState(false);
    const errormsg = showErrmsg ? error5 : false;

    const reReleaseRequest = () => {
        const inputJson = {
            ServiceRequestid: rowData?.id,
            cancel_reason: reason,
        };
        dispatch(reassessmentReq(inputJson) as any);
        setShowsuccessmsg(true);
        setShowErrmsg(true);
    };

    const handleReassOk = () => {
        reReleaseRequest();
    };

    useEffect(() => {
        if (successmsg) {
            message.success('The Request is submitted for assessment successfully');
            setShowsuccessmsg(false);
            setReason('');
            closeModal(true);
        }
        if (errormsg) {
            if (error5?.data) {
                message.error(error5?.data);
            } else {
                message.error("Service Request Couldn't be submitted for assessment");
            }
            setShowErrmsg(false);
            closeModal(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Modal title="Reassessment Request" open={openModal} onOk={handleReassOk} onCancel={closeModal} loading={loading5}
            okButtonProps={{ disabled: !reason.trim() }}
            okText="Save"
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}
            >
                <div className="bg-aliceblue border d-flex ps-3 pe-2 py-2 mb-3">
                    <div className="col">
                        <h6>Request No</h6>
                        <p>{rowData?.encoded_RequestNumber}</p>
                    </div>
                    <div className="col">
                        <h6>Patient Name</h6>
                        <p>{rowData?.patient_name}</p>
                    </div>
                    <div className="col">
                        <h6>Account Name</h6>
                        <p>{rowData?.account_name}</p>
                    </div>
                </div>
                <h6 className="mb-0 text-dark">Comments</h6>
                <Input.TextArea className="mt-2 mb-2 py-2" placeholder="Enter reason for reassessment" value={reason} onChange={(e) => setReason(e.target.value)} />
                {!reason.trim() && (
                    <p className="text-danger mt-1">Please enter a reason for reassessment before submitting.</p>
                )}
            </Modal>
        </div>
    );
};

export default ReassesReq;
