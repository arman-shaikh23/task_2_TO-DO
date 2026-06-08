import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const { data } = await api.get("/auth/profile");
        setAuth({
          isAuthenticated: true,
          rememberMe: Boolean(data.rememberMe),
          user: {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        });
      } catch {
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    setAuth(data);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    setAuth(data);
    return data;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore logout failures and clear local auth state anyway.
    }
    setAuth(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    setAuth((current) => ({
      ...current,
      user: { ...current.user, ...data.user },
    }));
    return data;
  };

  return (
    <AuthContext.Provider value={{ auth, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
