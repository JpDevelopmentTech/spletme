import { useState, useEffect } from "react";
import WalletService from "../services/wallet";

export const useWallet = () => {
  const [wallet, setWallet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasWallet, setHasWallet] = useState(false);

  const fetchWallet = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await WalletService.getWallet();
      if (!response.error && response.data) {
        setWallet(response.data);
        setHasWallet(true);
      } else {
        setHasWallet(false);
        // Si el error es que no tiene wallet, no es un error crítico
        if (response.message?.includes("does not have a wallet")) {
          setError(null);
        } else {
          setError(response.message || "Error loading wallet");
        }
      }
    } catch (err: any) {
      setError(err.message || "Error loading wallet");
      setHasWallet(false);
    } finally {
      setLoading(false);
    }
  };

  const createWallet = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WalletService.createWallet(data);
      if (!response.error && response.data) {
        await fetchWallet(); // Recargar la wallet después de crearla
        return { success: true };
      } else {
        setError(response.message || "Error creating wallet");
        return { success: false, message: response.message };
      }
    } catch (err: any) {
      const errorMessage = err.message || "Error creating wallet";
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  return {
    wallet,
    loading,
    error,
    hasWallet,
    createWallet,
    refreshWallet: fetchWallet,
  };
};
