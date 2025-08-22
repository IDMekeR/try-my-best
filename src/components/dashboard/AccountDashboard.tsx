import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { Spin } from 'components/shared/AntComponent';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import { QRCode, Avatar } from 'components/shared/AntComponent';
import { Input } from 'components/shared/FormComponent';
import NotificationDetail from './notification-detail-screen/NotificationDetail';
import { useNavigate, NavigateOptions } from 'react-router-dom';
import { DashboardDetail, getNotification, getClearNotification } from 'services/actions/dashboardAction';


interface ChildProps {
    graphType: any;
    graphItem: any;
    serviceReqOptions: any;
    accountSeries: any;
    options: any;
}

const { Search } = Input;

const AccountDashboard: React.FC<ChildProps> = ({ graphItem, graphType, serviceReqOptions, accountSeries, options }) => {
    const navigate = useNavigate();
    const { loading, accInfo, loading2, notifyInfo,notifyClearInfo, loading3 } = useSelector((state: any) => state.dashboard);
    const { loading4, allAccountInfo } = useSelector((state: any) => state.commonData);
    const [copyMsg, setCopyMsg] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [notificationData, setNotificationData]: any = useState(null);
    const guidID = !loading4 ? allAccountInfo?.data?.[0]?.Acc_GUID : '';
    const url = window.origin;
    const urlValue = `${url}/patient-form/${guidID}`;
    const colors = ['#fff2f3', '#f4f4ff', '#f0f9ff', '#fff9ea'];
    const tagColors = ['#ffd9dc', '#dedef9', '#dcf0fd', '#fbf1d7'];
    const accItems = [
        { id: 1, accName: 'No. of Request', count: accInfo?.sr_count, color: '#7A6EFE', icon: 'RequestNo.svg' },
        { id: 3, accName: 'No. of Released', count: accInfo?.sr_publish, color: '#FFA902', icon: 'ReleasedNo.svg' },
        { id: 4, accName: 'No. of Patient', count: accInfo?.pnt_count, color: '#24A8FA', icon: 'PatientNo.svg' },
    ];
    const copyUrl = () => {
        navigator.clipboard.writeText(urlValue);
        setCopyMsg('Url copied successfully');
        setTimeout(() => {
            setCopyMsg('');
        }, 3000);
    };

    const genderSeries = [
        accInfo !== null ? accInfo.Genderpie.pnt_gender_male : 0,
        accInfo !== null ? accInfo.Genderpie.pnt_gender_female : 0,
        accInfo !== null ? accInfo.Genderpie.pnt_gender_others : 0,
    ];
    const serviceReqSeries = [accInfo !== null ? accInfo.ReqDataPie.sr_new : 0, accInfo !== null ? accInfo.ReqDataPie.sr_rel : 0];

    const genderOptions: ApexOptions = {
        labels: ['Male', 'Female', 'Other'],
        colors: ['#ffa902', '#7a6efe', '#24a8fa'],
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

    const closeModal = () => {
        setOpenModal(false);
    };

    const navigateOrderScreen=(item:any)=>{
        navigate(`/view-request/order-management`, {
            state: {
                reqId: item.req_id,
                status: null,
                active: null,
                error: true,
            },
        } as NavigateOptions);
    }

    return (
        <div className="row m-0 dashboard-container">
            <div className="col-md-8 px-0">
                <div className="row mx-0 mb-1">
                    {accItems?.map((item: any) => {
                        return (
                            <div className="col p-2 dashboard-cards" key={item.id}>
                                <div className="p-2 w-100 rounded d-flex" style={{ background: item.color }}>
                                    <div className=" col-auto p-2 rounded-circle ms-3" style={{ background: 'rgba(255,255,255,0.4)' }}>
                                        <img src={require(`../../assets/img/dashboard-icons/${item.icon}`)} height="45px" />
                                    </div>
                                    <div className="m-auto">
                                        <h4 className="text-white mb-1">{item.count}</h4>
                                        <span className="text-white w-75 fs-14 fw-bold">{item.accName}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="row mx-0 mt-2 mb-3">
                    <div className="px-2 col-md-4">
                        <div className="rounded shadow-sm bg-white p-2 ">
                            <h6 className="text-dark ps-2">Patient Intake Form QRCode Access:</h6>
                            <div className="m-0">
                                <div className="col">
                                    <QRCode value={urlValue} size={170} className="border-0" />
                                </div>
                                <div className="ms-2 col">
                                    <Search enterButton="Copy" value={urlValue} readOnly onSearch={copyUrl} />
                                    {copyMsg ? <div className="bg-success text-white rounded my-2 p-2 col-auto"> {copyMsg}</div> : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="px-2 col-md-4">
                        <div className="bg-white rounded h-100">
                            <Chart options={serviceReqOptions} series={serviceReqSeries} type="pie" height="260vh" width="100%" />
                        </div>
                    </div>
                    <div className="px-2 col-md-4">
                        <div className="bg-white rounded h-100">
                            <Chart options={genderOptions} series={genderSeries} type="donut" height="260vh" width="100%" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-2 mx-2 rounded rel-req-chart shadow-sm">
                    <Chart options={options} series={accountSeries} type="area" width="100%" height="420vh" />
                </div>
            </div>
            <div className="col-md-4 py-2 pe-1 ps-2">
                <div className="bg-white pb-2 rounded shadow-sm">
                    <div className="d-flex border-bottom p-2 error-title-card">
                        <h5 className="text-primary p-2 fs-17 my-auto">Error Jobs</h5>
                        <div className="error-dashboard text-danger fw-bold ms-auto">{accInfo?.notification?.message?.length || 0}</div>
                    </div>
                    <div className="error-job-container error-job-container-account">
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
                                    <div className="my-auto click-btn bg-primary text-white p-2 ms-auto d-flex align-items-center" onClick={()=>navigateOrderScreen(item)}>Click here</div>
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

                <div className="mt-3 bg-white">
                    <div className="d-flex border-bottom p-2 error-title-card">
                        <h5 className="txt-primary p-2 fs-17 my-auto">All Notifications</h5>
                        {notifyClearInfo?.data && !loading3 ? <div className="error-dashboard text-danger fw-bold ms-auto">{notifyClearInfo?.data?.length || '0'}</div> : notifyClearInfo?.data?.length||0}
                    </div>
                    <Spin spinning={loading3}>
                        <div className="notification-container noti-cont px-2 mx-1">
                            {!loading3 && notifyClearInfo?.data?.length>0 ? (
                                notifyClearInfo?.data?.map((item, index) => {
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
                                                            className="col-auto pointer"
                                                            onClick={() => {
                                                                setOpenModal(true);
                                                                setNotificationData([item]);
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
                                <div className="text-center p-4 fs-15 text-secondary mt-5 ">{loading3 ? 'Loading...' : 'Notification not found'}</div>
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
                           {notifyClearInfo?.data?.length>0?"View All Notifications":""}
                        </div>
                    </Spin>
                </div>
            </div>
            <NotificationDetail openModal={openModal} closeModal={closeModal} notificationData={notificationData} />
        </div>
    );
};

export default AccountDashboard;
