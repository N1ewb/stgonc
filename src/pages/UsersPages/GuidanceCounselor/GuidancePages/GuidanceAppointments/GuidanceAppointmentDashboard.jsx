import React from "react";
import { Link, Outlet } from "react-router-dom";

const GuidanceAppointmentDashboard = () => {
  return (
    <div className="w-full">
      <header className="flex flex-row justify-between w-full">
        <h1 className="font-light">
          Appointment 
        </h1>
        <div className="links flex flex-row gap-5">
            <Link to={`/private/Guidance/appointments/list`}>Upcoming Appointments</Link>
            <Link to={'/private/Guidance/appointments/request'}>Appointment Requests</Link>
        </div>
      </header>
      <main className="w-full">
        <Outlet />
      </main>
    </div>
  );
};

export default GuidanceAppointmentDashboard;
