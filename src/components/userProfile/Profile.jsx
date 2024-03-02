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
          <img
            style={{ cursor: "pointer" }}
            src={
              auth.currentUser.photoUrl
                ? auth.currentUser.photoUrl
                : DefaultProfile
            }
            alt="profile"
            width="25px"
          />
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item href="#/action-1">
            {auth.currentUser.displayName}
          </Dropdown.Item>

          <Dropdown.Item onClick={() => navigate("/Userpage")}>
            Account Settings
          </Dropdown.Item>

          <Dropdown.Item href="#/action-2">Give Feedback</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSignout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
};

export default Profile;
