import React from "react";
import andro from "../../../static/andro.png";
import nathan from "../../../static/nathan.png";

const Devs = () => {
  return (
    <div className="rounded-3xl shadow-custom-inner w-[80%] flex flex-row items-center justify-between px-14 pt-10 mx-auto bg-white">
      <div className="andro-wrapper">
        <img src={andro} alt="Andro" />
      </div>
      <div className="statement flex flex-col items-center text-center w-[60%]">
        <p className="text-[36px]">meet the</p>
        <h1 className="font-bold text-[48px]">DEVELOPERS</h1>
        <p className="text-[16px]">Trust me, you don’t wanna meet with us</p>
      </div>
      <div className="nathan-wrapper">
        <img src={nathan} alt="Nathan" />
      </div>
    </div>
  );
};

export default Devs;
