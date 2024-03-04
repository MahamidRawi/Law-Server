import React, { useEffect, useContext, useState } from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoWalletOutline, IoLogOutOutline } from "react-icons/io5";
import { AuthContext } from '../../Providers/auth.provider';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../../styling.css'
import Home from '../../Screens/home.screen';
import { fetchUserInfo, getMails } from '../../actions/main/home.actions';
import { UserInfo } from '../../data/types';
import { balanceParser } from '../../helper/res.helper';
import NotificationScreen from '../../Screens/notifications.screen';
import Lawyers from '../../Screens/lawyers.screen';
import LawyerInformationScreen from '../../Screens/lawyer.information.screen';
import MailScreen from '../../Screens/mail.screen';
import { ViewDiscovery, ViewMail } from '../../RC/cards.rc';
import Wallet from '../../Screens/wallet.screen';
import { getWallet } from '../../actions/main/wallet.actions';
import NewCase from '../../Screens/cases/newcase.form';
import Logo from '../../RC/logo.screen';
import ViewCase from '../../Screens/cases/viewcase.screen';
import MenuScreen from '../../RC/menu.screens';
import SubpoenaScreen from '../../Screens/cases/caseActions/subpoena.screen';
import DepositionScreen from '../../Screens/cases/deposition.screen';


const MainRoutes: React.FC = () => {

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [notifications, setNotifications] = useState<any>([]);
    const [wallet, setWallet] = useState<any>({})

  useEffect(() => {
    if (user && (location.pathname.toLowerCase() == '/signin' || location.pathname == '/signup')) return navigate('/');
    fetchUserInfo(user).then(res => setUserInfo(res.userInfo)).catch(err => logout());
    getWallet().then(res => setWallet(res.wallet)).catch(err => logout())  
    getMails().then(res => {
        const filtered = res.mails.filter((mail: { senderId: any; id: any; opened: boolean; }) => {
            return mail.opened === false && mail.senderId !== res.ud;
        });
        setNotifications(filtered);
    }).catch(err => logout());
    return
}, [user, location]);
    return (
<div className="parent-container">
            <Navbar bg="dark" className='navbarfix' variant="dark">
                <Container className="justify-content-center">
                <button className='logoutbutton' onClick={() => logout()}>
                    <IoLogOutOutline className='logout-icon'/>
                </button>
                <Link to="/Notifications" className='nav-link'>
                        {notifications.length > 0 && <div className="notification-dot"></div>}
                        <IoMailOutline className='mail-icon' />
                    </Link>
                        <Link to="/Wallet" className='nav-link'>
                    <IoWalletOutline className='wallet-icon' />
                    </Link>
            <p className='balance-header'>{wallet?.balance && balanceParser(wallet?.balance)}</p>
                    <Nav className="justify-content-center w-100">
                        <Link to="/" className="navbar-brand ml-25">CaseQuest</Link>
                        <Link className='nav-link' to="/Cases">Cases</Link>
                        <Link className='nav-link' to="/Lawyers">Lawyers</Link>
                        <Link className='nav-link' to="/Firms">Firms</Link>
                        <Link className='nav-link' to="/My-Firm">My Firm</Link>
                    </Nav>
                </Container>
            </Navbar>
            <Routes>
                <Route index path='/' element={<Logo name={`${userInfo?.firstName} ${userInfo?.lastName}`} />}/>
                <Route path='/Cases' element={<Home />}/>
                <Route path='/ViewCase' element={<ViewCase />}/>
                <Route path='/Lawyers' element={<Lawyers />}/>
                <Route path='/Firms' element={<>Firms</>}/>
                <Route path='/My-Firm' element={<>My Firm</>}/>
                <Route path='/MoreInfo' element={<LawyerInformationScreen />}/>
                <Route path='/Mail' element={<MailScreen />} />
                <Route path='/ViewMail' element={<ViewMail/>}/>
                <Route path='/Wallet' element={<MenuScreen type='Wallet' title={wallet?.balance && balanceParser(wallet?.balance)}/>}/>
                <Route path='/NewCase' element={<NewCase />}/>
                <Route path='/ViewDiscovery' element={<ViewDiscovery />}/>
                <Route path='/FileMotion' element={<SubpoenaScreen formtype='File Motion' />}/>
                <Route path='/Subpoena' element={<SubpoenaScreen formtype='Subpoena' />}/>
                <Route path='/Deposition' element={<DepositionScreen />}/>
                <Route path='/Settle' element={<DepositionScreen settlement={true} />}/>
                {userInfo ? <Route path='/Notifications' element={<NotificationScreen />}/> : null}
            </Routes>
        </div>
    )
}

export default MainRoutes