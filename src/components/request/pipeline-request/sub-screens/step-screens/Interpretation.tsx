import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { InputNumber, Radio , Checkbox} from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { message, Spin } from 'components/shared/AntComponent';
import { getRequestAssMarkers, saveInterpretationMarker } from 'services/actions/pipeline/stepwizardAction';
import { useLocation } from 'react-router-dom';
import { getAssociateCommon } from 'services/actions/commonServiceAction';

const Interpretation: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { assMarkerInfo, success3, loading3, error3, loading } = useSelector((state: any) => state.wizard);
    const [markerData, setMarkerData] : any = useState([]);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success3 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error3 : false;

    useEffect(() => {
        if (assMarkerInfo?.data && assMarkerInfo?.data?.length > 0) {
            setMarkerData(assMarkerInfo?.data);
        }
    }, [assMarkerInfo]);

    const changeInputField = (id: any, type: string, e: any, field: string) => {
        if (field === 'text') {
            if (type === 'open') {
                setMarkerData((current: any) =>
                    current.map((obj: any) => {
                        if (obj.id === id) {
                            return { ...obj, eyeopen: e };
                        }

                        return obj;
                    }),
                );
            } else {
                setMarkerData((current: any) =>
                    current.map((obj: any) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: e };
                        }

                        return obj;
                    }),
                );
            }
        } else {
            if (e.target.value === 'open') {
                setMarkerData((current: any) =>
                    current.map((obj: any) => {
                        if (obj.id === id) {
                            return { ...obj, eyeopen: e.target.checked?.toString(), eyeclosed: 'false' };
                        }

                        return obj;
                    }),
                );
            } else {
                setMarkerData((current: any) =>
                    current.map((obj: any) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: e.target.checked?.toString(), eyeopen: 'false' };
                        }

                        return obj;
                    }),
                );
            }
        }
    };

    const handleRadioChangeOpened = (id, val) => (e) => {
        if (val == 'open') {
            if (e.target.checked === true) {
                setMarkerData((current: any) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: 'false', eyeopen: 'true' };
                        }
                        return obj;
                    })
                );
            } 
        } else {
            if (e.target.checked === true) {
                setMarkerData((current: any) =>
                    current.map((obj) => {
                        if (obj.id === id) {
                            return { ...obj, eyeclosed: 'true', eyeopen: 'false' };
                        }
                        return obj;
                    })
                );
            }
        }
    };

    const handleCheckboxChange = (id: number) => (selectedValues: string[]) => {
        setMarkerData((current: any[]) => // Ensure current is an array
            current.map((obj: any) => { // Ensure obj is an object
                if (typeof obj === 'object' && obj !== null && obj.id === id) {
                    return {
                        ...obj, // Ensure obj is spreadable
                        eyeopen: selectedValues.includes('eyeopen') ? 'true' : 'false',
                        eyeclosed: selectedValues.includes('eyeclosed') ? 'true' : 'false',
                    };
                }
                return obj;
            })
        );
    };

    const submitForm = () => {
        const markerArr: any = [];
        markerData?.forEach((items: any) => {
            markerArr.push({
                id: items.id,
                checked: 'true',
                eyeopen: items.eyeopen || '',
                eyeclosed: items.eyeclosed || '',
            });
        });
        dispatch(saveInterpretationMarker(markerArr) as any);
        setShowErrormsg(true);
        setShowSuccessmsg(true);
    };
    function getMarkers() {
        const inputJson = {
            sr_interpretation: location.state?.id,
        };
        dispatch(getRequestAssMarkers(inputJson) as any);
    }

    function getCommonService() {
        const inputJson = {
            service_request_id: location.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }

    useEffect(() => {
        if (successmsg) {
            setShowSuccessmsg(false);
            message.success('Interpretation saved successfully');
            getCommonService();
            getMarkers();
        }
        if (errormsg) {
            if (error3?.data) {
                message.error(error3?.data);
            } else {
                message.error("Interpretation couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    return (
        <div className="h-100 interpretation-wizard">
            <div className="bg-white p-3 h-100">
                <h6 className="fs-17">Interpretation Markers</h6>
                <Spin spinning={loading}>
                    <div className="mt-3">
                        <div className="row m-0 bg-light p-3">
                            {markerData?.map((item: any, index: any) => {
                                return (
                                    <div className={`col-md-6 mb-4 ${index % 2 === 0 ? '' : ''}`} key={item.id}>
                                        <label className="fs-16 fw-bold">{item.markername}</label>
                                        <div className="mt-2">
                                            {item.mfieldtype?.toLowerCase() === 'textbox' || item.mfieldtype?.toLowerCase() === 'text' ? (
                                                <div className="d-flex bg-white py-1 px-3">
                                                    {item.EC_isactive ? (
                                                        <div className="col-md-6">
                                                            <div className="d-flex">
                                                                <div className="fs-15 marker-name">Eyes Closed</div>
                                                                <div className="col-auto ms-auto text-danger fs-12 my-auto">(Expected 8.0-12.0)</div>
                                                            </div>
                                                            <InputNumber
                                                                className="w-100"
                                                                defaultValue={item.eyeclosed}
                                                                onChange={(e: any) => changeInputField(item.id, 'closed', e, 'text')}
                                                            />
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                    {item.EO_isactive ? (
                                                        <div className="col ms-2">
                                                            <div className="d-flex">
                                                                <div className="fs-15 marker-name">Eyes Opened</div>
                                                                <div className="col-auto ms-auto text-danger fs-12 my-auto">(Expected 8.0-12.0)</div>
                                                            </div>
                                                            <InputNumber
                                                                className="w-100"
                                                                defaultValue={item.eyeopen}
                                                                onChange={(e: any) => changeInputField(item.id, 'open', e, 'text')}
                                                            />
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            ) : (
                                                // <Radio.Group
                                                //     className="bg-white px-3 py-4 w-100"
                                                //     value={item.eyeopen == 'true' ? 'eyeopen' : item.eyeclosed == 'true' ? 'eyeclosed' : ''}
                                                //     defaultValue={item.eyeopen == 'true' ? 'eyeopen' : item.eyeclosed == 'true' ? 'eyeclosed' : ''}
                                                //     onChange={(e: any) => changeInputField(item.id, '', e, 'radio')}
                                                // >
                                                //     <Radio value="eyeclosed">Eye Closed </Radio>
                                                //     <Radio value="eyeopen">Eye Open</Radio>
                                                // </Radio.Group>
                                                // <Radio.Group className=" bg-white px-3 py-4 w-100 d-flex"
                                                //  value={item.eyeopen == 'true' ? 'eyeopen' : item.eyeclosed == 'true' ? 'eyeclosed' : null}
                                              
                                                //  >

                                                //     {item.EO_isactive == true ? (
                                                //         <Radio
                                                //             value="eyeopen"
                                                //             disabled={location.state.archive}
                                                //             defaultChecked={item?.eyeopen?.toLowerCase() == 'true' ? true : false}
                                                //             onChange={handleRadioChangeOpened(item.id, 'open')}
                                                //             className="w-50"
                                                //         >
                                                //             Eye Opened
                                                //         </Radio>
                                                //     ) : (
                                                //         ''
                                                //     )}
                                                //     {item.EC_isactive == true ? (
                                                //         <Radio
                                                //             value="eyeclosed"
                                                //             disabled={location.state.archive}
                                                //             defaultChecked={item?.eyeclosed?.toLowerCase() == 'true' ? true : false}
                                                //             onChange={handleRadioChangeOpened(item.id, 'close')}
                                                //         >
                                                //             Eye Closed
                                                //         </Radio>
                                                //     ) : (
                                                //         ''
                                                //     )}
                                                // </Radio.Group>

                                                <Checkbox.Group
                                                className="bg-white px-3 py-4 w-100 d-flex"
                                                value={[
                                                  item.eyeopen === 'true' ? 'eyeopen' : null,
                                                  item.eyeclosed === 'true' ? 'eyeclosed' : null,
                                                ].filter(Boolean)} // Remove null values
                                                onChange={handleCheckboxChange(item.id)} // Pass item.id properly
                                              >
                                                {item.EO_isactive && (
                                                  <Checkbox value="eyeopen" disabled={location.state.archive} className="w-50">
                                                    Eyes Opened
                                                  </Checkbox>
                                                )}
                                              
                                                {item.EC_isactive && (
                                                  <Checkbox value="eyeclosed" disabled={location.state.archive}>
                                                    Eyes Closed
                                                  </Checkbox>
                                                )}
                                              </Checkbox.Group>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-3 text-end">
                            <Button type="primary" loading={loading3} onClick={() => submitForm()}>
                                Save
                            </Button>
                        </div>
                    </div>
                </Spin>
            </div>
        </div>
    );
};

export default Interpretation;
