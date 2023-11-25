import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";

const Home: React.FC = () => {
  let constextData = useContext(AuthContext);
  if (!constextData) {
    return null;
  }
  const { user } = constextData;
  console.log(user);
  return (
    <div>
      <p>Home</p>
    </div>
  );
};

export default Home;
