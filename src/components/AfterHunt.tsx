import { AxiosError } from "axios";
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HomeFooter from "./HomeFooter";
import LeaderboardTable from "./LeaderboardTable";
import ShowImages from "./ShowImages";
import AuthContext from "../utils/context/AuthContext";
import Loading from "../utils/Loading";

const AfterHunt: React.FC<{ hunt: Hunt }> = ({ hunt }) => {
  const { slug } = useParams();

  const [leaderBoard, setLeaderBoard] = useState<[]>([]);

  const [message, setMessage] = useState<string | null>();
  const [imgUploadSuccess, setImgUploadSuccess] = useState<boolean | null>(
    null
  );

  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const [loading, setLoading] = useState<boolean>(false);

  const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);
  const [imgFiles, setImgFiles] = useState<File[] | null>(null);
  const getLeaderBoard = async (): Promise<void> => {
    try {
      const response = await axios.get(`${slug}/leaderboard/`);
      const data = response.data;
      if (response.status === 200) {
        setLeaderBoard(data);
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };
  const uploadImages = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    imgFiles?.forEach((file) => formData.append("images", file));
    try {
      const response = await axios.post(`${slug}/post-hunt-images/`, formData);
      if (response.status === 201) {
        // console.log("Images Uploaded");
        setMessage("Images Uploaded");
        setImgFiles(null);
        setImgUploadSuccess(true);
        setLoading(false);
      } else {
        setMessage("Error uploading images");
        setImgUploadSuccess(false);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      const axiosError = error as AxiosError;
      setMessage((axiosError.response?.data as { error: string })?.error);
      setImgUploadSuccess(false);
      setLoading(false);
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

  useEffect(() => {
    getLeaderBoard();
    if (user) {
      checkIfUserAnOrganizer();
    }
  }, []);

  const [uploadImageDivDisabled, setUploadImageDivDisabled] =
    useState<boolean>(false);

  return (
    <div className="flex flex-col min-h-screen">
      {loading && <Loading />}
      {hunt && (
        <>
          <div className="flex flex-col justify-center items-center mt-16 mx-10">
            {userAnOrganizer && !uploadImageDivDisabled && (
              <div className="styled-div-1 rounded-md p-2 mb-4">
                {message && imgUploadSuccess && (
                  <p className="text-1 text-green-500">{message}</p>
                )}
                {message && !imgUploadSuccess && (
                  <p className="text-1 text-red-500">{message}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-1">
                    You were an organizer of this hunt. Upload some images as
                    memories.
                  </p>
                  <button
                    onClick={() => setUploadImageDivDisabled(true)}
                    className="rounded-md bg-red-500 text-white px-2 pt-1"
                  >
                    X
                  </button>
                </div>

                <form
                  onSubmit={uploadImages}
                  className="flex justify-between items-center"
                >
                  <input
                    required
                    type="file"
                    name="images"
                    id="huntImages"
                    multiple
                    onChange={(e) => {
                      setImgFiles(
                        e.target.files ? Array.from(e.target.files) : null
                      );
                    }}
                    className="m-2 mr-0 file:ml-0 file:mr-4 file:my-btn-sm file:border-0 text-slate-500 w-52"
                  />
                  <button type="submit" className="my-btn-sm">
                    Upload
                  </button>
                </form>
              </div>
            )}

            <p className="text-2 text-center stroked-text-sm stroked-text-sm">
              Hunt has ended. Here's a summary!
            </p>
            <p className="text-5 stroked-text-sm">{hunt.name}</p>
            <p className="text-1 my-2 stroked-text-sm">{`${new Date(
              hunt.start_date
            ).toDateString()} - ${new Date(hunt.end_date).toDateString()}`}</p>
            <img
              src={hunt.poster_img}
              alt="Hunt"
              className="w-full max-h-96 object-contain my-5"
            />
            <p className="text-1 stroked-text-sm">{hunt.description}</p>
          </div>
          <div className="mt-16">
            <p className="text-3 py-8 stroked-text-sm">
              Look back at the memories!{" "}
            </p>
            <ShowImages url={`${slug}/get-hunt-images/`} imageInterval={2000} />
          </div>

          <LeaderboardTable leaderBoard={leaderBoard} />
        </>
      )}

      <HomeFooter />
    </div>
  );
};

export default AfterHunt;
