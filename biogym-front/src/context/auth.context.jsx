import { createContext, useState, useContext, useEffect } from "react";
import { loginRequest } from "../services/auth.service.js";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);

  const [loading, setLoading] = useState(true);

  const signin = async (user) => {
    try {
      const res = await loginRequest(user);

      setUser(res.data.usuario);
      setIsAuthenticated(true);
      localStorage.setItem("token", res.data.token);
    } catch (error) {
      console.error("signin error:", error);
      const resp = error?.response;
      if (resp && Array.isArray(resp.data)) {
        setErrors(resp.data);
        return;
      }
      const message =
        resp?.data?.mensaje ||
        resp?.data ||
        error.message ||
        "Error al iniciar sesión";
      setErrors([
        typeof message === "string" ? message : JSON.stringify(message),
      ]);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setLoading(false);
        setUser(null);
        return;
      }
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Token inválido", error);
        logout();
      }
      setLoading(false);
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signin,
        logout,
        user,
        isAuthenticated,
        errors,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
