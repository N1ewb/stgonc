import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

const GuidanceCounselorLayout = () => {
  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "/private/Guidance/dashboard",
    },
    {
      name: "Appointments",
      link: "/private/Guidance/appointments/list",
    },
    {
      name: "Schedules",
      link: "/private/Guidance/schedules",
    },
    {
      name: "Student Counseling Services",
      link: "/private/Guidance/student-counseling-services/Dashboard",
    },
    // {
    //   name: "Referal",
    //   link: "/private/Guidance/student-counseling-services/Referal",
    // },
    // {
    //   name: "Walkin",
    //   link: "/private/Guidance/student-counseling-services/Walkin",
    // },
  ]
  return (
    <div className="guidance-dashboard-container bg-[#360000] w-full h-full flex flex-row items-center justify-center">
      <div className="guidance-sidebar-container w-[17%] h-[90%] flex flex-row items-center justify-center pt-8  lg:w-0">
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

export default GuidanceCounselorLayout;
