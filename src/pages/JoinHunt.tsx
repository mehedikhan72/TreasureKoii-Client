import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import axios from "../utils/axios/AxiosSetup";
import { useNavigate } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import HomeFooter from "../components/HomeFooter";
import Loading from "../utils/Loading";
import RegisteredHunts from "../components/RegisteredHunts";
import OrganizingHunts from "../components/OrganizingHunts";

const JoinHunt: React.FC = () => {
  const navigate = useNavigate();

  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const [huntName, setHuntName] = useState<string>("");
  const [huntSlug, setHuntSlug] = useState<string>("");
  const [inputGiven, setInputGiven] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = "Join Hunt | TreasureKoii";

    return () => {
      document.title = "TreasureKoii";
    };
  }, []);

  useEffect(() => {
    const sluggifyHuntName = () => {
      const slug = huntName
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
      setHuntSlug(slug);
    };

    sluggifyHuntName();
    setInputGiven(huntName.trim() !== "");
  }, [huntName]);

  const createTeamClicked = async () => {
    if (huntSlug === "") {
      setMessage("Please enter a valid hunt name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${huntSlug}/hunt-exists/`);
      if (response.status === 200) {
        if (response.data.hunt_exists === true) {
          navigate(`/${huntSlug}/create-team`);
        } else {
          setMessage("Hunt does not exist. Please try again.");
        }
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const joinTeamClicked = async () => {
    if (huntSlug === "") {
      setMessage("Please enter a valid hunt name.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${huntSlug}/hunt-exists/`);
      if (response.status === 200) {
        if (response.data.hunt_exists === true) {
          navigate(`/${huntSlug}/join-team`);
        } else {
          setMessage("Hunt does not exist. Please try again.");
        }
      }
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {loading && <Loading />}
      <TreasureKoiiImg />
      {!user && <YouNeedToBeLoggedIn message="Please log in to join hunts." />}
      {user && (
        <div className="flex flex-col mt-28 items-center gap-5 flex-1">
          <p className="text-4">Join A Hunt</p>
          <div className="flex justify-center items-center flex-col">
            <input
              name="huntName"
              placeholder="Hunt Name"
              className="my-input-field w-[250px]"
              onChange={(e) => setHuntName(e.target.value)}
            />
            {!message && (
              <p className="text-1 w-5/6 md:w-[200px] text-center">
                Enter a valid hunt name to continue.
              </p>
            )}
            {message && (
              <p className="text-1 text-red-500 w-5/6 md:w-[200px] text-center">
                {message}
              </p>
            )}

            {inputGiven && (
              <div className="flex justify-center items-center">
                <button onClick={createTeamClicked} className="my-btn-1">
                  Create a Team
                </button>

                <button onClick={joinTeamClicked} className="my-btn-1 ">
                  Join a Team
                </button>
              </div>
            )}
            {!inputGiven && (
              <div>
                <div className="flex justify-center items-center pointer-events-none opacity-50">
                  <Link to={{ pathname: `/${huntSlug}/create-team` }}>
                    <button className="my-btn-1">Create a Team</button>
                  </Link>
                  <Link to={{ pathname: `/${huntSlug}/join-team` }}>
                    <button className="my-btn-1 ">Join a Team</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <OrganizingHunts />
      <RegisteredHunts />

      <HomeFooter />
    </div>
  );
};

export default JoinHunt;
