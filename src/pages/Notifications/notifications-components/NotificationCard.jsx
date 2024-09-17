import React, { useEffect, useState } from "react";
import DefaultProfile from "../../../static/images/default-profile.png";
import ClockIcon from '../../../static/images/clock-icon.png'

const NotificationCard = ({ currentCategory }) => {
  const [currentColor, setCurrentColor] = useState('#000')

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
    const foundCategory = categoryColor.find((category) => category.category === notificationSubject)
    if(foundCategory){
      return foundCategory.color
    } else {
      return '#fff'
    }
  }

  return (
    <div className="div flex flex-col gap-5">
      {currentCategory && currentCategory.length !== 0
        ? currentCategory.map((notification) => (
            <div className="flex flex-row w-full justify-between">
              <div className="flex flex-row gap-5">
              <div className="image-wrapper bg-[#720000] p-1 rounded-full h-[110px]">
                <img
                  src={DefaultProfile}
                  alt="picture"
                  className="w-[100px] h-[100px] rounded-full object-cover"
                />
              </div>
              <div className="notification-card-content flex flex-col items-start gap-3 [&_p]:m-0">
                <p className=" text-white py-2 px-10 rounded-3xl" style={{backgroundColor: findColor(notification.subject)}}>
                  New {notification.subject}
                </p>
                <p>{notification.content}</p>
                <div className="notification-buttons flex flex-row gap-4">
                  <button className="bg-transparent p-0 text-[#2fa74f]">
                    Mark as Read
                  </button>
                  <button className="bg-transparent p-0 text-[#ae2828]">
                    Delete
                  </button>
                </div>
              </div>
              </div>
              <div className="flex flex-row items-center [&_p]:m-0 [&_p]:text-[#BDBDBD] [&_p]:text-sm gap-2">
                <img src={ClockIcon} alt="clock" />
                <p>{formatDate(notification.createdAt?.toDate())}</p>
              </div>
            </div>
          ))
        : "No notifications"}
    </div>
  );
};

export default NotificationCard;
