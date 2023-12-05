import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate, useParams, Link } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const CreateTeam: React.FC = () => {
  const contextData = useContext(AuthContext);
  const user = contextData?.user;
  const { slug } = useParams();

  const [name, setName] = useState<string>("");

  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);

    try {
      const response = await axios.post(`${slug}/create-team/`, formData);
      const data = response.data;

      if (response.status === 201) {
        setMessage(data.success);
      } else {
        setMessage(data.error);
      }
    } catch (error: unknown) {
      console.log(error);
      setMessage("An error occured during Team creation. Please try again.");
    }
  };

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
          <p>Create A Team</p>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Team Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button type="submit">Create Team</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreateTeam;
