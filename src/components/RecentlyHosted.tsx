// recently hosted hunts

import React, { useEffect, useState, useContext } from "react";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import { Link } from "react-router-dom";
import Loading from "../utils/Loading";
import { rootUrl } from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";

const RecentlyHosted: React.FC = () => {
  const [hunts, setHunts] = useState<Hunt[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const contextData = useContext(AuthContext);

  useEffect(() => {
    const getRecentHunts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("get-recent-hunts/");
        const data = response.data;
        console.log(response);
        setHunts(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    getRecentHunts();
  }, [contextData]);
  return (
    <div>
      {loading && <Loading />}
      {hunts?.length !== 0 && (
        <div className="my-10">
          <p className="text-3 md:text-4 m-2">Recently hosted treasure hunts</p>
          {hunts?.map((hunt, ind) => (
            <Link to={{ pathname: `/${hunt.slug}` }}>
              {" "}
              <div className="flex justify-between items-center p-2 bg-slate-200 m-2 rounded-md md:m-8">
                <p className="flex-1 text-1 md:text-5 px-2 sm:px-10 md:px-20">
                  {hunt.name}
                </p>
                <div className="flex-1 w-[300] h-[200] px-2 sm:px-10 md:px-20">
                  <img src={`${rootUrl}${hunt.poster_img}`} alt="hunt" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentlyHosted;
