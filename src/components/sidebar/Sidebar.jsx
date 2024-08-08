import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ SidebarLinks, handleSetCurrentPage }) => {
  const [activeLink, setActiveLink] = useState("Dashboard");

  const handleLinkClick = (link) => {
    setActiveLink(link);
    handleSetCurrentPage(link);
  };

  return (
    <div className="Sidebar-container">
      <div className="Sidebar-Links">
        {SidebarLinks.map((SidebarLink, index) => (
          <p
            onClick={() => handleLinkClick(SidebarLink.link)}
            key={index}
            className={activeLink === SidebarLink.link ? "active" : ""}
          >
            {SidebarLink.name}
          </p>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
