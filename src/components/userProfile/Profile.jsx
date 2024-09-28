import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DefaultProfile from "../../static/images/default-profile.png";
import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDB } from "../../context/db/DBContext";
import { useChat } from "../../context/chatContext/ChatContext";
import { useMessage } from "../../context/notification/NotificationContext";

const Profile = () => {
  const auth = useAuth();
  const db = useDB();
  const chat = useChat();
  const notif = useMessage();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const [notifications, setNotifications] = useState([]);

  const handleSignout = async () => {
    if (auth.currentUser) {
      await chat.setCurrentChatReceiver(null);
      await auth.SignOut();
      navigate("/");
    }
  };

  useEffect(() => {
    async function handleGetNotifications() {
      if (auth.currentUser) {
        const unsubscribe = notif.subscribeToUserNotifications(
          auth.currentUser.email,
          (newNotifications) => {
            setNotifications(newNotifications);
          }
        );
        return () => unsubscribe();
      }
    }
    handleGetNotifications();
  }, [notif, auth.currentUser]);

  useEffect(() => {
    const handleGetUser = async () => {
      try {
        if (auth.currentUser) {
          const user = await db.getUser(auth.currentUser.uid);
          setUser(user);
        }
      } catch (error) {
        console.log(`Error in retreving user: ${error.message}`);
      }
    };
    handleGetUser();
  }, []);

  return (
    <div className="profile-container lg:hidden">
      <Dropdown>
        <div className="div relative">
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
            <div className="relative ">
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
            </div>
          </Dropdown.Toggle>
          <Link
            className={`notif-block absolute -top-[5%] left-[36%] h-8 w-8 rounded-full bg-red-800 ${
              notifications.length !== 0 ? "flex" : "hidden "
            } items-center justify-center text-white decoration-transparent `}
            to={`/private/${user?.role}/notifications`}
          >
            {notifications.length}
          </Link>
        </div>
        <Dropdown.Menu>
          {auth.currentUser && (
            <Dropdown.Item href="#/action-1" onClick={() => navigate("/private/Userpage")}>
              {auth.currentUser.displayName}
            </Dropdown.Item>
          )}

          <Dropdown.Item onClick={() => navigate("/private/Userpage")}>
            Account Settings
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              className="decoration-transparent [&_a]:decoration-transparent text-[#000000d2]"
              to={`/private/${user?.role}/notifications`}
            >
              Notifications
            </Link>
          </Dropdown.Item>
          <Dropdown.Item>
            <Link
              className="decoration-transparent [&_a]:decoration-transparent text-[#000000d2]"
              to={`/private/${user?.role}/messages`}
            >
              Messages
            </Link>
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
