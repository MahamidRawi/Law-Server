import { useContext } from 'react';
import axios, { AxiosResponse } from "axios";
import { AuthContext } from '../../Providers/auth.provider';
import config from '../../config';

const fetchHomePage = () => {
    return new Promise(async (resolve, reject) => {
        const { user, logout } = useContext(AuthContext);
        const token = localStorage.getItem('user_token');

        if (!user || !token) return logout();

        try {
            const res = await axios.get(config.API_BASE_URL + '/main/fetchHomePage', {headers: {'x-access-token': token}}) as AxiosResponse;
            return resolve({success: true, info: res.data});
        } catch (err) {
            return logout();
        }
});
}

export {fetchHomePage}