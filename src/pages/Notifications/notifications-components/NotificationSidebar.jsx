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
    <div className=" h-[100%] lg:h-auto border-r-[1px] border-solid border-[#0000003a] pr-16">
      <div className="sidebar-header mb-20 lg:mb-5">
        <p className="text-4xl font-medium text-[#320000]">
          <span className="text-sm  ">Welcome to the</span>
          <br></br>Notifications Page
        </p>
      </div>
      <div className="w-full">
        <p className="text-[#320000] text-lg">Categories</p>
        <div className="hidden lg:flex lg:w-full lg:text-white lg:text-center  gap-3 flex-wrap justify-center items-center  ">
          <div className="w-full flex gap-1  flex-wrap">
            {buttons.map((button, index) => (
              <div
                key={index}
                className="button-container w-[8rem] flex flex-row justify-start gap-1 items-center cursor-pointer"
              >
                <p
                  className={`lg:text-[10px] lg:py-1 px-3 py-1 rounded-md mb-2`}
                  style={{ backgroundColor: button.color }}
                >
                  {button.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar-categories flex flex-col lg:flex-row items-center lg:justify-center [&_button]:w-[11rem] lg:[&_button]:w-[8rem] [&_button]:py-2 [&_button]:px-3 [&_button]:rounded-3xl gap-3">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="button-container flex flex-row w-full justify-start gap-3 items-center cursor-pointer"
              onClick={() => setCurrentbutton(button.link)}
            >
              <div
                className={`button-color h-[2.5rem] w-[2.5rem] rounded-full lg:h-[1.5rem] lg:w-[1.5rem]`}
                style={{ backgroundColor: button.color }}
              ></div>
              <button
                className={`lg:text-[11px] lg:py-1 lg:hidden`}
                style={{ backgroundColor: button.color }}
              >
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
