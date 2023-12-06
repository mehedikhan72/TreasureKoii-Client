import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HomeFooter from "./HomeFooter";
import Countdown from "react-countdown";
import { Rule } from "../types";

type countdownData = {
	days: number;
	hours: number;
	minutes: number;
	seconds: number;
	completed: boolean;
};

const countdownRender = ({ days, hours, minutes, seconds, completed }: countdownData) => {
	return (
		<div className="text-4">
			{days.toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}
			:
			{hours.toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}
			:
			{minutes.toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}
			:
			{seconds.toLocaleString("en-US", {
				minimumIntegerDigits: 2,
				useGrouping: false,
			})}
		</div>
	);
};

const Before: React.FC<{ hunt: Hunt }> = ({ hunt }) => {
	const { slug } = useParams();

	const [rules, setRules] = useState<Rule[]>();

	const [message, setMessage] = useState<string | null>();

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

	useEffect(() => {
		getRules();
	}, []);

	return (
		<div className="flex flex-col min-h-screen">
			{message && <p>{message}</p>}

			{hunt && (
				<>
					<div className="flex flex-col justify-center items-center mt-20 mb-10 mx-10">
						<div className="text-4">{hunt.name}</div>
						<div className="text-lg my-2">{`${new Date(hunt.start_date).toDateString()} - ${new Date(
							hunt.end_date
						).toDateString()}`}</div>
						<img src={hunt.poster_img} alt="Hunt Image" className="w-4/5 max-h-72 object-contain my-5" />
						<Countdown date={new Date(hunt.start_date)} renderer={countdownRender}>
							<span>The Hunt Has Commenced</span>
						</Countdown>
						<div className="text-xl">{hunt.description}</div>
					</div>
					{rules?.length !== 0 && (
						<div>
							<p className="text-3">
								We expect that you follow a set a of ruless. The organizers have complete authority to add, delete
								and/or change any rule at any given time.
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
					<div className="flex justify-center m-4">
						<Link to={{ pathname: `/${slug}/create-team/` }}>
							<button className="my-btn-1">Create A Team</button>
						</Link>
						<Link to={{ pathname: `/${slug}/join-team/` }}>
							<button className="my-btn-1">Join A Team</button>
						</Link>
					</div>
				</>
			)}

			<HomeFooter />
		</div>
	);
};

export default Before;
