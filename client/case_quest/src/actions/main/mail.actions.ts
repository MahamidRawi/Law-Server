import axios, { AxiosError } from "axios";
import config from "../../config";

const sendMail = (targetMail: string, subject: string, body: string): Promise<{success: boolean, message?: string, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'Failed to Authenticate', AR: true});
        try {
        const res = await axios.post(config.API_BASE_URL + '/main/mail/sendMail', {targetMail, subject, body}, {headers: {'x-access-token': token}});
        return resolve({success: true});
        } catch (err) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status
            console.error(axiosErr.status)
            return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 ? true : false});
        // verify that everythings work with the backend (authorizations, etc...)
        }
    });
}

export {sendMail}