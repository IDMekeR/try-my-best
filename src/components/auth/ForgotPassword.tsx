import React, {useEffect, useState} from 'react';
import { Image, message } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { SendEmail } from 'services/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';


const ForgotPassword: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const url = window.origin;
    const {success1, loading1, error1  } = useSelector((state: any) => state.auth);
    const [showSuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : null;

    useEffect(() => {
        if (successmsg) {
            navigate('/email-sent');
            setShowsuccessmsg(false);
        }
        if (error1) {
            if (error1?.data) {
                message.error(error1?.data);
            }
            else {
                message.error("Email couldn't be sent");
            }
        }
    }, [successmsg, error1]);

    const onFinish = (values) => {
        const reqData = {
            "email": values?.email?.trim(),
            "domain": `${url}`
        }
        dispatch(SendEmail(reqData) as any);
        setShowsuccessmsg(true);
    }

    const gotoLogin = () => {
        navigate('/login');
    };
    return (
        <div className="login-container">
            <div className="text-center p-3 res-img">
                <Image src={EEGLogo} alt="eeg-logo" width="30%" preview={false} className="res-img" />
            </div>
            <div className="h-100 row m-0">
                <div className="login-bg-container text-center h-100 col-md-8">
                    <Image src={LoginImg} alt="login-img" preview={false} height="100%" width="auto" className="login-img" />
                </div>
                <div className="m-auto h-100 login-right-cont d-flex align-items-center col-md-4">
                    <div className="my-auto">
                        <Image src={EEGLogo} alt="eeg-logo" width="60%" className="eeg-logo" preview={false} />
                        <div className="eeg-img">
                            <Image src={LoginImg} alt="login-img" preview={false} height="60%" width="auto" className="login-img-right" />
                        </div>
                        <h5 className="text-secondary w-75 fw-normal mt-5 pt-4 fs-16">Enter your email and we will send you a link to get back into your account.</h5>
                        <Form form={form} className="mt-4" layout="vertical" autoComplete="off" initialValues={{
                            remember: true,
                        }}
                        onFinish={onFinish}>
                            <Form.Item
                                name="email"
                                label="Please Enter Your User Email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    }, {
                                        type: 'email',
                                        message: "Enter valid email address"
    
                                    },
                                ]}
                            >
                                <Input placeholder="Email"  />
                            </Form.Item>
                            <div>
                                <Button type="primary" htmlType="submit" className="w-100 mt-3 fs-18 login-btn" loading={loading1}>
                                    Reset
                                </Button>
                            </div>
                            <div className="my-3 text-end">
                                <a className="a-link fs-16 text-danger fw-600" onClick={gotoLogin}>
                                    Back to Login?
                                </a>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
