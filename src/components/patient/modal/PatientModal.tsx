import React, { useState, useEffect } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { DatePicker, Form, Input, InputNumber, Select } from 'components/shared/FormComponent';
import { addPatient } from 'services/actions/patientAction';
import { GenderIdtOptions, genderOptions, handOptions, occupationOptions, myFunc } from 'components/shared/DropdownOption';
import { formatter, parser, validateAge, validatePhone } from 'components/shared/FormValidators';
import dayjs from 'dayjs';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { getSymptomsList } from 'services/actions/master-data/diagnosisAction';
import {  useSelector, useDispatch } from 'components/shared/CompVariables';
import { useLocation } from 'react-router-dom';
import { getState } from 'services/actions/commonServiceAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    callBackGrid: (search: string, index: number, pagesize: number, sort: string, field: string) => void;
    patientData: any;
}

const PatientModal: React.FC<ChildProps> = ({ openModal, closeModal, callBackGrid, patientData }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const location = useLocation();
    const { loading1, error1, success1, loading3: symLoading } = useSelector((state: any) => state.patient);
    const { symptomsInfo, diagnosisInfo, loading1: sympLoading, loading: diagLoading } = useSelector((state: any) => state.diagnosis);
    const { loading2, loading3, loading4 } = useSelector((state: any) => state.commonData);
    const [unsymptoms, setUnsymptoms]: any = useState([]);
    const [undiagnosis, setUndiagnosis]: any = useState([]);
    const options = myFunc();
    const stateOptions: any = !loading3 ? options.stateOptions : [];
    const countryOptions: any = !loading2 ? options.countryOptions : [];
    const accOptions: any = !loading4 ? options.accOptions : [];
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;
    const diagvalue: any = [];
    const sympvalue: any = [];
    const userRole = sessionStorage.getItem('role');
    const accountId = Number(sessionStorage.getItem('accountid'));
    const userId = Number(sessionStorage.getItem('userid'));


    patientData?.diagnosis?.map((d: any) => {
        if (d.ischoices === true) {
            const val = d.id;
            return diagvalue.push(val);
        }
    });

    patientData?.symptoms?.map((s: any) => {
        if (s.ischoices === true) {
            const val = s.id;
            return sympvalue.push(val);
        } else return null;
    });

    const symptomsOptions =
        location.state && location.state?.patientId
            ? symLoading
                ? []
                : patientData?.symptoms?.map((item: any) => {
                      return { label: item.symptoms_name, value: item.id };
                  })
            : sympLoading
              ? []
              : symptomsInfo?.data?.map((item: any) => {
                    return { label: item.symptoms_name, value: item.id };
                });

    const diagnosisOptions =
        location.state && location.state?.patientId
            ? symLoading
                ? []
                : patientData?.diagnosis?.map((item: any) => {
                      return { label: item.diagnosis_name, value: item.id };
                  })
            : diagLoading
              ? []
              : diagnosisInfo?.data?.map((item: any) => {
                    return { label: item.diagnosis_name, value: item.id };
                });

    const submitForm = async () => {
        const value = form.getFieldsValue();
        try {
            await form.validateFields();
            const inputJson = {
                patientid: patientData ? patientData?.data[0].id : 0,
                first_name: value.firstName || '',
                last_name: value.lastName || '',
                gender: value.birthSex || '',
                dob: value['dob'].format('YYYY-MM-DD') || '',
                gender_identity: value.genderIdentity,
                pnt_contact_email: value.email || '',
                occupation: value.occupation || '',
                address: value.address || '',
                country: value.country,
                contact_number: value.contactPhone?.toString() || '',
                state: value.state || '',
                city: value.city || '',
                zip: value.zip || '',
                handedness: value.handedness || '',
                status: 'Active',
                accountid: userRole == 'staff' ? accountId : Number(value.account) || '',
                diagnosis: value.diagnosis !== undefined ? value.diagnosis.toString() : '',
                undiagnosis: undiagnosis !== null ? undiagnosis.toString() : '',
                symptoms: value.symptoms !== undefined ? value.symptoms.toString() : '',
                unsymptoms: unsymptoms !== null ? unsymptoms.toString() : '',
                userid: userId,
            };
            dispatch(addPatient(inputJson) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('Failed', error);
        }
    };

    const getSymptoms = () => {
        dispatch(getSymptomsList() as any);
    };

    useEffect(() => {
        if (!location.state && openModal) {
            getSymptoms();
        }
    }, [openModal]);

    useEffect(() => {
        if (successmsg) {
            if (patientData) {
                message.success('Patient Updated Successfully');
            } else {
                message.success('Patient Added Successfully');
            }
            setShowSuccessmsg(false);
            closeModal();
            callBackGrid('', 1, 10, '', '');
        }
        if (errormsg) {
            if (error1?.data) {
                message.error(error1?.data);
            } else {
                message.error("Patient couldn't be added");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function initializeDatepicker(_defaultDate: dayjs.Dayjs) {}
    const defaultDate = dayjs().subtract(3, 'year');

    // Call the function with the default date
    initializeDatepicker(defaultDate);

    const disableDate = (date: dayjs.Dayjs): boolean => {
        return date.isAfter(defaultDate, 'day');
    };
    const handleDeselectSymptoms = (value: any) => {
        for (let i = 0; i < sympvalue.length; i++) {
            if (sympvalue[i] == value) {
                unsymptoms.push(value);
                setUnsymptoms([...unsymptoms], value);
            }
        }
    };
    const handleDeselectDiagnosis = (value: any) => {
        for (let i = 0; i < diagvalue.length; i++) {
            if (diagvalue[i] == value) {
                undiagnosis.push(value);
                setUndiagnosis([...undiagnosis], value);
            }
        }
    };

    const handleClose = () => {
        closeModal();
        if (!patientData) {
            form.resetFields();
            form.setFieldsValue({ country: '231' });
        }
    };

    const loadData = () => {
        if (patientData?.data && patientData.data.length > 0) {
            const pntData = patientData.data[0];
            if (pntData.country !== '231') {
                getStateDetails(pntData.country);
            }
            form.setFieldsValue({
                firstName: pntData.first_name || '',
                lastName: pntData.last_name || '',
                dob: pntData.dob ? dayjs(pntData.dob) : null,
                birthSex: pntData.gender || '',
                genderIdentity: pntData.gender_identity || '',
                contactPhone: pntData.contact_number || '',
                email: pntData.pnt_contact_email || '',
                occupation: pntData.occupation || '',
                handedness: pntData.handedness || '',
                diagnosis: diagvalue && pntData ? diagvalue : [],
                symptoms: sympvalue && pntData ? sympvalue : [],
                account: pntData.accountid || '',
                address: pntData.address || '',
                country: pntData.country || '231',
                state: pntData.state || '',
                city: pntData.city || '',
                zip: pntData.zip || '',
            });
        } else {
            form.resetFields();
            form.setFieldsValue({ country: '231' });
            getStateDetails('231');
        }
    };
    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [openModal, patientData]);

    const getStateDetails = (value: any) => {
        const inputJson = {
            countryid: value,
        };
        dispatch(getState(inputJson) as any);
    };

    return (
        <div>
            <Modal
                width={800}
                title={patientData ? 'Update Patient' : 'Add Patient'}
                confirmLoading={loading1}
                open={openModal}
                onCancel={handleClose}
                onOk={submitForm}
                okText={patientData ? 'Update' : 'Save'}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form form={form} layout="vertical">
                    <div className="row m-0">
                        <Form.Item name="firstName" label="First name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="dob"
                            label="Date of birth"
                            className="col"
                            rules={[
                                { required: true, message: 'This field is required!' },
                                {
                                    validator: validateAge,
                                },
                            ]}
                        >
                            <DatePicker className="w-100" defaultPickerValue={defaultDate} disabledDate={disableDate} format="DD-MM-YYYY" />
                        </Form.Item>
                    </div>
                    <div className="row m-0">
                        <Form.Item name="birthSex" label="Sex at birth" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Select options={genderOptions} />
                        </Form.Item>
                        <Form.Item name="genderIdentity" label="Gender identity" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Select options={GenderIdtOptions} />
                        </Form.Item>
                        <Form.Item
                            name="contactPhone"
                            label="Contact Phone"
                            className="col"
                            rules={[
                                {
                                    required: true,
                                    message: 'This field is required',
                                },
                                {
                                    validator: validatePhone,
                                },
                            ]}
                        >
                            <InputNumber className="w-100" placeholder="(123) 456-7890" maxLength={14} formatter={formatter} parser={parser} />
                        </Form.Item>
                    </div>
                    <div className="row m-0">
                        <Form.Item name="email" label="Email" className="col" rules={[{ type: 'email', message: 'Enter valid mail address!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="occupation" label="Occupation" className="col">
                            <Select
                                showSearch
                                getPopupContainer={(trigger) => trigger.parentNode}
                                optionFilterProp="children"
                                filterOption={(input: any, option: any) => {
                                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}
                                options={occupationOptions}
                            />
                        </Form.Item>
                        <Form.Item name="handedness" label="Handedness" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Select getPopupContainer={(trigger) => trigger.parentNode} options={handOptions} />
                        </Form.Item>
                    </div>
                    <div className="row m-0">
                        <Form.Item name="symptoms" label="Symptoms" className="col-md-4">
                            <Select
                                mode="multiple"
                                getPopupContainer={(trigger) => trigger.parentNode}
                                options={symptomsOptions}
                                filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                notFoundContent={
                                    <div className="text-center p-4">
                                        {sympLoading || symLoading ? (
                                            <span>
                                                <LoadingOutlined />
                                                Loading...
                                            </span>
                                        ) : (
                                            <span>No symptoms available</span>
                                        )}
                                    </div>
                                }
                                onDeselect={handleDeselectSymptoms}
                            />
                        </Form.Item>
                        {patientData && (
                            <Form.Item name="diagnosis" label="Diagnosis" className="col-md-4">
                                <Select
                                    mode="multiple"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    options={diagnosisOptions}
                                    filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                    notFoundContent={
                                        <div className="text-center p-4">
                                            {sympLoading || symLoading ? (
                                                <span>
                                                    <LoadingOutlined />
                                                    Loading...
                                                </span>
                                            ) : (
                                                <span>No diagnosis available</span>
                                            )}
                                        </div>
                                    }
                                    onDeselect={handleDeselectDiagnosis}
                                />
                            </Form.Item>
                        )}
                        {userRole === 'staff' ? (
                            ''
                        ) : (
                            <Form.Item name="account" label="Account" className="col-md-4" rules={[{ required: true, message: 'This field is required!' }]}>
                                <Select
                                    showSearch
                                    options={accOptions}
                                    optionFilterProp="children"
                                    filterOption={(input: any, option: any) => {
                                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                    }}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                    notFoundContent={
                                        <div className="text-center p-4">
                                            {loading3 ? (
                                                <span>
                                                    <LoadingOutlined />
                                                    Loading...
                                                </span>
                                            ) : (
                                                <span>No Account found</span>
                                            )}
                                        </div>
                                    }
                                />
                            </Form.Item>
                        )}
                    </div>
                    <div className="row bg-light px-1 py-2">
                        <div className="row m-0 px-2">
                            <Form.Item name="address" label="Address" className="col">
                                <Input />
                            </Form.Item>
                            <Form.Item name="country" label="Country" className="col">
                                <Select
                                    showSearch
                                    options={countryOptions}
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    onChange={getStateDetails}
                                    optionFilterProp="children"
                                    filterOption={(input: any, option: any) => {
                                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                    }}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
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
                                    options={stateOptions}
                                    optionFilterProp="children"
                                    filterOption={(input: any, option: any) => {
                                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                    }}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
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
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                />
                            </Form.Item>
                        </div>
                        <div className="row m-0 px-2">
                            <Form.Item name="city" label="City" className="col-md-4">
                                <Input />
                            </Form.Item>
                            <Form.Item name="zip" label="Zip" className="col-md-4">
                                <Input />
                            </Form.Item>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PatientModal;
