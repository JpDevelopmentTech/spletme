import axios from "axios";

const URI = import.meta.env.VITE_URL_API + '/api/auth';

export const AuthService = {
    login: async (email: string, password: string) => {
        try {
            const response = await axios.post(URI, { email, password });
            return response.data;
            
        } catch (error) {
            return {
                error: true,
                message: error
            }
        }
    },
    logout: () => {
        // API call to logout
    }

}

