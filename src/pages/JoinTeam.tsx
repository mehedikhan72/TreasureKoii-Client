import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { AxiosError } from "axios";
import { AuthContextProps } from "../types";

// TODO
// dynamic hunt slug

const JoinTeam: React.FC = () => {
  const { slug } = useParams();
  const [teamPassword, setTeamPassword] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("team_password", teamPassword);

    try {
      const response = await axios.post(`${slug}/join-team/`, formData);
      const data = response.data;

      if (response.status === 201) {
        setMessage(data.success);
      } else {
        setMessage(data.error);
      }
    } catch (error: unknown) {
      console.log(error);
      if (error instanceof AxiosError) setMessage(error.response?.data.error);
    }
  };

  let contextData = useContext(AuthContext);
  if (!contextData) {
    return null;
  }

  const { user }: AuthContextProps = contextData;
  console.log(user);

  return (
    <div>
      {!user && <Navigate to="/" />}
      <p>Create A Team</p>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="team_passwprd"
          placeholder="Enter Team Password"
          value={teamPassword}
          onChange={(e) => setTeamPassword(e.target.value)}
        />

        <button type="submit">Join Team</button>
      </form>
    </div>
  );
};

export default JoinTeam;
