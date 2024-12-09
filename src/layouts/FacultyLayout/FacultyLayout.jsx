import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { FacultySidebarLinks } from "../../lib/global";
import MobileNavigationBar from "../../components/mobileNavigation/MobileNavigationBar";
import { useMediaQuery } from "react-responsive";

const FacultyLayout = () => {

  const [activeLink, setActiveLink] = useState("Dashboard");
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  return (
    <div className="teacher-dashboard-container bg-[#360000] w-full h-screen flex flex-row items-center justify-center">
      <div className="teacher-sidebar-container w-[17%] h-screen flex flex-row items-center justify-center mt-5 lg:w-0">
      {!isMobile && (
          <Sidebar SidebarLinks={FacultySidebarLinks} />
        )}
      </div>
      <main className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around overflow-hidden">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="outlet-Content bg-white w-full h-[85vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
          <Outlet />
        </div>
      </main>
      {/* {isMobile && (
        <div className="mobile-navigation absolute w-full bottom-0 flex justify-center items-center ">
          <MobileNavigationBar
            Links={FacultySidebarLinks}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      )} */}
    </div>
  );
};

export default FacultyLayout;
