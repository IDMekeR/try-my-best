import React, { useState, useEffect } from 'react';
import { Image, message, Steps, Tooltip } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { mfaCodeReset, mfaCodeVerify, sendEmailCode, userLogin, verifyEmailCode } from 'services/actions/authAction';
import { useSelector } from 'react-redux';
import AuthImg from 'assets/img/auth.png.png'
import { ArrowLeftOutlined, ArrowRightOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

interface OTPInputProps {
    length?: number;
}


const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const maskedName = name.substring(0, 4) + '*'.repeat(name.length - 4);
    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName.substring(0, 1) + '*'.repeat(domainName.length - 1) + '.' + '*'.repeat(domainExt.length);
    return maskedName + '@' + maskedDomain;
};

const Mfa: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] : any = useState('1');
    const {userInfo, loading8, error8, success8, loading9, error9, success9 ,loading10, loading11, success11,error11} = useSelector((state: any) => state.auth);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success8 : null;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error8 : null;
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success9 : null;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error9 : null;

    const [showSuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showSuccessmsg2 ? success11 : null;
    const [showErrormsg2, setShowErrormsg2] = useState(false);
    const errormsg2 = showErrormsg2 ? error11 : null;
    
    const [code, setCode] = useState();
    const [authMethod, setAuthMethod] = useState('mfa');
    const [emailCode, setEmailCode] = useState('');

    const sendCode = () => {
        const inputJson = {
            "email" : userInfo?.data?.email
        }
        dispatch(sendEmailCode(inputJson) as any);
    };

    const verifyEmail = () =>{
        const inputJson = {
            "userid" : Number(sessionStorage.getItem('userid')),
            "otp_code" : emailCode
        }
        dispatch(verifyEmailCode(inputJson) as any)
        setShowSuccessmsg2(true)
        setShowErrormsg2(true)
    }

    useEffect(() => {
        if (authMethod === 'email') {
            sendCode();
        }
    }, [authMethod]);

    const handleChange = (event) => {
        setCode(event.target.value);
    };

    const verifyCode = () => {
        const inputJson = {
            app_code: code,
        };
        dispatch(mfaCodeVerify(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    const resetCode = () => {
        const inputJson = {
            userid: sessionStorage.getItem('userid'),
        };
        dispatch(mfaCodeReset(inputJson) as any);
        setShowSuccessmsg1(true);
        setShowErrormsg1(true);
    };

    const UpdateLogin = () => {
        const inputJson = {
            username: userInfo?.data?.username?.trim(),
            password: userInfo?.data?.password?.trim(),
        };
        dispatch(userLogin(inputJson) as any);
    };

    useEffect(() => {
        if (successmsg) {
            // navigate('/dashboard');
            setShowSuccessmsg(false);
            if(!userInfo?.data?.acct_agreement?.acct_agreement && userInfo?.data?.user_acctid !== 0){
                navigate('/customer-agreement');
            }else{
                message.success('Logged in successfully');
                navigate('/dashboard');
            }
        }
        if (errormsg) {
            message.error('Code verification failed. Please ensure the details are correct');
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg2) {
            // navigate('/dashboard');
            setShowSuccessmsg2(false);
            if(!userInfo?.data?.acct_agreement?.acct_agreement && userInfo?.data?.user_acctid !== 0){
                navigate('/customer-agreement');
            }else{
                message.success('Logged in successfully');
                navigate('/dashboard');
            }
        }
        if (errormsg2) {
            message.error('Code verification failed. Please ensure the details are correct');
            setShowErrormsg2(false);
        }
    }, [successmsg2, errormsg2]);

    useEffect(() => {
        if (successmsg1) {
            message.success('Qr code reset successfully');
            setShowSuccessmsg1(false);
            UpdateLogin();
        }
        if (errormsg1) {
            message.error('Qr code reset failed');
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    return(
        <div className="login-container">
            <div className="h-100 row m-0">
                <div className="login-bg-container text-center h-100 col-md-6 d-flex align-items-center ">
                    <Image  src={AuthImg} alt="login-img" preview={false} height="70%" width="auto" className="login-img d-flex align-items-center" />
                </div>
                <div className="m-auto h-100 login-right-cont d-flex align-items-center col-md-6 bg-white">
                    <div className="">
                    {authMethod === 'mfa' ? (
                        <div className="bg-white p-3 rounded ">
                            <h2>Multi Factor Authentication</h2>
                            <Steps
                                direction="vertical"
                                current={currentStep}
                                onChange={(e) => setCurrentStep(e)}
                                items={
                                    userInfo?.data?.qr_code !== null
                                        ? [
                                              {
                                                  title: 'Start by getting the app',
                                                  description: 'On your phone, install the Microsoft Authenticator app.',
                                                  status: 'wait',
                                              },
                                              {
                                                  className: 'custom-step-no-hover',
                                                  title: 'Scan QR Code',
                                                  description: (
                                                      <div>
                                                          Use the Microsoft Authenticator app to scan the QR code. This will connect the Microsoft Authenticator app with your account.
                                                          <div>
                                                              <img src={userInfo?.data?.qr_code} className="qrcode-scanner" height="160px" />
                                                          </div>
                                                          
                                                      </div>
                                                  ),
                                                  status: 'wait',
                                              },
                                              {
                                                  title: 'Enter Code manually',
                                                  description: (
                                                      <div>
                                                          Enter temporary OTP from your authenticator app.
                                                          <div>
                                                              <Input
                                                                  className="bg-light"
                                                                  onChange={handleChange}
                                                                  onKeyDown={(e) => {
                                                                      if (e.key === 'Enter') {
                                                                          verifyCode();
                                                                      }
                                                                  }}
                                                              />
                                                          </div>
                                                      </div>
                                                  ),
                                                  status: 'wait',
                                              }
                                          ]
                                        : [
                                              {
                                                  title: 'Enter Code manually',
                                                  description: (
                                                      <div>
                                                          Enter temporary OTP from your authenticator app.
                                                          <div>
                                                              <Input
                                                                  className="bg-light"
                                                                  onChange={handleChange}
                                                                  onKeyDown={(e) => {
                                                                      if (e.key === 'Enter') {
                                                                          verifyCode();
                                                                      }
                                                                  }}
                                                              />
                                                              {/* <Tooltip title="Reset Qr code" className="mt-0">
                                                                    <Button type="link" loading={loading9} onClick={() => resetCode()}>
                                                                        Reset
                                                                    </Button>
                                                                </Tooltip> */}
                                                          </div>
                                                       
                                                      </div>
                                                  ),
                                                  status: 'wait',
                                              },
                                          ]
                                        }
                            />
                            <div className='d-flex'>
                                <Button type="primary" className="text-end ms-auto" disabled={!code} loading={loading8} onClick={verifyCode}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    ) : authMethod === 'email' ? (
                        <div>
                            <h2>Verify Your Identity</h2>
                            <p>We&apos;ve sent an email with your code to</p>
                            <Input className="bg-light" value={maskEmail(userInfo?.data?.email)} disabled />
                            <Input className="bg-light mt-2" placeholder="Enter the code*" onChange={(e) => setEmailCode(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        verifyEmail();
                                    }
                                }}
                            />
                            <div className='d-flex'>
                                <Button type="primary" className="text-end ms-auto mt-3" disabled={!emailCode} loading={loading11} onClick={verifyEmail}
                                >
                                    Next
                                </Button>
                            </div>
                            <p className="mt-2">
                                Didn&apos;t receive an email? <Button type="link" className='ps-2' onClick={() => { 
                                // setResetLoading(true);
                                sendCode();
                            }}>Resend</Button>
                            </p>
                        </div>
                    ) : (
                        <div className='col'>
                            <div className='d-flex justify-content-between'> 
                                <h2 className='text-center'>
                                    Select a method to verify <br /> your identity
                                </h2>
                                {/* <Tooltip title='Back'>
                                    <h2 className='ms-5' onClick={() => setAuthMethod('mfa')}><ArrowLeftOutlined/></h2>
                                </Tooltip> */}

                                {/* <Button type="primary" className='ms-5' onClick={() => setAuthMethod('mfa')}> <ArrowLeftOutlined/></Button> */}
                            </div>
                            <div className="bg-white p-3 rounded">
                                <div className="d-flex flex-column align-items-start w-100">
                                    <h5 className='fw-normal border-bottom w-100 p-3 hover-gray mb-0' onClick={() => setAuthMethod('mfa')}>
                                        <LockOutlined  className='me-2'/> Microsoft Authenticator or similar
                                    </h5>
                                    <h5 className='fw-normal border-bottom w-100 p-3 hover-gray' onClick={() => setAuthMethod('email')}>
                                        <MailOutlined className='me-2' /> Email
                                    </h5>
                                </div>
                            </div>
                        </div>
                    )}
                    {
                        authMethod !== 'select' &&
                        <div className='d-flex justify-content-center'>
                            <Button type="link" className="text-center fs-17  mt-2" onClick={() => setAuthMethod('select')}>
                                Try Another Method
                            </Button>
                        </div>
                    }
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Mfa;
