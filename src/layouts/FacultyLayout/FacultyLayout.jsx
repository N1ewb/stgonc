import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

const FacultyLayout = () => {
  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "/private/Faculty/dashboard",
    },
    {
      name: "Appointments",
      link: "/private/Faculty/appointments",
    },
    
    {
      name: "Schedules",
      link: "/private/Faculty/schedules",
    },
  ];

  return (
    <div className="teacher-dashboard-container bg-[#360000] w-full h-screen flex flex-row items-center justify-center">
      <div className="teacher-sidebar-container w-[17%] h-screen flex flex-row items-center justify-center mt-5 lg:w-0">
        <Sidebar SidebarLinks={SidebarLinks} />
      </div>
      <main className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="outlet-Content bg-white w-full h-[85vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default FacultyLayout;
