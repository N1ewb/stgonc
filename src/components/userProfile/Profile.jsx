import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DefaultProfile from "../../static/images/default-profile.png";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDB } from "../../context/db/DBContext";

const Profile = () => {
  const auth = useAuth();
  const db = useDB()
  const navigate = useNavigate();
  const [user, setUser] = useState()

  const handleSignout = async () => {
    await auth.SignOut();
    navigate("/");
  };

  useEffect(() => {
    const handleGetUser = async () => {
      try{
        if(auth.currentUser){
          const user = await db.getUser(auth.currentUser.uid)
          setUser(user)
        }
      }catch(error){
        console.log(`Error in retreving user: ${error.message}`)
      }
    }
    handleGetUser()
  },[])

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
          <Link className="decoration-transparent [&_a]:decoration-transparent p-3 text-black" to={`/private/${user?.role}/notifications`}>Notifications</Link>
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
