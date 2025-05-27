import axios from "axios";
import { RegisterSchema } from "../models/user";

const URI = import.meta.env.VITE_URL_API + '/api/v1/users';

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
    }
}

