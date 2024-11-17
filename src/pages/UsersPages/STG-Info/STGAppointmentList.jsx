import React, { useState } from "react";
import STGAppointmentCard from "./STGAppointmentCard";
import STGAdditionalInfo from "./STGAdditionalInfo";
import { useExport } from "../../../context/exportContext/ExportContext";
import { useDB } from "../../../context/db/DBContext";

const STGAppointmentList = ({ pastAppointments = [] }) => {
  const { getReports } = useDB();
  const [currentAppt, setCurrentAppt] = useState(null);
  const { setCurrentAppointmentData } = useExport();
  const sortedAppointments = pastAppointments.length
    ? pastAppointments.sort((b, a) => {
        return b.createdAt?.toMillis() - a.createdAt?.toMillis();
      })
    : [];

  const handleDownloadRecord = async (data, e) => {
    e.stopPropagation();
    try {
      const report = await getReports(data.id, data.precedingAppt || null);
      console.log( 'data and report', { ...data, report })
      setCurrentAppointmentData({ ...data, report });
    } catch (error) {
      console.log("An error occurred in downloading the record");
    }
  };

  return (
    <div className=" w-full h-[90%] flex justify-between">
      <div className="w-1/2 max-h-[90%] overflow-auto">
        {sortedAppointments.length !== 0
          ? sortedAppointments.map((appt) => (
              <STGAppointmentCard
                key={appt.id}
                appt={appt}
                setCurrentAppt={setCurrentAppt}
                currentAppt={currentAppt}
                handleDownloadRecord={handleDownloadRecord}
              />
            ))
          : "No past appointments with this user"}
      </div>
      <div className="w-[47%] h-[90%] flex justify-center items-center">
        {currentAppt && (
          <STGAdditionalInfo
            appt={currentAppt}
            handleDownloadRecord={handleDownloadRecord}
          />
        )}
      </div>
    </div>
  );
};

export default STGAppointmentList;
