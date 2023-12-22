import axios from "../utils/axios/AxiosSetup";
import { useEffect, useState, useContext } from "react";
import Countdown from "react-countdown";
import { Hunt } from "../types";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";

const OrganizingHunts: React.FC = () => {
  const [hunts, setHunts] = useState<(Hunt & { slug: string })[]>();
  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  useEffect(() => {
    const getRegisteredHunts = async () => {
      try {
        const response = await axios.get("get-users-organizing-hunts/");
        const data = response.data;
        // console.log(response);
        setHunts(data.hunts);
      } catch (error) {
        console.log(error);
      }
    };

    if (user) getRegisteredHunts();
  }, [contextData]);

  return (
    <>
      {hunts?.length ? (
        <div className="flex flex-col justify-center items-center my-5 mx-8">
          <div className="text-4 my-5 leading-[3rem]">
            You're{" "}
            <span className="bg-slate-700 rounded-lg text-white px-4 py-2">
              organizing
            </span>{" "}
            the following hunt(s)
          </div>
          {hunts.map((hunt, ind) => (
            <div
              className="w-full flex justify-center items-center"
              key={hunt.id}
            >
              <Link
                to={{ pathname: `/${hunt.slug}/` }}
                className={`flex flex-nowrap justify-between items-center gap-5 w-full max-w-xl px-2
							bg-slate-${ind % 2 ? 100 : 200}`}
              >
                <p className="text-2 text-neutral-800 text-left p-2">
                  {hunt.name}
                </p>

                <Countdown
                  date={new Date(hunt.start_date)}
                  zeroPadDays={3}
                  className="text-2 p-2"
                >
                  <span>The Hunt Has Commenced</span>
                </Countdown>
              </Link>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default OrganizingHunts;
