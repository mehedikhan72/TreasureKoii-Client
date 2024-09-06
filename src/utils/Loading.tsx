import React from "react";
import ReactLoading from "react-loading";

const Loading: React.FC = () => {
  const treasreImg = "/favicon.ico";
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50"
      data-testid="loading-element"
    >
      <ReactLoading type="bars" color="white" height={100} width={100} />
      {/* <img src={treasreImg} alt="loading"/> */}
    </div>
  );
};

export default Loading;
