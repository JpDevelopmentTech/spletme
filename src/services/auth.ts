import axios from "axios";
import type { RegisterSchema } from "../models/user";

const URI = import.meta.env.VITE_URL_API + '/api/v1/users';

export interface RegisterSubuserSchema {
    parentUserId: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
    name: string;
    lastName: string;
}

export const AuthService = {
  
    login: async (email: string, password: string) => {
        try {
            const endpoint = URI + '/sign-in';
            const response = await axios.post(endpoint, { email, password });
            console.log(response.data);
            return response.data;
            
        } catch (error) {
            return null
        }
    },
    logout: () => {
        // API call to logout
    },
    register: async (payload: RegisterSchema) => {
        try {
            const endpoint = URI + '/sign-up';
            const response = await axios.post(endpoint, payload);
            return response.data;
        } catch (error) {
            return null
        }
    },
    registerSubuser: async (payload: RegisterSubuserSchema) => {
        try {
            const endpoint = URI + '/sign-up-subuser';
            const response = await axios.post(endpoint, payload);
            return response.data;
        } catch (error) {
            console.error('Error registering subuser:', error);
            return null;
        }
    },
    getSubUsersByUser: async () => {
        try {
            const endpoint = URI + '/subusers';
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token") || ""}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error getting subusers by user:', error);
            return null;
        }
    }
}

