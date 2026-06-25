import { AuthService } from "@/services/auth";
import { useEffect, useState } from "react";

export default function useSubUserByUser() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [subUsers, setSubUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubUsers();
  }, []);

  const fetchSubUsers = async () => {
    setLoading(true);
    const response = await AuthService.getSubUsersByUser();
    setLoading(false);
    if (response) {
      setSubUsers(response.data);
    } else {
      setError("Error getting subusers by user");
    }
  };

  return { subUsers, loading, error, refetch: fetchSubUsers };
}
