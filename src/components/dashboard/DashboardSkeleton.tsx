import React, { useState, useEffect } from 'react';
import { Skeleton } from 'components/shared/AntComponent';

const DashboardSkeleton: React.FC = () => {
    return (
        <div className="row g-0 m-0 mt-2">
            <div className="col-md-9">
                <div className="row m-0">
                    <div className="col">
                        <Skeleton.Button active className="w-100" />
                    </div>
                    <div className="col">
                        <Skeleton.Button active className="w-100 mx-2" />
                    </div>
                    <div className="col">
                        <Skeleton.Button active className="w-100 mx-2" />
                    </div>
                </div>
                <div className="row ms-2 me-0 my-2">
                    <div className="col p-2 me-1 bg-white">
                        <Skeleton active />
                    </div>
                    <div className="col ms-2 p-2 bg-white">
                        <Skeleton active />
                    </div>
                </div>
                <div className="bg-white ms-2 p-2">
                    <Skeleton active 
                    paragraph={{
                        rows: 8,
                    }}/>
                </div>
            </div>
            <div className="col bg-white mx-2 p-2">
                <Skeleton active />
            </div>
        </div>
    );
};

export default DashboardSkeleton;
