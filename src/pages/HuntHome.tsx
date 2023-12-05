// this is the home view for a hunt, before hunt, info will show, during hunt, current puzzle
// will show, after hunt, results and other info

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { Puzzle, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import { Navigate } from "react-router-dom";
import BeforeHunt from "../components/BeforeHunt";
import AfterHunt from "../components/AfterHunt";
import ShowImages from "../components/ShowImages";
import { AxiosError } from "axios";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import HuntNav from "../components/HuntNav";

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

  const [didNotGetPuzzle, setDidNotGetPuzzle] = useState<boolean>(false);

  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const { width, height } = useWindowSize();

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
        setDidNotGetPuzzle(true);
      }
    };
    getHuntDetails();
    if (user && duringHunt) {
      getPuzzle();
    }
  }, [slug, user, duringHunt]);

  useEffect(() => {
    setImageUrl(puzzle?.id + "/get-puzzle-images/");
  }, [puzzle]);

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
          console.log(data);
          setMessage(data.success);
        } else {
          setWrongAnswerGiven(true);
          setMessage(data.error);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as { error: string })?.error);
      setWrongAnswerGiven(true);
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
        setCorrectAnswerGiven(false);
        setWrongAnswerGiven(false);
      }
    } catch (error) {
      console.log(error);
      setDidNotGetPuzzle(true);
    }
  };

  return (
    // todo: add other links n confetti
    <div className="m-4 md:m-2">
      <HuntNav slug={slug} huntName={hunt?.name} />

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
          {didNotGetPuzzle && (
            <div className="flex flex-col justify-center items-center p-4">
              <p className="text-2 warning-text">
                No more puzzles left. Looks like you solved 'em all.
              </p>
              <p className="text-1">Refresh this page to verify again.</p>
            </div>
          )}

          {!didNotGetPuzzle && !correctAnswerGiven && (
            <div className="p-4">
              <p className="text-3">Your Current Puzzle</p>
              <p className="text-2">{puzzle?.name}</p>
              <p className="text-1">{puzzle?.description}</p>
              <ShowImages key={imageUrl} url={imageUrl} />
            </div>
          )}
          {!correctAnswerGiven && !didNotGetPuzzle && (
            <div className="p-4 border-t-4 m-2">
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
                {wrongAnswerGiven && (
                  <p className="text-1 text-red-500">{message}</p>
                )}
                <button className="my-btn-1" type="submit">
                  Submit
                </button>
              </form>
            </div>
          )}

          {correctAnswerGiven && !didNotGetPuzzle && (
            <div className="flex flex-col justify-center items-center p-4">
              <p className="text-2 success-text">{message}</p>
              <button className="my-btn-1" onClick={() => fetchNewPuzzle()}>
                Next Puzzle
              </button>
              <Confetti width={width} height={height} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HuntHome;
