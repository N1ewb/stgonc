import React, { useEffect, useState } from "react";

import AdminGraphs from "../admin_pages/admin_graphs/admin_graphs";
import AdmingPendingRegPage from "../admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminAppointmentPage from "../admin_pages/admin_appointments/admin_appointments";
import AdminSchedulesPage from "../admin_pages/admin_schedules/admin_schedules";
import AdminRegisteruserPage from "../admin_pages/adming_register_user/admin_reg_user";

import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";

import Sidebar from "../../../components/sidebar/Sidebar";
import AdminUserList from "../admin_pages/admin_userlist/adminUserList";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const db = useDB();
  const auth = useAuth();

  const [appointments, setAppointments] = useState();
  const [teachersList, setTeachersList] = useState();
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
    console.log("Setted", appointments);
  };

  useEffect(() => {
    if (appointments === undefined) {
      handleGetAppointments(auth.currentUser.email);
    }
  }, []);

  useEffect(() => {
    const handleGetTechears = async () => {
      const teachers = await db.getTeachers();
      setTeachersList(teachers);
    };
    handleGetTechears();
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
    <div className="Admin-Dashboard-Container bg-[#360000] w-full h-screen flex flex-row items-center justify-center">
      <div className="Admin-Sidebar-Container w-[17%] h-screen flex flex-row items-center justify-center lg:w-0">
        <Sidebar
          handleSetCurrentPage={handleSetCurrentPage}
          SidebarLinks={SidebarLinks}
        />
      </div>
      <div className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="Main-Content bg-white w-full h-[90vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
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
            <AdminSchedulesPage teachersList={teachersList} db={db} />
          ) : currentPage === "RegisterUser" ? (
            <AdminRegisteruserPage />
          ) : currentPage === "Userlist" ? (
            <AdminUserList db={db} auth={auth} />
          ) : (
            <AdminGraphs />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
