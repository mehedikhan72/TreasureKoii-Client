import React from "react";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const PointsSystem: React.FC = () => {
  return (
    <div className="m-2 p-2">
      <TreasureKoiiImg />
      <p className="text-5 stroked-text-md my-2">Points System</p>
      <p className="text-2 stroked-text-sm">
        In this treasure hunt platform, the point system rewards players based
        on how quickly they solve each puzzle. Here's how it works -
      </p>
      <div className="styled-div-1">
        <p className="font-bold">1. Maximum Points</p>
        <p>
          Each puzzle has a maximum number of points that can be earned by
          solving it. The maximum number of points is set by the organizers
          while creating the puzzle.
        </p>

        <p className="font-bold">2. Time-Based Deductions</p>
        <p>
          You have <strong>30 minutes</strong> to solve the puzzle without any
          point deductions. After 30 minutes, points will start to be deducted
          based on how much longer it takes to solve the puzzle.
        </p>

        <p className="font-bold">3. Fair Deduction Scale</p>
        <p>
          The amount of points deducted increases gradually based on how much
          extra time is taken. The maximum time allowed to solve a puzzle is
          determined by the length of the hunt, but the point deduction ensures
          you will always earn at least{" "}
          <strong>25% of the maximum points</strong>, even if you take a very
          long time.
        </p>
      </div>
    </div>
  );
};

export default PointsSystem;
