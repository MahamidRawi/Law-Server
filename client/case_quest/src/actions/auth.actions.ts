import { AxiosResponse } from './../../node_modules/axios/index.d';
import axios, { AxiosError } from 'axios';
import config from '../config';

interface credentialsProps {
        firstName: string, lastName: string, email: any, password: string, username : string
}

interface inCredentialProps {
        email: string,
        password: string
}

interface SignUpResponse {
    message:string,
    success: boolean
}

interface ValidationResponse { success: boolean, message: string, info: any }

interface SignInResponse {
    message:string,
    token: string, 
    success: boolean,
}


interface ErrorResponse {
    message: {message: string};
}

const signUp = async (credentials: credentialsProps): Promise<SignUpResponse> => {
    return new Promise(async (resolve, reject) => {
    try {
        const res = await axios.post(config.API_BASE_URL+'/auth/signup', {
            credentials
        }) as AxiosResponse
    return resolve({success: true, message: res.data.message});
} catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    return reject({success: false, message: axiosError.response?.data.message})
}
})
}

const signIn = async (credentials: inCredentialProps): Promise<SignInResponse> => {
    return new Promise(async (resolve, reject) => {
    try {
        const res = await axios.post(config.API_BASE_URL+'/auth/signIn', {
            credentials
        }) as AxiosResponse
    return resolve({success: true, message: res.data.message, token: res.data.token});
} catch (err) {
    const axiosError = err as AxiosError<ErrorResponse>;
    return reject({success: false, message: axiosError.response?.data.message})
}
})
}

const userValidate = async (token: string | null): Promise<ValidationResponse> => {
    return new Promise(async (resolve, reject) => {
        try {
            const res = await axios.post(config.API_BASE_URL+'/auth/validate', {}, {headers: {'x-access-token': token}}) as AxiosResponse
            return resolve({success: true, message: res.data.message, info: res.data.info});
    } catch (err) {
        const axiosError = err as AxiosError<ErrorResponse>;
        console.log(axiosError.response?.data);
        return reject({success: false, message: axiosError.response?.data.message})
    }
    })
}
export {signUp, signIn, userValidate}