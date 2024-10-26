import React from "react";
import { Link, Outlet } from "react-router-dom";

const GuidanceAppointmentDashboard = () => {
  return (
    <div className="w-full h-full">
      <header className="flex flex-row justify-between w-full">
        <h1 className="font-light">
          Appointment 
        </h1>
        <div className="links flex flex-row items-center gap-5 [&_a]:px-5 [&_a]:py-2 [&_a]:bg-[#320000] [&_a]:decoration-transparent  [&_a]:text-white [&_a]:rounded-md [&_a]:capitalize ">
            <Link className="m-0 hover:bg-[#720000]" to={`/private/Guidance/appointments/list`}><span>Upcoming Appointments</span></Link>
            <Link className="m-0 hover:bg-[#720000]" to={'/private/Guidance/appointments/request'}><span>Appointment Requests</span></Link>
        </div>
      </header>
      <main className="w-full h-[90%]">
        <Outlet />
      </main>
    </div>
  );
};

export default GuidanceAppointmentDashboard;
