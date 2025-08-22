import React, { useEffect, useState } from 'react';
import { Image, message, Modal, Progress, Upload } from 'components/shared/AntComponent';
import ImgCrop from 'antd-img-crop';
import { Button } from 'components/shared/ButtonComponent';
import { Form, Input, InputNumber, Select } from 'components/shared/FormComponent';
import { useSelector, useDispatch, url2 } from 'components/shared/CompVariables';
import { myFunc } from 'components/shared/DropdownOption';
import { formatter, parser, validatePhone } from 'components/shared/FormValidators';
import { CloseSquareOutlined, DownloadOutlined, LoadingOutlined } from 'components/shared/AntIcons';
import { getState } from 'services/actions/commonServiceAction';
import { addAccount, approveAccount } from 'services/actions/accountAction';
import { documentDownload } from 'services/actions/pipeline/pipelineAction';
import { DownloadIcon } from 'assets/img/custom-icons';
import axios from 'axios';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
    callBackGrid: () => void;
}

const { Dragger } = Upload;

const PreviewAccount: React.FC<ChildProps> = ({ openModal, closeModal, rowData, callBackGrid }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading2, loading3 } = useSelector((state: any) => state.commonData);
    const excelDownProgress = useSelector((state: any) => state.download.excelDownProgress);
    const { loading1, success1, error1, loading14, success14, error14 } = useSelector((state: any) => state.account);
    const options = myFunc();
    const stateOptions: any = !loading3 ? options.stateOptions : [];
    const countryOptions: any = !loading2 ? options.countryOptions : [];
    const [status, setStatus] = useState(true);
    const [showImg, setShowImg] = useState(false);
    const [showImg1, setShowImg1] = useState(false);
    const [fileList, setFileList]: any = useState([]);
    const [fileList1, setFileList1]: any = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success14 : false;
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const errormsg = showErrorMsg ? error14 : false;
    const [visible, setVisible] = useState(true);
    const [downProgress, setDownProgress] = useState(0);
    const customFormat = (percent) => `${percent}%`;

    

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
    const props2 = {
        onRemove: (file: any) => {
            const index = fileList1.indexOf(file);
            const newFileList = fileList1.slice();
            newFileList.splice(index, 1);
            setFileList1(newFileList);
        },
        beforeUpload: () => {
            return false;
        },
        fileList1,
    };

    const changeFile = (info: any) => {
        setFileList(info?.fileList);
    };

    const changeFile1 = (info: any) => {
        setFileList1(info?.fileList);
    };

    const handleClose = () => {
        closeModal();
    };

    const getStateDetails = (value: any) => {
        const inputJson = {
            countryid: value,
        };
        dispatch(getState(inputJson) as any);
    };

    const handleSubmit = async () => {
        const formData = new FormData();
        try {
            const value = await form.validateFields();
            const inputJson = {
                accountid: rowData?.id,
                loginmail: value?.email,
                groups: ['Accounts'],
                domain: window.origin
            }
            dispatch(approveAccount(inputJson) as any);
            setShowSuccessmsg(true);
            setShowErrorMsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    useEffect(() => {
        if (successmsg) {
            message.success('Account approved successfully');
            setShowSuccessmsg(false);
            closeModal()
            callBackGrid()
        }
        if (errormsg) {
            if (error14?.errors) {
                Object.keys(error14.errors).forEach((key) => {
                    const errorMessages = error14.errors[key];
                    if (Array.isArray(errorMessages)) {
                        errorMessages.forEach((msg) => {
                            message.error(`${key}: ${msg}`);
                        });
                    }
                });
            } else {
                message.error("Account couldn't be approved");
            }
            setShowErrorMsg(false);
        }
    }, [successmsg, errormsg]);
    const loadData = () => {
        if (rowData?.status == 'Active') {
            setStatus(true);
        } else if (rowData?.status == 'Inactive') {
            setStatus(false);
        } else {
            setStatus(true);
        }
        if (rowData?.iconpath) {
            setShowImg(true);
        }
        if (rowData?.baa_docs) {
            setShowImg1(true);
            setFileList1(rowData?.baa_docs)
        }
        if (openModal) {
            if (rowData?.country != '231') {
                getStateDetails(rowData?.country || '231');
            } else {
                getStateDetails('231');
            }
        }
        form.setFieldsValue({
            accountName: rowData ? rowData?.account_name : '',
            firstName: rowData?.first_name || '',
            lastName: rowData?.last_name || '',
            contactNo: rowData?.contact_phone || '',
            email: rowData?.contact_email || '',
            fax: rowData?.contact_fax || '',
            address: rowData?.contact_address || '',
            country: rowData?.country || '231',
            state: rowData?.state || '',
            city: rowData?.city || '',
            zip: rowData?.zip || '',
        });
    };

    const handleCropChange = (file) => {
        form.setFieldsValue({ uploadLogo: file });
    }

    useEffect(() => {
        if (openModal) {
            loadData();
        }
    }, [rowData, openModal]);

    const handleDownload = async (urls: any, fname: string) => {
        try {
            const url = urls;
            // const fileFormat = getFileFormat(urls);
            const response = await axios.get(url, {
                responseType: 'blob', // Ensure that the response is treated as a blob
                headers: {
                    'Content-Type': 'application/pdf', // Adjust based on your server's response content type
                },
                onDownloadProgress: (progressEvent: any) => {
                    if (progressEvent.lengthComputable) {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                         setDownProgress(percentCompleted);
                         setVisible(true);
                    }
                },
            });
            //  setDownloadPercent(0);
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = `${fname}`;
            link.click();
            window.URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error('There was a problem with the download operation:', error);
        } finally {
             setDownProgress(0);
        }

    };

    return (
        <div>
            <Modal
                title={'Approve Account'}
                confirmLoading={loading14}
                open={openModal}
                width={800}
                onCancel={handleClose}
                onOk={handleSubmit}
                okText={"Approve"}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form layout="vertical" form={form}>
                    <div className="row m-0">
                        <Form.Item name="accountName" label="Account Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="firstName" label="First Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input disabled />
                        </Form.Item>
                    </div>
                    <div className="row m-0">
                        <Form.Item
                            name="contactNo"
                            label="Contact Phone"
                            className="col"
                            rules={[
                                { required: true, message: 'This field is required!' },
                                {
                                    validator: validatePhone,
                                },
                            ]}
                        >
                            <InputNumber className="w-100" placeholder="(123) 456-7890" maxLength={14} disabled formatter={formatter} parser={parser} />
                        </Form.Item>
                        <Form.Item
                            name="email"
                            label="Email"
                            className="col"
                            rules={[
                                { required: true, message: 'This field is required!' },
                                { type: 'email', message: 'Enter valid mail address!' },
                            ]}
                        >
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="fax" label="Fax" className="col">
                            <Input disabled />
                        </Form.Item>
                    </div>

                    <div className="row m-0">
                        <Form.Item name="address" label="Address" className="col">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="country" label="Country" className="col">
                            <Select
                                showSearch
                                getPopupContainer={(trigger) => trigger.parentNode}
                                onChange={getStateDetails}
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
                                disabled
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
                                disabled
                            />
                        </Form.Item>
                    </div>
                    <div className="row m-0">
                        <Form.Item name="city" label="City" className="col">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item name="zip" label="Zip" className="col">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item className="col" />
                    </div>
                    <div className='row m-0'>
                        <Form.Item label="Uploaded Logo" name="uploadLogo" className="w-100 px-2 col">
                            {rowData?.iconpath?.startsWith('https:') && showImg ? (
                                <div className="row m-0">
                                    <Image className="col-auto ps-0" src={rowData?.iconpath?.startsWith('https:') ? rowData?.iconpath : ''} alt="account logo" width="auto" height="110px" />
                                </div>
                            ) : (
                                <div className='bg-light p-2 text-center mt-2'>Account logo not found</div>
                            )}
                        </Form.Item>
                        <Form.Item label="Uploaded Document" name="uploadBaa" className="w-100 px-2 col">
                            {rowData?.baa_docs?.length !== 0 && showImg1 ? (

                            <div className="d-flex flex-wrap row">
                                {rowData?.baa_docs?.map((item: any, index: any) => {
                                        return (
                                            <div className="d-flex p-2  bg-light justify-content-between mb-2" key={index}>
                                                <div className="col-md-10 my-auto text-break">{item.filename}</div>
                                                <div className="col-auto my-auto ms-auto">
                                                    <div className="px-2 py-1 pointer rounded-circle bg-ligtblue"
                                                        onClick={() => handleDownload(item.file_path, item.filename)}
                                                    >
                                                        <DownloadIcon />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div> 
                            ) : (
                                <div className='bg-light p-2 text-center mt-2'>No documents found</div>
                            )}
                        </Form.Item>
                        {downProgress && visible ? (
                            <Progress
                                percent={downProgress}
                                strokeColor={{
                                    '0%': '#1F98DF',
                                    '100%': '#87d068',
                                }}
                                format={customFormat}
                            />
                        ) : (
                            ''
                        )}
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default PreviewAccount;
