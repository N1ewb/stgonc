import React from "react";
import { Link, Outlet } from "react-router-dom";

const StudentCounselingServices = () => {
  // {
  //   name: "Referal",
  //   link: "/private/Guidance/student-counseling-services/Referal",
  // },
  // {
  //   name: "Walkin",
  //   link: "/private/Guidance/student-counseling-services/Walkin",
  // },
  return (
    <div className="w-full h-full flex flex-col gap-5">
      <div className="scs-header flex flex-row items-center justify-between w-full">
        <h1 className=""><span className="font-light">Student </span>Counseling Services</h1>{" "}
        <div className="flex flex-row items-center gap-5 justify-end [&_a]:bg-[#320000] [&_a]:text-white [&_a]:decoration-transparent [&_a]:m-0 [&_a]:px-10 [&_a]:py-3 [&_a]:rounded-md">
          <Link to='/private/Guidance/student-counseling-services/Dashboard'>SCS Dashboard</Link>
          <Link to='/private/Guidance/student-counseling-services/Referal'>Referals</Link>
          <Link to='/private/Guidance/student-counseling-services/Walkin'>Walk-ins</Link>
        </div>
      </div>
      <div className="scs-content h-[90%] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentCounselingServices;
