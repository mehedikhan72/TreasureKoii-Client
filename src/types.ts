export interface AuthContextProps {
  message: string | null;
  user: any;
  loginUser: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  logoutUser: () => void;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface AuthTokens {
    access: string;
    refresh: string;
}

export interface User {
    token_type: string | null;
    exp: number | null;
    iat: number | null;
    jti: string | null;
    user_id: number | null;
    email: string | null; // todo: last 4 should not be null for production.
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
  }
