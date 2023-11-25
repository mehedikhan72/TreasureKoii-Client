import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Link, Navigate } from "react-router-dom";
import { AuthContextProps } from "../types";
import axios from "../utils/axios/AxiosSetup";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    // use axios for the post req
    if (password !== confirmedPassword) {
      setMessage("Passwords do not match");
      return;
    }

    const formData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      phone: phone,
    };

    try {
      const response = await axios.post(`register/`, formData);
      const data = response.data;

      if (response.status === 201) {
        console.log("Logging in");
        loginUser(e);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.log(error);
      setMessage("An error occured during registration. Please try again.");
    }
  };

  let contextData = useContext(AuthContext);
  if (!contextData) {
    return null;
  }
  const { user, loginUser }: AuthContextProps = contextData;

  return (
    <div>
      {user && <Navigate to="/" />}
      <p>Register</p>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          name="confirmedPassword"
          placeholder="Confirm Password"
          value={confirmedPassword}
          onChange={(e) => setConfirmedPassword(e.target.value)}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
        <Link to={{ pathname: `/login/` }}>Login</Link>
    </div>
  );
};

export default Register;
