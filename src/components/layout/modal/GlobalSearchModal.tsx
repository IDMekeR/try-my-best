import React, { useEffect, useState } from 'react';
import { Form, Input, Select, DatePicker } from 'components/shared/FormComponent';
import { Button } from 'components/shared/ButtonComponent';
import { Modal } from 'components/shared/AntComponent';
import { useSelector } from 'components/shared/CompVariables';
import SearchIcon from 'assets/img/search.svg';
import dayjs from 'dayjs';
import { useNavigate, NavigateOptions } from 'react-router-dom';

interface ChildProps {
    openModal: boolean;
    searchValue: any;
    handleChangePass: () => void;
}

const GlobalSearchModal: React.FC<ChildProps> = ({ openModal, handleChangePass, searchValue }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState(null);
    const [cateItem, setCateItem] = useState('');
    const [showError, setShowError] = useState('');
    const { allTagsInfo } = useSelector((state: any) => state.commonData);
    const tagdata = allTagsInfo != null ? allTagsInfo?.data : [];
    const userRole=sessionStorage.getItem('role');
    const initialValues = {
        searchVal: searchValue,
    };
    const catOptions = [
        { value: 'All', label: 'All' },
        { value: 'Account', label: 'Account' },
        { value: 'Patient', label: 'Patient' },
        { value: 'Service Request', label: 'Service Request' },
    ];

    let statusOption = [
        { value: 'All', label: 'All' },
        { value: 'Request Init', label: 'Request Initation' },
        { value: 'On Review', label: 'On Review' },
        { value: 'Released', label: 'Released' },
    ];

    if (userRole === 'staff') {
        statusOption = statusOption?.map(option => {
            switch (option?.value) {
                case 'Request Init':
                    return { ...option, label: 'Submitted' };
                case 'On Review':
                    return { ...option, label: 'Acknowledged' };
                case 'Released':
                    return { ...option, label: 'Released' };
                default:
                    return option;
            }
        });
    }

    const handleCancel1 = () => {
        handleChangePass();
    };

    const onFinish = async () => {
        try {
            const fvalue = await form.validateFields();
            if (!fvalue.sdate || (fvalue.sdate && (fvalue.searchVal || fvalue.category || fvalue.status || fvalue.email || fvalue.tag))) {
                navigate('/search', {
                    state: {
                        searchValue: fvalue?.searchVal || '',
                        categoryValue: fvalue.category || '',
                        statusValue: fvalue.status || '',
                        startDate: fvalue.sdate ? dayjs(fvalue.sdate)?.format('YYYY-MM-DD') : null,
                        endDate: fvalue.edate ? dayjs(fvalue.edate)?.format('YYYY-MM-DD') : null,
                        emailValue: fvalue.email || '',
                        tagValue: fvalue.tag || '',
                        refresh: location.pathname === '/search' ? true : false,
                    },
                } as NavigateOptions);
                handleCancel1();
                form.resetFields();
                setCateItem('');
                setShowError('');
                setStartDate(null);
            } else {
                setShowError('Select category or status or tag or email or search input to proceed the search!');
            }
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

    const tagOptions = tagdata?.map((tag: any) => {
        return {
            label: tag.TagName,
            value: tag.TagName,
            key: tag.id,
        };
    });

    const disabledDate = (current: any) => {
        return current && current > dayjs().add(1, 'day').endOf('day');
    };

    const disabledDate1 = (current: any) => {
        if (!startDate) {
            return current && current > dayjs().endOf('day');
        } else {
            return current && (current < dayjs(startDate).startOf('day') || current > dayjs().endOf('day'));
        }
    };

    function handleStartDateChange(dateString: any) {
        setStartDate(dateString);
    }

    const handleCategoryChange = (e: any) => {
        setCateItem(e);
    };

    const handleEndDateChange = (dateString: any) => {
        if (dateString) {
            setShowError('');
        }
    };

    useEffect(() => {
        if (openModal) {
            form.setFieldsValue({ searchVal: searchValue });
        }
    }, [searchValue]);

    return (
        <div>
            <Modal
                title="Global Search with filter"
                open={openModal}
                onCancel={handleCancel1}
                maskClosable={false}
                footer={[
                    <Button key="back" className="bg-danger text-white" onClick={handleCancel1}>
                        Cancel
                    </Button>,
                    <Button key="submit" type="primary" onClick={onFinish}>
                        Search
                    </Button>,
                ]}
            >
                <div>
                    <Form form={form} layout="vertical" initialValues={initialValues}>
                        <Form.Item name="searchVal" label="What are you looking for?">
                            <Input prefix={<img src={SearchIcon} height="14px" className="me-2" />} />
                        </Form.Item>
                        <div className="row m-0">
                            <Form.Item name="category" label="Category" className="col px-0">
                                <Select options={catOptions} onChange={handleCategoryChange} />
                            </Form.Item>
                            <Form.Item
                                name="status"
                                label="Status"
                                className="col pe-0"
                                rules={[
                                    {
                                        required: cateItem === 'Service Request',
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <Select options={statusOption} disabled={cateItem !== 'Service Request' ? true : false} />
                            </Form.Item>
                        </div>
                        <div className="row m-0">
                            <Form.Item name="sdate" label="Start Date" className="col px-0">
                                <DatePicker className="w-100" format="MM-DD-YYYY" disabledDate={disabledDate} onChange={handleStartDateChange} />
                            </Form.Item>
                            <Form.Item
                                name="edate"
                                className="col pe-0"
                                label="End Date"
                                rules={[
                                    {
                                        required: startDate ? true : false,
                                        message: 'This field is required!',
                                    },
                                ]}
                            >
                                <DatePicker disabledDate={disabledDate1} format="MM-DD-YYYY" disabled={!startDate} className="w-100 mb-1" onChange={handleEndDateChange} />
                            </Form.Item>
                        </div>

                        <div className="row m-0">
                            <Form.Item name="tag" label="Tag" className="col px-0">
                                <Select options={tagOptions} mode="multiple" />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                className="col pe-0"
                                rules={[
                                    {
                                        type: 'email',
                                        message: 'Enter valid mail address',
                                    },
                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </div>
                        <div className="text-danger fs-14">{showError}</div>
                    </Form>
                </div>
            </Modal>
        </div>
    );
};

export default GlobalSearchModal;
