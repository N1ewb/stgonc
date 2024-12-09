import React, { useEffect, useState } from "react";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import StudentAppointmentCard from "../../student-components/Appointments/StudentAppointmentCard";
import AppointmentInfo from "../../student-components/Appointments/AppointmentInfo";
import { api } from "../../../../../lib/api";

const StudentAppointments = () => {
  const chat = useChat();
  const db = useDB();
  const auth = useAuth();
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointments, setAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      if (auth.currentUser) {
        try {
          const unsubscribe = db.subscribeToRequestedAppointmentChanges(
            "Accepted",
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
    <div className="flex flex-col gap-2 h-full">
      <div className="div-header">
        <h1 className="font-light text-[#720000] text-3xl xsm:text-[16px] xxsm:text-[12px]">
          Your <span className="font-bold">Appointments</span>
        </h1>
      </div>

      <div className="flex flex-row gap-4 justify-between items-start h-full pb-4">
        <div className="div flex-1 lg:w-full flex gap-2 flex-wrap max-h-[100%] overflow-x-hidden overflow-y-auto">
          {appointments && appointments.length !== 0
            ? appointments.map((appointment) => (
                <StudentAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  setCurrentAppointment={setCurrentAppointment}
                  currentAppointment={currentAppointment}
                />
              ))
            : ""}
        </div>
        <div className="flex-1 lg:w-full lg:absolute transition-all ease-in-out duration-300">
          {currentAppointment && (
            <AppointmentInfo
              appointment={currentAppointment}
              setCurrentAppointmentInfo={setCurrentAppointment}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentAppointments;
