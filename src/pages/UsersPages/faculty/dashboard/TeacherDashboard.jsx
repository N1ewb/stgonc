import React, { useEffect, useState } from "react";
import "./TeacherDashboard.css";
import { useDB } from "../../../../context/db/DBContext";
import { useAuth } from "../../../../context/auth/AuthContext";
import Sidebar from "../../../../components/sidebar/Sidebar";
import TeacherGraphs from "../faculty_pages/faculty-graphs/TeacherGraphs";
import TeacherAppointmentListPage from "../faculty_pages/appointment-list-page/TeacherAppointmentListPage";
import TeacherAppointmentReqPage from "../faculty_pages/appointment-req-page/TeacherAppointmentReqPage";
import TeacherSchedulePage from "../faculty_pages/schedules-page/TeacherSchedulePage";

const TeacherDashboard = () => {
  const db = useDB();
  const auth = useAuth();

  const [appointments, setAppointments] = useState();
  const [acceptedAppointments, setAcceptedAppointments] = useState();
  const [requestedAppointments, setRequestedAppointments] = useState();
  const [currentPage, setCurrentPage] = useState("Dashboard");

  const SidebarLinks = [
    {
      name: "Dashboard",
      link: "Dashboard",
    },
    {
      name: "Appointment List",
      link: "AppoinmentList",
    },
    {
      name: "Appointment Requests",
      link: "AppointmentReq",
    },
    {
      name: "Schedules",
      link: "Schedules",
    },
  ];

  const handleSetCurrentPage = (pageName) => {
    setCurrentPage(pageName);
  };

  const handleGetAcceptedAppointment = (appointments) => {
    return appointments.filter(
      (appointment) => appointment.appointmentStatus === "Accepted"
    );
  };

  const handleGetRequestedAppointment = (appointments) => {
    return appointments.filter(
      (appointment) => appointment.appointmentStatus === "pending"
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToAppointmentChanges((callback) => {
            setAppointments(callback);
            setAcceptedAppointments(handleGetAcceptedAppointment(callback));
            setRequestedAppointments(handleGetRequestedAppointment(callback));
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
    <div className="teacher-dashboard-container bg-[#360000] w-full h-screen flex flex-row items-center justify-center">
      <div className="teacher-sidebar-container w-[17%] h-screen flex flex-row items-center justify-center lg:w-0">
        <Sidebar
          handleSetCurrentPage={handleSetCurrentPage}
          SidebarLinks={SidebarLinks}
        />
      </div>
      <div className="group-with-spacer h-[100vh] w-[83%] lg:w-full flex flex-col justify-around">
        <div className="spacer w-full h-[5vh]"></div>
        <div className="Main-Content bg-white w-full h-[90vh] rounded-tl-[70px] rounded-bl-[70px] p-[50px]  lg:rounded-bl-[0px] lg:rounded-tl-[0px] sm:p-4">
          {currentPage === "Dashboard" ? (
            <TeacherGraphs appointments={appointments} />
          ) : currentPage === "AppoinmentList" ? (
            <TeacherAppointmentListPage
              acceptedAppointments={acceptedAppointments}
              db={db}
              auth={auth}
            />
          ) : currentPage === "AppointmentReq" ? (
            <TeacherAppointmentReqPage
              requestedAppointments={requestedAppointments}
              db={db}
              auth={auth}
            />
          ) : currentPage === "Schedules" ? (
            <TeacherSchedulePage />
          ) : (
            <TeacherGraphs />
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
