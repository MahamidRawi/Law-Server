import React, { useState, ReactNode } from 'react';
import { userValidate } from '../actions/auth.actions';
import { UserInfo } from '../data/types';
import { userInfo } from 'os';
import { any, number } from 'joi';

interface Props {
    children?: ReactNode
}

export const AuthContext = React.createContext({
    user: null,
    login: (token: string) => {},
    logout: () => {},
    validate: () => {}
});

export const AuthProvider = ({children}: Props) => {
    const [user, setUser] = useState<any>(null);


    return (
        <AuthContext.Provider value={{
            user,
            login: (token) => {
                setUser(token);
                return localStorage.setItem('user_token', token);
            },
            logout: () => {
                setUser(null);
                return localStorage.removeItem('user_token');
            },
            validate: () => {
                const token = localStorage.getItem('user_token');
                userValidate(token).then(res => setUser(token)).catch(err => {setUser(null)});
            }

        }}>{children}</AuthContext.Provider> 
    )
}