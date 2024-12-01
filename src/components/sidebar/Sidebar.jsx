import React, { useState } from "react";
import "./Sidebar.css";
import Profile from "../userProfile/Profile";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ SidebarLinks }) => {
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleLinkClick = (link) => {
    setActiveLink(link);
    navigate(link);
  };

  return (
    <div className="Sidebar-container h-screen w-full flex flex-col justify-center items-center z-10 bg-[#360000]">
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
