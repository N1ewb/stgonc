import React, { useState } from "react";
import AppointmentReqList from "../../faculty_components/AppointmentReqList";

import "./TeacherAppointmentReqPage.css";
import AppointmentInfo from "../../faculty_components/AppointmentInfo";

const TeacherAppointmentReqPage = ({ requestedAppointments, db }) => {
  const [currentAppointment, setCurrentAppointment] = useState();

  const handleSetCurrentAppointment = (appointment) => {
    setCurrentAppointment(appointment);
  };

  const handleAcceptAppointment = async (id) => {
    await db.approveAppointment(id);
  };

  const handleDenyAppointment = async (id) => {
    await db.denyAppointment(id);
  };

  // Helper function to convert date to a readable format

  return (
    <div className="teacher-appointment-request-container w-full">
      <h1 className="text-[#320000]">
        <span className="font-bold">Appointment</span>
        <br></br>
        Requests
      </h1>
      <div className="appointment-request-main-content w-full flex flex-row justify-between">
        <div className="appointment-request-list-container w-[40%] flex flex-col gap-5">
          {requestedAppointments && requestedAppointments.length !== 0 ? (
            requestedAppointments.map((appointment, index) => (
              <AppointmentReqList
                key={index}
                appointment={appointment}
                handleDenyAppointment={handleDenyAppointment}
                handleAcceptAppointment={handleAcceptAppointment}
                handleSetCurrentAppointment={handleSetCurrentAppointment}
              />
            ))
          ) : (
            <p className="font-bold text-[#320000]">No Appointment Request</p>
          )}
        </div>

        {currentAppointment && (
          <div
            className={`w-[50%] bg-white shadow-md rounded-[30px] p-10 transition-all ease-in-out duration-300 ${
              currentAppointment
                ? "opacity-100 h-auto translate-y-0"
                : "opacity-0 h-0 -translate-y-10"
            }`}
          >
            {currentAppointment && (
              <AppointmentInfo
                currentAppointment={currentAppointment}
                handleSetCurrentAppointment={handleSetCurrentAppointment}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAppointmentReqPage;
