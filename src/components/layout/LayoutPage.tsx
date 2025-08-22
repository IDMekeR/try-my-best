import React, { ReactNode, useState, useEffect } from 'react';
import { Layout, Dropdown, Image, Modal, Menu, MenuProps } from 'components/shared/AntComponent';
import { CaretDownFilled, MenuOutlined, CloseOutlined } from 'components/shared/AntIcons';
import { Input } from 'components/shared/FormComponent';
import { useMatch, useNavigate, NavigateOptions } from 'react-router-dom';
import ProfileImg from 'assets/img/doctor.png';
import EEGImage from 'assets/img/brandname.png';
import EEGLogo from 'assets/img/logo.png';
import SearchImg from 'assets/img/global-search.png';
import SearchIcon from 'assets/img/search.svg';
import 'assets/styles/layout.scss';
import ChangePassword from './modal/ChangePassword';
import LogoutImg from 'assets/img/logout1.png';
import 'assets/styles/modal.scss';
import { menuDetails } from 'services/actions/dashboardAction';
import { useSelector, useDispatch } from 'components/shared/CompVariables';
import GlobalSearchModal from './modal/GlobalSearchModal';
import { getCountry, getState, getAllAccount, allPatientTag } from 'services/actions/commonServiceAction';
import { getUserProfile, userLogout } from 'services/actions/authAction';
import UserProfile from './modal/UserProfile';

const { confirm } = Modal;

const { Header, Content, Sider } = Layout;
type MenuItem = Required<MenuProps>['items'][number];

type LayoutProps = {
    children: ReactNode;
};

function getItem(label: React.ReactNode, key: React.Key, icon?: React.ReactNode, children?: MenuItem[], type?: 'group'): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const items: MenuProps['items'] = [
    {
        label: 'Profile',
        key: '1',
    },
    {
        label: 'Change Password',
        key: '2',
    },
    {
        label: 'Logout',
        key: '3',
    },
];

// const items: MenuProps['items'] = [
//     {
//         label: 'Change Password',
//         key: '1',
//     },
//     {
//         label: 'Logout',
//         key: '2',
//     },
// ];

const LayoutPage: React.FC<LayoutProps> = ({ children }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { menuInfo } = useSelector((state: any) => state.dashboard);
    const userRole = sessionStorage.getItem('role');
    const [collapsed, setCollapsed] = useState(false);
    const [openSearchModal, setOpenSearchModal] = useState(false);
    const [hide, setHide] = useState(true);
    const [openPassModal, setOpenPassModal] = useState(false);
    const [inputSearch, setInputSearch] = useState('');
    const [current, setCurrent] = useState('/login');
    const [profileModal, setProfileModal] = useState(false);


    const getCurrentKey = (menuData) => {
        const path = location?.pathname;

        const extractUrls = (menuItems) => {
            let urls: any = [];
            menuItems?.forEach((item) => {
                if (item?.menu_url && item?.menu_url !== '#') {
                    urls?.push(`/${item?.menu_url}`);
                }
                if (item?.submenuservice && item?.submenuservice?.length > 0) {
                    urls = urls?.concat(extractUrls(item?.submenuservice));
                }
            });
            return urls;
        };

        const validUrls = extractUrls(menuData);
        const matchedUrl = validUrls.find((url) => path?.startsWith(url));
        return matchedUrl || path;
    };

    useEffect(() => {
        if (location.pathname === '/buy-credit') {
            setCurrent('/my-credit');
        } else {
            setCurrent(getCurrentKey(menuInfo?.data));
        }
    }, [location?.pathname, menuInfo?.data]);

    const handleMenuClick = (e: any) => {
        if (e.key === '/invoice-manager') {
            navigate(e.key, { state: { tab: userRole == 'admin' ? '1' : '3' } } as NavigateOptions);
            if (!hide) {
                setHide(!hide);
            }
        } else {
            navigate(e.key);
            if (!hide) {
                setHide(!hide);
            }
        }
    };

    const showConfirm = () => {
        confirm({
            title: '',
            icon: null,
            className: 'custom-logout',
            okText: 'Logout',
            content: (
                <div className="d-flex">
                    <Image src={LogoutImg} className="logout-img" height="48px" width="70px" preview={false} />
                    <h5 className="text-center text-end text-dark mt-2 ps-2 mx-auto fs-18">Are you sure you want to logout?</h5>
                </div>
            ),
            onOk() {
                window.location.href = '/';
                localStorage.clear();
                dispatch(userLogout() as any);
            },
            onCancel() { },
        });
    };

    const handleMenuClick1 = (e: any) => {
        if (e.key === '3') {
            showConfirm();
        }
        if (e.key == '2') {
            setOpenPassModal(true);
        }
        if (e.key == '1') {
            setProfileModal(true);
        }
    };

    // const handleMenuClick1 = (e: any) => {
    //     if (e.key === '2') {
    //         showConfirm();
    //     }
    //     if (e.key == '1') {
    //         setOpenPassModal(true);
    //     }
    // };

    const handleProfileCancel = () => {
        setProfileModal(false);
    };

    const handleChangePass = () => {
        setOpenPassModal(false);
    };

    const getStateDetails = () => {
        const inputJson = {
            countryid: 231,
        };
        dispatch(getState(inputJson) as any);
    };
    const getCountryDetails = () => {
        const inputJson = {
            countryid: 0,
        };
        dispatch(getCountry(inputJson) as any);
    };
    function getProfileInfo() {
        const inputJson = {
            userid: Number(sessionStorage.getItem('userid')),
        };
        dispatch(getUserProfile(inputJson) as any);
    }

    useEffect(() => {
        // if (userRole === 'staff') {
        getProfileInfo();
        // }
    }, []);

    useEffect(() => {
        function getMenu() {
            const inputJson = {
                accountid: Number(sessionStorage.getItem('accountid')),
                userid: Number(localStorage.getItem('userid')),
            };
            dispatch(menuDetails(inputJson) as any);
        }
        getMenu();
    }, []);

    useEffect(() => {
        getStateDetails();
    }, []);
    useEffect(() => {
        getCountryDetails();
    }, []);
    useEffect(() => {
        dispatch(getAllAccount() as any);
    }, []);

    const items1: MenuProps['items'] = menuInfo?.data?.map((item: any) => {
        if (item?.submenuservice?.length === 0) {
            return getItem(
                item?.menu_name,
                `/${item?.menu_url}`,
                <img
                    src={require(`../../assets/img/menu-icons/${item?.menu_iconname}`)}
                    alt="sidemenu-icons"
                    width={18}
                    className={`${item?.menu_url == 'archive-list' ? 'svg' : item?.menu_url == 'edf_job_manager' ? 'svg' : 'png'}`}
                />,
            );
        } else {
            return getItem(
                item?.menu_name,
                `/${item?.id}`,
                <img src={require(`../../assets/img/menu-icons/${item?.menu_iconname}`)} alt="sidemenu-icons" width={18} />,
                item?.submenuservice?.map((submenu: any) => {
                    return getItem(submenu?.menu_name, `/${submenu?.menu_url}`);
                }),
            );
        }
    });

    const searchbyBtn = () => {
        setInputSearch('');
        navigate('/search', {
            state: {
                searchValue: inputSearch || '',
                categoryValue: '',
                statusValue: '',
                startDate: null,
                endDate: null,
                emailValue: '',
                tagValue: '',
                refresh: location.pathname === '/search' ? true : false,
            },
        } as NavigateOptions);
    };
    const handleSearch = (e: any) => {
        setInputSearch(e.target.value);
    };
    const resetSearch = (e: any) => {
        if (e.key === 'Backspace' && !e.target.value) {
            setInputSearch('');
        }
    };
    const handleInpSearch = (e: any) => {
        if (e.key === 'Enter') {
            setInputSearch('');
            navigate('/search', {
                state: {
                    searchValue: inputSearch || '',
                    categoryValue: '',
                    statusValue: '',
                    startDate: null,
                    endDate: null,
                    emailValue: '',
                    tagValue: '',
                    refresh: location.pathname === '/search' ? true : false,
                },
            } as NavigateOptions);
        }
    };

    const handleBack = () => {
        setOpenSearchModal(false);
    };

    const openFilter = () => {
        setOpenSearchModal(true);
        dispatch(allPatientTag() as any);
    };

    return (
        <div>
            <Layout>
                <Sider className={`${hide} bg-transparent border-0 sider shadow-sm`} collapsible collapsed={collapsed} onCollapse={(value: any) => setCollapsed(value)}>
                    <Header className="d-flex bg-white shadow-sm ps-0 pe-2">
                        <div className="bg-white d-flex text-center m-auto ">
                            <img src={EEGImage} alt="eeglogo" height="35px" className="long-logo" />
                            <img src={EEGLogo} alt="eeglogo" height="35px" className="short-logo" />
                        </div>
                        {!hide ? (
                            <div className="text-end pointer">
                                <CloseOutlined
                                    onClick={() => setHide(!hide)}
                                    size={40}
                                    className={`${hide} bg-transparent text-start me-auto text-primary fw-bold mt-2 closemenu ms-1 p-1 mb-1`}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </Header>
                    <div className="layout-container">
                        <Menu className="col-auto text-start py-3 scrollable-menu" selectedKeys={[current]} mode="inline" items={items1} onClick={handleMenuClick} />
                    </div>
                </Sider>
                <Layout>
                    <Header className="d-flex right-header shadow-sm ps-2 pe-3">
                        <div className="my-auto menubar-container d-flex">
                            <MenuOutlined size={40} onClick={() => setHide(!hide)} className={`${hide} my-auto text-primary menubar ms-2 py-1`} />
                            <Input
                                prefix={<img src={SearchIcon} height="13px" onClick={searchbyBtn} />}
                                suffix={<img src={SearchImg} className="pointer" onClick={openFilter} />}
                                value={inputSearch || ''}
                                onChange={(e) => handleSearch(e)}
                                onKeyDown={(e) => handleInpSearch(e)}
                                onKeyUp={(e) => resetSearch(e)}
                                placeholder="Global Search"
                                className="global-search-container ms-2"
                            />
                        </div>
                        <div className="ms-auto text-end my-auto d-flex header-name-cont">
                            <div className="text-end my-auto cursor-arrow">
                                <h6 className="fw-bold mb-0 text-primary text-capitalize fs-15">{sessionStorage?.getItem('firstname') + ' ' + sessionStorage?.getItem('lastname')}</h6>
                                <h6 className="text-secondary mb-0 mt-1 text-uppercase fw-600 fs-14">{sessionStorage.getItem('role') || 'Admin'}</h6>
                            </div>
                            <Dropdown menu={{ items, onClick: handleMenuClick1 }} trigger={['click']}>
                                <div className="d-flex pointer align-items-center justify-content-center pointer">
                                    <span className="avatar-clr my-auto mx-1">
                                        <Image src={ProfileImg} preview={false} className="shadow-sm rounded-circle" />
                                    </span>
                                    <CaretDownFilled color="#888" size={20} className="my-auto" />
                                </div>
                            </Dropdown>
                        </div>
                    </Header>
                    <Content className="m-2">{children}</Content>
                    <ChangePassword openModal={openPassModal} handleChangePass={handleChangePass} />
                    <GlobalSearchModal openModal={openSearchModal} handleChangePass={handleBack} searchValue={inputSearch} />
                    <UserProfile openModal={profileModal} handleProfile={handleProfileCancel} />
                </Layout>
            </Layout>
        </div>
    );
};

export default LayoutPage;
