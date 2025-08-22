import React, { useState, useEffect } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { Select, Form } from 'components/shared/FormComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { useLocation } from 'react-router-dom';
import { saveAssociateMarker } from 'services/actions/pipeline/stepwizardAction';
import { LoadingOutlined } from '@ant-design/icons';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    getUnAssMarkers: () => void;
    getMarkers: () => void;
}

const MarkerModal: React.FC<ChildProps> = ({ openModal, closeModal, getUnAssMarkers, getMarkers }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading12, unMarkerInfo, loading13, success13, error13 } = useSelector((state: any) => state.wizard);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success13 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error13 : false;

    const options = loading12
        ? []
        : unMarkerInfo?.data?.map((item: any) => {
              return {
                  label: item.markername,
                  value: item.id,
              };
          });

    const submitMarker = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                markerid: value?.marker?.toString(),
                requestid: location.state?.id,
            };
            dispatch(saveAssociateMarker(inputJson) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (successmsg) {
            message.success(`Markers associated to this request successfully`);
            setShowSuccessmsg(false);
            closeModal();
            getMarkers();
            getUnAssMarkers();
            form.resetFields();
        }
        if (errormsg) {
            message.error(`Markers couldn't be associated to this request`);
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Modal title="Associater Markers" open={openModal} confirmLoading={loading13} onCancel={closeModal} okText="Save" onOk={submitMarker}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}>
                <Form form={form} layout="vertical">
                    <Form.Item name="marker" label="Select Marker" rules={[{ required: true, message: 'This field is required' }]}>
                        <Select
                            mode="multiple"
                            options={options}
                            getPopupContainer={(trigger) => trigger.parentNode}
                            filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                            notFoundContent={
                                <div className="text-center p-4">
                                    {loading12 ? (
                                        <span>
                                            <LoadingOutlined />
                                            Loading...
                                        </span>
                                    ) : (
                                        <span>No markers available</span>
                                    )}
                                </div>
                            }
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default MarkerModal;
