import React,{useEffect,useState} from 'react';
import loadable from '@loadable/component';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'components/shared/LoadingIndicator';
const CreditManager = loadable(() => import('components/billing-and-invoice/CreditManager'),{fallback:<LoadingIndicator/>});
const InvoiceManager = loadable(() => import('components/billing-and-invoice/InvoiceManager'),{fallback:<LoadingIndicator/>});
const GenerateInvoice = loadable(() => import('components/billing-and-invoice/sub-screens/additional-screen/GenerateInvoice'),{fallback:<LoadingIndicator/>});
const MyCredit = loadable(() => import('components/billing-and-invoice/account/MyCredit'),{fallback:<LoadingIndicator/>});
const BuyCredit = loadable(() => import('components/billing-and-invoice/account/BuyCredit'),{fallback:<LoadingIndicator/>});
const ReportRate = loadable(()=>import('components/request/modal/ReportRate'),{fallback:<LoadingIndicator/>});
const InvoiceTemplate =loadable(()=>import('components/billing-and-invoice/sub-screens/additional-screen/InvoiceTemplate'),{fallback:<LoadingIndicator/>});

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
        'credit-payment-error'
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

export default function BillingRoute(){
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
       <Route path="/my-credit" element={<MyCredit />} />
                                       <Route path="/buy-credit" element={<BuyCredit edit={false} closeModal={() => { }} />} />
                                        <Route path="/credit-manager" element={<CreditManager />} />
                                                                        <Route path="*" element={<InvoiceManager />} />
                                                                        <Route path="/invoice-manager/generate-invoice" element={<GenerateInvoice />} />
                                                                        <Route path="/invoice-manager/invoice" element={<InvoiceTemplate />} />
                                                                        <Route path="/report-rate" element={<ReportRate />} />
        </Routes>
    )
}