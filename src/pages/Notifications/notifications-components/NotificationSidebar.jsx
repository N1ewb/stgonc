import React, { useState } from "react";
import CheckBlack from "../../../static/images/check-black.png";

const NotificationSidebar = ({ setCurrentbutton, currentButton }) => {
  const buttons = [
    {
      name: "All",
      link: "All",
      color: "#8E02D4",
    },
    {
      name: "Message",
      link: "Message",
      color: "#FBBB46",
    },
    {
      name: "Schedule",
      link: "Schedule",
      color: "#126412",
    },
    {
      name: "Appointment",
      link: "Appointment",
      color: "#4649FB",
    },
    {
      name: "Registration",
      link: "Registration",
      color: "#181967",
    },
  ];

  return (
    <div className=" h-[100%] lg:h-auto border-r-[1px] lg:border-r-[0px] border-solid border-[#0000003a] pr-16 xsm:pr-0">
      <div className="sidebar-header mb-20 lg:mb-2">
        <p className="text-3xl xsm:text-[16px] xxsm:text-[14px] font-medium text-[#320000]">
          Your Notifications
        </p>
      </div>
      <div className="w-full">
        <p className="text-[#320000] text-lg lg:hidden">Categories</p>
        <div className="hidden lg:flex lg:w-full lg:text-white lg:text-center gap-3 flex-wrap justify-center items-center  ">
          <div className="w-full flex flex-1 gap-1 justify-between">
            {buttons.map((button, index) => (
              <div
                key={index}
                className="button-container w-[8rem] xsm:w-auto flex flex-row justify-start gap-1 items-center cursor-pointer "
              >
                <p
                  className={`lg:text-[10px] xsm:text-[6px] lg:py-1 px-3 py-1 rounded-md mb-2`}
                  style={{ backgroundColor: button.color }}
                >
                  {button.name}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="sidebar-categories xsm:w-full flex flex-col lg:flex-row items-center lg:justify-between [&_button]:w-[11rem] lg:[&_button]:w-auto [&_button]:py-2 [&_button]:px-3 [&_button]:rounded-3xl gap-3">
          {buttons.map((button, index) => (
            <div
              key={index}
              className="button-container flex flex-row w-full justify-start gap-2 xsm:gap-1 items-center cursor-pointer"
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
                  <img src={CheckBlack} alt="highlight" className="m-0 p-0" />
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
