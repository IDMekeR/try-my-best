import React, { useState, useEffect } from 'react';
import { Result } from 'components/shared/AntComponent';
import { Button } from 'components/shared/ButtonComponent';
import { useSelector } from 'components/shared/CompVariables';
import { useNavigate, NavigateOptions } from 'react-router-dom';

const AutopaySuccess: React.FC = () => {
    const navigate = useNavigate();
    const { acctInfo } = useSelector((state: any) => state.account);

    return(
        <div className=" vh-100 bg-white">
            <div className="p-5">
                <Result
                    className="p-5"
                    status="success"
                    title={`Payment Detail Saved Successful`}
                    subTitle="Thank you"
                    extra={[
                        <Button
                            type="primary"
                            className="mx-auto text-center"
                            key="console"
                            onClick={() =>
                                navigate('/account/account-details', {
                                    state: {
                                        uid: acctInfo?.data?.Acc_GUID || '',
                                        accountID: acctInfo?.data?.id,
                                        activeFrom: acctInfo?.data?.created_on,
                                    },
                                } as NavigateOptions)
                            }
                        >
                            Back to User Management
                        </Button>,
                    ]}
                />
            </div>
        </div>
    )
};


export default AutopaySuccess