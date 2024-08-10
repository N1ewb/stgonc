import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";

import Profile from "../userProfile/Profile";
import STGONCLOGO from "../../static/images/STGONC-LOGO-WHITE.png";
import "./Navbar.css";

const Navbar = () => {
  const auth = useAuth();
  const db = useDB();
  const [user, setUser] = useState(null);

  const handleGetUser = async () => {
    if (auth.currentUser) {
      const user = await db.getUser(auth.currentUser.uid);
      setUser(user);
    }
  };

  useEffect(() => {
    if (user === null || user === undefined) {
      handleGetUser();
    }
  });

  return (
    <div className="navbar-container">
      <div className="logo-wrapper">
        <img src={STGONCLOGO} alt="stgonc-logo" height={40} />
      </div>

      <div className="nav-links">
        <Link to="#">
          <p>About Us</p>
        </Link>
        <Link to="#">
          <p>Contact Us</p>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
