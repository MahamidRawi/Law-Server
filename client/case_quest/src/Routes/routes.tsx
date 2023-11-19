import React, {useContext, useEffect, useState} from 'react';
import { AuthContext } from '../Providers/auth.provider';
import { SignIn } from '../Screens/auth.screens';
import { AuthForm } from '../RC/auth.rc';
import AuthRoutes from './auth.routes';

export const Routes = () => {
    const {validate, user} = useContext(AuthContext);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('user_token');

        if (token) validate();
        return setLoading(false);
    }, []);

    if (loading) return <p>loading</p>

    return (
        user ? <p>You are logged in</p> : <AuthRoutes />
    )
}