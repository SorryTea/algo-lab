import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext(null);

async function fetchMe() {
  try {
    const res = await fetch("/api/account/me", { credentials: "include" });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.isAuthenticated || !data.user) return null;

    return {
      ...data.user,
      isAdmin: data.user.roles?.includes("Admin") ?? false,
      manageUrl: "/Identity/Account/Manage",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await fetchMe();
    setUser(data);
    setLoading(false);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/account/logout", { method: "POST", credentials: "include" });
    setUser(null);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
