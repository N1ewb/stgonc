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
    <div>
      <div className="student-pending-appointment-header w-1/2">
        <h1 className="font-bold"><span className="font-light">Pending</span> Appointment</h1>
      </div>
      <div className="student-pending-appointment-content w-1/2">
        {appointments && appointments.length !== 0 ? appointments.map((appointment) => <PendingApptointmentsCard key={appointment.id} appointment={appointment} />) : ""}
      </div>
    </div>
  );
};

export default StudentPendingAppointments;
