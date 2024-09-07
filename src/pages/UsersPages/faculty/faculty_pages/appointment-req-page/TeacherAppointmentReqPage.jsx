import React from "react";

import "./TeacherAppointmentReqPage.css";

const TeacherAppointmentReqPage = ({ requestedAppointments, db }) => {
  const handleAcceptAppointment = async (id) => {
    await db.approveAppointment(id);
  };

  const handleDenyAppointment = async (id) => {
    await db.denyAppointment(id);
  };

  return (
    <div className="teacher-appointment-request-container">
      <h3>Appointment Request</h3>
      {requestedAppointments && requestedAppointments.length !== 0 ? (
        requestedAppointments.map((appointment, index) => (
          <div key={index} className="teacher-appointment-request-table">
            <p>{appointment.appointee.name}</p>
            <p>{appointment.appointmentConcern}</p>
            <button onClick={() => handleAcceptAppointment(appointment.id)}>
              Accept
            </button>
            <button onClick={() => handleDenyAppointment(appointment.id)}>
              Deny
            </button>
          </div>
        ))
      ) : (
        <p>No Appointment Request</p>
      )}
    </div>
  );
};

export default TeacherAppointmentReqPage;
