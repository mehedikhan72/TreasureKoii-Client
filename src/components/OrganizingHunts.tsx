import { useContext, useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Link } from "react-router-dom";
import { Hunt } from "../types";
import AuthContext from "../utils/context/AuthContext";
import useAxios from "../utils/hooks/useAxios";

const zeroPad = (num: number, places: number) => String(num).padStart(places, "0");

const countdownRenderer = ({
	days,
	hours,
	minutes,
	seconds,
	completed,
}: {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	[key: string]: any;
}) => {
	if (completed) {
		return <span>The Hunt Has Commenced</span>;
	} else {
		const date = new Date(days, hours, minutes, seconds);
		return (
			<span>
				{!!days && `${days}D`} {(!!days || !!hours) && `${hours}H`}{" "}
				{(!!days || !!hours || !!minutes) && `${zeroPad(minutes, 2)}M`}{" "}
				{(!!days || !!hours || !!minutes || !!seconds) && `${zeroPad(seconds, 2)}S`}
			</span>
		);
	}
};

const OrganizingHunts: React.FC = () => {
	const axios = useAxios();
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

	return hunts?.length ? (
		<div className="flex flex-col justify-center items-center mt-8 mx-4">
			<div className="text-5 leading-[3rem] stroked-text-sm">Upcoming Hunts</div>
			<div className=" rounded-md grid grid-cols-[auto_auto_auto] styled-div-1 p-0 [&>*>*]:px-4 text-center [&>*]:items-center">
				<div className="grid grid-cols-subgrid col-span-full text-center py-3 pt-4 rounded-t font-bold border-b border-b-black mb-2 bg-prim bg-opacity-70">
					<p>Hunt Name</p>
					<p>Status</p>
					<p className="!px-20">Starts In</p>
				</div>
				{hunts.map((hunt, ind) => (
					<Link
						to={{ pathname: `/${hunt.slug}/` }}
						className="grid grid-cols-subgrid col-span-full text-center py-2 odd:bg-prim odd:bg-opacity-50 last:rounded-b hover:-translate-y-0.5 active:translate-y-0 transition-all duration-100 max-sm:text-sm"
						key={hunt.id}
					>
						<div className="text-left font-bold !px-8 max-sm:!px-4">{hunt.name}</div>
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
	) : null;
};

export default OrganizingHunts;
