import React, {useState, useEffect} from 'react';
import { Form, Input ,Radio} from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Alert, Modal, Spin, Steps, message } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { getUserData, saveUser } from 'services/actions/securityAction';
import { getUserProfile, mfaCodeReset, mfaCodeVerify, mfaEmailReset, sendEmailCode, verifyMfaReset } from 'services/actions/authAction';
import { WarningTwoTone } from '@ant-design/icons';

interface ChildProps {
    openModal: boolean;
    handleProfile: () => void;
}

const maskEmail = (email) => {
    if (!email) return '';
    const [name, domain] = email.split('@');
    const maskedName = name.substring(0, 4) + '*'.repeat(name.length - 4);
    const [domainName, domainExt] = domain.split('.');
    const maskedDomain = domainName.substring(0, 1) + '*'.repeat(domainName.length - 1) + '.' + '*'.repeat(domainExt.length);
    return maskedName + '@' + maskedDomain;
};

const UserProfile: React.FC<ChildProps> = ({openModal, handleProfile} ) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const {userInfo,loading8, success8, error8, userProfileInfo, success6, loading6, error6,
        verifyReset,loading14, error14, success14, loading13, loading9, error9, success9
    } = useSelector((state: any) => state.auth);    
    const {getUserInfo, loading2, error2, success2 } = useSelector((state: any) => state.security);
    const [isActive, setIsActive] = useState(true);
    const [defaultValues, setDefaultValues]: any = useState(null);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success2 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg: any = showErrormsg ? error2 : false;
    const [selectedSetting, setSelectedSetting] =  useState('general')
    const [code, setCode] = useState("");
    const [mfaEnabled, setMfaEnabled] = useState(false);
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success8 : null;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error8 : null;

    //mfa email indication
    const [showSuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showSuccessmsg2 ? success14 : null;
    const [showErrormsg2, setShowErrormsg2] = useState(false);
    const errormsg2 = showErrormsg2 ? error14 : null;

    //mfa auth indication
    const [showSuccessmsg3, setShowSuccessmsg3] = useState(false);
    const successmsg3 = showSuccessmsg3 ? success9 : null;
    const [showErrormsg3, setShowErrormsg3] = useState(false);
    const errormsg3 = showErrormsg3 ? error9 : null;

    const [resetMode, setResetMode] = useState("app"); 
    const [authCode, setAuthCode] = useState(""); 
    const [emailCode, setEmailCode] = useState(""); 

    const options: { label: string; value: string }[] = [
        { label: 'General', value: 'general' },
        { label: 'Authentication', value: 'auth' },
    ];

    const handleResetOptionChange = (e) => {
        setResetMode(e.target.value);
        setEmailCode("")
        setAuthCode("")
        setCode("")
    };

    const handleChangeSettingType = (e: any) => {
        setSelectedSetting(e.target.value);
    };

    const handleChange = (event) => {
        setCode(event.target.value);
    };

    const handleAuthCodeChange = (e) => {
        setAuthCode(e.target.value);
    };
    
    const handleEmailCodeChange = (e) => {
        setEmailCode(e.target.value);
    };

    const handleMfaChange = (e) => {
        setMfaEnabled(e.target.value); 
    };

    const handleMfaEmailReset = () =>{
        const inputJson = {
            "userid" : Number(sessionStorage.getItem('userid')),
            "otp_code" : resetMode == 'app' ? authCode : emailCode
        }
        dispatch(verifyMfaReset(inputJson) as any)
        setShowSuccessmsg2(true)
        setShowErrormsg2(true);
    }

    const handleMfaAuthReset = () =>{
        const inputJson = {
            "app_code" : authCode
        }
        dispatch(mfaCodeReset(inputJson) as any)
        setShowSuccessmsg3(true)
        setShowErrormsg3(true);
    }
   
    function getProfileInfo() {
        const inputJson = {
            userid: Number(sessionStorage.getItem('userid')),
        };
        dispatch(getUserProfile(inputJson) as any);
    }

    const getUserDetail = () => {
        dispatch(getUserData(sessionStorage.getItem('userid')) as any);
    };

    const handleSendCode = async () => {
        try {
            await sendResetCode();
            await new Promise(resolve => setTimeout(resolve, 1000)); 
        } finally {
            message.success('OTP sent successfully! Check your email for the new code')
        }
    };

    const sendResetCode = () => {
        const inputJson = {
            "email" : userProfileInfo?.data?.email
        }
        dispatch(mfaEmailReset(inputJson) as any);
    };

    const verifyCode = () => {
        const inputJson = {
            app_code: code,
        };
        dispatch(mfaCodeVerify(inputJson) as any);
        setShowSuccessmsg1(true);
        setShowErrormsg1(true);
    };

    useEffect(() => {
        getUserDetail();
    }, [openModal]);

    const loadData = (defaultValues: any) => {
        form.setFieldValue("email", defaultValues?.email ?? '');
        form.setFieldValue("firstname", defaultValues?.first_name ?? '');
        form.setFieldValue("lastname", defaultValues?.last_name ?? '');
        form.setFieldValue("mfa", defaultValues?.mfa_enabled ?? false);
        setMfaEnabled(defaultValues?.mfa_enabled === true ? true : false)
    }

    useEffect(() => {
        if (getUserInfo?.data && openModal) {
            loadData(getUserInfo?.data);
            setIsActive(getUserInfo?.data?.is_active);
            setDefaultValues(getUserInfo?.data);
        }
    }, [getUserInfo?.data,openModal]);

    const handleCancel = () =>{
        handleProfile()
        setSelectedSetting('general')
        setResetMode('app')
        setAuthCode("")
        setEmailCode("")   
        setCode("")
    }

    const clearModalSetting = () => {
        setSelectedSetting('general')
        setResetMode('app')
        setAuthCode("")
        setEmailCode("")
        setCode("")

    }

    const onFinish = async () => {
        try {
            await form.validateFields();
            const value = form.getFieldsValue();

            const inputJson = {
                userid: defaultValues !== null ? defaultValues.id : 0,
                username: defaultValues?.username,
                email: selectedSetting === 'auth'? defaultValues?.email : value.email,
                first_name: selectedSetting === 'auth'? defaultValues?.first_name : value.firstname,
                last_name: selectedSetting === 'auth'? defaultValues?.last_name : value.lastname,
                is_active:isActive,
                accountid: defaultValues?.accountid || 0,
                groups: defaultValues?.groups,
                mfa_enabled: selectedSetting !== 'auth' ? mfaEnabled : value?.mfa,
            };
            dispatch(saveUser(inputJson) as any)
            setShowSuccessmsg(true)
            setShowErrormsg(true)
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg) {
            message.success('User Profile Updated successfully');
            getProfileInfo()
            setShowSuccessmsg(false);
            handleProfile();
            clearModalSetting()
        }
        if (errormsg) {
            if (error2?.data) {
                // Format the error message
                const errorMessage = Object.entries(error2.data)
                    .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
                    .join('\n');
            
                message.error(errorMessage);
            } else {
                message.error("User Profile couldn't be Updated");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg1) {
            setShowSuccessmsg1(false);
            message.success("MFA has been enabled successfully.");
            form.resetFields(['emailCode']);
            form.resetFields(['authCode']);
            getProfileInfo()
            handleProfile()
            clearModalSetting()
        }
        if (errormsg1) {
            message.error('Code verification failed. Please ensure the details are correct.');
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);
    
    useEffect(()=>{
        if(successmsg2){
            message.success("MFA has been successfully reset.")
            setShowSuccessmsg2(false)
            getProfileInfo()
            handleProfile()
            clearModalSetting()
        }
        if(errormsg2){
            message.error('Code verification failed. Please ensure the details are correct.')
            setShowErrormsg2(false)
        }
    }, [successmsg2, errormsg2])

    useEffect(()=>{
        if(successmsg3){
            message.success("MFA has been successfully reset.")
            setShowSuccessmsg3(false)
            getProfileInfo()
            handleProfile()
            clearModalSetting()
        }
        if(errormsg3){
            message.error('Code verification failed. Please ensure the details are correct.')
            setShowErrormsg3(false)
        }
    }, [successmsg3, errormsg3])

    const isConfirmResetDisabled = !(authCode || emailCode);

    return(
        <div>
        <Modal
            title="Update Profile"
            open={openModal}
            onCancel={handleCancel}
            maskClosable={false}
            footer={[
                <Button key="back" className='bg-danger text-white' onClick={handleCancel}>
                    Cancel
                </Button>,
                selectedSetting === 'auth' ? (
                    <Button key="submit" type="primary" loading={loading2 || loading8 || loading14 || loading9}  
                    disabled ={mfaEnabled && userProfileInfo?.data?.qr_code === null && userProfileInfo?.data?.mfa_enabled 
                         ? isConfirmResetDisabled 
                         : mfaEnabled  && userProfileInfo?.data?.qr_code !== null && !code ? true
                         : false}
                    onClick={
                        mfaEnabled && !userProfileInfo?.data?.mfa_enabled ? onFinish :
                        mfaEnabled  && userProfileInfo?.data?.qr_code !== null ? verifyCode:
                        mfaEnabled   && userProfileInfo?.data?.qr_code === null ? resetMode === 'app' ? handleMfaAuthReset : handleMfaEmailReset : onFinish
                    }
                    >
                        {mfaEnabled && !userProfileInfo?.data?.mfa_enabled ? 'Save' :
                        mfaEnabled  && userProfileInfo?.data?.qr_code !== null ? 'Verify & Save' : 
                        mfaEnabled  && userProfileInfo?.data?.qr_code === null ? 'Reset & Save' : 'Save'}
                    </Button>
                ) : (
                    <Button key="submit" type="primary" loading={loading2} onClick={onFinish}>
                        Save
                    </Button>
                )
            ]}
        >
            <div className='mb-2'>
                <Radio.Group options={options} optionType="button" defaultValue={selectedSetting} value={selectedSetting} onChange={handleChangeSettingType} buttonStyle="solid" />
            </div>
            
            <Form layout="vertical" form={form} name="basic" autoComplete="off">
            {
                    selectedSetting == 'general' &&
                    <>
                        <Form.Item
                            label="Email"
                            name="email"
                            className="w-100"
                            rules={[
                                {
                                    type: 'email',
                                    message: 'Enter valid E-mail!',
                                },
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input autoComplete="off" />
                        </Form.Item>
                        <Form.Item
                            label="First Name"
                            name="firstname"
                            className="w-100"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            label="Last Name"
                            name="lastname"
                            className="w-100"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </>
            }
                {
                    selectedSetting == 'auth' &&
                    <>
                        <Form.Item label="Is MFA Enabled" name="mfa" className="col w-100 mb-2">
                            <Radio.Group name="radiogroup" onChange={handleMfaChange}>
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    
                        {
                            mfaEnabled && userProfileInfo?.data?.qr_code !== null && (
                            <>
                                <div className="fs-16 text-warn mb-2">
                                    <div className="text-warn fw-bold mb-2  px-3 py-1">
                                        <WarningTwoTone className="text-warning fs-16" twoToneColor="#ff9966" />  MFA is enabled but not yet registered. Please complete the setup using an authentication app. 
                                    </div>
                                </div>
                                <div>
                                    <Steps
                                        direction="vertical"
                                        items={
                                            userProfileInfo?.data?.qr_code !== null
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
                                                                    <img src={userProfileInfo?.data?.qr_code} className="qrcode-scanner" height="160px" />
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
                                                                        type='number'
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
                                                                        type='number'
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
                                                    },
                                                ]
                                        }
                                        />
                                </div>
                              
                            </>
                            )
                        }

                        {mfaEnabled && userProfileInfo?.data?.qr_code === null && userProfileInfo?.data?.mfa_enabled &&
                            <>
                                <Form.Item label="Select a method to reset MFA" className='mb-2'>
                                    <Radio.Group defaultValue={resetMode} onChange={handleResetOptionChange} >
                                        <Radio value="app">Use Authentication App Code</Radio>
                                        <Radio value="email">Receive Code via Email</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                
                                {resetMode === "app" && (
                                    <Form.Item
                                        label="Authentication App Code"
                                        name="authCode"
                                        rules={[{ required: true, message: "Please enter the authentication code" }]}
                                    >
                                        <Input
                                            type='number'
                                            placeholder="Enter MFA code from app"
                                            value={authCode}
                                            onChange={handleAuthCodeChange}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleMfaAuthReset();
                                                }
                                            }}
                                        />
                                    </Form.Item>
                                )}

                                {resetMode === "email" && (
                                    <>
                                        <Form.Item
                                            className='mb-2'
                                            label="Email Address"
                                            name="email"
                                            initialValue={userProfileInfo ? maskEmail(userProfileInfo?.data?.email) : ""}
                                        >
                                            <div className='d-flex'>

                                                <Input
                                                    value={userProfileInfo ? maskEmail(userProfileInfo?.data?.email) : ""}
                                                    disabled
                                                />
                                                <Button
                                                className='border'
                                                onClick={handleSendCode}
                                                type="primary"
                                                loading={loading13}
                                                >
                                                   Send Code
                                                </Button>
                                            </div>
                                        </Form.Item>
                                        <Form.Item
                                            label="Email OTP Code"
                                            name="emailCode"
                                        >
                                            <Input
                                                placeholder="Enter OTP received via email"
                                                value={emailCode}
                                                type='number'
                                                onChange={handleEmailCodeChange}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleMfaEmailReset();
                                                    }
                                                }}
                                            />
                                            
                                        </Form.Item>
                                    </>
                                )}
                            </>
                        }
                    </>
                }
            </Form>
        </Modal>
    </div>
    )
}

export default UserProfile;