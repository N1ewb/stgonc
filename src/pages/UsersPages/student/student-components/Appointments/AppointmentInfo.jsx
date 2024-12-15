import { useDB } from "../../../../../context/db/DBContext";
import toast from "react-hot-toast";
import { useReschedDialog } from "../../../../../context/appointmentContext/ReschedContext";
import { useEffect } from "react";
import useScheduleAppointment from "../../../../../hooks/useScheduleAppointment";

const AppointmentInfo = ({ appointment, setCurrentAppointmentInfo }) => {
  const { cancelAppointment } = useDB();
  const { handleToggleReschedDialog,openReschedDialog } = useReschedDialog();

  useEffect(() => {
    if(openReschedDialog){
      console.log('Faculty: ', appointment.faculty)
    }
  },[openReschedDialog])

  const handleApptRequest = async () => {
    const res = await cancelAppointment(
      appointment.appt.id,
      "akong gi cancel maam",
      appointment.appt.appointedFaculty
    );
    if (res.status === "success") {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setCurrentAppointmentInfo(null);
  };

  return (
    <div className="w-full h-auto flex flex-col p-5 shadow-md rounded-3xl bg-white">
      <header className="flex flex-row w-full justify-between items-center border-b-[1px] border-solid border-[#929292] rounded-md pb-3">
        <h3 className="font-semibold">
          <span className="font-light pt-3">Appointment</span> Info
        </h3>
        <button
          onClick={() => setCurrentAppointmentInfo(null)}
          className="bg-[#320000] hover:bg-[#720000] rounded-md"
        >
          X
        </button>
      </header>
      <main className="w-full pt-3 [&_span]:text-[14px] [&_span]:text-[#929292] flex flex-col gap-3 max-h-[90%] overflow-auto">
        {appointment.appt?.isRescheduled && (
          <p className="p-3 bg-[#7200007a] flex-1 rounded-md text-white text-center">
            This Appointment was rescheduled
          </p>
        )}
        <p>
          <span>Appointed Faculty Name: </span>
          <br />
          {appointment.faculty.firstName} {appointment.faculty.lastName}
        </p>
        <p>
          <span>Date: </span>
          {appointment.appt.appointmentDate}
        </p>
        <p>
          <span>Time: </span>
          {appointment.appt.appointmentsTime.appointmentStartTime}:00 -{" "}
          {appointment.appt.appointmentsTime.appointmentStartTime}:00
        </p>
        <p>
          <span>Mode: </span>
          {appointment.appt.appointmentFormat}
        </p>
        <p>
          <span>Concern: </span>
          {appointment.appt.appointmentConcern}
        </p>
        {appointment.appt?.isRescheduled ? (
           <div className="footer w-full flex flex-row justify-end gap-4 [&_button]:text-[12px]">
             <button
            onClick={handleToggleReschedDialog}
            className="bg-[#ab4d1f] flex-1 hover:bg-[#833f1d] rounded-md"
          >
            Appeal New Schedule
            
          </button>
           <button
             onClick={() => null}
             className="bg-[#1b8833] flex-1 hover:bg-[#196929] rounded-md"
           >
             Accept New Schedule
            
           </button>
         </div>
         
        ) : (
          <button className="bg-transparent flex-1 "></button>
        )}
        <div className="footer w-full flex flex-row justify-end gap-4">
          <button
            onClick={handleApptRequest}
            className="bg-[#720000] flex-1 hover:bg-[#a72e2e] rounded-md text-[12px]"
          >
            Cancel{" "}
            {appointment.appt.appointmentStatus === "Pending"
              ? "Request"
              : appointment.appt.appointmentStatus === "Accepted"
              ? "Appointment"
              : ""}
          </button>
        </div>
      </main>
    </div>
  );
};

export default AppointmentInfo;
