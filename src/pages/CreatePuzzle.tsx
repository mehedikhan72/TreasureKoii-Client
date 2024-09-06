import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import { AxiosError } from "axios";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";

const CreatePuzzle: React.FC = () => {
  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const { slug } = useParams();

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [answer, setAnswer] = useState<string>("");
  const [type, setType] = useState<string>("easy");
  const [points, setPoints] = useState<number>(0);

  const [imgFiles, setImgFiles] = useState<File[] | null>(null);

  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const val: string = e.target.value;
    if (/^\d+$/.test(val)) setPoints(parseInt(val));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (!name || !description || !answer || !type || !points) {
      toast.error("Please fill all the fields.");
      setLoading(false);
      return;
    }

    if (imgFiles === null || imgFiles.length === 0) {
      toast.error("Please upload at least one image.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("type", type);
    formData.append("answer", answer);
    formData.append("points", points.toString());
    imgFiles?.forEach((file) => formData.append("images", file));

    try {
      const response = await axios.post(`${slug}/create-puzzle/`, formData);
      const data = response.data;

      if (response.status === 201) {
        // console.log("Puzzle Created");

        setName("");
        setDescription("");
        setAnswer("");
        setType("Easy");
        setPoints(0);
        setImgFiles(null);
        (document.getElementById("puzzleImages") as HTMLInputElement).value =
          "";
        setMessageError(null);
        setMessageSuccess("Puzzle Successfully Created");
        toast.success("Puzzle Successfully Created");
      } else {
        setMessageSuccess(null);
        setMessageError(data.error);
        toast.error(data.error);
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
      setMessageSuccess(null);
      if (error instanceof AxiosError) {
        setMessageError(error.response?.data.error);
        toast.error(error.response?.data.error);
      }
    } finally {
      setLoading(false);
    }
  };

  const [hunt, setHunt] = useState<Hunt>();
  useEffect(() => {
    document.title = "Create Puzzle | TreasureKoii";
    const getHuntDetails = async (): Promise<void> => {
      setLoading(true);
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          setHunt(data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (slug) {
      getHuntDetails();
    }

    return () => {
      document.title = "TreasureKoii";
    };
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && <Loading />}
      <HuntNav slug={slug} huntName={hunt?.name} />

      {!user && (
        <YouNeedToBeLoggedIn message="Please Log in to create puzzles." />
      )}
      {/* todo: make sure user is admin */}

      {user && (
        <div className="flex flex-col m-4 items-center gap-10 flex-1">
          <div className="text-4xl font-extrabold">Create A Puzzle</div>
          <form
            method="post"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            className="flex flex-col items-center"
          >
            {/* {messageError && (
              <p className="text-1 text-red-500">{messageError}</p>
            )}
            {messageSuccess && (
              <p className="text-lg font-bold mb-5 text-green-600">
                {messageSuccess}
              </p>
            )} */}
            <input
              type="text"
              name="puzzleName"
              placeholder="Puzzle Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="my-input-field w-full"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="my-input-field w-full h-16 resize-none"
            />

            <input
              type="text"
              name="puzzleAnswer"
              placeholder="Answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.toLowerCase())}
              className="my-input-field w-full"
            />

            <label className="w-full flex items-center">
              <span className="w-24">Difficulty </span>
              <select
                value={type}
                name="type"
                onChange={(e) => {
                  setType(e.target.value);
                }}
                className="my-input-field w-full flex-1 mr-0"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </label>

            <label className="w-full flex items-center">
              <span className="w-24">Puzzle Points </span>
              <input
                type="number"
                name="points"
                value={points}
                onChange={onPointsChange}
                className="my-input-field w-full flex-1 mr-0"
              />
            </label>

            <label className="w-full flex items-center">
              <span className="w-24">Puzzle Images</span>
              <input
                type="file"
                id="puzzleImages"
                name="images"
                multiple
                onChange={(e) => {
                  setImgFiles(
                    e.target.files ? Array.from(e.target.files) : null
                  );
                }}
                className="m-2 mr-0 file:ml-0 file:mr-4 file:my-btn-sm text-black w-52 md:w-full"
              />
            </label>

            <button type="submit" className="my-btn-1 mt-4">
              Create
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CreatePuzzle;
