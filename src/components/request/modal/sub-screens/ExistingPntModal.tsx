import React, { useState, useEffect } from 'react';
import { Modal, Spin } from 'components/shared/AntComponent';
import { Input, Select, Form } from 'components/shared/FormComponent';
import { myFunc } from 'components/shared/DropdownOption';
import { Button } from 'components/shared/ButtonComponent';
import SearchIcon from 'assets/img/search.svg';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientList } from 'services/actions/patientAction';
import { Pagination } from 'antd';
import { LoadingOutlined } from 'components/shared/AntIcons';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    loadData: any;
    drawerCallbackFunc: any;
    accountId: any;
    isAdmin: any;
    isOpen: any;
}

const ExistingPntModal: React.FC<ChildProps> = ({ isOpen, openModal, closeModal, accountId, isAdmin, drawerCallbackFunc, loadData }) => {
    const [form] = Form.useForm();
    const options = myFunc();
    const dispatch = useDispatch();
    const [accID, setAccID] = useState('');
    const userRole=sessionStorage.getItem('role');
    const { userProfileInfo, success6, loading6, error6 } = useSelector((state: any) => state.auth);
    const { patientInfo, loading } = useSelector((state: any) => state.patient);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const pntList = loading ? [] : patientInfo?.PatientsDetail || [];
    const totalPage = loading ? 0 : patientInfo !== null && (accountId !== 0 ||userProfileInfo?.data?.account_id!==0)? patientInfo.DataFinder.totalrecords : 0;
    const [pageIndex, setPageIndex] = useState(1);
    const [searchValue, setSearchValue] = useState('');
    const [isBilling, setIsBilling]: any = useState(false);
    const [billingType, setBillingType]: any = useState('');

    function getPatientData(id: any, pageIndex: number, search: string) {
        const inputJson = {
            PntInput: { status: 'Active', acctid: id },
            DataFinder: { pagesize: 10, currentpage: pageIndex, sortbycolumn: '', sortby: 'asc', searchdata: search || '' },
        };
        dispatch(getPatientList(inputJson) as any);
    }

    const handleAccChange = (e: any) => {
        setAccID(e);
        setPageIndex(1);
        getPatientData(e, 1, searchValue);
        const item = options.accOptions?.find((item) => item.value == e);
        setIsBilling(item?.isBilling);
        setBillingType(item?.billingType);
    };

    const handleCloseDrawer = () => {
        drawerCallbackFunc(false, isBilling, billingType);
        form.resetFields();
        handleClose();
    };

    useEffect(() => {
        if (isAdmin) {
            if (accountId) {
                form.setFieldsValue({
                    account: Number(accountId) || '',
                });
            }
        } 
    }, [isOpen == true]);

    useEffect(()=>{
        if (userProfileInfo?.data && !isAdmin) {
            const val= userProfileInfo?.data;
            setAccID(val?.account_id);
            setPageIndex(1);
            getPatientData(val?.account_id, 1, searchValue);
            setIsBilling(val?.is_billing);
            setBillingType(val?.account_type);
        }
    },[userProfileInfo?.data]);

    const changePagination = (e: any) => {
        setPageIndex(e);
        getPatientData(accID, e, searchValue);
    };
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setSearchValue(e.target.value);
            setPageIndex(1);
            getPatientData(accID, 1, e.target.value);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setSearchValue('');
            setPageIndex(1);
            getPatientData(accID, 1, e.target.value);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        getPatientData(accID, 1, searchValue);
    };

    const handleClose = () => {
        closeModal();
        if(userRole === 'admin'){
            setAccID('');
        }
        setSearchValue('');
        form.setFieldsValue({
            account:  '',
        });
    };

    return (
        <div>
            <Modal title="Search Patient" open={openModal} onCancel={() => handleClose()} width={800}
            cancelButtonProps={{
                style: { backgroundColor: '#ff4242', color: 'white' }
            }}>
                <Form form={form} layout="vertical" autoComplete="off">
                    <div className="ex-pnt">
                        {isAdmin && (
                            <div className="col-md-6">
                                <Form.Item label=" Select Account" name="account">
                                    <Select
                                        showSearch
                                        className="w-100"
                                        value={accID}
                                        options={options.accOptions}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        optionFilterProp="children"
                                        onChange={(e) => handleAccChange(e)}
                                        filterOption={(input: any, option: any) => {
                                            return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                        }}
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
                            </div>
                        )}
                        <div className="mt-3">
                            <div className="d-flex">
                                <h6 className="my-auto text-dark">List of Patients</h6>
                                <div className="ms-auto">
                                    <Input
                                        prefix={<img src={SearchIcon} height="14px" onClick={searchbyBtn} />}
                                        defaultValue={searchValue}
                                        placeholder=" Search Patient"
                                        onKeyDown={(e) => handleSearch(e)}
                                        value={searchValue}
                                        disabled={!accID && isAdmin}
                                        onChange={(e) => setSearchValue(e.target.value)}
                                        onKeyUp={(e) => resetSearch(e)}
                                    />
                                </div>
                            </div>
                            <div className="bg-aliceblue existing-pnt-tbl-header p-3 mt-2 d-flex border">
                                <div className="col-md-2 my-auto">
                                    <h6 className="mb-0">Patient ID</h6>
                                </div>
                                <div className="col-md-5 my-auto">
                                    <h6 className="mb-0">Patient Name</h6>
                                </div>
                                <div className="col-md-2 my-auto">
                                    <h6 className="mb-0">DOB</h6>
                                </div>
                                <div className="col-md-2 my-auto">
                                    <h6 className="mb-0">Gender</h6>
                                </div>
                                <div className="col-1 text-center my-auto">
                                    <h6 className="mb-0">Action</h6>
                                </div>
                            </div>
                            <div className="terms-body existing-pnt-tbl-body">
                                <Spin spinning={loading} className="pt-5 mt-2" tip="Loading...">
                                    {accID &&
                                        pntList?.map((item: any) => {
                                            return (
                                                <div className="shadow-sm d-flex border my-2 p-3 " key={item.id}>
                                                    <div className="col-md-2 my-auto">{item.encoded_PatientNumber}</div>
                                                    <div className="col-md-5 my-auto">{item.first_name + ' ' + item.last_name}</div>
                                                    <div className="col-md-2 my-auto">{item.dob}</div>
                                                    <div className="col-md-2 my-auto">{item.gender}</div>
                                                    <div className="col-1 text-center">
                                                        <Button
                                                            type="primary"
                                                            onClick={(event) => {
                                                                loadData(item, item.id);
                                                                handleCloseDrawer();
                                                            }}
                                                        >
                                                            Select
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </Spin>
                                {accID && pntList?.length == 0 && !loading ? (
                                    <div>
                                        {accID ? (
                                            <div className="text-secondary shadow-sm d-flex border my-2 p-3 fs-14 text-center justify-content-center">No patients available</div>
                                        ) : (
                                            <div className="text-secondary shadow-sm d-flex border my-2 p-3 fs-14 text-center justify-content-center">Select Account to display patient</div>
                                        )}
                                    </div>
                                ) : accID == '' && !loading ? (
                                    <div className="text-secondary shadow-sm d-flex border my-2 p-3 fs-14 text-center justify-content-center">Select Account to display patient</div>
                                ) : (
                                    ''
                                )}
                            </div>

                            {totalPage !== 0 && accID ? (
                                <Pagination align="center" showSizeChanger={false} defaultCurrent={pageIndex} onChange={changePagination} total={totalPage} className="bg-light shadow-sm border-bottom p-2" />
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default ExistingPntModal;
