import { Navigate, Route, Routes } from 'react-router-dom';
import loadable from '@loadable/component';
import LoginPage from './components/auth/LoginPage';
import ForgotPassword from 'components/auth/ForgotPassword';
import ResetPassword from 'components/auth/ResetPassword';
import PrivateRoute from 'components/routes/PrivateRoute';
import EdfViewer from 'components/edfViewer/EdfViewer';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'assets/styles/app.scss';
import 'assets/styles/customtheme.scss';
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import 'assets/styles/resolution.scss';            
import { useSelector } from 'react-redux';
import ChangePassword from 'components/auth/ChangePassword';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import Mfa from 'components/auth/Mfa';
import CustomerAgreement from 'components/auth/CustomerAgreement';
import SignupAccount from 'components/auth/SignupAccount';
import { useEffect, useState } from 'react';
const EmailSentForm = loadable(() => import('components/auth/EmailSentForm'), { fallback: <LoadingIndicator /> });
const Page404 = loadable(() => import('components/auth/Page404'), { fallback: <LoadingIndicator /> });
const PatientIntakeForm = loadable(() => import('components/PatientIntakeForm'), { fallback: <LoadingIndicator /> });


function App() {
    const isAuth = localStorage.getItem('token') === "true"
    const { userInfo } = useSelector((state: any) => state.auth);
    const hasUserInfo = sessionStorage.getItem('accountid');

    return (
        <div className="App">
            <Routes>
                <Route path="/login" element={<LoginPage />}></Route>
                <Route path="/reset-password" element={<ForgotPassword />}></Route>
                <Route path="/email-sent" element={<EmailSentForm />}></Route>
                <Route path="/change-password/:id" element={<ChangePassword />} />
                <Route path="/page404" element={<Page404 />}></Route>
                <Route path="/patient-form/:id" element={<PatientIntakeForm />}></Route>
                <Route path="/change-default-password" element={<ResetPassword />}></Route>
                <Route path="/" element={<Navigate replace to="/login" />} />
                <Route path="/edf" element={<EdfViewer />}></Route>
                <Route path="/user-verification" element={<Mfa />}></Route>
                <Route path="/customer-agreement" element={<CustomerAgreement />}></Route>
                <Route path='/signup-account' element={<SignupAccount />} />
                {isAuth || hasUserInfo ? <Route path="*" element={<PrivateRoute />} /> : <Route path="*" element={<Navigate to="/login" />} />}
            </Routes>
        </div>
    );
}

export default App;
