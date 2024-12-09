import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import Sidebar from "../../components/sidebar/Sidebar";
import MobileNavigationBar from "../../components/mobileNavigation/MobileNavigationBar";
import { StudentSidebarLinks } from "../../lib/global";

const StudentLayout = () => {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  return (
    <div className="student-dashboard-container relative flex flex-row justify-center items-center lg:items-start  bg-[#360000] h-full w-full [&_p]:m-0">
      
        <div className="student-sidebar w-[17%] h-screen flex flex-row items-center justify-center mt-6 lg:w-0 overflow-hidden">
          {!isMobile && (
          <Sidebar SidebarLinks={StudentSidebarLinks} />
        )}
        </div>
      <main className="student-main-content flex flex-col pt-3 h-[85vh] lg:h-[75vh]  lg:w-full bg-white w-[83%] mt-[83px] lg:mt-[120px] xsm:h-screen xsm:mt-[80px] p-[50px] md:px-[20px] rounded-tl-[70px] rounded-bl-[70px] lg:rounded-bl-[0px] lg:rounded-tl-[0px] overflow-hidden">
        <Outlet />
      </main>
      {/* {isMobile && (
        <div className="mobile-navigation absolute w-full bottom-[2.5%] flex justify-center items-center ">
          <MobileNavigationBar
            Links={StudentSidebarLinks}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      )} */}
    </div>
  );
};

export default StudentLayout;
