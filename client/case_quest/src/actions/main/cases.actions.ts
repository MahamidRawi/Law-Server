import axios, { AxiosError } from 'axios';
import config from '../../config';

const createCase = async (caseInfo: object): Promise<{success: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) reject({success: false, message: 'No Token', AR: true});
  try {
        await axios.post(config.API_BASE_URL + '/main/cases/createCase', {caseInfo}, {headers: {'x-access-token': token}});
        return resolve({success: true});
    } catch (err) {
        const axiosErr = err as AxiosError<{message: string}>;
        const stc = axiosErr.status;
        return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false});
    }
})
}

const getCase = (caseId: string): Promise<{success: boolean, case: object, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            console.log(caseId)
            const res = await axios.get(config.API_BASE_URL + '/main/cases/getCase', {headers: {'caseid' : caseId, 'x-access-token': token}});
            return resolve({success: true, case: res.data.case});
        } catch (err) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false});
        }
    })
}

export {createCase, getCase}