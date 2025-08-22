import React, { useState, useEffect } from 'react';
import { Input } from 'components/shared/FormComponent';
import { Switch, useDispatch, useSelector, Table } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import SearchIcon from 'assets/img/search.svg';
import { getPipelineRequest } from 'services/actions/pipeline/pipelineAction';

interface DataType {
    key: any;
    sno: number;
    id: any;
    encoded_RequestNumber: any;
    patient_name: any;
    dob: any;
    gender: any;
    account_name: any;
    created_on: any;
    status: any;
    action: any;
}
const AccountPipeline: React.FC = () => {
    const [isPntReq, setIsPntReq] = useState(false);
    const dispatch = useDispatch();
    const [pageIndex, setPageIndex] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [searchTableVal, setsearchTableval] = useState('');
    const { pipelineInfo, loading, success3, error3 } = useSelector((state: any) => state.pipeline);
    const totalPage = !loading ? pipelineInfo?.DataFinder?.totalrecords : 0;
    const data = loading ? [] : pipelineInfo?.ServiceRequestDetail || [];

    const changeRushOrder = (e: any) => {
        setIsPntReq(e);
        // getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, e, accid);
    };
    const handleReset = () => {
        // setSearchText('');
        setPageIndex(1);
        // setAccid(0);
        // getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, isRush, accid);
    };
    const handleSearch = (e: any) => {
        if (e.key === 'Enter') {
            setsearchTableval(e.target.value);
            setPageIndex(1);
            // getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
        }
    };

    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setsearchTableval('');
            setPageIndex(1);
            // getServiceRequestData(e.target.value, pageIndex, pageSize, sortField, sortOrder, isActive, isRush, accid);
        }
    };

    const searchbyBtn = () => {
        setPageIndex(1);
        // getServiceRequestData(searchTableVal, 1, pageSize, sortField, sortOrder, isActive, isRush, accid);
    };
    const showExportModal = () => {};

    // function getServiceRequestData(search: string, page: number, pageSize: number, sortField: any, sortOrder: any, isactive: any, rush: any, accountid: any) {
    //     const inputJson = {
    //         reqstatus: 'On Review',
    //         rush_order: rush,
    //         accountid: parseInt(accountid),
    //         is_active: sessionStorage.getItem('role') === 'staff' ? isactive : 1,
    //         DataFinder: {
    //             pagesize: pageSize,
    //             currentpage: page,
    //             sortbycolumn: sortField || '',
    //             sortby: sortOrder || '',
    //             searchdata: search || '',
    //         },
    //     };
    //     dispatch(getPipelineRequest(inputJson) as any);
    // }

    // useEffect(() => {
    //     getServiceRequestData(searchTableVal, pageIndex, pageSize, sortField, sortOrder, isPntReq, false, 0);
    // }, []);

    return (
        <div>
            <div className="d-flex grid-title-card">
                <h5 className="my-auto ">Order Management</h5>
                <div className="ms-auto d-flex">
                    <div className="me-2 my-auto">
                        <Switch size="small" className="me-2" onChange={changeRushOrder} />
                        <span className="fs-16">Patient submitted request</span>
                    </div>

                    <Input
                        prefix={<img src={SearchIcon} height="14px" onClick={() => searchbyBtn()} />}
                        onKeyDown={(e) => handleSearch(e)}
                        value={searchTableVal}
                        onChange={(e) => setsearchTableval(e.target.value)}
                        onKeyUp={(e) => resetSearch(e)}
                        className="search-input col px-2 rounded fs-14 me-2"
                        placeholder="Search"
                    />
                    <Button type="primary" className="me-1" onClick={showExportModal}>
                        Export
                    </Button>
                    <Button type="primary" onClick={showExportModal}>
                        New Service Request
                    </Button>
                </div>
            </div>
            <div className="my-2"></div>
        </div>
    );
};

export default AccountPipeline;
