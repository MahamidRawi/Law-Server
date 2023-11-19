import React, {useState, useEffect} from 'react';
import { Container, NavbarBrand, Navbar, Nav } from 'react-bootstrap';
import {BrowserRouter, Routes, Route, Link, Navigate} from 'react-router-dom';
import { AuthContext } from '../Providers/auth.provider';
import { AuthForm } from '../RC/auth.rc';

const AuthRoutes = () => {

    return (
            <BrowserRouter>
                <Routes>
                    <Route path='/' element={<Navigate to='/SignIn' replace/>}/>
                    <Route path='/SignUp' element={<AuthForm formType='Sign Up' />}/>
                    <Route path='/SignIn' element={<AuthForm formType='Sign In' />}/>
                </Routes>
            </BrowserRouter>
    )

}

export default AuthRoutes