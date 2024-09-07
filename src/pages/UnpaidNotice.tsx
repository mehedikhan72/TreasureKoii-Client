import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { useEffect } from "react";

const UnpaidNotice = () => {
	const { slug } = useParams();

	useEffect(() => {
		toast.info("This hunt is not paid for... yet. Please notify your organizers.", { toastId: "unpaid-notice" });
	}, []);

	return (
		<div className="flex flex-col justify-center items-center min-h-screen">
			<TreasureKoiiImg />

			<div className="flex-grow flex flex-col justify-center text-4 stroked-text-sm m-2">
				<p>This hunt is not paid for... yet.</p>
				<p> Please notify your organizers.</p>
			</div>

			<HomeFooter />
		</div>
	);
};

export default UnpaidNotice;
