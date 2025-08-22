import React, { useState, useEffect } from "react";
import AccountManagement from "./AccountManagement";
import {Input} from 'components/shared/FormComponent';
import { QRCode, Tabs } from 'components/shared/AntComponent';
import AwaitingAccount from "./AwaitingAccount";
interface ChildProps {
    tabKey: any;
}

const { Search } = Input;

export default function Account() {
    const [selectedTab, setSelectedTab] = useState('1');

    const tabItems = [
        { key: '1', label: 'Awaiting for Approval', children: <AwaitingAccount tabKey={selectedTab} /> },
        { key: '2', label: 'Approved Accounts', children: <AccountManagement tabKey={selectedTab} /> },
        { key: '3', label: 'Account Signup Form', children: <SignUpAccountQr tabKey={selectedTab} /> }
    ];

    const handleTabChange = (e: any) => {
        setSelectedTab(e);
    }

    return (
        <div className="p-2">
            <div className="d-flex grid-title-card mb-3">
                <h5 className="my-auto ">Account Information</h5>
            </div>
            <div className="custom-tabs">
                <Tabs items={tabItems} defaultActiveKey={selectedTab} onChange={handleTabChange} indicator={{ size: 0 }} />
            </div>
        </div>
    )
}

const SignUpAccountQr: React.FC<ChildProps>= ({ tabKey }) => {
    const [copyMsg, setCopyMsg] = useState('');

    const url = window.origin;
    const urlValue = `${url}/signup-account`;

    const copyUrl = () => {
        navigator.clipboard.writeText(urlValue);
        setCopyMsg('Url copied successfully');
        setTimeout(() => {
            setCopyMsg('');
        }, 3000);
    };
    return (
        <div className="bg-white p-3 qr-container">
            <h6>Account Signup form QrCode Access :</h6>
            <div className="d-flex my-4">
                <QRCode value={urlValue} size={170} />
                <div className="ms-2 col-md-5">
                    <Search enterButton="Copy" value={urlValue} readOnly onSearch={copyUrl} />
                    {copyMsg ? <div className="bg-success text-white rounded my-2 p-2 col-auto"> {copyMsg}</div> : ''}
                </div>
            </div>
        </div>
    )
}