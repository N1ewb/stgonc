import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavLink from "../../../../../components/buttons/NavLinks";

const AdminWalkinLayout = () => {
  const location = useLocation(); 
  return (
    <div className="h-full w-full bg-white">
      <header className="flex justify-between items-center pb-3">
        <h1 className="text-2xl font-semibold text-[#320000]">Walk-ins</h1>
        <div className="w-[80%] flex justify-between items-center bg-[#320000] px-10 py-3 rounded-2xl gap-4">
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



export default AdminWalkinLayout;
