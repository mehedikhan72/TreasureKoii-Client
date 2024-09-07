import React from "react";

const UIExposure: React.FC = () => {
  return (
    <div className="p-4 flex flex-col justify-center items-center">
      <p className="text-5 stroked-text-md">
        Amazing User Interface to enhance your experiences
      </p>
      <div className="max-w-[60rem] flex flex-wrap justify-center items-center styled-div-1 flex-grow space-y-4 sm:space-y-0 sm:space-x-4 sm:flex-row flex-col">
        <div className="pl-1 py-1">
          <div className="w-[300px] h-[630px] overflow-hidden rounded-md border border-black">
            <img src="/ui-2.webp" className="object-cover" />
          </div>
        </div>
        <div className=" py-1">
          <div className="w-[300px] h-[630px] overflow-hidden rounded-md border border-black">
            <img src="/ui-4.webp" className="object-cover" />
          </div>
        </div>
        <div className="pr-1 py-1">
          <div className="w-[300px] h-[630px] overflow-hidden rounded-md border border-black">
            <img src="/ui-1.webp" className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UIExposure;
