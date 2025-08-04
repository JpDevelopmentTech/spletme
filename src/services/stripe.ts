import axios from "axios";

class StripeService {
    private baseUrl = import.meta.env.VITE_URL_API + "/api/v1/stripe"
    private headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
    
    connectStripeAccount = async () => {
        const response = await axios.post(`${this.baseUrl}/connect`, {}, {
            headers: this.headers
        })
        return response.data
    }

    checkStatus = async () => {
        const response = await axios.get(`${this.baseUrl}/status`, {
            headers: this.headers
        })
        return response.data
    }

    refreshConnection = async () => {
        const response = await axios.post(`${this.baseUrl}/refresh`, {}, {
            headers: this.headers
        })
        return response.data
    }

    getBalance = async () => {
        const response = await axios.get(`${this.baseUrl}/balance`, {
            headers: this.headers
        })
        return response.data
    }
    

}

export default new StripeService();