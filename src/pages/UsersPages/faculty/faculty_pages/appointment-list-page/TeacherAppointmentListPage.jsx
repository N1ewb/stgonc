import React, { useState } from "react";

import "./TeacherAppointmentListPage.css";
import AppointmentsList from "../../faculty_components/AppointmentsList";
import AppointmentInfo from "../../faculty_components/AppointmentInfo";

const TeacherAppointmentListPage = ({ acceptedAppointments, auth, db }) => {
  const [currentAppointment, setCurrentAppointment] = useState();

  const handleSetCurrentAppointment = (appointment) => {
    setCurrentAppointment(appointment);
  };
  return (
    <div className="teacher-appointment-page-list-container w-full flex flex-col">
      <h1 className="text-[#320000]">
        <span className="font-bold">Accepted</span>
        <br></br>
        Appoinments
      </h1>
      <div className="appointment-list-main-content w-full flex flex-row justify-between">
        <div className="appointment-list-container w-[40%] flex flex-col gap-5">
          {acceptedAppointments && acceptedAppointments.length !== 0 ? (
            acceptedAppointments.map((appointment, index) => (
              <AppointmentsList
                key={index}
                appointment={appointment}
                auth={auth}
                handleSetCurrentAppointment={handleSetCurrentAppointment}
              />
            ))
          ) : (
            <p className="font-bold text-[#320000]">No Appointments</p>
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

export default TeacherAppointmentListPage;
