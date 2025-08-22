import React, { useEffect, useState, useRef } from 'react';
import { Form, Input, InputNumber, Select, DatePicker, Radio, Checkbox } from 'components/shared/FormComponent';
import { amplifierOptions, GenderIdtOptions, genderOptions, handOptions, myFunc, occupationOptions } from 'components/shared/DropdownOption';
import { Popconfirm, Upload, moment, message, Modal, Result, Progress, Spin } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'react-redux';
import { getDiagnosisList, getSymptomsList } from 'services/actions/master-data/diagnosisAction';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { getPhQuestionnaire } from 'services/actions/newRequestAction';
import { formatter, parser, validateAge, validatePhone } from 'components/shared/FormValidators';
import ExistingPntModal from './sub-screens/ExistingPntModal';
import PatientHealthMedication from './sub-screens/PatientHealthMedication';
import { accountSaveOrder, adminSaveOrder } from 'services/actions/orderManagementAction';
import { getRequestInfo } from 'services/actions/pipeline/pipelineAction';
import { getAccPntList } from 'services/actions/patientAction';
import { getState, getCountry } from 'services/actions/commonServiceAction';
import { documentDownload } from 'services/actions/pipeline/pipelineAction';
import { DownloadOutlined } from 'components/shared/AntIcons';
import { getAccReportItems } from 'services/actions/accountAction';
import { Button } from 'components/shared/ButtonComponent';
import { sendMail } from 'services/actions/orderManagementAction';
import { getAllAccount } from 'services/actions/commonServiceAction';
import { useNavigate, useLocation } from 'react-router-dom';
import dayjs from 'dayjs';
import FileSaver from 'file-saver';
import ReportRate from './ReportRate';
import { InfoCircleOutlined } from '@ant-design/icons';
import { upload } from '@testing-library/user-event/dist/upload';
import { getUserProfile } from 'services/actions/authAction';

const OrderManagement: React.FC = () => {
    const [form] = Form.useForm();
    const location = useLocation();
    const history = useNavigate();
    const { diagnosisInfo, loading, loading1, symptomsInfo } = useSelector((state: any) => state.diagnosis);
    const { requestInfo, loading5, downloadInfo } = useSelector((state: any) => state.pipeline);
    const { reportItemInfo } = useSelector((state: any) => state.account);
    const { adSaveOrder, addAccSaveOrder, success, error, loading: saveLoading, success2, error2, loading2: saveLoading1 } = useSelector((state: any) => state.order);
    const { userProfileInfo, loading6, error6 } = useSelector((state: any) => state.auth);
    const progress = useSelector((state: any) => state.upload.progress);
    const downloadProgress = useSelector((state: any) => state.download.docDownProgress);
    const { resultDocProgress } = useSelector((state: any) => state.upload);
    const { allAccountInfo, loading4, loading2, loading3, countryInfo } = useSelector((state: any) => state.commonData);
    const excelDownProgress = useSelector((state: any) => state.download.excelDownProgress);
    const [phqItems, setPhqItems]: any = useState([]);
    const [openModal, setOpenModal]: any = useState(false);
    const [openPntModal, setOpenPntModal] = useState(false);
    const options = myFunc();
    const userRole = sessionStorage.getItem('role');
    const dispatch = useDispatch();
    const [check1, setCheck1] = useState(false);
    const [check2, setCheck2] = useState(false);
    const [check3, setCheck3] = useState(false);
    const [check4, setCheck4] = useState(false);
    const [check5, setCheck5] = useState(false);
    const [check6, setCheck6] = useState(false);
    const [check7, setCheck7] = useState(false);
    const [selectedDiag, setSelectedDiag]: any = useState([]);
    const [selectedSymp, setSelectedSymp]: any = useState([]);
    const [errorMsg, setErrorMsg] = useState('');
    const [ampName, setAmpName] = useState('');
    const inputRef: any = useRef(null);
    const [updateAmplifier, setUpdateAmplifier] = useState(amplifierOptions.map((option) => option.value));
    const reqId = location?.state?.reqId || null;
    const isActive = location?.state?.active ? true : false;
    const [pntID, setPntID] = useState(0);
    const [ECfile, setECFile]: any = useState(null);
    const [EOfile, setEOFile]: any = useState(null);
    const [ECfile1, setECfile1] = useState(null);
    const [EOfile1, setEOfile1] = useState(null);
    const [questionID, setQuestionID] = useState(0);
    const [accountId, setAccountId] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorData, setErrorData]: any = useState(null);
    const [defaultValues, setDefaultValues]: any = useState(null);
    const isReqUpdate = location?.state?.isReqUpdate;
    const [accountDetail, setAccountDetail]: any = useState({});
    const [isBilling, setIsBilling] = useState(false);
    const [billingType, setBillingType]: any = useState('');
    const [selectedCountry, setSelectedCountry] = useState(0);
    const [isNFBChecked, setIsNFBChecked] = useState(false);
    const [isMedChecked, setIsMedChecked] = useState(false);
    const [isRushChecked, setIsRushChecked] = useState(false);
    const [fileName, setFileName] = useState('');
    const [visible, setVisible] = useState(false);
    const [availableCredit, setAvailableCredit] = useState(0);
    const [defaultCredit, setDefaultCredit] = useState(0);
    const [email, setEmail] = useState('');
    const [visibleUpload, setVisibleUpload] = useState(true);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success || success2 : null;
    const [showDrawer, setShowDrawer] = useState(false);
    const [totalCredit, setTotalCredit] = useState(0);
    const requestFrom = location.state?.requestFrom || null;
    const [approveRequest, setApproveRequest] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const customFormat = (percent) => `${percent}%`;
    const [isConsentCheck, setIsConsentCheck] = useState(false);
    const [uploadError, setUploadError] = useState(false)
    const updError = uploadError ? error || error2 : null;
    const accountID = Number(sessionStorage.getItem('accountid'));
    const [paymentStatus, setPaymentStatus] = useState(false);
    const [isBalanceUpd, setIsBalanceUpd] = useState(false);
    const [showsuccessmsg2, setShowsuccessmsg2] = useState(false);
    const successmsg2 = showsuccessmsg2 ? loading6 : null;
    const [showErrmsg2, setShowErrmsg2] = useState(false);
    const errmsg2 = showErrmsg2 ? error6 : null;

    const [medicRows, setMedicRows] = useState([
        { id: 1, field1: '', field2: '' },
        { id: 2, field1: '', field2: '' },
        { id: 3, field1: '', field2: '' },
        { id: 4, field1: '', field2: '' },
    ]);

    const getDefaultCredit = () => {
        dispatch(getAccReportItems(accountId) as any);
    };

    useEffect(() => {
        getUser()
        getDefaultCredit();
    }, [accountID]);

    const getStatusIndicator = () => {
        if (availableCredit < defaultCredit) {
            return (
                <span className=" text-white fw-bold ms-2 bg-danger p-2 ">
                    Insufficient credit. Available balance for {accountDetail?.label} is {availableCredit}. Charges will be applied upon submitting this request.
                </span>
            );
        } else if (availableCredit === defaultCredit) {
            return (
                <span className="text-warn fw-bold ms-2 bg-lightoranger p-2">
                    Warning: Available credit only covers the default report. Available balance for {accountDetail?.label} is {availableCredit}. Extra charges will be incurred for additional
                    reports.
                </span>
            );
        }
        return null;
    };

    const diagnosisOptions = loading
        ? []
        : diagnosisInfo?.data?.map((item: any) => {
            return {
                label: item.diagnosis_name,
                value: item.id?.toString(),
                key: item.id?.toString(),
            };
        });

    const symptomsOptions = loading1
        ? []
        : symptomsInfo?.data?.map((item: any) => {
            return {
                label: item.symptoms_name,
                value: item.id?.toString(),
                key: item.id,
            };
        });

    function getOrderDetails() {
        dispatch(getRequestInfo(location?.state?.reqId) as any);
    }

    useEffect(() => {
        const totalDefaultCreditValue = reportItemInfo?.data?.filter((item: any) => item?.is_associate || item?.is_default)?.reduce((acc, item) => acc + item?.credit_Value, 0);

        setDefaultCredit(totalDefaultCreditValue);
    }, [reportItemInfo]);

    useEffect(() => {
        if (accountDetail) {
            setAvailableCredit(accountDetail?.availableCredit);
        }
    }, [accountDetail]);

    useEffect(() => {
        if (userProfileInfo?.data) {
            setAvailableCredit(userProfileInfo?.data?.total_credit - userProfileInfo?.data?.usedcredits);
        }
    }, [userProfileInfo]);

    const showCreditModal = () => {
        const fullUrl = `${window.location.origin}/buy-credit`;
        localStorage.setItem('order', 'true');
        window.open(fullUrl, '_blank');

        setPaymentStatus(true);
    };

    function getUser() {
        const inputJson = {
            userid: Number(sessionStorage.getItem('userid')),
        };
        dispatch(getUserProfile(inputJson) as any);
        setShowsuccessmsg2(true);
        setShowErrmsg2(true);
    }

    useEffect(() => {
        if (successmsg2) {
            setShowsuccessmsg2(false);
            setIsBalanceUpd(false);
        } else if (errmsg2) {
            setShowErrmsg2(false);
            setIsBalanceUpd(false);
        }
    }, [successmsg2, errmsg2]);

    useEffect(() => {
        if (paymentStatus === true) {
            const intervalId = setInterval(() => {
                const status = localStorage.getItem('paymentStatus');
                if (status == 'failed') {
                    setPaymentStatus(false);
                    Modal.error({
                        title: 'Payment Failed',
                        content: 'Payment was unsuccessful. Please try again.',
                        onOk() {
                            setTimeout(() => {
                                getUser();
                                getDefaultCredit();
                            }, 2000);
                            setIsBalanceUpd(true);
                        },
                    });
                    localStorage.removeItem('paymentStatus');
                } else if (status == 'succeed') {
                    setPaymentStatus(false);

                    Modal.success({
                        title: 'Payment Successful',
                        content: 'Payment was completed successfully.',
                        onOk() {
                            setTimeout(() => {
                                getUser();
                                getDefaultCredit();
                            }, 2000);
                            setIsBalanceUpd(true);
                        },
                    });
                    localStorage.removeItem('paymentStatus');
                }
            }, 1000);
            return () => clearInterval(intervalId);
        }
        return () => { };
    }, [paymentStatus]);


    useEffect(() => {
        if (location?.state?.reqId) {
            setDefaultValues([]);
            getOrderDetails();
        } else {
            form.resetFields();
            setDefaultValues([]);
        }
    }, [dispatch]);

    useEffect(() => {
        if (requestInfo?.data && reqId) {
            setDefaultValues(requestInfo?.data?.reqinfo);
            setIsConsentCheck(requestInfo?.data?.reqinfo?.consent_mail);
            const doclist = requestInfo?.data?.doclist;
            if (requestInfo?.data?.doclist) {
                for (let i = 0; i < doclist.length; i++) {
                    if (doclist[i].doc_type == 'Eye Open') {
                        setEOFile(doclist[i]);
                    } else {
                        setECFile(doclist[i]);
                    }
                }
            } else {
                setECFile(null);
                setEOFile(null);
            }
        }
    }, [requestInfo?.data]);

    useEffect(() => {
        if (visibleUpload) {
            const timer = setTimeout(() => {
                if (progress === 100) {
                    setVisibleUpload(false);
                }
            }, 1500);

            return () => clearTimeout(timer);
        }

        return undefined;
    }, [progress, visibleUpload]);

    useEffect(() => {
        if (countryInfo?.data) {
            getStateDetails(231);
        }
    }, [countryInfo]);

    useEffect(() => {
        dispatch(getAllAccount() as any);
    }, [dispatch]);

    useEffect(() => {
        dispatch(getSymptomsList() as any);
    }, []);

    useEffect(() => {
        dispatch(getDiagnosisList() as any);
    }, []);

    useEffect(() => {
        if (userProfileInfo?.data) {
            setIsBilling(userProfileInfo?.data?.is_billing);
            setBillingType(userProfileInfo?.data?.account_type)
        }
    }, [userProfileInfo])

    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                if (excelDownProgress == 100) {
                    setVisible(false);
                }
            }, 1000);
            return () => clearTimeout(timer);
        }

        return undefined;
    }, [excelDownProgress]);

    useEffect(() => {
        if (downloadInfo) {
            downloadDocument();
        }
    }, [downloadInfo]);

    const submitEmail = () => {
        const inputJson = {
            email: email,
            servicerequestid: userRole === 'staff' ? addAccSaveOrder?.data?.servicerequestid : adSaveOrder?.data?.servicerequestid
        };
        dispatch(sendMail(inputJson) as any);
        setEmail('');
    };

    const drawerCallbackFunc = (item, item2, item3) => {
        setShowDrawer(item);
        setIsBilling(item2);
        setBillingType(item3);
    };

    const callbackReport = (item, item1) => {
        setShowResult(item);
        setTotalCredit(item1);
    };

    function downloadFile(id, name) {
        setFileName(name);
        const inputJson = {
            docid: id,
        };
        dispatch(documentDownload(inputJson) as any);
        setVisible(true);
    }

    function getStateDetails(id: any) {
        const inputJson = {
            countryid: id,
        };
        dispatch(getState(inputJson) as any);
    }

    function getCountryState(id) {
        const inputJson = {
            countryid: id || 0,
        };
        dispatch(getCountry(inputJson) as any);
    }

    useEffect(() => {
        getCountryState(selectedCountry);
    }, [dispatch]);

    function getPatientDetails(id) {
        dispatch(getAccPntList(id) as any);
    }

    const downloadDocument = () => {
        const fileExt = fileName?.split('.').pop();
        if (fileExt == 'edf') {
            const bytes = new Uint8Array(
                atob(downloadInfo?.data?.encodefiledata)
                    .split('')
                    .map((char) => char.charCodeAt(0)),
            );
            const blob = new Blob([bytes], { type: 'text/plain;charset=utf-8;base64' });
            FileSaver.saveAs(blob, `${fileName}.edf`);
        } else return;
    };

    const changeFileEC = (info) => {
        setECfile1(info?.fileList);
    };

    const changeFileEO = (info) => {
        setEOfile1(info?.fileList);
    };

    const normalizeName = (name: any) => {
        return name.trim().replace(/\s+/g, ' ');
    };

    const handleAccountChange = (e, value) => {
        setAccountDetail(value);
        getPatientDetails(e);
        setAccountId(e);
        setIsBilling(value?.isBilling);
        setBillingType(value?.billingType);
    };

    const changeCountry = (value) => {
        const id = value;
        form.setFieldsValue({
            country: value.toString(),
        });
        form.resetFields(['state']);
        setSelectedCountry(id);
        getStateDetails(id);
    };

    const addItem = (e: any) => {
        e.preventDefault();
        const normalizedAmpName = normalizeName(ampName);
        if (normalizedAmpName.length >= 3) {
            const lowercaseAmpName = normalizedAmpName.toLowerCase();
            if (!updateAmplifier.map((option) => option.toLowerCase()).includes(lowercaseAmpName)) {
                setUpdateAmplifier([...updateAmplifier, normalizedAmpName]);
                setAmpName('');
            } else {
                setErrorMsg('Amplifier name already exists.');
                setTimeout(() => {
                    setErrorMsg('');
                }, 3500);
            }
            setTimeout(() => {
                inputRef.current?.focus();
            }, 0);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, fieldName: string) => {
        const fieldOptions = fieldName === 'diagnosis' ? diagnosisOptions : symptomsOptions;
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default form submission
            const inputValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
            const existingOption = fieldOptions?.find((option: any) => option.label?.toLowerCase() === inputValue) || null;
            const val = form.getFieldValue(fieldName) || [];
            const filteredOptions = fieldOptions?.filter((option: any) => val.includes(option.label?.toLowerCase()) || option.label?.toLowerCase() === inputValue?.toLowerCase());
            const filteredValues = filteredOptions.map((option: any) => option.value);

            if (filteredOptions) {
                if (existingOption) {
                    const combinedValues = [
                        ...filteredValues,
                        ...val.filter((v: string) => {
                            return !filteredOptions.some((opt: any) => opt.label?.toLowerCase() === v?.toLowerCase());
                        }),
                    ];
                    const combinedValuesSet = new Set([...combinedValues]);
                    const filterVal = Array.from(combinedValuesSet);
                    form.setFieldValue(fieldName, filterVal);
                } else {
                    const filtValue = val.filter((item: any) => item === inputValue);
                    const defValue = fieldName === 'diagnosis' ? selectedDiag : selectedSymp;
                    const lowercaseValues = val.map((item) => item.toLowerCase());
                    const lowercaseDefValue = defValue.map((item) => item.toLowerCase());
                    const newValues =
                        filtValue.length > 0
                            ? [...lowercaseValues, inputValue.toLowerCase()].filter((item, index, self) => self.indexOf(item) === index && item !== '')
                            : [...lowercaseValues, ...lowercaseDefValue];
                    const combinedValuesSet1 = new Set(newValues);
                    const filterVal = Array.from(combinedValuesSet1);
                    form.setFieldValue(fieldName, filterVal);
                }
            }
            (event.target as HTMLInputElement).value = '';
        }
    };

    const onNameChange = (event: any) => {
        setAmpName(event.target.value);
    };

    const handleOk = () => {
        setIsModalOpen(false);
        setErrorData(null);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setPntID(0);
        setErrorData(true);
        form.setFieldsValue({ country: '231' });
        setECFile(null);
        setECfile1(null);
        setEOfile1(null);
        setEOFile(null);
        setCheck1(false);
        setCheck2(false);
        setCheck3(false);
        setCheck4(false);
        setCheck5(false);
        setCheck6(false);
        setCheck7(false);
    };

    const loadData = (defaultValues: any, id: any) => {
        form.setFieldsValue({
            firstName: defaultValues?.first_name || '',
            lastName: defaultValues?.last_name || '',
            gender: defaultValues?.gender || '',
            genderIdentity: defaultValues?.gender_identity || '',
            account: location?.state?.reqDetail?.accountid ? Number(location?.state?.reqDetail?.accountid) : Number(defaultValues?.accountid) || '',
            occupation: defaultValues?.occupation || '',
            contactPhone: defaultValues?.contact_number || '',
            handedness: defaultValues?.handedness || '',
            address: defaultValues?.address || '',
            city: defaultValues?.city || '',
            country: defaultValues && defaultValues !== null ? defaultValues?.country : '231',
            zip: defaultValues?.zip || '',
            state: defaultValues?.state || '',
            email: defaultValues?.pnt_contact_email || '',
            amplifierUsed: defaultValues?.amplifierUsed || '',
            clinician: defaultValues?.clinician_and_amplifier_used == 'N/A' ? '' : defaultValues?.clinician_and_amplifier_used || '',
            medicationResponse: defaultValues?.past_psychiatric_medication_response == 'N/A' ? '' : defaultValues?.past_psychiatric_medication_response || '',
            symptoms: defaultValues?.patient_symptomsconcerns == 'N/A' || defaultValues?.patient_symptomsconcerns == '' ? [] : defaultValues?.patient_symptomsconcerns?.split(',') || [],
            medications: defaultValues?.medications == 'N/A' ? '' : defaultValues?.medications || '',
            medsTaken:
                defaultValues?.were_meds_taken_within_48_hours_of_appointment === true
                    ? 'True'
                    : defaultValues?.were_meds_taken_within_48_hours_of_appointment === false
                        ? 'False'
                        : null,
            stimulants: defaultValues?.did_client_have_stimulants_day_of_scan === true ? 'True' : defaultValues?.did_client_have_stimulants_day_of_scan === false ? 'False' : null,
            diagnosis:
                defaultValues?.Past_Present_clinical_diagnosis == 'N/A' || defaultValues?.Past_Present_clinical_diagnosis == ''
                    ? []
                    : defaultValues?.Past_Present_clinical_diagnosis?.split(',') || [],
            previousReport: defaultValues?.previous_qeeg_report_pre_post_comaprison_request == 'N/A' ? '' : defaultValues?.previous_qeeg_report_pre_post_comaprison_request?.split(',') || '',
            patientRequire: defaultValues?.does_patient_require == 'N/A' ? '' : defaultValues?.does_patient_require?.split(',') || '',
            briefHistory: defaultValues?.brief_history == 'N/A' ? '' : defaultValues?.brief_history || '',
            dob: defaultValues ? moment(defaultValues?.dob) : null,
            eyeopen: null,
            eyeclosed: null,
        });

        if (defaultValues?.country) {
            getStateDetails(Number(defaultValues?.country || 231));
        }

        setEmail(defaultValues?.pnt_contact_email);
        if (reqId) {
            setPntID(defaultValues?.patientid);
        } else {
            setPntID(id);
        }

        if (defaultValues?.patient_symptomsconcerns == 'N/A') {
            setCheck2(true);
        } else {
            setCheck2(false);
        }
        if (defaultValues.Past_Present_clinical_diagnosis == 'N/A') {
            setCheck1(true);
        } else {
            setCheck1(false);
        }
        if (defaultValues?.does_patient_require === 'N/A') {
            setCheck6(true);
        } else {
            setCheck6(false);
        }
        if (defaultValues?.past_psychiatric_medication_response === 'N/A') {
            setCheck5(true);
        } else {
            setCheck5(false);
        }
        if (defaultValues?.brief_history === 'N/A') {
            setCheck7(true);
        } else {
            setCheck7(false);
        }
        if (location.state.reqId == 0) {
            setCheck3(false);
            setCheck4(false);
        }

        if (location?.state?.reqId) {
            if (location?.state?.error && defaultValues?.were_meds_taken_within_48_hours_of_appointment === null) {
                setCheck3(false);
            } else if (defaultValues?.were_meds_taken_within_48_hours_of_appointment === true || defaultValues?.were_meds_taken_within_48_hours_of_appointment === false) {
                setCheck3(false);
            }
            else {
                if (defaultValues?.clinician_and_amplifier_used && !defaultValues?.were_meds_taken_within_48_hours_of_appointment) {
                    setCheck3(true);
                } else {
                    setCheck3(false);
                }
            }
            if (location?.state?.error && defaultValues?.did_client_have_stimulants_day_of_scan === null) {
                setCheck4(false);
            } else if (defaultValues?.did_client_have_stimulants_day_of_scan === true || defaultValues?.did_client_have_stimulants_day_of_scan === false) {
                setCheck4(false);
            }
            else {
                if (defaultValues?.clinician_and_amplifier_used && !defaultValues?.did_client_have_stimulants_day_of_scan) {
                    setCheck4(true);
                } else {
                    setCheck4(false);
                }
            }
        } else {
            setCheck3(false);
            setCheck4(false);
            setECFile(null);
            setEOFile(null);
            setECfile1(null);
            setEOfile1(null);
        }
        setQuestionID(0);
        setAccountId(Number(location?.state?.reqDetail?.accountid ? location?.state?.reqDetail?.accountid?.toString() : defaultValues?.accountid?.toString()));
    };

    useEffect(() => {
        if (defaultValues && reqId) {
            loadData(defaultValues, 0);
        } else {
            form.resetFields();
            form.setFieldsValue({ country: '231' });
        }
    }, [defaultValues]);

    useEffect(() => {
        if (loading5) {
            form.resetFields();
            setCheck5(false);
            setCheck6(false);
            setECFile(null);
            setEOFile(null);
            setECfile1(null);
            setEOfile1(null);
        }
    }, [loading5]);

    const handleFailed = (error: any) => {
        if (error?.errorFields?.length > 0) {
            setErrorMsg('Mandatory Field(s) not filled');
        } else {
            setErrorMsg('');
        }
    };

    const submitRequest = (value: any) => {
        const formData = new FormData();
        const phq = {
            item1: phqItems[0]?.r1 === true ? 0 : phqItems[0]?.r2 === true ? 1 : phqItems[0]?.r3 === true ? 2 : 3,
            item2: phqItems[1]?.r1 ? 0 : phqItems[1]?.r2 ? 1 : phqItems[1]?.r3 ? 2 : 3,
            item3: phqItems[2]?.r1 ? 0 : phqItems[2]?.r2 ? 1 : phqItems[2]?.r3 ? 2 : 3,
            item4: phqItems[3]?.r1 ? 0 : phqItems[3]?.r2 ? 1 : phqItems[3]?.r3 ? 2 : 3,
            item5: phqItems[4]?.r1 ? 0 : phqItems[4]?.r2 ? 1 : phqItems[4]?.r3 ? 2 : 3,
            item6: phqItems[5]?.r1 ? 0 : phqItems[5]?.r2 ? 1 : phqItems[5]?.r3 ? 2 : 3,
            item7: phqItems[6]?.r1 ? 0 : phqItems[6]?.r2 ? 1 : phqItems[6]?.r3 ? 2 : 3,
            item8: phqItems[7]?.r1 ? 0 : phqItems[7]?.r2 ? 1 : phqItems[7]?.r3 ? 2 : 3,
        };
        const d: any = [];
        const medic = medicRows;
        for (let i = 0; i < medic.length; i++) {
            if (medic[i]?.field1 !== '') {
                d.push({
                    medicine_name: medic[i].field1,
                    dosage: medic[i].field2,
                    medication_started_on: '',
                    medication_ended_on: '',
                    status: 'Present',
                });
            }
        }
        setEmail(value.email);
        const unselectedRows = phqItems.filter((item: any) => !(item.r1 || item.r2 || item.r3 || item.r4));

        // Highlight unselected rows with red border
        const tableRows = document.querySelectorAll('.edf-step-header tbody tr');
        tableRows.forEach((row: any) => {
            const itemId = parseInt(row.getAttribute('data-item-id'), 10);
            if (unselectedRows.some((item: any) => item.id === itemId)) {
                row.classList.add('highlight-red-border');
            } else {
                row.classList.remove('highlight-red-border');
            }
        });
        const openfile = value?.eyeopen?.fileList[0]?.originFileObj?.name.split('.').pop();
        const eyeclose = value?.eyeclosed?.fileList[0]?.originFileObj?.name.split('.').pop();
        if (unselectedRows?.length === 0) {
            setErrorMsg('');
        } else {
            if (unselectedRows?.length > 0) {
                setErrorMsg('Patient Health Questionnaire is not filled');
            } else {
                setErrorMsg('');
            }
        }
        const inputJson = {
            reqid: location?.state?.reqId || 0,
            req_type: 'eeg data analysis',
            accountid: userRole === 'staff' ? sessionStorage.getItem('accountid') : Number(value?.account),
            first_name: value?.firstName,
            patientid: pntID || 0,
            last_name: value.lastName || '',
            gender: value.gender || '',
            dob: value['dob'].format('YYYY-MM-DD') || '',
            pnt_contact_email: value.email || '',
            occupation: value.occupation || '',
            gender_identity: value.genderIdentity,
            address: value.address || '',
            country: value.country || '',
            contact_number: value.contactPhone?.toString() || '',
            state: value.state || '',
            city: value.city || '',
            zip: value.zip || '',
            handedness: value.handedness || '',
            PntQuestionnaireid: isReqUpdate ? location?.state?.reqId : questionID || 0,
            amplifierUsed: value.amplifierUsed || '',
            clinician_and_amplifier_used: value.clinician || '',
            Past_Present_clinical_diagnosis: check1 ? 'N/A' : value.diagnosis?.toString() || '',
            patient_symptomsconcerns: check2 ? 'N/A' : value.symptoms?.toString() || '',
            medications: value.medications || '',
            were_meds_taken_within_48_hours_of_appointment: check3 ? null : value.medsTaken || '',
            did_client_have_stimulants_day_of_scan: check4 ? null : value.stimulants || '',
            past_psychiatric_medication_response: check5 ? 'N/A' : value?.medicationResponse || '',
            previous_qeeg_report_pre_post_comaprison_request: '',
            does_patient_require: check6 ? 'N/A' : value?.patientRequire?.toString() || '',
            brief_history: check7 ? 'N/A' : value?.briefHistory || '',
            EC_equipment_type: '',
            EO_equipment_type: '',
            diagnosis: check1 ? 'N/A' : value.diagnosis?.toString() || '',
            undiagnosis: '',
            symptoms: check2 ? 'N/A' : value.symptoms?.toString() || '',
            unsymptoms: '',
            phqid: isReqUpdate ? location?.state?.reqId : 0,
            'Little interest or pleasure in doing things': phq.item1,
            'Feeling down, depressed, or hopeless': phq.item2,
            'Trouble falling or staying asleep, or sleeping too much': phq.item3,
            'Feeling tired or having little energy': phq.item4,
            'Poor appetite or overeating': phq.item5,
            'Feeling bad about yourself or that you are a failure or have let yourself or your family down': phq.item6,
            'Trouble concentrating on things, such as reading the newspaper or watching television': phq.item7,
            'Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual.':
                phq.item8,
            medic: d,
            eeg_research: true,
            eeg_analyst: true,
            eeg_data_privacy: true,
            consent_mail: isConsentCheck
        };

        if (ECfile && EOfile && !location?.state?.error) {
            formData.append('EC_File', '');
            formData.append('EO_File', '');
            formData.append('InputJson', JSON.stringify(inputJson));
            setUploadError(true)
            if (userRole === 'staff') {
                if (unselectedRows.length === 0) {
                    dispatch(accountSaveOrder(formData) as any);
                }
            } else {
                if (unselectedRows.length === 0) {
                    dispatch(adminSaveOrder(formData) as any);
                }
            }
            setShowSuccessmsg(true);
        } else if (ECfile && EOfile && location?.state?.error) {
            if (value.eyeopen.file.size >= 52428800) {
                message.error('File size must be less than 50MB!');
            } else if (openfile?.toLowerCase() !== 'edf') {
                message.error('The Eyes opened file is not EDF format');
            } else if (value.eyeclosed.file.size >= 52428800) {
                message.error('File size must be less than 50MB!');
            } else if (eyeclose?.toLowerCase() !== 'edf') {
                message.error('The Eyes closed file is not EDF format');
            } else if (value.eyeopen.file.name == value.eyeclosed.file.name) {
                message.error('Same file for both types cannot be uploaded');
            } else {
                formData.append('EC_File', value.eyeclosed.fileList[0].originFileObj);
                formData.append('EO_File', value.eyeopen.fileList[0].originFileObj);
                formData.append('InputJson', JSON.stringify(inputJson));
                setUploadError(true)
                if (userRole === 'staff') {
                    if (unselectedRows.length === 0) {
                        dispatch(accountSaveOrder(formData) as any);
                    }
                } else {
                    if (unselectedRows.length === 0) {
                        dispatch(adminSaveOrder(formData) as any);
                    }
                }
                setShowSuccessmsg(true);
            }
        } else {
            if (value.eyeopen.file.size >= 52428800) {
                message.error('File size must be less than 50MB!');
            } else if (openfile?.toLowerCase() !== 'edf') {
                message.error('The Eyes opened file is not EDF format');
            } else if (value.eyeclosed.file.size >= 52428800) {
                message.error('Eyes Opened file size must be less than 50MB!');
            } else if (eyeclose?.toLowerCase() !== 'edf') {
                message.error('The Eyes closed file is not EDF format');
            } else if (value.eyeopen.file.name == value.eyeclosed.file.name) {
                message.error('Same file for both types cannot be uploaded');
            } else {
                formData.append('EC_File', value.eyeclosed ? value.eyeclosed.fileList[0].originFileObj : '');
                formData.append('EO_File', value.eyeopen ? value.eyeopen.fileList[0].originFileObj : '');
                formData.append('InputJson', JSON.stringify(inputJson));
                setUploadError(true)
                if (userRole === 'staff') {
                    if (unselectedRows.length === 0) {
                        dispatch(accountSaveOrder(formData) as any);
                    }
                } else {
                    if (unselectedRows.length === 0) {
                        dispatch(adminSaveOrder(formData) as any);
                    }
                }
                setShowSuccessmsg(true);
            }
            setVisible(true);
        }
    };

    useEffect(() => {
        if (updError) {
            const errorData = userRole === "staff" ? error2 : error
            if (errorData?.data) {
                if (errorData?.EO_edf?.edf_file && errorData?.EC_edf?.edf_file) {
                    message.error(`The Eyes Opened and Eyes Closed EDF files have ${errorData?.EO_edf?.edf_duration_eo} seconds and 
                        ${errorData?.EC_edf?.edf_duration_ec} seconds recorded duration respectively. They should be
                    minimum of 2 minutes duration each.`);
                } else if (errorData?.EO_edf?.edf_file) {
                    message.error(`The Eyes Opened EDF file has ${errorData?.EO_edf?.edf_duration_eo} seconds recorded duration. It should be
                   minimum of 2 minutes duration.`);
                } else if (errorData?.EC_edf?.edf_file) {
                    message.error(`The Eyes Closed EDF file has ${errorData?.EC_edf?.edf_duration_ec} seconds recorded duration. It should be
                    minimum of 2 minutes duration.`);
                } else {
                    message.error(errorData?.message);
                }
            } else {
                message.error('Request couldnt be created!');
            }
            setUploadError(false);
        }
    }, [updError]);

    const handleChangeDiagnosis = (e: any, val: string) => {
        if (e?.length > 0) {
            if (val === 'diagnosis') {
                setSelectedDiag(e);
            } else {
                setSelectedSymp(e);
            }
        } else {
            if (val === 'diagnosis') {
                setSelectedDiag([]);
            } else {
                setSelectedSymp([]);
            }
        }
    };

    function initializeDatepicker(_defaultDate: dayjs.Dayjs) { }
    const defaultDate = dayjs().subtract(3, 'year');
    // Call the function with the default date
    initializeDatepicker(defaultDate);

    const disableDate = (date: dayjs.Dayjs): boolean => {
        return date.isAfter(defaultDate, 'day');
    };

    const callbackFunc = (value: any, value1: any) => {
        setPhqItems(value);
        setMedicRows(value1);
    };


    useEffect(() => {
        if (successmsg && location.state.reqId == null && isConsentCheck) {
            submitEmail();
        }
    }, [successmsg]);

    const closePntModal = () => {
        setOpenPntModal(false);
    };

    useEffect(() => {
        if (location.state.id === 0) {
            form.resetFields();
            form.setFieldValue('country', '231');
            setPhqItems([]);
            setMedicRows([
                { id: 1, field1: '', field2: '' },
                { id: 2, field1: '', field2: '' },
                { id: 3, field1: '', field2: '' },
                { id: 4, field1: '', field2: '' },
            ]);
        }
    }, [location.state.id]);

    const onChangeCheckbox = (checkedValues) => {
        const isRushChecked = checkedValues.includes('RUSH');
        setIsRushChecked(isRushChecked);
    };

    const accOptions: any = allAccountInfo?.data.map((acc: any) => {
        return {
            label: acc?.acct_name,
            value: acc.id,
            key: acc.id,
            isBilling: acc.is_billing,
            billingType: acc?.bill_type,
            availableCredit: acc?.balance_credit,
        };
    });

    return (
        <div className="p-2">
            {successmsg ? (
                <div>
                    {!showResult && isBilling ? (
                        <div>
                            <ReportRate
                                data={{
                                    callbackReport: callbackReport,
                                    saveOrder: userRole === 'staff' ? addAccSaveOrder : adSaveOrder,
                                    accountId: accountId,
                                    isSuccess: successmsg,
                                    billingType: billingType,
                                    isMedChecked: isMedChecked,
                                    isNFBChecked: isNFBChecked,
                                    isRushChecked: isRushChecked,
                                    availableCredit: availableCredit,
                                    accountDetail: accountDetail,
                                }}
                            />
                        </div>
                    ) : (
                        <div className="p-5">
                            <Result
                                className="p-5"
                                status="success"
                                title={[
                                    <div key="resultinfo">
                                        {isReqUpdate ? <h4 className="fw-normal mb-3 text-dark"> Order Updated Successfully!</h4> : <h4 className="fw-normal mb-3 text-dark"> Order Submitted Successfully!</h4>}
                                        <div className="d-flex flex-row justify-content-center">
                                            <h4 className="fw-normal text-secondary fs-19">
                                                Your reference number is{' '}
                                                <span className="sub-title-req text-blue fs-20 fw-bold" >
                                                    {userRole === 'staff' ? addAccSaveOrder?.data?.request_number : adSaveOrder?.data?.request_number}
                                                </span>.
                                                <br />
                                                {location.state.reqId == null && isConsentCheck && 'Patient consent email has been sent'}
                                                {isBilling && (
                                                    <>
                                                        {' and a total of '}
                                                        <span className="sub-title-req text-blue fs-20 fw-bold">
                                                            {totalCredit}
                                                        </span>
                                                        {' credits were used for this request.'}
                                                    </>
                                                )}
                                            </h4>
                                        </div>
                                    </div>,
                                ]}
                                extra={[
                                    <React.Fragment key="content">
                                        <Button type="primary" className="mx-auto text-center" key="console" onClick={() => history(userRole === 'staff' ? '/view-request' : '/new-request')}>
                                            {userRole !== 'staff' ? 'Back to Request in Pipeline' : 'Back to Order Management'}
                                        </Button>
                                    </React.Fragment>
                                ]}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <Spin spinning={loading5}>
                        <div className="d-flex grid-title-card">
                            <h5 className="my-auto ">New Service Request</h5>
                            {isBilling && billingType === 'credit' && availableCredit <= defaultCredit && <div className="mx-auto mt-2">{getStatusIndicator()}</div>}
                            <div className="ms-auto d-flex">
                                {userRole === 'staff' && isBilling && billingType === 'credit' && availableCredit <= defaultCredit && (
                                    <Button className='me-2 yellow-btn text-white fw-bold' onClick={showCreditModal} type="default">
                                        Buy Plan
                                    </Button>
                                )}
                                <Button type="primary"
                                    onClick={() => {
                                        {
                                            userRole === 'staff' ?
                                                history('/view-request')
                                                :
                                                history(isReqUpdate ? '/view-request' : '/new-request')
                                        }
                                    }}
                                >Back</Button>
                            </div>
                        </div>
                        <div className="mt-2 bg-white p-3 order-sections">
                            <Form form={form} layout="vertical" onFinish={submitRequest} onFinishFailed={handleFailed}>
                                <div className="section-title d-flex">
                                    <h6 className="mb-1 p-2 fs-16 col text-primary">Patient Demography</h6>
                                    <h6 className="col mb-1 p-2 fs-17 text-end ">
                                        {reqId == null ? <a className="text-blue text-decoration-underline fs-15" onClick={() => setOpenPntModal(true)}>
                                            Click here for existing patient
                                        </a> : ""}
                                    </h6>
                                </div>
                                <div className="row m-0 pt-3 pnt-demo">
                                    <Form.Item name="firstName" label="First name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item>
                                    <Form.Item name="lastName" label="Last name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item>
                                    <Form.Item name="gender" label="Sex at birth" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Select disabled={userRole === 'staff' && (reqId || pntID !== 0)} options={genderOptions} />
                                    </Form.Item>
                                    <Form.Item name="genderIdentity" label="Gender identity" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Select disabled={userRole === 'staff' && (reqId || pntID !== 0)} options={GenderIdtOptions} />
                                    </Form.Item>
                                    <Form.Item
                                        name="dob"
                                        label="DOB"
                                        className="col"
                                        rules={[
                                            { required: true, message: 'This field is required!' },
                                            {
                                                validator: validateAge,
                                            },
                                        ]}
                                    >
                                        <DatePicker className="w-100" disabled={userRole === 'staff' && (reqId || pntID !== 0)} defaultPickerValue={defaultDate} disabledDate={disableDate} format="DD-MM-YYYY" />
                                    </Form.Item>
                                </div>
                                <div className="row m-0 pt-0 pnt-demo">
                                    <Form.Item
                                        name="contactPhone"
                                        label="Contact Phone"
                                        className="col"
                                        rules={[
                                            { required: true, message: 'This field is required!' },
                                            {
                                                validator: validatePhone,
                                            },
                                        ]}
                                    >
                                        <InputNumber className="w-100" disabled={userRole === 'staff' && (reqId || pntID !== 0)} maxLength={14} formatter={formatter} parser={parser} />
                                    </Form.Item>
                                    <Form.Item
                                        name="email"
                                        label="Email"
                                        className="col"
                                        rules={[
                                            { required: isConsentCheck ? true : false, message: 'This field is required!' },
                                            { type: 'email', message: 'Enter valid mail address!' },
                                        ]}
                                    >
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item>
                                    <Form.Item name="handedness" label="Handedness" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Select disabled={userRole === 'staff' && (reqId || pntID !== 0)} options={handOptions} />
                                    </Form.Item>

                                    <Form.Item name="occupation" label="Occupation" className="col">
                                        <Select disabled={userRole === 'staff' && (reqId || pntID !== 0)} options={occupationOptions} />
                                    </Form.Item>
                                    {userRole === 'staff' ? <Form.Item name="address" label="Address" className="col">
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item> :
                                        <Form.Item name="account" label="Account" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                            <Select
                                                showSearch
                                                options={accOptions}
                                                getPopupContainer={(trigger) => trigger.parentNode}
                                                optionFilterProp="children"
                                                filterOption={(input: any, option: any) => {
                                                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                }}
                                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                                onChange={handleAccountChange}
                                                notFoundContent={
                                                    <div className="text-center p-4">
                                                        {loading4 ? (
                                                            <span>
                                                                <LoadingOutlined />
                                                                Loading...
                                                            </span>
                                                        ) : (
                                                            <span>No account found</span>
                                                        )}
                                                    </div>
                                                }
                                            />
                                        </Form.Item>
                                    }
                                </div>
                                <div className="row m-0 pnt-demo">
                                    {userRole === 'staff' ? "" :
                                        <Form.Item name="address" label="Address" className="col">
                                            <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                        </Form.Item>
                                    }
                                    <Form.Item name="country" label="Country" className="col">
                                        <Select
                                            showSearch
                                            disabled={userRole === 'staff' && (reqId || pntID !== 0)}
                                            options={options?.countryOptions}
                                            optionFilterProp="children"
                                            filterOption={(input: any, option: any) => {
                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}
                                            onChange={changeCountry}
                                            notFoundContent={
                                                <div className="text-center p-4">
                                                    {loading2 ? (
                                                        <span>
                                                            <LoadingOutlined />
                                                            Loading...
                                                        </span>
                                                    ) : (
                                                        <span>No country available</span>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item name="state" label="State" className="col">
                                        <Select
                                            showSearch
                                            disabled={userRole === 'staff' && (reqId || pntID !== 0)}
                                            options={options?.stateOptions}
                                            optionFilterProp="children"
                                            filterOption={(input: any, option: any) => {
                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}
                                            notFoundContent={
                                                <div className="text-center p-4">
                                                    {loading3 ? (
                                                        <span>
                                                            <LoadingOutlined />
                                                            Loading...
                                                        </span>
                                                    ) : (
                                                        <span>No state available</span>
                                                    )}
                                                </div>
                                            }
                                        />
                                    </Form.Item>
                                    <Form.Item name="city" label="City" className="col">
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item>
                                    <Form.Item name="zip" label="Zip" className="col">
                                        <Input disabled={userRole === 'staff' && (reqId || pntID !== 0)} />
                                    </Form.Item>
                                    {userRole === 'staff' ?
                                        <Form.Item className='col'></Form.Item> : ""}
                                </div>
                                <div className="section-title">
                                    <h6 className="mb-1 p-2 fs-16 text-primary">Session Questionnaire</h6>
                                </div>
                                <div className="session-ques-cont row m-0 pt-3">
                                    <Form.Item name="clinician" label="Clinician" className="col sess-ck-t" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Input />
                                    </Form.Item>

                                    <Form.Item name="amplifierUsed" label="AmplifierUsed" className="col sess-ck-t" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Select
                                            showSearch
                                            dropdownRender={(menu) => (
                                                <>
                                                    {menu}
                                                    <hr className="my-2" />
                                                    <div className="px-2">
                                                        <span className="fw-bold">Other</span>
                                                    </div>
                                                    <div className="d-flex align-items-end  w-75  p-2">
                                                        <Input
                                                            className="h-100 p-1"
                                                            placeholder="Enter the Amplifier Name"
                                                            ref={inputRef}
                                                            value={ampName}
                                                            onChange={onNameChange}
                                                            onPressEnter={addItem}
                                                            onKeyDown={(e) => e.stopPropagation()}
                                                        />
                                                        <Button className="mx-2 h-100 " type="primary" onClick={addItem} disabled={ampName.length < 3}>
                                                            Add
                                                        </Button>
                                                    </div>
                                                    {errorMsg === 'Amplifier name already exists.' ? <div className="text-danger fw-bold fs-15 ps-2">{errorMsg}</div> : ''}
                                                </>
                                            )}
                                        >
                                            {updateAmplifier.map((item) => (
                                                <Select.Option key={item} value={item}>
                                                    {item}
                                                </Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <div className="col">
                                        <Form.Item
                                            name="diagnosis"
                                            className="mb-1 sess-ck"
                                            label="Past/Present Clinical Diagnosis (if applicable)"
                                            rules={[{ required: !check1, message: 'This field is required!' }]}
                                        >
                                            <Select
                                                options={diagnosisOptions}
                                                mode="tags"
                                                disabled={check1}
                                                filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                                notFoundContent={
                                                    <div className="text-center p-4">
                                                        {loading ? (
                                                            <span>
                                                                <LoadingOutlined />
                                                                Loading...
                                                            </span>
                                                        ) : (
                                                            <span>No diagnosis available</span>
                                                        )}
                                                    </div>
                                                }
                                                onChange={(e: any) => handleChangeDiagnosis(e, 'diagnosis')}
                                                onKeyDown={(e: any) => handleKeyDown(e, 'diagnosis')}
                                            />
                                        </Form.Item>
                                        <div className="session-checkbox">
                                            {!check1 ? (
                                                <Popconfirm
                                                    placement="topLeft"
                                                    title=""
                                                    description="Are you sure that you want to ignore diagnosis?"
                                                    onConfirm={() => {
                                                        setCheck1(true);
                                                        form.setFieldsValue({ diagnosis: [] });
                                                    }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <div>
                                                        <Checkbox disabled>
                                                            <span className="text-black"> If not applicable, N/A</span>
                                                        </Checkbox>
                                                    </div>
                                                </Popconfirm>
                                            ) : (
                                                <Checkbox checked={check1} onChange={() => setCheck1(!check1)}>
                                                    If not applicable, N/A
                                                </Checkbox>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col mb-0">
                                        <Form.Item name="symptoms" label="Patient Symptoms/Concerns" className="mb-1 sess-ck" rules={[{ required: !check2, message: 'This field is required!' }]}>
                                            <Select
                                                options={symptomsOptions}
                                                mode="tags"
                                                disabled={check2}
                                                filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                                notFoundContent={
                                                    <div className="text-center p-4">
                                                        {loading1 ? (
                                                            <span>
                                                                <LoadingOutlined />
                                                                Loading...
                                                            </span>
                                                        ) : (
                                                            <span>No symptoms available</span>
                                                        )}
                                                    </div>
                                                }
                                                onChange={(e: any) => handleChangeDiagnosis(e, 'symptoms')}
                                                onKeyDown={(e: any) => handleKeyDown(e, 'symptoms')}
                                            />
                                        </Form.Item>
                                        <div className="session-checkbox">
                                            {!check2 ? (
                                                <Popconfirm
                                                    placement="topLeft"
                                                    title=""
                                                    description="Are you sure that you want to ignore symptoms?"
                                                    onConfirm={() => {
                                                        setCheck2(true);
                                                        form.setFieldsValue({ symptoms: [] });
                                                    }}
                                                    okText="Yes"
                                                    cancelText="No"
                                                >
                                                    <div>
                                                        <Checkbox disabled>
                                                            <span className="text-black">If not applicable, N/A</span>
                                                        </Checkbox>
                                                    </div>
                                                </Popconfirm>
                                            ) : (
                                                <Checkbox checked={check2} onChange={() => setCheck2(!check2)}>
                                                    If not applicable, N/A
                                                </Checkbox>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="row mx-0 pt-3 session-ques-cont">
                                    <div className="col">
                                        <Form.Item
                                            name="medicationResponse"
                                            label="Past Psychiatric Medication Response (If known)"
                                            className="col mb-1 sess-ck"
                                            rules={[{ required: !check5, message: 'This field is required!' }]}
                                        >
                                            <Input disabled={check5} />
                                        </Form.Item>
                                        <div className="session-checkbox">
                                            <Checkbox
                                                checked={check5}
                                                onChange={() => {
                                                    setCheck5(!check5);
                                                    form.resetFields(['medicationResponse']);
                                                }}
                                            >
                                                If not applicable, N/A
                                            </Checkbox>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <Form.Item
                                            name="medsTaken"
                                            label="Were meds taken within 48 hours of appointment?"
                                            className="col mb-1 sess-ck"
                                            rules={[{ required: !check3, message: 'This field is required!' }]}
                                        >
                                            <Radio.Group className="fs-16" disabled={check3}>
                                                <Radio value="True">Yes</Radio>
                                                <Radio value="False">No</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="session-checkbox">
                                            <Checkbox
                                                checked={check3}
                                                onChange={() => {
                                                    setCheck3(!check3);
                                                    form.resetFields(['medsTaken']);
                                                }}
                                            >
                                                If not applicable, N/A
                                            </Checkbox>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <Form.Item
                                            name="stimulants"
                                            label="Did client have stimulants day of scan? (caffeine, soda, cannabis, etc.)"
                                            className="col mb-1 sess-ck"
                                            rules={[{ required: !check4, message: 'This field is required!' }]}
                                        >
                                            <Radio.Group disabled={check4}>
                                                <Radio value="True">Yes</Radio>
                                                <Radio value="False">No</Radio>
                                            </Radio.Group>
                                        </Form.Item>
                                        <div className="session-checkbox">
                                            <Checkbox
                                                checked={check4}
                                                onChange={() => {
                                                    setCheck4(!check4);
                                                    form.resetFields(['stimulants']);
                                                }}
                                            >
                                                If not applicable, N/A
                                            </Checkbox>
                                        </div>
                                    </div>

                                    {!allAccountInfo?.is_billing ? (
                                        <div className="pnt-require col">
                                            <Form.Item name="patientRequire" label="Does patient require" className="mb-0 sess-ck" >
                                                <Checkbox.Group disabled={check6} onChange={onChangeCheckbox} >
                                                    <Checkbox value="RUSH">RUSH</Checkbox>
                                                </Checkbox.Group>
                                            </Form.Item>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className="col mb-1 session-ques-cont">
                                    <Form.Item name="briefHistory" label="Brief History" className="p-2 mb-1 sess-ck col" rules={[{ required: !check7, message: 'This field is required!' }]}>
                                        <Input.TextArea className='pt-2' rows={4} disabled={check7} />
                                    </Form.Item>
                                    <div className="session-checkbox ps-2">
                                        <Checkbox
                                            checked={check7}
                                            onChange={() => {
                                                setCheck7(!check7);
                                                form.resetFields(['briefHistory']);
                                            }}
                                        >
                                            If not applicable, N/A
                                        </Checkbox>
                                    </div>
                                </div>
                                <PatientHealthMedication callbackFunc={callbackFunc} reqId={location?.state?.reqId} isError={location?.state?.error} isUae={selectedCountry} />
                                <div className="section-title d-flex my-3">
                                    <h6 className="mb-1 p-2 fs-16 col text-primary">EDF file upload</h6>
                                </div>
                                <div className="row  d-flex m-0 req-file-upload">
                                    {ECfile && !location?.state?.error ? (
                                        <div className="col">
                                            <label className="mb-2">Eyes Closed</label>
                                            <div className="d-flex border p-3 rounded">
                                                <div className="col text-break">{ECfile?.orginal_name}</div>
                                                <div className="ms-auto">
                                                    <DownloadOutlined onClick={() => downloadFile(ECfile?.id, ECfile?.orginal_name)} />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <Form.Item
                                            name="eyeclosed"
                                            label="Eyes Closed"
                                            className="col ps-2 mb-0"
                                            valuePropName="eyeclosed"
                                            rules={[{ required: true, message: 'This field is required!' }]}
                                        >
                                            <Upload.Dragger
                                                name="file"
                                                multiple={false}
                                                maxCount={1}
                                                beforeUpload={() => false}
                                                fileList={ECfile1 || []}
                                                listType="picture-card"
                                                accept=".edf,.EDF"
                                                onChange={changeFileEC}
                                            >
                                                <p className="ant-upload-drag-icon"></p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                <p className="ant-upload-hint">Upload EDF file here</p>
                                            </Upload.Dragger>
                                        </Form.Item>
                                    )}
                                    {EOfile && !location?.state?.error ? (
                                        <div className="col ">
                                            <label className="mb-2">Eyes Opened</label>
                                            <div className="d-flex border p-3 rounded">
                                                <div className="col text-break">{EOfile?.orginal_name}</div>
                                                <div className="ms-auto">
                                                    <DownloadOutlined onClick={() => downloadFile(EOfile?.id, EOfile?.filename)} />
                                                </div>
                                            </div>{' '}
                                        </div>
                                    ) : (
                                        <Form.Item name="eyeopen" label="Eyes Opened" className="col pe-2 mb-0" valuePropName="eyeopen" rules={[{ required: true, message: 'This field is required!' }]}>
                                            <Upload.Dragger
                                                name="file"
                                                multiple={false}
                                                maxCount={1}
                                                beforeUpload={() => false}
                                                fileList={EOfile1 || []}
                                                listType="picture-card"
                                                accept=".edf,.EDF"
                                                onChange={changeFileEO}
                                            >
                                                <p className="ant-upload-drag-icon"></p>
                                                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                <p className="ant-upload-hint">Upload EDF file here</p>
                                            </Upload.Dragger>
                                        </Form.Item>
                                    )}
                                </div>
                                <div className="text-center info-edf d-flex">
                                    <span></span>
                                    <InfoCircleOutlined className="my-auto text-warning" />{' '}
                                    <div className="p-1">
                                        <span className="text-warning">Each EDF file should be minimum of 2 minutes recorded duration to get better result.</span>
                                    </div>
                                </div>

                                {excelDownProgress && visible ? (
                                    <Progress
                                        percent={excelDownProgress}
                                        strokeColor={{
                                            '0%': '#1F98DF',
                                            '100%': '#87d068',
                                        }}
                                        format={customFormat}
                                    />
                                ) : (
                                    ''
                                )}

                                {(location?.state?.error || location.state.requestFrom == 3) && location.state?.reqId !== null ? "" : <div className='mt-3'>
                                    <Checkbox checked={isConsentCheck} onChange={(e) => setIsConsentCheck(e.target.checked)} disabled={location?.state?.error}>Send Patient Consent Email</Checkbox>
                                </div>}
                                {/* {location.state.requestFrom == 3 ? "" : <div className='mt-3'>
                                    <Checkbox checked={isConsentCheck} onChange={(e) => setIsConsentCheck(e.target.checked)} disabled={location?.state?.error || (requestInfo?.data?.reqinfo?.consent_mail && location.state.reqId !== null)}>Send Patient Consent Email</Checkbox>
                                </div>} */}
                                {saveLoading || saveLoading1 ? (
                                    <div className=" mt-2">
                                        <Progress size={[485, 20]} percent={resultDocProgress} percentPosition={{ align: 'center', type: 'inner' }} strokeColor={{ from: '#108ee9', to: '#87d068' }} />
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className="my-3  text-end row mx-0 justify-content-end pe-0">
                                    <div className="text-danger me-3 my-auto fw-bold fs-14">{errorMsg ? errorMsg : ''}</div>
                                    {defaultValues?.session_is_draft || (!isActive && reqId !== null && requestFrom === 3) ? (
                                        <>
                                            <Button
                                                type="primary"
                                                loading={saveLoading || saveLoading1}
                                                htmlType="submit"
                                                className="col-auto me-2 text-end"
                                                onClick={() => {
                                                    setApproveRequest(true);
                                                    setVisibleUpload(true);
                                                }}
                                            >
                                                Save
                                            </Button>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                    {location?.state?.error ? (
                                        <Button
                                            type="primary"
                                            loading={saveLoading || saveLoading1}
                                            htmlType="submit"
                                            className="col-auto me-0 text-end"
                                            disabled={userRole === 'staff' && isBilling && billingType === 'credit' && availableCredit < defaultCredit ? true : false}
                                            onClick={() => {
                                                setApproveRequest(false);
                                                setVisibleUpload(true);
                                            }}

                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                    {reqId == null && !isActive ? (
                                        <Button
                                            type="primary"
                                            loading={saveLoading || saveLoading1}
                                            htmlType="submit"
                                            className="col-auto"
                                            disabled={userRole === 'staff' && isBilling && billingType === 'credit' && availableCredit < defaultCredit ? true : false}
                                            onClick={() => {
                                                setApproveRequest(false);
                                                setVisibleUpload(true);
                                            }}
                                        >
                                            Save
                                        </Button>
                                    ) : (
                                        ''
                                    )}
                                    {
                                        userRole !== 'staff' &&
                                        (reqId != null ? (
                                            <Button
                                                type="primary"
                                                loading={saveLoading || saveLoading1}
                                                htmlType="submit"
                                                className="col-auto"
                                                onClick={() => {
                                                    setApproveRequest(false);
                                                    setVisibleUpload(true);
                                                }}
                                            >
                                                Save
                                            </Button>
                                        ) : (
                                            ''
                                        ))
                                    }
                                </div>
                            </Form>
                        </div>
                    </Spin>
                </div>
            )}

            <ExistingPntModal
                openModal={openPntModal}
                closeModal={closePntModal}
                isAdmin={userRole === 'staff' ? false : true}
                loadData={loadData}
                drawerCallbackFunc={drawerCallbackFunc}
                accountId={accountId}
                isOpen={showDrawer}
            />

            <Modal
                title="Confirm"
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        No
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleOk}>
                        Yes
                    </Button>,
                ]}
            >
                This patient is already exist. Would you like to continue?
            </Modal>
        </div>
    );
};

export default OrderManagement;
