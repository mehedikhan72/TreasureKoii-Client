import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt, Rule } from "../types";
import HuntNav from "../components/HuntNav";

const Rules: React.FC = () => {
  const { slug } = useParams();

  const [hunt, setHunt] = useState<Hunt>();
  const [rules, setRules] = useState<Rule[]>();
  useEffect(() => {
    document.title = `Rules | ${hunt ? hunt?.name : "TreasureKoii"}`;

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

    const getRules = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/get-rules/`);
        const data = response.data;
        if (response.status === 200) {
          setRules(data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getHuntDetails();
    getRules();

    return () => {
      document.title = "TreasureKoii";
    };
  }, [slug]);
  return (
    <div>
      <HuntNav slug={slug} huntName={hunt?.name} />

      {rules?.length !== 0 && (
        <div>
          <p className="text-3">
            We expect that you follow a set a of ruless. The organizers have
            complete authority to add, delete and/or change any rule at any
            given time.
          </p>
          <div className="p-2 ml-2 sm:ml-10 md:ml-20">
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
    </div>
  );
};

export default Rules;
