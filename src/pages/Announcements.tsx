import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import HuntNav from "../components/HuntNav";
import { Announcement, Hunt } from "../types";
import useAxios from "../utils/hooks/useAxios";
import Loading from "../utils/Loading";

const Announcements: React.FC = () => {
	const { slug } = useParams();
	const axios = useAxios();

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
		<div className="flex flex-col min-h-screen">
			{(huntLoading || announcementsLoading) && <Loading />}
			<HuntNav slug={slug} huntName={hunt?.name} />
			<div className="my-10 flex-grow p-2 md:mx-auto max-w-[50rem] w-full">
				{announcements?.length > 0 && (
					<div>
						<p className="text-5 stroked-text-md mb-4">Announcements </p>
						{announcements.map((announcement: Announcement) => (
							<div key={announcement.id} className="styled-div-1">
								<p className="text-2 text-left">
									{announcement.creator.first_name} {announcement.creator.last_name}
								</p>
								<p className="text-1 text-left">{announcement.text}</p>
								<p className="text-0 text-left">{new Date(announcement.created_at).toLocaleString()}</p>
							</div>
						))}
					</div>
				)}
				{announcements?.length === 0 && (
					<p className="text-3 stroked-text-md">No Announcements yet. Please check after a while.</p>
				)}
			</div>
			<HomeFooter />
		</div>
	);
};

export default Announcements;
