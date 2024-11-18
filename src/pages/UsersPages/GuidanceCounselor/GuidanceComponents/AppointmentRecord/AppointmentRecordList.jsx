import { useExport } from "../../../../../context/exportContext/ExportContext";
import AppointmentRecord from "./AppointmentRecord";

export default function AppointmentRecordList({ appointmentRecord }) {
  const { setCurrentAppointmentData } = useExport();
  const handleDownloadRecord = async (data, e) => {
    e.stopPropagation();
    try {
      setCurrentAppointmentData(data);
    } catch (error) {
      console.log("An error occurred in downloading the record");
    }
  };
  return (
    <div className=" w-full h-[90%] flex justify-between">
      <div className="w-1/2 max-h-[90%] overflow-auto">
        {appointmentRecord.length !== 0
          ? appointmentRecord.map((appt, index) => {
              return <AppointmentRecord key={index} appt={appt} handleDownloadRecord={handleDownloadRecord} />;
            })
          : "No Appointment Record"}
      </div>
      <div className="w-[47%] h-[90%] flex justify-center items-center"></div>
    </div>
  );
}
