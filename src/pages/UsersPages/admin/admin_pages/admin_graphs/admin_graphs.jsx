import React, { useEffect, useState } from "react";
import FacultyLeaderboard from "../../admin-components/leaderboard/FacultyLeaderboard";
import TotalAppointments from "../../admin-components/graphs/TotalAppointments";
import { useDB } from "../../../../../context/db/DBContext";
import ExportReport from "../../../../../ComponentToPDF/ExportReport";

const AdminGraphs = () => {
  const db = useDB();
  const [apptList, setApptList] = useState([]);
  const [insList, setInsList] = useState([]);
  const [openOverlay, setOpenOverlay] = useState(false);

  useEffect(() => {
    const fetchInstructors = async () => {
      const unsubscribe = await db.subscribeToInstructorChanges((callback) => {
        setInsList(callback);
      });
      return () => unsubscribe();
    };

    fetchInstructors();
  }, [db]);

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = await db.subscribeToAllAppointmentChanges(
        (callback) => {
          setApptList(callback);
        }
      );
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);

  const handleExport = async () => setOpenOverlay(!openOverlay);
  const handleCloseOverlay = () => setOpenOverlay(false);

  return (
    <div className="h-full w-full flex flex-col">
      {/* <div className="admin-dashboard-header">
        <Link to='/private/end-call-page'>End page access</Link>
      </div> */}
      {openOverlay && (
        <div className="absolute top-0 right-0 h-full w-full z-10">
          <ExportReport onClose={handleCloseOverlay} insList={insList} />
        </div>
      )}
      <div className="admin-dashboard-content flex flex-row w-full justify-between lg:flex-wrap lg:justify-center lg:gap-10">
        <div className="appointments-info w-1/2 z-0">
          <TotalAppointments apptList={apptList} exportButton={handleExport} />
        </div>
        <div className="faculty-of-the-month h-full w-[45%]">
          <FacultyLeaderboard insList={insList} />
        </div>
      </div>
    </div>
  );
};

export default AdminGraphs;
