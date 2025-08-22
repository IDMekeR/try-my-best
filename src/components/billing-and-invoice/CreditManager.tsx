import React, { useState, useEffect } from 'react';
import { InputNumber } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { SettingFilled } from 'components/shared/AntIcons';
import 'assets/styles/form.scss';
import { useDispatch } from 'react-redux';
import { addSpecialPrice, getAccReportItems, getAccSpecialPrice } from 'services/actions/accountAction';
import { useSelector } from 'react-redux';
import { message, Spin, Tooltip } from 'components/shared/AntComponent';
import { getAccountWithCredit } from 'services/actions/billingAction';
import UpdateReportItem from './modal/UpdateReportItem';

const CreditManager: React.FC = () => {
    const [showEdit, setShowEdit] = useState(false);
    const { specialPriceInfo, loading6, success9, error9, loading9, loading7, reportItemInfo } = useSelector((state: any) => state.account);
    const { accCreditInfo, loading } = useSelector((state: any) => state.billing);
    const dispatch = useDispatch();
    const [crPrice, setCrPrice] = useState(0);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success9 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error9 : false;
    const reportData = loading7 ? [] : reportItemInfo?.data || [];
    const [openModal, setOpenModal] = useState(false);
    const [rowData, setRowData] = useState(null);

    function getCreditPrice() {
        dispatch(getAccSpecialPrice(0) as any);
    }

    useEffect(() => {
        if (specialPriceInfo?.data) {
            setCrPrice(Number(specialPriceInfo?.data?.creditprice));
        }
    }, [specialPriceInfo?.data]);

    function getReportItems() {
        dispatch(getAccReportItems(0) as any);
    }

    function getAccountCredit() {
        dispatch(getAccountWithCredit(0) as any);
    }

    useEffect(() => {
        getCreditPrice();
    }, []);

    useEffect(() => {
        getReportItems();
    }, []);

    useEffect(() => {
        getAccountCredit();
    }, []);

    const submitCreditPrice = () => {
        const inputJson = {
            accountid: 0,
            creditprice: crPrice.toString() || '',
        };
        dispatch(addSpecialPrice(inputJson) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };

    const handleChangePrice = (e: any) => {
        setCrPrice(e);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Credit price saved successfully');
            setShowSuccessmsg(false);
            getCreditPrice();
            setShowEdit(false);
        }
        if (errormsg) {
            message.error("Credit price couldn't be saved");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const showModal = (val: any) => {
        setOpenModal(true);
        setRowData(val);
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">Credit Settings</h5>
            </div>
            <div className="mt-2 row m-0 h-100 ">
                <div className="col-md-9 bg-white p-3 ">
                    <div className="section-title">
                        <h6 className="mb-1 p-2 fs-17">
                            <SettingFilled /> Price Configuration
                        </h6>
                    </div>
                    <div className="mt-3 mb-4">
                        <label className="fs-16 mb-1">
                            Cost per credit
                            <Tooltip title="Edit">
                                <span
                                    className={`${loading6 ? 'text-secondary' : 'text-success'} fs-12 edit-icon pointer`}
                                    onClick={() => {
                                        if (!loading6) {
                                            setShowEdit(!showEdit);
                                        }
                                    }}
                                >
                                    <EditIcon />
                                </span>
                            </Tooltip>
                        </label>
                        <div className="d-flex my-auto non-form-field">
                            <InputNumber prefix="$" className="w-25" value={crPrice} defaultValue={crPrice} disabled={!showEdit} onChange={handleChangePrice} />
                            {showEdit ? (
                                <Button type="primary" className="ms-2" loading={loading9} onClick={submitCreditPrice}>
                                    Save
                                </Button>
                            ) : (
                                ''
                            )}
                        </div>
                        <div className="ps-2 mt-3">
                            <span className="sm-txts">
                                <span className="text-danger">*</span> The above cost is applicable for only the accounts which does not have special amount and if the account is chosen for credit based billing.
                            </span>
                        </div>
                    </div>
                    <div className="section-title">
                        <h6 className="mb-1 p-2 fs-17">
                            <SettingFilled /> Credit Items
                        </h6>
                    </div>
                    <Spin spinning={loading7}>
                        <table className="table-bordered credit-table w-100 mt-3 ">
                            <thead>
                                <tr>
                                    <th className="p-2">Code</th>
                                    <th className="p-2">Credit Item</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2 text-center">Credit Value</th>
                                    <th className="p-2 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData
                                    ?.filter((itm: any) => itm.id !== 1)
                                    .map((item: any) => {
                                        return (
                                            <tr key={item.id}>
                                                <td className="p-2">{item.credit_code}</td>
                                                <td className="p-2">{item.credit_item}</td>
                                                <td className="p-2">{item.description}</td>
                                                <td className="p-2 text-center">{item.credit_Value}</td>
                                                <td className="p-2 text-center">
                                                    <Tooltip title="Edit">  
                                                        <span className="edit-icon text-success pointer" onClick={() => showModal(item)}>
                                                            <EditIcon />
                                                        </span>
                                                    </Tooltip>
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </Spin>
                </div>
                <div className="col-md-3 ps-3 pe-0">
                    <div className="bg-white right-card-border h-100">
                        <div className="bg-lightblue p-3">
                            <h6 className="text-center fs-17 my-auto">Account with credits</h6>
                        </div>
                        <div>
                            <Spin spinning={loading} className="text-center">
                                {accCreditInfo?.data?.map((item: any) => {
                                    return (
                                        <div key={item.accountid} className=" mb-2 p-2 border-bottom">
                                            <h6 className="text-secondary mb-1">{item.encoded_accountNumber}</h6>
                                            <div className="d-flex">
                                                <p className="col-md-7 mb-0 text-capitalize">{item.account_name}</p>
                                                <p className="fs-13 mb-0 text-success ps-2">
                                                    Available Credits: <span>{item.belance_credit}</span>
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </Spin>
                        </div>
                    </div>
                </div>
            </div>
            <UpdateReportItem openModal={openModal} rowData={rowData} handleClose={handleClose} getReportItems={getReportItems} />
        </div>
    );
};

export default CreditManager;
