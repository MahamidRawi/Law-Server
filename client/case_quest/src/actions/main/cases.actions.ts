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

const getSubpoenasPricings = async (formtype: 'Subpoena' | 'File Motion'): Promise<{success: boolean, AR?: boolean, pricings: any}> => {
    return new Promise(async (resolve, reject) =>  {
    const token = localStorage.getItem('user_token');
        if (!token) reject({success: false, message: 'No Token', AR: true}) 
        
        try {
            const res = await axios.get(config.API_BASE_URL + '/main/cases/getSubpoenasPricings', {headers: {'x-access-token': token, 'target': formtype}});
            console.log(res.data);
            return resolve({success: true, pricings: res.data.calculatedPrices});
        } catch (err) {
            return reject({success: false, message: 'Unauthorised', AR: true})
        }
    })
}

const getCase = (caseId: string): Promise<{success: boolean, case: any, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.get(config.API_BASE_URL + '/main/cases/getCase', {headers: {'caseid' : caseId, 'x-access-token': token}});
            return resolve({success: true, case: res.data.case});
        } catch (err) {
            console.warn(err);
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.response?.status;
            return reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false});
        }
    })
}

const issueSubpoena = (caseId: string, subpoenaInfo: any): Promise<{message?: string, success: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/issueSubpoena', {subpoenaInfo, caseId}, {headers: {'x-access-token': token}});
            return resolve({success: true, message: res.data.message});
        } catch (err) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: axiosErr.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : axiosErr.response?.data.message});
        }
    })
}

const fileMotion = (caseId: string, subpoenaInfo: any): Promise<{message?: string, success: boolean, granted?: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/fileMotion', {subpoenaInfo, caseId}, {headers: {'x-access-token': token}});
            return resolve({success: true, message: res.data.message, granted: res.data.granted});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const sendMessage = (message: object, depositionId: string): Promise<{message?: string, success: boolean, granted?: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/deposition/sendMessage', {depositionId, message}, {headers: {'x-access-token': token}});
            return resolve({success: true, message: res.data.message});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const sendCourtMessage = (message: object, hearingId: string): Promise<{message?: string, success: boolean, granted?: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/court/sendCourtMessage', {hearingId, message}, {headers: {'x-access-token': token}});
            return resolve({success: true, message: res.data.message});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const councilRest = (hearingId: string): Promise<{message?: string, success: boolean, granted?: boolean, AR?: boolean}> => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/court/rest', { hearingId }, {headers: {'x-access-token': token}});
            return resolve({success: true, message: res.data.message});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const startDeposition = (subpoenee: object, caseId: string) => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/deposition/startDeposition', {subpoenee, caseId}, {headers: {'x-access-token': token}});
            return resolve({success: true, depositionId: res.data.depositionId, messages: res.data.messages});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const startHearing = (caseId: string | undefined) => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const res = await axios.post(config.API_BASE_URL + '/main/cases/court/startHearing', {caseId}, {headers: {'x-access-token': token}});
            console.log(res.data)
            return resolve({hearingId: res.data.hearingId, messages: res.data.transcript, rested: res.data.rested, judge: res.data.judge});
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    })
}

const endDeposition = (depositionId: string) => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            await axios.post(config.API_BASE_URL + '/main/cases/deposition/endDeposition', {depositionId}, {headers: {'x-access-token': token}});
            return resolve({ success: true });
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    });
}


const endSettlement = (depositionId: string) => {
    return new Promise(async (resolve, reject) => {
        const token = localStorage.getItem('user_token');
        if (!token) return reject({success: false, message: 'No Token', AR: true});
        try {
            const response = await axios.post(config.API_BASE_URL + '/main/cases/settlement/endSettlement', {depositionId}, {headers: {'x-access-token': token}});
            console.log(response.data)
            return resolve({ success: true });
        } catch (err: any) {
            const axiosErr = err as AxiosError<{message: string}>;
            const stc = axiosErr.status;
            return stc != 200 ? reject({success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false}) : resolve({success: true, message : err.response?.data.message});
        }
    });
}

const getRepresentativeLawyer = async (caseId: string) => {
    try {
        const token = localStorage.getItem('user_token');
        if (!token) throw new Error('No Token');
        const response = await axios.get(config.API_BASE_URL + '/main/cases/getRepresentativeLawyer', {headers: {
            'caseId': caseId,
            'x-access-token': token
        }});
        const {representativeLawyer} = response.data;
        return {lawyerInfo: representativeLawyer}
    } catch (err: any) {
        const axiosErr = err as AxiosError<{message: string}>;
        console.log(err.response.data)
        const stc = axiosErr.status;
        return stc != 200 ? {success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false} : {success: true, message : err.response?.data.message};
    }
}

const endTrial = async (trialId: string) => {
    try {
        const token = localStorage.getItem('user_token');
        console.log(token)
        if (!token) throw new Error('No Token');
        console.log('sending request');
        const response = await axios.post(config.API_BASE_URL + '/main/cases/court/endTrial', {}, {headers: {
            'hearingid': trialId,
            'x-access-token': token
        }});
        console.log('processing response...', response.data)
        const {result} = response.data.verdict;
        console.warn(result)
        return {result}
    } catch (err: any) {
        const axiosErr = err as AxiosError<{message: string}>;
        const stc = axiosErr.status;
        return stc != 200 ? {success: false, message: err.response?.data.message, AR: stc === 401 || stc === 404 ? true :  false} : {success: true, message : err.response?.data.message};
    }
}

export {endSettlement, endTrial, councilRest, sendCourtMessage, startHearing, getRepresentativeLawyer, endDeposition, startDeposition, sendMessage, fileMotion, issueSubpoena, createCase, getCase, getSubpoenasPricings}