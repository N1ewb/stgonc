import React from "react";
import { Link, Outlet } from "react-router-dom";

const AdminWalkinLayout = () => {
  return (
    <div className="h-[100%] w-full">
      <header className="flex flex-row w-full justify-between px-10">
        <h1>Walk-ins</h1>
        <div className="links [&_a]:margin-0 items-center flex flex-row justify-end gap-5">
          <Link to={"/private/Admin/dashboard/walkins"}>All Walk-ins</Link>
          <Link to={"/private/Admin/dashboard/walkins/data-form"}>
            Enter Walk-in Data
          </Link>
          <Link to={"/private/Admin/dashboard/walkins/schedule-form"}>
            Schedule Walk-in Data
          </Link>
          <Link
            to={"/private/Admin/dashboard/walkins/pending-walkin-appointments"}
          >
            Walkin Pending Appointment
          </Link>
        </div>
      </header>
      <main className="w-full h-[100%] flex justify-center items-center">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminWalkinLayout;
