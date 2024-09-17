import React, { useState } from "react";

const NotificationSidebar = () => {
    const [currentbutton, setCurrentbutton] = useState('All')

  const buttons = [
    {
        name: "All Notifications",
        link: "All",
        color: "#"
    },
    {
        name: "New Message",
        link: "Message",
        color: "#FBBB46"
    },
    {
        name: "New Schedule",
        link: "Schedule",
        color: "#126412"
    },
    {
        name: "New Appointment",
        link: "Appointment",
        color: "#4649FB"
    },
    {
        name: "New Registration",
        link: "Registration",
        color: "#181967"
    },
  ]  

  return (
    <div>
      <div className="sidebar-header flex flex-col gap-5">
        <p className="text-4xl font-medium text-[#720000]">
          <span className="text-sm  ">Welcome to the</span>
          <br></br>Notifications Page
        </p>
      </div>
      <div className="sidebar-categories flex flex-col items-center [&_button]:w-[11rem] [&_button]:py-2 [&_button]:px-3 [&_button]:rounded-3xl gap-3">
        {buttons.map((button) => <button className={`bg-[${button.color}]`} onClick={() => setCurrentbutton(button.link)}>{button.name}</button>)}
      </div>
    </div>
  );
};

export default NotificationSidebar;
