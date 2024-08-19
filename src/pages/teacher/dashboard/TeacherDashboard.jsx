import React, { useEffect, useState } from "react";
import "./TeacherDashboard.css";
import { useDB } from "../../../context/db/DBContext";
import { useAuth } from "../../../context/auth/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Sidebar from "../../../components/sidebar/Sidebar";
import TeacherGraphs from "../teacher_pages/teacher-graphs/TeacherGraphs";
import TeacherAppointmentListPage from "../teacher_pages/appointment-list-page/TeacherAppointmentListPage";
import TeacherAppointmentReqPage from "../teacher_pages/appointment-req-page/TeacherAppointmentReqPage";
import TeacherSchedulePage from "../teacher_pages/schedules-page/TeacherSchedulePage";

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
    <div className="teacher-dashboard-container">
      <div className="teacher-sidebar-container">
        <Sidebar
          handleSetCurrentPage={handleSetCurrentPage}
          SidebarLinks={SidebarLinks}
        />
      </div>
      <div className="Main-Content">
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
        ) : currentPage === "Schedule" ? (
          <TeacherSchedulePage />
        ) : (
          <TeacherGraphs />
        )}
      </div>
      {/* <div className="">
        <h3>Teachers Dashboard</h3>
        <div className="appointments-container">
          {appointments && appointments.length !== 0 ? (
            appointments.map((appointment) => (
              <div key={appointment.id} className="appoinment-card">
                <p>Cosultation Appointment Requested By:</p>
                <p>{appointment.appointee.name}</p>
                <p>{appointment.appointmentType}</p>
                <p>{appointment.appointmentStatus}</p>
                <div className="teacher-action">
                  {appointment.appointmentStatus !== "Accepted" ? (
                    <>
                      <button
                        onClick={() => handleAcceptAppointment(appointment.id)}
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDenyAppointment(appointment.id)}
                      >
                        Deny
                      </button>
                    </>
                  ) : (
                    <div className="action-links">
                      <Link
                        to={`/Chatroom?receiver=${
                          appointment && appointment.appointee.name
                        }`}
                      >
                        <p>Chat</p>
                      </Link>
                      <Link
                        to={`/SendCallReq?receiver=${
                          appointment && appointment.appointee.userID
                        }&caller=${auth.currentUser.uid}`}
                      >
                        Call
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="">
              <p>No Appointments</p>
            </div>
          )}
        </div>
      </div> */}
    </div>
  );
};

export default TeacherDashboard;
