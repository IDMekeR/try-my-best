import { ClosedInvoiceIcon, CreditPriceIcon, OpenInvoiceIcon, TotalAmountIcon, WaitingIcon } from 'assets/img/custom-icons';
import React, { useState, useEffect } from 'react';
import { getInvoiceStatistics, getInvoiceGraph } from 'services/actions/invoiceAction';
import 'assets/styles/account.scss';
import { Tabs } from 'antd';
import AwaitingInvoice from './sub-screens/AwaitingInvoice';
import ReviewInvoice from './sub-screens/ReviewInvoice';
import OpenInvoice from './sub-screens/OpenInvoice';
import ClosedInvoice from './sub-screens/ClosedInvoice';
import { useLocation } from 'react-router-dom';
import { ApexOptions } from 'apexcharts';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import dayjs from 'dayjs';
import InvoiceStats from './sub-screens/InvoiceStats';


const InvoiceManager: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { userProfileInfo } = useSelector((state: any) => state.auth);
    const [selectedTab, setSelectedTab] = useState(userRole == 'admin' ? '1' : '3');
    const { invstatInfo, invgraphInfo, loading9 } = useSelector((state: any) => state.invoice);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const [updateStat, setUpdateStat] = useState(false);
    const [graphDates, setGraphDates] = useState([]);
    const [openInv, setOpenInv] = useState([]);
    const [closedInv, setClosedInv] = useState([]);
    const [agedInv, setAgedInv] = useState([]);
    const [reviewInv, setReviewInv]: any = useState([]);
    const [startDate, setStartDate]: any = useState<string | null>(null);
    const [endDate, setEndDate]: any = useState<string | null>(null);
    const currentDate = new Date();
    const [openPicker, setOpenPicker] = useState(false);
    const [acc, setAcc] = useState('0');
    const lastMonthDate = new Date(currentDate);
    const [accOptions, setAccOptions]: any = useState([]);
    const defaultEnd = dayjs().format("MM-DD-YYYY");
    const defaultStart = dayjs().subtract(1, "month").format("MM-DD-YYYY");
    const statCards = [
        { id: 1, label: 'Total Amount', amount: Number(invstatInfo?.data?.paid_amount) + Number(invstatInfo?.data?.unpaid_amount), icon: <TotalAmountIcon /> },
        { id: 2, label: 'Unpaid Amount', amount: invstatInfo?.data?.unpaid_amount ? '$' + invstatInfo?.data?.unpaid_amount.toFixed(2) : '--', icon: <WaitingIcon /> },
        { id: 3, label: 'Paid Amount', amount: invstatInfo?.data?.paid_amount ? '$' + invstatInfo?.data?.paid_amount.toFixed(2) : '--', icon: <CreditPriceIcon /> },
        { id: 4, label: 'Open Invoice', amount: invstatInfo?.data?.unpaid_invoice ? invstatInfo?.data?.unpaid_invoice : '--', icon: <OpenInvoiceIcon /> },
        { id: 5, label: 'Closed Invoice', amount: invstatInfo?.data?.paid_invoice ? invstatInfo?.data?.paid_invoice : '--', icon: <ClosedInvoiceIcon /> },
    ];
    // const [openPicker, setOpenPicker] = useState(false);

    function getStatisticCard(id: any) {
        const inputJson = {
            "account_id":id,
            "year":2025
        }
        dispatch(getInvoiceStatistics(inputJson) as any);
        setUpdateStat(false);
    }   

    useEffect(() => {
        if (location.state) {
            setSelectedTab(location?.state?.tab || '1');
        }
    }, [location?.state]);

    useEffect(() => {
        if (userRole === 'admin') {
            getStatisticCard(0);

        } else {
            if (userProfileInfo) {
                getStatisticCard(userProfileInfo?.data?.account_id);
            }

        }

    }, [dispatch, updateStat, userRole, userProfileInfo]);

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    };

    const handleCallbackFunc = (item: boolean) => {
        setUpdateStat(item);
    };

    const tabItems = [
        { key: '1', label: 'Awaiting for Invoice', children: <AwaitingInvoice tabKey={selectedTab} /> },
        { key: '2', label: 'Invoice for Review', children: <ReviewInvoice tabKey={selectedTab} /> },
        { key: '3', label: 'Open Invoice', children: <OpenInvoice tabKey={selectedTab} updateStat={handleCallbackFunc} /> },
        { key: '4', label: 'Closed Invoice', children: <ClosedInvoice tabKey={selectedTab} /> },
        { key: '5', label: 'Invoice Statistics', children: <InvoiceStats tabKey={selectedTab} /> },
    ];

    const accTabItems = [
        { key: '3', label: 'Open Invoice', children: <OpenInvoice tabKey={selectedTab} updateStat={handleCallbackFunc} /> },
        { key: '4', label: 'Closed Invoice', children: <ClosedInvoice tabKey={selectedTab} /> },
    ]
    function getInvoiceGraphData(sdate: any, edate: any, acc: any) {
        const inputJson = {
            AccountID: Number(acc) || 0,
            start_date: dayjs(sdate).format('YYYY-MM-DD') || '2024-09-24',
            end_date: dayjs(edate).format('YYYY-MM-DD') || '2024-10-03',
        };
        dispatch(getInvoiceGraph(inputJson) as any);
    }

    useEffect(() => {
        if (allAccountInfo?.data) {
            const arr: { label: string; value: string }[] = [];
            arr.push({ label: 'All', value: '0' });
            for (let i = 0; i < allAccountInfo?.data?.length; i++) {
                arr.push({
                    label: allAccountInfo?.data[i]?.account_name,
                    value: allAccountInfo?.data[i]?.id.toString(),
                });
            }
            setAccOptions(arr);
        }
    }, [allAccountInfo?.data]);
    const options: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            },
        },

        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'left',
            fontFamily: 'Lato',
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        fill:{
          type:"linear"
        },
        colors: ['#ffa902', '#7a6efe', '#24a8fa'],
        xaxis: {
            type: 'datetime',
            categories: graphDates,
            tickAmount: 6 - 1.5 || 0,
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy',
            },
        },
    };

    const series = [
        {
            name: 'Aged Invoice',
            type: 'bar',
            data: agedInv,
        },
        {
            name: 'Open Invoice',
            type: 'bar',
            data: openInv,
        },
        {
            name: 'Closed Invoice',
            type: 'bar',
            data: closedInv,
        },
        {
            name: 'Review Invoices',
            type: 'bar',
            data: reviewInv,
        },
    ];

    const handleDateRange = (e) => {
        if (e && e[0] && e[1]) {
            const sdate = new Date(e[0]);
            const edate = new Date(e[1]);
            setStartDate(sdate);
            setEndDate(edate);
        } else {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const handleAccountChange = (e) => {
        setAcc(e);
        if (startDate && endDate) {
            getInvoiceGraphData(startDate, endDate, e);
        }
    };

    const disabledDate = (current) => {
        // Can not select days before today and today
        return current && current > dayjs().endOf('day');
    };

    const handleOpenPicker = (visible) => {
        setOpenPicker(true)
    };

    const handleClosePiclker = () =>{
        setOpenPicker(false)
    }

    const submitFunc = () => {
        if (startDate && endDate) {
            getInvoiceGraphData(startDate, endDate, acc);
            setOpenPicker(false);
        }
    };
    useEffect(() => {
        if (invgraphInfo?.inv_graph) {
            setGraphDates(invgraphInfo?.inv_graph?.dates);
            setOpenInv(invgraphInfo?.inv_graph?.open_invoice);
            setClosedInv(invgraphInfo?.inv_graph?.closed_invoice);
            setAgedInv(invgraphInfo?.inv_graph?.aged_invoice);
            setReviewInv(invgraphInfo?.inv_graph?.invoice_for_review);
        }
    }, [invgraphInfo?.inv_graph]);

    useEffect(() => {
        if (currentDate && userRole !== 'staff') {
            const lst = new Date(lastMonthDate.setMonth(currentDate.getMonth() - 1));
            setStartDate(lst);
            setEndDate(currentDate);
            // getInvoiceGraphData(lst, currentDate, acc);
        }
    }, []);

    return (
        <div className="p-2 inv-container">
            <div className="d-flex grid-title-card my-2">
                <h5 className="my-auto">Invoice Manager</h5>
            </div>
           
                <div className="my-3 row m-0 invoice-stats ">
                    {statCards?.map((item: any,index:number) => {
                        const isLastItem = index === statCards.length - 1;
                        return (
                            <div className={`invoice-card col ps-0 inv-cards ${isLastItem?'pe-0':''}`} key={item.id}>
                                <div className={`d-flex p-2 scard card${item.id} align-items-center`}>
                                    <div className="col-md-4 invoice-icon text-center me-2 ">{item.icon}</div>
                                    <div className="text-center">
                                        <h6 className="text-white fs-18 mb-1">{item.label}</h6>
                                        <h4 className="text-white mb-0">{item.amount ? ((item.id == 1) ? '$' + item?.amount?.toFixed(2) : item?.amount) : (item.id == 1 || item.id == 2 || item.id == 3) ? '$0' : '0'}</h4>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div> 
               
            <div className="custom-tabs">
                <Tabs items={userRole === 'staff' ? accTabItems : tabItems} defaultActiveKey={location.state.tab||selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
            </div>
        </div>

    );
};

export default InvoiceManager;
