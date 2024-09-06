import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Announcement, Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HuntNav from "../components/HuntNav";
import Loading from "../utils/Loading";

const Announcements: React.FC = () => {
	const { slug } = useParams();

	const [hunt, setHunt] = useState<Hunt>();
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);

	const [huntLoading, setHuntLoading] = useState<boolean>(false);
	const [announcementsLoading, setAnnouncementsLoading] = useState<boolean>(false);

	useEffect(() => {
		document.title = `Announcements | ${hunt ? `${hunt.name} | ` : ""}TreasureKoii`;

		const getAnnouncements = async (): Promise<void> => {
			setAnnouncementsLoading(true);
			try {
				const response = await axios.get(`${slug}/announcements/`);
				const data = response.data;
				if (response.status === 200) {
					setAnnouncements(data);
				}
				// console.log(response);
			} catch (error) {
				console.log(error);
			} finally {
				setAnnouncementsLoading(false);
			}
		};
		const getHuntDetails = async (): Promise<void> => {
			setHuntLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					setHunt(data);
				}
				// console.log(response);
			} catch (error) {
				console.log(error);
			} finally {
				setHuntLoading(false);
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
			{(huntLoading || announcementsLoading) && <Loading />}
			<HuntNav slug={slug} huntName={hunt?.name} />
			<div className="my-10  mx-auto max-w-[60rem] ">
				<p className="text-5 stroked-text-md mb-4">Announcements </p>
				{announcements?.length >= 0 ? (
					announcements.map((announcement: Announcement) => (
						<div key={announcement.id} className="styled-div-1">
							<p className="text-2 text-left">
								{announcement.creator.first_name} {announcement.creator.last_name}
							</p>
							<p className="text-1 text-left">{announcement.text}</p>
							<p className="text-0 text-left">{new Date(announcement.created_at).toLocaleString()}</p>
						</div>
					))
				) : (
					<p className="text-3 stroked-text-md">No Announcements yet. Please check after a while.</p>
				)}
			</div>
		</div>
	);
};

export default Announcements;
