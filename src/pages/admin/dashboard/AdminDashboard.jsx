import React, { useEffect, useState } from "react";

import AdminGraphs from "../admin_pages/admin_graphs/admin_graphs";
import AdmingPendingRegPage from "../admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminAppointmentPage from "../admin_pages/admin_appointments/admin_appointments";
import AdminSchedulesPage from "../admin_pages/admin_schedules/admin_schedules";
import AdminRegisteruserPage from "../admin_pages/adming_register_user/admin_reg_user";

import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";

import Sidebar from "../../../components/sidebar/Sidebar";
import Profile from "../../../components/userProfile/Profile";
import AdminUserList from "../admin_pages/admin_userlist/adminUserList";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const db = useDB();
  const auth = useAuth();

  const [appointments, setAppointments] = useState();
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "Dashboard",
    },
    {
      name: "Pending Regs",
      link: "PendingReg",
    },
    {
      name: "Appointments",
      link: "Appointments",
    },
    {
      name: "Schedules",
      link: "Schedules",
    },
    {
      name: "Register User",
      link: "RegisterUser",
    },
    {
      name: "User List",
      link: "Userlist",
    },
  ];

  const handleSetCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleGetAppointments = async (email) => {
    const appointment = await db.getAppointmentRequests(email);
    setAppointments(appointment);
    console.log("setted", appointments);
  };

  useEffect(() => {
    if (appointments === undefined) {
      handleGetAppointments(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges((callback) => {
            setAppointments(callback);
          });
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [db]);

  return (
    <div className="Admin-Dashboard-Container">
      <div className="Admin-Sidebar-Container">
        <Profile />
        <Sidebar
          handleSetCurrentPage={handleSetCurrentPage}
          SidebarLinks={SidebarLinks}
        />
      </div>

      <div className="Main-Content">
        <p style={{ color: "#360000", fontSize: "30px" }}>
          <b>Welcome</b> {auth.currentUser && auth.currentUser.displayName}!
        </p>
        {currentPage === "Dashboard" ? (
          <AdminGraphs appointments={appointments} />
        ) : currentPage === "PendingReg" ? (
          <AdmingPendingRegPage db={db} auth={auth} />
        ) : currentPage === "Appointments" ? (
          <AdminAppointmentPage
            appointments={appointments}
            auth={auth}
            db={db}
          />
        ) : currentPage === "Schedules" ? (
          <AdminSchedulesPage />
        ) : currentPage === "RegisterUser" ? (
          <AdminRegisteruserPage />
        ) : currentPage === "Userlist" ? (
          <AdminUserList db={db} auth={auth} />
        ) : (
          <AdminGraphs />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
