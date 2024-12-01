import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import PendingApptointmentsCard from "../../student-components/Appointments/PendingApptointmentsCard";
import { useAuth } from "../../../../../context/auth/AuthContext";
import AppointmentInfo from "../../student-components/Appointments/AppointmentInfo";

const StudentPendingAppointments = () => {
  const db = useDB();
  const auth = useAuth();
  const [currentAppointment, setCurrentAppointment] = useState(null);

  const [appointments, setAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToRequestedAppointmentChanges(
            "Pending",
            (newAppointment) => {
              setAppointments(newAppointment);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [db]);
  return (
    <div className="flex flex-col w-full gap-10">
      <div className="student-pending-appointment-header w-full">
        <h1 className="font-bold">
          <span className="font-light">Pending</span> Appointment
        </h1>
      </div>
      <div className="flex flex-row justify-between items-start">
        <div className="student-pending-appointment-content gap-2 w-[50%] lg:w-full  flex flex-row flex-wrap max-h-[80%] overflow-x-hidden overflow-y-auto">
          {appointments && appointments.length !== 0
            ? appointments.map((appointment) => (
                <PendingApptointmentsCard
                  key={appointment.id}
                  appointment={appointment}
                  currentAppointment={currentAppointment}
                  setCurrentAppointment={setCurrentAppointment}
                />
              ))
            : ""}
        </div>
        <div className="w-[48%] lg:w-full lg:absolute transition-all ease-in-out duration-300">
          {currentAppointment && (
            <AppointmentInfo appointment={currentAppointment} setCurrentAppointmentInfo={setCurrentAppointment} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPendingAppointments;
