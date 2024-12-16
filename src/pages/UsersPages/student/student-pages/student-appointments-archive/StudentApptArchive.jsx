import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import ArchiveAppointments from "../../student-components/arhive/ArchiveAppointments";
import ArhiveInfo from "../../student-components/arhive/ArhiveInfo";

const StudentApptArchive = () => {
  const db = useDB();
  const [archiveAppointments, setArchiveAppointments] = useState();
  const [currentArch, setCurrentArch] = useState(null)

  const handleOpenForm = (arch) => {
    setCurrentArch((prevAppt) => (prevAppt === arch ? null : arch));
  };

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToRequestedAppointmentChanges(
        ["Denied", "Finished", "Cancelled", "NOSHOW"],
        (callback) => {
          setArchiveAppointments(callback);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  return (
    <div className="h-[100%] w-full flex flex-col gap-2 justify-start">
      <div className="archive-page-header w-full h-[10%] flex-col flex ">
        <h1 className="font-light text-[#720000] text-3xl xsm:text-[16px] xxsm:text-[12px]">
          Student  <span className="font-bold"> Appointment Archive</span>
        </h1>
      </div>
      <div className="archive-page-content flex flex-row h-[90%] gap-2 max-h-[90%] pb-2 overflow-x-hidden overflow-y-auto w-full justify-between ">
        <div className="archives-list w-1/2  lg:w-full">
          {archiveAppointments && archiveAppointments.length !== 0
            ? archiveAppointments.map((appointment) => (
                <ArchiveAppointments
                  key={appointment.id}
                  appointment={appointment}
                  handleOpenForm={handleOpenForm}
                  currentArch={currentArch}
                />
              ))
            : "No archives"}
        </div>
       {currentArch ? <ArhiveInfo appointment={currentArch} handleOpenForm={handleOpenForm} /> : ""}
      </div>
    </div>
  );
};

export default StudentApptArchive;
