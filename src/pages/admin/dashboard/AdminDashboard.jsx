import React, { useState } from "react";

import "./AdminDashboard.css";
import AdminGraphs from "../admin_pages/admin_graphs/admin_graphs";
import AdmingPendingRegPage from "../admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminAppointmentPage from "../admin_pages/admin_appointments/adming_appointments";
import AdminSchedulesPage from "../admin_pages/admin_schedules/admin_schedules";
import AdminRegisteruserPage from "../admin_pages/adming_register_user/admin_reg_user";

const AdminDashboard = () => {
  const [currentPage, setCurrentPage] = useState("Graphs");

  const handleSetCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  };

  return (
    <div className="Admin-Dashboard-Container">
      <div className="Admin-Sidebar-Container">
        <div className="Sidebar-Links">
          <button onClick={() => handleSetCurrentPage("Graphs")}>Graphs</button>
          <button onClick={() => handleSetCurrentPage("PendingReg")}>
            Pending Registrations
          </button>
          <button onClick={() => handleSetCurrentPage("Appointments")}>
            Appointments
          </button>
          <button onClick={() => handleSetCurrentPage("Schedules")}>
            Schedules
          </button>
          <button onClick={() => handleSetCurrentPage("RegisterUser")}>
            Register User
          </button>
        </div>
      </div>

      <div className="Main-Content">
        <p>AdminDashboard</p>
        {currentPage === "Graphs" ? (
          <AdminGraphs />
        ) : currentPage === "PendingReg" ? (
          <AdmingPendingRegPage />
        ) : currentPage === "Appointments" ? (
          <AdminAppointmentPage />
        ) : currentPage === "Schedules" ? (
          <AdminSchedulesPage />
        ) : currentPage === "RegiserUser" ? (
          <AdminRegisteruserPage />
        ) : (
          <AdminGraphs />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
