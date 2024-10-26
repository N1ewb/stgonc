import React from "react";

import Hero from "./sections/Hero";
import About from "./sections/About";
import Devs from "./sections/Devs";

const LandingPage = () => {
  return (
    <div className="landing-page-container w-full max-h-full flex flex-col items-center px-4 bg-[#360000] overflow-auto">
      <div className="spacer h-[10vh]"></div>
      <div className="section-container w-full h-auto bg-white rounded-t-[70px] m-0 items-center flex flex-col">
        <Hero />
        <div className="spacer h-[20vh]"></div>
        <About />
        <div className="spacer h-[40vh]"></div>
        <Devs />
        <div className="spacer h-[20vh]"></div>
      </div>
    </div>
  );
};

export default LandingPage;
