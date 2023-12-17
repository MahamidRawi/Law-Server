import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../Providers/auth.provider';
import AuthRoutes from './auth.routes';
import MainRoutes from './Main/main.routes';
import { BrowserRouter } from 'react-router-dom';
import '../styling.css';
import { ActivityIncicator } from '../RC/acitivity.incdicator';

export const Routes = () => {
    const {validate, user, login, logout} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('user_token');

        if (token) validate(); else return logout();
        
        return setLoading(false);
    }, []);

    if (loading) return <div className='spinner' />

    return (
        loading ? <ActivityIncicator fullScreen={true} /> : user ? <BrowserRouter><MainRoutes /></BrowserRouter> : <AuthRoutes />
    )
}