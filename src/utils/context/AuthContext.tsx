// src/AuthContext.tsx
import React, { createContext, useState, useEffect, FC } from "react";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthProviderProps, AuthTokens } from "../../types";
import axios from "../axios/AxiosSetup";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    const storedTokens = localStorage.getItem("authTokens");

    if (storedTokens) {
      setAuthTokens(JSON.parse(storedTokens));
      setUser(jwtDecode(storedTokens));
    }
  }, []);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    // console.log(e.target?.email?.value);

    if (!e.currentTarget || !e.currentTarget.email) {
      console.error("Invalid form event. Unable to retrieve email.");
      return;
    }

    const formData = {
      email: e.currentTarget.email.value,
      password: e.currentTarget.password.value,
    };

    try {
      let response = await axios.post(`token/`, formData);
      console.log(response);
      let data = response.data;
      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
        navigate("/");
      } else {
        setMessage(data.detail);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const logoutUser = (): void => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    if (user) {
      navigate("/");
    }
  };

  const updateToken = async (): Promise<void> => {
    const formData = {
      refresh: authTokens?.refresh,
    };

    try {
      let response = await axios.post(`token/refresh/`, formData);
      console.log(response);
      let data = response.data;
      console.log(data);

      if (response.status === 200) {
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        localStorage.setItem("authTokens", JSON.stringify(data));
      } else {
        logoutUser();
      }
    } catch (error) {
      console.log(error);
      logoutUser();
    }

    if (loading) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading) {
      updateToken();
    }

    let fourMins = 1000 * 4 * 60;
    let interval = setInterval(() => {
      if (authTokens) {
        updateToken();
        console.log("Token refreshed");
      }
    }, fourMins);
    return () => clearInterval(interval);
  }, [authTokens, loading]);

  const contextData: AuthContextProps = {
    message,
    user,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
