import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import HomeFooter from "../components/HomeFooter";
import { AxiosError } from "axios";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const contextData = useContext(AuthContext);
  const user = contextData?.user;
  const loginUser = contextData?.loginUser;

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
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
        if (loginUser) {
          loginUser(e);
        }
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) setMessage(error.response?.data.error);
    }
  };

  useEffect(() => {
    document.title = "Register | TreasureKoii";

    return () => {
      document.title = "TreasureKoii";
    };
  }, []);

  // TODO: user was not being logged in properly after reg, look into that.
  return (
    <div className="flex flex-col min-h-screen">
      {user && <Navigate to="/" />}
      <div className="mt-8">
        <TreasureKoiiImg />
      </div>

      <div className="flex flex-col justify-center items-center gap-10 flex-1">
        <div className="text-6xl font-extrabold">Register</div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          {message && <p className="text-1 text-red-500">{message}</p>}
          <div className="flex gap-2">
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.currentTarget.value)}
              className="my-input-field mx-0"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.currentTarget.value)}
              className="my-input-field mx-0"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="my-input-field mx-0"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={phone}
              onChange={(e) => setPhone(e.currentTarget.value)}
              className="my-input-field mx-0"
            />
          </div>

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            className="w-full my-input-field"
          />
          <input
            type="password"
            name="confirmedPassword"
            placeholder="Confirm Password"
            value={confirmedPassword}
            onChange={(e) => setConfirmedPassword(e.currentTarget.value)}
            className="w-full my-input-field"
          />

          <button type="submit" className="my-btn-1 w-full">
            Register
          </button>

          <div className="text-1 flex justify-center items-center">
            <p className="px-1">Already have an account?</p>
            <Link to={{ pathname: `/login` }}>
              <div className="flex justify-center items-center">
                <p className="text-blue-500">Login</p>
                <p className="px-1"> here.</p>
              </div>
            </Link>
          </div>
        </form>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Register;
