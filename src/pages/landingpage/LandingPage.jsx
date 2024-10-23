import React from "react";

import tria from "../../static/images/tria.png";
import SPCLOGO from "../../static/images/spc logo.jpg";
import landingpageimage from "../../static/images/landing-page-image.png";
import { Link } from "react-router-dom";

import "./LandingPage.css";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Devs from "./sections/Devs";

const LandingPage = () => {
  /* <div className="auth-links w-full flex flex-row justify-around text-center">
              <Link
                className=" no-underline
                text-white
                 w-[160px] p-[10px] group bg-[#360000] hover:bg-white hover:text-[#360000] rounded-[25px] transition-all ease-in-out duration-300"
                to="auth/StudentRegistration"
              >
                <p className="landing-register-button m-0 group-hover:text-[#360000]">
                  REGISTER
                </p>
              </Link>
              <Link
                className="no-underline w-[160px] p-[10px] group text-[#360000] bg-[white] hover:bg-[#360000]  rounded-[25px] transition-all ease-in-out duration-300"
                to="auth/Login"
              >
                <p className="landing-login-button m-0 group-hover:text-white">
                  LOGIN
                </p>
              </Link>
            </div> */

  return (
    <div className="landing-page-container w-full h-auto flex flex-col items-center px-4 bg-[#360000] overflow-auto">
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
