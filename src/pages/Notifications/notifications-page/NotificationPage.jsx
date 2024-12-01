import React, { useEffect, useState } from "react";
import { useMessage } from "../../../context/notification/NotificationContext";
import { useAuth } from "../../../context/auth/AuthContext";
import NotificationCard from "../notifications-components/NotificationCard";
import NotificationSidebar from "../notifications-components/NotificationSidebar";

const NotificationPage = () => {
  const notif = useMessage();
  const auth = useAuth();
  const [notificationList, setNotificationList] = useState([]);
  const [currentbutton, setCurrentbutton] = useState("All");
  const [currentCategory, setCurrentCategory] = useState([]);

  const sortNotifications = (category) => {
    const sortedNotification = notificationList.filter(
      (notification) => notification.subject.split(" ")[0] === category
    );
    return sortedNotification;
  };

  useEffect(() => {
    if (notificationList) {
      if (currentbutton === "All") {
        setCurrentCategory(notificationList);
      } else {
        setCurrentCategory(sortNotifications(currentbutton));
      }
    }
  }, [currentbutton, notificationList]);

  useEffect(() => {
    const getNotification = async () => {
      try {
        const unsubscribe = notif.subscribeToUserNotifications(
          auth.currentUser.email,
          (newnotifications) => setNotificationList(newnotifications)
        );
        return () => unsubscribe();
      } catch (error) {
        console.log(`error in retreving notifications: ${error.message}`);
      }
    };
    getNotification();
  }, [notif]);

  return (
    <div className="h-[100%]">
      <div className="notification-body h-[100%] flex lg:flex-col gap-5 lg:gap-3">
        <div className="notification-sidebar h-[100%] lg:h-auto">
          <NotificationSidebar
            setCurrentbutton={setCurrentbutton}
            currentButton={currentbutton}
          />
        </div>
        <div className="notification-main basis-[80%] h-[100%]">
          <NotificationCard currentCategory={currentCategory} />
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
