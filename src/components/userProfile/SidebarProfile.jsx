import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";

import DefaultProfile from "../../static/images/default-profile.png";

import "./SidebarProfile.css";

const SidebarProfile = () => {
  const auth = useAuth();
  const db = useDB();

  return (
    <div className="sidebar-profile-container">
      <img
        src={
          auth.currentUser.photoUrl
            ? auth.currentUser && auth.currentUser.photoUrl
            : DefaultProfile
        }
        alt="User Profile"
        width={80}
      />
      <p style={{ fontSize: "30px" }}>
        {auth.currentUser && auth.currentUser.displayName}
      </p>
      <p style={{ opacity: "0.8", fontWeight: "200" }}>
        {auth.currentUser && auth.currentUser.email}
      </p>
    </div>
  );
};

export default SidebarProfile;
