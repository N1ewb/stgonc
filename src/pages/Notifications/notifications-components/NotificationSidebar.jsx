import React, { useState } from "react";
import CheckBlack from "../../../static/images/check-black.png";

const NotificationSidebar = ({ setCurrentbutton, currentButton }) => {
  const buttons = [
    {
      name: "All Notifications",
      link: "All",
      color: "#8E02D4",
    },
    {
      name: "New Message",
      link: "Message",
      color: "#FBBB46",
    },
    {
      name: "New Schedule",
      link: "Schedule",
      color: "#126412",
    },
    {
      name: "New Appointment",
      link: "Appointment",
      color: "#4649FB",
    },
    {
      name: "New Registration",
      link: "Registration",
      color: "#181967",
    },
  ];

  return (
    <div className=" h-[100%] border-r-[1px] border-solid border-[#0000003a] pr-16">
      <div className="sidebar-header mb-20">
        <p className="text-4xl font-medium text-[#320000]">
          <span className="text-sm  ">Welcome to the</span>
          <br></br>Notifications Page
        </p>
      </div>
      <div className="div">
        <p className="text-[#320000] text-lg">Categories</p>
        <div className="sidebar-categories flex flex-col items-center [&_button]:w-[11rem] [&_button]:py-2 [&_button]:px-3 [&_button]:rounded-3xl gap-3">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="button-container flex flex-row w-full justify-around items-center cursor-pointer"
              onClick={() => setCurrentbutton(button.link)}
            >
              <div
                className={`button-color h-[2.5rem] w-[2.5rem] rounded-full `}
                style={{ backgroundColor: button.color }}
              ></div>
              <button className={``} style={{ backgroundColor: button.color }}>
                {button.name}
              </button>
              <div className="current-button">
                {currentButton === button.link ? (
                  <img src={CheckBlack} alt="highlight" />
                ) : (
                  <div className="border-solid border-[#000] border-[1px] h-5 w-5 rounded-sm"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotificationSidebar;
