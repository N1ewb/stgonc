import React from "react";
import { Outlet } from "react-router-dom";
import Profile from "../../components/userProfile/Profile";
import Sidebar from "../../components/sidebar/Sidebar";

const StudentLayout = () => {

  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "/private/Student/dashboard",
    },
    {
      name: "Appointment List",
      link: "/private/Student/dashboard/appointments",
    },
    {
      name: 'Pending Appointments',
      link: "/private/Student/dashboard/pending-appointments"
    },
    {
      name: 'Appointments Archive',
      link: "/private/Student/dashboard/appointments-archive"
    }
  ]

  return (
    <div className="student-dashboard-container flex flex-row bg-[#360000] h-screen w-full [&_p]:m-0">
      <div className="student-sidebar w-[17%] h-screen flex flex-row items-center justify-center lg:w-0">
        <Sidebar SidebarLinks={SidebarLinks} />
      </div>
      <main className="student-main-content flex flex-col bg-white w-[83%] max-h-[90vh] h-[90vh] mt-[83px] p-[50px] rounded-tl-[70px] rounded-bl-[70px] lg:rounded-bl-[0px] lg:rounded-tl-[0px]">
        <div className="spacer"></div>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
