// frontend/src/context/AuthContext.js
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE = process.env.REACT_APP_API_URL;
console.log("API Base URL:", process.env.REACT_APP_API_URL);

const AuthContext = createContext(null);

// ✅ Axios instance
const api = axios.create({ baseURL: API_BASE });

// Axios interceptor for logging requests
api.interceptors.request.use(
  (config) => {
    console.log("🛠️ Axios request config:", config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ✅ Custom Hook
const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// ✅ Provider Component
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [message, setMessage] = useState(null);

  // ✅ Set token in axios + state
  const applyToken = (t) => {
    if (t) {
      api.defaults.headers.common.Authorization = `Bearer ${t}`;
      setToken(t);
    } else {
      delete api.defaults.headers.common.Authorization;
      setToken(null);
    }
  };

  // ✅ Verify user using /me route
  const verifyUser = async () => {
    try {
      console.log("Making request to:", API_BASE + "/api/auth/me");
      const res = await api.get("/api/auth/me");
      if (res.data?.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        logout();
      }
    } catch (err) {
      logout();
    } finally {
      setAuthLoading(false);
    }
  };

  // ✅ On mount → check token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
      applyToken(storedToken);
      verifyUser();
    } else {
      setAuthLoading(false);
    }
  }, []);

  // ✅ Register
  const register = async (formData) => {
    try {
      const { data } = await api.post("/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (data?.success && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        applyToken(data.token);
        setUser(data.user);
        return true;
      }

      return false;
    } catch (err) {
      const msg = err.response?.data?.msg || err.response?.data?.message || "Registration failed";
      toast.error(msg);
      console.error("❌ Registration error:", err.response?.data || err.message);
      throw err;
    }
  };

  // ✅ Simple login setter (called from verifyOtp)
  const login = (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    applyToken(token);
    setUser(user);
  };

  const adminLogin = async (username, password) => {
    try {
      console.log("Admin login payload:", { username, password });
      const response = await axios.post(`${API_BASE}/api/auth/admin/login`, {
        username,
        password,
      });
      console.log("Admin login response:", response.data);

      if (response.data.token && response.data.user) {
        const token = response.data.token;
        const user = response.data.user;

        // Save to local storage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        setUser(user);
        setToken(token);
        return user;
      } else {
        throw new Error("Invalid admin credentials.");
      }
    } catch (error) {
      console.error("Admin Login Error:", error.response?.data || error.message);
      throw new Error(error.response?.data?.msg || error.response?.data?.message || "Admin login failed");
    }
  };
  
  // ✅ Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    applyToken(null);
    setUser(null);
    setMessage("Logout successfully");
  };

  // ✅ Delete Account
  const deleteAccount = async () => {
    try {
      const userId = user?._id || user?.id;

      if (!userId) {
        console.error("❌ No userId found for delete");
        return;
      }

      const res = await api.delete(`/api/auth/${userId}`);

      if (res.data.success) {
        console.log("✅ Account deleted successfully");
        logout();
      } else {
        console.error("❌ Delete failed:", res.data.message);
      }
    } catch (err) {
      console.error("❌ Delete account error:", err);
    }
  };

  // ✅ Context value
  const value = useMemo(
    () => ({
      user,
      token,
      login,
      register,
      adminLogin,
      logout,
      deleteAccount,
      authLoading,
      isLoggedIn: !!user && !!token,
      isAuthReady: !authLoading,
    }),
    [user, token, authLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ✅ Final Exports
export { useAuth, AuthProvider, api };
