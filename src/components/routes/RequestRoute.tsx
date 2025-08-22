import {useEffect,useState} from 'react';
import loadable from '@loadable/component';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import {useSelector} from 'react-redux';
import LoadingIndicator from 'components/shared/LoadingIndicator';
const ArchivedRequest = loadable(() => import('components/request/ArchivedRequest'),{fallback:<LoadingIndicator/>});
const OrderManagement = loadable(() => import('components/request/modal/OrderManagement'),{fallback:<LoadingIndicator/>});
const NewRequest = loadable(() => import('components/request/new-request/NewRequest'),{fallback:<LoadingIndicator/>});
const PipelineRequest = loadable(() => import('components/request/pipeline-request/PipelineRequest'),{fallback:<LoadingIndicator/>});
const ReleasedRequest = loadable(() => import('components/request/released-request/ReleasedRequest'),{fallback:<LoadingIndicator/>});
const DatasetInformation = loadable(() => import('components/request/released-request/sub-screens/DatasetInformation'),{fallback:<LoadingIndicator/>});
const PipelineWizard = loadable(()=>import('components/request/pipeline-request/sub-screens/PipelineWizard'),{fallback:<LoadingIndicator/>})
const BillingRoute = loadable(()=>import('components/routes/BillingRoute'),{fallback:<LoadingIndicator/>});

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

export default function RequestRoute(){
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
        <Route path="/view-request" element={<PipelineRequest />} />
                                       <Route path="/released-request" element={<ReleasedRequest />} />
                                       <Route path="/archive-list" element={<ArchivedRequest />} />
                                       <Route path="/new-request" element={<NewRequest />} />
                                        <Route path="/new-request/order-management" element={<OrderManagement />} />
                                                                       <Route path="/view-request/order-management" element={<OrderManagement />} />
                                                                       <Route path="/view-request/pipeline-request" element={<PipelineWizard />} />
                                                                       <Route path="/released-request/dataset-information" element={<DatasetInformation />} />
                                                                       <Route path="*" element={<BillingRoute />} />
        </Routes>
    )
}