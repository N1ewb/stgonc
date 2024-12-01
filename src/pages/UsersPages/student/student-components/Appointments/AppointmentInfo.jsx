import React from "react";
import { useDB } from "../../../../../context/db/DBContext";

const AppointmentInfo = ({ appointment,setCurrentAppointmentInfo }) => {
    const {cancelAppointment} = useDB()

  const handleApptRequest = async () => {
    await cancelAppointment(appointment.appt.id)
  }
    
  return (
    <div className="w-full h-auto flex flex-col p-5 shadow-md rounded-3xl bg-white">
      <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-solid border-[#929292] rounded-md pb-3">
        <h3 className="font-semibold">
          <span className="font-light pt-3">Appointment</span> Info
        </h3>
        <button onClick={() => setCurrentAppointmentInfo(null)} className="bg-[#320000] hover:bg-[#720000] rounded-md">X</button>
      </header>
      <main className="w-full pt-5 [&_span]:text-[14px] [&_span]:text-[#929292] flex flex-col gap-3 max-h-[90%] overflow-auto">
        <p><span>Appointed Faculty Name: </span><br />{appointment.faculty.firstName} {appointment.faculty.lastName}</p>
        <p><span>Date: </span>{appointment.appt.appointmentDate}</p>
        <p><span>Time: </span>{appointment.appt.appointmentsTime.appointmentStartTime}:00 - {appointment.appt.appointmentsTime.appointmentStartTime}:00</p>
        <p><span>Mode: </span>{appointment.appt.appointmentFormat}</p>
        <p><span>Concern: </span>{appointment.appt.appointmentConcern}</p>
        <div className="footer w-full flex flex-row justify-end">
            <button onClick={handleApptRequest} className="bg-[#720000] hover:bg-[#a72e2e] rounded-md">Cancel {appointment.appt.appointmentStatus === "Pending"? "Request": appointment.appt.appointmentStatus === "Accepted" ? "Appointment" : ""}</button>
        </div>
      </main>
    </div>
  );
};

export default AppointmentInfo;
