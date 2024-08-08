import React from "react";

import STGONCLOGOLARGE from "../../static/images/STGONC-LOGO-LARGE.png";
import SPCLOGO from "../../static/images/spc logo.jpg";
import landingpageimage from "../../static/images/landing-page-image.png";
import { Link } from "react-router-dom";

import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-page-container">
      <div className="left-content">
        <img src={STGONCLOGOLARGE} alt="stgonc-logo" height={300} />
        <img src={SPCLOGO} alt="spc-logo" height={100} />
      </div>
      <div className="right-content">
        <img
          className="landing-page-image"
          src={landingpageimage}
          alt="landing-page-image"
        />
        <div className="right-content-box">
          <p style={{ fontSize: "40px" }}>
            <strong>CONSULTATONS</strong>
          </p>
          <p style={{ fontSize: "90px", fontWeight: "100", lineHeight: "80%" }}>
            MADE
          </p>
          <p style={{ fontSize: "40px" }}>
            <strong>
              <i>FASTER</i>
            </strong>{" "}
            <span>AND</span> <strong>EASIER</strong>
          </p>
          <p style={{ fontSize: "13px" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            egestas orci at mi maximus ornare. Nunc mollis ligula in purus
            placerat mattis. Nullam magna justo, pharetra vitae maximus a,
            pharetra quis ligula. Vivamus fringilla elementum urna. Etiam
            convallis mi dolor, vitae tincidunt metus tincidunt scelerisque.
          </p>
          <div className="auth-links">
            <Link to="/StudentRegister">
              <p className="landing-register-button">REGISTER</p>
            </Link>
            <Link to="/Login">
              <p className="landing-login-button">LOGIN</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
