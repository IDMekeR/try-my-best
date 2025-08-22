import React, { useEffect, useState } from 'react';
import { message, Modal, Popconfirm } from 'components/shared/AntComponent';
import { Form, Input, Radio } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Alert } from 'antd';
import { updateInvoicePrice, getInvoiceInfo } from 'services/actions/invoiceAction';
import { useDispatch, useSelector } from 'components/shared/CompVariables';

interface ChildProps {
    openModal: boolean;
    handleClose: () => void;
    totalAmount: any;
    invoiceId: any;
}

const InvoiceAdjustment: React.FC<ChildProps> = ({ openModal, handleClose, totalAmount, invoiceId }) => {
    const dispatch = useDispatch();
    const [calcDiscountAmount, setCalcDiscountAmount]: any = useState(0);
    const { success4, error4, loading4 } = useSelector((state: any) => state.invoice);
    const [adjustMethod, setAdjustMethod] = useState('percent');
    const [inputValue, setInputValue]: any = useState('');
    const [errorMessage, setErrorMessage]: any = useState('');
    const [finalPrice, setFinalPrice]: any = useState(0);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success4 : null;
    const [showErrorMsg, setShowErrorMsg] = useState(false);
    const errorMsg = showErrorMsg ? error4 : null;

    const options = [
        { label: 'Percentage', value: 'percent' },
        { label: 'Amount', value: 'amount' },
    ];

    const handleInvoicePrice = () => {
        const inputJson = {
            invoiceid: invoiceId,
            invoiceprice: finalPrice <= 1 ? 0.0 : Number(finalPrice),
            invoice_discount_percentage_flag: true,
            invoice_discount: parseFloat(Number(calcDiscountAmount).toFixed(2)),
        };
        dispatch(updateInvoicePrice(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrorMsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Invoice Price Adjustment updated successfully');
            handleClose();
            setInputValue('');
            setAdjustMethod('percent')
            setFinalPrice(0);
            setCalcDiscountAmount(0);
            dispatch(getInvoiceInfo(invoiceId) as any);
            setShowSuccessmsg(true);
        }
        if (errorMsg) {
            message.error("Invoice Price Adjustment couldn't be updated");
            setShowErrorMsg(false);
        }
    }, [successmsg, errorMsg]);

    const handleInputChange = (e) => {
        let value = e.target.value;

        const regex = /^\d+(\.\d{0,2})?$/;
        if (!regex.test(value)) {
            // If not, truncate to two decimal places
            const decimalIndex = value.indexOf('.');
            if (decimalIndex !== -1) {
                value = value.slice(0, decimalIndex + 3);
            }
        }
        setInputValue(value);
        const numericalValue = parseFloat(value);
        let calculatedDiscount = 0;

        if (e.target.value) {
            if (isNaN(numericalValue)) {
                setErrorMessage('Invalid input. Please enter a valid number.');
                return;
            }
            if (adjustMethod === 'percent') {
                if (value > 100 || value < 0) {
                    setErrorMessage('Percentage should be between 0 and 100.');
                } else {
                    calculatedDiscount = (totalAmount * value) / 100;
                    setErrorMessage('');
                }
            } else if (adjustMethod === 'amount') {
                if (numericalValue > totalAmount || numericalValue < 0) {
                    setErrorMessage(`Amount should be between 0 and ${totalAmount}.`);
                } else {
                    calculatedDiscount = value;
                    setErrorMessage('');
                }
            }
            setCalcDiscountAmount(calculatedDiscount);
            setFinalPrice(totalAmount - calculatedDiscount);
        } else {
            setFinalPrice(totalAmount);
        }
    };

    const resetSearch = (e) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setCalcDiscountAmount(0);
        }
    };

    return (
        <div>
            <Modal
                title="Adjustment (Discount)"
                className="paymentModal"
                open={openModal}
                onCancel={handleClose}
                footer={[
                    <Button danger  className="bg-danger text-white" key="cancel" onClick={handleClose}>
                        Close
                    </Button>,

                    calcDiscountAmount == Number(totalAmount) || inputValue == Number(totalAmount) ? (
                        <Popconfirm
                            title={
                                <>
                                    The total amount after adjustments is zero.
                                    <br /> Approving this invoice will move it directly to the closed invoices.
                                </>
                            }
                            description=" Are you sure you want to proceed?"
                            onConfirm={() => handleInvoicePrice()}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button key="proceed" type="primary" disabled={errorMessage || calcDiscountAmount == 0 || inputValue == 0} loading={loading4}>
                                Save
                            </Button>
                        </Popconfirm>
                    ) : (
                        <Button key="proceed" type="primary" disabled={errorMessage || calcDiscountAmount == 0 || inputValue == 0} onClick={handleInvoicePrice} loading={loading4}>
                            Save
                        </Button>
                    ),
                ]}
            >
                <Form className="col mb-2">
                    <Form.Item className="w-100">
                        <Radio.Group
                            options={options}
                            onChange={(e) => {
                                setAdjustMethod(e.target.value);
                                setInputValue('');
                                setErrorMessage('');
                            }}
                            value={adjustMethod}
                            optionType="button"
                        />
                    </Form.Item>
                    <Form.Item className="w-100">
                        <Input
                            type="number"
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyUp={(e) => resetSearch(e)}
                            prefix={adjustMethod === 'percent' ? '%' : `$`}
                            placeholder={adjustMethod === 'percent' ? 'Enter percentage' : `Enter Adjustment Amount (max $${parseFloat(totalAmount || 0).toFixed(2)})`}
                        />
                    </Form.Item>
                    {errorMessage && (
                        <Form.Item className="w-100">
                            <Alert message={errorMessage} type="error" />
                        </Form.Item>
                    )}
                    <div>
                        <div className="paymentDetailCont pb-0 pt-0" style={{ border: '1px solid #ccc' }}>
                            <table style={{ width: '100%' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #ccc' }}>
                                        <th
                                            style={{
                                                paddingBottom: '10px',
                                                paddingTop: '10px',
                                                fontWeight: 'bold',
                                                width: '50%',
                                                borderRight: '1px solid #ccc',
                                                paddingLeft: '5px',
                                            }}
                                        >
                                            Adjustment Description
                                        </th>
                                        <th style={{ paddingBottom: '10px', paddingTop: '10px', fontWeight: 'bold', textAlign: 'end', width: '50%', paddingRight: '5px' }}>Amount ($)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td style={{ paddingTop: '10px', borderRight: '1px solid #ccc', paddingLeft: '5px' }}>Sub Total </td>
                                        <td style={{ textAlign: 'end', paddingTop: '5px', paddingBottom: '5px', paddingRight: '5px' }}>{parseFloat(totalAmount || 0).toFixed(2)}</td>
                                    </tr>

                                    <tr>
                                        <td style={{ paddingTop: '10px', paddingBottom: '5px', borderRight: '1px solid #ccc', paddingLeft: '5px' }}>Adjustment Amount</td>
                                        <td style={{ textAlign: 'end', paddingTop: '5px', paddingBottom: '5px', paddingRight: '5px' }}>{Number(calcDiscountAmount || 0).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td
                                            style={{
                                                borderTop: '1px solid #f2f2f2',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                fontWeight: 'bold',
                                                borderRight: '1px solid #ccc',
                                                paddingLeft: '5px',
                                            }}
                                        >
                                            Total Amount
                                        </td>
                                        <td
                                            style={{
                                                borderTop: '1px solid #f2f2f2',
                                                paddingTop: '10px',
                                                paddingBottom: '10px',
                                                textAlign: 'end',
                                                fontWeight: 'bold',
                                                paddingRight: '5px',
                                            }}
                                        >
                                            {inputValue == '' && (calcDiscountAmount == 0 || calcDiscountAmount == '')
                                                ? parseFloat(totalAmount || 0).toFixed(2)
                                                : parseFloat(finalPrice || 0).toFixed(2)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Form>
            </Modal>
        </div>
    );
};

export default InvoiceAdjustment;
