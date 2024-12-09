import React from "react";
import DefaultProfile from "../../../static/images/default-profile.png";
import ClockIcon from "../../../static/images/clock-icon.png";
import { useMessage } from "../../../context/notification/NotificationContext";

const NotificationCard = ({ currentCategory }) => {
  const notif = useMessage();

  const categoryColor = [
    {
      category: "Message",
      color: "#FBBB46",
    },
    {
      category: "Schedule",
      color: "#126412",
    },
    {
      category: "Appointment",
      color: "#4649FB",
    },
    {
      category: "Registration",
      color: "#181967",
    },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const findColor = (notificationSubject) => {
    const firstWord = notificationSubject.split(" ")[0];
    const foundCategory = categoryColor.find(
      (category) => category.category === firstWord
    );
    if (foundCategory) {
      return foundCategory.color;
    } else {
      return "#fff";
    }
  };

  const handleMarkNotifRead = async (id) => {
    try {
      await notif.MarkNotifRead(id);
    } catch (error) {
      console.log(`Error in: ${error.message}`);
    }
  };
  const handleDeleteNotifRead = async (id) => {
    try {
      await notif.DeleteNotif(id);
    } catch (error) {
      console.log(`Error in: ${error.message}`);
    }
  };

  return (
    <div className="div flex flex-col gap-5 max-h-[100%] lg:max-h-[80%] overflow-auto">
      {currentCategory && currentCategory.length !== 0
        ? currentCategory.map((notification) => (
            <div key={notification.id} className="flex flex-row w-full justify-between">
              <div className="flex flex-row gap-2">
                <div className="image-wrapper h-fit w-fit flex-grow-0 p-1 rounded-full flex justify-center items-center">
                  <img
                    src={DefaultProfile}
                    alt="picture"
                    className="w-[80px] h-[80px] xsm:min-w-[24px] xsm:min-h-[24px] rounded-full object-cover bg-[#720000] lg:w-[50px] lg:h-[50px]"
                  />
                </div>
                <div className="notification-card-content flex-1 flex flex-col items-start gap-3 [&_p]:m-0">
                  <div className="flex flex-row gap-3 items-center [&_p]:m-0 flex-1">
                    <p
                      className=" text-white py-2 px-10 rounded-3xl lg:text-[10px] lg:py-1 lg:px-5 xsm:py-[2px] xsm:px-4 xsm:text-[8px] m-0"
                      style={{
                        backgroundColor: findColor(notification.subject),
                      }}
                    >
                      New {notification.subject.split(" ")[0]}{" "}
                    </p>
                    <p className="py-1 px-2 rounded-xl bg-[#1f91a0] text-white m-0">
                      {notification.subject.split(" ")[1]}
                    </p>
                  </div>
                  <p className="lg:text-[12px] xsm:text-[10px] m-0">{notification.content}</p>
                  <div className="notification-buttons flex flex-row gap-4">
                    <button
                      className="bg-transparent p-0 text-[#2fa74f] lg:text-[10px] xsm:text-[8px]"
                      onClick={() => handleMarkNotifRead(notification.id)}
                    >
                      Mark as Read
                    </button>
                    <button
                      className="bg-transparent p-0 text-[#ae2828] lg:text-[10px] xsm:text-[8px]"
                      onClick={() => handleDeleteNotifRead(notification.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center [&_p]:m-0 [&_p]:text-[#BDBDBD] [&_p]:text-sm gap-2 lg:[&_p]:text-[8px]">
                <img src={ClockIcon} alt="clock" className="xsm:w-[10px] xsm:h-[10px]" />
                <p>{formatDate(notification.createdAt?.toDate())}</p>
              </div>
            </div>
          ))
        : "No notifications"}
    </div>
  );
};

export default NotificationCard;
