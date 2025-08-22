import React, { useState, useEffect } from 'react';
import { Image, message } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { confirmPassword, userLogin, VerifyToken } from 'services/actions/authAction';
import { useSelector } from 'react-redux';

const ChangePassword: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const { tokenInfo, error4, loading7, success7, error7 } = useSelector((state: any) => state.auth);
    const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const url = window.location.href;
    const lastSegment = url.substring(url.lastIndexOf("/") + 1);
    const [showSuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success7 : null;
    const [showErrormsg, setShowerrormsg] = useState(false);
    const errormsg = showErrormsg ? error7 : null;
    const [errorMsg, setErrorMsg]: any = useState("");

    useEffect(() => {
        const reqData = {
            'token': lastSegment
        }
        dispatch(VerifyToken(reqData) as any);
    }, [dispatch]);

    useEffect(() => {
        if (tokenInfo) {
            if (tokenInfo?.status == "success") {
                console.log('')
            } else {
                navigate('/Page404');
            }
        }
        if (error4) {
            navigate('/Page404');
        }
    }, [tokenInfo, error4]);

    const onFinish = (values) => {
        const reqData = {
            "password": values?.password?.trim(),
            "token": lastSegment
        }
        dispatch(confirmPassword(reqData) as any);
        setErrorMsg("")
    };

    useEffect(() => {
        if (loading7) {
            setShowsuccessmsg(true);
            setShowerrormsg(true)
        }
    }, [loading7]);

    useEffect(() => {
        if (successmsg) {
            if (successmsg.detail == "Not found") {
                navigate('/Page404');
            } else {
                setShowsuccessmsg(false);
                message.success("Password Changed Successfully");
                setErrorMsg("");
                setTimeout(() => {
                    navigate('/login')
                }, 2000)
            }
        }
        if (errormsg) {
            const errors = errormsg?.message || [];
            if (errors && errors !== '') {
                setErrorMsg(errors);
            } else {
                setErrorMsg("Something went wrong, please try again.");
            }
            setShowerrormsg(false)
        }
    }, [successmsg, errormsg]);

    const validateConfirmPassword = ({ getFieldValue }) => ({
        validator(_, value) {
            if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
            }
            return Promise.reject(new Error('The two passwords that you entered do not match!'));
        },
    });

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
                        <h4 className="text-secondary fw-normal">Create New Password</h4>
                        <Form
                            form={form}
                            layout="vertical"
                            name="basic"
                            className="mt-4"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            {errorMsg && (
                                <div className="error-notify mb-2">
                                    <div className="error-message">
                                        {errorMsg}
                                    </div>
                                </div>
                            )}
                            <Form.Item
                                name="password"
                                className='text-start'
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                    {
                                        pattern: passwordPattern,
                                        message: 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character'
                                    }

                                ]}
                            >
                                <Input.Password placeholder='Password' autoComplete='new-password' />
                            </Form.Item>

                            <Form.Item
                                name="cpassword"
                                className='text-start'
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                    validateConfirmPassword,

                                ]}
                            >
                                <Input.Password placeholder='Confirm Password' autoComplete='confirm-password' />
                            </Form.Item>

                            <Form.Item
                                wrapperCol={{
                                    span: 24,
                                }}
                            >

                                <Button type="primary" htmlType="submit" loading={loading7} className="w-100 mt-3 fs-18 login-btn">
                                    Reset Password
                                </Button>
                                <div className='text-end mt-3 pe-1'>
                                    <Link to="/login" className='text-decoration-none '>Back to Login ?</Link>
                                </div>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword;