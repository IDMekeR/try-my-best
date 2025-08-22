import React, { useState, useEffect } from 'react';
import { Modal } from 'components/shared/AntComponent';
import { Checkbox } from 'components/shared/FormComponent';
import { useSelector } from 'components/shared/CompVariables';

interface ChildProps {
    openModal: boolean;
    closeModal: () => void;
    rowData: any;
    callbackFunc: (val: any) => void;
    submitFunc: (val: any) => void;
}

const AccReportItemModal: React.FC<ChildProps> = ({ openModal, rowData, closeModal, callbackFunc, submitFunc }) => {
    const { loading10 } = useSelector((state: any) => state.account);
    const [selectedItems, setSelectedItems]: any = useState([]);
    const { reportItemInfo } = useSelector((state: any) => state.account);
    let count = 0;

    useEffect(() => {
        if (reportItemInfo?.data) {
            setSelectedItems([]);
            const arr: any = [];
            const rowData = reportItemInfo?.data;
            for (let i = 0; i < rowData?.length; i++) {
                if (rowData[i].is_associate) {
                    arr.push(rowData[i].id);
                }
            }
            setSelectedItems(arr);
        }
    }, [reportItemInfo?.data]);

    const handleSelectReport = (id: any, e: any) => {
        let val = [...selectedItems];
        if (e.target.checked) {
            val.push(id);
            setSelectedItems(val);
            callbackFunc(val);
        } else {
            val = selectedItems.filter((item: any) => item !== id);
            setSelectedItems(val);
            callbackFunc(val);
        }
    };

    const submitFuncs = () => {
        submitFunc(selectedItems);
    };

    return (
        <div>
            <Modal
                title="Associate Report Items"
                confirmLoading={loading10}
                open={openModal}
                onCancel={() => closeModal()}
                onOk={submitFuncs}
                okText="Save"
                okButtonProps={{ disabled: selectedItems.length == 0 }}
                cancelButtonProps={{
                    style: { backgroundColor: '#ff4242', color: 'white' }
                }}
            >
                {rowData
                    ?.filter((item) => item.credit_code !== 'RPT')
                    ?.map((item: any) => {
                        if (!item.is_associate && !item.is_default) {
                            count++;
                            return (
                                <div key={item.id}>
                                    <Checkbox onChange={(e) => handleSelectReport(item.id, e)} checked={selectedItems?.includes(item.id)}>
                                        {item.credit_item}
                                    </Checkbox>
                                </div>
                            );
                        }
                        return null;
                    })}
                {count == 0 ? 'No Report Items available' : ''}
            </Modal>
        </div>
    );
};

export default AccReportItemModal;
