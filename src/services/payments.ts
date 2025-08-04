import axios from "axios";

export interface Payment {
    _id: string;
    idCollaborator: string;
    amount: number;
    description?: string;
    owner: string;
    createdAt: string;
}

class PaymentsService {
    private readonly URI = import.meta.env.VITE_URL_API + "/api/v1/splits-payments";
    private headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
    }

    private getAuthToken(){
        return localStorage.getItem("token");
    }
    
    async createPayment(collaboratorId: string, splitId: string){
        try {
            const endpoint = this.URI + `/split/${splitId}/process-payment`;
            const response = await axios.post(endpoint, {recipientId: collaboratorId}, {headers: this.headers})
            return response.data
        } catch (error) {
            console.error("Error creating payment:", error);
            return { error: true, message: "Error creating payment" };
        }
    } 

    async getPayments(): Promise<{error: boolean, data?: Payment[], message?: string}>{
        try {
            const endpoint = this.URI + "/by-user";
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${this.getAuthToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting payments:", error);
            return { error: true, message: "Error getting payments" };
        }
    }

    async getPaymentsByCollaborator(idCollaborator: string): Promise<{error: boolean, data?: Payment[], message?: string}>{
        try {
            const endpoint = this.URI + `/by-collaborator/${idCollaborator}`;
            const response = await axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${this.getAuthToken()}`
                }
            });
            return response.data;
        } catch (error) {
            console.error("Error getting payments by collaborator:", error);
            return { error: true, message: "Error getting payments by collaborator" };
        }
    }
}

export default new PaymentsService();