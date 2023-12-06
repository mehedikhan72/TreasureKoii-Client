import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import HuntNav from "../../components/HuntNav";
import { Hunt } from "../../types";
import axios from "../../utils/axios/AxiosSetup";
import AuthContext from "../../utils/context/AuthContext";

const Dashboard: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  const [hunt, setHunt] = useState<Hunt>();
  const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);
  const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false);
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

    const checkIfUserAnOrganizer = async (): Promise<void> => {
      try {
        const response = await axios.get(`${slug}/is-user-an-organizer/`);
        const data = response.data;
        if (response.status === 200) {
          setUserAnOrganizer(data.is_organizer);
          setUserDataLoaded(true);
        }
      } catch (error) {
        console.log(error);
        setUserDataLoaded(true);
      }
    };

    getHuntDetails();
    checkIfUserAnOrganizer();
  }, [slug]);

  // Announcements
  const [announcement, setAnnouncement] = useState<string>("");
  const [announcementMessage, setAnnouncementMessage] = useState<string>("");

  const announcementAdded = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${slug}/add-announcement/`, {
        text: announcement,
      });
      const data = response.data;
      if (response.status === 201) {
        setAnnouncementMessage("Announcement added successfully.");
        setAnnouncement("");
      } else {
        setAnnouncementMessage(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // rules
  const [rule, setRule] = useState<string>("");
  const [rulesMessage, setRulesMessage] = useState<string>("");

  const rulesAdded = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${slug}/add-rule/`, {
        rule: rule,
      });
      const data = response.data;
      if (response.status === 201) {
        setRulesMessage("Rule added successfully.");
        setRule("");
      } else {
        setRulesMessage(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // add more organizers
  const [emails, setEmails] = useState<string[]>([]);
  const [organizerAddMessage, setOrganizerAddMessage] = useState<string>("");

  const addOrganizers = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${slug}/add-organizers/`, {
        emails: emails,
      });
      const data = response.data;
      if (response.status === 201) {
        setOrganizerAddMessage("Organizers added successfully.");
        setEmails([]);
      } else {
        setOrganizerAddMessage(data.error);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <HuntNav slug={slug} huntName={hunt?.name} />
      {/* TODO: bug fix - the bottom div is shown even when user is an organizer */}
      {!userAnOrganizer && userDataLoaded && (
        <div className="flex flex-col justify-center items-center">
          <p className="text-2">You are not an organizer of this hunt.</p>
          <Link to={{ pathname: `/${slug}` }}>
            <button className="btn btn-primary my-btn-1">
              Go to hunt home
            </button>
          </Link>
        </div>
      )}
      {userAnOrganizer && (
        <div>
          <p className="text-3">
            Hi, {user?.first_name} {user?.last_name}! Welcome to the organizer
            dashboard.
          </p>
          <div className="flex flex-col justify-center items-center">
            <Link to={{ pathname: `${slug}/create-puzzle` }}>
              <button className="my-btn-1">Create New Puzzle</button>
            </Link>

            {/* Add announcements Div */}
            <div className="m-10">
              <p className="text-2">
                Add an announcement!(designed for 'during the hunt' phase)
              </p>
              <form
                className="flex flex-col justify-center items-center"
                onSubmit={announcementAdded}
              >
                <input
                  type="text"
                  name="announcement"
                  placeholder="Announcement"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  className="my-input-field w-[300px] md:w-[500px]"
                />
                {announcementMessage && (
                  <p className="text-1 text-green-500">{announcementMessage}</p>
                )}
                <button className="my-btn-1 w-[300px] md:w-[500px]">
                  Add Announcement
                </button>
              </form>
            </div>

            {/* Add rule div */}
            <div className="m-10">
              <p className="text-2">
                Add a rule!(designed for 'before the hunt' phase)
              </p>
              <form
                className="flex flex-col justify-center items-center"
                onSubmit={rulesAdded}
              >
                <input
                  type="text"
                  name="rules"
                  placeholder="Rules"
                  value={rule}
                  onChange={(e) => setRule(e.target.value)}
                  className="my-input-field w-[300px] md:w-[500px]"
                />
                {rulesMessage && (
                  <p className="text-1 text-green-500">{rulesMessage}</p>
                )}
                <button className="my-btn-1 w-[300px] md:w-[500px]">
                  Add Rule
                </button>
              </form>
            </div>

            {/* Add more organizers div */}
            <div className="m-10">
              <p className="text-2">Add more organizers to this hunt!</p>
              <form
                className="flex flex-col justify-center items-center"
                onSubmit={addOrganizers}
              >
                <input
                  type="text"
                  name="emails"
                  placeholder="Emails of organizers(comma separated)"
                  value={emails}
                  onChange={(e) => setEmails(e.target.value.split(","))}
                  className="my-input-field w-[300px] md:w-[500px]"
                />
                <p className="text-1">
                  (Note: The organizers must have an account on this website.
                  Seperate the emails with a comma, only. no other spaces.
                  Example - alice@gmail.com,bob@gmail.com,johndoe@gmail.com)
                </p>
                {organizerAddMessage && (
                  <p className="text-1 text-green-500">{organizerAddMessage}</p>
                )}
                <button className="my-btn-1 w-[300px] md:w-[500px]">
                  Add Organizers
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
