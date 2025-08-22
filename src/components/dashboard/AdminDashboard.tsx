//admin
import { ApexOptions } from 'apexcharts';
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { Avatar, Spin } from 'components/shared/AntComponent';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { DashboardDetail, getClearNotification } from 'services/actions/dashboardAction';
import AccountDashboard from './AccountDashboard';
import NotificationDetail from './notification-detail-screen/NotificationDetail';
import DashboardSkeleton from './DashboardSkeleton';

const AdminDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const userRole = sessionStorage.getItem('role');
    const { loading, accInfo, loading2, notifyInfo,  notifyClearInfo, loading3} = useSelector((state: any) => state.dashboard);
    const dateLength = accInfo != null ? accInfo.sr_graph : 0;
    const [openModal, setOpenModal] = useState(false);
    const [notificationData, setNotificationData]: any = useState(null);
    const graphDates: any = [];
    const reqInits: any = [];
    const reqProgs: any = [];
    const reqRels: any = [];
    const [graphType, setGraphType] = useState('line');
    const colors = ['#fff2f3', '#f4f4ff', '#f0f9ff', '#fff9ea'];
    const tagColors = ['#ffd9dc', '#dedef9', '#dcf0fd', '#fbf1d7'];

    useEffect(() => {
        const inputJson = {
            AccountID: Number(sessionStorage.getItem('accountid')),
            userid: Number(sessionStorage.getItem('userid')),
        };
        dispatch(DashboardDetail(inputJson) as any);
    }, []);

    function getNotificationDetails() {
        const inputJson = {
            clear_info: '',
        };
        dispatch(getClearNotification(inputJson) as any);
    }

    useEffect(() => {
        getNotificationDetails();
    }, [dispatch]);

    const accItems = [
        { id: 1, accName: 'No. of Request', count: accInfo?.sr_count, color: '#7A6EFE', icon: 'RequestNo.svg' },
        { id: 2, accName: 'No. of Account', count: accInfo?.Act_count, color: '#FF5363', icon: 'AccountNo.svg' },
        { id: 3, accName: 'No. of Released', count: accInfo?.sr_publish, color: '#FFA902', icon: 'ReleasedNo.svg' },
        { id: 4, accName: 'No. of Patient', count: accInfo?.pnt_count, color: '#24A8FA', icon: 'PatientNo.svg' },
    ];

    if (dateLength !== 0) {
        if (dateLength?.dates !== null || dateLength?.dates !== '') {
            if (dateLength?.dates?.length > 7) {
                for (let i = dateLength.dates?.length - 1; i >= dateLength?.dates?.length - 7; i--) {
                    graphDates.push(dateLength.dates[i]);
                }
            } else {
                for (let i = 0; i < dateLength?.dates?.length; i++) {
                    graphDates.push(dateLength.dates[i]);
                }
            }
        }
        if (dateLength?.reqinits !== null || dateLength?.reqinits !== '') {
            if (dateLength?.reqinits?.length > 7) {
                for (let i = dateLength?.reqinits?.length - 1; i >= dateLength?.reqinits?.length - 7; i--) {
                    reqInits.push(dateLength.reqinits[i]);
                }
            } else {
                for (let i = 0; i < dateLength?.reqinits?.length; i++) {
                    reqInits.push(dateLength.reqinits[i]);
                }
            }
        }
        if (dateLength?.reqprogs !== null || dateLength?.reqprogs !== '') {
            if (dateLength?.reqprogs?.length > 7) {
                for (let i = dateLength?.reqprogs?.length - 1; i >= dateLength?.reqprogs?.length - 7; i--) {
                    reqProgs.push(dateLength.reqprogs[i]);
                }
            } else {
                for (let i = 0; i < dateLength?.reqprogs?.length; i++) {
                    reqProgs.push(dateLength.reqprogs[i]);
                }
            }
        }
        if (dateLength?.reqrels !== null || dateLength?.reqrels !== '') {
            if (dateLength?.reqrels?.length > 7) {
                for (let i = dateLength?.reqrels?.length - 1; i >= dateLength?.reqrels?.length - 7; i--) {
                    reqRels.push(dateLength.reqrels[i]);
                }
            } else {
                for (let i = 0; i < dateLength?.reqrels?.length; i++) {
                    reqRels.push(dateLength?.reqrels[i]);
                }
            }
        }
    }
    const genderSeries1 = [
        {
            name: 'Gender',
            type: "bar",
            data: [accInfo !== null ? accInfo.Genderpie.pnt_gender_male : 0,accInfo !== null ? accInfo.Genderpie.pnt_gender_female : 0,accInfo !== null ? accInfo.Genderpie.pnt_gender_others : 0],
        },
    ];

    const serviceReqSeries = [accInfo !== null ? accInfo.ReqDataPie.sr_new : 0, accInfo !== null ? accInfo.ReqDataPie.sr_review : 0, accInfo !== null ? accInfo.ReqDataPie.sr_rel : 0];

    const genderOptions: ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'Gender',
            align: 'left',
            margin: 10,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
            },
        },
        legend: {
            show: true,
            fontSize: '10px',
            position: 'bottom',
            // align: 'right',
            horizontalAlign: 'center',

            // markers: {
            //     width: 8,
            //     height: 8,
            //     radius: 5,
            //     offsetX: -5,
            // },
        },
        xaxis: {
            categories: [['Male'],['Female'],['Other']],
        },
        colors: ['#ffa902', '#7a6efe', '#24a8fa'],
        stroke: {
            width: 0,
        },
        plotOptions: {
            bar:{
                distributed:true
            }
        },
    };

    const series = [
        {
            name: 'New Request',
            type: graphType,
            data: reqInits,
        },
        {
            name: 'Request in pipeline',
            type: graphType == 'line' ? 'area' : 'bar',
            data: reqProgs,
        },
        {
            name: 'Released request',
            type: graphType == 'line' ? 'area' : 'bar',
            data: reqRels,
        },
    ];

    const accountSeries = [
        {
            name: 'New Request',
            type: graphType,
            data: reqInits,
        },
        {
            name: 'Released request',
            type: graphType == 'line' ? 'area' : 'bar',
            data: reqRels,
        },
    ];

    const options: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false // Disable zooming
            },
        },
        title: {
            text: 'New Request vs Released Request',
            align: 'left',
            floating: false,
            offsetX: 10,
            offsetY: 25,
            style: {
                fontWeight: 'bold',
                // FontFamily: 'Lato',
            },
        },
        legend: {
            show: true,
            position: 'top',
            // t: 'right',
            horizontalAlign: 'right',
            fontFamily: 'Lato',
            // markers: {
            //     width: 15,
            //     height: 3,
            // },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        colors: ['#ffa902', '#7a6efe', '#24a8fa'],
        xaxis: {
            // type: 'date',
            categories: graphDates,
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy ',
                // max: 4,
            },
        },
    };

    const serviceReqOptions: ApexOptions = {
        labels: userRole?.toLowerCase() === 'staff' ? ['New Request', 'Released Request'] : ['New Request', 'On Review', 'Released Request'],
        colors: userRole?.toLowerCase() === 'staff' ? ['#ffa902', '#24a8fa'] : ['#ffa902', '#7a6efe', '#24a8fa'],
        chart: {
            type: 'pie',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'New request Vs Released Request',
            align: 'left',
            margin: 10,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: 'bold',
                // FontFamily: 'Lato',
            },
        },
        legend: {
            show: true,
            fontSize: '10px',
            position: 'bottom',
            // align: 'right',
            horizontalAlign: 'center',
            // markers: {
            //     width: 8,
            //     height: 8,
            //     radius: 5,
            //     offsetX: -5,
            // },
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    labels: {
                        show: false,

                        total: {
                            show: false,
                        },
                    },
                },
            },
        },
    };
    const items = [
        {
            key: '1',
            label: <a onClick={() => setGraphType('bar')}>Bar Chart</a>,
        },
        {
            key: '2',
            label: <a onClick={() => setGraphType('line')}>Line Chart</a>,
        },
    ];

    const gotoErrorJob = (item: any) => {
        history(`/edf_job_manager/edf-processing`, {
            state: {
                id: item.req_id,
                reqFrom: 2,
                pntname: item?.patient_name
            },
        } as NavigateOptions);
    };

    const closeModal = () => {
        setOpenModal(false);
    };

    return (
        <div>
            {loading ? (
                <DashboardSkeleton />
            ) : (
                <>
                    {userRole?.toLowerCase() === 'staff' ? (
                        <AccountDashboard graphType={graphType} graphItem={items} serviceReqOptions={serviceReqOptions} accountSeries={accountSeries} options={options} />
                    ) : (
                        <div className="row m-0 dashboard-container">
                            <div className="col-md-9 px-0">
                                <div className="row mx-0 mb-1 dash-cards">
                                    {accItems?.map((item: any) => {
                                        return (
                                            <div className="col p-2 dashboard-cards" key={item.id}>
                                                <div className="p-2 w-100 rounded d-flex" style={{ background: item.color }}>
                                                    <div className=" col-auto p-2 rounded-circle ms-3" style={{ background: 'rgba(255,255,255,0.4)' }}>
                                                        <img src={require(`../../assets/img/dashboard-icons/${item.icon}`)} height="45px" />
                                                    </div>
                                                    <div className="m-auto">
                                                        <h4 className="text-white mb-1">{item.count}</h4>
                                                        <span className="text-white w-75 fs-15 fw-bold">{item.accName}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="row mx-0 mt-2 mb-3 chart-cont1">
                                    <div className="px-2 col-md-6">
                                        <div className="bg-white rounded h-100">
                                            <Chart options={serviceReqOptions} series={serviceReqSeries} type="pie" height="260vh" width="100%" />
                                        </div>
                                    </div>
                                    <div className="px-2 col-md-6">
                                        <div className="bg-white rounded">
                                            <Chart options={genderOptions} series={genderSeries1} type="bar" height="260vh" width="100%" />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white p-2 mx-2 rounded rel-req-chart">
                                    <Chart options={options} series={series} type="area" width="100%" height="420vh" />
                                </div>
                            </div>
                            <div className="col-md-3 py-2 pe-1 ps-2">
                                <div className="bg-white pb-2 rounded shadow-sm err-notification-cont">
                                    <div className="d-flex border-bottom p-2 error-title-card">
                                        <h5 className="text-primary p-2 fs-17 my-auto">Error Jobs</h5>
                                        <div className="error-dashboard text-danger fw-bold ms-auto">{accInfo?.notification?.message?.length || 0}</div>
                                    </div>
                                    <div className="error-job-container">
                                        {accInfo?.notification?.message?.map((item: any, index: number) => {
                                            return (
                                                <div className="d-flex border bg-white pointer p-1 error-job-card m-3 shadow-sm" key={index + 1}>
                                                    <div className="error-count rounded-circle" style={{ background: `${colors[index % colors.length]}` }}>
                                                        {index + 1}
                                                    </div>
                                                    <div className="my-auto ps-2 ">
                                                        <div className="fw-bold">{item.req_number}</div>
                                                        <div className="fs-10 err">{item.error_msg?.substring(0, 40) + '...'}</div>
                                                    </div>
                                                    <div className="my-auto click-btn bg-primary text-white p-2 ms-auto d-flex align-items-center" onClick={() => gotoErrorJob(item)}>
                                                        Click here
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        {accInfo?.notification?.message?.length === 0 ? (
                                            <div className="text-secondary text-center mx-auto mt-5 pt-5 fs-16">{loading ? 'Loading...' : 'No error jobs available'}</div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                </div>
                                <div className="mt-3 bg-white rounded note-cont">
                                    <div className="d-flex border-bottom p-2 error-title-card">
                                        <h5 className="txt-primary p-2 fs-17 my-auto">All Notifications</h5>
                                        {notifyClearInfo?.data && !loading3 ? <div className="error-dashboard text-danger fw-bold ms-auto">{notifyClearInfo?.data?.length || ''}</div> : ''}
                                    </div>
                                    <Spin spinning={loading3}>
                                        <div className="notification-container noti-cont  px-2 mx-1">
                                            {!loading3 && notifyClearInfo?.data ? (
                                                notifyClearInfo?.data?.map((item: any, index: any) => {
                                                    return (
                                                        <div key={item.id}>
                                                            <div className="d-flex pb-3 border-bottom pt-3 flex-wrap">
                                                                <div className="col-auto ps-2 my-auto me-2">
                                                                    <Avatar
                                                                        className="text-capitalize fw-bold"
                                                                        size={40}
                                                                        style={{ backgroundColor: `${tagColors[index % tagColors.length]}`, color: '#888888' }}
                                                                    >
                                                                        {item.label_name[0]}
                                                                    </Avatar>
                                                                </div>
                                                                <div className="col">
                                                                    <h6 className="text-dark text-capitalize mb-0 mt-0 fw-600 fs-16">{item.label_name}</h6>
                                                                    <div className="fs-13 d-flex">
                                                                        <div className="fw-500 text-gray fs-14 col" style={{ color: '#888' }}>
                                                                            {item.content}
                                                                        </div>
                                                                        <div
                                                                            className="col-auto ps-2"
                                                                            onClick={() => {
                                                                                setNotificationData([item]);
                                                                                setOpenModal(true);
                                                                            }}
                                                                        >
                                                                            <a className="text-decoration-underline">Show more</a>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            ) : (
                                                <div className="text-center p-4 fs-15 mt-5 text-secondary">{loading3 ? 'Loading...' : 'Notification not found'}</div>
                                            )}
                                        </div>
                                        <div
                                            className="p-2 text-center fs-16 fw-500 text-decoration-underline pointer"
                                            onClick={() => {
                                                setOpenModal(true);
                                                setNotificationData(notifyClearInfo?.data);
                                            }}
                                            style={{ color: '#0d6dfa' }}
                                        >
                                            View All Notifications
                                        </div>
                                    </Spin>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
            <NotificationDetail openModal={openModal} closeModal={closeModal} notificationData={notificationData} />
        </div>
    );
};

export default AdminDashboard;
