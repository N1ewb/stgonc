import React from "react";

import tria from "../../static/images/tria.png";
import SPCLOGO from "../../static/images/spc logo.jpg";
import landingpageimage from "../../static/images/landing-page-image.png";
import { Link } from "react-router-dom";

import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-container bg-white flex flex-row flex-wrap items-center h-screen w-full md:flex-col">
      <div className="left-content text-[40px] text-[#740000] font-bold text-center h-1/2 w-[40%] flex flex-col items-center justify-center md:w-full md:top-[120px] md:py-40 md:px-20">
        <p>STUDENT-TEACHER AND GUIDANCE ONLINE CONSULTATION</p>
        <div className="landing-logos flex flex-row items-center justify-around w-[80%]">
          <img src={tria} alt="stgonc-logo" width={100} />
          <img src={SPCLOGO} alt="spc-logo" width={100} />
        </div>
      </div>
      <div className="spacer md:w-0 w-[10%] 1xl:w-0"></div>
      <div className="right-content w-1/2 flex items-start justify-center md:w-full ">
        <img
          className="landing-page-image absolute right-[38%] md:hidden 1xl:hidden"
          src={landingpageimage}
          alt="landing-page-image"
        />
        <div className="right-content-box bg-[#740000] w-[70%] text-white py-[70px] px-[100px] flex flex-col 1xl:w-[100%] 1xl:px-[40px] md:w-full md:flex-col-reverse rounded-[4%] gap-9">
          <div className="div">
            <p className="text-4xl">
              <strong>CONSULTATONS</strong>
            </p>
            <p className="text-8xl font-thin">MADE</p>
            <p className="text-4xl">
              <strong>
                <i>FASTER</i>
              </strong>{" "}
              <span>AND</span> <strong>EASIER</strong>
            </p>
            <p style={{ fontSize: "13px" }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse egestas orci at mi maximus ornare. Nunc mollis ligula
              in purus placerat mattis. Nullam magna justo, pharetra vitae
              maximus a, pharetra quis ligula. Vivamus fringilla elementum urna.
              Etiam convallis mi dolor, vitae tincidunt metus tincidunt
              scelerisque.
            </p>
          </div>
          <div className="auth-links w-full flex flex-row justify-around text-center">
            <Link
              className=" no-underline
              text-white
               w-[160px] p-[10px] group bg-[#360000] hover:bg-white hover:text-[#360000] rounded-[25px] transition-all ease-in-out duration-300"
              to="/StudentRegister"
            >
              <p className="landing-register-button m-0 group-hover:text-[#360000]">
                REGISTER
              </p>
            </Link>
            <Link
              className="no-underline w-[160px] p-[10px] group text-[#360000] bg-[white] hover:bg-[#360000]  rounded-[25px] transition-all ease-in-out duration-300"
              to="/Login"
            >
              <p className="landing-login-button m-0 group-hover:text-white">
                LOGIN
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
