import { useContext } from 'react';
import axios from "axios";
import { AuthContext } from '../../Providers/auth.provider';


const fetchMyCases = () => {
    const { user, logout } = useContext(AuthContext);
    const token = localStorage.getItem('user_token');

    if (!user || !token) return logout();

    
}