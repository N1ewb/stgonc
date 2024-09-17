import React from "react";

const NotificationCard = ({ notification }) => {
  return (
    <div className="flex flex-row gap-5">
      <div className="image-wrapper bg-[#c7c3c3] p-5 rounded-full"></div>
      <div className="notification-card-content flex flex-col items-start gap-2 [%_p]:m-0">
        <p className="bg-[#FBBB46] text-white py-2 px-10 rounded-3xl">New {notification.subject}</p>
        <p>{notification.content}</p>
        <div className="notification-buttons flex flex-row gap-4">
            <button className="bg-transparent p-0 text-[#2fa74f]">Mark as Read</button>
            <button className="bg-transparent p-0 text-[#ae2828]">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
