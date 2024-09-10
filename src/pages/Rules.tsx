import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import HuntNav from "../components/HuntNav";
import { Hunt, Rule } from "../types";
import useAxios from "../utils/hooks/useAxios";
import Loading from "../utils/Loading";

const Rules: React.FC = () => {
	const { slug } = useParams();
	const axios = useAxios();

	const [hunt, setHunt] = useState<Hunt>();
	const [rules, setRules] = useState<Rule[]>();

	const [rulesLoading, setRulesLoading] = useState<boolean>(false);
	const [huntLoading, setHuntLoading] = useState<boolean>(false);

	useEffect(() => {
		document.title = `Rules | ${hunt ? `${hunt.name} | ` : ""}TreasureKoii`;

		const getHuntDetails = async (): Promise<void> => {
			setRulesLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					setHunt(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setRulesLoading(false);
			}
		};

		const getRules = async (): Promise<void> => {
			setHuntLoading(true);
			try {
				const response = await axios.get(`${slug}/get-rules/`);
				const data = response.data;
				if (response.status === 200) {
					setRules(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setHuntLoading(false);
			}
		};

		getHuntDetails();
		getRules();

		return () => {
			document.title = "TreasureKoii";
		};
	}, [slug]);

	return (
		<div className="flex flex-col min-h-screen">
			<HuntNav slug={slug} huntName={hunt?.name} />

			<div className="flex-grow">
				{(huntLoading || rulesLoading) && <Loading />}
				{rules?.length !== 0 && (
					<div className="mt-8">
						<p className="text-5 stroked-text-md">Rules</p>
						<p className="text-2 stroked-text-md lg:px-60">
							<p>We expect that you follow a set of rules.</p>
							<p>The organizers have complete authority to add, delete, and/or change any rule at any given time.</p>
						</p>
						<div className="styled-div-1 py-4 m-2 md:mx-auto max-w-[50rem] grid grid-cols-[auto_auto_1fr] gap-x-2">
							{rules?.map((rule, index) => (
								<div key={rule.id} className="text-1 text-left grid grid-cols-subgrid col-span-full">
									<p className="text-right">{index + 1}</p>
									<p>-</p>
									<p>{rule.rule}</p>
								</div>
							))}
						</div>
					</div>
				)}
				{rules?.length === 0 && <p className="text-4 p-4 stroked-text-sm">No rules yet.</p>}
			</div>

			<HomeFooter />
		</div>
	);
};

export default Rules;
