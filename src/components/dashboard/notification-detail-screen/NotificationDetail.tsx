import React, { useState, useEffect } from 'react';
import { Drawer, Avatar } from 'components/shared/AntComponent';
import { useSelector } from 'components/shared/CompVariables';
import { useNavigate, NavigateOptions } from 'react-router-dom';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    notificationData: any;
}

const NotificationDetail: React.FC<ChildProps> = ({ openModal, closeModal, notificationData }) => {
    const { loading2, notifyInfo } = useSelector((state: any) => state.dashboard);
    const history = useNavigate();
    const tagColors = ['#ffd9dc', '#dedef9', '#dcf0fd', '#fbf1d7'];

    const handleNotification = (itm: any, item: any) => {
        if (item?.due_invoice_flag || item?.aged_invoice_flag || item?.waiting_invoice_flag || item?.generate_invoice_flag || item?.paid_invoice_flag) {
            history('/invoice-manager', {
                state: { tab: item?.due_invoice_flag || item?.aged_invoice_flag ? '3' : item?.waiting_invoice_flag ? '2' : item?.generate_invoice_flag ? '1' : '4' },
            } as NavigateOptions);
        } else if (item?.complete_job_flag || item?.error_request_flag) {
            history(`/edf_job_manager/edf-processing`, {
                state: {
                    id: itm?.job_reqid,
                    reqFrom: itm?.request_from,
                    is_billing: itm?.is_billing,
                },
            } as NavigateOptions);
        } else if (item?.new_request_flag) {
            sessionStorage.setItem('reqId', itm.id);
            history(`/view-request/pipeline-request`, {
                state: {
                    id: itm?.service_request_id,
                    request_from: "pipeline",
                    archive: false,
                    is_archive: itm?.archive_data,
                    is_billing: itm?.is_billing,
                    reqDetail: itm,
                    reqFrom: itm?.request_from
                },
            } as NavigateOptions);
        } else if (item?.released_request_flag) {
            history(`/released-request/dataset-information`, {
                state: {
                    id: itm?.service_request_id,
                    isStaff: sessionStorage.getItem('role') === 'staff' ? true : false,
                    rowData: { request_from: itm.request_from,created_on:itm.created_on||null }
                },
            } as NavigateOptions);
        } else if (item?.intake_request_flag) {
            history(`/view-request/order-management`, {
                state: {
                    id: itm?.service_request_id,
                    reqId:itm?.service_request_id,
                    status: itm?.status === 'Request Init' ? false : true,
                    active: itm?.is_active,
                    error: false,
                    requestFrom: itm?.request_from,
                },
            } as NavigateOptions);
        } else if (item?.report_item_flag) {
            history(`/report-rate`, {
                state: {
                    id: itm?.service_request_id,
                    accountId: itm?.accountid,
                    isUpdate: true,
                    details: itm,
                },
            } as NavigateOptions);
        }else if(item?.account_flag){
            history(`/account`);
        }
    };

    return (
        <div>
            <Drawer open={openModal} width={500} onClose={closeModal} title={<h5 className="mb-0">Notification</h5>} loading={loading2}>
                <div className="px-2 mx-1">
                    {!loading2 && notificationData ? (
                        notificationData?.map((item: any, index: any) => {
                            return (
                                <div key={item.id} className="pb-2 border-bottom ">
                                    <div className="d-flex pt-3 flex-wrap ">
                                        <div className="col-auto ps-2 my-auto me-2">
                                            <Avatar className="text-capitalize fw-bold" size={40} style={{ backgroundColor: `${tagColors[index % tagColors.length]}`, color: '#888888' }}>
                                                {item.label_name[0]}
                                            </Avatar>
                                        </div>
                                        <div className="col">
                                            <h6 className="text-dark text-capitalize mb-0 mt-0 fw-600 fs-16">{item.label_name}</h6>
                                            <div className="fs-13 d-flex">
                                                <div className="fw-500 text-gray fs-14 col" style={{ color: '#888' }}>
                                                    {item.content}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${notificationData?.length == 1 ? '' : 'notify-height'} text-break px-2  text-wrap word-wrap p-2 bg-light ms-5 mt-2 ms-2`}>
                                        <div className="fs-15">
                                            <div className="d-flex flex-wrap">
                                                {item.info && Array.isArray(item.info) ? (
                                                    item.info.map((itm, i) => (
                                                        <React.Fragment key={i}>
                                                            <span className={`fs-14 text-capitalized pe-2`} key={i} onClick={() => handleNotification(itm, item)}>
                                                                <a className="text-decoration-underline">
                                                                    {itm?.invoice_number || itm?.encoded_request_number || itm?.job_req_number || itm?.encoded_accountNumber}
                                                                    {i < item.info.length - 1 && ', '}
                                                                </a>
                                                            </span>
                                                        </React.Fragment>
                                                    ))
                                                ) : (
                                                    <p className="text-center p-3 w-100">Details not found</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center p-4 fs-15 mt-5 text-secondary">Notification not found</div>
                    )}
                </div>
            </Drawer>
        </div>
    );
};

export default NotificationDetail;
