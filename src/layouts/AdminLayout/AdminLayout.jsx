import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar/Sidebar";

const AdminLayout = () => {
  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "/private/Admin/dashboard",
    },
    {
      name: "Walkins",
      link: "/private/Admin/dashboard/walkins",
    },
    {
      name: "Pending Regs",
      link: "/private/Admin/dashboard/pending-registrations",
    },
    {
      name: "Appointments ",
      link: "/private/Admin/dashboard/appointments",
    },
    {
      name: "Schedules",
      link: "/private/Admin/dashboard/schedules",
    },
    {
      name: "Register User",
      link: "/private/Admin/dashboard/register-user",
    },
    {
      name: "User List",
      link: "/private/Admin/dashboard/user-list",
    },
  ];

  return (
    <div className="Admin-Dashboard-Container bg-[#360000] w-full h-screen flex flex-row items-center justify-center">
      <div className="Admin-Sidebar-Container w-[17%] h-full overflow-auto flex flex-col py-10 items-center justify-center mt-3 lg:w-0">
        <Sidebar SidebarLinks={SidebarLinks} />
      </div>

      <main className="group-with-spacer h-full w-[83%] lg:w-full flex flex-col justify-around">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="Main-Content bg-white w-full h-[85vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
