import API_URL from 'config.js';
import axios, { AxiosInstance } from 'axios';
const base64 = require('base-64');
const utf8 = require('utf8');

const ax: AxiosInstance = axios.create({
    baseURL: API_URL, // Replace with your API base URL
    // timeout: 1000000, // Timeout of 10 seconds
});

const axs: AxiosInstance = axios.create({
    baseURL: 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms',
});

// Add a request interceptor
ax.interceptors.request.use(
    (config: any) => {
        const user = sessionStorage.getItem('username');
        const pass = sessionStorage.getItem('password');
        const text = user + ':' + pass;
        const bytes = utf8.encode(text);
        const token = base64.encode(bytes);
        const formDataEndpoints = [
            'md_management/add_templatemedication',
            'account/saveAccount',
            'patient/requestmedication',
            'docrepo/consentdocupload',
            'docrepo/resultupload',
            'docrepo/docupload',
            'service_request/accountsaveServicerequest',
            'service_request/adminsaveServicerequest',
            'account/saveAccount_public',
            'account/saveAccount_agreement'
        ];
        if (!formDataEndpoints.some((endpoint: any) => config.url.includes(endpoint))) {
            if (
                !config.url.includes('auth/login') &&
                !config.url.includes('auth/password_reset') &&
                !config.url.includes('auth/reset-password/verify-token') &&
                !config.url.includes('auth/password_reset/confirm/') &&
                !config.url.includes('account/getpublicaccount') &&
                !config.url.includes('patient/addpublicpatient') &&
                !config.url.includes('patient/publicrequest_intakeform') &&
                !config.url.includes('md_management/publicphq_mdata') &&
                !config.url.includes('account/getcountrystates') &&
                !config.url.includes('account/saveAccount_public')
            ) {
                if (token) {
                    config.headers['Authorization'] = 'Basic ' + token;
                    config.headers['Content-Type'] = 'application/json';
                    config.headers['Accept'] = 'application/json';
                }
            } else {
                if (config.url.includes('patient/publicrequest_intakeform') || config.url.includes('account/saveAccount_public')){
                    config.headers['Content-Type'] = 'multipart/form-data';
                } else {
                    config.headers['Content-Type'] = 'application/json';
                }
                config.headers['Accept'] = 'application/json';
            }
        } else {
            if (token && !config.url.includes('account/saveAccount_public')) {
                config.headers['Authorization'] = 'Basic ' + token;
            }
            // Only set Content-Type to multipart/form-data if the request data is FormData
            if (config.data instanceof FormData) {
                config.headers['Content-Type'] = 'multipart/form-data';
            } else {
                config.headers['Content-Type'] = 'application/json';
            }
            config.headers['Accept'] = 'application/json';
        }
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    },
);

axs.interceptors.request.use(
    (config: any) => {
        config.headers['Content-Type'] = 'application/json';
        config.headers['Accept'] = 'application/json';
        return config;
    },
    (error: any) => {
        Promise.reject(error);
    },
);
export { axs, ax };
