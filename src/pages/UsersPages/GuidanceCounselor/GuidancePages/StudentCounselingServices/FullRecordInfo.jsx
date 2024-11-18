import { useLocation } from "react-router-dom";
import { useDB } from "../../../../../context/db/DBContext";
import StudentInfoCard from "../../../STG-Info/STGStudentInfoCard";
import { useEffect, useState } from "react";
import STGAppointmentList from "../../../STG-Info/STGAppointmentList";
import AppointmentRecordList from "../../GuidanceComponents/AppointmentRecord/AppointmentRecordList";

export default function FullRecordInfo() {
  const db = useDB();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appointment = queryParams.get("appointment");
  const [appointmentRecord, setAppointmentRecord] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointment) return;

      const appointmentData = await db.getAppointmentRecords(appointment);
      setAppointmentRecord(appointmentData);
    };

    fetchData();
  }, [appointment, db]);

  return (
    <div>
      <StudentInfoCard currentAppointee={appointmentRecord[0]?.appointee} />
      <AppointmentRecordList appointmentRecord={appointmentRecord} />
    </div>
  );
}
