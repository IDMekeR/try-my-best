import React, { useState, useEffect } from 'react';

import { Checkbox } from 'components/shared/FormComponent';
import { Popconfirm, message, Spin, Avatar } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getAccReportItems } from 'services/actions/accountAction';
import { getRequestCredit } from 'services/actions/accountAction';
import { addRequestCredit } from 'services/actions/accountAction';
import { getUserProfile } from 'services/actions/authAction';
import { EyeIcon } from 'assets/img/custom-icons';
import { useNavigate } from 'react-router-dom';
import { UserOutlined } from '@ant-design/icons';

interface ChildProps {
    data: any;
}

const ReportRate: React.FC<ChildProps> = ({ data }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = sessionStorage.getItem('role');
    const { menuInfo } = useSelector((state: any) => state.dashboard);
    const { userProfileInfo, success6, loading6, error6 } = useSelector((state: any) => state.auth);
    const { getReqCrd, success11, error11, loading11, success12, error12, loading7 } = useSelector((state: any) => state.account);
    const serviceReqID = location?.state?.serviceReqID ? location?.state?.serviceReqID : data?.saveOrder?.data?.servicerequestid;
    const accountId = userRole === 'staff' ? sessionStorage.getItem('accountid') : location?.state?.accountId ? location?.state?.accountId : data?.accountId;
    const [showsuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success11 : null;
    const [showErrmsg, setShowErrmsg] = useState(false);
    const errmsg = showErrmsg ? error11 : null;
    const [showsuccessmsg1, setShowsuccessmsg1] = useState(false);
    const successmsg1 = showsuccessmsg1 ? success12 : null;
    const [selectedItm, setSelectedItm]: any = useState([]);
    const [items1, setItems1] = useState([]);
    const [updateditm, setUpdatedItm]: any = useState([]);
    const billingType: any = data?.billingType == 'credit' || menuInfo?.billing_type == 'credit';
    const [totalCreditsUsed, setTotalCreditsUsed] = useState(0);
    const isUpdate = location?.state?.isUpdate;
    const [errormsg, setErrormsg] = useState('');
    const [validate, setValidate] = useState(0);
    const [selectedItems, setSelectedItems] = useState({
        NFB: data?.isNFBChecked,
        MED: data?.isMedChecked,
        RUSH: data?.isRushChecked,
    });
    const [openModal1, setOpenModal1] = useState(false);
    const [availableCredit, setAvailableCredit] = useState(0);
    const [defaultCredit, setDefaultCredit] = useState(0);
    const [accountDetail, setAccountDetail]: any = useState({});
    const [isBalanceUpd, setIsBalanceUpd] = useState(false);
    const [showsuccessmsg2, setShowsuccessmsg2] = useState(false);
    const successmsg2 = showsuccessmsg2 ? success6 : null;
    const [showErrmsg2, setShowErrmsg2] = useState(false);
    const errmsg2 = showErrmsg2 ? error6 : null;

    useEffect(() => {
        if (userProfileInfo?.data) {
            if (userProfileInfo?.data?.account_type === 'credit') {
                setValidate(userProfileInfo?.data?.balance_credit);
                if (Number(totalCreditsUsed) > Number(userProfileInfo?.data?.balance_credit)) {
                    setErrormsg(`Your available credit balance is ${validate}`);
                } else {
                    setErrormsg('');
                }
            }
        }
    }, [userProfileInfo]);

    useEffect(() => {
        if (data?.availableCredit && userRole == 'admin') {
            setAvailableCredit(data?.availableCredit);
        }
    }, [data?.availableCredit]);

    useEffect(() => {
        if (data?.accountDetail && userRole == 'admin') {
            setAccountDetail(data?.accountDetail);
        }
    }, [data?.accountDetail]);

    const getReqCredits = () => {
        dispatch(getRequestCredit(serviceReqID) as any);
        setShowsuccessmsg1(true);
    };

    useEffect(() => {
        const updatedSelectedItm: any = [];
        Object.keys(selectedItems)?.map((creditCode) => {
            if (selectedItems[creditCode]) {
                const selectedItem: any = items1?.find((item: any) => item?.credit_code === creditCode);
                if (selectedItem) {
                    updatedSelectedItm.push(selectedItem?.id);
                }
            }
        });
        const arr: any = [];

        const selectedItem: any = items1?.filter((item: any) => item?.req_associate || item?.is_default || item?.is_associate);
        selectedItem?.forEach((item: any) => arr.push(item.id));
        updatedSelectedItm?.forEach((item: any) => arr.push(item));

        setSelectedItm(arr);

        const updatedItems: any = items1?.map((item: any) => {
            if (selectedItems[item?.credit_code]) {
                return { ...item, is_checked: true };
            } else {
                return { ...item, is_checked: false };
            }
        });
        setUpdatedItm(updatedItems);
    }, [selectedItems, items1]);

    const updateSelectedItems = () => {
        const newSelectedItems: any = { ...selectedItems };

        items1?.map((item: any) => {
            if (
                (item?.credit_code === 'NFB' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'MED' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'RUSH' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'SUP' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'IPR' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'LFS' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'RPT' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'PBM' && item?.req_associate == true && !item?.is_associate) ||
                (item?.credit_code === 'IMG' && item?.req_associate == true && !item?.is_associate)
            ) {
                newSelectedItems[item.credit_code] = item.req_associate;
            }
        });
        const updatedItems: any = items1?.map((item: any) => {
            if (newSelectedItems[item?.credit_code]) {
                return { ...item, is_checked: true };
            } else {
                return { ...item, is_checked: false };
            }
        });
        setUpdatedItm(updatedItems);
        setSelectedItems(newSelectedItems);
    };

    useEffect(() => {
        if (isUpdate) {
            updateSelectedItems();
        }
    }, [isUpdate, items1]);

    useEffect(() => {
        calculateTotalCreditsUsed();
    }, [updateditm]);

    const calculateTotalCreditsUsed = () => {
        let total = 0;
        updateditm?.forEach((item) => {
            if (item.is_checked || item.req_associate || item.is_default || item.is_associate) {
                total += item.credit_Value;
            }
        });
        setTotalCreditsUsed(total);
    };

    useEffect(() => {
        calculateTotalCreditsUsed();
    }, [updateditm]);

    useEffect(() => {
        getReqCredits();
    }, [data?.isSuccess == true, location?.state?.serviceReqID]);

    useEffect(() => {
        if (successmsg1) {
            setItems1(getReqCrd?.data);
            setShowsuccessmsg1(false);
        }
    }, [successmsg1]);

    useEffect(() => {
        if (successmsg) {
            setShowsuccessmsg(false);
            if (location?.state?.accountId && location?.state?.serviceReqID) {
                message.success('Report Item Updated Successfully');
                navigate('/view-request');
            } else {
                data?.callbackReport(true, totalCreditsUsed);
            }
        }
        if (errmsg) {
            message.error(errmsg?.message);
            setShowErrmsg(false);
        }
    }, [successmsg, errmsg]);

    function addReqCredit() {
        const newArr: any[] = [];
        selectedItm.forEach((item: any) => {
            if (newArr.indexOf(item) === -1) {
                newArr.push(item);
            }
        });
        const inputJson = {
            accountid: accountId,
            servicerequestid: serviceReqID,
            creditids: newArr,
        };
        dispatch(addRequestCredit(inputJson) as any);
        setShowsuccessmsg(true);
        setShowErrmsg(true);
    }

    const handleRateChange = (item) => {
        const isChecked = !selectedItm?.includes(item?.id);
        if (isChecked) {
            setSelectedItm((prevItems) => [...prevItems, item?.id]);
            setTotalCreditsUsed((prevTotalCredits) => prevTotalCredits + item?.credit_Value);
            const total = Number(totalCreditsUsed) + Number(item?.credit_Value);
            if (Number(total) > Number(validate)) {
                setErrormsg(`Your available credit balance is ${validate}`);
            } else {
                setErrormsg('');
            }
        } else {
            setSelectedItm((prevItems) => prevItems?.filter((id) => id !== item?.id));
            setTotalCreditsUsed((prevTotalCredits) => prevTotalCredits - item?.credit_Value);
            const total = Number(totalCreditsUsed) - Number(item.credit_Value);
            if (Number(total) > Number(validate)) {
                setErrormsg(`Your available credit balance is ${validate}.`);
            } else {
                setErrormsg('');
            }
        }
    };

    const submitReport = () => {
        addReqCredit();
    };

    const getStatusIndicator = () => {
        if (Number(availableCredit) < Number(totalCreditsUsed)) {
            if (userRole == 'admin') {
                return (
                    <span className="text-white fw-bold ms-2 bg-warning p-2">
                        &nbsp;Insufficient credit. Available balance for {accountDetail?.label} is {availableCredit}. Charges will be applied upon submitting this request.
                    </span>
                );
            } else if (userRole == 'staff') {
                return <span className="text-white fw-bold ms-2 bg-warning p-2">Insufficient credit. Available balance: {availableCredit}. Please buy more to proceed.</span>;
            }
        } else if (Number(availableCredit) === Number(totalCreditsUsed)) {
            if (userRole == 'admin') {
                return (
                    <span className="text-white fw-bold ms-2 bg-danger p-2 ">
                        &nbsp;Warning: Available credit only covers the default report. Available balance for {accountDetail?.label} is {availableCredit}. Extra charges will be incurred for
                        additional reports.
                    </span>
                );
            } else if (userRole == 'staff') {
                return (
                    <span className="text-white fw-bold ms-2 bg-danger p-2 ">
                        &nbsp;Warning: Available credit only covers the default report. Available balance: {availableCredit}. Additional items can&apos;t be saved.
                    </span>
                );
            }
        }
        return null;
    };

    const closeModal = () => {
        setOpenModal1(false);
    };

    function getUser() {
        const inputJson = {
            userid: Number(sessionStorage.getItem('userid')),
        };
        dispatch(getUserProfile(inputJson) as any);
        setShowsuccessmsg2(true);
        setShowErrmsg2(true);
    }

    const getDefaultCredit = () => {
        dispatch(getAccReportItems(accountId) as any);
    };

    useEffect(() => {
        getDefaultCredit();
        if (userRole !== 'admin') {
            getUser();
        }
    }, [accountId]);

    useEffect(() => {
        const totalDefaultCreditValue = getReqCrd?.data?.filter((item) => item?.is_associate || item?.is_default)?.reduce((acc, item) => acc + item?.credit_Value, 0);

        setDefaultCredit(totalDefaultCreditValue);
    }, [getReqCrd]);

    useEffect(() => {
        if (userProfileInfo?.data && userRole != 'admin') {
            setAvailableCredit(userProfileInfo?.data?.total_credit - userProfileInfo?.data?.usedcredits);
        }
    }, [userProfileInfo]);

    const handleConfirm = () => {
        submitReport();
    };

    useEffect(() => {
        if (successmsg2) {
            setShowsuccessmsg2(false);
            setIsBalanceUpd(false);
        } else if (errmsg2) {
            setShowErrmsg2(false);
            setIsBalanceUpd(false);
        }
    }, [successmsg2, errmsg2]);
    // console.log("updateitmd", updateditm?.filter((item: any) => !item.is_checked && !item.is_associate && !item.is_default).reduce((sum: number, item: any) => sum + Number(item.credit_Value), 0));
    return (
        <div className=" m-0 report_rate_style ">
            <div className="d-flex p-3 pb-2 ">
                <div className="d-flex grid-title-card">
                    <h5 className="my-auto "> Credits & Pricing </h5>
                    {billingType && availableCredit <= totalCreditsUsed && (
                        <>
                            <div className="mx-auto mt-2 ms-5">{getStatusIndicator()}</div>
                        </>
                    )}
                </div>
                {
                    userRole === "staff" &&
                    <div className="ms-auto d-flex">
                        <Button type="primary"
                            onClick={() => {
                                navigate('/view-request')
                            }}
                        >Back</Button>
                    </div>
                }
            </div>
            <div className="row m-0 px-0">
                <Spin spinning={loading6 || isBalanceUpd || loading7} className="px-0" style={{ padding: '0px' }}>
                    <div className="d-flex px-0">
                        <div className="Report-rate-table p-3 bg-white col ">
                            <div className="  my-3">
                                <span className="message">The report items which will be added in the request&#39;s report: </span>
                            </div>

                            <div className="text-center message d-flex mb-2 ms-0 ">
                                <div className="pt-1">
                                    <span className="message">
                                        <strong>Default report items: </strong>
                                    </span>
                                </div>
                            </div>

                            <table className="w-100 mb-4 table-bordered edf-step-header ">
                                <thead>
                                    <tr>
                                        <th className="p-2 ps-3 ">Item</th>
                                        <th className="p-2 ps-3">Description</th>
                                        {billingType && <th className="p-2 ps-3 text-center">Credit Value</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading6 ? (
                                        updateditm && updateditm.filter((item) => (item?.is_default || item?.is_associate) && item?.credit_code !== 'RPT').length > 0 ? (
                                            updateditm
                                                ?.filter((item) => (item?.is_default || (item?.is_associate && (item.is_admin_associate || item.req_associate))) && item?.credit_code !== 'RPT')
                                                ?.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 ps-3" style={{ width: '25%' }}>
                                                            {item?.credit_item}
                                                        </td>
                                                        <td className="p-2 ps-3" style={{ width: billingType ? '60%' : '100%' }}>
                                                            {item?.credit_Descrisption ? item?.credit_Descrisption : '-'}
                                                        </td>
                                                        {billingType && (
                                                            <td className="p-2 ps-3 text-center " style={{ width: '15%' }}>
                                                                {item?.credit_Value}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan={billingType ? 3 : 2} className="text-center p-3">
                                                    No Default report items found.
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={billingType ? 3 : 2} className="text-center">
                                                <Spin className="h-100 d-flex justify-content-center align-items-center p-3" />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="text-center message d-flex mb-2 ms-0 ">
                                <div className="pt-1">
                                    <span className="message">
                                        <strong>Additional report items: </strong>
                                    </span>
                                </div>
                            </div>

                            <table className="w-100 mb-4 table-bordered edf-step-header">
                                <thead>
                                    <tr>
                                        <th className="p-2 ps-3 ">Item</th>
                                        <th className="p-2 ps-3">Description</th>
                                        {billingType && <th className="p-2 ps-3 text-center">Credit Value</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {!loading6 ? (
                                        updateditm && updateditm?.filter((item) => !item?.is_default && !item?.is_associate).length > 0 ? (
                                            updateditm
                                                ?.filter((item) => (!item?.is_default && !item?.is_associate) || (item.is_associate && (!item.req_associate)))
                                                ?.map((item, i) => (
                                                    <tr key={i}>
                                                        <td className="p-2 ps-3 " style={{ width: '25%' }}>
                                                            <Checkbox onChange={() => handleRateChange(item)} defaultChecked={item?.is_checked} disabled={isUpdate ? item?.is_checked : false}>
                                                                {item?.credit_item}
                                                            </Checkbox>
                                                        </td>
                                                        <td className="p-2 ps-3 " style={{ width: billingType ? '60%' : '100%' }}>
                                                            {item?.credit_Descrisption ? item?.credit_Descrisption : '-'}
                                                        </td>
                                                        {billingType && (
                                                            <td className="p-2 ps-3 text-center " style={{ width: '15%' }}>
                                                                {item?.credit_Value}
                                                            </td>
                                                        )}
                                                    </tr>
                                                ))
                                        ) : (
                                            <tr>
                                                <td colSpan={billingType ? 3 : 2} className="text-center p-3">
                                                    No report items found.
                                                </td>
                                            </tr>
                                        )
                                    ) : (
                                        <tr>
                                            <td colSpan={billingType ? 3 : 2} className="text-center">
                                                <Spin className="h-100 d-flex justify-content-center align-items-center p-3" />
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            {billingType && (
                                <div className="mb-4">
                                    <table className="w-100">
                                        <tbody>
                                            <tr>
                                                <td colSpan={2} className=" pe-2 border-0  fw-bold text-end">
                                                    Total Credit Used:
                                                </td>
                                                <td className="p-2 ps-3 text-center border" style={{ width: '15%' }}>
                                                    {totalCreditsUsed}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            <div className="row mx-0 my-3  w-100">
                                {userRole === 'admin' && availableCredit <= defaultCredit && billingType ? (
                                    <Popconfirm
                                        title={`Available balance for ${accountDetail?.label} is ${availableCredit}. Charges will be applied upon submission.`}
                                        description="Do you still want to proceed?"
                                        onConfirm={handleConfirm}
                                        okText="Yes"
                                        cancelText="No"
                                    >
                                        <Button type="primary" className="col-auto ms-auto" loading={loading11}>
                                            Submit
                                        </Button>
                                    </Popconfirm>
                                ) : (
                                    <Button type="primary" className="col-auto ms-auto" disabled={userRole == 'staff' && billingType && errormsg} loading={loading11} onClick={submitReport}>
                                        Submit
                                    </Button>
                                )}
                            </div>
                        </div>
                        {location?.state?.details && (
                            <div className="col-md-3 ms-2">
                                <div className="p-3 bg-white">
                                    <div className="ms-0 p-0">
                                        <div className="row bg-light m-0 h-100 pt-2 d-flex align-items-center justify-content-center imageCont">
                                            <Avatar size={120} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                                            <div className="text-center mt-2 mb-2 pt-1 ">
                                                <h6 className="text-center text-capitalize information mt-2">{location?.state?.details?.patient_name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div className=" d-flex flex-column mt-3 p-1">
                                        <div className="col ">
                                            <label className=" mb-0 fw-bold">Request #</label>
                                            <p className="information">{location?.state?.details?.encoded_RequestNumber || location?.state?.details?.encoded_request_number || '---'}</p>
                                        </div>
                                        <div className="col ">
                                            <label className=" mb-0 fw-bold">Request Type</label>
                                            <p className="information">{location?.state?.details?.request_type || '---'} </p>
                                        </div>
                                        <div className="col">
                                            <label className=" mb-0 fw-bold"> Request Status</label>
                                            <p className="information">
                                                {location?.state?.details?.status === 'On Review' || location?.state?.details?.status === 'acknowledged'
                                                    ? 'Acknowledged'
                                                    : location?.state?.details?.status == 'Request Init' && location?.state?.details?.is_active == true
                                                        ? 'Submitted'
                                                        : location?.state?.details?.status == 'Request Init' && location?.state?.details?.is_active == false
                                                            ? 'Patient Submitted'
                                                            : location?.state?.details?.status}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </Spin>
            </div>
        </div>
    );
};

export default ReportRate;
