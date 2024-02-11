import React from 'react';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { AuthForm } from '../RC/auth.rc';

const AuthRoutes = () => {

    return (
                <Routes>
                    <Route path='/' element={<Navigate to='/SignIn' replace/>}/>
                    <Route path="*" element={<Navigate to="/" />}/>
                    <Route path='/SignUp' element={<AuthForm formType='Sign Up' />}/>
                    <Route path='/SignIn' element={<AuthForm formType='Sign In' />}/>
                </Routes>
    )

}

export default AuthRoutes