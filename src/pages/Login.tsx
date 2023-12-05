import React, { useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { AuthContextProps } from "../types";

const Login: React.FC = () => {
  const contextData = useContext(AuthContext);

  if (!contextData) {
    return null;
  }

  const { loginUser, user, message }: AuthContextProps = contextData;
  console.log(user);
  return (
    <div>
      {user && <Navigate to="/" />}
      <p>LOGIN</p>
      {message && <p>{message}</p>}
      <form onSubmit={loginUser}>
        <input type="email" name="email" placeholder="Email" />
        <input type="password" name="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
      <Link to={{ pathname: `/register/` }}>Register</Link>
    </div>
  );
};

export default Login;
