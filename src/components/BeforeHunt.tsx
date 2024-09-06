import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HomeFooter from "./HomeFooter";
import Countdown from "react-countdown";
import { Rule } from "../types";

const Before: React.FC<{ hunt: Hunt }> = ({ hunt }) => {
  const { slug } = useParams();

  const [rules, setRules] = useState<Rule[]>();

  const getRules = async (): Promise<void> => {
    try {
      const response = await axios.get(`${slug}/get-rules/`);
      const data = response.data;
      if (response.status === 200) {
        setRules(data);
      }
      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRules();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {hunt && (
        <>
          <div className="flex flex-col justify-center items-center mt-20 mb-10 mx-10">
            <div className="text-5 stroked-text-sm">{hunt.name}</div>
            <div className="text-1 my-2 stroked-text-sm">{`${new Date(
              hunt.start_date
            ).toDateString()} - ${new Date(
              hunt.end_date
            ).toDateString()}`}</div>
            <img
              src={hunt.poster_img}
              alt="Hunt"
              className="w-4/5 max-h-96 object-contain my-5"
            />
            <div> 
              <Countdown
                date={new Date(hunt.start_date)}
                zeroPadDays={2}
                className="text-5 my-4 stroked-text-sm"
              >
                <span>The Hunt Has Commenced</span>
              </Countdown>
            </div>

            <div className="text-1 stroked-text-sm">{hunt.description}</div>
          </div>
          <div className="flex justify-center m-4">
            <Link to={{ pathname: `/${slug}/create-team/` }}>
              <button className="my-btn-1">Create A Team</button>
            </Link>
            <Link to={{ pathname: `/${slug}/join-team/` }}>
              <button className="my-btn-1">Join A Team</button>
            </Link>
          </div>
          {rules?.length !== 0 && (
            <div>
              <p className="text-1 my-5 stroked-text-sm">
                We expect that you follow a set a of ruless. The organizers have
                complete authority to add, delete and/or change any rule at any
                given time.
              </p>
              <div className="styled-div-1">
                {rules?.map((rule, index) => (
                  <div key={rule.id}>
                    <p className="text-1 text-left">
                      {index + 1} - {rule.rule}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {rules?.length === 0 && <p className="text-4 p-4">No rules yet.</p>}
        </>
      )}

      <HomeFooter />
    </div>
  );
};

export default Before;
