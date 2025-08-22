import React, { useEffect, useState } from 'react';
import { Input } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { savePhotobiomodulation } from 'services/actions/pipeline/recordingAnalysisAction';
import { useLocation } from 'react-router-dom';
import { message } from 'components/shared/AntComponent';
import { getAssociateCommon } from 'services/actions/commonServiceAction';

interface ChildProps {
    handlePbmChange: () => void;
    getCommonService: () => void;
    pbmArr: any;
}
const PbmEditor: React.FC<ChildProps> = ({ handlePbmChange, getCommonService, pbmArr }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const { commonInfo } = useSelector((state: any) => state.commonData);
    const { loading10, loading11, success11, error11 } = useSelector((state: any) => state.recAnalysis);
    const [showsuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showsuccessmsg ? success11 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error11 : false;
    const [pbmArr1, setPbmArr1] = useState([
        { id: 1, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 2, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 3, pulse_rate: '', intensity: '', location: '', duration: '' },
        { id: 4, pulse_rate: '', intensity: '', location: '', duration: '' },
    ]);

    const handleChangePmb = (val: any, name: any, e: any) => {
        if (name == 'pulse_rate') {
            setPbmArr1((current) =>
                current.map((obj) => {
                    if (obj.id == val.id) {
                        return { ...obj, pulse_rate: e.target.value };
                    }
                    return obj;
                }),
            );
        } else if (name == 'intensity') {
            setPbmArr1((current) =>
                current.map((obj) => {
                    if (obj.id == val.id) {
                        return { ...obj, intensity: e.target.value };
                    }
                    return obj;
                }),
            );
        } else if (name == 'location') {
            setPbmArr1((current) =>
                current.map((obj) => {
                    if (obj.id == val.id) {
                        return { ...obj, location: e.target.value };
                    }
                    return obj;
                }),
            );
        } else {
            setPbmArr1((current) =>
                current.map((obj) => {
                    if (obj.id == val.id) {
                        return { ...obj, duration: e.target.value };
                    }
                    return obj;
                }),
            );
        }
    };

    const submitPbmForm = () => {
        const inputJson = {
            sr_photobiomodulation: commonInfo?.photobiomodulation_info?.id || 0,
            service_request: location.state?.id,
            pulse_rate: pbmArr1
                ?.map((item: any) => item.pulse_rate || null)
                .filter(Boolean)
                .join(','),
            intensity: pbmArr1
                .map((item: any) => item.intensity || null)
                .filter(Boolean)
                .join(','),
            location: pbmArr1
                .map((item: any) => item.location || null)
                .filter(Boolean)
                .join(','),
            duration: pbmArr1
                .map((item: any) => item.duration || null)
                .filter(Boolean)
                .join(','),
            description: '',
        };
        dispatch(savePhotobiomodulation(inputJson) as any);
        setShowSuccessmsg(true);
        setShowErrormsg(true);
    };
    useEffect(() => {
        if (pbmArr) {
            // const duration = commonInfo?.photobiomodulation_info?.duration?.split(',');
            // const intensity = commonInfo?.photobiomodulation_info?.intensity?.split(',');
            // const location = commonInfo?.photobiomodulation_info?.location?.split(',');
            // const pulse_rate = commonInfo?.photobiomodulation_info?.pulse_rate?.split(',');
            // const rowData = pbmArr;
            // for (let i = 0; i < rowData?.length; i++) {
            //     if (duration?.length > 0) {
            //         rowData[i].duration = duration[i] || '';
            //     } else {
            //         rowData[i].duration = '';
            //     }
            //     if (intensity?.length > 0) {
            //         rowData[i].intensity = intensity[i] || '';
            //     } else {
            //         rowData[i].intensity = '';
            //     }
            //     if (location?.length > 0) {
            //         rowData[i].location = location[i] || '';
            //     } else {
            //         rowData[i].location = '';
            //     }
            //     if (pulse_rate?.length > 0) {
            //         rowData[i].pulse_rate = pulse_rate[i] || '';
            //     } else {
            //         rowData[i].pulse_rate = '';
            //     }
            // }
            // setPbmArr1(rowData);
            setPbmArr1(pbmArr);
        }
    }, [pbmArr]);

    useEffect(() => {
        if (successmsg) {
            message.success('Photobiomodulation saved successfully');
            setShowSuccessmsg(false);
            handlePbmChange();
            getCommonServices();
        }
        if (errormsg) {
            if (error11?.data) {
                message.error(error11?.data);
            } else {
                message.error("Photobiomodulation couldn't be saved");
            }
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    function getCommonServices() {
        const inputJson = {
            service_request_id: location.state?.id,
        }
        dispatch(getAssociateCommon(inputJson) as any);
    }
    return (
        <div className="col">
            <table className="w-100">
                <thead>
                    <tr>
                        <th className="text-center">Pulse Rate (Hz)</th>
                        <th className="text-center">Intensity (%)</th>
                        <th className="text-center">Location </th>
                        <th className="text-center">Duration (min)</th>
                    </tr>
                </thead>
                <tbody>
                    {pbmArr1?.map((item: any) => {
                        return (
                            <tr key={item.id}>
                                <td>
                                    <Input className="temp-input text-center" value={item.pulse_rate} defaultValue={item.pulse_rate} onChange={(e) => handleChangePmb(item, 'pulse_rate', e)} />
                                </td>
                                <td>
                                    <Input className="temp-input text-center" value={item.intensity} defaultValue={item.intensity} onChange={(e) => handleChangePmb(item, 'intensity', e)} />
                                </td>
                                <td>
                                    <Input className="temp-input text-center" value={item.location} defaultValue={item.location} onChange={(e) => handleChangePmb(item, 'location', e)} />
                                </td>
                                <td>
                                    <Input className="temp-input text-center" value={item.duration} defaultValue={item.duration} onChange={(e) => handleChangePmb(item, 'duration', e)} />
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <div className="text-end mt-2">
                <Button type="primary" className="m-2" loading={loading11} onClick={submitPbmForm}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default PbmEditor;
