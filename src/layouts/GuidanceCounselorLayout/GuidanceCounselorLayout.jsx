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
        {!isMobile && <Sidebar SidebarLinks={GuidanceSidebarLinks} />}
      </div>
      <main className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around overflow-hidden">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="outlet-Content flex flex-col pt-3 h-[85vh] lg:h-[75vh]  lg:w-full bg-white w-[83%] mt-[83px] lg:mt-[120px] xsm:h-screen xsm:mt-[80px] p-[50px] md:px-[20px] rounded-tl-[70px] rounded-bl-[70px] lg:rounded-bl-[0px] lg:rounded-tl-[0px] overflow-hidden">
          <Outlet />
        </div>
      </main>
      {/* {isMobile && (
        <div className="mobile-navigation absolute w-full bottom-0 flex justify-center items-center ">
          <MobileNavigationBar
            Links={GuidanceSidebarLinks}
            activeLink={activeLink}
            setActiveLink={setActiveLink}
          />
        </div>
      )} */}
    </div>
  );
};

export default GuidanceCounselorLayout;
