import React, { useEffect, useState } from 'react';
import { Image, message, Modal, Upload } from 'components/shared/AntComponent';
import ImgCrop from 'antd-img-crop';
import { Button } from 'components/shared/ButtonComponent';
import { Form, Input, InputNumber, Select } from 'components/shared/FormComponent';
import { useSelector, useDispatch, url2 } from 'components/shared/CompVariables';
import { myFunc } from 'components/shared/DropdownOption';
import { formatter, parser, validatePhone } from 'components/shared/FormValidators';
import { CloseSquareOutlined, LoadingOutlined } from 'components/shared/AntIcons';
import { getState } from 'services/actions/commonServiceAction';
import { addAccount } from 'services/actions/accountAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
    callBackGrid: () => void;
}

const { Dragger } = Upload;

const AccountModal: React.FC<ChildProps> = ({ openModal, closeModal, rowData, callBackGrid }) => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { loading2, loading3 } = useSelector((state: any) => state.commonData);
    const { loading1, success1, error1 } = useSelector((state: any) => state.account);
    const options = myFunc();
    const stateOptions: any = !loading3 ? options.stateOptions : [];
    const countryOptions: any = !loading2 ? options.countryOptions : [];
    const [status, setStatus] = useState(true);
    const [showImg, setShowImg] = useState(false);
    const [fileList, setFileList]: any = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;

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
                AccountID: rowData?.id || 0,
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
                status: status ? 'Active' : 'InActive',
            };
            let file = '';
            if (fileList) {
                file = fileList[0]?.originFileObj;
            } else {
                file = '';
            }
            formData.append('File', file);
            formData.append('InputJson', JSON.stringify(inputJson));
            dispatch(addAccount(formData) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            if (rowData) {
                message.success('Account Updated Successfully');
            } else {
                message.success('Account Added successfully');
            }
            callBackGrid();
            handleClose();
        }
        if (errormsg) {
            setShowErrormsg(false);
            if (error1.data) {
                message.error(error1.data);
            } else {
                if (rowData) {
                    message.error("Account couldn't be updated");
                } else {
                    message.error("Account couldn't be added");
                }
            }
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

    return (
        <div>
            <Modal
                title={rowData ? 'Update Account' : 'Add Account'}
                confirmLoading={loading1}
                open={openModal}
                width={800}
                onCancel={handleClose}
                onOk={handleSubmit}
                okText={rowData ? 'Update' : 'Save'}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form layout="vertical" form={form}>
                    <div className="row m-0">
                        <Form.Item name="accountName" label="Account Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="firstName" label="First Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="lastName" label="Last Name" className="col" rules={[{ required: true, message: 'This field is required!' }]}>
                            <Input />
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
                            <InputNumber className="w-100" placeholder="(123) 456-7890" maxLength={14} formatter={formatter} parser={parser} />
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
                            <Input />
                        </Form.Item>
                        <Form.Item name="fax" label="Fax" className="col">
                            <Input />
                        </Form.Item>
                    </div>

                    <div className="row m-0">
                        <Form.Item name="address" label="Address" className="col">
                            <Input />
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
                            />
                        </Form.Item>
                        <Form.Item name="state" label="State" className="col">
                            {/* <Select options={stateOptions} /> */}
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
                    <div className="row m-0">
                        <Form.Item name="city" label="City" className="col">
                            <Input />
                        </Form.Item>
                        <Form.Item name="zip" label="Zip" className="col">
                            <Input />
                        </Form.Item>
                        {rowData ? (
                            <Form.Item name="status" label={rowData ? 'Status' : ''} className="col">
                                {rowData ? (
                                    <Button className={`${status ? 'acc-active-btn' : 'acc-inactive-btn'} w-100`} onClick={() => setStatus(!status)}>
                                        {status ? 'Active' : 'Inactive'}
                                    </Button>
                                ) : (
                                    ''
                                )}
                            </Form.Item>
                        ) : (
                            <Form.Item className="col" />
                        )}
                    </div>
                    <Form.Item label="Upload Logo" name="uploadLogo" className="w-100 px-2">
                        {rowData && showImg ? (
                            <div className="row m-0">
                                <Image className="col-auto ps-0" src={rowData?.iconpath ? rowData?.iconpath?.startsWith('https:') ? rowData?.iconpath : '' : ''} alt="account logo" width="150px" height="auto" />
                                <div className="col">
                                    <CloseSquareOutlined className="text-danger pointer" onClick={() => setShowImg(false)} />
                                </div>
                            </div>
                        ) : (
                            <ImgCrop aspectSlider showReset aspect={180 / 80} >
                                <Dragger
                                    {...props1}
                                    name="file"
                                    multiple={false}
                                    maxCount={1}
                                    beforeUpload={() => false}
                                    fileList={fileList || []}
                                    listType="picture-card"
                                    onChange={changeFile}
                                    accept={'.png,.jpg,.jpeg'}
                                >
                                    <p className="ant-upload-drag-icon"></p>
                                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                                    <p className="ant-upload-hint">Upload Logo here</p>
                                </Dragger>
                            </ImgCrop>
                        )}
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default AccountModal;
