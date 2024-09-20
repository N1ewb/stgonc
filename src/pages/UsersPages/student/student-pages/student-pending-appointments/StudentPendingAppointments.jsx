import React, { useEffect, useState } from "react";
import { useChat } from "../../../../../context/chatContext/ChatContext";
import { useDB } from "../../../../../context/db/DBContext";
import PendingApptointmentsCard from "../../student-components/PendingApptointmentsCard";
import { useAuth } from "../../../../../context/auth/AuthContext";

const StudentPendingAppointments = ({ appt }) => {
    const chat = useChat();
    const db = useDB();
    const auth = useAuth();
  
    const [appointments, setAppointments] = useState();
  
    useEffect(() => {
      const fetchData = async () => {
        if (auth.currentUser) {
          try {
            const unsubscribe = db.subscribeToRequestedAppointmentChanges(
              "pending",
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
    <div>
      <div className="student-pending-appointment-header">
        <h1>Pending Appointment</h1>
      </div>
      <div className="student-pending-appointment-content">
        {appointments && appointments.length !== 0 ? appointments.map((appointment) => <PendingApptointmentsCard appointment={appointment} />) : ""}
      </div>
    </div>
  );
};

export default StudentPendingAppointments;
