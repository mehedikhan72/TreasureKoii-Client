import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams, Link } from "react-router-dom";
import { AuthContextProps, Puzzle, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import { Navigate } from "react-router-dom";

const CurrentPuzzle: React.FC = () => {
  const { slug } = useParams();
  const [puzzle, setPuzzle] = useState<Puzzle>();
  const [hunt, setHunt] = useState<Hunt>();

  const [correctAnswerGiven, setCorrectAnswerGiven] = useState<boolean>(false);
  const [wrongAnswerGiven, setWrongAnswerGiven] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [shouldGetNewPuzzle, setShouldGetNewPuzzle] = useState<boolean>(false);

  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  useEffect(() => {
    const getHuntDetails = async (): Promise<void> => {
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
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
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (user) {
      getHuntDetails();
      getPuzzle();
    }
  }, [slug, user, shouldGetNewPuzzle]);

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

  return (
    <div>
      <p>Welcome to {hunt?.name}</p>
      <p>{puzzle?.name}</p>
      <p>REST LATER</p>
      <p>Submit answer</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="answer"
          placeholder="Answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      {wrongAnswerGiven && <p>{message}</p>}
      {correctAnswerGiven && (
        <div>
          <p>{message}</p>
          <button onClick={() => setShouldGetNewPuzzle(true)}>
            Next Puzzle
          </button>
        </div>
      )}
    </div>
  );
};

export default CurrentPuzzle;
