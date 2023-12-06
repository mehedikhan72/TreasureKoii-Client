import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Announcement, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HuntNav from "../components/HuntNav";

const Announcements: React.FC = () => {
  const { slug } = useParams();

  const [hunt, setHunt] = useState<Hunt>();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  useEffect(() => {
    document.title = `Announcements | ${hunt ? hunt?.name : "TreasureKoii"}`;

    const getAnnouncements = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/announcements/`);
        const data = response.data;
        if (response.status === 200) {
          setAnnouncements(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
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
    getAnnouncements();
    getHuntDetails();

    return () => {
      document.title = "TreasureKoii";
    };
  }, [slug]);

  return (
    <div>
      <HuntNav slug={slug} huntName={hunt?.name} />
      {announcements && announcements.length !== 0 && (
        <div>
          <p className="text-4">Announcements </p>
          {announcements.map((announcement: Announcement) => (
            <div
              key={announcement.id}
              className="p-4 bg-slate-200 rounded-md m-2"
            >
              <p className="text-3 text-left">
                {announcement.creator.first_name}{" "}
                {announcement.creator.last_name}
              </p>
              <p className="text-2 text-left">{announcement.text}</p>
              {/* TODO: improve this time */}
              <p className="text-1 text-left">{announcement.created_at}</p>
              <br />
            </div>
          ))}
        </div>
      )}
      {announcements && announcements.length === 0 && (
        <div>
          <p className="text-3">
            No Announcements yet. Please check after a while.
          </p>
        </div>
      )}
    </div>
  );
};

export default Announcements;
