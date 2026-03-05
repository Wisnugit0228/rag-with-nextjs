import { useAuth } from "@/contexts/auth-context";

export const usePermission = () => {
  const { user, loading } = useAuth();

  const hasPermission = (code: string) => {
    if (!user) return false;
    return user.permissions.includes(code);
  };

  return { hasPermission, loading };
};
