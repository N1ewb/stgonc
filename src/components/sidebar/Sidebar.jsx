import React, { useState } from "react";
import "./Sidebar.css";
import Profile from "../userProfile/Profile";

const Sidebar = ({ SidebarLinks, handleSetCurrentPage }) => {
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleLinkClick = (link) => {
    setActiveLink(link);
    handleSetCurrentPage(link);
  };

  return (
    <div className="Sidebar-container h-screen w-full flex flex-col justify-center items-center">
      <div className="Sidebar-Links h-[80%] w-full flex flex-col gap-4 pl-10 1xl:pl-5 ">
        <Profile />
        {SidebarLinks.map((SidebarLink, index) => (
          <p
            onClick={() => handleLinkClick(SidebarLink.link)}
            key={index}
            className={`m-0 text-[#ffffffbb] text-2xl font-medium text-left cursor-pointer ${
              activeLink === SidebarLink.link ? "text-white" : ""
            }`}
          >
            {SidebarLink.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
