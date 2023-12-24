import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../Providers/auth.provider';
import AuthRoutes from './auth.routes';
import MainRoutes from './Main/main.routes';
import { BrowserRouter, useNavigate, useNavigation } from 'react-router-dom';
import '../styling.css';
import { ActivityIncicator } from '../RC/acitivity.incdicator';

export const Routes = () => {
    const {validate, user, login, logout} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        setLoading(true);
        const token = localStorage.getItem('user_token');

        token ? validate() : logout();
        
        
        return setLoading(false);
    }, []);

    if (loading) return <center><div className='spinner' /></center>

    return (
        user ? <BrowserRouter><MainRoutes /></BrowserRouter> : <AuthRoutes />
    )
}