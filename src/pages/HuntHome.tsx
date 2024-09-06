// this is the home view for a hunt, before hunt, info will show, during hunt, current puzzle
// will show, after hunt, results and other info

import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams, Link, Navigate } from "react-router-dom";
import { Puzzle, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import BeforeHunt from "../components/BeforeHunt";
import AfterHunt from "../components/AfterHunt";
import ShowImages from "../components/ShowImages";
import { AxiosError } from "axios";

import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import HuntNav from "../components/HuntNav";
import Custom404 from "../utils/Custom404";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Loading from "../utils/Loading";
import Home from "./Home";
import HomeFooter from "../components/HomeFooter";

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

  // for custom404
  const [huntLoaded, setHuntLoaded] = useState<boolean>(false);
  const [puzzleLoaded, setPuzzleLoaded] = useState<boolean>(false);

  const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);

  // manual payment checking.
  const [huntPaidFor, setHuntPaidFor] = useState<boolean>(true);
  useEffect(() => {
    const checkIfHuntPaidFor = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/is-hunt-paid-for/`);
        const data = response.data;
        if (response.status === 200) {
          setHuntPaidFor(data.paid);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    checkIfHuntPaidFor();
  }, [slug, contextData, userAnOrganizer]);

  // TODO: Skip puzzle.
  useEffect(() => {
    document.title = `${puzzle ? `${puzzle.name} | ` : ""}${
      hunt ? `${hunt.name} | ` : ""
    }TreasureKoii`;
    const getHuntDetails = async (): Promise<void> => {
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          // console.log(data);
          setHunt(data);
          setHuntLoaded(true);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
        setHuntLoaded(true);
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
        setPuzzleLoaded(true);
      } catch (error) {
        console.log(error);
        setDidNotGetPuzzle(true);
        setPuzzleLoaded(true);
      }
    };

    const checkIfUserAnOrganizer = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/is-user-an-organizer/`);
        const data = response.data;
        if (response.status === 200) {
          setUserAnOrganizer(data.is_organizer);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      }
    };
    getHuntDetails();
    checkIfUserAnOrganizer();
    if (user && duringHunt) {
      getPuzzle();
    }
  }, [slug, user, duringHunt, contextData]);

  useEffect(() => {
    setImageUrl(puzzle?.id + "/get-puzzle-images/");
  }, [puzzle]);

  // TODO: Fix getting new puzzle

  useEffect(() => {
    document.title = `${puzzle ? `${puzzle.name} | ` : ""}${
      hunt ? `${hunt.name} | ` : ""
    }TreasureKoii`;

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

    return () => {
      document.title = "TreasureKoii";
    };
  }, [hunt]);

  const [answer, setAnswer] = useState<string>("");

  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${puzzle?.id}/submit-answer/`, {
        answer: answer,
      });
      const data = response.data;
      if (response.status === 200) {
        if (data.success) {
          setCorrectAnswerGiven(true);
          setMessage(data.success);
        } else {
          setWrongAnswerGiven(true);
          setMessage(data.error);
        }
      }
      setLoading(false);
      // console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as { error: string })?.error);
      setWrongAnswerGiven(true);
      setLoading(false);
      console.log(error);
    }
  };

  const fetchNewPuzzle = async (): Promise<void> => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      setDidNotGetPuzzle(true);
      setLoading(false);
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as { error: string })?.error);
      console.log(error);
    }
  };

  return (
    // todo: add other links n confetti
    <div>
      {!huntPaidFor && (
        <div>
          {userAnOrganizer && <Navigate to={`/${slug}/make-payment`} />}
          {!userAnOrganizer && <Navigate to={`/${slug}/unpaid-notice`} />}
        </div>
      )}
      {loading && <Loading />}
      {!huntLoaded && !puzzleLoaded && <Loading />}
      {huntLoaded && !hunt && <Custom404 />}
      {huntLoaded && hunt && (
        <div>
          {userAnOrganizer && (
            <div>
              {afterHunt && <AfterHunt hunt={hunt} />}
              {!afterHunt && (
                <div className="flex flex-col min-h-screen">
                  <div className="flex-grow">
                    <HuntNav slug={slug} huntName={hunt?.name} />
                    <div className="flex justify-center items-center flex-col">
                      <p className="text-3">
                        You are an organizer of this hunt.
                      </p>
                      <Link to={{ pathname: `/${slug}/organizer-dashboard` }}>
                        <button className="my-btn-1">
                          Organizer Dashboard
                        </button>
                      </Link>
                    </div>
                  </div>

                  <HomeFooter />
                </div>
              )}
            </div>
          )}
          {!userAnOrganizer && (
            <div>
              {beforeHunt && <BeforeHunt hunt={hunt} />}
              {afterHunt && <AfterHunt hunt={hunt} />}

              {duringHunt && <HuntNav slug={slug} huntName={hunt?.name} />}
              {duringHunt && !user && (
                <div>
                  <YouNeedToBeLoggedIn message="Please Log in if you are registered in this hunt." />
                </div>
              )}

              {duringHunt && user && (
                <div className="min-h-screen flex flex-col">
                  {didNotGetPuzzle && (
                    <div className="flex flex-col justify-center items-center p-4 flex-grow">
                      <p className="text-2 warning-text">
                        No more puzzles left. Looks like you solved 'em all.
                      </p>
                      <p className="text-1">
                        Refresh this page to verify again.
                      </p>
                    </div>
                  )}

                  {!didNotGetPuzzle && !correctAnswerGiven && (
                    <div className="p-4">
                      <p className="text-3">Your Current Puzzle</p>
                      <p className="text-2">{puzzle?.name}</p>
                      <p className="text-1 mb-4">{puzzle?.description}</p>
                      <ShowImages
                        key={imageUrl}
                        url={imageUrl}
                        imageInterval={5000}
                      />
                    </div>
                  )}
                  {!correctAnswerGiven && !didNotGetPuzzle && (
                    <div className="p-4 m-2 flex-grow">
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
                          <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-red-500">
                            {message}
                          </p>
                        )}
                        <button className="my-btn-1" type="submit">
                          Submit
                        </button>
                      </form>
                    </div>
                  )}

                  {correctAnswerGiven && !didNotGetPuzzle && (
                    <div className="flex flex-col justify-center items-center p-4 flex-grow">
                      <div className="styled-div-1">
                        <p className="text-4 mb-2">{message}</p>
                      </div>

                      <button
                        className="my-btn-1 mt-2"
                        onClick={() => fetchNewPuzzle()}
                      >
                        Next Puzzle
                      </button>
                      <Confetti width={width} height={height} />
                    </div>
                  )}

                  <HomeFooter />
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HuntHome;
