import axios, { AxiosError } from "axios";
import { UserInfo } from "../../data/types";
import config from "../../config";

export const getLawyers = (): Promise<{success: boolean, lawyers: Array<UserInfo>}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, lawyers: null});
        try {
        const res = await axios.get(config.API_BASE_URL + '/main/getLawyers', {headers: {'x-access-token': token}});
        return resolve({success: res.data.success, lawyers: res.data.users});
        } catch (err) {
            return reject({success: false, lawyers: null});
        }
    })
}