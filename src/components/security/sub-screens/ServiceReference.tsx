import React, { useState } from 'react';
import { Select } from 'components/shared/FormComponent';

const ServiceReference: React.FC = () => {
    const [selectedRole, setSelectedRole] = useState('1');
    const items = [
        { value: '1', label: 'Admin' },
        // { value: '2', label: 'Account Admin' },
        { value: '2', label: 'Technician' },
        { value: '3', label: 'Billing' },
        { value: '4', label: 'Admin Staff ' },
        { value: '5', label: 'Technician Staff ' },
        { value: '6', label: 'Billing Staff ' },
    ];

    const handleRoleChange = (value) => {
        setSelectedRole(value);
    };

    const serviceMenu = [
        { id: 1, menuService: 'Dashboard', subMenu: '#' },
        { id: 2, menuService: 'New Request', subMenu: '#' },
        { id: 3, menuService: 'Request in Pipeline', subMenu: '#' },
        { id: 4, menuService: 'Released Request', subMenu: '#' },
        { id: 5, menuService: 'Archived Request', subMenu: '#' },
        { id: 6, menuService: 'Patient', subMenu: '#' },
        {
            id: 7,
            menuService: 'Administrator',
            subMenu: [
                { id: 8, menuService: 'Account Management', subMenu: [] },
                { id: 9, menuService: 'EDF Setting', subMenu: '#' },
            ],
        },
        { id: 10, menuService: 'EDF Job Manager', subMenu: '' },
        { id: 11, menuService: 'Search', subMenu: '#' },
        {
            id: 12,
            menuService: 'Billing',
            subMenu: [
                { id: 13, menuService: 'Credit Manager', subMenu: '#' },
                { id: 14, menuService: 'Invoice', subMenu: null },
            ],
        },
        {
            id: 15,
            menuService: 'Master Data',
            subMenu: [
                { id: 16, menuService: 'Diagnosis', subMenu: null },
                { id: 17, menuService: 'Symptoms', subMenu: null },
                { id: 18, menuService: 'Lifestyle', subMenu: null },
                { id: 19, menuService: 'Marker Management', subMenu: '#' },
                { id: 20, menuService: 'Recommended Medication', subMenu: [] },
                { id: 21, menuService: 'Supplement', subMenu: null },
            ],
        },
        { id: 22, menuService: 'Report Comparison', subMenu: '#' },
        { id: 23, menuService: 'Security', subMenu: '#' },
    ];

    const serviceMenu1 = [
        { id: 1, menuService: 'Dashboard', subMenu: '#' },
        { id: 2, menuService: 'Order Management', subMenu: '#' },
        { id: 3, menuService: 'Released Request', subMenu: '#' },
        // { id: 4, menuService: 'Patient', subMenu: '#' },
    ];

    const serviceMenu2 = [
        { id: 1, menuService: 'Dashboard', subMenu: '#' },
        { id: 2, menuService: 'Order Management', subMenu: '#' },
        { id: 3, menuService: 'Released Request', subMenu: '#' },
        { id: 4, menuService: 'Patient', subMenu: '#' },
        {
            id: 5,
            menuService: 'Billing',
            subMenu: [
                { id: 6, menuService: 'Invoice', subMenu: '#' },
                { id: 7, menuService: 'Credit', subMenu: '#' },
            ],
        },
    ];

    const adminTechnician = [
        { id: 1, menuService: 'Dashboard', subMenu: '#' },
        { id: 2, menuService: 'New Request', subMenu: '#' },
        { id: 3, menuService: 'Request in Pipeline', subMenu: '#' },
        { id: 4, menuService: 'Released Request', subMenu: '#' },
        { id: 5, menuService: 'Edf Job Manager', subMenu: '#' },
    ];
    const adminBilling = [
        { id: 1, menuService: 'Dashboard', subMenu: '#' },
        {
            id: 2,
            menuService: 'Billing',
            subMenu: [
                { id: 13, menuService: 'My Credit', subMenu: '#' },
                { id: 14, menuService: 'Invoice', subMenu: null },
            ],
        },
    ];

    const sMenu = selectedRole === '1' ? serviceMenu : selectedRole === '2' ? adminTechnician : selectedRole === '3' ? adminBilling : selectedRole === '4' ? serviceMenu2 : selectedRole === '5' ? serviceMenu1 : adminBilling;


    // const sMenu = selectedRole === '1' ? serviceMenu : selectedRole === '3' ? serviceMenu1 : serviceMenu2;
    return (
        <div className="p-3">
            <div className="d-flex grid-title-card">
                <h6 className="my-auto fs-17">Available Service for User Role</h6>
                {selectedRole === '3' || selectedRole === '6' || selectedRole === '4' ? (
                    <div className="col-auto ms-auto text-danger my-auto fw-500">* Based on billing type, either &quot;My Credit&quot; or &quot;Invoice&quot; menu will be shown</div>
                ) : (
                    ''
                )}
                <div className="ms-auto d-flex col-md-1">
                    <Select value={selectedRole} options={items} className="w-100 border ms-auto" onChange={handleRoleChange} />
                </div>
            </div>

            <div className="mt-3">
                <table className="w-100 table-bordered edf-step-header">
                    <thead>
                        <tr className="status-header">
                            <th className="p-2">Service Name</th>
                            <th className="py-2 ps-4">Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sMenu?.map((item: any) => {
                            if (item?.subMenu?.length === 0 || item.subMenu === '' || item.subMenu === null || item.subMenu === '#') {
                                return (
                                    <tr key={item.id} className="p-2  bg-light border-0">
                                        <td className="p-2 border-start-0 border-end border-bottom">{item.menuService}</td>
                                        <td className="py-2 ps-4 border-start-0 border-end border-bottom">--</td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <React.Fragment key={item.id}>
                                        <tr key={item.id} className="p-2 bg-light border-0">
                                            <td className="p-2 border-start-0 border-end border-bottom">{item.menuService}</td>
                                            <td className="py-2 ps-4 border-start-0 border-end border-bottom">--</td>
                                        </tr>
                                        {item.subMenu?.map((itm) => {
                                            return (
                                                <tr key={itm.id} className="bg-white">
                                                    <td className="py-2 ps-4">{itm.menuService}</td>
                                                    <td className="py-2 ps-4">--</td>
                                                </tr>
                                            );
                                        })}
                                    </React.Fragment>
                                );
                            }
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceReference;
