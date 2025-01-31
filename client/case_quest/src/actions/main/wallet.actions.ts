import axios, { AxiosError } from "axios";
import { UserInfo } from "../../data/types";
import config from "../../config";

const getWallet = (): Promise<{success: boolean, wallet: object, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.get(config.API_BASE_URL + '/main/wallet/getWallet', {headers: {'x-access-token': token}});
            return resolve({success: true, wallet: res.data.wallet});
        } catch (err) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false});
        }
    })
}

const transfer = async (transactionInfo: object): Promise<{success: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) reject({success: false, message: 'No Token', AR: true});
  try {
        await axios.post(config.API_BASE_URL + '/main/wallet/transfer', {transactionInfo}, {headers: {'x-access-token': token}});
        return resolve({success: true});
    } catch (err) {
        const axiosErr = err as AxiosError<{message: string}>;
        const stc = axiosErr.status;
        return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false});
    }
})
}

export {getWallet, transfer}
