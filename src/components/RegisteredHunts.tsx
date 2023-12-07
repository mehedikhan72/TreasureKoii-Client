import axios from "../utils/axios/AxiosSetup";
import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { Hunt } from "../types";
import { Link } from "react-router-dom";

const RegisteredHunts: React.FC = () => {
	const [hunts, setHunts] = useState<(Hunt & { slug: string })[]>();

	useEffect(() => {
		const getRegisteredHunts = async () => {
			try {
				const response = await axios.get("get-users-hunts/");
				const data = response.data;

				console.log(data);
				setHunts(data.hunts);
			} catch (error) {
				console.log(error);
			}
		};

		getRegisteredHunts();
	}, []);

	return (
		<>
			{hunts?.length ? (
				<div className="flex flex-col justify-center items-center my-10 mx-8">
					<div className="text-3 my-5">Registered Hunts : </div>
					{hunts.map((hunt, ind) => (
						<div
							className={`flex flex-nowrap justify-between items-center gap-5 w-full max-w-xl px-2
							bg-slate-${ind % 2 ? 100 : 200}`}
							key={hunt.id}
						>
							<Link to={{ pathname: `/${hunt.slug}/` }}>
								<p className="text-2 text-neutral-800 text-left p-2">{hunt.name}</p>
							</Link>
							<Countdown date={new Date(hunt.start_date)} zeroPadDays={3} className="text-2xl p-2">
								<span>The Hunt Has Commenced</span>
							</Countdown>
						</div>
					))}
				</div>
			) : null}
		</>
	);
};

export default RegisteredHunts;