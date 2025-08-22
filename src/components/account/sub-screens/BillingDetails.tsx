import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { addAccReportItems, addSpecialPrice, getAccBillingType, getAccReportItems, getAccSpecialPrice, saveAccBillingType, saveCardDetails } from 'services/actions/accountAction';
import { useLocation } from 'react-router-dom';
import { Input, Form, Checkbox, Radio } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Tooltip, Popconfirm, message, Spin } from 'components/shared/AntComponent';
import { DeleteFilled } from 'components/shared/AntIcons';
import { EditIcon } from 'assets/img/custom-icons';
import 'assets/styles/form.scss';
import AccReportItemModal from '../modal/AccReportItemModal';

const BillingDetails: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const {
        billingTypeInfo,
        specialPriceInfo,
        reportItemInfo,
        loading5,
        success5,
        error5,
        loading6,
        loading7,
        loading8,
        success8,
        error8,
        success9,
        loading9,
        error9,
        success10,
        error10,
        success13,
        error13,
        loading13,
        cardInfo,
    } = useSelector((state: any) => state.account);
    const [form1] = Form.useForm();
    const [form2] = Form.useForm();
    const userRole = sessionStorage.getItem('role');
    const [billingType, setBillingType]: any = useState('none');
    const [invoiceTerm, setInvoiceTerm] = useState(0);
    const [specialPrice, setSpecialPrice] = useState(0);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success8 : false;
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const errormsg = showErrorMsg ? error8 : false;
    const [showEdit, setShowEdit] = useState(false);
    const [showPrice, setShowPrice] = useState(false);
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success9 : false;
    const [showErrorMsg1, setShowErrorMsg1] = useState(false);
    const errormsg1 = showErrorMsg1 ? error9 : false;
    //update report items
    const [showSuccessmsg2, setShowSuccessmsg2] = useState(false);
    const successmsg2 = showSuccessmsg2 ? success10 : false;
    const [showErrorMsg2, setShowErrorMsg2] = useState(false);
    const errormsg2 = showErrorMsg2 ? error10 : false;
    const [openModal, setOpenModal] = useState(false);
    const [selectedItems, setSelectedItems]: any = useState([]);
    const [payVia, setPayVia] = useState('');
    const [autoPayment, setAutoPayment] = useState(false);
    const [invoiceCycle, setInvoiceCycle] = useState('2 Weeks');
    const accountID = sessionStorage.getItem('accountid');
    const [showSuccessmsg3, setShowSuccessmsg3] = useState(false);
    const successmsg3 = showSuccessmsg3 ? success5 : null;
    const [showSuccessmsg4, setShowSuccessmsg4] = useState(false);
    const successmsg4 = showSuccessmsg4 ? success13 : null;
    const [showErrormsg4, setShowErrormsg4] = useState(false);
    const errormsg4 = showErrormsg4 ? error13 : null;
    const [email, setEmail] = useState('');
    const [totalCredit, setTotalCredit] = useState(0);

    const getTotalCredit = () => {
        let total = 0;
        reportItemInfo?.data?.forEach((item) => {
            if (item?.is_associate || item?.is_default) {
                total += item?.credit_Value;
            }
        });
        setTotalCredit(total);
    };

    useEffect(() => {
        getTotalCredit();
    }, [reportItemInfo]);

    function getBillingType() {
        if (userRole === 'staff') {
            const id = Number(accountID);
            dispatch(getAccBillingType(id) as any);
            setShowSuccessmsg3(true);
        } else {
            dispatch(getAccBillingType(location?.state?.accountid) as any);
            setShowSuccessmsg3(true);
        }
    }

    function getSpecialPrice() {
        if (userRole === 'staff') {
            const id = Number(accountID);
            dispatch(getAccSpecialPrice(id) as any);
        } else {
            dispatch(getAccSpecialPrice(location?.state?.accountid) as any);
        }
    }

    function getReportItems() {
        if (userRole === 'staff') {
            const id = Number(accountID);
            dispatch(getAccReportItems(id) as any);
        } else {
            dispatch(getAccReportItems(location?.state?.accountid) as any);
        }
    }

    const handlePayChange = (e: any) => {
        setPayVia(e.target.value);
    };

    useEffect(() => {
        if (specialPriceInfo?.data) {
            setSpecialPrice(Number(specialPriceInfo?.data?.creditprice));
        }
    }, [specialPriceInfo?.data]);

    const handleTypeChange = (e: any) => {
        setBillingType(e.target.value);
    };

    const handleInvoiceChange = (e: any) => {
        setInvoiceTerm(e.target.value);
    };

    const submitBillingType = async () => {
        try {
            await form2.validateFields();
            const values = form2.getFieldsValue();
            const inputJson = {
                account_id: location?.state?.accountid,
                billing_type: billingType,
                billing_period: billingType === 'invoice' ? invoiceTerm : 0,
                is_autopay: autoPayment || false,
                autopayment_type: values?.payVia,
                bill_email: values?.email,
            };
            dispatch(saveAccBillingType(inputJson) as any);
            setShowSuccessmsg(true);
            setShowErrorMsg(true);
        } catch (errorinfo: any) {
            console.log('Failed:', errorinfo);
        }
    };
    useEffect(() => {
        if (reportItemInfo?.data) {
            setSelectedItems([]);
            const arr: any = [];
            const rowData = reportItemInfo?.data;
            for (let i = 0; i < rowData?.length; i++) {
                if (rowData[i].is_associate) {
                    arr.push(rowData[i].id);
                }
            }
            setSelectedItems(arr);
        }
    }, [reportItemInfo?.data]);

    const onFinish = async (values) => {
        try {
            await form1.validateFields();
            const values = form1.getFieldsValue();
            const inputJson = {
                account_id: Number(location?.state?.accountid),
                billing_type: values?.billingOption,
                billing_period: values?.billingOption === 'invoice' ? values?.invoiceTerm : 0,
                is_autopay: autoPayment || false,
                autopayment_type: billingTypeInfo?.data[0]?.autopayment_type,
                bill_email: billingTypeInfo?.data[0]?.bill_email,
            };
            dispatch(saveAccBillingType(inputJson) as any);
            setShowSuccessmsg(true);
            setShowErrorMsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const onFinishAccount = async (values) => {
        try {
            await form2.validateFields();
            const values = form2.getFieldsValue();
            const inputJson = {
                account_id: Number(accountID),
                billing_type: billingTypeInfo?.data[0]?.billing_type === null ? 'none' : billingTypeInfo?.data[0]?.billing_type === '' ? 'none' : billingTypeInfo?.data[0]?.billing_type,
                billing_period: billingTypeInfo?.data[0]?.billing_type === 'invoice' ? billingTypeInfo?.data[0]?.invoice_period : 0,
                is_autopay: autoPayment || false,
                autopayment_type: values?.payOption,
                bill_email: values?.email,
            };
            dispatch(saveAccBillingType(inputJson) as any);
            setShowSuccessmsg(true);
            setShowErrorMsg(true);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    useEffect(() => {
        if (successmsg3) {
            if (billingTypeInfo?.data?.[0]) {
                form1.setFieldsValue({
                    billingOption:
                        billingTypeInfo?.data?.[0]?.billing_type == null ? 'none' : billingTypeInfo?.data?.[0]?.billing_type === '' ? 'none' : billingTypeInfo?.data?.[0]?.billing_type,
                    invoiceTerm:
                        billingTypeInfo?.data?.[0]?.invoice_period == null ? 30 : billingTypeInfo?.data?.[0]?.invoice_period === '' ? 30 : billingTypeInfo?.data?.[0]?.invoice_period,
                    invoiceCycle: invoiceCycle,
                });
                form2.setFieldsValue({
                    payOption:
                        billingTypeInfo?.data[0]?.autopayment_type == null
                            ? 'card'
                            : billingTypeInfo?.data[0]?.autopayment_type === ''
                              ? 'card'
                              : billingTypeInfo?.data[0]?.autopayment_type === 'none'
                                ? 'card'
                                : billingTypeInfo?.data[0]?.autopayment_type,
                    email: billingTypeInfo?.data[0]?.bill_email,
                });
                const billingType =
                    billingTypeInfo?.data?.[0]?.billing_type === null ? 'none' : billingTypeInfo?.data?.[0]?.billing_type === '' ? 'none' : billingTypeInfo?.data?.[0]?.billing_type;
                const billingTerm =
                    billingTypeInfo?.data?.[0]?.invoice_period == null ? 30 : billingTypeInfo?.data?.[0]?.invoice_period === '' ? 30 : billingTypeInfo?.data?.[0]?.invoice_period;
                const payType =
                    billingTypeInfo?.data?.[0]?.autopayment_type == null
                        ? 'card'
                        : billingTypeInfo?.data?.[0]?.autopayment_type === ''
                          ? 'card'
                          : billingTypeInfo?.data?.[0]?.autopayment_type === 'none'
                            ? 'card'
                            : billingTypeInfo?.data?.[0]?.autopayment_type;
                setInvoiceTerm(billingTerm);
                setBillingType(billingType);
                setPayVia(payType);
                setShowSuccessmsg3(false);
                setAutoPayment(billingTypeInfo?.data?.[0]?.is_autopay);
                setEmail(billingTypeInfo?.data?.[0]?.bill_email);
            }
        }
    }, [successmsg3]);

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('Billing details saved successfully');
            setShowSuccessmsg(false);
            getBillingType();
            setShowEdit(false);
            if (userRole === 'staff') {
                savePaymentInfo();
            }
        }
        if (errormsg) {
            message.error("Billing details couldn't be saved");
            setShowErrorMsg(false);
        }
    }, [successmsg, errormsg]);

    const savePaymentInfo = () => {
        const protocol = window.location.protocol;
        const port = window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
        const success = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/autopay-success`;
        const error = `${protocol}//${window.location.hostname}${port ? ':' + port : ''}/autopay-error`;

        const inputJson = {
            accountid: location?.state?.accountID,
            payment_method_type: payVia,
            paymentemail: email,
            success_url: success,
            cancel_url: error,
        };
        dispatch(saveCardDetails(inputJson) as any);
        setShowSuccessmsg4(true);
        setShowErrormsg4(true);
    };

    useEffect(() => {
        if (successmsg4) {
            window.location.href = cardInfo?.url;
        }
        if (errormsg4) {
            message.success("Card details can't be updated");
            setShowSuccessmsg4(false);
            setShowErrormsg4(false);
        }
    }, [successmsg4, errormsg4]);

    const submitSpecialPrice = () => {
        const inputJson = {
            accountid: location?.state?.accountid,
            creditprice: specialPrice?.toString() || '',
        };
        dispatch(addSpecialPrice(inputJson) as any);
        setShowErrorMsg1(true);
        setShowSuccessmsg1(true);
    };

    useEffect(() => {
        if (successmsg1) {
            message.success('Special price saved successfully');
            setShowSuccessmsg1(false);
            getSpecialPrice();
            setShowPrice(false);
        }
        if (errormsg1) {
            message.error("Special price couldn't be saved");
            setShowErrorMsg1(false);
        }
    }, [successmsg1, errormsg1]);

    const showModal = () => {
        if (!loading7) {
            setOpenModal(true);
        }
    };

    const handleClose = () => {
        setOpenModal(false);
    };

    const callBackFunc = (val: any) => {
        setSelectedItems(val);
    };

    const submitFunc = (val: any) => {
        const inputJson = {
            accountid: location?.state?.accountid,
            creditids: val || selectedItems,
        };
        dispatch(addAccReportItems(inputJson) as any);
        setShowErrorMsg2(true);
        setShowSuccessmsg2(true);
    };

    useEffect(() => {
        if (successmsg2) {
            message.success('Report Items updated Successfully');
            setShowSuccessmsg2(false);
            getReportItems();
            handleClose();
        }
        if (errormsg2) {
            message.error("Report Items couldn't be updated");
            setShowErrorMsg2(false);
        }
    }, [successmsg2, errormsg2]);

    useEffect(() => {
        getBillingType();
    }, [dispatch]);

    useEffect(() => {
        getSpecialPrice();
    }, [dispatch]);

    useEffect(() => {
        getReportItems();
    }, [dispatch]);

    const removeCredit = (id: any) => {
        let val = [...selectedItems];
        val = selectedItems.filter((item: any) => item !== id);
        setSelectedItems(val);
        submitFunc(val);
    };

    return (
        <div className="row m-0">
            {(userRole !== 'staff' || billingTypeInfo?.data[0]?.is_autopay === true) && (
                <div className="col-md-6 pt-0">
                    <h6 className={`${userRole === 'staff' ? 'mt-2 mb-3' : 'my-auto pb-1'}`}>
                        Billing Details
                        {userRole !== 'staff' ? (
                            <span
                                className={`${loading5 ? 'text-secondary' : 'text-success'} fs-12 edit-icon pointer`}
                                onClick={() => {
                                    if (!loading5) {
                                        setShowEdit(!showEdit);
                                    }
                                }}
                            >
                                <EditIcon />
                            </span>
                        ) : (
                            ''
                        )}
                    </h6>

                    {userRole == 'admin' ? (
                        <Spin spinning={loading5}>
                            <Form form={form1} onFinish={onFinish} layout="vertical">
                                <div className="biliing-pref bg-aliceblue border p-2 mb-3">
                                    <div>
                                        <div className=" p-1">
                                            <Form.Item name="billingOption" label="Billing Preference" className="mb-0 fw-bold">
                                                <Radio.Group className="fw-normal" onChange={handleTypeChange} defaultValue={billingType} value={billingType} disabled={!showEdit}>
                                                    <Radio value="credit" className="fs-15">
                                                        Credit
                                                    </Radio>
                                                    <Radio value="invoice" className="fs-15">
                                                        Invoice
                                                    </Radio>
                                                    <Radio value="none" className="fs-15">
                                                        None
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                        {billingType === 'invoice' && (
                                            <>
                                                <div className="invoice-term">
                                                    <div className=" p-1">
                                                        <Form.Item name="invoiceTerm" label="Invoice Terms" className="mb-0 fw-bold">
                                                            <Radio.Group className="fw-normal" onChange={handleInvoiceChange} value={invoiceTerm} disabled={!showEdit}>
                                                                <Radio value={30} className="fs-15">
                                                                    30 days
                                                                </Radio>
                                                                <Radio value={60} className="fs-15">
                                                                    60 days
                                                                </Radio>
                                                                <Radio value={0} className="fs-15">
                                                                    Upon received
                                                                </Radio>
                                                            </Radio.Group>
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className="invoice-period ">
                                                    <div className=" p-1">
                                                        <Form.Item name="invoiceCycle" label="Invoice Cycle" className="mb-0 fw-bold ">
                                                            <Input value="2 Weeks" className="w-25" readOnly />
                                                        </Form.Item>
                                                    </div>
                                                </div>
                                                <div className="invoice-period">
                                                    <div className="p-1">
                                                        <Checkbox
                                                            className="fw-normal"
                                                            checked={autoPayment}
                                                            defaultChecked={autoPayment}
                                                            onChange={(e) => setAutoPayment(e.target.checked)}
                                                            disabled={!showEdit}
                                                        >
                                                            Enable auto payment
                                                        </Checkbox>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                    <div className="d-flex justify-content-end ">
                                        {showEdit ? (
                                            <Button loading={loading8} type="primary" htmlType="submit" className="mb-0">
                                                Save
                                            </Button>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                            </Form>
                        </Spin>
                    ) : (
                        <Spin spinning={loading5}>
                            <Form form={form2} onFinish={onFinishAccount} layout="vertical">
                                <div className="biliing-pref bg-aliceblue border  p-2">
                                    <div>
                                        <div className="p-1">
                                            <Form.Item name="payOption" label="Pay Via" className="mb-0 fw-bold" rules={[{ required: true, message: 'This field is required' }]}>
                                                <Radio.Group className="fw-normal" onChange={handlePayChange} value={payVia}>
                                                    <Radio value="card" className="fs-15">
                                                        Credit Card
                                                    </Radio>
                                                    <Radio value="us_bank_account" className="fs-15">
                                                        ACH
                                                    </Radio>
                                                    <Radio value="cashapp" className="fs-15">
                                                        Cash App
                                                    </Radio>
                                                </Radio.Group>
                                            </Form.Item>
                                        </div>
                                        <div className="p-1 col-6">
                                            <Form.Item className="fw-bold" name="email" label="Email" rules={[{ type: 'email', required: true, message: 'The email is not valid' }]}>
                                                <Input onChange={handleEmailChange} />
                                            </Form.Item>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end ">
                                        {userRole == 'admin' ? (
                                            <Form.Item className="mb-0">
                                                <Button loading={loading8} type="primary" htmlType="submit" className="mb-0">
                                                    Save
                                                </Button>
                                            </Form.Item>
                                        ) : (
                                            <Popconfirm
                                                title="Save Payment Detail"
                                                description="Do you want to save the payment details? By confirming, you will be redirected to Stripe"
                                                onConfirm={onFinishAccount}
                                                okText="Yes"
                                                cancelText="No"
                                            >
                                                <Button loading={loading8} type="primary" className="mb-0">
                                                    Save
                                                </Button>
                                            </Popconfirm>
                                        )}
                                    </div>
                                </div>
                            </Form>
                        </Spin>
                    )}

                    {billingType === 'none' || billingType === null || billingType === undefined 
                        ? ''
                        : userRole !== 'staff' && (
                              <>
                                  <h6>
                                      Special price per credit
                                      <span
                                          className={`${loading6 ? 'text-secondary' : 'text-success'} fs-12 edit-icon pointer`}
                                          onClick={() => {
                                              if (!loading6) {
                                                    setShowPrice(!showPrice);
                                              }
                                          }}
                                      >
                                          <EditIcon />
                                      </span>
                                  </h6>
                                  <Spin spinning={loading6}>
                                      {showPrice ? (
                                          <div className="fs-15 mt-3 d-flex mb-3">
                                              <div className="col-md-4">
                                                  <label>Enter special price per credit ($)</label>
                                                  <div className="mt-1">
                                                      <Input
                                                          className="w-100 ps-3"
                                                          prefix="$"
                                                          value={specialPrice}
                                                          defaultValue={specialPrice}
                                                          onChange={(e: any) => setSpecialPrice(e.target.value)}
                                                      />
                                                  </div>
                                              </div>
                                              <div className="text-start col-auto mt-auto ms-2">
                                                  {showPrice ? (
                                                      <Button type="primary" onClick={submitSpecialPrice} loading={loading9}>
                                                          Save
                                                      </Button>
                                                  ) : (
                                                      ''
                                                  )}
                                              </div>
                                          </div>
                                      ) : (
                                          <div className="fs-15 mb-3">
                                              {specialPrice ? (
                                                  <div>
                                                      <span className="fw-bold"> ${specialPrice}</span> is the special price set for this account.
                                                  </div>
                                              ) : (
                                                  <div className="h-100">
                                                      No Special pricing is set.
                                                      <a className="text-underline ms-2">Do you want to set special price?</a>
                                                  </div>
                                              )}
                                          </div>
                                      )}
                                  </Spin>
                              </>
                          )}
                </div>
            )}
            <div className={`${userRole === 'staff' ? 'col' : 'col-md-6'}`}>
                {(billingType !== 'none' && billingType !== null && billingType !== undefined) && (
                    <>
                        <div className="d-flex">
                            <h6 className={`${userRole === 'staff' ? 'my-auto' : 'mb-1'}`}>
                                Associated Report Items
                                {userRole !== 'staff' ? (
                                    <span className={`${loading7 ? 'text-secondary' : 'text-success'} fs-12 edit-icon pointer`} onClick={showModal}>
                                        <EditIcon />
                                    </span>
                                ) : (
                                    ''
                                )}
                            </h6>
                            <div className="ms-auto px-3 py-1 mb-auto mt-2 text-success fw-bold rounded-circle bg-aliceblue border">Total Credits: {totalCredit}</div>
                        </div>
                        <Spin spinning={loading7}>
                            <table className="w-100 mt-1 mb-3">
                                <thead>
                                    <tr className="border bg-light">
                                        <th className="p-2">Code</th>
                                        <th className="p-2">Report item</th>
                                        <th className="p-2 ">Credit Value</th>
                                        <th className="p-2">Description</th>
                                        {userRole !== 'staff' ? <th className="p-2 text-center">Action</th> : ''}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reportItemInfo?.data
                                        ?.filter((item: any) => item?.credit_code !== 'RPT')
                                        ?.map((item: any) => {
                                            return (
                                                <React.Fragment key={item?.id}>
                                                    {item?.is_associate || item?.is_default ? (
                                                        <tr className="border-start border-end border-bottom">
                                                            <td className="p-2">{item?.credit_code}</td>
                                                            <td className="p-2">{item.credit_item}</td>
                                                            <td className="ps-2">{item?.credit_Value}</td>
                                                            <td className="p-2">{item?.description || '--'}</td>
                                                            {userRole !== 'staff' ? (
                                                                <td
                                                                    className="p-2 text-center"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                >
                                                                    {item.is_default == true ? (
                                                                        <Tooltip title="Default report item cannot be removed" className="mt-0">
                                                                            <DeleteFilled className="text-secondary " />
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <Tooltip title="Delete Report Item" className="mt-0">
                                                                            <Popconfirm
                                                                                title=""
                                                                                description="Are you sure to remove this report item ?"
                                                                                onConfirm={() => removeCredit(item?.id)}
                                                                                okText="Yes"
                                                                                cancelText="No"
                                                                            >
                                                                                <DeleteFilled className="text-danger " />
                                                                            </Popconfirm>
                                                                        </Tooltip>
                                                                    )}
                                                                </td>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </tr>
                                                    ) : (
                                                        ''
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </Spin>
                    </>
                )}
            </div>
            <AccReportItemModal
                openModal={openModal}
                rowData={reportItemInfo?.data || null}
                // selectedItem={selectedItems}
                closeModal={handleClose}
                submitFunc={submitFunc}
                callbackFunc={callBackFunc}
            />
        </div>
    );
};

export default BillingDetails;
