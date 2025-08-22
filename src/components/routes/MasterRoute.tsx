import React,{useEffect,useState} from 'react';
import loadable from '@loadable/component';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'components/shared/LoadingIndicator';
const Diagnosis = loadable(() => import('components/master-data/Diagnosis'),{fallback:<LoadingIndicator/>});
const Amplifier = loadable(() => import('components/master-data/Amplifier'),{fallback:<LoadingIndicator/>});
const Lifestyle = loadable(() => import('components/master-data/Lifestyle'),{fallback:<LoadingIndicator/>});
const MarkerManagement = loadable(() => import('components/master-data/MarkerManagement'),{fallback:<LoadingIndicator/>});
const RecommendedMedic = loadable(() => import('components/master-data/RecommendedMedic'),{fallback:<LoadingIndicator/>});
const Supplement = loadable(() => import('components/master-data/Supplement'),{fallback:<LoadingIndicator/>});
const Symptoms = loadable(() => import('components/master-data/Symptoms'),{fallback:<LoadingIndicator/>});
const RequestRoute = loadable(()=>import('components/routes/RequestRoute'),{fallback:<LoadingIndicator/>});

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

export default function MasterRoute(){
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
    return(
        <Routes>
        <Route path="/diagnosis" element={<Diagnosis />} />
        <Route path="/amplifier-master" element={<Amplifier />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/marker-management" element={<MarkerManagement />} />
        <Route path="/recommended-medication" element={<RecommendedMedic />} />
        <Route path="/supplement" element={<Supplement />} />
        <Route path="/symptoms" element={<Symptoms />} />
         <Route path="*" element={<RequestRoute/>} />
        </Routes>
    )
}