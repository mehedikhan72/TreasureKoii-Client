import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate, useParams, Link } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { AxiosError } from "axios";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const JoinTeam: React.FC = () => {
  const contextData = useContext(AuthContext);
  const user = contextData?.user;

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

  //   TQYSG0FS

  return (
    <div>
      <TreasureKoiiImg />
      {!user && (
        <div>
          <p className="warning-text">You need to log in create a team.</p>
          <Link to={{ pathname: `/login` }}>
            <button className="my-btn-1">Login</button>
          </Link>
        </div>
      )}
      {user && (
        <div>
          <p>Join A Team</p>
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
      )}
    </div>
  );
};

export default JoinTeam;
