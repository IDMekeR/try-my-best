import { configureStore } from '@reduxjs/toolkit';
import downloadIndicator from 'services/downloadIndicator';
import accountReducer from 'services/slices/accountSlice';
import authReducer from 'services/slices/authSlice';
import billingReducer from 'services/slices/billingSlice';
import commonServiceReducer from 'services/slices/commonServiceSlice';
import dashboardReducer from 'services/slices/dashboardSlice';
import invoiceReducer from 'services/slices/invoiceSlice';
import jobManagerReducer from 'services/slices/jobManagerSlice';
import diagnosisReducer from 'services/slices/master-data/diagnosisSlice';
import amplifierReducer from 'services/slices/master-data/amplifierSlice';
import lifestyleReducer from 'services/slices/master-data/lifestyleSlice';
import newRequestReducer from 'services/slices/newRequestSlice';
import patientReducer from 'services/slices/patientSlice';
import pipelineReducer from 'services/slices/pipeline/pipelineSlice';
import recordingAnalysisSlice from 'services/slices/pipeline/recordingAnalysisSlice';
import stepwizardReducer from 'services/slices/pipeline/stepwizardSlice';
import releasedReducer from 'services/slices/releasedSlice';
import reportComparisonSlice from 'services/slices/reportComparisonSlice';
import searchReducer from 'services/slices/searchSlice';
import securityReducer from 'services/slices/securitySlice';
import uploadIndicator from 'services/uploadIndicator';
import interpretationReducer from 'services/slices/master-data/interpretationSlice';
import medicationReducer from 'services/slices/master-data/medicationSlice';
import symptomsReducer from 'services/slices/master-data/symptomsSlice';
import orderReducer from 'services/slices/orderManagementSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        newreq: newRequestReducer,
        commonData: commonServiceReducer,
        searchData: searchReducer,
        pipeline: pipelineReducer,
        released: releasedReducer,
        report: reportComparisonSlice,
        patient: patientReducer,
        account: accountReducer,
        diagnosis: diagnosisReducer,
        amplifier:amplifierReducer,
        lifestyle: lifestyleReducer,
        security: securityReducer,
        billing: billingReducer,
        jobManager: jobManagerReducer,
        invoice: invoiceReducer,
        download: downloadIndicator,
        upload: uploadIndicator,
        wizard: stepwizardReducer,
        recAnalysis: recordingAnalysisSlice,
        interpretation: interpretationReducer,
        medication: medicationReducer,
        symptoms: symptomsReducer,
        order: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
