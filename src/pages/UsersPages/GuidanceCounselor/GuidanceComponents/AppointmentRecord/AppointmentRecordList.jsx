import { useEffect, useState } from "react";
import { useExport } from "../../../../../context/exportContext/ExportContext";
import AppointmentRecord from "./AppointmentRecord";
import AppointmentRecordInfo from "./AppointmentRecordInfo";

export default function AppointmentRecordList({ appointmentRecord }) {
  const { setCurrentAppointmentData } = useExport();
  const [currentRecord, setCurrentRecord] = useState(null)
  const handleDownloadRecord = async (data, e) => {
    e.stopPropagation();
    try {
      setCurrentAppointmentData(data);
    } catch (error) {
      console.log("An error occurred in downloading the record");
    }
  };
  useEffect(() => {
    if(currentRecord){
      console.log("Current Record kay: ", currentRecord)
    }
  },[currentRecord])
  return (
    <div className=" w-full h-[90%] flex justify-between">
      <div className="w-1/2 max-h-[90%] overflow-auto">
        {appointmentRecord.length !== 0
          ? appointmentRecord.map((appt, index) => {
              return <AppointmentRecord currentRecord={currentRecord} setCurrentRecord={setCurrentRecord} key={index} appt={appt} handleDownloadRecord={handleDownloadRecord} />;
            })
          : "No Appointment Record"}
      </div>
      <div className="w-[47%] h-[90%] flex justify-center items-center pt-10">
        {currentRecord && <AppointmentRecordInfo currentRecord={currentRecord} setCurrentRecord={setCurrentRecord} /> }
      </div>
    </div>
  );
}
