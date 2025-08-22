import React, { useState, useEffect } from 'react';
import { DeleteOutlined, PlusSquareOutlined, SearchOutlined } from '@ant-design/icons';
import { Select, Checkbox, Input } from 'components/shared/FormComponent';
import { useDispatch } from 'react-redux';
import { getDosageList, getMedicationList } from 'services/actions/patientAction';
import { useSelector } from 'react-redux';
import { getPhQuestionnaire, getPh8Data } from 'services/actions/newRequestAction';
import { getAssociatedMedicines } from 'services/actions/pipeline/pipelineAction';
import { useLocation } from 'react-router-dom';

interface ChildProps {
    callbackFunc: (val1: any, val2: any) => void;
    reqId: any;
    isError: any;
    isUae: any;
}

const PatientHealthMedication: React.FC<ChildProps> = ({ callbackFunc, reqId, isError, isUae }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { phqData } = useSelector((state: any) => state.newreq);
    const { medicListInfo, loading7, loading6, dosageInfo } = useSelector((state: any) => state.patient);
    const { requestInfo, assMedicInfo } = useSelector((state: any) => state.pipeline);
    const [phqItems, setPhqItems]: any = useState([]);
    const [dosageOptions, setDosageOptions] = useState([]);
    const [medicRows, setMedicRows] = useState([
        { id: 1, field1: '', field2: '' },
        { id: 2, field1: '', field2: '' },
        { id: 3, field1: '', field2: '' },
        { id: 4, field1: '', field2: '' },
    ]);
    const [nextMedicId, setNextMedicId] = useState(5);
    const reqIds = reqId || 0;
    const defData = assMedicInfo ? assMedicInfo?.data : [];

    useEffect(() => {
        const clearedRows = medicRows.map((row) => ({ ...row, field1: '', field2: '' }));
        setMedicRows(clearedRows);
    }, [isUae]);

    useEffect(() => {
        if (requestInfo?.data?.reqinfo && reqId) {
            const inputJson = {
                patientid: requestInfo?.data?.reqinfo?.patientid,
                servicerequestid: reqIds,
            };
            dispatch(getAssociatedMedicines(inputJson) as any);
        }
    }, [dispatch, requestInfo?.data]);

    useEffect(() => {
        if (assMedicInfo?.data && reqId) {
            const rows = assMedicInfo?.data?.map((item) => ({
                field1: item.medicine_name || '',
                field2: item.dosage || '',
            }));
            setMedicRows(rows);
        }
    }, [assMedicInfo?.data]);

    const medicineOptions = loading6
        ? []
        : medicListInfo
            ? medicListInfo[1]?.map((item: any) => {
                return {
                    label: item,
                    value: item,
                };
            })
            : [];

    useEffect(() => {
        if (reqIds) {
            getPntQuestion();
            getPntQuestion();
        } else {
            getphq8();
            getPntQuestion();
        }
    }, [reqIds, dispatch]);

    function getPntQuestion() {
        dispatch(getPhQuestionnaire(reqIds) as any);
    }
    function getphq8() {
        const payload = {};
        dispatch(getPh8Data(payload) as any);
    }

    const handleInputChange = (e, id, field) => {
        const value = e.target.value;
        const updatedRows = medicRows.map((row) => (row.id === id ? { ...row, [field]: value } : row));
        setMedicRows(updatedRows);
        callbackFunc(phqItems, updatedRows);
    };

    const handleChangePhq = (id: any, e: any, val: string) => {
        const phq = phqItems?.map((obj: any) => {
            if (obj.id === id) {
                if (val === 'r1') {
                    return { ...obj, r1: e.target.checked, r2: false, r3: false, r4: false };
                } else if (val === 'r2') {
                    return { ...obj, r1: false, r2: e.target.checked, r3: false, r4: false };
                } else if (val === 'r3') {
                    return { ...obj, r1: false, r2: false, r3: e.target.checked, r4: false };
                } else {
                    return { ...obj, r1: false, r2: false, r3: false, r4: e.target.checked };
                }
            }
            return obj;
        });
        setPhqItems(phq);
        callbackFunc(phq, medicRows);
    };
    const handleDeleteRow = (id: any) => {
        const updatedRows = medicRows.filter((row) => row.id != id);
        setMedicRows(updatedRows);
        callbackFunc(phqItems, updatedRows);
    };
    const handleAddRow = () => {
        const newRow = { id: nextMedicId, field1: '', field2: '' };
        setMedicRows([...medicRows, newRow]);
        setNextMedicId(nextMedicId + 1);
        callbackFunc(phqItems, [...medicRows, newRow]);
    };

    const searchMedicine = (e: any) => {
        dispatch(getMedicationList(e) as any);
    };

    const getDosage = (e: any, id: any, fieldName: string) => {
        const updatedRows = medicRows.map((row: any) => {
            if (row.id === id) {
                return { ...row, [fieldName]: e };
            }
            return row;
        });
        setDosageOptions([]);
        setMedicRows(updatedRows);
        callbackFunc(phqItems, updatedRows);
        if (fieldName == 'field1') {
            dispatch(getDosageList(e) as any);
        }
    };

    useEffect(() => {
        if (phqData?.data) {
            const item = phqData?.data?.map((item: any) => {
                return {
                    id: item.phqid,
                    label: item.phq,
                    r1: item.phq_score == 0 ? true : false,
                    r2: item.phq_score == 1 ? true : false,
                    r3: item.phq_score == 2 ? true : false,
                    r4: item.phq_score == 3 ? true : false,
                };
            });
            setPhqItems(item);
            callbackFunc(item, medicRows);
        }
    }, [phqData?.data, reqIds]);
    useEffect(() => {
        if (dosageInfo) {
            const opt = dosageInfo
                ? dosageInfo[2]?.STRENGTHS_AND_FORMS[0]?.map((item: any) => {
                    return {
                        label: item,
                        value: item,
                    };
                })
                : [];
            setDosageOptions(loading7 ? [] : opt);
        }
    }, [dosageInfo]);

    return (
        <div>
            <div className="section-title mt-3">
                <h6 className="mb-1 p-2 fs-16 text-primary">Patient Health Questionnaire</h6>
            </div>
            <div className="mt-3 px-2">
                <table className="w-100 edf-step-header table-bordered ">
                    <thead>
                        <tr className="heading bg-light">
                            <th className="p-2 question-heading">
                                <span className="text-danger pe-1">*</span> Over the last 2 weeks, how often have you been bothered by any of the following problems?
                            </th>
                            <th className="p-2 text-center r-check">Not at all</th>
                            <th className="p-2 text-center r-check">Several days</th>
                            <th className="p-2 text-center r-check">More than half the days</th>
                            <th className="p-2 text-center r-check">Nearly every day</th>
                        </tr>
                    </thead>
                    <tbody>
                        {phqItems?.map((item: any) => {
                            return (
                                <tr key={item.id} data-item-id={item.id}>
                                    <td className="p-2">{item.label}</td>
                                    <td className={`${item.r1 ? 'bg-aliceblue' : ''} p-2 text-center`}>
                                        <Checkbox checked={item.r1} onClick={(e: any) => handleChangePhq(item.id, e, 'r1')}></Checkbox>
                                    </td>
                                    <td className={`${item.r2 ? 'bg-aliceblue' : ''} p-2 text-center`}>
                                        <Checkbox checked={item.r2} onClick={(e: any) => handleChangePhq(item.id, e, 'r2')} ></Checkbox>
                                    </td>
                                    <td className={`${item.r3 ? 'bg-aliceblue' : ''} p-2 text-center`}>
                                        <Checkbox checked={item.r3} onClick={(e: any) => handleChangePhq(item.id, e, 'r3')} ></Checkbox>
                                    </td>
                                    <td className={`${item.r4 ? 'bg-aliceblue' : ''} p-2 text-center`}>
                                        <Checkbox checked={item.r4} onClick={(e: any) => handleChangePhq(item.id, e, 'r4')} ></Checkbox>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="section-title d-flex my-3">
                <h6 className="mb-1 p-2 fs-16 col text-primary">Medication</h6>
            </div>
            <div className="px-2 medic-section">
                <h6 className="text-dark">Provide all the medications you have taken in the past 30 days</h6>
                {/* <div className="row mx-0 mb-2  p-0 medication-title">
                    <div className="sub-title col-md-5 me-3 ps-0 med-heading fs-15 fw-500">Medicine Name</div>
                    <div className="sub-title col-md-5 ps-0 med-heading fs-15 fw-500">Dosage</div>
                    {isError || reqIds ? (
                        ''
                    ) : (
                        <div className="col text-start">
                            <PlusSquareOutlined className="text-primary" onClick={handleAddRow} />
                        </div>
                    )}
                </div> */}
                <div className="">
                    {(defData?.length > 0 && reqIds) || !isError ? (
                        <>
                            {/* {medicRows?.length === 0 ? "" : */}
                                <div className="row mx-0 mb-2  p-0 medication-title">
                                    <div className='col d-flex ps-0'>
                                        <div className="sub-title col-md-6 me-3 ps-0 med-heading">Medicine Name</div>
                                        <div className="sub-title col-md-6 ps-0 med-heading">Dosage</div>
                                    </div>
                                    <div className="col-auto text-center">
                                        <PlusSquareOutlined className="text-primary" onClick={handleAddRow} />
                                    </div>
                                </div>
                            {/* } */}
                            {medicRows.length > 0 ? (
                                <>
                                    {medicRows.map((row, idx) => (
                                        <div className="row mx-0 mb-2" key={idx}>
                                            <div className='col d-flex ps-0 medic-tbl-body'>
                                                <div className="col-md-6 me-3 ps-0">
                                                    {isUae == 229 ? (
                                                        <Input className="w-100 mb-1" placeholder="Medicine Name" value={row.field1} onChange={(e) => handleInputChange(e, row.id, 'field1')} />
                                                    ) : (
                                                        <Select
                                                            className="w-100 mb-1"
                                                            showSearch
                                                            notFoundContent={
                                                                <div className="text-center p-4">
                                                                    <SearchOutlined className="pe-2 pb-2" />
                                                                    Search to find medicine
                                                                </div>
                                                            }
                                                            placeholder="Medicine Name"
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            onSearch={(e: any) => searchMedicine(e)}
                                                            onClick={() => {
                                                                setDosageOptions([]);
                                                            }}
                                                            value={row.field1}
                                                            defaultValue={row.field1}
                                                            options={medicineOptions}
                                                            onSelect={(e) => getDosage(e, row.id, 'field1')}
                                                        />
                                                    )}
                                                </div>
                                                <div className="col-md-6 ps-0">
                                                    {isUae == 229 ? (
                                                        <Input className="w-100" placeholder="Dosage" value={row.field2} onChange={(e) => handleInputChange(e, row.id, 'field2')} />
                                                    ) : (
                                                        <Select
                                                            className="w-100"
                                                            getPopupContainer={(trigger) => trigger.parentNode}
                                                            placeholder="Dosage"
                                                            value={row.field2}
                                                            defaultValue={row.field2}
                                                            notFoundContent={
                                                                <div className="text-center p-4">
                                                                    <SearchOutlined className="pe-2 pb-2" />
                                                                    Select medicine to find dosage
                                                                </div>
                                                            }
                                                            onSelect={(e) => getDosage(e, row.id, 'field2')}
                                                            options={dosageOptions}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="col-auto text-center">
                                                <DeleteOutlined className="text-danger" onClick={() => handleDeleteRow(row.id)} />
                                            </div>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="bg-light p-4 mt-3 h-100">No medicine associated</div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="row mx-0 mb-2  p-0 medication-title">
                                <div className="sub-title col-md-5 me-3 ps-0 med-heading">Medicine Name</div>
                                <div className="sub-title col-md-5 ps-0 med-heading">Dosage</div>
                                {isError || reqId ? (
                                    ''
                                ) : (
                                    <div className="col-auto text-center">
                                        {' '}
                                        <PlusSquareOutlined className="text-primary" onClick={handleAddRow} />
                                    </div>
                                )}
                            </div>
                            {medicRows.length > 0 ? (
                                <>
                                    {medicRows.map((row, index) => (
                                        <div className="row mx-0 mb-2" key={index}>
                                            <div className="col-md-5 me-3 ps-0">
                                                {isUae == 229 ? (
                                                    <Input className="w-100 mb-1" placeholder="Medicine Name" value={row.field1} onChange={(e) => handleInputChange(e, row.id, 'field1')} />
                                                ) : (
                                                    <Select
                                                        className="w-100 mb-1"
                                                        showSearch
                                                        notFoundContent={
                                                            <div className="text-center p-4">
                                                                <SearchOutlined className="pe-2 pb-2" />
                                                                Search to find medicine
                                                            </div>
                                                        }
                                                        placeholder="Medicine Name"
                                                        getPopupContainer={(trigger) => trigger.parentNode}
                                                        value={row.field1}
                                                        defaultValue={row.field1}
                                                        onSearch={(e: any) => searchMedicine(e)}
                                                        onClick={() => {
                                                            setDosageOptions([]);
                                                        }}
                                                        options={medicineOptions}
                                                        onSelect={(e) => getDosage(e, row.id, 'field1')}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-md-5 ps-0">
                                                {isUae == 229 ? (
                                                    <Input className="w-100" placeholder="Dosage" value={row.field2} onChange={(e) => handleInputChange(e, row.id, 'field2')} />
                                                ) : (
                                                    <Select
                                                        className="w-100"
                                                        getPopupContainer={(trigger) => trigger.parentNode}
                                                        placeholder="Dosage"
                                                        value={row.field2}
                                                        defaultValue={row.field2}
                                                        notFoundContent={
                                                            <div className="text-center p-4">
                                                                <SearchOutlined className="pe-2 pb-2" />
                                                                Select medicine to find dosage
                                                            </div>
                                                        }
                                                        onSelect={(e) => getDosage(e, row.id, 'field2')}
                                                        options={dosageOptions}
                                                    />
                                                )}
                                            </div>
                                            <div className="col-auto text-center">
                                                <DeleteOutlined className="text-danger" onClick={() => handleDeleteRow(row.id)} />
                                            </div>
                                        </div>
                                    ))}{' '}
                                </>
                            ) : (
                                ''
                            )}
                            {isError || (medicRows.length == 0 && reqId) ? <div className="bg-light p-4 mt-3 h-100">No medicine associated</div> : ''}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientHealthMedication;
