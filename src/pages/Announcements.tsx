import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Announcement } from "../types";
import axios from "../utils/axios/AxiosSetup";

const Announcements: React.FC = () => {
  const { slug } = useParams();

  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  useEffect(() => {
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
    getAnnouncements();
  }, [slug]);

  return (
    <div>
      <p>Announcements page</p>
      {announcements.map((announcement: Announcement) => (
        <div key={announcement.id}>
          <p>{announcement.creator.first_name} {announcement.creator.last_name}</p>
          <p>{announcement.text}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Announcements;
