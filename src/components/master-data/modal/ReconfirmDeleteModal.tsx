import React from 'react';
import { Modal, Image } from 'components/shared/AntComponent';
import { useSelector } from 'components/shared/CompVariables';
import DelImg from 'assets/img/del.png';
import 'assets/styles/modal.scss';

interface ChildProps {
    openModal: boolean;
    handleBack: () => void;
    callBackFunc: (val2: any) => void;
    mid: number;
}

const ReconfirmDeleteModal: React.FC<ChildProps> = ({ openModal, handleBack, callBackFunc, mid }) => {
    const { loading8 } = useSelector((state: any) => state.diagnosis);
    const handleCancel = () => {
        handleBack();
    };

    const submitDelete = () => {
        callBackFunc('True');
    };

    return (
        <div>
            <Modal className="delete-modal" confirmLoading={loading8} open={openModal} onCancel={handleCancel} onOk={submitDelete} maskClosable={false} okText="Delete"
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}
            >
                <div className="d-flex justify-content-center">
                    <Image src={DelImg} preview={false} height="90px" />
                </div>
                <h5 className="text-center mt-3 text-dark">Are you sure?</h5>
                <p className="fs-15 text-center">
                    This action cannot be undone. This
                    {mid === 1
                        ? ' diagnosis '
                        : mid === 2
                          ? ' lifestyle '
                          : mid === 4
                            ? ' medication '
                            : mid === 5
                              ? ' supplement '
                              : mid === 6
                                ? ' symptoms '
                                : mid === 7
                                  ? ' Patient '
                                  : ' marker '}
                    is associated with service request, it will be lost.
                </p>
            </Modal>
        </div>
    );
};

export default ReconfirmDeleteModal;
