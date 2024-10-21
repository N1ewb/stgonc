import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

const AdminWalkinLayout = () => {
  const location = useLocation(); // Track active link

  return (
    <div className="h-full w-full bg-white">
      <header className="flex justify-between items-center ">
        <h1 className="text-2xl font-semibold text-[#320000]">Walk-ins</h1>
        <div className="flex gap-6">
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
            label="Schedule Walk-in Data" 
          />
          <NavLink 
            to="/private/Admin/dashboard/walkins/pending-walkin-appointments" 
            location={location} 
            label="Pending Appointments" 
          />
        </div>
      </header>

      <main className="flex justify-center items-center w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

// Reusable NavLink component with clean, minimal styling
const NavLink = ({ to, location, label }) => (
  <Link
    to={to}
    className={`text-[#320000] text-base font-medium transition-all duration-200 decoration-transparent
      ${
        location.pathname === to
          ? "border-b-2 border-[#720000] text-[#720000] "
          : "hover:text-[#720000]"
      }`}
  >
    {label}
  </Link>
);

export default AdminWalkinLayout;
