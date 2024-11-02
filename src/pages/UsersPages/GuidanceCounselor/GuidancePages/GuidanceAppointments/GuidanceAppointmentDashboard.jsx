import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavLink from "../../../../../components/buttons/NavLinks";

const GuidanceAppointmentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate()
  
  useEffect(() => {
    if (location.pathname === "/private/Guidance/appointments") {
      navigate("/private/Guidance/appointments/list");
    }
  }, [location, navigate]);

  return (
    <div className="w-full h-full">
      <header className="flex flex-row justify-between w-full">
        <h1 className="font-light">Appointment</h1>
        <div className="links flex flex-row items-center gap-5  bg-[#320000] px-10 py-3 rounded-3xl w-[70%]">
          <NavLink
            to="/private/Guidance/appointments/list"
            location={location}
            label="Upcoming"
          />
          <NavLink
            to="/private/Guidance/appointments/followup"
            location={location}
            label="Followups"
          />
          <NavLink
            to="/private/Guidance/appointments/request"
            location={location}
            label="Requests"
          />
          <NavLink
            to="/private/Guidance/appointments/archive"
            location={location}
            label="Archive"
          />
        </div>
      </header>
      <main className="w-full h-[90%]">
        <Outlet />
      </main>
    </div>
  );
};

export default GuidanceAppointmentDashboard;
