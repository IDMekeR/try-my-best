import React, { useEffect, useState } from 'react';
import { Avatar, Image, Spin, Tooltip } from 'components/shared/AntComponent';
import { EditIcon } from 'assets/img/custom-icons';
import { Button } from 'components/shared/ButtonComponent';
import Chart from 'react-apexcharts';
import { DashboardDetail } from 'services/actions/dashboardAction';
import { url2, useSelector, useDispatch } from 'components/shared/CompVariables';
import { ApexOptions } from 'apexcharts';
import AccountTabs from './sub-screens/AccountTabs';
import AccountModal from './modal/AccountModal';
import { getAccountDetail } from 'services/actions/accountAction';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { UserOutlined } from '@ant-design/icons';
import SignedAgreement from 'components/auth/SignedAgreement';

const AccountDetail: React.FC = () => {
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();
    const userRole = sessionStorage.getItem('role');
    const { userProfileInfo } = useSelector((state: any) => state.auth);
    const { loading3, acctInfo } = useSelector((state: any) => state.account);
    const { accInfo } = useSelector((state: any) => state.dashboard);
    const dateLength: any = accInfo != null ? accInfo.sr_graph : 0;
    const accountInfo = acctInfo?.data || [];
    const graphDates: any = [];
    const reqInits: any = [];
    const reqRels: any = [];
    const [openModal, setOpenModal] = useState(false);
    const accountId = Number(sessionStorage.getItem('accountid'));
    const userId = Number(sessionStorage.getItem('userid'));
    const [openAgreementModal, setOpenAgreementModal] = useState(false);


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

    const genderSeries = [
        accInfo !== null ? accInfo.Genderpie.pnt_gender_male : 0,
        accInfo !== null ? accInfo.Genderpie.pnt_gender_female : 0,
        accInfo !== null ? accInfo.Genderpie.pnt_gender_others : 0,
    ];

    const accInfoData = [
        // { id: 1, label: 'Account ID', value: accountInfo?.encoded_accountNumber || '--' },
        // { id: 2, label: 'Account Name', value: accountInfo?.account_name || '--' },
        { id: 3, label: 'Email', value: accountInfo?.contact_email || '--' },
        { id: 4, label: 'Contact Phone', value: accountInfo?.contact_phone || '--' },
        { id: 5, label: 'Active From', value: accountInfo ? dayjs(accountInfo?.created_on)?.format('MMMM D, YYYY') : '--' },
        { id: 6, label: 'Status', value: accountInfo?.status || '--' },
    ];


    const hasData = genderSeries.some(value => value > 0);

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
            },
        },
        legend: {
            show: true,
            fontSize: '10px',
            position: 'bottom',
            horizontalAlign: 'center',
        },
        stroke: {
            width: 0,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    labels: {
                        show: true,
                        total: {
                            show: !hasData,
                            label: 'No Gender Data Available',
                            formatter: function () {
                                return '';
                            }
                        }
                    }
                }
            },
        },
    };
    const series = [
        {
            name: 'New Request',
            type: 'bar',
            data: reqInits,
        },
        {
            name: 'Released request',
            type: 'bar',
            data: reqRels,
        },
    ];

    function getAccountData() {
        if (userRole === 'staff') {
            const accid = Number(sessionStorage.getItem('accountid'));
            dispatch(getAccountDetail(accid) as any);
        } else {
            const accid = location?.state?.accountid;
            dispatch(getAccountDetail(accid) as any);
        }
    }

    useEffect(() => {
        getAccountData();
    }, [userProfileInfo, userRole]);

    const options: ApexOptions = {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
            },
            zoom: {
                enabled: false,
            }
        },
        title: {
            text: 'New Request vs Released Request',
            align: 'left',
            floating: false,
            offsetX: 10,
            offsetY: 25,
            style: {
                fontWeight: 'bold',
            },
        },
        legend: {
            show: true,
            position: 'top',
            horizontalAlign: 'right',
            fontFamily: 'Lato',
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
            categories: graphDates,
        },
        tooltip: {
            x: {
                format: 'dd/MM/yy ',
            },
        },
    };
    function getGraphDetails() {
        const inputJson = {
            AccountID: accountId || location?.state?.accountid,
            userid: userId,
        };
        dispatch(DashboardDetail(inputJson) as any);
    }

    useEffect(() => {
        getGraphDetails();
    }, []);

    const showModal = () => {
        setOpenModal(true);
    };

    const handleBack = () => {
        setOpenModal(false);
    };

    const goBack = () => {
        navigate('/account');
    };

    const handleUserAgreement = () => {
        setOpenAgreementModal(true)
    }

    const closeAgreementModal = () => {
        setOpenAgreementModal(false);
    };

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mt-2">
                <h5 className="my-auto ">Account Information</h5>
                {
                    userRole !== 'staff' &&
                    <div className="ms-auto d-flex">
                        <Button type="primary" onClick={goBack}>
                            Back
                        </Button>
                    </div>
                }
            </div>
            <Spin spinning={!!loading3}>
                <div className="row mx-0 mt-2">
                    <div className="col-md-4 bg-white p-2 d-flex">
                        <div className={`${acctInfo?.agree_data?.acct_agreement_path ? '' : ''}flex-column bg-light p-1 col-md-4 text-center d-flex align-items-center justify-content-center `} >
                            {accountInfo?.iconpath && accountInfo?.iconpath !== 'None' ? (
                                <Image src={accountInfo?.iconpath?.startsWith('https:') ? accountInfo?.iconpath : ''} height={140} preview={false} />
                            ) : (
                                <Avatar size={140} icon={<UserOutlined />} className="bg-lightprimary text-primary" />
                            )}
                            <div className="ps-3 mt-3 account-name-info" >
                                <h6>{accountInfo?.account_name}</h6>
                                <p className="email-wrap">{accountInfo?.encoded_accountNumber ? (accountInfo?.encoded_accountNumber) : ""}</p>
                            </div>
                        </div>
                        <div className="col flex-wrap d-flex px-3 w-100 m-auto pntcard-info">
                            {accInfoData?.map((item: any) => {
                                return (
                                    <div className="col-md-6 ps-3 mt-3" key={item.id}>
                                        <h6>{item.label}</h6>
                                        <p className="email-wrap">{item.value}</p>
                                    </div>
                                );
                            })}
                            {acctInfo?.agree_data?.acct_agreement_path && userRole !== 'staff' && (
                                <div className="my-2 text-start  ps-3 fs-16">
                                    The user agreement is signed on <span className='fw-bold'>{acctInfo?.data?.created_on ? dayjs(acctInfo?.data?.created_on).format('DD/MM/YYYY') : null}</span>
                                    <a className="text-underline px-2" onClick={() => handleUserAgreement()}>
                                        click here to view
                                    </a>
                                </div>
                            )}
                        </div>
                        <Tooltip title="Edit">
                            <div className="ms-auto mb-auto text-end edit-icon text-success edit-card col-auto pointer" onClick={showModal}>
                                <EditIcon />
                            </div>
                        </Tooltip>
                    </div>
                    <div className="col-md-5 px-0">
                        <div className="bg-white ms-3">
                            <Chart options={options} series={series} type="area" width="100%" height="300vh" />
                        </div>
                    </div>
                    <div className="col-md-3 px-0">
                        <div className="ms-3 bg-white h-100">
                            <Chart options={genderOptions} series={genderSeries} type="donut" height="308vh" width="100%" />
                        </div>
                    </div>
                </div>
            </Spin>
            <AccountTabs />
            <AccountModal openModal={openModal} closeModal={handleBack} rowData={accountInfo} callBackGrid={getAccountData} />
            <SignedAgreement openModal={openAgreementModal} closeModal={closeAgreementModal} />

        </div>
    );
};

export default AccountDetail;
