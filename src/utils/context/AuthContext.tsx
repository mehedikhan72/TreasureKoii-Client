// src/AuthContext.tsx
import React, {
  createContext,
  useState,
  useEffect,
  FC,
} from "react";
import jwt_decode, {JwtPayload} from 'jwt-decode';
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
      const storedTokens = localStorage.getItem('authTokens');
    
      if (storedTokens) {
        setAuthTokens(JSON.parse(storedTokens));
        setUser(jwtDecode(storedTokens));
      }
    }, []);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  // todo: need to make these fetch requests using axios

  const loginUser = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    let response = await fetch(`http://127.0.0.1:8000/api/token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: e.currentTarget.email.value,
        password: e.currentTarget.password.value,
      }),
    });
    let data = await response.json();
    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
      navigate("/");
    } else {
      setMessage(data.detail);
    }
  };

  const logoutUser = (): void => {
    setAuthTokens(null);
    setUser(null);
    localStorage.removeItem("authTokens");
    if (user) {
      navigate("/login/");
    }
  };

  const updateToken = async (): Promise<void> => {
    let response = await fetch(`http://127.0.0.1:8000/api/token/refresh/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh: authTokens?.refresh }),
    });
    let data = await response.json();

    if (response.status === 200) {
      setAuthTokens(data);
      setUser(jwtDecode(data.access));
      localStorage.setItem("authTokens", JSON.stringify(data));
    } else {
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
