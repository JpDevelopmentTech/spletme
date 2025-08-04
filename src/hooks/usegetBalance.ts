import stripe from "@/services/stripe"
import { useEffect, useState } from "react"

interface BalanceAmount {
    amount: number;
    currency: string;
    source_types?: {
        card: number;
    };
}

interface RefundAndDisputePrefunding {
    available: BalanceAmount[];
    pending: BalanceAmount[];
}

interface StripeBalance {
    object: string;
    available: BalanceAmount[];
    instant_available: BalanceAmount[];
    livemode: boolean;
    pending: BalanceAmount[];
    refund_and_dispute_prefunding: RefundAndDisputePrefunding;
}

export const useGetBalance = () => {
    const [balance, setBalance] = useState<StripeBalance | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        getBalance()
    },[])

    const getBalance = async () => {
        setIsLoading(true)
        try {
            const response = await stripe.getBalance()
            if(response.error){
                setError(response.message)
            } else {
                setBalance(response.data)
                setError(null)
            }
        } catch (err) {
            setError('Error al obtener el balance')
        } finally {
            setIsLoading(false)
        }
    }

    return {
        balance,
        isLoading,
        error,
        refetch: getBalance
    }
}