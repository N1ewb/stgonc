import React from "react";
import { Outlet } from "react-router-dom";

const StudentCounselingServices = () => {
  return (
    <div className="w-full h-[100%] flex flex-col gap-5">
      <div className="scs-header">Student Counseling Services</div>
      <div className="scs-content">
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentCounselingServices;
