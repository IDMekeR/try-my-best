import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TableProps } from 'antd';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { Form, Select, Radio } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Modal, Tooltip, Slider, Table, Row, Empty } from 'components/shared/AntComponent';
import { amazonSearchTable, amazonSearch } from 'services/actions/searchAction';
import { getDiagnosisList } from 'services/actions/master-data/diagnosisAction';
import { getMedicationList } from 'services/actions/master-data/medicationAction';
import { getSymptomsList } from 'services/actions/master-data/diagnosisAction';
import { getAutomateInterpretationList } from 'services/actions/master-data/interpretationAction';
import { allPatientTag } from 'services/actions/commonServiceAction';
import { CloseOutlined, LoadingOutlined, AlignLeftOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import FilterContainer from './FilterContainer';

type RatioData = {
    ratio: string | undefined;
    ratioVal: string | undefined;
    location: string | undefined;
    minval: number | boolean;
    maxval: number | boolean;
    type: string;
    mode: string;
};

type FDataItem = {
    rule_id: string | undefined;
    start_on: number | boolean;
    end_on: number | boolean;
    type: string;
};

interface DataType {
    id: any;
    encoded_RequestNumber: any;
    archive_data: any;
    patient_name: any;
    action: any;
    status: any;
    is_billing: any;
}

const { Option } = Select;

const AmazonSearch: React.FC = () => {
    const history = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const userRole = sessionStorage.getItem('role');
    const { amazonSrchTbl, amazonSrch, loading1, loading2 } = useSelector((state: any) => state.searchData);
    const { diagnosisInfo } = useSelector((state: any) => state.diagnosis);
    const { symptomsInfo } = useSelector((state: any) => state.symptoms);
    const { allTagsInfo } = useSelector((state: any) => state.commonData);
    const { autoInterpetData, loading } = useSelector((state: any) => state.interpretation);
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const [eyeType, setEyeType] = useState('');
    const [loc, setLoc] = useState<string | undefined>(undefined);
    const [ratio, setRatio] = useState();
    const [ratioVal, setRatioVal] = useState();
    const [selectedRatio, setSelectedRatio] = useState('textbox');
    const [ratioData, setRatioData] = useState<RatioData[]>([]);
    const [modalcriteria, setModalCriteria] = useState(false);
    const [val1, setVal1] = useState({ min: 0.0, max: 15.0 });
    const [radioValue, setRadioValue] = useState(true);
    const [locOptions, setLocOptions] = useState<string | undefined>(undefined);
    const [isOpen, setIsOpen] = useState(false);
    const [diagBoxes, setDiagBoxes] = useState([]);
    const [symptomsData, setSymptomsData] = useState([]);
    const [tagsData, setTagsData] = useState([]);
    const [inputValue, setInputValue] = useState({ min: 0, max: 100 });
    const [medicDatapresent, setMedicDataPresent] = useState([]);
    const [medicDatapost, setMedicDataPost] = useState([]);
    const [selectedHand, setSelectedHand] = useState('');
    const [gender, setGender] = useState('');
    const totalPage = amazonSrch?.Datasorting?.totalrecords || 0;
    const totalPage1 = amazonSrchTbl?.DataFinder?.totalrecords || 0;
    const data = amazonSrchTbl != null ? amazonSrchTbl?.Data : [];
    const data1 = amazonSrch ? amazonSrch?.AdvanceSearchRequestDetail : [];
    const tagPatientdata = allTagsInfo != null ? allTagsInfo?.data : [];
    const ratioMarker = autoInterpetData != null ? autoInterpetData?.data : [];
    const customLocale = {
        emptyText: <Empty className="p-2" description="Search Not Found" />,
    };
    const [selectedTags, setSelectedTags] = useState([
        { id: 1, name: 'Age', status: false, selected: false },
        { id: 2, name: 'Gender', status: false, selected: false },
        { id: 3, name: 'Diagnosis', status: false, selected: false },
        { id: 4, name: 'Symptoms', status: false, selected: false },
        { id: 5, name: 'Tags', status: false, selected: false },
        { id: 6, name: 'Medication', status: false, selected: false },
        { id: 7, name: 'Handedness', status: false, selected: false },
    ]);

    const tableChange = (pagination, ...sorted) => {
        let sort = '';
        if (sorted[2].order == 'ascend') {
            sort = 'asc';
        } else sort = 'desc';
        setPageIndex(pagination.current);
        setSortField(sorted[1].field);
        setSortOrder(sort);
        getRequestData(searchTableVal, pagination.current, pagination.pageSize, sorted[1].field, sort);
    };

    const showModalCriteria = () => {
        setModalCriteria(true);
        form.setFieldsValue({
            with_radio: radioValue,
        });
    };

    const onCreate = () => {
        setModalCriteria(false);
        setRatioData([
            ...ratioData.concat({
                ratio: ratio,
                ratioVal: ratioVal,
                location: loc,
                minval: selectedRatio == 'textbox' ? val1.min : radioValue,
                maxval: selectedRatio == 'textbox' ? val1.max : radioValue,
                type: eyeType,
                mode: selectedRatio,
            }),
        ]);
        setSelectedRatio('textbox');
        setRadioValue(true);
    };

    const handleCancelCriteria = () => {
        setModalCriteria(false);
        setSelectedRatio('textbox');
        setRadioValue(true);
    };

    const handleSliderChange = (value: any) => {
        if (value[0] < value[1]) {
            setVal1({ min: value[0], max: value[1] });
        }
    };

    const removeItem = (i: any) => {
        const newItem = ratioData?.filter((x, id) => id !== i);
        setRatioData(newItem);
    };

    const handleEyeTypeChange = (e: any) => {
        setEyeType(e);
    };

    const handleRatioChange = (e, opt) => {
        let b = '';
        if (opt?.length > 0) {
            for (let i = 0; i < opt.length; i++) {
                if (opt[i].id == e) {
                    setRatioVal(opt[i].value);
                    setSelectedRatio(opt[i]?.rfieldtype);
                    b = opt[i].value;
                    setLocOptions(opt[i].location);
                    setLoc(opt[i].location);
                }
            }
        }
        setVal1({ min: 0, max: 15 });
        setRatio(e);
    };

    const handleRadioChange = (e: any) => {
        setRadioValue(e.target.value);
    };

    const submitSearch = () => {
        getcustomadsearch(pageIndex, pageSize);
    };

    function getRequestData(search, page, pageSize, sortField, sortOrder) {
        const data = {
            ADSRInput: {
                status: 'All',
                fromdaterange: '',
                todaterange: '',
                tags: '',
                email: '',
                category: 'Service Request',
            },
            DataFinder: {
                pagesize: pageSize,
                currentpage: page,
                sortbycolumn: sortField || '',
                sortby: sortOrder || '',
                searchdata: search || '',
            },
        };
        dispatch(amazonSearchTable(data) as any);
    }

    const getFilteredOptions = () => {
        const filteredMarkers = ratioMarker?.filter((marker: any) => {
            if (eyeType === 'eyeopen') {
                return marker?.docfieldtype === 'EO';
            } else if (eyeType === 'eyeclosed') {
                return marker?.docfieldtype === 'EC';
            }
            return false;
        });

        return filteredMarkers?.map((marker: any) => ({
            value: marker?.rulename,
            label: marker?.rulename,
            id: marker?.id,
            location: marker?.rulelocation,
            docfieldtype: marker?.docfieldtype,
            rfieldtype: marker?.rfieldtype,
        }));
    };

    const ratioOptions = getFilteredOptions();

    function getcustomadsearch(page, size) {
        const fdata: FDataItem[] = [];

        ratioData?.forEach((items, i) => {
            fdata.push({
                rule_id: items?.ratio,
                start_on: items?.minval,
                end_on: items?.maxval,
                type: items?.type,
            });
        });
        let minAge: string | number;
        let maxAge: string | number;
        let past = '';
        let present = '';
        if (selectedTags[0]?.selected === true) {
            minAge = inputValue?.min;
            maxAge = inputValue?.max;
        } else {
            minAge = '';
            maxAge = '';
        }
        if (selectedTags[5]?.selected == true) {
            past = medicDatapost ? medicDatapost?.join('|') : '';
            present = medicDatapresent ? medicDatapresent?.join('|') : '';
        } else {
            past = '';
            present = '';
        }
        const reqData = {
            primary_criteria: {
                age_start: minAge,
                age_end: maxAge,
                gender: gender,
                pnt_tags: tagsData.join('|') || '',
                pntmedic_past: past || '',
                pntmedic_present: present || '',
                diagnosis: diagBoxes.join('|') || '',
                symptoms: symptomsData.join('|') || '',
                handedness: selectedHand || '',
            },
            additional_criteria: fdata,
            Datasorting: {
                pagesize: size,
                currentpage: page,
                sortbycolumn: 'created_on',
                sortby: 'desc',
                searchdata: '',
            },
        };
        dispatch(amazonSearch(reqData) as any);
    }

    useEffect(() => {
        getcustomadsearch(pageIndex, pageSize);
    }, [dispatch]);

    useEffect(() => {
        dispatch(allPatientTag() as any);
        dispatch(getMedicationList() as any);
        dispatch(getDiagnosisList() as any);
        dispatch(getSymptomsList() as any);
    }, [dispatch]);

    useEffect(() => {
        getRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder);
    }, [dispatch]);

    useEffect(() => {
        dispatch(getAutomateInterpretationList() as any);
    }, [dispatch]);

    const callbackFunc = (item, item1, item2, item3, item4, item5, item6, item7, item8, item9, item10) => {
        setIsOpen(item);
        setSelectedTags(item1);
        setInputValue({ min: item2, max: item3 });
        setMedicDataPost(item4);
        setMedicDataPresent(item5);
        setGender(item6);
        setDiagBoxes(item7);
        setTagsData(item8);
        setSymptomsData(item9);
        setSelectedHand(item10);
    };

    const columns: TableProps<DataType>['columns'] = [
        {
            title: 'Request No',
            dataIndex: 'encoded_RequestNumber',
            key: 'requestno',
            sorter: (a, b) => a?.encoded_RequestNumber.length - b?.encoded_RequestNumber.length,
            render: (encoded_RequestNumber, record) => {
                if (data1.length > 0 && record?.archive_data) {
                    return (
                        <div>
                            {' '}
                            <Tooltip title="Archived Request" className="mt-0">
                                <span className="dot"></span>
                            </Tooltip>{' '}
                            {encoded_RequestNumber}
                        </div>
                    );
                } else {
                    return <div>{encoded_RequestNumber}</div>;
                }
            },
        },
        ...(userRole !== 'researcher'
            ? [{
                title: 'Patient Name',
                dataIndex: 'patient_name',
                key: 'name',
                sorter: (a, b) => a?.patient_name.length - b?.patient_name.length,
            }] : []),
        {
            title: 'Gender',
            dataIndex: 'gender',
            key: 'gender',
        },
        {
            title: 'Submitted On',
            dataIndex: 'created_on',
            key: 'created_on',
            render: (created_on: any) => {
                const originalDate = new Date(created_on) || null;
                return data1 || data ? originalDate?.toLocaleString() : null;
            },
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            align: 'center',
            render: (status: any) => {
                if (status?.toLowerCase() === 'on review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="warning-btn fw-bold w-100">{status} </Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'reassessment') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="purple-btn fw-bold w-100 text-break">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'result review') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="primary-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'request init') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="danger-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else if (status?.toLowerCase() === 'released') {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="success-btn fw-bold w-100">{status}</Button>
                        </div>
                    );
                } else {
                    return (
                        <div className="status-section mx-auto">
                            <Button className="text-success fw-bold w-100">{status}</Button>
                        </div>
                    );
                }
            },
        },
    ];

    return (
        <div className="row m-0 amazon-search">
            <div className="col-md-4 ps-0 pe-0 mt-2 ">
                <div className="ps-2 py-2 pe-3 ">
                    <div className="filter-section grid-title-card">
                        
                        <h5 className="text-start">
                            <AlignLeftOutlined className="pe-2 my-auto" />
                            Filter
                        </h5>
                        <div className="px-2 py-2 card border-0">
                            <div className="px-3 pt-2 mb-2 bg-light fs-6 fw-normal ">
                                <h6 className="fs-16">
                                    Primary Criteria
                                    <PlusOutlined className="pe-2 float-end pt-2 fs-6" onClick={() => setIsOpen(true)} />
                                </h6>
                            </div>

                            <div className="text-start status-section mb-2">
                                <Button className="bg-green-antd success-btn">All Active Requests</Button>
                            </div>
                            <div className="mb-3 over-flow-hv">
                                <FilterContainer
                                 submitSearch={submitSearch}
                                    data={{ diagnosisInfo: diagnosisInfo, symptomsInfo: symptomsInfo, isOpen: isOpen, callbackFunc: callbackFunc, tagPatientdata: tagPatientdata }}
                                />
                            </div>

                            <div className="px-3 pt-2 mb-3 bg-light fs-6">
                                <h6 className="fs-16">
                                    Additional Criteria
                                    <PlusOutlined className="pe-2 float-end pt-2 " onClick={showModalCriteria} />
                                </h6>
                            </div>
                            <div className="px-2">
                                {ratioData?.map((ratio, i) => {
                                    return (
                                        <div className="card-body shadow-sm mb-2 ant-collapse-header filter-container" key={i}>
                                            {ratio?.mode == 'textbox' ? (
                                                <Row>
                                                    <p className="col mb-0 text-start fs-6">
                                                        With {ratio.ratioVal} {ratio?.location !== null ? `from location ${ratio?.location}` : ''} between &nbsp;{ratio?.minval} and &nbsp;
                                                        {ratio?.maxval} <span className="ms-2 px-1 text-dark pb-2 fs-6 fw-bold capitalize-first-letter">({ratio?.type})</span>
                                                    </p>
                                                    <CloseOutlined width="" onClick={() => removeItem(i)} className="text-danger my-auto col-auto p-0" />
                                                </Row>
                                            ) : (
                                                <Row>
                                                    <p className="col mb-0 text-start fs-6">
                                                        With {ratio?.ratioVal} {ratio?.location != null ? `from location ${ratio.location}` : ''} is &nbsp;
                                                        {ratio?.minval == true ? 'True' : 'False'}{' '}
                                                        <span className="ms-2 px-1 text-dark pb-2 fs-6 fw-bold capitalize-first-letter">({ratio?.type})</span>
                                                    </p>
                                                    <CloseOutlined width="" onClick={() => removeItem(i)} className="text-danger my-auto col-auto p-0" />
                                                </Row>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <Modal
                                title="Add Additional Criteria"
                                okText="Add Rule"
                                open={modalcriteria}
                                onOk={() => {
                                    form.validateFields()
                                        .then((values) => {
                                            form.resetFields();
                                            onCreate();
                                            setLocOptions('');
                                            setLoc('');
                                        })
                                        .catch((info) => {
                                            console.log('Validate Failed:', info);
                                        });
                                }}
                                onCancel={handleCancelCriteria}
                                maskClosable={false}
                                width="560px"
                                cancelButtonProps={{
                                    style: { backgroundColor: '#ff4242', color: 'white' }
                                }}
                            >
                                <Form
                                    form={form}
                                    layout="vertical"
                                    initialValues={{
                                        modifier: '',
                                    }}
                                >
                                    <div className="row bg-light">
                                        <div className="col-md-6 ">
                                            <Form.Item label="Type" name="type" className="w-100">
                                                <Select className="w-100" onChange={handleEyeTypeChange}>
                                                    <Option value="eyeopen">Eyes Opened</Option>
                                                    <Option value="eyeclosed">Eyes Closed</Option>
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-6 ">
                                            <Form.Item label="Ratio" name="ratio" className="w-100 ">
                                                <Select
                                                    className="w-100"
                                                    // name="ratio"
                                                    value={ratio}
                                                    onChange={(e) => handleRatioChange(e, ratioOptions)}
                                                    notFoundContent={
                                                        <div className="text-center p-4">
                                                            {loading ? (
                                                                <span>
                                                                    <LoadingOutlined />
                                                                    Loading...
                                                                </span>
                                                            ) : (
                                                                <span>No ratio available</span>
                                                            )}
                                                        </div>
                                                    }
                                                >
                                                    {ratioOptions.map((mark) => {
                                                        return (
                                                            <Option value={mark.id} label={mark.label} key={mark.id}>
                                                                {mark.label}
                                                            </Option>
                                                        );
                                                    })}
                                                </Select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-6 ">
                                            <Form.Item label="Location" name="location" className="w-100 ">
                                                <select className="form-control" name="location" value={loc} onChange={(e) => setLoc(e.target.value)}>
                                                    {locOptions !== '' || locOptions !== null ? <option value={locOptions}>{locOptions}</option> : <option value="">Select</option>}
                                                </select>
                                            </Form.Item>
                                        </div>
                                        <div className="col-md-6 ">
                                            {selectedRatio == 'textbox' && (
                                                <Form.Item label="with Range" className="w-100 ">
                                                    <Slider range min={0.0} max={15.0} step={0.001} onChange={handleSliderChange} defaultValue={[val1?.min, val1?.max]} />
                                                </Form.Item>
                                            )}
                                            {selectedRatio == 'radio' && (
                                                <Form.Item label="Is Ratio Present" name="with_radio" className="w-100 ">
                                                    <Radio.Group className="d-flex" value={radioValue} onChange={handleRadioChange}>
                                                        <Radio value={true}>True</Radio>
                                                        <Radio value={false}>False</Radio>
                                                    </Radio.Group>
                                                </Form.Item>
                                            )}
                                        </div>
                                    </div>
                                </Form>
                            </Modal>
                            <div className="text-end mt-3">
                                <Tooltip title="Advanced Search" className="mt-0">
                                    <Button htmlType="submit" type="primary" className="px-2 ms-auto" onClick={() => submitSearch()} icon={<SearchOutlined />}>
                                        Search
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-8 ps-0">
                <div className="row mx-0 request-title mb-2">
                    <div className="col text-start ms-1 ps-0 mt-2 grid-title-card">
                        <h5 className="my-auto">Search</h5>
                    </div>
                </div>
                <Table
                    className="pointer"
                    rowKey="id"
                    columns={columns}
                    dataSource={data1 || data}
                    loading={loading2 || loading1}
                    onChange={tableChange}
                    locale={customLocale}
                    scroll={{ x: 'calc(230px + 50%)' }}
                    onRow={(record, rowIndex) => {
                        return {
                            onClick: (event) => {
                                if (
                                    record?.status === 'On Review' ||
                                    record.status === 'Reassessment' ||
                                    record.status === 'Result Review' ||
                                    (record.status === 'Request Init' && userRole !== 'researcher')
                                ) {
                                    history(`/view-request/pipeline-request`, {
                                        state: {
                                            id: record?.id,
                                            reqId: record?.id,
                                            is_billing: record?.is_billing,
                                            reqDetail: record,
                                            request_from: 'amazon',

                                        },
                                    } as NavigateOptions);
                                } else if (record.status === 'Released') {
                                    history(`/released-request/dataset-information`, {
                                        state: {
                                            id: record?.id,
                                            rowData: record
                                        },
                                    } as NavigateOptions);
                                }
                            },
                        };
                    }}
                    pagination={{
                        current: pageIndex,
                        pageSize: pageSize,
                        total: data1 ? totalPage : totalPage1,
                        onChange: (page, pageSize) => {
                            setPageIndex(page);
                            setPageSize(pageSize);
                            if (amazonSrch?.AdvanceSearchRequestDetail.length > 0) {
                                getcustomadsearch(page, pageSize);
                            } else {
                                getRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder);
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default AmazonSearch;
