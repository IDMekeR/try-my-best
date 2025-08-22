import React, { useEffect, useState } from 'react';
import { Button } from 'components/shared/ButtonComponent';
import { Divider, Spin } from 'components/shared/AntComponent';
import { CheckOutlined, CaretDownFilled } from 'components/shared/AntIcons';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getCreditPackage } from 'services/actions/billingAction';
import PlanPayDetails from './modal/PlanPayDetails';

interface ChildProps{
    edit:boolean;
    closeModal:()=>void;
}

const BuyCredit :React.FC<ChildProps>= ({edit, closeModal}) => {
    const dispatch = useDispatch();
    const history = useNavigate();
    const [selectedPackage, setSelectedPackage]: any = useState(2);
    const { loading4, packageInfo, success4 } = useSelector((state: any) => state.billing);
    const [showSuccessmsg, setShowSuccessmsg] = useState(false);
    const successmsg = showSuccessmsg ? success4 : null;
    const [bundle, setBundle]: any = useState([]);
    const [isSelected, setIsSelected] = useState(false);
    const [startIndex, setStartIndex] = useState(0);
    const totalItems = bundle?.length || 0;
    const itemsPerPage = 3;
    const handlePackageClick = (pkg: any, packageId: number) => {
        setSelectedPackage(pkg);
    };
    useEffect(() => {
        dispatch(getCreditPackage() as any);
        setShowSuccessmsg(true);
    }, [dispatch]);

    useEffect(() => {
        if (successmsg) {
            setBundle(packageInfo?.data);
            setShowSuccessmsg(false);
        }
    }, [successmsg]);

    const handlePaymentDetail = () => {
        setIsSelected(true);
    };

    const drawerCallbackFunc = (item: any) => {
        setIsSelected(item);
    };

    const handleNextClick = () => {
        const nextIndex = Math.min(startIndex + 1, totalItems - itemsPerPage);
        setStartIndex(nextIndex);
    };

    const handlePrevClick = () => {
        const prevIndex = Math.max(startIndex - 1, 0);
        setStartIndex(prevIndex);
    };

    const renderNavigationButtonsLeft = () => {
        const showLeftNav = startIndex !== 0;
        return (
            <div className="navigation-buttons  d-flex justify-content-center align-items-center">
                {showLeftNav && (
                    <Button className="arrow-btn right me-3" onClick={handlePrevClick}>
                        <CaretDownFilled size={50} rotate={90} />
                    </Button>
                )}
            </div>
        );
    };

    const renderNavigationButtonsRight = () => {
        const showRightNav = startIndex + itemsPerPage < totalItems;
        return (
            <div className="navigation-buttons  d-flex justify-content-center align-items-center">
                {showRightNav && (
                    <Button className="arrow-btn left ms-3" onClick={handleNextClick}>
                        <CaretDownFilled size={50} rotate={-90} />
                    </Button>
                )}
            </div>
        );
    };

    const handleBack = () => {
        history('/my-credit');
    };

    const resetBuyModal = () => {
        setIsSelected(false);
    };

    return (
        <div className='p-2'>
            <>
                {!isSelected ? (
                    <div className="buyCredit">
                        <div className="row mx-0 pe-0 justify-content-between mb-1">
                            <h5 className="ps-0 col my-auto"> Plan & Pricing </h5>
                            {/* {!props?.data?.edit ? ( */}
                            <div className="col-auto ms-auto pe-0">
                                <Button type="primary" className="buyBack-btn my-auto" onClick={handleBack}>
                                    Back
                                </Button>
                            </div>
                            {/* ) : (
                            ''
                        )} */}
                        </div>
                        <div className="buyCreditCont shadow-sm border rounded pt-1">
                            <div className=" position-relative">
                                <p className="ps-4 pt-2 plan-title text-center mb-2"> </p>
                            </div>
                            <div className="bundleCont">
                                <h3 className="text-center p-2 mb-5 text-dark">Choose your pricing plan</h3>
                                <div className="subscription-packages d-flex justify-content-center">
                                    {loading4 ? (
                                        <Spin className="h-100 d-flex justify-content-center align-items-center" />
                                    ) : (
                                        <>
                                            {startIndex !== 0 && renderNavigationButtonsLeft()}
                                            <div className="center-content">
                                                <div className="d-flex justify-content-center align-items-center">
                                                    {bundle?.slice(startIndex, startIndex + itemsPerPage).map((pkg: any, index: number) => (
                                                        <div key={pkg.id} className={`package-item bg-white  ${index % 2 !== 0 ? 'selected-package' : ''}`} onClick={() => handlePackageClick(pkg, pkg.id)}>
                                                            <div className="d-flex packageCont shadow flex-column">
                                                                <div className="d-flex flex-column align-items-center">
                                                                    <h4 className="packageName text-secondary text-capitalize fw-bold">{pkg.package_plan}</h4>
                                                                    <h2 className="fw-bold my-3 packagePrice">${pkg.package_price}</h2>
                                                                </div>
                                                                <div className="w-100 d-flex justify-content-center mt-5 btn-cont">
                                                                    <Button className={`package-btn mb-1`} type="primary" onClick={handlePaymentDetail}>
                                                                        Buy Now
                                                                    </Button>
                                                                </div>
                                                                <Divider className="packageDivider" />
                                                                <div className="d-flex flex-column align-items-start  amountCont mt-3">
                                                                    <ul className="list-Cont ps-4">
                                                                        <li>
                                                                            <p className="mb-1">
                                                                                <CheckOutlined className="pe-2 check-icon" />
                                                                                {pkg.credit_count} Credit
                                                                            </p>
                                                                        </li>
                                                                        <li>
                                                                            <p className="mb-1">
                                                                                <CheckOutlined className="pe-2 check-icon" />
                                                                                No time limit
                                                                            </p>
                                                                        </li>
                                                                        <li>{/* <p className='mb-1'><CheckOutlined className='pe-2 check-icon'/>{pkg.credit_count} Credit</p> */}</li>
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {startIndex !== totalItems - itemsPerPage && renderNavigationButtonsRight()}
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                ) : (

                    <PlanPayDetails drawerCallbackFunc={drawerCallbackFunc} planDetail={packageInfo} selectedPackage={selectedPackage} edit={edit} closeModal={closeModal} resetBuyModal={resetBuyModal} />
                )}
            </>
        </div>
    )
}

export default BuyCredit;