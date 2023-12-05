// this is the home view for a hunt, before hunt, info will show, during hunt, current puzzle
// will show, after hunt, results and other info

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { AuthContextProps, Puzzle, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import { Navigate } from "react-router-dom";
import BeforeHunt from "../components/BeforeHunt";
import AfterHunt from "../components/AfterHunt";
import ShowImages from "../components/ShowImages";

const HuntHome: React.FC = () => {
  const { slug } = useParams();
  const [puzzle, setPuzzle] = useState<Puzzle>();
  const [hunt, setHunt] = useState<Hunt>();

  const [beforeHunt, setBeforeHunt] = useState<boolean>(false);
  const [duringHunt, setDuringHunt] = useState<boolean>(false);
  const [afterHunt, setAfterHunt] = useState<boolean>(false);

  const [correctAnswerGiven, setCorrectAnswerGiven] = useState<boolean>(false);
  const [wrongAnswerGiven, setWrongAnswerGiven] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);

  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const getHuntDetails = async (): Promise<void> => {
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          console.log(data);
          setHunt(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const getPuzzle = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/get-current-puzzle-view/`);
        const data = response.data;
        if (response.status === 200) {
          setPuzzle(data);
          setImageUrl(data.id + "/get-puzzle-images/");
        }
      } catch (error) {
        console.log(error);
      }
    };
    getHuntDetails();
    if (user && duringHunt) {
      getPuzzle();
    }
  }, [slug, user, duringHunt]);

  // TODO: Fix getting new puzzle

  useEffect(() => {
    const currentTime = new Date();

    if (hunt) {
      const huntStart = new Date(hunt.start_date);
      const huntEnd = new Date(hunt.end_date);

      if (currentTime < huntStart) {
        setBeforeHunt(true);
        setDuringHunt(false);
        setAfterHunt(false);
      } else if (currentTime >= huntStart && currentTime <= huntEnd) {
        setBeforeHunt(false);
        setDuringHunt(true);
        setAfterHunt(false);
      } else {
        setBeforeHunt(false);
        setDuringHunt(false);
        setAfterHunt(true);
      }
    }
  }, [hunt]);

  const [answer, setAnswer] = useState<string>("");

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    try {
      const response = await axios.post(`${puzzle?.id}/submit-answer/`, {
        answer: answer,
      });
      const data = response.data;
      if (response.status === 200) {
        if (data.success) {
          setCorrectAnswerGiven(true);
          setMessage(data.message);
        } else {
          setWrongAnswerGiven(true);
          setMessage(data.message);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNewPuzzle = async (): Promise<void> => {
    console.log("fetching new puzzle");
    const type_param = "next";
    try {
      const response = await axios.get(`${slug}/puzzle/${type_param}/`);
      const data = response.data;
      if (response.status === 200) {
        setPuzzle(data);
        setAnswer("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {beforeHunt && <BeforeHunt />}
      {afterHunt && <AfterHunt />}

      {duringHunt && !user && (
        <div>
          The hunt is on going. Please login if you have registered for this
          hunt. Visit later to the leaderboards and other stats. Have a good
          one!
        </div>
      )}

      {duringHunt && user && (
        <div>
          <p className="text-4">{hunt?.name}</p>

          <div className="p-2">
            <p className="text-3">Your Current Puzzle</p>
            <p className="text-2">{puzzle?.name}</p>
            <p className="text-1">{puzzle?.description}</p>
            <ShowImages url={imageUrl} />
          </div>
          <div className="p-2">
            <p className="text-3">Submit Answer</p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col justify-center items-center"
            >
              <input
                type="text"
                name="answer"
                placeholder="Answer"
                className="my-input-field"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
              <button className="my-btn-1" type="submit">
                Submit
              </button>
            </form>
          </div>

          {wrongAnswerGiven && <p>{message}</p>}
          {correctAnswerGiven && (
            <div>
              <p>{message}</p>
              <button onClick={() => fetchNewPuzzle()}>Next Puzzle</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HuntHome;
