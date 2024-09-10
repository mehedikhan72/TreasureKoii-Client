import React, { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";
import { Link, useParams } from "react-router-dom";
import { Hunt, Rule } from "../types";
import useAxios from "../utils/hooks/useAxios";
import HomeFooter from "./HomeFooter";

const countdownRenderer = ({
  days,
  hours,
  minutes,
  seconds,
  completed,
  props,
}: {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  [key: string]: any;
}) => {
  if (completed) {
    // force reload
    window.location.reload();
  } else {
    const date = new Date(days, hours, minutes, seconds);
    return (
      <div className={props.className}>
        <div className="text-4">Starts In</div>
        <div>
          {!!days && `${days} Days`} {(!!days || !!hours) && `${hours} Hrs`}{" "}
          {(!!days || !!hours || !!minutes) && `${zeroPad(minutes, 2)} Mins`}{" "}
          {(!!days || !!hours || !!minutes || !!seconds) &&
            `${zeroPad(seconds, 2)} Secs`}
        </div>
      </div>
    );
  }
};

const Before: React.FC<{ hunt: Hunt }> = ({ hunt }) => {
  const { slug } = useParams();

  const axios = useAxios();

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
            <div className="text-6 stroked-text-sm">{hunt.name}</div>
            <div className="text-1 my-2 stroked-text-sm">{`${new Date(
              hunt.start_date
            ).toLocaleString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })} - ${new Date(hunt.end_date).toLocaleString(undefined, {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}`}</div>
            <img
              src={hunt.poster_img}
              alt="Hunt"
              className="w-4/5 max-h-96 object-contain my-5"
            />

            <Countdown
              date={new Date(hunt.start_date)}
              zeroPadDays={2}
              renderer={countdownRenderer}
              className="text-5 my-4 stroked-text-sm"
            >
              <span>The Hunt Has Commenced.</span>
            </Countdown>

            <div className="styled-div-1 w-full text-center max-w-[40rem]">
              {hunt.description}
            </div>
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
              <div className="text-1 my-5 stroked-text-sm">
                <p className="text-3">
                  We expect that you follow a set a of rules.
                </p>
                <p>
                  The organizers have complete authority to add, delete and/or
                  change any rule at any given time.
                </p>
              </div>
              <div className="styled-div-1 m-2 md:mx-auto max-w-[50rem] grid grid-cols-[auto_auto_1fr] gap-x-2">
                {rules?.map((rule, index) => (
                  <div
                    key={rule.id}
                    className="text-1 text-left grid grid-cols-subgrid col-span-full"
                  >
                    <p className="text-right">{index + 1}</p>
                    <p>-</p>
                    <p>{rule.rule}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {rules?.length === 0 && (
            <p className="text-4 p-4  stroked-text-sm">No rules yet.</p>
          )}
        </>
      )}

      <HomeFooter />
    </div>
  );
};

export default Before;
