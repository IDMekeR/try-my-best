import React, { useState, useEffect } from 'react';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Modal, message } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { ChangePass } from 'services/actions/authAction';
import { validateConfirmPassword, passwordPattern } from 'components/shared/FormValidators';

interface ChildProps {
    openModal: boolean;
    handleChangePass: () => void;
}

const ChangePassword: React.FC<ChildProps> = ({ openModal, handleChangePass }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { defaultPassInfo,success2, error2, loading2 } = useSelector((state: any) => state.auth);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success2 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error2 : false;

    const handleCancel1 = () => {
        handleChangePass();
    };

    const onFinish = async () => {
        try {
            await form.validateFields();
            const values = form.getFieldsValue();
            const reqData = {
                old_password: values.oldpassword,
                new_password: values.password,
            };
            dispatch(ChangePass(reqData) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Password changed successfully');
            setShowSuccessmsg(false);
            form.resetFields();
            handleCancel1();
        }
        if (errormsg) {
            if (errormsg?.message) {
                const errorMessages = error2?.message?.split(/(?<!e\.g)\., /)?.map(msg => msg?.trim());
                // errorMessages.forEach(msg => message.error(msg));
                errorMessages.forEach((msg, index) => {
                    setTimeout(() => message.error(msg), index * 300);
                });
            } else {
                message.error("Password couldn't be changed");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div>
            <Modal
                title="Change Password"
                open={openModal}
                onCancel={handleCancel1}
                maskClosable={false}
                footer={[
                    <Button key="back" className='bg-danger text-white' onClick={handleCancel1}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" loading={loading2} onClick={onFinish}>
                        Reset Password
                    </Button>,
                ]}
            >
                <Form layout="vertical" form={form} name="basic" autoComplete="off">
                    <Form.Item
                        name="oldpassword"
                        label="Old Password"
                        className="w-100"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" autoComplete="old-password" />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        label="New Password"
                        className="w-100"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                            {
                                pattern: passwordPattern,
                                message: 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
                            },
                        ]}
                    >
                        <Input.Password placeholder="Password" autoComplete="new-password" />
                    </Form.Item>
                    <Form.Item
                        name="cpassword"
                        className="w-100"
                        label="New Password"
                        rules={[
                            {
                                required: true,
                                message: 'This field is required!',
                            },
                            validateConfirmPassword,
                        ]}
                    >
                        <Input.Password placeholder="Confirm Password" autoComplete="confirm-password" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default ChangePassword;
