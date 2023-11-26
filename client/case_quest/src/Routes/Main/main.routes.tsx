import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/auth.provider';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../../styling.css'
import Home from '../../Screens/home.screen';


const MainRoutes = () => {

    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

  useEffect(() => {
    if (user && (location.pathname.toLowerCase() == '/signin' || location.pathname == '/signup')) navigate('/');}, [user, location, navigate]);
    return (
        <div className="parent-container">
        <Navbar bg="dark" variant="dark">
    <Container>
    <Link className="link" to="/"><Navbar.Brand href="/">CaseQuest</Navbar.Brand></Link>
    <Nav className="me-auto">
      <Link className='nav-link' to="/secondPage">Deliverers</Link>
      <Link className='nav-link' to="/thirdPage">Distribution</Link>
      <Link className='nav-link' to="/fourthPage">Profile</Link>
    </Nav>
    </Container>
  </Navbar>
                <Routes>
                    <Route index path='/' element={<Home />}/>
                    <Route path='/secondPage' element={<>SECOND PAGE</>}/>
                    <Route path='/thirdPage' element={<>THIRD PAGE</>}/>
                    <Route path='/fourthPage' element={<>FOURTH PAGE</>}/>
                </Routes>
                </div>
    )
}

export default MainRoutes