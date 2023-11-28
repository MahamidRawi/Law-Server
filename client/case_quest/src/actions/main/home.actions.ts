import { useContext } from 'react';
import axios, { AxiosResponse } from "axios";
import { AuthContext } from '../../Providers/auth.provider';
import config from '../../config';

interface resProps {
    success: boolean,
    info: {
        userInfo: object,
        userCases: object
    }
}

const fetchHomePage = (): Promise<resProps> => {
    return new Promise(async (resolve, reject) => {
        const {user, logout} = useContext(AuthContext);
        const token = localStorage.getItem('user_token');
        if (!token || !user) return logout();

//     try {
//         const {userInfo, userCases} = (await axios.get(config.API_BASE_URL+'/main/fetchHomePage', {headers: {'x-access-token': token}})).data; 
//         console.log(userInfo, userCases)
//         return resolve({success: true, info: {userInfo, userCases}});
// } catch (err) {
//     return logout();
// }
return axios.get(config.API_BASE_URL+'/main/fetchHomePage', {headers: {'x-access-token': token}}).then(res => resolve({success: true, info: {userInfo: res.data.userInfo, userCases: res.data.userCases}})).catch(err => logout());
})
}

export {fetchHomePage}