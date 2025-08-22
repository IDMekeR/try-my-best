import React, { useEffect, useState } from 'react';
import { SettingFilled } from 'components/shared/AntIcons';
import { Form, InputNumber, Radio, Select } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { message, Spin, Switch } from 'components/shared/AntComponent';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { addEdfSetting, getEdfSetting, submitArtifactStatus } from 'services/actions/jobManagerAction';

const EDFSetting: React.FC = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const { edfSettingInfo, loading, success1, error1, loading1, success2, error2 } = useSelector((state: any) => state.jobManager);
    const [selectedValue, setSelectedValue] = useState('1');
    const [selectedVal, setSelectedVal] = useState('fastica');
    const [activeLnr, setActiveLnr] = useState(true);
    const [activeBcr, setActiveBcr] = useState(true);
    const [activeRrc, setActiveRrc] = useState(true);
    const [activeIca, setActiveIca] = useState(true);
    const [referenceLabels, setReferenceLabels] = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success1 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error1 : false;
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success2 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error2 : false;
    const userRole = sessionStorage.getItem('role');

    const options1 = [
        { value: 'fastica', label: 'Fastica' },
        { value: 'infomax', label: 'Infomax' },
        { value: 'picard', label: 'Picard' },
    ];

    const options = [
        { value: 'F1', label: 'F1', checked: false },
        { value: 'Fp1', label: 'Fp1', checked: false },
        { value: 'Fp2', label: 'Fp2', checked: false },
        { value: 'F7', label: 'F7', checked: false },
        { value: 'F3', label: 'F3', checked: false },
        { value: 'Fz', label: 'Fz', checked: false },
        { value: 'F4', label: 'F4', checked: false },
        { value: 'F8', label: 'F8', checked: false },
        { value: 'T3', label: 'T3', checked: false },
        { value: 'C3', label: 'C3', checked: false },
        { value: 'Cz', label: 'Cz', checked: false },
        { value: 'C4', label: 'C4', checked: false },
        { value: 'T4', label: 'T4', checked: false },
        { value: 'T5', label: 'T5', checked: false },
        { value: 'P3', label: 'P3', checked: false },
        { value: 'Pz', label: 'Pz', checked: false },
        { value: 'P4', label: 'P4', checked: false },
        { value: 'T6', label: 'T6', checked: false },
        { value: 'O1', label: 'O1', checked: false },
        { value: 'O2', label: 'O2', checked: false },
    ];
    const [items, setItems] = useState([
        { value: 1, label: 'F1', checked: false },
        { value: 2, label: 'Fp1', checked: false },
        { value: 3, label: 'Fp2', checked: false },
        { value: 4, label: 'F7', checked: false },
        { value: 5, label: 'F3', checked: false },
        { value: 6, label: 'Fz', checked: false },
        { value: 7, label: 'F4', checked: false },
        { value: 8, label: 'F8', checked: false },
        { value: 9, label: 'T3', checked: false },
        { value: 10, label: 'C3', checked: false },
        { value: 11, label: 'Cz', checked: false },
        { value: 12, label: 'C4', checked: false },
        { value: 13, label: 'T4', checked: false },
        { value: 14, label: 'T5', checked: false },
        { value: 15, label: 'P3', checked: false },
        { value: 16, label: 'Pz', checked: false },
        { value: 17, label: 'P4', checked: false },
        { value: 18, label: 'T6', checked: false },
        { value: 19, label: 'O1', checked: false },
        { value: 20, label: 'O2', checked: false },
    ]);

    const handleChange = (e: any) => {
        setSelectedValue(e.target.value);
        if (e.target.value == 1 && edfSettingInfo?.data[2]?.config_data[1]?.field_value !== 'False') {
            setReferenceLabels([]);
        }
    };

    function getEdfDetails() {
        dispatch(getEdfSetting() as any);
    }

    useEffect(() => {
        getEdfDetails();
    }, []);

    useEffect(() => {
        if (edfSettingInfo) {
            const lnr = edfSettingInfo?.data[0]?.status?.toLowerCase() === 'active' ? true : false;
            const bcr = edfSettingInfo?.data[1]?.status?.toLowerCase() === 'active' ? true : false;
            const rrc = edfSettingInfo?.data[2]?.status?.toLowerCase() === 'active' ? true : false;
            const ica = edfSettingInfo?.data[3]?.status?.toLowerCase() === 'active' ? true : false;
            form.setFieldsValue({
                lowpass: edfSettingInfo?.data ? edfSettingInfo?.data[0].config_data[0].field_value : '',
                highpass: edfSettingInfo?.data ? edfSettingInfo?.data[0].config_data[1].field_value : '',
            });
            setActiveLnr(lnr);
            setActiveBcr(bcr);
            setActiveRrc(rrc);
            setActiveIca(ica);
            const badChannel = edfSettingInfo?.data[1]?.config_data[0]?.field_value || '';
            const bcArr = badChannel?.split(',') || [];
            const updatedItems = items.map((item: any) => {
                if (bcArr.includes(item.label)) {
                    return { ...item, checked: true };
                } else {
                    return { ...item, checked: false };
                }
            });
            setItems(updatedItems);
            if (edfSettingInfo?.data[2]?.config_data[0]?.field_value == 'True') {
                setSelectedValue('1');
            } else {
                setSelectedValue('2');
                const val = edfSettingInfo?.data[2]?.config_data[1]?.field_value?.split(',');
                setReferenceLabels(val);
            }
            setSelectedVal(edfSettingInfo?.data[3]?.config_data[0]?.field_value);
        }
    }, [edfSettingInfo]);

    const handleChangeButton = (id: number, e: any) => {
        setItems((current) =>
            current.map((obj) => {
                if (obj.value === id && obj.checked) {
                    return { ...obj, checked: false };
                } else if (obj.value === id && !obj.checked) {
                    return { ...obj, checked: e.target.checked };
                }

                return obj;
            }),
        );
    };

    const submitFunc = async () => {
        const value = await form.validateFields();
        const sVal: any = [];
        for (let i = 0; i < items.length; i++) {
            if (items[i].checked == true) {
                sVal.push(items[i].label);
            }
        }
        const inputJson = [
            {
                edfconfig_id: 1,
                field_value: value.lowpass,
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 2,
                field_value: value.highpass,
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 3, //bad channel rejection
                field_value: sVal.toString(),
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 4, //re-referencing
                field_value: selectedValue === '1' ? 'True' : 'False',
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 5, //re-referencing
                field_value: selectedValue === '2' ? referenceLabels?.toString() : 'False',
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 6, //ica
                field_value: selectedVal,
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 10,
                field_value: value.startTime || '',
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
            {
                edfconfig_id: 9,
                field_value: value.duration || '',
                modifiedby: Number(sessionStorage.getItem('userid')),
            },
        ];
        dispatch(addEdfSetting(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };

    useEffect(() => {
        if (successmsg) {
            message.success('EDF settings updated successfully');
            setShowSuccessmsg(false);
            getEdfDetails();
        }
        if (errormsg) {
            message.error("EDF settings couldn't be updated");
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    const handleReferenceChange = (e: any) => {
        setReferenceLabels(e);
    };

    function submitStatus(id: number) {
        if (id === 1) {
            setActiveLnr(!activeLnr);
        } else if (id === 2) {
            setActiveBcr(!activeBcr);
        } else if (id === 3) {
            setActiveRrc(!activeRrc);
        } else {
            setActiveIca(!activeIca);
        }
        dispatch(submitArtifactStatus(id) as any);
        setShowErrormsg1(true);
        setShowSuccessmsg1(true);
    }

    useEffect(() => {
        if (successmsg1) {
            message.success('Preprocessing status updated successfully');
            setShowSuccessmsg1(false);
            getEdfDetails();
        }
        if (errormsg1) {
            message.error("Preprocessing couldn't be updated");
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);


    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">EDF Settings</h5>
            </div>
            <Spin spinning={loading}>
                <div className="row mx-0 mt-2 edf-setting-tab">
                    <div className="bg-white p-3 col-md-9">
                        <div className="section-title mb-4">
                            <h6 className="mb-1 p-2 fs-17 text-primary">
                                <SettingFilled />
                                <span className="ps-2">Line Noise Removal</span>
                            </h6>
                        </div>
                        <Form layout="vertical" form={form}>
                            <div className="row m-0">
                                <Form.Item name="lowpass" label="Lowpass Bandwidth" className="col">
                                    <InputNumber className="w-100" disabled={userRole === 'researcher'} />
                                </Form.Item>
                                <Form.Item name="highpass" label="Highpass Bandwidth" className="col">
                                    <InputNumber className="w-100" disabled={userRole === 'researcher'} />
                                </Form.Item>
                                <Form.Item name="startTime" label="Start Time (secs)" className="col">
                                    <InputNumber className="w-100" disabled={userRole === 'researcher'} />
                                </Form.Item>
                                <Form.Item name="duration" label="Duration (secs)" className="col">
                                    <InputNumber className="w-100" disabled={userRole === 'researcher'} />
                                </Form.Item>
                            </div>
                        </Form>
                        <div className="section-title my-4">
                            <h6 className="mb-1 p-2 fs-17 text-primary">
                                <SettingFilled />
                                <span className="ps-2"> Bad Channel Rejection</span>
                            </h6>
                        </div>
                        <div className="d-flex flex-wrap">
                            {items.map((item: any) => {
                                return (
                                    <Radio.Button
                                        key={item.value}
                                        value={item.label}
                                        defaultChecked={item.checked}
                                        checked={item.checked}
                                        disabled={userRole === 'researcher'}
                                        onClick={(e: any) => handleChangeButton(item.value, e)}
                                        className="m-2 col-md-1 text-center border"
                                    >
                                        {item.label}
                                    </Radio.Button>
                                );
                            })}
                        </div>
                        <div className="section-title my-4">
                            <h6 className="mb-1 p-2 fs-17 text-primary">
                                <SettingFilled />
                                <span className="ps-2">Re-referencing</span>
                            </h6>
                        </div>
                        <div className="p-2">
                            <Radio.Group value={selectedValue} onChange={handleChange} className='w-100' disabled={userRole === 'researcher'}>
                                <Radio value="2" className="fs-16 ">
                                    Re-reference data to channel(s)
                                </Radio>
                                <Radio value="1" className="fs-16">
                                    Computer Average Reference
                                </Radio>
                            </Radio.Group>
                            {selectedValue === '2' && (
                                <div className="col-md-3 mt-1">
                                    <Select className="w-75" options={options} value={referenceLabels} mode="multiple" onChange={handleReferenceChange} />
                                </div>
                            )}
                        </div>
                        <div className="section-title my-4">
                            <h6 className="mb-1 p-2 fs-17 text-primary">
                                <SettingFilled />
                                <span className="ps-2">ICA</span>
                            </h6>
                        </div>
                        <div className="ps-2 d-flex">
                            <Select options={options1} value={selectedVal} onChange={(e: any) => setSelectedVal(e)} className="w-25 fs-15" disabled={userRole === 'researcher'} />
                            <div className="p-3 ms-2 bg-light w-100">
                                <p className="fw-bold mb-1 fs-16">Algorithm Description:</p>
                                {selectedVal == 'fastica' ? (
                                    <div className="fs-15">
                                        Like most ICA algorithms, FastICA seeks an orthogonal rotation of prewhitened data, through a fixed-point iteration scheme, that maximizes a measure
                                        of non-Gaussianity of the rotated components.
                                    </div>
                                ) : selectedVal == 'infomax' ? (
                                    <div className="fs-15">
                                        The Infomax ICA algorithm incorporates natural gradient, which greatly improves the convergence. It is a more practical and effective algorithm for a
                                        variety of real-world problems
                                    </div>
                                ) : (
                                    <div className="fs-15">Picard is an algorithm for maximum likelihood independent component analysis.</div>
                                )}
                            </div>
                        </div>
                        {userRole == 'researcher' ? "" :
                            <div className="text-end mb-2 mt-3">
                                <Button type="primary" loading={loading1} onClick={submitFunc}>
                                    Save
                                </Button>
                            </div>}
                    </div>
                    <div className="col-md-3 ps-3 pe-0 ">
                        <div className="bg-white p-3 rounded mb-2 fs-16">
                            <Switch defaultChecked={activeLnr} checked={activeLnr} disabled={userRole == 'researcher'} onChange={() => submitStatus(1)} /> <span className="ps-3">Line Noise Removal</span>
                        </div>
                        <div className="bg-white p-3 rounded mb-2 fs-16">
                            <Switch defaultChecked={activeBcr} checked={activeBcr} disabled={userRole == 'researcher'} onChange={() => submitStatus(2)} /> <span className="ps-3">Bad Channel Rejection</span>
                        </div>
                        <div className="bg-white p-3 rounded mb-2 fs-16">
                            <Switch defaultChecked={activeRrc} checked={activeRrc} disabled={userRole == 'researcher'} onChange={() => submitStatus(3)} /> <span className="ps-3">Re-referencing</span>
                        </div>
                        <div className="bg-white p-3 rounded mb-2 fs-16">
                            <Switch defaultChecked={activeIca} checked={activeIca} disabled={userRole == 'researcher'} onChange={() => submitStatus(4)} /> <span className="ps-3">ICA</span>
                        </div>
                    </div>
                </div>
            </Spin>
        </div>
    );
};
export default EDFSetting;
