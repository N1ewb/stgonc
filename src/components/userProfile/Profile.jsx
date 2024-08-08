import React from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DefaultProfile from "../../static/images/default-profile.png";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Profile = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await auth.SignOut();
    navigate("/");
  };

  return (
    <div className="profile-container">
      <Dropdown>
        <Dropdown.Toggle
          variant="success"
          id="dropdown-basic"
          style={{
            backgroundColor: "transparent",
            border: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          {auth.currentUser && (
            <img
              style={{ cursor: "pointer" }}
              src={auth.currentUser.photoUrl || DefaultProfile}
              alt="profile"
              width="80px"
            />
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {auth.currentUser && (
            <Dropdown.Item href="#/action-1">
              {auth.currentUser.displayName}
            </Dropdown.Item>
          )}

          <Dropdown.Item onClick={() => navigate("/Userpage")}>
            Account Settings
          </Dropdown.Item>

          <Dropdown.Item href="#/action-2">Give Feedback</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSignout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="user-display">
        <p style={{ fontSize: "30px" }}>
          {auth.currentUser && auth.currentUser.displayName}
        </p>
        <p style={{ opacity: "0.8", fontWeight: "200" }}>
          {auth.currentUser && auth.currentUser.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
