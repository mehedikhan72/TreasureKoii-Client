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

export interface Hunt {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  created_at: string;
  poster_img: string;
  organizers: User[];
  participants: User[];
}

export interface Puzzle {
  id: number;
  hunt: Hunt;
  name: string;
  description: string;
  answer: string;
  type: string;
  points: number;
}

export interface Announcement {
  id: number;
  hunt: Hunt;
  text: string;
  created_at: string;
  creator: User;
}

export interface Image {
  id: number;
  puzzle: Puzzle | null;
  hunt: Hunt | null;
  image: string;
}
