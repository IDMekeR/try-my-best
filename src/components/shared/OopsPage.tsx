import { Button, Image } from 'antd';
import React from 'react';
import PageIcon from 'assets/img/oops-page.png';
import logoIcon from 'assets/img/brandname.png';
import { useNavigate } from "react-router-dom";


interface OopsPageProps {
    resetErrorBoundary: () => void;
}

const OopsPage: React.FC<OopsPageProps> = ({ resetErrorBoundary }) => {
    const navigate = useNavigate();
    const navigateToDashboard = () => {
        resetErrorBoundary();
        navigate('/dashboard');
    };
    return(
        <div className='oops-page p-5 bg-white'>
            <div className='d-flex container '>
                <Image src={logoIcon} preview={false} width={250} />
            </div>
            <div className='h-100 d-flex container'>
                <div className='col my-auto ps-2'>
                    <h1 className="error-number mb-2">Oops</h1>
                    <h2 className="error-title mb-3">Something went wrong</h2>
                    <p className="error-text">Oops. The page you were looking is temporarily unavailable.</p>
                    <div className='text-start mt-4'>
                    <Button type="primary" onClick={() => navigateToDashboard()} className='me-auto'>Back</Button>
                    </div>
                </div>
                <div className='col'>
                    <Image src={PageIcon} preview={false} />
                </div>

            </div>
        </div>
    )
    
}

export default OopsPage
