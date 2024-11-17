import React from "react";
import {  Outlet, useLocation } from "react-router-dom";
import NavLink from "../../../../../components/buttons/NavLinks";

const StudentCounselingServices = () => {
  const location = useLocation();
  return (
    <div className="w-full h-full flex flex-col gap-2">
      <div className="scs-header flex flex-row items-center justify-between w-full">
        <h1 className="">
          <span className="font-light">Student </span>Counseling Services
        </h1>{" "}
        <div className="flex flex-row items-center gap-5 justify-end bg-[#320000] px-10 py-3 rounded-3xl w-1/2">
          <NavLink
            to="/private/Guidance/student-counseling-services"
            location={location}
            label="SCS Dashboard"
          />
          <NavLink
            to="/private/Guidance/student-counseling-services/Referal"
            location={location}
            label="Referrals"
          />
          <NavLink
            to="/private/Guidance/student-counseling-services/Walkin"
            location={location}
            label="Walk-ins"
          />
        </div>
      </div>
      <div className="scs-content h-[90%] w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default StudentCounselingServices;
