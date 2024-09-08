import React from "react";
import { Outlet } from "react-router-dom";
import Profile from "../../components/userProfile/Profile";

const StudentLayout = () => {
  return (
    <div className="student-dashboard-container flex flex-row bg-[#360000] h-screen w-full [&_p]:m-0">
      <div className="student-sidebar h-[100%] flex flex-col mt-[100px] gap-[40px] items-center w-[17%]">
        <Profile />
      </div>
      <main className="student-main-content flex flex-col bg-white w-[83%] max-h-[90vh] h-[90vh] mt-[83px] p-[50px] rounded-tl-[70px] rounded-bl-[70px] lg:rounded-bl-[0px] lg:rounded-tl-[0px]">
        <div className="spacer"></div>
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
