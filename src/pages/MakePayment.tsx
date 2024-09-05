import React, { useEffect } from "react";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";

const MakePayment = () => {
  useEffect(() => {
    document.title = "Make Payment | TreasureKoii";

    const timeoutId = setTimeout(() => {
      toast.info(
        "This hunt is not paid for... yet. Follow the instructions in this page to activate this hunt"
      );
    }, 50);

    // Cleanup function to clear the timeout if the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const { slug } = useParams();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <TreasureKoiiImg />
      <div className="flex-grow">
        {/* todo - toaster */}
        {/* <p className="text-3 text-red-500 m-2 ">
          This hunt is not paid for... yet. Follow the procedure below to
          activate this hunt.
        </p> */}
        <p className="text-5">Make Payment</p>
        <div className="styled-div-1">
          <p className="text-2 text-left">
            1. The compensation of organizing this hunt is 5000 BDT.
          </p>
          <p className="text-2 text-left">
            2. Contact us via email at 'mehedi.72.khan@gmail.com' or call us at
            '+8801306231965' and we will guide you through the payment process.
          </p>
          <p className="text-2 text-left">
            3. If you can't reach us, please be patient and we will contact you
            shortly.
          </p>
          <p className="text-2 text-left">
            4. Once you complete the payment and we confirm it, we will activate
            this hunt.
          </p>
        </div>
        <p className="text-2">
          (Note: You must pay before the hunt begins so you have enough time to
          create puzzles, tweak other settings for this hunt and let people
          create team and participate.)
        </p>

        <p className="text-2 mt-6">
          If you've paid for the hunt, visit home page{" "}
          <Link
            className="underline hover:text-blue-500"
            to={{ pathname: `/${slug}` }}
          >
            here.
          </Link>
        </p>
        <p className="text-4 pt-8">Thank you for staying with us!!</p>
      </div>

      <HomeFooter />
    </div>
  );
};

export default MakePayment;
