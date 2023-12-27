import React, { useEffect, useContext, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoMailOpenOutline } from "react-icons/io5";
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
import { ViewMail } from '../../RC/cards.rc';


const MainRoutes = () => {

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<UserInfo>();
    const [notifications, setNotifications] = useState<any>([]);
    

  useEffect(() => {
    if (user && (location.pathname.toLowerCase() == '/signin' || location.pathname == '/signup')) navigate('/');
    fetchUserInfo(user).then(res => {setUserInfo(res.userInfo); console.log(res.userInfo)}).catch(err => logout());  
    getMails().then(res => {
        const filtered = res.mails.filter((mail: { senderId: any; id: any; opened: boolean; }) => {
            return mail.opened === false && mail.senderId !== res.ud;
        });
        console.log(filtered)
        setNotifications(filtered);
    }).catch(err => logout());
}, [user, location, navigate]);
    return (
<div className="parent-container">
            <Navbar bg="dark" className='navbarfix' variant="dark">
                <Container className="justify-content-center">
                <Link to="/Notifications" className='nav-link'>
                        {notifications.length > 0 && <div className="notification-dot"></div>}
                        <IoMailOutline className='mail-icon' />
                    </Link>
            <p className='balance-header'>{userInfo?.balance ? balanceParser(userInfo?.balance) : ''}</p>
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
                <Route index path='/' element={<Home />}/>
                <Route path='/Cases' element={<>Cases</>}/>
                <Route path='/Lawyers' element={<Lawyers />}/>
                <Route path='/Firms' element={<>Firms</>}/>
                <Route path='/My-Firm' element={<>My Firm</>}/>
                <Route path='/MoreInfo' element={<LawyerInformationScreen />}/>
                <Route path='/Mail' element={<MailScreen />} />
                <Route path='/ViewMail' element={<ViewMail/>}/>
                {userInfo ? <Route path='/Notifications' element={<NotificationScreen content={userInfo.notifications}/>}/> : null}
            </Routes>
        </div>
    )
}

export default MainRoutes