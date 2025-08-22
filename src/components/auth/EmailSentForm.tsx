import React,{useState, useEffect} from 'react';
import { Image, message, Result } from 'components/shared/AntComponent';
import { Form, Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { changeDefaultPass } from 'services/actions/authAction';
import { useDispatch, useSelector } from 'react-redux';


const EmailSentForm: React.FC = () =>{
    const navigate = useNavigate();
    return(
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
                        <div className='d-flex w-100 justify-content-center'>
                            <Image src={EEGLogo} alt="eeg-logo" width="65%" className="eeg-logo" preview={false} />
                        </div>
                        <div className="eeg-img">
                            <Image src={LoginImg} alt="login-img" preview={false} height="60%" width="auto" className="login-img-right" />
                        </div>
                        <Result
                            status="success"
                            title={`Password reset email sent successfully!`}
                            subTitle="We have sent you this email in response to your request to reset your password. We recommend that 
                            you keep your password secure and not share it with anyone."
                            extra={[
                                <Button key="submit" type="primary" htmlType="submit"  className="w-100 mt-3 fs-18 login-btn"  onClick={()=>navigate('/login')}>
                                    Login here
                                </Button>
                            ]}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmailSentForm