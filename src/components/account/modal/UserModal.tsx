import React, { useEffect, useState } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { Form, Input, Select, Radio } from 'components/shared/FormComponent';
import { validateConfirmPassword, passwordPattern } from 'components/shared/FormValidators';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { addUser } from 'services/actions/accountAction';
import { useLocation } from 'react-router-dom';
import { Button } from 'components/shared/ButtonComponent';
import { getUserRoles } from 'services/actions/securityAction';
import { myFunc } from 'components/shared/DropdownOption';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { getAllAccount } from 'services/actions/commonServiceAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
    callBackGrid: () => void;
    isAccount: any;
    accountID: any
}

const UserModal: React.FC<ChildProps> = ({ openModal, closeModal, rowData, callBackGrid, isAccount, accountID }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const dispatch = useDispatch();
    const options = myFunc();
    const userRole = sessionStorage.getItem('role');
    const { loading3 } = useSelector((state: any) => state.commonData);
    const { loading4, error4, success4 } = useSelector((state: any) => state.account);
    const { roleInfo, loading } = useSelector((state: any) => state.security);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success4 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg: any = showErrormsg ? error4 : false;
    const [status, setStatus] = useState(true);
    const [isAccUser, setIsAccUser] = useState(false);
    const [roleOptions, setRoleOptions] = useState([]);
    const [roleOptions1, setRoleOptions1] = useState([]);
    const [role, setRole] = useState('Account');
    const accountId = userRole === "staff" ? sessionStorage.getItem('accountid') : accountID;
    const url = window.origin;
    const accOptions: any = !loading4 ? options.accOptions : [];


    const handleSubmit = async () => {
        const roleArr = ['Accounts'];
        const value = await form.validateFields();
        roleArr.push(value.role);
        const inputJson1 = {
            userid: 0,
            username: value.email?.trim(),
            email: value.email?.trim(),
            first_name: value.firstName?.trim(),
            last_name: value.lastName?.trim(),
            password: 'x#gGj2ksls',
            password2: 'x#gGj2ksls',
            domain: url || '',
            accountid: !isAccount ? role === 'Account' ? Number(value.account): 0 : Number(accountId),
            groups: role === 'Account' ? (value.userrole === '0' ? ['Accounts'] : ['Accounts', value.userrole]) : value.userrole === '1000' ? [] : [value.userrole],
            mfa_enabled: value?.mfa,
        };
        const inputJson = {
            userid: rowData?.id || 0,
            username: value.email?.trim() || '',
            email: value.email?.trim() || '',
            first_name: value.firstName?.trim() || '',
            last_name: value.lastName?.trim() || '',
            is_active: status,
            accountid: !isAccount ? role === 'Account' ? Number(value.account): 0 : Number(accountId),
            groups: role === 'Account' ? (value.userrole === '0' ? ['Accounts'] : ['Accounts', value.userrole]) : value.userrole === '1000' ? [] : [value.userrole],
            mfa_enabled: value?.mfa,
        };
        const val = rowData ? inputJson : inputJson1;
        dispatch(addUser(val) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    useEffect(() => {
            dispatch(getAllAccount() as any);
    }, []);

    useEffect(() => {
        if (roleInfo?.data) {
            setRoleOptions([]);
            setRoleOptions1([]);
            const arr: any = [];
            let arr1: any = [];
            arr.push({ label: 'Account Admin', value: '0' });
            arr1.push({ label: 'Admin', value: '1000' });

            if (roleInfo?.data) {
                for (let i = 0; i < roleInfo?.data?.length; i++) {
                    if (roleInfo?.data[i]?.name?.toLowerCase() !== 'accounts') {
                        arr.push({
                            label: roleInfo?.data[i]?.name === 'billing' ? 'Billing' : roleInfo?.data[i]?.name === 'researcher' ? 'Researcher' : 'Technician',
                            value: roleInfo?.data[i]?.name,
                        });
                    }
                }
                arr1 = arr.map((item) => {
                    if (item.value === 'billing') {
                        return { ...item, label: 'Lab Billing' };
                    }
                    if (item.value === 'technician') {
                        return { ...item, label: 'Lab Technician' };
                    }
                    return item;
                });
                const filtArr1 = (arr || []).filter((item) => item.value !== '0');
                filtArr1.push({ label: 'Admin', value: '1000' });
                setRoleOptions(filtArr1);
                const filtArr = (arr1 || []).filter((item) => item.value !== 'researcher');
                setRoleOptions1(filtArr);
            }
        }
    }, [roleInfo]);

    useEffect(() => {
        if (successmsg) {
            message.success('User added successfully');
            setShowSuccessmsg(false);
            closeModal();
            callBackGrid();
            form.resetFields();
        }
        if (errormsg) {
            if (error4?.data) {
                // Format the error message
                const errorMessage = Object.entries(error4.data)
                    .map(([key, value]) => `${key}: ${(value as string[]).join(', ')}`)
                    .join('\n');
            
                message.error(errorMessage);
            } else {
                message.error("User couldn't be added");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const loadData = () => {
        form.setFieldsValue({
            email: rowData?.email || '',
            firstName: rowData?.first_name || '',
            lastName: rowData?.last_name || '',
            role: rowData?.groups[1] || '',
            account: rowData?.accountid?.toString() || '',
            mfa: rowData !== null ? rowData?.mfa_enabled : false,

        });
        if (!rowData?.is_active) {
            setStatus(false);
        } else {
            setStatus(true);
        }
        if (rowData?.groups[1] === 'billing' || rowData?.groups[1] === 'technician') {
            setIsAccUser(true);
        } else {
            setIsAccUser(false);
        }
        if (rowData && rowData.groups?.[0]) {
            const defaultGroup =
                rowData?.groups?.length === 0 ? '1000' : rowData?.groups?.length === 1 ? (rowData?.groups[0]?.toLowerCase() === 'accounts' ? '0' : rowData?.groups[0]) : rowData?.groups[1];
            if (defaultGroup === 'Accounts') {
                form.setFieldValue('userrole', 'Account Admin');
            } else {
                form.setFieldValue('userrole', defaultGroup);
            }
        }
        setRole(rowData?.is_superuser ? 'Admin' : 'Account');
    };

    useEffect(() => {
        dispatch(getUserRoles() as any);
    }, []);

    useEffect(() => {
        if(openModal){
            loadData();
        }
        
    }, [rowData,openModal]);

    const userOption = [
        { label: 'Account', value: 'Account' },
        { label: 'Admin', value: 'Admin' },
    ];

    return (
        <div>
            <Modal
                title={rowData ? 'Update User' : 'Add User'}
                confirmLoading={loading4}
                open={openModal}
                onCancel={() => {
                    closeModal();
                    setStatus(true);
                }}
                onOk={handleSubmit}
                okText={rowData ? 'Update' : 'Save'}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Form form={form} layout="vertical">
                    <Form.Item name="firstName" label="First name" rules={[{ required: true, message: 'This field is required!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="lastName" label="Last name" rules={[{ required: true, message: 'This field is required!' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'This field is required!' },
                            { type: 'email', message: 'Enter valid email address' },
                        ]}
                    >
                        <Input autoComplete="off" />
                    </Form.Item>
                    {(userRole === 'staff' || isAccount) ? "" : <Form.Item label="User type" className="w-100" rules={[{ required: true }]}>
                        <Radio.Group
                            options={userOption}
                            optionType="button"
                            buttonStyle="solid"
                            defaultValue={role}
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value);
                                form.setFieldsValue({ userrole: '', account: '' });
                            }}
                        />
                    </Form.Item>}
                    <Form.Item name="userrole" label="User role" rules={[{ required: true, message: 'This field is required!' }]}>
                        <Select
                            options={role === 'Admin' ? roleOptions : roleOptions1}
                            // onChange={(e) => {
                            //     form.setFieldsValue({ account: '' });
                            // }}
                        />
                    </Form.Item>
                    {!isAccount && userRole !== 'staff' && role !== "Admin" && (
                        <Form.Item name="account" label="Account" rules={[{ required: role === 'Account' ? true : false, message: 'This field is required!' }]}>
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
                    <div>
                        <Form.Item label="Is MFA Enabled" name="mfa" className="col w-100">
                            <Radio.Group name="radiogroup">
                                <Radio value={true}>Yes</Radio>
                                <Radio value={false}>No</Radio>
                            </Radio.Group>
                        </Form.Item>
                    </div>
                    {rowData ? (
                        <Form.Item name={rowData ? 'status' : ''} label={rowData ? 'Status' : ''} className="col">
                            {rowData ? (
                                <Button className={`${status ? 'acc-active-btn' : 'acc-inactive-btn'} w-100`} onClick={() => setStatus(!status)}>
                                    {status ? 'Active' : 'Inactive'}
                                </Button>
                            ) : (
                                ''
                            )}
                        </Form.Item>
                    ) : (
                        ''
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default UserModal;
