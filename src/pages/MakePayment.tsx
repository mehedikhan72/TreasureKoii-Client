import React from "react";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { useParams, Link } from "react-router-dom";

const MakePayment = () => {
  const { slug } = useParams();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <TreasureKoiiImg />
      <div className="flex-grow">
        <p className="text-3 text-red-500 m-2">
          This hunt is not paid for... yet. Follow the procedure below to
          activate this hunt.
        </p>
        <div className="my-5 mx-2">
          <p className="text-2 text-left">
            1. Bkash(Send Money) 5000 BDT to this number: 01306231965. In the
            reference, type "TreasureKoii - Name of this hunt"
          </p>
          <p className="text-2 text-left">
            2. Make a call to this number: 01306231965, letting us know about
            the transaction.
          </p>
          <p className="text-2 text-left">
            3. If we do not pick up the phone, please be patient and try again
            after some time.
          </p>
          <p className="text-2 text-left">
            4. If you can't reach us, send an email to
            "mehedi.72.khan@gmail.com" and inform us about your situation.
            (Include your transaction ID.)
          </p>
          <p className="text-2 text-left">
            5. Once we confirm your payment, we will activate this hunt.
          </p>
          <p className="text-2 text-left">
            6. This entire process may take from a few minutes upto several
            hours. So please be patient.
          </p>
        </div>
        <p className="text-1">
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
