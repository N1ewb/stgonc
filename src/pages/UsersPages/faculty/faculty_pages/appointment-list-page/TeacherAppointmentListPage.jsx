import React from "react";
import { Link } from "react-router-dom";

import "./TeacherAppointmentListPage.css";

const TeacherAppointmentListPage = ({ acceptedAppointments, auth, db }) => {
  return (
    <div className="teacher-appointment-page-list-container">
      <h3>Your Appoinments</h3>
      {acceptedAppointments && acceptedAppointments.length !== 0 ? (
        acceptedAppointments.map((appointment, index) => (
          <div key={index} className="teacher-appointment-list-table">
            <p>{appointment.appointee.name}</p>
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
        ))
      ) : (
        <p>No Appointments</p>
      )}
    </div>
  );
};

export default TeacherAppointmentListPage;
