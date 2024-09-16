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
    <div className="profile-container lg:hidden">
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
              className="w-[100px] h-[100px] rounded-full object-cover"
              src={
                auth.currentUser?.photoURL
                  ? auth.currentUser.photoURL
                  : DefaultProfile
              }
              alt="profile picture"
            />
          )}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {auth.currentUser && (
            <Dropdown.Item href="#/action-1">
              {auth.currentUser.displayName}
            </Dropdown.Item>
          )}

          <Dropdown.Item onClick={() => navigate("/private/Userpage")}>
            Account Settings
          </Dropdown.Item>

          <Dropdown.Item href="#/action-2">Give Feedback</Dropdown.Item>
          <Dropdown.Item onClick={() => handleSignout()}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="user-display">
        <p className="text-[30px] m-0">
          {auth.currentUser && auth.currentUser.displayName}
        </p>
        <p className="m-0" style={{ opacity: "0.8", fontWeight: "200" }}>
          {auth.currentUser && auth.currentUser.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
