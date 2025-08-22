import React,{useState, useEffect} from 'react';
import { Image, message } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { changeDefaultPass } from 'services/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';


const ResetPassword: React.FC = () => {

      const [form] = Form.useForm();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const {userInfo, defaultPassInfo, success5, error5, loading5 } = useSelector((state: any) => state.auth);
        const passwordPattern = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        const [showSuccessmsg, setShowsuccessmsg] = useState(false);
        const successmsg = showSuccessmsg ? success5 : false;
        const [showErrormsg, setShowErrormsg] = useState(false);
        const errormsg = showErrormsg ? error5 : false;
        const [errorMsg,setErrorMsg]: any = useState("");
        
        const gotoLogin = () => {
            navigate('/login');
        };
    
        const onFinish = (values) => {
            const inputJson = {
                old_password: values.oldpassword?.trim(),
                new_password: values.password?.trim(),
                userid: localStorage.getItem('userid'),
            };
            dispatch(changeDefaultPass(inputJson) as any);
            sessionStorage.setItem('password', values.password);
            setShowsuccessmsg(true);
            setShowErrormsg(true);
            setErrorMsg("")
        };
    
        useEffect(() => {
            if (successmsg) {
                setShowsuccessmsg(false);
                message.success('Password Changed Successfully');
                navigate('/dashboard');
                setErrorMsg("")
                if (userInfo?.data?.mfa_enabled) {
                    navigate('/user-verification')
                }else if(!userInfo?.data?.acct_agreement?.acct_agreement && userInfo?.data?.user_acctid !== 0){
                    navigate('/customer-agreement');
                }else{
                    navigate('/dashboard');
                }
            }
            if (errormsg) {
                // message.error("Password couldn't be changed");
                if (errormsg?.message) {
                    const errorMessages = errormsg?.message?.split(/(?<!e\.g)\., /)?.map(msg => msg?.trim()); 
                    setErrorMsg(errorMessages);
                } else {
                    setErrorMsg(["Something went wrong, please try again."]);
                }
                setShowErrormsg(false);
            }
        }, [successmsg,errormsg]);
    
        const validateConfirmPassword = ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
        });
        const validateNewPassword = ({ getFieldValue }) => ({
            validator(_, value) {
                if (value && getFieldValue('oldpassword') === value) {
                    return Promise.reject(new Error('New password cannot be the same as the old password!'));
                }
                return Promise.resolve();
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
                        <h4 className="text-secondary fw-normal">You must change your password</h4>
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
                            {errorMsg.length > 0 && (
                                errorMsg?.map((error, index) => (
                                    <div key={index} className="error-notify mb-2">
                                        <div  className="error-message">
                                            {error}
                                        </div>
                                    </div>
                                ))
                            )}
                            <Form.Item
                                name="oldpassword"
                                className="text-start mb-3"
                                label="Old Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Input.Password placeholder="Password" autoComplete="new-password" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                className="text-start mb-3"
                                label="New Password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'This field is required!',
                                    },
                                    {
                                        pattern: passwordPattern,
                                        message: 'Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character',
                                    },
                                    validateNewPassword,
                                ]}
                            >
                                <Input.Password placeholder="Password" autoComplete="new-password" />
                            </Form.Item>
                            <Form.Item
                                name="cpassword"
                                className="text-start"
                                label="Confirm Password"
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
                            <Form.Item
                                wrapperCol={{
                                    span: 24,
                                }}
                            >

                                <Button type="primary" htmlType="submit" loading={loading5} className="w-100 mt-3 fs-18 login-btn">
                                    Change Password
                                </Button>
                                {/* <Button block className="btn-reset btn mt-3" htmlType="submit" size="large" loading={loading5}>
                                    Change Password
                                </Button> */}
                                {/* <div className="text-end mt-3 pe-1">
                                    <Link to="/login" className="text-decoration-none ">
                                        Back to Login ?
                                    </Link>
                                </div> */}
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default ResetPassword;
