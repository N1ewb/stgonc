import React from "react";
import { Link } from "react-router-dom";

import "./admin_appointments.css";

const AdminAppointmentPage = ({ appointments, auth, db }) => {
  const handleAcceptAppointment = async (id) => {
    await db.approveAppointment(id);
  };

  const handleDenyAppointment = async () => {};

  return (
    <div className="admin-appointments-container">
      <p>Admin Appointment Page</p>
      <div className="appoinments-container">
        <div className="accepted-appointments-container">
          <h3>Accepted Appointment Requests</h3>
          {appointments && appointments.length ? (
            appointments.map((appointment) =>
              appointment.appointmentStatus === "Accepted" ? (
                <div key={appointment.id} className="accepted-appointments">
                  <p>{appointment.appointee.name}</p>
                  <p>{appointment.appointmentStatus}</p>
                  <Link to={`/Chatroom?receiver=${appointment.appointee.name}`}>
                    <p>Chat</p>
                  </Link>
                  <Link
                    to={`/SendCallReq?receiver=${appointment.appointee.userID}&caller=${auth.currentUser.uid}`}
                  >
                    Call
                  </Link>
                </div>
              ) : null
            )
          ) : (
            <p>No accepted appointments yet</p>
          )}
        </div>
        <div className="ongoing-requests-container">
          <h3>Ongoing Appointment Request</h3>
          {appointments && appointments.length ? (
            appointments.map((appointment) =>
              appointment.appointmentStatus === "pending" ? (
                <div key={appointment.id} className="ongoing-requests">
                  <p>{appointment.appointee.name}</p>
                  <p>{appointment.appointmentStatus}</p>
                  <button
                    onClick={() => handleAcceptAppointment(appointment.id)}
                  >
                    Accept
                  </button>
                  <button onClick={() => handleDenyAppointment(appointment.id)}>
                    Deny
                  </button>
                </div>
              ) : null
            )
          ) : (
            <p>No appointment requests yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointmentPage;
