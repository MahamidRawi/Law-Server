import React, {useState, useEffect, useContext} from 'react';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Providers/auth.provider';
import { Container, Nav, Navbar } from 'react-bootstrap';
import '../../styling.css'


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
      <Nav.Link href="#home">Deliverers</Nav.Link>
      <Nav.Link href="#features">Distribution</Nav.Link>
      <Nav.Link href="#pricing">Profile</Nav.Link>
    </Nav>
    </Container>
  </Navbar>
                <Routes>
                    <Route index path='/' element={<>Home Page</>}/>
                    <Route path='/SECONDPAGE' element={<>SECOND PAGE</>}/>
                    <Route path='/THIRSPAGE' element={<>THIRD PAGE</>}/>
                </Routes>
                </div>
    )
}

export default MainRoutes