import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../Providers/auth.provider';
import { SignIn } from '../Screens/auth.screens';
import { AuthForm } from '../RC/auth.rc';
import AuthRoutes from './auth.routes';
import MainRoutes from './Main/main.routes';
import { useNavigate, useLocation, BrowserRouter } from 'react-router-dom';
import '../styling.css';

export const Routes = () => {
    const {validate, user, login, logout} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('user_token');

        if (token) {
            console.error(validate())
            // if (Boolean(validate().success)) return login(token)
        } else {logout()};
        return setLoading(false);
    }, []);

    if (loading) return <div className='spinner' />

    return (

        user ? <BrowserRouter><MainRoutes /></BrowserRouter> : <AuthRoutes />
    )
}