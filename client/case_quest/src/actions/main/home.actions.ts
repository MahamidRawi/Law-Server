import axios from "axios";
import config from '../../config';
import { UserCase, UserInfo } from "../../data/types";

interface resProps {
    success: boolean,
    info: {
        userInfo: UserInfo,
        userCases: UserCase
    }
}

interface UserInformationProps {
    success: boolean,
    userInfo: UserInfo
}

const fetchHomePage = (user: any): Promise<resProps> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token || !user) return reject({success: false, message: 'Failed'})

    try {
        const {userInfo, userCases} = (await axios.get(config.API_BASE_URL+'/main/fetchHomePage', {headers: {'x-access-token': token}})).data; 
        return resolve({success: true, info: {userInfo: userInfo.info, userCases}});
} catch (err) {
    return reject({success: false, message: 'Failed'});
}
})
}

const fetchUserInfo = (user: any): Promise<UserInformationProps> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token || !user) return reject({success: false, message: 'Failed'})

    try {
        const userInfo = await axios.get(config.API_BASE_URL+'/main/getUserInfo', {headers: {'x-access-token': token}}); 
        return resolve({success: true, userInfo: userInfo.data.info});
} catch (err) {
    return reject({success: false, message: 'Failed'});
}
})
}

export {fetchHomePage, fetchUserInfo}