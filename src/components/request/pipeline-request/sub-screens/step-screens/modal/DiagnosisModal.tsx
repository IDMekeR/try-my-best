import React, { useEffect, useState } from 'react';
import { message, Modal } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { Select, Form } from 'components/shared/FormComponent';
import { useLocation } from 'react-router-dom';
import { saveAssociateCommon } from 'services/actions/commonServiceAction';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { getAllRequestTag, saveRequestTag } from 'services/actions/pipeline/stepwizardAction';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    getCommonService: () => void;
    type: string;
}
const DiagnosisModal: React.FC<ChildProps> = ({ openModal, closeModal, getCommonService, type }) => {
    const [form] = Form.useForm();
    const location = useLocation();
    const dispatch = useDispatch();
    const { commonInfo, loading5, loading6, success6, error6 } = useSelector((state: any) => state.commonData);
    const { reqTagInfo, loading8, loading9, success9, error9 } = useSelector((state: any) => state.wizard);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success6 : false;
    const [showErrormsg, setShowErrormsg] = useState(false);
    const errormsg = showErrormsg ? error6 : false;
    //tags
    const [showSuccessmsg1, setShowSuccessmsg1] = useState(false);
    const successmsg1 = showSuccessmsg1 ? success9 : false;
    const [showErrormsg1, setShowErrormsg1] = useState(false);
    const errormsg1 = showErrormsg1 ? error9 : false;

    const options = commonInfo?.diagnosis
        ?.filter((item: any) => !item?.ischoices)
        ?.map((item: any) => {
            return {
                label: item?.diagnosis_name,
                value: item?.id,
            };
        });

    const options2 = commonInfo?.symptoms
        ?.filter((item: any) => !item?.ischoices)
        ?.map((item: any) => {
            return {
                label: item?.symptoms_name,
                value: item?.id,
            };
        });

    const option3 = commonInfo?.mdnutritional_supplementation_templ
        ?.filter((item: any) => !item?.ischoices)
        ?.map((item: any) => {
            return {
                label: item?.nutritional_supplementation_name,
                value: item?.id,
            };
        });

    const option4 = commonInfo?.lifestyle_templ
        ?.filter((item: any) => !item?.ischoices)
        ?.map((item: any) => {
            return {
                label: item?.lifestyle_name,
                value: item?.id,
            };
        });

    const option5 = commonInfo?.medic_templ
        ?.filter((item: any) => !item?.ischoices)
        ?.map((item: any) => {
            return {
                label: item?.medication_name,
                value: item?.id,
            };
        });

    const reqTagNames = commonInfo?.patient_tag?.map((item: any) => item?.TagName?.toString()) || [];
    const uniqueOptions = Array.from(new Set(reqTagInfo?.data?.map((item: any) => item.TagName)))?.map((tagName) => ({
        label: tagName,
        value: tagName,
    }));
    const option6 = uniqueOptions
        ?.filter((tag: any) => !reqTagNames.includes(tag.value))
        ?.map((item: any) => {
            return {
                label: item.value,
                value: item.value,
            };
        });
    const selectedSupp = commonInfo?.mdnutritional_supplementation_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
    const selectedLyf = commonInfo?.lifestyle_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];
    const selectedMedic = commonInfo?.medic_templ?.filter((item: any) => item?.ischoices)?.map((item: any) => item.id) || [];

    function getAllTags() {
        dispatch(getAllRequestTag() as any);
    }

    useEffect(() => {
        getAllTags();
    }, []);

    const saveDiagnosis = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                service_request_id: location.state?.id,
                diagnosis_tps: type === '1' ? value?.diagnosis?.toString() || '' : '',
                undiagnosis_tps: '',
                symptoms_tps: type === '2' ? value?.diagnosis?.toString() || '' : '',
                unsymptoms_tps: '',
                medic_tmpl_size: '',
                lifestyle_templ: type === '4' ? value?.diagnosis?.toString() + ',' + selectedLyf?.toString() || '' : '',
                unlifestyle_templ: '',
                lifestyle_templ_size: '',
                nutritional_supplementation_size: '',
                medic_tmpl: type === '5' ? value?.diagnosis?.toString() + ',' + selectedMedic?.toString() || '' : '',
                unmedic_tmpl: '',
                nutritional_supplementation: type === '3' ? value?.diagnosis?.toString() + ',' + selectedSupp?.toString() || '' : '',
                unnutritional_supplementation: '',
            };
            dispatch(saveAssociateCommon(inputJson) as any);
            setShowErrormsg(true);
            setShowSuccessmsg(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    const saveTags = async () => {
        try {
            const value = await form.validateFields();
            const inputJson = {
                tags: value?.diagnosis?.toString(),
                patientid: commonInfo?.patient_info?.pntid || 0,
                servicerequestid: location?.state?.id,
            };
            dispatch(saveRequestTag(inputJson) as any);
            setShowErrormsg1(true);
            setShowSuccessmsg1(true);
        } catch (error: any) {
            console.log('error', error);
        }
    };

    useEffect(() => {
        if (successmsg) {
            message.success(
                `${type === '1' ? 'Diagnosis' : type == '2' ? 'Symptoms' : type == '3' ? 'Supplement' : type === '4' ? 'Lifestyle' : 'Medication'} associated to this request successfully`,
            );
            setShowSuccessmsg(false);
            closeModal();
            getCommonService();
            form.resetFields();
        }
        if (errormsg) {
            message.error(
                `${type === '1' ? 'Diagnosis' : type == '2' ? 'Symptoms' : type == '3' ? 'Supplement' : type === '4' ? 'Lifestyle' : 'Medication'} couldn't be associated to this request`,
            );
            setShowErrormsg(false);
        }
    }, [successmsg, errormsg]);

    useEffect(() => {
        if (successmsg1) {
            message.success(`Tags associated to this request successfully`);
            setShowSuccessmsg1(false);
            closeModal();
            getCommonService();
            form.resetFields();
        }
        if (errormsg1) {
            message.error(`Tags couldn't be associated to this request`);
            setShowErrormsg1(false);
        }
    }, [successmsg1, errormsg1]);

    return (
        <div>
            <Modal
                title={`Associate ${type === '1' ? 'Diagnosis' : type === '2' ? 'Symptoms' : type === '3' ? 'Supplement' : type === '4' ? 'Lifestyle' : type === '5' ? 'Recommended Medication' : 'Associate Tags'} `}
                confirmLoading={loading6 || loading9}
                open={openModal}
                onCancel={() => {
                    closeModal();
                    form.resetFields();
                }}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
                onOk={type === '6' ? saveTags : saveDiagnosis}
                okText="Save"
            >
                <Form form={form} layout="vertical">
                    {type === '3' || type === '4' || type === '5' ? (
                        <>
                            <Form.Item
                                name="diagnosis"
                                label={type == '3' ? 'Select Supplement' : type === '4' ? 'Select Lifestyle' : 'Select Medicine'}
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Select
                                    options={type === '3' ? option3 : type === '4' ? option4 : option5}
                                    mode="multiple"
                                    className="w-100"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    maxCount={
                                        type === '3'
                                            ? option3?.length === 4
                                                ? 2
                                                : option3?.length === 3
                                                  ? 1
                                                  : 0
                                            : type === '4'
                                              ? option4?.length === 4
                                                  ? 2
                                                  : option4?.length === 3
                                                    ? 1
                                                    : 0
                                              : 
                                              selectedMedic?.length < 4
                                                    ? 4 - selectedMedic?.length 
                                                    : 0
                                            //   selectedMedic?.length === 1
                                            //     ? 3
                                            //     : selectedMedic?.length === 2
                                            //       ? 2
                                            //       : selectedMedic?.length === 3
                                            //         ? 1
                                            //         : 0
                                    }
                                    filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                    notFoundContent={
                                        <div className="text-center p-4">
                                            {loading5 ? (
                                                <span>
                                                    <LoadingOutlined />
                                                    Loading...
                                                </span>
                                            ) : (
                                                <span>No {type === '3' ? 'supplement' : type === '4' ? 'lifestyle' : 'medicine'} available</span>
                                            )}
                                        </div>
                                    }
                                />
                            </Form.Item>
                            <div className="text-warn">
                                Note: You can associate only {type === '3' ? 'two supplement' : type === '4' ? 'two lifestyle' : 'four medications'} to this request
                            </div>
                        </>
                    ) : type === '6' ? (
                        <>
                            <Form.Item name="diagnosis" label="Select Tags" rules={[{ required: true, message: 'This field is required' }]}>
                                <Select
                                    options={option6}
                                    mode="tags"
                                    className="w-100"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                    notFoundContent={
                                        <div className="text-center p-4">
                                            {loading8 ? (
                                                <span>
                                                    <LoadingOutlined />
                                                    Loading...
                                                </span>
                                            ) : (
                                                <span>No Tags available</span>
                                            )}
                                        </div>
                                    }
                                />
                            </Form.Item>
                        </>
                    ) : (
                        <>
                            <Form.Item
                                name="diagnosis"
                                label={type === '1' ? 'Select Diagnosis' : type == '2' ? 'Select Symptoms' : 'Select Medication'}
                                rules={[{ required: true, message: 'This field is required' }]}
                            >
                                <Select
                                    options={type === '1' ? options : type === '2' ? options2 : option5}
                                    mode="multiple"
                                    className="w-100"
                                    getPopupContainer={(trigger) => trigger.parentNode}
                                    filterOption={(input: any, option: any) => (option?.label ?? '')?.toLowerCase().includes(input.toLowerCase())}
                                    notFoundContent={
                                        <div className="text-center p-4">
                                            {loading5 ? (
                                                <span>
                                                    <LoadingOutlined />
                                                    Loading...
                                                </span>
                                            ) : (
                                                <span>No {type === '1' ? 'diagnosis' : type == '2' ? 'symptoms' : 'medication'} available</span>
                                            )}
                                        </div>
                                    }
                                />
                            </Form.Item>
                        </>
                    )}
                </Form>
            </Modal>
        </div>
    );
};

export default DiagnosisModal;
