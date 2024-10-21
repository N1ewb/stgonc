import React, { useEffect, useState } from "react";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import StudentAppointmentCard from "../../student-components/Appointments/StudentAppointmentCard";
import AppointmentInfo from "../../student-components/Appointments/AppointmentInfo";

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
    <div className="div">
      <div className="div-header">
        <h1 className="font-light text-[#720000]">
          Your <span className="font-bold">Appointments</span>
        </h1>
      </div>
      <div className="flex flex-row justify-between items-start">
        <div className="div w-[48%]">
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
        <div className="w-[48%]">
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
