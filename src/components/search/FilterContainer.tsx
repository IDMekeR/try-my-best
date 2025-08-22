import React, { useState, useEffect } from 'react';
import { Form, Select, Radio, InputNumber } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { RadioChangeEvent } from 'antd';
import { Modal, Collapse, Space, Tag, Slider, Row, Col } from 'components/shared/AntComponent';
import { PlusOutlined, CloseOutlined, CheckOutlined, SearchOutlined } from 'components/shared/AntIcons';
import axios from 'axios';

const { CheckableTag } = Tag;

const baseurl = 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms';

interface ChildProps {
submitSearch : any;
   data: any;
}

const FilterContainer: React.FC<ChildProps> = ({ submitSearch,data }) => {
    const [diagBoxes, setDiagBoxes]: any = useState([]);

    const [symptomsData, setSymptomsData]: any = useState([]);
    const [tagsData, setTagsData]: any = useState([]);
    const [pastDrugName, setPastDrugName]: any = useState([]);
    const [selectedDiag, setSelectedDiag]: any = useState([]);
    const [selectedSymp, setSelectedSymp]: any = useState([]);
    const [inputValue, setInputValue] = useState({ min: 0, max: 100 });
    const [medicDatapresent, setMedicDataPresent] = useState([]);
    const [medicDatapost, setMedicDataPost] = useState([]);
    const [selectedHand, setSelectedHand] = useState('');
    const [gender, setGender] = useState('');
    const [drugName, setDrugName]: any = useState([]);
    const [modalPrimary, setModalPrimary] = useState(false);
    const [drugOptions, setDrugOptions]: any = useState([]);
    const [drugOptions1, setDrugOptions1]: any = useState([]);
    const [selectRadiobox, setSelectRadioBox] = useState('present');
    const [selectedTag, setSelectedTag]: any = useState([]);
    const diagnosisdata = data?.diagnosisInfo != null ? data?.diagnosisInfo.data : [];
    const symptomsdata = data?.symptomsInfo != null ? data?.symptomsInfo.data : [];
    const tagsOption: any = [];
    const uniqueTagNames = new Set();

    const [selectedTags, setSelectedTags]: any = useState([
        { id: '1', name: 'Age', status: false, selected: false },
        { id: '2', name: 'Gender', status: false, selected: false },
        { id: '3', name: 'Diagnosis', status: false, selected: false },
        { id: '4', name: 'Symptoms', status: false, selected: false },
        { id: '5', name: 'Tags', status: false, selected: false },
        { id: '6', name: 'Medication', status: false, selected: false },
        { id: '7', name: 'Handedness', status: false, selected: false },
    ]);

    const onChange4 = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setGender(value);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, value, diagBoxes, tagsData, symptomsData, selectedHand);
    };
    const onChangeSelect = (value: any) => {
        setSelectedHand(value);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, value);
    };
   
  const onChangeDiagnosis = (value: any) => {
  setSelectedDiag(value);
  data?.callbackFunc(
    false,
    selectedTags,
    inputValue?.min,
    inputValue?.max,
    medicDatapost,
    medicDatapresent,
    gender,
    value,           
    tagsData,
    symptomsData,
    selectedHand
  );
};



const onChangeSymptoms = (value: any) => {
  setSelectedSymp(value);
  data?.callbackFunc(
    false,
    selectedTags,
    inputValue?.min,
    inputValue?.max,
    medicDatapost,
    medicDatapresent,
    gender,
    diagBoxes,
    tagsData,
    value,           
    selectedHand
  );
};
const onChangeTags = (value: any) => {
  setSelectedTag(value);
  data?.callbackFunc(
    false,                 
    value,                
    inputValue?.min,     
    inputValue?.max,       
    medicDatapost,         
    medicDatapresent,     
    gender,              
    diagBoxes,            
    tagsData,              
    symptomsData,          
    selectedHand           
  );
};

const onChangeDrugName = (value: any) => {
  setDrugName(value);
  data?.callbackFunc(
    false,               
    selectedTags,           
    inputValue?.min,       
    inputValue?.max,        
    medicDatapost,          
    medicDatapresent,      
    gender,                 
    diagBoxes,              
    tagsData,               
    symptomsData,          
    selectedHand,           
    value                  
  );
};



    const onChangeInputMinVal = (value: any) => {
        if (inputValue.max > value) {
            setInputValue({ min: value, max: inputValue?.max });
            data?.callbackFunc(false, selectedTags, value, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
        }
    };
    const onChangeInputMaxVal = (value: any) => {
        if (inputValue.min < value) {
            setInputValue({ max: value, min: inputValue?.min });
            data?.callbackFunc(false, selectedTags, inputValue?.min, value, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
        }
    };
    const onChangeInputValue = (value: any) => {
        if (value[0] < value[1]) {
            setInputValue({ min: value[0], max: value[1] });
            data?.callbackFunc(false, selectedTags, value[0], value[1], medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
        }
    };
    const diagnosisOption = diagnosisdata?.map((item: any) => ({
        value: item?.diagnosis_name,
        label: item?.diagnosis_name,
        id: item?.id,
    }));

    data?.tagPatientdata?.forEach((data: any) => {
        if (!uniqueTagNames.has(data?.TagName)) {
            uniqueTagNames.add(data?.TagName);
            tagsOption.push({
                label: data?.TagName,
                value: data?.TagName,
                id: data?.id,
            });
        }
    });

    const symOptions = symptomsdata?.map((sym: any) => {
        return {
            label: sym?.symptoms_name,
            value: sym?.symptoms_name,
            key: sym?.id,
        };
    });
    const handleSelectRadioBox = (e: RadioChangeEvent) => {
        const value = e.target.value;
        setSelectRadioBox(value);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
    };

    async function medicName(value: string) {
        await axios.get(`${baseurl}=${value}`).then((res) => {
            if (res) {
                const arr: any = [];
                const d = res?.data[1];
                for (let i = 0; i < d.length; i++) {
                    arr.push({ value: d[i], label: d[i], id: i });
                }
                setDrugOptions(arr);
            }
        });
    }

    async function medicName1(value: string) {
        await axios.get(`${baseurl}=${value}`).then((res) => {
            if (res) {
                const arr: any = [];

                const d = res?.data[1];
                for (let i = 0; i < d.length; i++) {
                    arr.push({ value: d[i], label: d[i], id: i });
                }
                setDrugOptions1(arr);
            }
        });
    }

    function saveDiagnosis() {
        for (let i = 0; i < selectedDiag.length; i++) {
            setDiagBoxes((current) =>
                current.filter((x: any) => {
                    if (x.id !== selectedDiag[i].id) return x.id;
                }),
            );
        }
        setSelectedDiag([]);
        setDiagBoxes(diagBoxes.concat(selectedDiag));
        data?.callbackFunc(
            false,
            selectedTags,
            inputValue?.min,
            inputValue?.max,
            medicDatapost,
            medicDatapresent,
            gender,
            diagBoxes.concat(selectedDiag),
            tagsData,
            symptomsData,
            selectedHand,
        );
    }

    function removeDiagnosis(diagnosis: any) {
        const newDiag = diagBoxes.filter((_, diag) => diag !== diagnosis);
        setDiagBoxes(newDiag);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, newDiag, tagsData, symptomsData, selectedHand);
    }

    function saveSymptoms() {
        for (let i = 0; i < selectedSymp.length; i++) {
            setSymptomsData((current) =>
                (current || [])?.filter((x: any) => {
                    if (x.id !== selectedSymp[i].id) return x.id;
                }),
            );
        }
        setSelectedSymp([]);
        setSymptomsData(symptomsData.concat(selectedSymp));
        data?.callbackFunc(
            false,
            selectedTags,
            inputValue?.min,
            inputValue?.max,
            medicDatapost,
            medicDatapresent,
            gender,
            diagBoxes,
            tagsData,
            symptomsData.concat(selectedSymp),
            selectedHand,
        );
    }

    function removeSymptoms(symptoms: any) {
        const newSymp = symptomsData?.filter((_, sym) => sym !== symptoms);
        setSymptomsData(newSymp);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, newSymp, selectedHand);
    }

    function saveTags() {
        for (let i = 0; i < selectedTag.length; i++) {
            setTagsData((current) =>
                current?.filter((x) => {
                    if (x.id !== selectedTag[i].id) return x.id;
                }),
            );
        }
        setTagsData(tagsData.concat(selectedTag));
        data?.callbackFunc(
            false,
            selectedTags,
            inputValue?.min,
            inputValue?.max,
            medicDatapost,
            medicDatapresent,
            gender,
            diagBoxes,
            tagsData?.concat(selectedTag),
            symptomsData,
            selectedHand,
        );
        setSelectedTag([]);
    }

    function removeTag(tags: any) {
        const newTags = tagsData?.filter((_, tag) => tag !== tags);
        setTagsData(newTags);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, newTags, symptomsData, selectedHand);
    }

    function saveMedication() {
        setMedicDataPresent(medicDatapresent.concat(drugName));
        setDrugName([]);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent.concat(drugName), gender, diagBoxes, tagsData, symptomsData, selectedHand);
    }

    function removeMedication(medic: any) {
        const newMedic = medicDatapresent?.filter((_, med) => med !== medic);
        setMedicDataPresent(newMedic);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, newMedic, gender, diagBoxes, tagsData, symptomsData, selectedHand);
    }

    function savePastMedication() {
        setMedicDataPost(medicDatapost.concat(pastDrugName));
        setPastDrugName([]);
        data?.callbackFunc(
            false,
            selectedTags,
            inputValue?.min,
            inputValue?.max,
            medicDatapost.concat(pastDrugName),
            medicDatapresent,
            gender,
            diagBoxes,
            tagsData,
            symptomsData,
            selectedHand,
        );
    }

    function removePastMedication(pmedic) {
        const newPastMedic = medicDatapost?.filter((_, med) => med !== pmedic);
        setMedicDataPost(newPastMedic);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, newPastMedic, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
    }

    const handleOkPrimary = () => {
        const tempArr = selectedTags;
        for (let i = 0; i < selectedTags.length; i++) {
            for (let j = 0; j < tempArr.length; j++) {
                if (selectedTags[i].status) {
                    selectedTags[i].selected = true;
                } else {
                    selectedTags[i].selected = false;
                    if (selectedTags[i].id == 1) {
                        setInputValue({ min: 0, max: 100 });
                    } else if (selectedTags[i].id == 2) {
                        setGender('');
                    } else if (selectedTags[i].id == 3) {
                        setSelectedDiag([]);
                        setDiagBoxes([]);
                    } else if (selectedTags[i].id == 4) {
                        setSelectedSymp([]);
                        setSymptomsData([]);
                    } else if (selectedTags[i].id == 5) {
                        setSelectedTag([]);
                        setTagsData([]);
                    } else if (selectedTags[i].id == 7) {
                        setSelectedHand('');
                    } else if (selectedTags[i].id == 6) {
                        setMedicDataPost([]);
                        setMedicDataPresent([]);
                        setDrugName([]);
                        setPastDrugName([]);
                    }
                }
            }
        }
        setModalPrimary(false);
        data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, [], symptomsData, selectedHand);
    };

    const handleCancelPrimary = () => {
        setModalPrimary(false);
        data?.callbackFunc(false);
    };

    function changeFunc(tag: any, checked: any) {
        if (!checked) {
            if (tag.id == 1) {
                setInputValue({ min: 0, max: 100 });
                data?.callbackFunc(false, selectedTags, 0, 100, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, symptomsData, selectedHand);
            } else if (tag.id == 2) {
                setGender('');
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, '', diagBoxes, tagsData, symptomsData, selectedHand);
            } else if (tag.id == 3) {
                setSelectedDiag([]);
                setDiagBoxes([]);
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, [], tagsData, symptomsData, selectedHand);
            } else if (tag.id == 4) {
                setSelectedSymp([]);
                setSymptomsData([]);
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, tagsData, [], selectedHand);
            } else if (tag.id == 5) {
                setSelectedTag([]);
                setTagsData([]);
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, [], symptomsData, selectedHand);
            } else if (tag.id == 7) {
                setSelectedHand('');
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, medicDatapost, medicDatapresent, gender, diagBoxes, [], symptomsData, '');
            } else if (tag.id == 6) {
                setMedicDataPost([]);
                setMedicDataPresent([]);
                setDrugName([]);
                setPastDrugName([]);
                data?.callbackFunc(false, selectedTags, inputValue?.min, inputValue?.max, [], [], gender, diagBoxes, tagsData, symptomsData, selectedHand);
            }
        }
    }

    const handleChange = (tag, checked) => {
        setSelectedTags((current) =>
            current?.map((obj) => {
                if (obj.id == tag.id) {
                    return { ...obj, status: checked };
                }
                return obj;
            }),
        );
        changeFunc(tag, checked);
    };

    useEffect(() => {
        if (data?.isOpen) {
            setModalPrimary(data?.isOpen);
        }
    }, [data?.isOpen]);

    function renderContent(id) {
        return (
            <div>
                {id === '1' ? (
                    <div>
                        <Form.Item label="Range">
                            <Form.Item className="mx-2 d-inline-block mb-0 form-item-width">
                                <InputNumber min={0} max={100} value={[inputValue?.min]} onChange={onChangeInputMinVal} />
                            </Form.Item>
                            <Form.Item className="mx-1 d-inline-block mb-0 form-item-width">
                                <InputNumber min={0} max={100} value={[inputValue?.max]} onChange={onChangeInputMaxVal} />
                            </Form.Item>
                        </Form.Item>
                        <Slider
                            tooltip={{
                                open: false,
                            }}
                            min={0}
                            max={100}
                            className="slider-width"
                            onChange={onChangeInputValue}
                            range
                            value={[inputValue?.min, inputValue?.max]}
                        />
                    </div>
                ) : id === '2' ? (
                    <Radio.Group onChange={onChange4} className="w-100 text-center mx-auto">
                        <Row className="w-100 text-center mx-auto">
                            <Col span={6}>
                                {' '}
                                <Radio.Button value="Male">Male</Radio.Button>
                            </Col>
                            <Col span={6}>
                                <Radio.Button value="Female">Female</Radio.Button>
                            </Col>
                            <Col span={6}>
                                {' '}
                                <Radio.Button value="Others">Others</Radio.Button>
                            </Col>
                        </Row>
                    </Radio.Group>
                ) : id === '3' ? (
                    <div>
                        <div className="row g-0 mb-2 p-2">
                           <div className="col-md-11">
                           <Select
                              className="custom-size"
                              size="large"
                               mode="multiple"
                               allowClear
                              value={selectedDiag}
                             placeholder="Select Diagnosis"
                            onChange={onChangeDiagnosis}
                           options={diagnosisOption}
                            />
                              </div>


                            {/* <Button className="col-md-1 pt-1 px-1  search-btn border bg-white" size="large" disabled={selectedDiag === '' ? true : false} onClick={saveDiagnosis}>
                                <CheckOutlined className="bg-white  but-add " />
                            </Button> */}
                        </div>
                        <div className="">
                            {/* row container bg-white m-0 p-2 border rounded textarea-vh */}
                            {diagBoxes?.map((diagnosis: any, id: any) => {
                                return (
                                    <div className="tag-list col-md-auto rounded p-1 ps-2" key={id}>
                                        {diagnosis} <CloseOutlined className="ms-2" onClick={() => removeDiagnosis(id)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : id === '4' ? (
                    <div>
                        <div className="row g-0 mb-2 pt-2 m-0 p-2">
                            <Select
                                className="col-md-11 border-end-0 rounded custom-size"
                                value={selectedSymp}
                                allowClear
                                size="large"
                                mode="multiple"
                                placeholder=""
                                onChange={(e) => onChangeSymptoms(e)}
                                options={symOptions}
                            />
                            {/* <Button className="col-md-1 pt-1 px-1  search-btn  border bg-white" size="large" disabled={selectedSymp === '' ? true : false} onClick={saveSymptoms}>
                                <CheckOutlined className="bg-white  but-add " />
                            </Button> */}
                        </div>
                        <div className="">
                            {/* row container bg-white m-0 p-2 border rounded textarea-vh */}
                            {symptomsData?.map((symptoms: any, id: any) => {
                                return (
                                    <div className="tag-list col-md-auto rounded p-1 ps-2" key={id}>
                                        {symptoms} <CloseOutlined className="ms-2" onClick={() => removeSymptoms(id)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : id === '5' ? (
                    <div>
                        <div className="row g-0 mb-2">
                            <Select
                                className="col-md-11 border-end-0 rounded custom-size"
                                value={selectedTag}
                                allowClear
                                size="large"
                                mode="multiple"
                                placeholder=""
                                onChange={(e) => onChangeTags(e)}
                                options={tagsOption}
                            />
                            {/* <Button className="col-md-1 pt-1 px-1   search-btn border bg-white" size="large" disabled={selectedTag === '' ? true : false} onClick={() => saveTags()}>
                                <CheckOutlined className="bg-white  ps-1" />
                            </Button> */}
                        </div>
                        <div className="">
                            {/* row container bg-white m-0 p-2 border rounded textarea-vh */}
                            {tagsData?.map((tag, id) => {
                                return (
                                    <div className="tag-list col-md-auto m-1 rounded p-1 ps-2" key={id}>
                                        {tag} <CloseOutlined className="ms-2" onClick={() => removeTag(id)} />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : id === '6' ? (
                    <div>
                        <Radio.Group defaultValue="present" buttonStyle="solid" className="my-2 rounded-1 border-0 " onChange={(e) => handleSelectRadioBox(e)}>
                            <Radio.Button value="present">Present</Radio.Button>
                            <Radio.Button value="past">Past</Radio.Button>
                        </Radio.Group>
                        {selectRadiobox === 'present' ? (
                            <>
                                <div className="row g-0 my-2">
                                    <Select
                                        className="col-md-11 border-end-0 rounded custom-size"
                                        showSearch
                                        notFoundContent={
                                            <div className="text-center p-4 ">
                                                <SearchOutlined className="pe-2 pb-2" />
                                                Search to find medicine
                                            </div>
                                        }
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        size="large"
                                        value={drugName}
                                        onSearch={medicName}
                                        options={drugOptions}
                                        defaultValue={drugName}
                                        onChange={(e) => onChangeDrugName(e)}
                                    />
                                    {/* <Button className="col-md-1 pt-1 px-0 search-btn border bg-white" size="large" disabled={drugName === '' ? true : false} onClick={() => saveMedication()}>
                                        <CheckOutlined className="bg-white p-0" />
                                    </Button> */}
                                </div>
                                <div className="">
                                    {/* row container bg-white m-0 p-2 border rounded textarea-vh */}
                                    {medicDatapresent?.map((medic, id) => {
                                        return (
                                            <div className="tag-list col-md-auto m-1 rounded py-1" key={id}>
                                                {medic} <CloseOutlined className="ms-2" onClick={() => removeMedication(id)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="row g-0 my-2">
                                    <Select
                                        className="col-md-11 border-end-0 rounded custom-size"
                                        showSearch
                                        notFoundContent={
                                            <div className="text-center p-4">
                                                <SearchOutlined className="pe-2 pb-2" />
                                                Search to find medicine
                                            </div>
                                        }
                                        size="large"
                                        value={pastDrugName}
                                        getPopupContainer={(trigger) => trigger.parentNode}
                                        onSearch={medicName1}
                                        options={drugOptions1}
                                        defaultValue={pastDrugName}
                                        onChange={(e) => setPastDrugName(e)}
                                    />
                                    {/* <Button
                                        className="col-md-1 pt-1 px-1 h-100 px-0 search-btn border bg-white"
                                        size="large"
                                        disabled={pastDrugName === '' ? true : false}
                                        onClick={() => savePastMedication()}
                                    >
                                        <CheckOutlined className="bg-white  p-0" color="#5A53B2" size={23} />
                                    </Button> */}
                                </div>
                                <div className="">
                                    {/* row container bg-white m-0 p-2 border rounded textarea-vh */}
                                    {medicDatapost?.map((medic, id) => {
                                        return (
                                            <div className="tag-list col-md-auto m-1 rounded p-1" key={id}>
                                                {medic} <CloseOutlined className="ms-2" onClick={() => removePastMedication(id)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>
                ) : id === '7' ? (
                    <div>
                        <Select
                            className="w-100"
                            size="large"
                            showSearch
                            placeholder=""
                            optionFilterProp="children"
                            onChange={onChangeSelect}
                            options={[
                                {
                                    value: 'lefthand',
                                    label: 'Left Hand',
                                },
                                {
                                    value: 'righthand',
                                    label: 'Right Hand',
                                },
                            ]}
                        />
                    </div>
                ) : (
                    ''
                )}
            </div>
        );
    }

    const items1 = selectedTags?.map((item) => {
        return {
            key: item?.id,
            label: item?.name,
            children: <div>{renderContent(item?.id)}</div>,
            selected: item?.selected,
        };
    });
    const selectedItems = items1?.filter((item) => item.selected);

    return (
        <div className="primary-filter">
            <Collapse className="bg-white custom-collapse" accordion bordered={false} expandIcon={({ isActive }) => <PlusOutlined rotate={isActive ? 50 : 0} />} items={selectedItems} />
            <Modal
                title="Add Primary Criteria"
                className="primary-filter-modal"
                open={modalPrimary}
                onOk={() => handleOkPrimary()}
                onCancel={handleCancelPrimary}
                width="560px"
                maskClosable={false}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                <Space size={[20, 20]} wrap>
                    {selectedTags?.map((tag) => (
                        <CheckableTag className="py-2 text-center items-checkabletag fs-13 fw-bold " key={tag.id} checked={tag.status} onChange={(checked) => handleChange(tag, checked)}>
                            {tag.name}
                        </CheckableTag>
                    ))}
                </Space>
            </Modal>
        </div>
    );
};

export default FilterContainer;
