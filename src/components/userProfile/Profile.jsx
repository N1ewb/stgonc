import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import DefaultProfile from "../../static/images/default-profile.png";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";
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
        console.log(`Error in retrieving user: ${error.message}`);
      }
    };
    handleGetUser();
  }, []);

  return (
    <div className="profile-container ">
      <Dropdown>
        <div className="relative w-[150px] xsm:w-[100px] myphone:w-[70px]">
          <Dropdown.Toggle
            style={{
              backgroundColor: "transparent",
              border: "none",
              display: "flex",
              alignItems: "center",
              width: "auto",
            }}
          >
            <div className="relative">
              {auth.currentUser && (
                <img
                  className="w-[100px] h-[100px] xsm:w-[50px] xsm:h-[50px] myphone:w-[35px] myphone:h-[35px] lg:w-[70px] lg:h-[70px] rounded-full object-cover"
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
          <div
            className={`notif-block cursor-pointer absolute -top-[5%] right-[15%] lg:left-0 h-8 w-8 rounded-full bg-red-800 ${
              notifications.length !== 0 ? "flex" : "hidden"
            } items-center justify-center text-white decoration-transparent`}
            onClick={() => navigate(`/private/${user?.role}/notifications`)}
          >
            {notifications.length}
          </div>
        </div>
        <Dropdown.Menu>
          {auth.currentUser && (
            <Dropdown.Item className="capitalize" onClick={() => navigate("/private/Userpage")}>
              {auth.currentUser.displayName}
            </Dropdown.Item>
          )}

          <Dropdown.Item onClick={() => navigate("/private/Userpage")}>
            Account Settings
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate(`/private/${user?.role}/notifications`)}>
            Notifications
          </Dropdown.Item>
          <Dropdown.Item onClick={() => navigate("/Contactus")}>Give Feedback</Dropdown.Item>
          <Dropdown.Item onClick={handleSignout}>Logout</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <div className="user-display lg:hidden">
        <p className="text-[30px] m-0 capitalize xl:text-[1.5rem]">
          {auth.currentUser && auth.currentUser.displayName}
        </p>
        <p className="m-0 xl:text-sm max-w-[90%] truncate ..." style={{ opacity: "0.8", fontWeight: "200" }}>
          {auth.currentUser && auth.currentUser.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
