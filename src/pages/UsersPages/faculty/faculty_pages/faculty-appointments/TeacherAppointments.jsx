import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavLink from "../../../../../components/buttons/NavLinks";

const TeacherAppointments = () => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    navigate(`/private/Faculty/appointments/list`);
  }, []);

  return (
    <div className="w-full h-full">
        
      <header className="flex justify-between">
      <h1 className="font-light">Appointment</h1>
        <div className="nav-links flex flex-row items-center gap-5  bg-[#320000] px-10 py-3 rounded-3xl w-[70%]">
          <NavLink
            to="/private/Faculty/appointments/list"
            location={location}
            label="Upcoming"
          />
          <NavLink
            to="/private/Faculty/appointments/followup"
            location={location}
            label="Followup"
          />
          <NavLink
            to="/private/Faculty/appointments/requests"
            location={location}
            label="Requests"
          />
          <NavLink
            to="/private/Faculty/appointments/archive"
            location={location}
            label="Archive"
          />
          {/* <div className="search-bar w-1/4"><AdminSearchBar /></div> */}
        </div>
      </header>
      <main className="w-full h-full">
        {" "}
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherAppointments;
