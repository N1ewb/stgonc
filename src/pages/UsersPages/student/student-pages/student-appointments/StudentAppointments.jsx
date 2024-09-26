import React, { useEffect, useState } from "react";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import StudentAppointmentCard from "../../student-components/StudentAppointmentCard";

const StudentAppointments = () => {
  const chat = useChat();
  const db = useDB();
  const auth = useAuth();

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
        <h1 className="font-light text-[#720000]">Your <span className="font-bold">Appointments</span></h1>
      </div>
      <div className="div w-1/2">
      {appointments && appointments.length !== 0
        ? appointments.map((appointment) => (
            <StudentAppointmentCard key={appointment.id} appointment={appointment} />
          ))
        : ""}
      </div>
    </div>
  );
};

export default StudentAppointments;
