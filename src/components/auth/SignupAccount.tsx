import React, { useEffect, useState } from 'react';
import { Image, message, Modal, Result, Upload } from 'components/shared/AntComponent';
import ImgCrop from 'antd-img-crop';
import { Button } from 'components/shared/ButtonComponent';
import { Form, Input, InputNumber, Select } from 'components/shared/FormComponent';
import { useSelector, useDispatch, url2 } from 'components/shared/CompVariables';
import { myFunc } from 'components/shared/DropdownOption';
import { formatter, parser, validatePhone } from 'components/shared/FormValidators';
import { CloseSquareOutlined, LoadingOutlined } from 'components/shared/AntIcons';
import { getCountry, getState } from 'services/actions/commonServiceAction';
import { addAccount } from 'services/actions/accountAction';
import LoginImg from 'assets/img/login-image.png';
import EEGLogo from 'assets/img/brandname.png';
import 'assets/styles/auth.scss';
import 'assets/styles/form.scss';
import { useNavigate } from 'react-router-dom';
import { signUpAccount } from 'services/actions/authAction';

const { Dragger } = Upload;

const SignupAccount: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading2, loading3 } = useSelector((state: any) => state.commonData);
    const { loading12, success12, error12, accountInfo } = useSelector((state: any) => state.auth);
    const [fileList, setFileList]: any = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success12 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error12 : false;
    const { countryInfo, stateInfo } = useSelector((state: any) => state.commonData);
    const [baaFile, setBaaFile]: any = useState(null);

    const countryOptions: any = countryInfo?.data?.map((item: any) => {
        return {
            label: item.countryname,
            value: item.id.toString(),
            key: item.id,
        };
    });

    const stateOptions: any = stateInfo?.data?.map((item: any) => {
        return {
            label: item.statename,
            value: item.id.toString(),
            key: item.id,
        };
    });

    const props1 = {
        onRemove: (file: any) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList,
    };

    const changeFile = (info: any) => {
        setFileList(info?.fileList);
    };

    const getStateDetails = (value: any) => {
        const inputJson = {
            countryid: value,
        };
        dispatch(getState(inputJson) as any);
    };

    useEffect(() => {
        const inputJson = {
            countryid: 0,
        };
        dispatch(getCountry(inputJson) as any);
    }, []);

    useEffect(() => {
        if (countryInfo?.data) {
            getStateDetails(231);
        }
    }, [countryInfo]);

    const handleSubmit = async () => {
        const formData = new FormData();
        try {
            const value = await form.validateFields();
            const inputJson = {
                AccountID: 0,
                account_name: value.accountName || '',
                first_name: value.firstName || '',
                last_name: value.lastName || '',
                contact_phone: value.contactNo?.toString() || '',
                contact_email: value.email || '',
                contact_fax: value.fax || '',
                contact_address: value.address || '',
                country: value.country || '231',
                state: value.state || '',
                city: value.city || '',
                zip: value.zip || '',
                status: 'Active',
            };
            let file = '';
            if (fileList) {
                file = fileList[0]?.originFileObj;
            } else {
                file = '';
            }

            if (baaFile && baaFile.length > 0) {
                baaFile.forEach((file: any) => {
                    formData.append('baa_docs', file.originFileObj);
                });
            } else {
                formData.append('baa_docs', ''); // Handle no files case
            }
            // formData.append('baa_docs',file1);
            formData.append('File', file);
            formData.append('InputJson', JSON.stringify(inputJson));
            dispatch(signUpAccount(formData) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        form.setFieldsValue({
            accountName: '',
            firstName: '',
            lastName: '',
            contactNo: '',
            email: '',
            fax: '',
            address: '',
            country: '231',
            state: '',
            city: '',
            zip: '',
        });
    }, [])

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Account Created successfully');
        }
        if (errormsg) {
            setShowErrormsg(false);
            if (error12.data) {
                message.error(error12.data);
            } else {

                message.error("Account couldn't be added");

            }
        }
    }, [successmsg, errormsg]);


    const gotoLogin = () => {
        navigate('/login');
    }
    const changeFileEO = (info) => {
        setBaaFile(info?.fileList);
    };

    const onPreview = async (file) => {
        let src = file.url || file.preview;

        if (!src) {
            src = await new Promise<string>((resolve) => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result as string);
            });
        }
        const imgWindow = window.open("");
        if (imgWindow) {
            imgWindow.document.write(`<html><body><img src="${src}" style="max-width: 100%; height: auto;" /></body></html>`);
            imgWindow.document.close();
        }
    };

    return (
        <div className="login-container account-signup-cont">
            {success12 ?
                <div className="p-5 mt-5">
                    <Result
                        className="p-5"
                        status="success"
                        title={[
                            <div key="resultinfo">
                                <h3 className="fw-normal mb-3 text-dark">Request for Account creation submitted successfully!</h3>
                                <div className="d-flex flex-row justify-content-center">
                                    <h4 className="fw-normal text-secondary fs-19">
                                        Your reference number is
                                        <span className="sub-title-req text-blue fs-20 fw-bold" >
                                            {accountInfo ? " " + accountInfo?.data?.encoded_accountNumber : ""}
                                        </span>.
                                    </h4>
                                </div>
                            </div>,
                        ]}
                        extra={[
                            <React.Fragment key="content">
                                {/* <Button type="primary" className="mx-auto text-center" key="console" onClick={() => history(userRole === 'staff' ? '/view-request' : '/new-request')}>
                                            {userRole !== 'staff' ? 'Back to Request in Pipeline' : 'Back to Order Management'}
                                        </Button> */}
                            </React.Fragment>
                        ]}
                    />
                </div> : <>
                    <div className="text-center p-3 res-img">
                        <Image src={EEGLogo} alt="eeg-logo" width="30%" preview={false} className="res-img" />
                    </div>
                    <div className="h-100 row m-0">
                        <div className="login-bg-container text-center h-100 col-md-6">
                            <Image src={LoginImg} alt="login-img" preview={false} height="100%" width="auto" className="login-img" />
                        </div>
                        <div className="m-auto h-100 login-right-cont d-flex align-items-center col-md-5 bg-white">
                            <div className="my-auto text-center">
                                <Image src={EEGLogo} alt="eeg-logo" width="55%" className="eeg-logo" preview={false} />
                                <div className="eeg-img">
                                    <Image src={LoginImg} alt="login-img" preview={false} height="60%" width="auto" className="login-img-right" />
                                </div>
                                <h1 className="text-dark mt-3 text-center">Welcome!</h1>
                                <h4 className="text-secondary fw-normal text-center">Create your Account</h4>
                                <Form form={form} className="mt-4 w-100" layout="vertical" autoComplete="off" onFinish={handleSubmit}>
                                    <div className='px-2 py-3 bg-light border sign-up-acc'>
                                        <div className="row m-0">
                                            <Form.Item name="accountName" label="Account name" className="col-md-4" rules={[{ required: true, message: 'This field is required!' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="firstName" label="First name" className="col-md-4" rules={[{ required: true, message: 'This field is required!' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="lastName" label="Last name" className="col-md-4" rules={[{ required: true, message: 'This field is required!' }]}>
                                                <Input />
                                            </Form.Item>
                                            <Form.Item
                                                name="contactNo"
                                                label="Contact phone"
                                                className="col-md-4"
                                                rules={[
                                                    { required: true, message: 'This field is required!' },
                                                    {
                                                        validator: validatePhone,
                                                    },
                                                ]}
                                            >
                                                <InputNumber className="w-100" placeholder="(123) 456-7890" maxLength={14} formatter={formatter} parser={parser} />
                                            </Form.Item>

                                            <Form.Item
                                                name="email"
                                                label="Email"
                                                className="col-md-4"
                                                rules={[
                                                    { required: true, message: 'This field is required!' },
                                                    { type: 'email', message: 'Enter valid mail address!' },
                                                ]}
                                            >
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="fax" label="Fax" className="col-md-4">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="address" label="Address" className="col-md-4">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="country" label="Country" className="col-md-4">
                                                <Select
                                                    showSearch
                                                    getPopupContainer={(trigger) => trigger.parentNode}
                                                    onChange={getStateDetails}
                                                    className='text-start'
                                                    optionFilterProp="children"
                                                    filterOption={(input, option: any) => {
                                                        return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                                    }}
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
                                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                                    options={countryOptions}
                                                />
                                            </Form.Item>
                                            <Form.Item name="state" label="State" className="col-md-4">
                                                <Select
                                                    showSearch
                                                    options={stateOptions}
                                                    optionFilterProp="children"
                                                    className='text-start'
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
                                            <Form.Item name="city" label="City" className="col-md-4">
                                                <Input />
                                            </Form.Item>
                                            <Form.Item name="zip" label="Zip" className="col-md-4">
                                                <Input />
                                            </Form.Item>
                                            <div className='row mx-0'>
                                                <Form.Item label="Upload logo" name="uploadLogo" className="col px-2">
                                                    <ImgCrop aspectSlider showReset aspect={180 / 80}>
                                                        <Dragger
                                                            {...props1}
                                                            name="file"
                                                            multiple={false}
                                                            maxCount={1}
                                                            beforeUpload={() => false}
                                                            fileList={fileList || []}
                                                            listType="picture-card"
                                                            onChange={changeFile}
                                                            onPreview={onPreview}
                                                            accept={'.png,.jpg,.jpeg'}
                                                        >
                                                            <p className="ant-upload-drag-icon"></p>
                                                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                            <p className="ant-upload-hint">Upload Logo here</p>
                                                        </Dragger>
                                                    </ImgCrop>
                                                </Form.Item>
                                                <Form.Item name="baaDoc" label="Upload Document" className="col pe-2 mb-0" valuePropName="baaDoc" rules={[{ required: true, message: 'This field is required!' }]}>
                                                    <Upload.Dragger
                                                        name="file"
                                                        multiple={true}
                                                        maxCount={6}
                                                        beforeUpload={() => false}
                                                        fileList={baaFile || []}
                                                        listType="picture-card"
                                                        accept=".pdf"
                                                        onChange={changeFileEO}
                                                    >
                                                        <p className="ant-upload-drag-icon"></p>
                                                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                                        <p className="ant-upload-hint mb-0">Supported file format is PDF.</p>
                                                        <p className='text-dark mb-0'>(Maximum document limit is 6)</p>
                                                    </Upload.Dragger>
                                                    <p className='text-danger'>File size limit is 50MB.</p>
                                                </Form.Item>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='p-2 text-white bg-primary text-start'><h5 className='my-auto'>User Information</h5></div>
                            <div className='p-2 bg-light'>
                                <div className='row mx-0'>
                                <Form.Item name="firstName" label="First name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Input />
                                    </Form.Item>
                                    <Form.Item name="lastName" label="Last name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                                        <Input />
                                    </Form.Item>
                                </div>
                            </div> */}


                                    <div className='text-end'>

                                    </div>
                                    <div className='d-flex w-100 my-2'>
                                        <div>
                                            <a className="a-link fs-16 text fw-600" onClick={gotoLogin}>Back to Login
                                            </a>
                                        </div>
                                        <div className="ms-auto">
                                            <Button type="primary" htmlType="submit" loading={loading12} className=" mt-3 fs-17 fw-bold">
                                                Sign Up
                                            </Button>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </>}
        </div>
    );
};

export default SignupAccount;
