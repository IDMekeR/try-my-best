import React, { useState, useEffect, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Modal, Row, Col,Popconfirm,message, Tooltip, useDispatch, useSelector, Result } from 'components/shared/AntComponent';
import {  PlusSquareOutlined, LoadingOutlined, SearchOutlined } from 'components/shared/AntIcons';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { DatePicker, Select, InputNumber, Form, Input, Checkbox } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import EEGImage from 'assets/img/brandname.png';
import { addPntForm, verifyPntForm, getCountry, getState,  } from 'services/actions/commonServiceAction';
import { getPh8Data } from 'services/actions/newRequestAction';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha , LoadCanvasTemplateNoReload} from 'react-simple-captcha';
import DownloadConsent , { DownloadConsentRef } from './request/modal/sub-screens/DownloadConsent';

const PatientIntakeForm: React.FC = () =>{
    const [form] = Form.useForm();
    const url = window.location.href;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const lastSegment = url.substring(url.lastIndexOf('/') + 1);
    const baseurl = 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms';
    const { pntaccInfo, success8, loading8, error8, addpntInfo, success7, error7, loading7,countryInfo, stateInfo, loading2, loading3 } = useSelector((state: any) => state.commonData);
    const {ph8Data} = useSelector((state: any) => state.newreq);
    const [date, setDate] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [errorData, setErrorData]: any = useState(null);
    const accInformation = pntaccInfo?.data || [];
    const symptoms = pntaccInfo?.Symptoms || [];
    const [errorForm, setErrorForm] = useState(false);
    const [validatePhq, setValidatePhq] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState();
    const [countryID, setCountryID] = useState(0);
    const [hasValue, setHasValue] = useState([]);
    const [isExists, setIsExists] = useState(false);
    const [isChecked1, setIsChecked1] = useState(true);
    const [isChecked2, setIsChecked2] = useState(true);
    const [isChecked3, setIsChecked3] = useState(true);
    //success/error msg
    const [showmsg, setShowmsg] = useState(false);
    const successmsg = showmsg ? success7 : null;
    const phq8Data = ph8Data?.data || null;
    const [email, setEmail] = useState('');
    //medication
    const [rows, setRows] = useState([
        { id: 1, field1: '', field2: '' },
        { id: 2, field1: '', field2: '' },
        { id: 3, field1: '', field2: '' },
        { id: 4, field1: '', field2: '' },
    ]);
    const [nextId, setNextId] = useState(5);
    const [rowsBefore, setRowsBefore] = useState([
        { id: 1, field3: '', field4: '' },
        { id: 2, field3: '', field4: '' },
        { id: 3, field3: '', field4: '' },
        { id: 4, field3: '', field4: '' },
    ]);
    const [drugOptions, setDrugOptions] = useState([]);
    const [dosage, setDosage] = useState([]);
    const [isMobileWidth, setIsMobileWidth] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isAgree, setIsAgree] = useState(false);
    const [phq, setPhq] = useState([]);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const contentRef = useRef(null);
    const [userCaptcha, setUserCaptcha] = useState('');
    const [captchaValid, setCaptchaValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const captchaRef = useRef(null);

    const downloadConsentRef = useRef<DownloadConsentRef>(null);
    
    const handleDownloadClick = () => {
        if (downloadConsentRef.current) {
        downloadConsentRef.current.downloadPDF()
        }
    };

    useEffect(() => {
        const checkCanvasReady = () => {
            const canvas:any = document.getElementById('canv');
            if (canvas && canvas.getContext) {
                loadCaptchaEnginge(6);
            } else {
                setTimeout(checkCanvasReady, 100); // Retry after a short delay
            }
        };
        checkCanvasReady();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (contentRef.current) {
                const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
                if (scrollTop + clientHeight >= scrollHeight - 5) {
                    setIsScrolledToBottom(true);
                }
            }
        };

        const contentElement: any = contentRef.current;
        if (contentElement) {
            contentElement.addEventListener('scroll', handleScroll);
            return () => {
                contentElement.removeEventListener('scroll', handleScroll);
            };
        }

        return undefined;
    }, [showModal]);

    useEffect(() => {
        const checkCanvasReady = () => {
            const canvas:any = document.getElementById('canv');
            if (canvas && canvas.getContext) {
                loadCaptchaEnginge(6, '#dfdfdf');
            } else {
                setTimeout(checkCanvasReady, 100); // Retry after a short delay
            }
        };
        checkCanvasReady();
    }, []);

    const reloadCaptcha = () => {
        loadCaptchaEnginge(6, '#dfdfdf');
    };

    const handleTermModal = () => {
        let validphq = false;
        setErrorForm(false);
        let item1: any = '',
            item2:any = '',
            item3:any = '',
            item4:any = '',
            item5:any  = '',
            item6:any = '',
            item7:any = '',
            item8:any;
        phq.forEach((item:any, i) => {
            if (item.id == 1) {
                if (item.r1 == true) {
                    item1 = 0;
                } else if (item.r2 == true) {
                    item1 = 1;
                } else if (item.r3 === true) {
                    item1 = 2;
                } else if (item.r4 === true) {
                    item1 = 3;
                } else {
                    item1 = '';
                }
            }
            if (item.id == 2) {
                if (item.r1 == true) {
                    item2 = 0;
                } else if (item.r2 == true) {
                    item2 = 1;
                } else if (item.r3 === true) {
                    item2 = 2;
                } else if (item.r4 === true) {
                    item2 = 3;
                } else {
                    item2 = '';
                }
            }
            if (item.id == 3) {
                if (item.r1 == true) {
                    item3 = 0;
                } else if (item.r2 == true) {
                    item3 = 1;
                } else if (item.r3 === true) {
                    item3 = 2;
                } else if (item.r4 === true) {
                    item3 = 3;
                } else {
                    item3 = '';
                }
            }
            if (item.id == 4) {
                if (item.r1 == true) {
                    item4 = 0;
                } else if (item.r2 == true) {
                    item4 = 1;
                } else if (item.r3 === true) {
                    item4 = 2;
                } else if (item.r4 === true) {
                    item4 = 3;
                } else {
                    item4 = '';
                }
            }
            if (item.id == 5) {
                if (item.r1 == true) {
                    item5 = 0;
                } else if (item.r2 == true) {
                    item5 = 1;
                } else if (item.r3 === true) {
                    item5 = 2;
                } else if (item.r4 === true) {
                    item5 = 3;
                } else {
                    item5 = '';
                }
            }
            if (item.id == 6) {
                if (item.r1 == true) {
                    item6 = 0;
                } else if (item.r2 == true) {
                    item6 = 1;
                } else if (item.r3 === true) {
                    item6 = 2;
                } else if (item.r4 === true) {
                    item6 = 3;
                } else {
                    item6 = '';
                }
            }
            if (item.id == 7) {
                if (item.r1 == true) {
                    item7 = 0;
                } else if (item.r2 == true) {
                    item7 = 1;
                } else if (item.r3 === true) {
                    item7 = 2;
                } else if (item.r4 === true) {
                    item7 = 3;
                } else {
                    item7 = '';
                }
            }
            if (item.id == 8) {
                if (item.r1 == true) {
                    item8 = 0;
                } else if (item.r2 == true) {
                    item8 = 1;
                } else if (item.r3 === true) {
                    item8 = 2;
                } else if (item.r4 === true) {
                    item8 = 3;
                } else {
                    item8 = '';
                }
            }
        });
        if (item1 === '' || item2 === '' || item3 === '' || item4 === '' || item5 === '' || item6 === '' || item7 === '' || item8 === '') {
            setValidatePhq(true);
            validphq = true;
        } else if (validateCaptcha(userCaptcha) == false) {
            setErrorForm(true);
            setCaptchaValid(true);
            if (userCaptcha == '') {
                setErrorMsg('Please fill in the captcha.');
            } else {
                setErrorMsg('Captcha does not match.');
                setUserCaptcha('');
                loadCaptchaEnginge(6, '#dfdfdf');
            }
        } else {
            setCaptchaValid(false);
            setValidatePhq(false);
            validphq = false;
            setShowModal(true);
        }
    };

    const onFinishFailed = (errorInfo) => {
        if (errorInfo?.errorFields?.length > 0) {
            setErrorForm(true);
        } else {
            setErrorForm(false);
        }
    };

    const handleTermAccept = () => {
        form.validateFields()
            .then((values) => {
                onFinish(values);
                setIsAgree(true);
            })
            .catch((errorInfo) => {
                console.log('Validation failed:', errorInfo);
            });
    };

    const handleTermDisagree = () => {
        setShowModal(false);
        setIsAgree(false);
    };

    const handleTermCancel = () => {
        setIsAgree(false);
        setShowModal(false);
    };

    // to clear the mediation data when country change
    useEffect(() => {
        const clearedRows = rows.map((row) => ({ ...row, field1: '', field2: '' }));
        setRows(clearedRows);
    }, [selectedCountry]);

    useEffect(() => {
        const handleWindowSizeChange = () => {
            setIsMobileWidth(window.innerWidth <= 767);
        };

        window.addEventListener('resize', handleWindowSizeChange);

        handleWindowSizeChange();

        return () => window.removeEventListener('resize', handleWindowSizeChange);
    }, []);

    async function medicName(value) {
        setDosage([]);
        await axios.get(`${baseurl}=${value}`).then((res) => {
            if (res) {
                const arr:any = [];
                const d = res.data[1];
                for (let i = 0; i < d.length; i++) {
                    arr.push({ value: d[i], label: d[i], id: i });
                }
                setDrugOptions(arr);
                setDosage([]);
            }
        });
    }

    function getDosage(val) {
        axios.get(`${baseurl}=${val}&ef=STRENGTHS_AND_FORMS,RXCUIS`).then((res) => {
            if (res) {
                if (res.data[2].STRENGTHS_AND_FORMS.length > 0) {
                    setDosage(res.data[2].STRENGTHS_AND_FORMS[0]);
                }
            }
        });
    }

    const questionData = phq8Data?.map((item, i) => {
        return {
            id: item.id,
            heading: item.heading,
            radioName: 'question' + i,
            r1: false,
            r2: false,
            r3: false,
            r4: false,
        };
    });

    useEffect(() => {
        const payload = {};
        dispatch(getPh8Data(payload) as any);
    }, [dispatch]);

    useEffect(() => {
        if (questionData) {
            setPhq(questionData);
        }
    }, [ph8Data]);

    useEffect(() => {
        if (errorData) {
            setPhq(questionData);
        }
    }, [errorData]);

    //Select Gender
    const GendersOption = [
        {
            label: 'Male',
            value: 'Male',
        },
        {
            label: 'Female',
            value: 'Female',
        },
        {
            label: 'Other',
            value: 'Other',
        },
    ];
    const GenderIdentity = [
        {
            label: 'Male',
            value: 'Male',
        },
        {
            label: 'Female',
            value: 'Female',
        },
        {
            label: 'Non-binary',
            value: 'Non-binary',
        },
        {
            label: 'Transgender',
            value: 'Transgender',
        },
    ];

    useEffect(() => {
        if (success7) {
            form.resetFields();
            setShowModal(false);
        }
        if (error8) {
            if (error8?.code == 404) {
                navigate('/Page404');
            }
        }
    }, [error8, success7]);

    const onFinish = (values) => {
        const x = values;
        const formData = new FormData();
        const validphq = false;
        setErrorForm(false);

        let item1:any = null,
            item2:any = null,
            item3:any = null,
            item4:any = null,
            item5:any = null,
            item6:any = null,
            item7:any = null,
            item8:any = null;
        phq.forEach((item:any, i) => {
            if (item.id == 1) {
                if (item.r1 == true) {
                    item1 = 0;
                } else if (item.r2 == true) {
                    item1 = 1;
                } else if (item.r3 === true) {
                    item1 = 2;
                }  else {
                    item1 = 3;
                }
            }
            if (item.id == 2) {
                if (item.r1 == true) {
                    item2 = 0;
                } else if (item.r2 == true) {
                    item2 = 1;
                } else if (item.r3 === true) {
                    item2 = 2;
                } else {
                    item2 = 3;
                }
            }
            if (item.id == 3) {
                if (item.r1 == true) {
                    item3 = 0;
                } else if (item.r2 == true) {
                    item3 = 1;
                } else if (item.r3 === true) {
                    item3 = 2;
                } else {
                    item3 = 3;
                }
            }
            if (item.id == 4) {
                if (item.r1 == true) {
                    item4 = 0;
                } else if (item.r2 == true) {
                    item4 = 1;
                } else if (item.r3 === true) {
                    item4 = 2;
                } else {
                    item4 = 3;
                }
            }
            if (item.id == 5) {
                if (item.r1 == true) {
                    item5 = 0;
                } else if (item.r2 == true) {
                    item5 = 1;
                } else if (item.r3 === true) {
                    item5 = 2;
                } else {
                    item5 = 3;
                }
            }
            if (item.id == 6) {
                if (item.r1 == true) {
                    item6 = 0;
                } else if (item.r2 == true) {
                    item6 = 1;
                } else if (item.r3 === true) {
                    item6 = 2;
                } else {
                    item6 = 3;
                }
            }
            if (item.id == 7) {
                if (item.r1 == true) {
                    item7 = 0;
                } else if (item.r2 == true) {
                    item7 = 1;
                } else if (item.r3 === true) {
                    item7 = 2;
                } else {
                    item7 = 3;
                }
            }
            if (item.id == 8) {
                if (item.r1 == true) {
                    item8 = 0;
                } else if (item.r2 == true) {
                    item8 = 1;
                } else if (item.r3 === true) {
                    item8 = 2;
                } else {
                    item8 = 3;
                }
            }
        });

        const d:any = [];
        const medic:any = rows;
        for (let i = 0; i < medic.length; i++) {
            if (medic[i].field1 !== '') {
                d.push({
                    medicine_name: medic[i].field1,
                    dosage: medic[i].field2,
                    medication_started_on: '',
                    medication_ended_on: '',
                    status: 'Present',
                });
            }
        }
        const medic1: any = rowsBefore;
        for (let i = 0; i < medic1.length; i++) {
            if (medic1[i].field3 !== '') {
                d.push({
                    medicine_name: medic1[i].field3,
                    dosage: medic1[i].field4,
                    medication_started_on: '',
                    medication_ended_on: '',
                    status: 'Past',
                });
            }
        }

        const inputJson = {
            reqid: 0,
            req_type: 'eeg data analysis',
            accountid: accInformation?.id,
            patientid: isExists ? error7?.pnt_info?.id : 0,
            first_name: x.first_Name.trim(),
            last_name: x.last_Name.trim(),
            gender: x.birth,
            dob: x.dob.format('YYYY-MM-DD'),
            pnt_contact_email: x.email || '',
            occupation: '',
            address: x.address || '',
            country: x.country || '',
            contact_number: x.contactphone?.toString() || '',
            state: x.state || '',
            city: x.city || '',
            zip: x.zip || '',
            gender_identity: x.birthIdentity,
            handedness: x.handedness,
            clinician_and_amplifier_used: 0,
            Past_Present_clinical_diagnosis: 'N/A',
            patient_symptomsconcerns: 'test',
            medications: 'N/A',
            were_meds_taken_within_48_hours_of_appointment: false,
            did_client_have_stimulants_day_of_scan: true,
            past_psychiatric_medication_response: 'test',
            previous_qeeg_report_pre_post_comaprison_request: 'test',
            does_patient_require: 'test',
            brief_history: 'test',
            phqid: 0,
            'Little interest or pleasure in doing things': item1,
            'Feeling down, depressed, or hopeless': item2,
            'Trouble falling or staying asleep, or sleeping too much': item3,
            'Feeling tired or having little energy': item4,
            'Poor appetite or overeating': item5,
            'Feeling bad about yourself or that you are a failure or have let yourself or your family down': item6,
            'Trouble concentrating on things, such as reading the newspaper or watching television': item7,
            'Moving or speaking so slowly that other people could have noticed. Or the opposite being so fidgety or restless that you have been moving around a lot more than usual.': item8,
            EC_equipment_type: '',
            EO_equipment_type: '',
            medic: d,
            eeg_research: isChecked1,
            eeg_analyst: isChecked2,
            eeg_data_privacy: isChecked3,
        };
        formData.append('EC_File', '');
        formData.append('EO_File', '');
        formData.append('InputJson', JSON.stringify(inputJson));
        dispatch(addPntForm(formData) as any);
    };

    //dateString
    const onChange = (date, dateString) => {
        setDate(dateString);
    };

    useEffect(() => {
        const inputJson = {
            uid: lastSegment,
        };
        dispatch(verifyPntForm(inputJson) as any);
    }, [dispatch]);

    const formatter = (value) => {
        const cleaned = ('' + value).replace(/\D/g, '');

        // Capture the groups we want
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

        // If there was no match, return the original value
        if (!match) return value;

        // Otherwise, return the formatted phone number
        return `(${match[1]}) ${match[2]}-${match[3]}`;
    };

    const parser = (value) => {
        // Remove all non-digits
        const cleaned:any = ('' + value).replace(/\D/g, '');
        if (cleaned === '' || isNaN(cleaned)) {
            return null;
        }
        // Return only the digits
        return parseInt(cleaned);
    };
    const validatePhone = (rule, value) => {
        const pattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
        if (value && !pattern.test(value)) {
            return Promise.reject('Please enter a valid US phone number');
        } else if (Number.isNaN(value)) {
            return Promise.reject('Please enter number');
        } else {
            return Promise.resolve();
        }
    };

    useEffect(() => {
        if (loading7) {
            setShowmsg(true);
        }
    }, [loading7]);

    useEffect(() => {
        if (successmsg) {
            setPhq(questionData);
            setIsExists(false);
            // submitEmail();
            setEmail('');
        }
        if (error7) {
            if (error7.data == 'error') {
                message.error(error7.message);
                setIsModalOpen(true);

                form.setFieldValue('birth', error7?.pnt_info?.gender);
                form.setFieldValue('birthIdentity', error7?.pnt_info?.gender_identity);
                form.setFieldValue('email', error7?.pnt_info?.pnt_contact_email);
                form.setFieldValue('contact', error7?.pnt_info?.contact_number);
                form.setFieldValue('handedness', error7?.pnt_info?.handedness);
                form.setFieldValue('address', error7?.pnt_info?.address);
                form.setFieldValue('country', error7?.pnt_info?.country);
                form.setFieldValue('state', error7?.pnt_info?.state);
                form.setFieldValue('city', error7?.pnt_info?.city);
                form.setFieldValue('zip', error7?.pnt_info?.zip);
            } else {
                message.error(error7.data);
            }
            if (error7.message) {
                setIsModalOpen(true);

                form.setFieldValue('birth', error7?.pnt_info?.gender);
                form.setFieldValue('birthIdentity', error7?.pnt_info?.gender_identity);
                form.setFieldValue('email', error7?.pnt_info?.pnt_contact_email);
                form.setFieldValue('contact', error7?.pnt_info?.contact_number);
                form.setFieldValue('handedness', error7?.pnt_info?.handedness);
                form.setFieldValue('address', error7?.pnt_info?.address);
                form.setFieldValue('country', error7?.pnt_info?.country);
                form.setFieldValue('state', error7?.pnt_info?.state);
                form.setFieldValue('city', error7?.pnt_info?.city);
                form.setFieldValue('zip', error7?.pnt_info?.zip);
            }
        }
    }, [successmsg, error7]);

    function getCountryState(id) {
        const inputJson = {
            countryid: id || 0,
        };
        dispatch(getCountry(inputJson) as any);
    }

    useEffect(() => {
        getCountryState(countryID) as any;
    }, [dispatch]);

    const countryOptions = loading2
        ? []
        : countryInfo?.data?.map((item:any) => {
              return {
                  label: item.countryname,
                  value: item.id.toString(),
                  key: item.id,
              };
          });

    useEffect(() => {
        if (countryInfo?.data) {
            form.setFieldsValue({ country: '231' });
            getStateDetails(231);
        }
    }, [countryInfo]);

    const stateOptions = loading3
        ? []
        : stateInfo?.data?.map((item) => {
              return {
                  label: item.statename,
                  value: item.id.toString(),
              };
          });

    function getStateDetails(id) {
        const inputJson = {
            countryid: id,
        };
        dispatch(getState(inputJson)as any);
    }

    const changeCountry = (value) => {
        const id = value;
        form.setFieldsValue({
            country: value,
        });
        form.resetFields(['state']);
        setSelectedCountry(id);
        getStateDetails(id);
    };

    const changeQuestionOpt = (name, val) => (e: any) => {
        const checked = e.target.checked;
        const arr = hasValue;
        const isExisting = hasValue.some((item) => item === val.id);

        if (!isExisting) {
            // Create a new array with the updated value
            const updatedData: any = [...hasValue, val.id];
            setHasValue(updatedData);
        }

        if (name == 'r1') {
            if (checked === true) {
                setPhq((current: any) =>
                    current.map((obj) => {
                        if (obj.id === val.id) {
                            return { ...obj, r1: true, r2: false, r3: false, r4: false };
                        }
                        return obj;
                    })
                );
            }
        } else if (name == 'r2') {
            if (checked === true) {
                setPhq((current: any) =>
                    current.map((obj) => {
                        if (obj.id === val.id) {
                            return { ...obj, r1: false, r2: true, r3: false, r4: false };
                        }
                        return obj;
                    })
                );
            }
        } else if (name == 'r3') {
            if (checked === true) {
                setPhq((current:any) =>
                    current.map((obj) => {
                        if (obj.id === val.id) {
                            return { ...obj, r1: false, r2: false, r3: true, r4: false };
                        }
                        return obj;
                    })
                );
            }
        } else {
            if (checked === true) {
                setPhq((current: any) =>
                    current.map((obj) => {
                        if (obj.id === val.id) {
                            return { ...obj, r1: false, r2: false, r3: false, r4: true };
                        }
                        return obj;
                    })
                );
            }
        }
    };

    const downloadPDF = async () => {
        const headerElement = document.getElementById('header');
        const header: any = headerElement ? headerElement.cloneNode(true) : null;

        const contentElement = document.getElementById('termsContent');
        const content: any = contentElement ? contentElement.cloneNode(true) : null;

        const combinedElement: any = document.createElement('div');
        combinedElement.appendChild(header);
        combinedElement.appendChild(content);

        header.style.display = 'block';

        const opt = {
            margin: [0.2, 0.6, 0.6, 0.6],
            filename: 'terms_and_conditions.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] },
        };
        await html2pdf().set(opt).from(combinedElement).save();
    };

    //medication
    const handleAddRow = () => {
        const newRow = { id: nextId, field1: '', field2: '' };
        setRows([...rows, newRow]);
        setNextId(nextId + 1);
    };
    const handleDeleteRow = (id) => {
        const updatedRows = rows.filter((row) => row.id != id);
        setRows(updatedRows);
    };

    const handleSearch = (val, id, fieldName) => {
        if (fieldName == 'field3' || fieldName == 'field4') {
            const updatedRows = rowsBefore.map((row) => {
                if (row.id === id) {
                    return { ...row, [fieldName]: val };
                }
                return row;
            });
            setDosage([]);
            setRowsBefore(updatedRows);
            if (fieldName == 'field3') {
                getDosage(val);
            }
        } else {
            const updatedRows = rows.map((row) => {
                if (row.id === id) {
                    return { ...row, [fieldName]: val };
                }
                return row;
            });
            setRows(updatedRows);
            if (fieldName == 'field1') {
                getDosage(val);
            }
        }
    };

    const handleInputChange = (e, id, field) => {
        const value = e.target.value;
        const updatedRows = rows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
        setRows(updatedRows);
    };

    const dosageOptions = dosage.map(function (dosage) {
        return {
            value: dosage,
            label: dosage,
        };
    });

    const handleOk = () => {
        setIsModalOpen(false);
        setErrorData(false);
        setIsExists(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
        setIsExists(false);
        setErrorData(true);
        form.setFieldsValue({ country: '231' });
        setIsChecked1(false);
        setIsChecked2(false);
        setIsChecked3(false);
        setRows([
            { id: 1, field1: '', field2: '' },
            { id: 2, field1: '', field2: '' },
            { id: 3, field1: '', field2: '' },
            { id: 4, field1: '', field2: '' },
        ]);
    };

    function initializeDatepicker(_defaultDate) {}
    const defaultDate = dayjs().subtract(3, 'year');

    // Call the function with the default date
    initializeDatepicker(defaultDate);

    const disableDate = (date) => {
        return date.isAfter(defaultDate, 'day');
    };

    return (
        <Row gutter={20}  className="antd-row-patient pnt-intake-form antd-postion-relative ">
            {successmsg ? (
                <Col span={20} className="antd w-80 mx-auto pnt-form-intake">
                    <div className="p-5 vh-100 bg-light d-flex justify-content-center align-items-center">
                        <Result
                            className="p-5"
                            status="success"
                            title={[
                                <div key="resultinfo">
                                    <h3>{`${accInformation?.account_name}, your request for the session has been successfully submitted `}</h3>
                                    <h3>
                                        Your reference number is this{' '}
                                        <span className="sub-title-req" style={{ fontWeight: '500', fontSize: '35px' }}>
                                            {addpntInfo?.data?.request_number}
                                        </span>
                                    </h3>
                                    <h2 className="text-success mt-5">Thank You</h2>
                                </div>,
                            ]}
                        />
                    </div>
                </Col>
            ) : (
                <>
                    {success8 ? (
                        <Col span={20} className="antd w-80 mx-auto pnt-form-intake">
                            <div className="text-center"> </div>
                            <div className="card antd-card mx-auto p-4">
                                <img src={EEGImage} width="300px" alt="brand name" className="mx-auto mb-3" />
                                <h3 className="text-from">Patient Intake Form</h3>
                                <Row gutter={20} className="ant-row-border mx-auto">
                                    <div className="text-start col-md-4">
                                        <h5>Account Name</h5>
                                        <h6 className="text-muted text-capitalize">{accInformation?.account_name}</h6>
                                    </div>
                                    <div className="text-start col-md-4">
                                        <h5>Contact Email</h5>
                                        <h6 className="text-muted">{accInformation?.contact_email}</h6>
                                    </div>
                                    <div className="text-start col-md-4 ps-3">
                                        <h5>Contact phone</h5>
                                        <h5 className="text-muted">{accInformation?.contact_phone}</h5>
                                    </div>
                                </Row>
                                <Form
                                    form={form}
                                    layout="vertical"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    onFinishFailed={onFinishFailed}
                                    onFinish={handleTermModal}
                                    className="w-100"
                                    autoComplete="off"
                                >
                                    <div className="card border-top-0 mt-4">
                                        <div className="card-header fs-5 antd-bg-color">Patient Information</div>
                                        <div className="card-body row">
                                            <div className="row mx-auto">
                                                <div className="col-md-4 ps-0">
                                                    <Form.Item
                                                        name="first_Name"
                                                        label="First name"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                        ]}
                                                    >
                                                        <Input disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Item
                                                        name="last_Name"
                                                        label="Last name"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                        ]}
                                                    >
                                                        <Input disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4 pe-0">
                                                    <Form.Item
                                                        name="dob"
                                                        label="DOB"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                            // {
                                                            //     validator: validateAge,
                                                            // },
                                                        ]}
                                                    >
                                                        <DatePicker className='w-100' format="MM-DD-YYYY" defaultPickerValue={defaultDate} disabledDate={disableDate} onChange={onChange} disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row mx-auto">
                                                <div className="col-md-4 ps-0">
                                                    <Form.Item
                                                        name="birth"
                                                        label="Sex at birth"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                        ]}
                                                    >
                                                        <Select options={GendersOption} size="large" disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Item
                                                        name="birthIdentity"
                                                        label="Gender identity"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                        ]}
                                                    >
                                                        <Select options={GenderIdentity} size="large" disabled={isExists} />
                                                    </Form.Item>
                                                </div>

                                                <div className="col-md-4 pe-0">
                                                    <Form.Item
                                                        name="email"
                                                        label="Email"
                                                        rules={[
                                                            {
                                                                // required: true,
                                                                type: 'email',
                                                                message: 'Enter valid email',
                                                            },
                                                            {
                                                                required: true,
                                                                message: 'This field is required',
                                                            },
                                                        ]}
                                                    >
                                                        <Input disabled={isExists} onChange={(e) => setEmail(e.target.value)} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row mx-auto ">
                                                <div className="col-md-4 ps-0">
                                                    <Form.Item
                                                        name="contactphone"
                                                        label="Contact phone"
                                                        rules={[
                                                            {
                                                                required: true,
                                                                message: 'Please input your contactphone!',
                                                            },
                                                            {
                                                                validator: validatePhone,
                                                            },
                                                        ]}
                                                    >
                                                        <InputNumber disabled={isExists} size="large" className="w-100 ps-0" maxLength={14} formatter={formatter} parser={parser} />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Item label="Handedness" name="handedness" rules={[{ required: true, message: 'This field is required' }]}>
                                                        <Select
                                                            showSearch
                                                            disabled={isExists}
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            options={[
                                                                {
                                                                    value: 'righthand',
                                                                    label: 'Right Hand',
                                                                },
                                                                {
                                                                    value: 'lefthand',
                                                                    label: 'Left Hand',
                                                                },
                                                            ]}
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4 pe-0">
                                                    <Form.Item name="address" label="Address">
                                                        <Input disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row mx-auto">
                                                <div className="col-md-4 ps-0">
                                                    <Form.Item label="Country" name="country">
                                                        <Select
                                                            showSearch
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            onChange={changeCountry}
                                                            disabled={isExists}
                                                            optionFilterProp="children"
                                                            // filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                            filterOption={(input, option: any) => {
                                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                            }}
                                                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                                            options={countryOptions}
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
                                                </div>
                                                <div className="col-md-4">
                                                    <Form.Item label="State" name="state">
                                                        <Select
                                                            showSearch
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            optionFilterProp="children"
                                                            disabled={isExists}
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
                                                            // filterOption={(input, option) => (option?.label ?? '').includes(input)}
                                                            filterOption={(input, option: any) => {
                                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                            }}
                                                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                                            options={stateOptions}
                                                        />
                                                    </Form.Item>
                                                </div>
                                                <div className="col-md-4 pe-0">
                                                    <Form.Item name="city" label="City">
                                                        <Input disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                            <div className="row mx-auto ">
                                                <div className="col-md-4 ps-0">
                                                    <Form.Item name="zip" label="Zip">
                                                        <InputNumber type="number" size="large" className="w-100 ps-0" disabled={isExists} />
                                                    </Form.Item>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-header fs-5 antd-bg-color">Patient Health Questionnaire</div>
                                        <div className="card-body row m-0 ph8">
                                            <table className={`${validatePhq ? 'border-danger' : 'border'} table-bordered ph8-table phq-tbl`}>
                                                <thead>
                                                    <tr className={`${validatePhq ? 'border-danger' : 'border-bottom'} `}>
                                                        <th className="p-1 ">
                                                            <span className="text-danger">* </span>Over the last 2 weeks, how often have you been bothered by any of the following problems?
                                                        </th>
                                                        <th className="text-center qn-td p-1">Not at all</th>
                                                        <th className="text-center qn-td p-1">Several days</th>
                                                        <th className="text-center qn-td p-1">More than half the days</th>
                                                        <th className="text-center qn-td p-1">Nearly every day</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {phq?.map((item:any, i) => (
                                                        <tr key={item.id} className={`${validatePhq ? 'border-danger' : 'border-bottom'} `}>
                                                            <td className="p-2">{item.heading}</td>
                                                            <td className={`${item.r1 ? 'active' : ''} text-center`}>
                                                                <Checkbox checked={item.r1} onChange={changeQuestionOpt('r1', item)}></Checkbox>
                                                            </td>
                                                            <td className={`${item.r2 ? 'active' : ''} text-center`}>
                                                                <Checkbox checked={item.r2} onChange={changeQuestionOpt('r2', item)}></Checkbox>
                                                            </td>
                                                            <td className={`${item.r3 ? 'active' : ''} text-center`}>
                                                                <Checkbox checked={item.r3} onChange={changeQuestionOpt('r3', item)}></Checkbox>
                                                            </td>
                                                            <td className={`${item.r4 ? 'active' : ''} text-center`}>
                                                                <Checkbox checked={item.r4} onChange={changeQuestionOpt('r4', item)}></Checkbox>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="card-header fs-5 antd-bg-color">Medication</div>
                                        <div className="row p-2 m-0">
                                            <div className="card-body col m-0 ph8">
                                                <h6 className="mb-3 mt-1">Provide all the medication you have taken past 30 days</h6>
                                                <div className="row mx-0 mb-2  p-0 medication-title">
                                                    <div className="sub-title col-md-5 me-3 ps-0 med-heading">Medicine Name</div>
                                                    {isMobileWidth && <div className={`${isMobileWidth} sub-title col-md-5`}>&#38;</div>}
                                                    <div className="sub-title col-md-5 ps-0 med-heading">Dosage</div>
                                                    <div className="col text-center">
                                                        {' '}
                                                        <PlusSquareOutlined className="text-primary" onClick={handleAddRow} />
                                                    </div>
                                                </div>
                                                {rows.map((row) => (
                                                    <div className="row mx-0 mb-2" key={row.id}>
                                                        <div className="col-md-5 me-3 ps-0">
                                                            {selectedCountry == 229 ? (
                                                                <Input className="w-100 mb-1" placeholder="Medicine Name" value={row.field1} onChange={(e) => handleInputChange(e, row.id, 'field1')} />
                                                            ) : (
                                                                <Select
                                                                    className="w-100 mb-1"
                                                                    showSearch
                                                                    notFoundContent={
                                                                        <div className="text-center p-4">
                                                                            <SearchOutlined className="pe-2 pb-2" />
                                                                            Search to find medicine
                                                                        </div>
                                                                    }
                                                                    placeholder="Medicine Name"
                                                                    getPopupContainer={(trigger) => trigger.parentNode}
                                                                    value={row.field1}
                                                                    defaultValue={row.field1}
                                                                    onSearch={medicName}
                                                                    options={drugOptions}
                                                                    onClick={() => {
                                                                        setDrugOptions([]);
                                                                    }}
                                                                    onSelect={(e) => handleSearch(e, row.id, 'field1')}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="col-md-5 ps-0">
                                                            {selectedCountry == 229 ? (
                                                                <Input className="w-100" placeholder="Dosage" value={row.field2} onChange={(e) => handleInputChange(e, row.id, 'field2')} />
                                                            ) : (
                                                                <Select
                                                                    className="w-100"
                                                                    getPopupContainer={(trigger) => trigger.parentNode}
                                                                    placeholder="Dosage"
                                                                    value={row.field2}
                                                                    defaultValue={row.field2}
                                                                    notFoundContent={
                                                                        <div className="text-center p-4">
                                                                            <SearchOutlined className="pe-2 pb-2" />
                                                                            Select medicine to find dosage
                                                                        </div>
                                                                    }
                                                                    onSelect={(e) => handleSearch(e, row.id, 'field2')}
                                                                    options={dosageOptions}
                                                                    onClick={() => {
                                                                        setDrugOptions([]);
                                                                    }}
                                                                />
                                                            )}
                                                        </div>
                                                        <div className="col-auto text-center">
                                                            <DeleteOutlined className="text-danger" onClick={() => handleDeleteRow(row.id)} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="form-group mt-4">
                                        <div className="col mt-3 captcha-container">
                                            <div ref={captchaRef} className="captcha-text d-flex">
                                                <div className="custom-captcha-container p-1 me-2">
                                                    <LoadCanvasTemplateNoReload className="custom-captcha-canvas" />
                                                </div>
                                                <Tooltip title="Reload Captcha" className="mt-0">
                                                    <ReloadOutlined className="reload-icon" onClick={reloadCaptcha} />
                                                </Tooltip>
                                            </div>
                                        </div>

                                        <div className="col-3 mt-3 captcha-value">
                                            <div>
                                                <Input placeholder="Enter Captcha Value" value={userCaptcha} onChange={(e) => setUserCaptcha(e.target.value)} />
                                            </div>
                                        </div>
                                        {captchaValid ? <div className="text-danger text-start mt-2 me-3">{errorMsg}</div> : ''}
                                    </div>

                                    <div className="text-end rounded mt-2 d-flex submit-btn-grp">
                                        <div className="col ms-auto text-end ">
                                            {errorForm ? <div className="text-danger text-end me-3">Mandatory field(s) not filled</div> : ''}
                                            {validatePhq ? <div className="text-danger text-end me-3">Patient Health Questionnaire is required</div> : ''}
                                        </div>
                                        <Button htmlType="submit" type="primary" className="btn-primary ms-auto">
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </Col>
                    ) : (
                        ''
                    )}
                </>
            )}
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

            <Modal
                className="termModal"
                title={
                    <div className="d-flex align-items-center">
                        <h5 className="mb-0 modalTitle text-dark">Terms and Conditions</h5>
                    </div>
                }
                open={showModal}
                onCancel={handleTermCancel}
                // closable={false}
                width={'55%'}
                height={'auto'}
                maskClosable={false}
                footer={[
                    <div key="button-group" className="footerButtons d-flex justify-content-between w-100">
                        <div className="termsDownload">
                            <a className="col-auto sub-title position-relative" onClick={handleDownloadClick}>
                                Click here to download Terms and Conditions
                            </a>
                            <div style={{display:'none'}}>
                                <DownloadConsent ref={downloadConsentRef} />    
                            </div>
                        </div>
                        <div className="col d-flex justify-content-end">
                            <Popconfirm placement="topLeft" title="If you disagree, We are unable to complete your request at this time" onConfirm={handleTermDisagree} okText="Ok" cancelText="Cancel">
                                <Button key="disagree" className="bg-danger text-white me-1">
                                    I Do Not Agree
                                </Button>
                            </Popconfirm>

                            <Tooltip title={!isScrolledToBottom ? 'To proceed, please review the Terms and Conditions by scrolling down' : ''} className="mt-0">
                                <Button key="agree" type="primary" className={`${!isScrolledToBottom ? 'disable' : ''} agreeButton`} loading={loading7} onClick={handleTermAccept} disabled={!isScrolledToBottom}>
                                    I Agree
                                </Button>
                            </Tooltip>
                        </div>
                    </div>,
                ]}
            >
                {/* <Divider className="mb-3 mt-2" /> */}
                <div id="termsContent" className="termsContainer">
                    <div id="header" className="" style={{ display: 'none' }}>
                        <div className=" header-content mt-3 mb-5">
                            <img className="term-logo" src={EEGImage} alt="EEG Logo" width="20%" />
                            <h5 className="text-center text-dark">Terms and Conditions</h5>
                        </div>
                    </div>
                    <div className="termServiceSection mb-2">
                        <h6 className="termHeader mb-2 fw-bold text-dark">Service Agreement</h6>
                        <h6 className="termcontent text-dark" style={{ fontSize: '14px', lineHeight: 1.5 }}>
                            The information and recommendations provided by Healthy Paths Inc. dba Axon EEG Solutions (&quot;Axon&quot;, &quot;we, &quot;us,&quot;or &quot;our&quot;) in this TIEReport (the &quot;Report&quot;) is for general informational and
                            educational purposes and is intended to be used solely as a diagnostic aid.
                        </h6>
                    </div>
                    <div className="termPrivacySection">
                        <h6 className="termHeader mb-2 fw-bold text-dark">Privacy Policy</h6>
                        <div className="text-start w-100  mx-2" style={{ marginBottom: '30px' }}>
                            <h6 ref={contentRef} className=" termcontent scrollable-term-container text-dark" style={{height:'300px', overflowY:'auto'}}>
                                <span className="  sm-text text-dark" style={{ fontSize: '12px' }}>
                                    While reviewing the Report it is important that you understand the following:
                                </span>
                                <br />
                                <span style={{ lineHeight: 2 }} />
                                <span className=""></span>1.{' '}
                                <span className="ps-2 sm-text text-decoration-underline text-dark" style={{ fontSize: '12px' }}>
                                    {' '}
                                    NOT MEDICAL ADVICE/CONSULT YOUR PHYSICIAN.{' '}
                                </span>{' '}
                                <span className="pb-3 fs-12 text-dark">
                                    THE REPORT DOES NOT CONTAIN MENTAL HEALTH OR MEDICAL ADVICE AND IS NOT A SUBSTITUTE FOR PROFESSIONAL THERAPY OR MEDICAL ADVICE. BEFORE TAKING ANY ACTIONS, INCLUDING ANY LIFESTYLE
                                    CHANGES OR STARTING A NEW MEDICATION (WHETHER PRESCRIPTION, OVER THE COUNTER OR NATURAL SUPPLEMENTS) BASED UPON THE REPORT, WE STRONGLY RECOMMEND THAT YOU TO CONSULT WITH THE
                                    APPROPRIATE MENTAL HEALTH AND/OR MEDICAL PROFESSIONALS, INCLUDING YOUR PRIMARY CARE PHYSICIAN. YOU SHOULD NEVER DELAY SEEKING MEDICAL TREATMENT OR DISREGARD PROFESSIONAL MEDICAL ADVICE
                                    DUE TO INFORMATION OR RECOMMENDATIONS CONTAINED IN THIS REPORT. THE USE OR RELIANCE OF ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK.
                                </span>
                                <br />
                                <span className="text-dark" style={{ lineHeight: 2 }}></span>2.{' '}
                                <span className="ps-2 fs-12 pb-3 text-dark">NO AXON AGENT OR EMPLOYEE SHALL PROVIDE ANY ADVICE OR SERVICES OUTSIDE THE SCOPE OF THEIR EXPERTISE OR LICENSURE.</span>
                                <br />
                                <span className="text-dark"></span>3.{' '}
                                <span className="ps-2 sm-text text-decoration-underline text-dark" style={{ fontSize: '12px' }}>
                                    {' '}
                                    NO REPRESENTATIONS OR WARRANTIES ARE MADE OR GIVEN.{' '}
                                </span>{' '}
                                <span className="text-dark" style={{ fontSize: '12px' }}>
                                    ALL INFORMATION AND RECOMMENDATIONS IN THE REPORT ARE PROVIDED IN GOOD FAITH BUT ARE PROVIDED “AS-IS”, WITHOUT WARRANTY OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT
                                    LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR SATISFACTORY QUALITY. WE MAKE NO REPRESENTATION OF ANY KIND, EXPRESS OR IMPLIED, REGARDING
                                    THE ACCURACY, ADEQUACY, VALIDITY, RELIABILITY, AVAILABILITY, OR COMPLETENESS OF ANY INFORMATION OR RECOMMENDATION IN THE REPORT.
                                </span>
                                <br />
                                <span style={{ lineHeight: 2 }} />
                                <span className="text-dark"></span>4.{' '}
                                <span className="ps-2 text-dark" style={{ fontSize: '12px' }}>
                                    {' '}
                                    QEEG DEVICES ARE CONSIDERED BY FDA A MEDICAL DEVICE. HOWEVER, FDA DOES NOT REGULATE THE USE OF THESE QEEG DEVICES IN THE CONTEXT OF AXON’S SERVICES.
                                </span>
                                <br />
                                <span style={{ lineHeight: 2 }} />
                                <span className="text-dark"></span>5.{' '}
                                <span className="ps-2 sm-text text-decoration-underline text-dark" style={{ fontSize: '12px' }}>
                                    NO LIABILITY.{' '}
                                </span>{' '}
                                <span className="text-dark" style={{ fontSize: '12px' }}>
                                    UNDER NO CIRCUMSTANCE SHALL WE HAVE ANY LIABILITY TO YOU FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF THE REPORT OR RELIANCE ON ANY INFORMATION OR
                                    RECOMMENDATIONS PROVIDED IN THE REPORT. YOUR USE OF THE REPORT AND YOUR RELIANCE ON ANY INFORMATION OR RECOMMENDATIONS IS SOLELY AT YOUR OWN RISK. WE HEREBY DISCLAIM ANY AND ALL
                                    LIABILITY FOR ANY INJURY OR DAMAGE TO OR OTHER IMPACT ON YOUR HEALTH OR MEDICAL CONDITION, WHETHER OR NOT CAUSED BY OR RELATED TO (EITHER DIRECTLY OR INDIRECTLY) YOUR USE OF THE
                                    INFORMATION OR RECOMMENDATIONS CONTAINED WITHIN THE REPORT. IN NO CASE SHALL AXON’S LIABILITY, IF ANY, EXCEED THE AMOUNT YOU PAID FOR THE SERVICES PROVIDED.
                                </span>
                                <br />
                                <span style={{ lineHeight: 2 }} />
                                <span className="text-dark"></span>6.{' '}
                                <span className="ps-2 text-dark" style={{ fontSize: '12px' }}>
                                    {' '}
                                    A COPY OF MY MINIMALLY RELEVANT MEDICAL HISTORY AND EEG DATA WILL BE SENT TO THE EEG ANALYST FOR REVIEW.
                                </span>
                                <br />
                                <span style={{ lineHeight: 2 }} />
                                <span className="text-dark"></span>7.{' '}
                                <span className="ps-2 text-dark" style={{ fontSize: '12px' }}>
                                    {' '}
                                    NON-IDENTIFYING DATA CONTAINED IN THE REPORT MAY BE USED IN EDUCATION AND RESEARCH. PRIVATE MEDICAL INFORMATION, INCLUDING YOUR TEST RESULTS, WILL NEVER BE SHARED OVER VOICEMAIL, EMAIL
                                    OR TEXT.
                                </span>
                                <br />
                            </h6>
                        </div>
                    </div>
                </div>
            </Modal>
        </Row>
    )
}

export default PatientIntakeForm