import React from "react";
import andro from "../../../static/andro.png";
import nathan from "../../../static/nathan.png";

const Devs = () => {
  return (
    <div className="rounded-3xl relative shadow-custom-inner w-[80%] h-[470px] xl:h-auto flex flex-row items-center justify-center px-14 pt-10 mx-auto bg-white">
      <div className="andro-wrapper absolute bottom-0 left-0 z-10 flex items-end h-full xl:h-auto">
        <img src={andro} alt="Andro" className="h-[80%] xl:h-[210px] lg:h-[190px] md:h-[150px] sm:h-[120px] xsm:h-[100px]" />
      </div>
      <div className="statement flex flex-col items-center text-center w-[60%] z-20 xl:p-8 lg:p-5 md:p-2 ">
        <p className="text-[36px] lg:text-[30px] md:text-[26px] sm:text-[22px] xsm:text[18px]">meet the</p>
        <h1 className="font-bold text-[3rem] lg:text-[38px] md:text-[2rem] sm:text-[28px] xsm:text-[22px]">DEVELOPERS</h1>
        <p className="text-[16px] lg:text-[12px] sm:text-[10px] xsm:text-[8px]">Trust me, you don’t wanna meet with us</p>
      </div>
      <div className="nathan-wrapper absolute bottom-0 right-0 z-10 flex items-end h-full xl:h-auto">
        <img src={nathan} alt="Nathan" className="h-[80%] xl:h-[210px] lg:h-[190px] md:h-[150px] sm:h-[120px] xsm:h-[100px]" />
      </div>
    </div>
  );
};

export default Devs;
