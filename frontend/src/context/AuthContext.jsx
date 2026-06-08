import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

const storageKey = "taskflowAuth";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const persistent = localStorage.getItem(storageKey);
    const session = sessionStorage.getItem(storageKey);
    return persistent ? JSON.parse(persistent) : session ? JSON.parse(session) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!auth?.token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/profile");
        setAuth((current) => ({
          ...current,
          user: {
            id: data.user._id || data.user.id,
            name: data.user.name,
            email: data.user.email,
          },
        }));
      } catch {
        localStorage.removeItem(storageKey);
        sessionStorage.removeItem(storageKey);
        setAuth(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, []);

  const persistAuth = (payload) => {
    const targetStorage = payload.rememberMe ? localStorage : sessionStorage;
    const secondaryStorage = payload.rememberMe ? sessionStorage : localStorage;
    secondaryStorage.removeItem(storageKey);
    targetStorage.setItem(storageKey, JSON.stringify(payload));
    setAuth(payload);
  };

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);
    persistAuth(data);
    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);
    persistAuth(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem(storageKey);
    sessionStorage.removeItem(storageKey);
    setAuth(null);
  };

  const updateProfile = async (payload) => {
    const { data } = await api.put("/auth/profile", payload);
    setAuth((current) => {
      const next = { ...current, user: { ...current.user, ...data.user } };
      const storedInLocal = localStorage.getItem(storageKey);
      const target = storedInLocal ? localStorage : sessionStorage;
      target.setItem(storageKey, JSON.stringify(next));
      return next;
    });
    return data;
  };

  return (
    <AuthContext.Provider value={{ auth, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

