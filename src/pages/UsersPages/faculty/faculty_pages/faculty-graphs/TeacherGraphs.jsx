import React, { useEffect, useState } from "react";
import { useMessage } from "../../../../../context/notification/NotificationContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";

const TeacherGraphs = () => {
  const notif = useMessage();
  const auth = useAuth();
  const db = useDB();
  const [notifications, setNotifications] = useState();

  useEffect(() => {
    const handleGetNotifications = async () => {
      try {
        if (auth.currentUser) {
          const notification = await notif.getUserNotifications(
            auth.currentUser.email
          );
          setNotifications(notification);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    handleGetNotifications();
  }, []);

  return (
    <div>
      <div className="temp-container">
        Notifications
        {notifications && notifications.length !== 0
          ? notifications.map((notif) => (
              <div className="p-3 shadow-md rounded-[20px]" key={notif.id}>
                <p>{notif.subject}</p>
                <p>Concern: {notif.content}</p>
                <p>Sent By: {notif.sentBy}</p>
              </div>
            ))
          : "no notifications"}
      </div>
    </div>
  );
};

export default TeacherGraphs;
