import React, { useState, useEffect } from 'react';
import { Image, message } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userLogin } from 'services/actions/authAction';
import { useSelector } from 'react-redux';

const LoginPage: React.FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState("");
    const { userInfo, success, error, loading } = useSelector((state: any) => state.auth);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error : false;

    const gotoForgotPass = () => {
        navigate('/reset-password');
    };
    const submitLogin = (values: any) => {
        const inputJson = {
            username: values.username?.trim(),
            password: values.password?.trim(),
        };
        dispatch(userLogin(inputJson) as any);
        setErrorMsg("");
    };

    const gotoCreateAcc=()=>{
        navigate('/signup-account');
    }

    useEffect(() => {
        if (success) {
            if (userInfo && userInfo?.data?.password_reset_requested_flag) {
                navigate('/change-default-password');
                setShowSuccessmsg(false);
                setErrorMsg("");
                }else if (userInfo?.data?.mfa_enabled) {
                    navigate('/user-verification')
            } else {
                navigate('/dashboard');
            }
        } else if (error !== null) {
            // message.error('Login Failed!');
            setErrorMsg("Username or password is incorrect. Try again!");
            setShowErrormsg(false);
        }
    }, [success, error]);

    return (
        <div className="login-container">
            <div className="text-center p-3 res-img">
                <Image src={EEGLogo} alt="eeg-logo" width="30%" preview={false} className="res-img" />
            </div>
            <div className="h-100 row m-0">
                <div className="login-bg-container text-center h-100 col-md-8">
                    <Image src={LoginImg} alt="login-img" preview={false} height="100%" width="auto" className="login-img" />
                </div>
                <div className="m-auto h-100 login-right-cont d-flex align-items-center col-md-4 bg-white">
                    <div className="my-auto">
                        <Image src={EEGLogo} alt="eeg-logo" width="65%" className="eeg-logo" preview={false} />
                        <div className="eeg-img">
                            <Image src={LoginImg} alt="login-img" preview={false} height="60%" width="auto" className="login-img-right" />
                        </div>
                        <h1 className="text-dark mt-4">Welcome!</h1>
                        <h4 className="text-secondary fw-normal">Please Login to continue</h4>
                        <Form form={form} className="mt-4" layout="vertical" autoComplete="off" onFinish={submitLogin}>
                            {errorMsg ? <div className='error-notify mb-2'> Username or Password is incorrect ! Try again.</div> : ""}
                            <Form.Item
                                name="username"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input placeholder="Username or Email" autoComplete="username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password" autoComplete="new-password" />
                            </Form.Item>
                            <div>
                                <Button type="primary" htmlType="submit" loading={loading} className="w-100 mt-3 fs-18 login-btn">
                                    Login
                                </Button>
                            </div>
                            <div className='d-flex w-100 my-2'>
                                <div>
                                    <a className="a-link fs-16  fw-600" onClick={gotoCreateAcc}>Sign up new Account</a>
                                </div>
                                <div className="ms-auto">
                                    <a className="a-link fs-16 text-danger fw-600" onClick={gotoForgotPass}>
                                        Forgot Password?
                                    </a>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
