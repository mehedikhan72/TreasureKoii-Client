import axios from "../utils/axios/AxiosSetup";
import { useEffect, useState, useContext } from "react";
import Countdown from "react-countdown";
import { Hunt } from "../types";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";

const countdownRenderer = ({ days, hours, minutes, seconds, completed }: any) => {
	if (completed) {
		return <span>The Hunt Has Commenced</span>;
	} else {
		return (
			<span>
				{!!days && `${days}D`} {!!hours && `${hours}H`} {!!minutes && `${minutes}M`} {!!seconds && `${seconds}S`}
			</span>
		);
	}
};

const OrganizingHunts: React.FC = () => {
	const [hunts, setHunts] = useState<(Hunt & { slug: string; status: "Organizing" | "Registered" })[]>();
	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	useEffect(() => {
		const getRegisteredHunts = async () => {
			try {
				const res1 = axios.get("get-users-organizing-hunts/");
				const res2 = axios.get("get-users-hunts/");
				await Promise.all([res1, res2]);
				const orgHunts = (await res1).data.hunts.map((hunt: Hunt) => ({ ...hunt, status: "Organizing" }));
				const partHunts = (await res2).data.hunts.map((hunt: Hunt) => ({ ...hunt, status: "Registered" }));
				setHunts([...orgHunts, ...partHunts]);
			} catch (error) {
				console.log(error);
			}
		};

		if (user) getRegisteredHunts();
	}, [contextData]);

	return (
		<div>
			{hunts?.length ? (
				<div className="flex flex-col justify-center items-center my-5 mx-8">
					<div className="text-4 my-5 stroked-text-md">
					Schedules treasure hunts
					</div>
					<div className="m-2 sm:m-4 rounded-md grid grid-cols-[1fr_auto_auto] styled-div-1 p-0 [&>*>*]:px-4 text-center [&>*]:items-center">
						<div className="grid grid-cols-subgrid col-span-full text-center py-2 pt-4 rounded-t font-bold border-b border-b-black mb-2 bg-prim bg-opacity-70 ">
							<p>Hunt Name</p>
							<p>Status</p>
							<p>Starts In</p>
						</div>
						{hunts.map((hunt, ind) => (
							<Link
								to={{ pathname: `/${hunt.slug}/` }}
								className="grid grid-cols-subgrid col-span-full text-center py-1 odd:bg-prim odd:bg-opacity-50 last:rounded-b hover:-translate-y-0.5 active:translate-y-0 transition-all duration-100"
								key={hunt.id}
							>
								<p className="text-neutral-800 text-left p-2 font-bold">{hunt.name}</p>
								<p>{hunt.status}</p>
								<Countdown
									date={new Date(hunt.start_date)}
									renderer={countdownRenderer}
									zeroPadDays={3}
									className="text-2 p-2"
								>
									<span>The Hunt Has Commenced</span>
								</Countdown>
							</Link>
						))}
					</div>
				</div>
			) : null}
		</div>
	);
};

export default OrganizingHunts;
