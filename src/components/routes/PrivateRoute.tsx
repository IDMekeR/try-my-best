import React, { useState, useEffect } from 'react';
import loadable from '@loadable/component';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import LayoutPage from 'components/layout/LayoutPage';
import UnAuthorized from 'components/shared/UnAuthorizedPage';
import { useSelector } from 'react-redux';
import OopsPage from 'components/shared/OopsPage';
import { ErrorBoundary } from 'react-error-boundary';
import LoadingIndicator from 'components/shared/LoadingIndicator';

const AdminDashboard = loadable(() => import('components/dashboard/AdminDashboard'), { fallback: <LoadingIndicator /> });
const OtherRoute = loadable(() => import('./OtherRoute'), { fallback: <LoadingIndicator /> })

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

const PrivateRoute: React.FC = () => {
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
            {location.pathname !== '/unauthorized' && (
                <ErrorBoundary FallbackComponent={OopsPage}>
                    <LayoutPage>
                        <Routes>
                            <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="*" element={<OtherRoute />} />
                        </Routes>
                    </LayoutPage>
                </ErrorBoundary>
            )}

            <Routes>
                <Route path="/unauthorized" element={<UnAuthorized />} />
            </Routes>
        </div>
    );
};

export default PrivateRoute;
