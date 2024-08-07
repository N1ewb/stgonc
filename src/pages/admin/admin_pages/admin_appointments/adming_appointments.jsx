import React from "react";
import { Link } from "react-router-dom";

const AdminAppointmentPage = ({ appointments, auth, db }) => {
  const handleAcceptAppointment = async (id) => {
    await db.approveAppointment(id);
  };

  const handleDenyAppointment = async () => {};

  return (
    <div className="admin-appointments-container">
      <p>AdminAppointmentPage</p>
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
    </div>
  );
};

export default AdminAppointmentPage;
