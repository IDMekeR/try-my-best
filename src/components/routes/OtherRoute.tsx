import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AccountDetail from 'components/account/AccountDetail';
import AccountManagement from 'components/account/AccountManagement';
import JobManager from 'components/job-manager/JobManager';
import EdfProcessing from 'components/job-manager/sub-screens/EdfProcessing';
import PaymentSuccess from 'components/billing-and-invoice/payment-status/PaymentSuccess';
import PaymentFailure from 'components/billing-and-invoice/payment-status/PaymentFailure';
import CrPaymentSuccess from 'components/billing-and-invoice/payment-status/CrPaymentSuccess';
import CrPaymentFailure from 'components/billing-and-invoice/payment-status/CrPaymentFailure';
import AutopaySuccess from 'components/account/modal/AutopaySuccess';
import AutopayError from 'components/account/modal/AutopauError';
import ArtifactToggle from 'components/job-manager/ArtifactToggle';
import { useSelector } from 'react-redux';
import LoadingIndicator from 'components/shared/LoadingIndicator';
import Account from 'components/account/Account';
import PhqManagement from 'components/master-data/PhqManagement';

const AdminDashboard = loadable(() => import('components/dashboard/AdminDashboard'), { fallback: <LoadingIndicator /> });
const ReportComparison = loadable(() => import('components/report-comparison/ReportComparison'), { fallback: <LoadingIndicator /> });
const Patient = loadable(() => import('components/patient/Patient'), { fallback: <LoadingIndicator /> });
const PatientDetail = loadable(() => import('components/patient/PatientDetail'), { fallback: <LoadingIndicator /> });
const GlobalSearchResult = loadable(() => import('components/search/GlobalSearchResult'), { fallback: <LoadingIndicator /> });
const UserAccountManagement = loadable(() => import('components/security/Security'), { fallback: <LoadingIndicator /> });
const EDFSetting = loadable(() => import('components/settings/edf-setting/EDFSetting'), { fallback: <LoadingIndicator /> });
const AmazonSearch = loadable(() => import('components/search/AmazonSearch'), { fallback: <LoadingIndicator /> });
const MasterRoute = loadable(() => import('components/routes/MasterRoute'), { fallback: <LoadingIndicator /> });


const extractMenuUrls = (menuData) => {
    const urls: string[] = [
        'search',
        'security',
        'report-comparison',
        'order-management',
        'generate-invoice',
        'invoice1',
        'report-rate',
        'invsuccess-payment',
        'inverror-payment',
        'error-payment',
        'customer-agreement',
        'success-payment',
        'payment-detail',
        'buy-credit',
        'medicine-automation',
        'supplement-automation',
        'lifestyle-automation',
        'research/recommended-medication',
        'amplifier-master',
        'autopay-success',
        'autopay-error',
        'credit-payment-success',
        'credit-payment-error',
        'phq-master'
    ];

    if (Array.isArray(menuData)) {
        menuData.forEach((item: any) => {
            if (item.menu_url) urls.push(item.menu_url);
            if (item.submenuservice && Array.isArray(item.submenuservice)) {
                item.submenuservice.forEach((subItem: any) => {
                    if (subItem.menu_path) urls.push(subItem.menu_path);
                });
            }
        });
    }
    return urls.filter((url) => url);
};

const normalizePath = (path) => {
    return path.replace(/^\//, '').toLowerCase().split(/[?#]/)[0];
};

const isPathAllowed = (currentPath, allowedPaths) => {
    const normalizedCurrentPath = normalizePath(currentPath);
    return allowedPaths.some((path) => {
        const normalizedAllowedPath = normalizePath(path);
        return normalizedCurrentPath === normalizedAllowedPath || normalizedCurrentPath.startsWith(`${normalizedAllowedPath}/`);
    });
};

const OtherRoute: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { menuInfo, loading1 } = useSelector((state: any) => state.dashboard);
    const [allowedPaths, setAllowedPaths]: any = useState([]);

    useEffect(() => {
        if (!loading1 && menuInfo?.data) {
            const paths = extractMenuUrls(menuInfo?.data);
            setAllowedPaths(paths);
        }
    }, [menuInfo, loading1]);


    useEffect(() => {
        if (loading1 || allowedPaths.length === 0) {
            return;
        }
        const currentPath = normalizePath(location?.pathname);
        const pathIsAllowed = isPathAllowed(currentPath, allowedPaths);

        if (!pathIsAllowed) {
            navigate('/unauthorized');
        }
    }, [location.pathname, allowedPaths, loading1, navigate]);

    return (
        <div>
            <Routes>
                <Route path="/search" element={<GlobalSearchResult />} />
                <Route path="/patient-list" element={<Patient />} />
                <Route path="/account" element={<Account />} />
                <Route path="/patient-list/patient-medication" element={<PatientDetail />} />
                <Route path="/account/account-details" element={<AccountDetail />} />
                <Route path="/edf-config" element={<EDFSetting />} />
                <Route path="/edf_job_manager" element={<JobManager />} />
                <Route path="/edf_job_manager/edf-processing" element={<EdfProcessing />} />
                <Route path="/report-comparison" element={<ReportComparison />} />
                <Route path="/security" element={<UserAccountManagement />} />
                <Route path="/invsuccess-payment" element={<PaymentSuccess />} />
                <Route path="/inverror-payment" element={<PaymentFailure />} />
                <Route path="/amazon-search" element={<AmazonSearch />} />
                <Route path="/credit-payment-success" element={<CrPaymentSuccess />} />
                <Route path="/credit-payment-error" element={<CrPaymentFailure />} />
                <Route path="/autopay-success" element={<AutopaySuccess />} />
                <Route path="/autopay-error" element={<AutopayError />} />
                <Route path="/edf_job_manager/edf-analyzer" element={<ArtifactToggle />} />
                <Route path='/phq-master' element={<PhqManagement />}></Route>
                <Route path="*" element={<MasterRoute />} />
            </Routes>
        </div>
    );
};

export default OtherRoute;
