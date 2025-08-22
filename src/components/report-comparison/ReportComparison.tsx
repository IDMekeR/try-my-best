import React, { useState, useEffect } from 'react';
import { Checkbox, DatePicker, Form, Select } from 'components/shared/FormComponent';
import { Image } from 'components/shared/AntComponent';
import { myFunc } from 'components/shared/DropdownOption';
import { Button } from 'components/shared/ButtonComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { getAccPntList } from 'services/actions/patientAction';
import { FileTextOutlined, LoadingOutlined } from 'components/shared/AntIcons';
import { getComparisonReport, getReportComparison } from 'services/actions/reportComparisonAction';
import dayjs from 'dayjs';
import NoReportIcon from 'assets/img/no-report.png';
import TopographImages from './sub-screens/TopographImages';

const ReportComparison: React.FC = () => {
    const [form] = Form.useForm();
    const options = myFunc();
    const userRole = sessionStorage?.getItem('role');
    const accountID = sessionStorage.getItem('accountid');
    const { userProfileInfo } = useSelector((state: any) => state.auth);
    const dispatch = useDispatch();
    const [selectedRpts, setSelectedRpts] = useState([]);
    const { accPntInfo, loading9 } = useSelector((state: any) => state.patient);
    const { loading, reportReqInfo, cmpData, loading1 , success1} = useSelector((state: any) => state.report);
    const [compareData, setCompareData]: any = useState([]);

    const [accID, setAccID] = useState(0);
    const [oldAccID, setOldAccID] = useState(0);
    const [oldPntID, setOldPntID] = useState(0);
    const [selectedPnt, setSelectedPnt] = useState(0);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [oldSdate, setOldSdate] = useState(null);
    const [oldEdate, setOldEdate] = useState(null);
    const [showTopos, setShowTopos] = useState(false);
    const [topoInfo, setTopoInfo]: any = useState(null);
    const [showsuccessmsg, setShowsuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success1 : null;
    const [reportItems, setReportItems] = useState([
        { id: 1, name: 'Interpretation', checked: true },
        { id: 2, name: 'MED', checked: true },
        { id: 3, name: 'Supplementation', checked: true },
        { id: 4, name: 'Lifestyle', checked: true },
        { id: 5, name: 'NFB', checked: false },
        { id: 6, name: 'PBM', checked: false },
        { id: 7, name: 'Images Only', checked: false },
    ]);

    const requestOptions =
        accID !== 0 && accID === oldAccID && selectedPnt === oldPntID && startDate === oldSdate && endDate === oldEdate && !loading
            ? reportReqInfo?.req_info?.map((item: any) => {
                return {
                    label: item.encoded_RequestNumber+" "+`(${item.created_on?new Date(item.created_on)?.toLocaleDateString():null})` ,
                    value: item.id,
                    date: item.created_on,
                };
            })
            : [];

    const getReportDetails = () => {
        const inputJson = {
            servicerequestids: selectedRpts,
        };
        dispatch(getComparisonReport(inputJson) as any);
        setShowsuccessmsg(true);
    };
    function getPatient(id: any) {
        dispatch(getAccPntList(id) as any);
    }
    const handleAccChange = (e: any) => {
        getPatient(e);
        setAccID(e);
        form.resetFields(['patient']);
    };

    // useEffect(() => {
    //     if (successmsg) {
    //         setShowOption(true);
    //         // setDropdown(false);
    //     }
    // }, [successmsg]);

    useEffect(()=>{
        if(userRole==='staff'){
           const accid = userProfileInfo?.data?.account_id;
           getPatient(accid);
        }
    },[userRole]);

    useEffect(() => {
        if (cmpData?.data) {
            setCompareData(cmpData?.data?.map((item) => item.req_info));
        }
    }, [cmpData?.data]);

    const pntOptions = !loading9
        ? accPntInfo?.data?.map((item: any) => {
            return {
                label: item.patient_name,
                value: item.id,
            };
        })
        : [];

    const getRequestDetail = (accid: any, pid: any, sdate: any, edate: any) => {
        const inputJson = {
            accountid: userRole === 'staff' ? accountID : Number(accid) || 0,
            pnt_id: Number(pid) || '',
            start_date: sdate?.format('YYYY-MM-DD') || '',
            end_date: edate?.format('YYYY-MM-DD') || '',
        };
        setOldAccID(accid);
        setOldPntID(pid);
        setOldSdate(sdate || null);
        setOldEdate(edate || null);
        dispatch(getReportComparison(inputJson) as any);
    };

    useEffect(() => {
        if (userRole === 'staff' && userProfileInfo?.data) {
            setAccID(userProfileInfo?.data?.account_id);
            getPatient(userProfileInfo?.data?.account_id);
        }
    }, [userProfileInfo]);

    const resetFilter = () => {
        form.resetFields();
        setCompareData([]);
        setSelectedPnt(0);
        setOldAccID(0);
        setAccID(0);
        setOldPntID(0);
        setStartDate(null);
        setEndDate(null);
        setOldSdate(null);
        setOldEdate(null);
        setSelectedRpts([]);
        // setShowOption(false);
        // setDropdown(true);
    };
    const submitFilter = async (values: any) => {
        // let values = await form.validateFields();
        if (requestOptions?.length > 0 && accID === oldAccID && selectedPnt === oldPntID) {
            getReportDetails();
        } else {
            getRequestDetail(accID, values.patient, values.startDate, values.endDate);
        }
    };
    const validateCheckboxGroup = (_: any) => {
        if (selectedRpts?.length >= 2 && selectedRpts?.length <= 3) {
            return Promise.resolve();
        } else if (selectedRpts?.length > 3) {
            return Promise.reject(new Error('Three reports are maximum'));
        }
        return Promise.reject(new Error('At least two reports must be selected'));
    };
    const handleReports = (value: any) => {
        setSelectedRpts(value);
    };

    const handleSDateChange = (e: any) => {
        setStartDate(e);
    };
    const handleEDateChange = (e: any) => {
        setEndDate(e);
    };
    const disabledDate = (current: any) => {
        if (!current) {
            return false;
        }
        // Define the end of tomorrow
        const endOfTomorrow = dayjs();
        // Disable dates after the end of tomorrow
        return current.isAfter(endOfTomorrow, 'day');
    };
    const handlePatientChange = (id: any) => {
        setSelectedPnt(id);
    };
    const handleItemChecked = (val: any, e: any) => {
        setReportItems((current) =>
            current.map((obj) => {
                if (obj.id === val.id) {
                    return { ...obj, checked: e.target.checked };
                }

                return obj;
            }),
        );
    };
    const showTopo = (
        pdr: any,
        reqNo: any,
        rdate: any,
        eofftabs: any,
        ecfftabs: any,
        eozabs: any,
        eczabs: any,
        eoabs: any,
        ecabs: any,
        eorel: any,
        ecrel: any,
        eofftrel: any,
        ecfftrel: any,
        eograph: any,
        ecgraph: any,
        dlen: any,
    ) => {
        setShowTopos(true);
        const accname = compareData ? compareData[0].servicerequest_info?.account_name : '';
        const pntname = compareData ? compareData[0].patient_info?.pntname : '';
        const dob = compareData ? compareData[0].patient_info?.dob : null;
        const gender = compareData ? compareData[0].patient_info?.sex_at_birth : '';
        setTopoInfo({ pdr, reqNo, rdate, eofftabs, ecfftabs, eozabs, eczabs, eoabs, ecabs, eorel, ecrel, eofftrel, ecfftrel, eograph, ecgraph, dlen, accname, pntname, dob, gender });
    };

    const isOutsideRange = (value, min, max) => {
        return value < min || value > max;
    };

    const getStyle = (item, markerType, age) => {
        const eyeClosedThetaBeta = parseFloat(item.eyeclosed);
        const eyeOpenThetaBeta = parseFloat(item.eyeopen);
        const eyeData = markerType === 'eyeClosed' ? parseFloat(item.eyeclosed) : parseFloat(item.eyeopen);
        const eyeData1 = markerType === 'eyeClosed' ? item.eyeclosed === 'true' : item.eyeopen === 'true';
        const style = { color: '' };
        if (item.markername === 'Alpha/beta ratio' && isOutsideRange(eyeData, 6, 12)) {
            style.color = 'red';
        } else if (item.markername === 'Posterior Dominant Rhythm') {
            let lowerBound, upperBound;
            if (age < 10) {
                lowerBound = 8;
                upperBound = 10;
            } else if (age >= 10 && age < 45) {
                lowerBound = 10;
                upperBound = 12;
            } else if (age >= 45 && age < 55) {
                lowerBound = 9.5;
                upperBound = 12;
            } else if (age >= 55 && age < 65) {
                lowerBound = 9;
                upperBound = 12;
            } else if (age >= 65 && age < 75) {
                lowerBound = 8.5;
                upperBound = 12;
            } else {
                lowerBound = 8;
                upperBound = 12;
            }

            if (isOutsideRange(eyeData, lowerBound, upperBound)) {
                style.color = 'red';
            }
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeClosed' && eyeClosedThetaBeta > 3) {
            style.color = 'red';
        } else if (item.markername === 'Theta/beta ratio' && markerType == 'eyeOpen' && eyeOpenThetaBeta > eyeClosedThetaBeta) {
            style.color = 'red';
        } else if (item.markername === 'Mu Rhythm Present' && eyeData1) {
            style.color = 'red';
        } else if (item.markername === 'F7>F8 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        } else if (item.markername === 'F3>F4 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        } else if (item.markername === 'P4>P3 Asymmetry Present' && eyeData1) {
            style.color = 'red';
        }
        return style;
    };

    return (
        <div className="p-2 h-100">
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Report Comparison</h5>
            </div>
            <div className="mt-3 row mx-0 h-100">
                {!showTopos ? (
                    <div className="col-md-2 p-0">
                        <div className="bg-white p-3">
                            <h6 className="text-dark pb-2 border-bottom">Filter Options</h6>
                            <div className="mt-3">
                                <Form form={form} layout="vertical" onFinish={submitFilter}>
                                    {userRole == 'staff' ? '' : <Form.Item name="account" label="Select Account" rules={[{required:userRole==='staff'?false:true,message:'This field is required'}]}>
                                        <Select
                                            showSearch
                                            options={options.accOptions}
                                            getPopupContainer={(trigger) => trigger.parentNode}
                                            optionFilterProp="children"
                                            onChange={handleAccChange}
                                            filterOption={(input: any, option: any) => {
                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}
                                        />
                                    </Form.Item>}
                                    <Form.Item name="patient" label="Select Patient" rules={[{required:true,message:'This field is required'}]}>
                                        <Select
                                            showSearch
                                            options={pntOptions}
                                            optionFilterProp="children"
                                            filterOption={(input: any, option: any) => {
                                                return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                            }}
                                            onChange={handlePatientChange}
                                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                            notFoundContent={
                                                <div className="text-center p-4">
                                                    {loading9 ? (
                                                        <span>
                                                            <LoadingOutlined />
                                                            Loading...
                                                        </span>
                                                    ) : (
                                                        <span>No Patient available</span>
                                                    )}
                                                </div>
                                            }
                                            getPopupContainer={(trigger) => trigger.parentNode}
                                        />
                                    </Form.Item>
                                    <Form.Item name="startDate" label="Start Date">
                                        <DatePicker format="DD-MM-YYYY" className="w-100" disabledDate={(current) => disabledDate(current)} onChange={handleSDateChange} />
                                    </Form.Item>
                                    <Form.Item name="endDate" label="End Date">
                                        <DatePicker format="DD-MM-YYYY" className="w-100" disabledDate={(current) => disabledDate(current)} onChange={handleEDateChange} />
                                    </Form.Item>
                                    {requestOptions?.length > 0 && !loading ? (
                                        <Form.Item
                                            name="reports"
                                            label="Select Reports"
                                            className="mb-3 pb-0 rpt-section"
                                            rules={[
                                                { required: true, message: 'This field is required' },
                                                {
                                                    validator: validateCheckboxGroup,
                                                },
                                            ]}
                                        >
                                            <div>
                                                <span className="text-warning fs-14 ps-2">Maximum report selection limit is 3</span>
                                                <div className="bg-light p-2 phq-tbl mt-2">
                                                    {/* const originalDate = new Date(created_on) || null;
                return pipelineInfo ? originalDate?.toLocaleString() : null; */}
                                                    <Checkbox.Group options={requestOptions} defaultValue={selectedRpts} onChange={handleReports} className="row m-0"></Checkbox.Group>
                                                </div>
                                            </div>
                                        </Form.Item>
                                    ) : oldPntID == selectedPnt && oldAccID == accID && accID !== 0 && startDate == null && !loading ? (
                                        <Form.Item name="reports" label="Select Reports" className="mb-3">
                                            <div className="p-4 text-center bg-light">Reports Not available</div>
                                        </Form.Item>
                                    ) : (
                                        ''
                                    )}
                                    <div className="mt-3 text-end d-flex justify-content-end">
                                        <Button className="mt-2 me-2 bg-warning fw-bold border-0" onClick={() => resetFilter()}>
                                            Reset
                                        </Button>
                                        <Button type="primary" className="mt-2" htmlType="submit" loading={loading || loading1}>
                                            Apply Filter
                                        </Button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                        {compareData?.length > 0 && selectedPnt !== 0 && (
                            <div className="">
                                <div className="mt-2 bg-white p-3">
                                    <h6 className="txt-primary">Select Report Items</h6>
                                    <div className="row m-0 phq-tbl">
                                        {reportItems?.map((item: any) => {
                                            return (
                                                <Checkbox key={item.id} defaultChecked={item.checked} onChange={(e) => handleItemChecked(item, e)}>
                                                    {item.name}
                                                </Checkbox>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    ''
                )}
                <div className={`${showTopos ? 'ms-0' : 'ms-2'} col p-0`}>
                    <div className="bg-white p-3 h-100">
                        {compareData?.length > 0 && selectedPnt ? (
                            <div>
                                <div className="d-flex">
                                    <h5 className="col-auto">{showTopos ? 'Topography Images' : 'Result'}</h5>
                                    {showTopos ? (
                                        <div className="col-auto ms-auto">
                                            <Button
                                                type="primary"
                                                onClick={() => {
                                                    setShowTopos(!showTopos);
                                                }}
                                            >
                                                Back
                                            </Button>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                {!showTopos ? (
                                    <table className="w-100 table-bordered edf-step-header custom">
                                        <thead>
                                            <tr style={{ background: '#dbebf6' }}>
                                                <th className="p-2 border-end step-name">Report Items</th>
                                                {compareData?.map((item: any, i: any) => {
                                                    return (
                                                        <th className="text-center reqnum" colSpan={2} key={i + 1}>
                                                            {item.servicerequest_info?.encoded_RequestNumber}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                            <tr style={{ background: '#99C1E6' }}>
                                                <th className="p-2 fw-500">Released On</th>
                                                {compareData?.map((item: any, i: any) => {
                                                    const originalDate = new Date(item.servicerequest_info?.created_on) || null;
                                                    return (
                                                        <th className="text-center" colSpan={2} key={i + 2}>
                                                            {originalDate?.toLocaleDateString()}
                                                        </th>
                                                    );
                                                })}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <>
                                                {reportItems.map((report) => {
                                                    if (!report.checked) return null;

                                                    switch (report.name) {
                                                        case 'Interpretation':
                                                            return compareData[0]?.interpretationmakers?.map((item: any, index: any) => {
                                                                return (
                                                                    <React.Fragment key={index}>
                                                                        {index === 0 && (
                                                                            <tr className="headings bg-light">
                                                                                <td className="p-2 border-end fw-bold">Interpretation</td>
                                                                                {compareData.map((data: any, i: number) => (
                                                                                    <React.Fragment key={data.servicerequest_info?.id + i}>
                                                                                        <td className="text-center border-end fw-bold">Eyes Opened</td>
                                                                                        <td className="text-center border-end fw-bold">Eyes Closed</td>
                                                                                    </React.Fragment>
                                                                                ))}
                                                                            </tr>
                                                                        )}
                                                                        <tr>
                                                                            <td className="ps-4 py-2">{item?.markername}</td>
                                                                            {compareData.map((data: any, i: number) => (
                                                                                <React.Fragment key={i}>
                                                                                    <td className={`p-2 text-center text-capitalize ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`}>
                                                                                        <div style={{ ...getStyle(item, 'eyeOpen', data?.servicerequest_info?.pnt_age) }}>
                                                                                            {data?.interpretationmakers[index]?.eyeopen
                                                                                                ? data?.interpretationmakers[index].mfieldtype === 'textbox'
                                                                                                    ? parseFloat(data?.interpretationmakers[index]?.eyeopen)?.toFixed(2)
                                                                                                    : data?.interpretationmakers[index]?.eyeopen
                                                                                                : '--'}
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className={`p-2 text-center text-capitalize ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`}>
                                                                                        <div style={{ ...getStyle(item, 'eyeClosed', data?.servicerequest_info?.pnt_age) }}>
                                                                                            {data?.interpretationmakers[index]?.eyeclosed
                                                                                                ? data?.interpretationmakers[index].mfieldtype === 'textbox'
                                                                                                    ? parseFloat(data?.interpretationmakers[index]?.eyeclosed)?.toFixed(2)
                                                                                                    : data?.interpretationmakers[index]?.eyeclosed
                                                                                                : '--'}
                                                                                        </div>
                                                                                    </td>
                                                                                </React.Fragment>
                                                                            ))}
                                                                        </tr>
                                                                    </React.Fragment>
                                                                );
                                                            });

                                                        case 'NFB':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">NeuroFeedback</td>
                                                                        {compareData?.map((item: any, i: number) => (
                                                                            <React.Fragment key={item.servicerequest_info?.id + i}>
                                                                                <td className="text-center border-0"></td>
                                                                                <td className="text-center border-0"></td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Eyes Opened</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.neurofeedback_EO ? (
                                                                                    <div dangerouslySetInnerHTML={{ __html: data?.neurofeedback_EO }}></div>
                                                                                ) : (
                                                                                    <div className="col-md-12 text-center">--</div>
                                                                                )}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Eyes Closed</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.neurofeedback_EC ? (
                                                                                    <div dangerouslySetInnerHTML={{ __html: data?.neurofeedback_EC }}></div>
                                                                                ) : (
                                                                                    <div className="col-md-12 text-center">--</div>
                                                                                )}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                </React.Fragment>
                                                            );

                                                        case 'PBM':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">Photobiomodulation</td>
                                                                        {compareData?.map((item: any, i: number) => (
                                                                            <React.Fragment key={item.servicerequest_info?.id + i}>
                                                                                <td className="text-center border-0"></td>
                                                                                <td className="text-center border-0"></td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Pulse Rate (Hz)</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.photobiomodulation_info?.pulse_rate || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Intensity (%)</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.photobiomodulation_info?.intensity || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Location</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.photobiomodulation_info?.location || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Duration (min)</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data?.photobiomodulation_info?.duration || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        /* Supplement */
                                                        case 'Supplementation':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    {/* Supplementation */}
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">Supplementation</td>
                                                                        {compareData?.map((item: any, i: number) => (
                                                                            <React.Fragment key={item.servicerequest_info?.id + i}>
                                                                                <td className="text-center border-0"></td>
                                                                                <td className="text-center border-0"></td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Supplement profile matched to EEG patterns</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'} p-2`} colSpan={2}>
                                                                                {data.com_mdnutritional_supplementation_templ
                                                                                    ?.filter((item: any) => item.ischoices === true && item.nutritional_supplementation_name)
                                                                                    ?.map((item: any) => item.nutritional_supplementation_name)
                                                                                    .join(', ') || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        /* Lifestyle */
                                                        case 'Lifestyle':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    {/* Lifestyle */}
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">Lifestyle</td>
                                                                        {compareData?.map((item: any, i: number) => (
                                                                            <React.Fragment key={item.servicerequest_info?.id + i}>
                                                                                <td className="text-center border-0"></td>
                                                                                <td className="text-center border-0"></td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Lifestyle profile matched to EEG patterns</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <td key={i} className={`p-2 ${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'}`} colSpan={2}>
                                                                                {data.com_lifestyle_templ
                                                                                    ?.filter((item: any) => item.ischoices === true && item.lifestyle_name)
                                                                                    ?.map((item: any) => item.lifestyle_name)
                                                                                    .join(', ') || <div className="col-md-12 text-center">--</div>}
                                                                            </td>
                                                                        ))}
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        /* Medication */
                                                        case 'MED':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    {/* Recommended Medications */}
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">Recommended Medications</td>
                                                                        {compareData?.map((item: any, i: any) => (
                                                                            <React.Fragment key={item.servicerequest_info?.id + i}>
                                                                                <td className="text-center border-0"></td>
                                                                                <td className="text-center border-0"></td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="ps-4 py-2">Neurology review and further workup or treatment recommendations</td>
                                                                        {compareData?.map((data: any, i: number) => (
                                                                            <React.Fragment key={i}>
                                                                                <td className={`${(i + 1) % 2 == 0 ? 'bg-white' : 'bg-aliceblue'} p-2`} colSpan={2}>
                                                                                    {data.com_medic_templ
                                                                                        ?.filter((item: any) => item.ischoices === true)
                                                                                        ?.map((item: any) => item.medication_name)
                                                                                        .join(', ') || <div className="col-md-12 text-center">--</div>}
                                                                                </td>
                                                                            </React.Fragment>
                                                                        ))}
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        case 'Images Only':
                                                            return (
                                                                <React.Fragment key={report.id}>
                                                                    <tr className="headings bg-light">
                                                                        <td className="p-2 border-0 fw-bold">Topography</td>
                                                                        <td className="text-start border-0" colSpan={compareData?.length * 3}>
                                                                            <span
                                                                                className="text-primary text-decoration-underline pointer fs-14"
                                                                                onClick={() =>
                                                                                    showTopo(
                                                                                        compareData.map((data: any) => data.EC_pdr_path),
                                                                                        compareData.map((val: any) => val.servicerequest_info?.encoded_RequestNumber),
                                                                                        compareData.map((item: any) => item.servicerequest_info?.created_on),
                                                                                        compareData.map((data: any) => data.FFT_absolute_power_path),
                                                                                        compareData.map((data: any) => data.EC_FFT_absolute_power_path),
                                                                                        compareData.map((data: any) => data.EO_Z_scored_FFT_absolute_power),
                                                                                        compareData.map((item: any) => item.EC_Z_scored_FFT_absolute_power),
                                                                                        compareData.map((data: any) => data.EO_absolutepow_path),
                                                                                        compareData.map((item: any) => item.EC_absolutepow_path),
                                                                                        compareData.map((item: any) => item.EO_relativepow_path),
                                                                                        compareData.map((item: any) => item.EC_relativepow_path),
                                                                                        compareData.map((item: any) => item.EO_FFT_relative_power_path),
                                                                                        compareData.map((item: any) => item.EC_FFT_relative_power_path),
                                                                                        compareData.map((item: any) => item.EO_result_edf_graph),
                                                                                        compareData.map((item: any) => item.EC_result_edf_graph),
                                                                                        cmpData?.data?.length,
                                                                                    )
                                                                                }
                                                                            >
                                                                                Click here to see the comparison result <FileTextOutlined size={12} />
                                                                            </span>
                                                                        </td>
                                                                    </tr>
                                                                </React.Fragment>
                                                            );
                                                        default:
                                                            return null;
                                                    }
                                                })}
                                            </>
                                        </tbody>
                                    </table>
                                ) : (
                                    <TopographImages topoInfo={topoInfo} />
                                )}
                            </div>
                        ) : (
                            <div className="text-center mt-4">
                                <Image src={NoReportIcon} preview={false} />
                                <h5 className="text-secondary">Select Reports to compare</h5>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportComparison;
