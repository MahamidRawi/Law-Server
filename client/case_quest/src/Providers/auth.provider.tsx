import React, { useState, ReactNode } from 'react';

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
                return 'validated'
            }

        }}>{children}</AuthContext.Provider> 
    )
}