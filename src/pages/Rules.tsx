import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";

const Rules: React.FC = () => {
  const { slug } = useParams();

  const [hunt, setHunt] = useState<Hunt>();
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

    getHuntDetails();
  }, [slug]);
  return (
    <div>
      <HuntNav slug={slug} huntName={hunt?.name} />
      <p>RULES</p>
    </div>
  );
};

export default Rules;
