import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";
import { GuidanceSidebarLinks } from "../../lib/global";
import MobileNavigationBar from "../../components/mobileNavigation/MobileNavigationBar";
import { useMediaQuery } from "react-responsive";

const GuidanceCounselorLayout = () => {
  const [activeLink, setActiveLink] = useState("Dashboard");
  const isMobile = useMediaQuery({ maxWidth: 1023 });
  return (
    <div className="guidance-dashboard-container bg-[#360000] w-full h-full flex flex-row items-center justify-center">
      <div className="guidance-sidebar-container w-[17%] h-[90%] flex flex-row items-center justify-center pt-8  lg:w-0">
        <Sidebar SidebarLinks={GuidanceSidebarLinks} />
      </div>
      <main className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="outlet-Content bg-white w-full h-[85vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
          <Outlet />
        </div>
      </main>
      {isMobile && (
        <div className="mobile-navigation absolute w-full bottom-0 flex justify-center items-center ">
          <MobileNavigationBar
            Links={GuidanceSidebarLinks}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      )}
    </div>
  );
};

export default GuidanceCounselorLayout;
