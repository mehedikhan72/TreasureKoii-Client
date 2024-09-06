// this nav is only available during the hunt.

import React from "react";
import { Link } from "react-router-dom";

const HuntNav: React.FC<{
	slug: string | undefined;
	huntName: string | undefined;
}> = ({ slug, huntName }) => {
	return (
		<div className="p-4 bg-[#f0cead] bg-opacity-40 mb-4">
			<p className="stroked-text-md text-white text-5">{huntName}</p>
			<div className="flex justify-center items-center">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:max-w-[1000px] justify-center items-center">
					<Link className="stroked-text-sm text-white link-2 flex items-center justify-center" to={{ pathname: `/${slug}` }}>
						Dashboard
					</Link>

					<Link className="stroked-text-sm text-white link-2 flex items-center justify-center" to={{ pathname: `/${slug}/rules` }}>
						Rules
					</Link>

					<Link className="stroked-text-sm text-white link-2 flex items-center justify-center" to={{ pathname: `/${slug}/announcements` }}>
						Announcements
					</Link>

					<Link className="stroked-text-sm text-white link-2 flex items-center justify-center" to={{ pathname: `/${slug}/leaderboard` }}>
						Leaderboard
					</Link>
				</div>
			</div>
		</div>
	);
};

export default HuntNav;
