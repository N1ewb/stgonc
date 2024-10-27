import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminWalkinLayout = () => {
  const location = useLocation(); 
  return (
    <div className="h-full w-full bg-white">
      <header className="flex justify-between items-center pb-3">
        <h1 className="text-2xl font-semibold text-[#320000]">Walk-ins</h1>
        <div className="w-[80%] flex justify-between items-center bg-[#320000] px-10 py-3 rounded-2xl">
          <NavLink 
            to="/private/Admin/dashboard/walkins" 
            location={location} 
            label="All Walk-ins" 
          />
          <NavLink 
            to="/private/Admin/dashboard/walkins/data-form" 
            location={location} 
            label="Enter Walk-in Data" 
          />
          <NavLink 
            to="/private/Admin/dashboard/walkins/schedule-form" 
            location={location} 
            label="Schedule Walk-in" 
          />
          <NavLink 
            to="/private/Admin/dashboard/walkins/pending-walkin-appointments" 
            location={location} 
            label="Pending Appts" 
          />
        </div>
      </header>

      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

const NavLink = ({ to, location, label }) => (
  <Link
    to={to}
    className={`text-base border-2 border-white rounded-2xl font-medium px-2 w-[23%] text-[12px] py-2 text-center  transition-all duration-200 decoration-transparent
      ${
        location.pathname === to
          ? " text-[#320000] bg-white "
          : "hover:text-white text-white"
      }`}
  >
    {label}
  </Link>
);

export default AdminWalkinLayout;
