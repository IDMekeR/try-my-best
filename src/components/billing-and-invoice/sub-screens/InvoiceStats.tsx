import React, { useState, useEffect } from 'react';
import { getInvoiceStatistics, getInvoiceGraph } from 'services/actions/invoiceAction';
import 'assets/styles/account.scss';
import { Tabs, Tooltip } from 'antd';
import { useLocation } from 'react-router-dom';
import { DatePicker, Select } from 'components/shared/FormComponent';
import { LoadingOutlined } from 'components/shared/AntIcons';
import { Spin } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useDispatch, useSelector } from 'components/shared/CompVariables';
import { ClosedInvoiceIcon, CreditPriceIcon, OpenInvoiceIcon, TotalAmountIcon, WaitingIcon } from 'assets/img/custom-icons';
import dayjs from 'dayjs';
import ExportInvoice from './ExportInvoice';


const { RangePicker } = DatePicker;

interface ChildProps {
    tabKey: any;
}
const { Option } = Select;

const InvoiceStats: React.FC<ChildProps> = ({ tabKey }) => {
    const dispatch = useDispatch();
    const location = useLocation();
    const userRole = sessionStorage.getItem('role');
    const { invstatInfo, invgraphInfo, loading9 } = useSelector((state: any) => state.invoice);
    const { allAccountInfo, loading4 } = useSelector((state: any) => state.commonData);
    const currentDate = new Date();
    const [graphDates, setGraphDates] = useState([]);
    const [openInv, setOpenInv] = useState([]);
    const [closedInv, setClosedInv] = useState([]);
    const [agedInv, setAgedInv] = useState([]);
    const [reviewInv, setReviewInv] = useState([]);
    const [startDate, setStartDate]: any = useState(null);
    const [endDate, setEndDate]: any = useState(null);
    const [rangeType, setRangeType] = useState("monthly");
    const [acc, setAcc] = useState('0');
    const [accOptions, setAccOptions] = useState([]);
    const [open, setOpen] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const callbackExport = (item1) => {
        setOpen(item1);
    };


    const calculateTotals = (openInv, closedInv, agedInv, reviewInv) => {
        const sum = (arr) => arr?.reduce((total, num) => total + num, 0) || 0;
        return {
            open: sum(openInv),
            closed: sum(closedInv),
            aged: sum(agedInv),
            review: sum(reviewInv),
        };
    };

    const totals = calculateTotals(openInv, closedInv, agedInv, reviewInv);

    // Data for the pie chart
    const pieSeries = [totals?.open || 0, totals?.closed || 0, totals?.aged || 0, totals?.review || 0];

    const pieLabels = ['Aged Invoices', 'Open Invoices', 'Closed Invoices', 'Review Invoices'];

    const pieOptions: ApexOptions = {
        chart: {
            type: 'pie',
        },
        labels: pieLabels,
        colors: ['#7a6efe', '#24a8fa', '#ff5733', '#ffa902'],
        legend: {
            position: 'bottom',
            horizontalAlign: 'center',
            fontFamily: 'Lato',
        },
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            y: {
                formatter: (val) => `${val} invoices`,
            },
        },
    }

    function getInvoiceGraphData(rangeType, acc) {
        const inputJson = {
            AccountID: Number(acc) || 0,
            date_period: rangeType || 'weekly'
        }
        dispatch(getInvoiceGraph(inputJson) as any);
    }

    const handleRangeTypeChange = (value) => {
        setRangeType(value);
        getInvoiceGraphData(value, acc);
    };

    useEffect(() => {
        if (invgraphInfo?.inv_graph) {
            if (rangeType === 'monthly') {
                setGraphDates(invgraphInfo?.inv_graph?.month_year || []);
            } else {
                setGraphDates(invgraphInfo?.inv_graph?.dates || []);
            }
            setOpenInv(invgraphInfo?.inv_graph?.open_invoices || []);
            setClosedInv(invgraphInfo?.inv_graph?.closed_invoices || []);
            setAgedInv(invgraphInfo?.inv_graph?.aged_invoices || []);
            setReviewInv(invgraphInfo?.inv_graph?.invoice_for_reviews || []);
        }
    }, [invgraphInfo?.inv_graph]);

    useEffect(() => {
        if (currentDate && userRole !== "staff") {
            const lastMonthDate = new Date(currentDate);
            lastMonthDate.setMonth(currentDate.getMonth() - 1);
            setStartDate(lastMonthDate);
            setEndDate(currentDate);
            getInvoiceGraphData(rangeType, acc);

        }
    }, []);

    const handleAccountChange = (e) => {
        setAcc(e);
        if (rangeType) {
            getInvoiceGraphData(rangeType, e);
        }
    };

    useEffect(() => {
        if (allAccountInfo?.data) {
            const arr: any = [];
            arr.push({ label: 'All', value: '0' });
            for (let i = 0; i < allAccountInfo?.data?.length; i++) {
                arr.push({ label: allAccountInfo?.data[i]?.account_name, value: allAccountInfo?.data[i]?.id });
            }
            setAccOptions(arr);
        }
    }, [allAccountInfo?.data]);

    const series = [
        {
            name: 'Aged Invoice',
            data: agedInv,
        },
        {
            name: 'Open Invoice',
            data: openInv,
        },
        {
            name: 'Closed Invoice',
            data: closedInv,
        },
        {
            name: 'Review Invoices',
            data: reviewInv,
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'bar',
            stacked: false,
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
            show: true,
            width: 1,
            colors: ['transparent'],
        },
        colors: ['#ff5733', '#7a6efe', '#24a8fa', '#ffa902'],
        xaxis: {
            type: 'category',
            categories: graphDates,
            tickAmount: 6,
        },
        yaxis: {
            title: {
                text: 'Invoice Count',
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '60%',
            },
        },
    };


    const topFiveAccounts = invgraphInfo?.inv_graph?.top_five_account || [];

    // Ensure series and labels data are valid
    const seriesData = topFiveAccounts.map((account) => account?.invoice_count || 0); // Pie chart series
    const labels = topFiveAccounts.map((account) => account?.account_name || "Unknown"); // Account names

    const pieOptions1: ApexOptions = {
        chart: {
          type: "donut",
          toolbar: {
            show: false,
          },
        },
        labels, // Assign account names to the labels
        colors: ["#008FFB", "#00E396", "#FEB019", "#FF4560", "#775DD0"], 
        dataLabels: {
            enabled: false,
        },
        legend: {
          show: true,
          position: "bottom",
          fontSize: "14px",
          labels: {
            colors: ["#333"], // Text color
          },
        },
        tooltip: {
        y: {
            formatter: (value, { seriesIndex }) =>
                `${value} Invoices`, 
            },
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: {
                width: "100%",
              },
              legend: {
                position: "bottom",
              },
            },
          },
        ],
      };

    return(
        <div className="d-flex stat-flex ms-0 me-2">
            <div className="col-md-4 p-2 ms-2 border-end">
                <h6 className="txt-primary fw-bold mt-2">Top Accounts by Invoice Count</h6>
                <Spin spinning={loading9}>
                    <Chart options={pieOptions1} series={seriesData} type="donut" width="100%" height="240px" />
                </Spin>
            </div>
            <div className="col-md-8 bg-white py-2 ps-4 pe-2 grid-title-card">
                <div className="d-flex my-auto px-2 pt-2">
                    <h6 className="txt-primary fw-bold fs-16">Revenue Statistics</h6>
                    <div className='col-md-2 ms-auto '>
                        <div className=" me-2">
                            <Select
                                showSearch
                                getPopupContainer={(trigger) => trigger.parentNode}
                                placeholder=""
                                className="w-100"
                                defaultValue={acc}
                                value={acc}
                                onChange={handleAccountChange}
                                optionFilterProp="children"
                                filterOption={(input: any, option: any) => {
                                    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0 || option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                                }}
                                notFoundContent={
                                    <div className="text-center p-4">
                                        {loading4 ? (
                                            <span>
                                                <LoadingOutlined />
                                                Loading...
                                            </span>
                                        ) : (
                                            <span>No account found</span>
                                        )}
                                    </div>
                                }
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                options={accOptions}
                            />
                        </div>
                    </div>
                    <Select
                        className="me-2"
                        value={rangeType}
                        onChange={handleRangeTypeChange}
                        style={{ width: 150 }}
                    >
                        <Option value="weekly">Weekly</Option>
                        <Option value="monthly">Monthly</Option>
                        <Option value="quarterly">Quarterly</Option>
                        <Option value="yearly">Yearly</Option>
                    </Select>

                    <Tooltip title="Export Invoice Data">
                        <Button  type="primary" className="add-btn h-auto" onClick={() => showModal()}>
                            Export
                        </Button>
                    </Tooltip>
                </div>
                <Spin spinning={loading9}>
                    <Chart options={options} series={series} type="bar" width="100%" height="240vh" />
                </Spin>
            </div>
            <ExportInvoice isOpen={open} callbackExport={callbackExport} />

        </div>
    )
}

export default InvoiceStats;