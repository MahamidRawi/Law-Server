import React, { useEffect, useContext, useState } from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { IoMailOutline, IoMailOpenOutline } from "react-icons/io5";
import { AuthContext } from '../../Providers/auth.provider';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../../styling.css'
import Home from '../../Screens/home.screen';
import { fetchUserInfo } from '../../actions/main/home.actions';
import { UserInfo } from '../../data/types';
import { balanceParser } from '../../helper/res.helper';
import NotificationScreen from '../../Screens/notifications.screen';
import Lawyers from '../../Screens/lawyers.screen';
import LawyerInformationScreen from '../../Screens/lawyer.information.screen';
import MailScreen from '../../Screens/mail.screen';


const MainRoutes = () => {

    const {user, logout} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [userInfo, setUserInfo] = useState<UserInfo>();



  useEffect(() => {
    if (user && (location.pathname.toLowerCase() == '/signin' || location.pathname == '/signup')) navigate('/');
    fetchUserInfo(user).then(res => {setUserInfo(res.userInfo); console.log(res.userInfo)}).catch(err => logout());  
}, [user, location, navigate]);
    return (
<div className="parent-container">
            <Navbar bg="dark" className='navbarfix' variant="dark">
                <Container className="justify-content-center">
                    <Link to="/Notifications" className='nav-link'>{userInfo?.notifications ? <IoMailOutline className='mail-icon' /> :<IoMailOpenOutline className='mail-icon' />}</Link>
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
                <Route path='/ViewMail' element={<LawyerInformationScreen mail/>}/>
                {userInfo ? <Route path='/Notifications' element={<NotificationScreen content={userInfo.notifications}/>}/> : null}
            </Routes>
        </div>
    )
}

export default MainRoutes