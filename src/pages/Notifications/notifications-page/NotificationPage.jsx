import React, { useEffect, useState } from "react";
import { useMessage } from "../../../context/notification/NotificationContext";
import { useAuth } from "../../../context/auth/AuthContext";
import NotificationCard from "../notifications-components/NotificationCard";
import NotificationSidebar from "../notifications-components/NotificationSidebar";

const NotificationPage = () => {
  const notif = useMessage();
  const auth = useAuth()
  const [notificationList, setNotificationList] = useState()


    useEffect(() => {
        const getNotification = async () => {
            try{
                const unsubscribe = notif.subscribeToUserNotifications(auth.currentUser.email, (newnotifications) => (
                    setNotificationList(newnotifications)
                ))
                return () => unsubscribe()
            }catch(error){
                console.log(`error in retreving notifications: ${error.message}`)
            }
        }
        getNotification()
    },[notif])
    
  return (
    <div className="">
      
      <div className="notification-body flex flex-row gap-5">
        <div className="notification-sidebar">
          <NotificationSidebar />
        </div>
        <div className="notification-main">
            <div className="div">
                {notificationList && notificationList.length !== 0 ? notificationList.map((notification) => <NotificationCard notification={notification} />) : "No notifications"}
            </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
