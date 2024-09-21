import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import ArchiveAppointments from "../../student-components/ArchiveAppointments";

const StudentApptArchive = () => {
  const db = useDB();
  const [archiveAppointments, setArchiveAppointments] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToRequestedAppointmentChanges(
        ["Denied", "Finished", "Cancelled"],
        (callback) => {
          setArchiveAppointments(callback);
          console.log(callback)
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  return (
    <div>
      <div className="archive-page-header w-full h-[100%] flex-col flex ">
        <h1 className="font-bold text-[#720000]">Student Appointment <span className="font-light">Archive</span></h1>
      </div>
      <div className="archive-page-content">
        {archiveAppointments && archiveAppointments.length !== 0 ? archiveAppointments.map((appointment) => 
        <ArchiveAppointments key={appointment.id} appointment={appointment} /> ) :'No archives'}
      </div>
    </div>
  );
};

export default StudentApptArchive;
