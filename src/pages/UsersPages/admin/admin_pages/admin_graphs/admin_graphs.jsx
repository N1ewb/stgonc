import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FacultyLeaderboard from "../../admin-components/leaderboard/FacultyLeaderboard";
import TotalAppointments from "../../admin-components/graphs/TotalAppointments";
import { useDB } from "../../../../../context/db/DBContext";


const AdminGraphs = () => {
  const db = useDB();
  const [apptList, setApptList] = useState([]);
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
  return (
    <div className="h-[100%] w-full flex flex-col">
      <div className="admin-dashboard-header">
        <Link to='/private/end-call-page'>End page access</Link>
      </div>
      <div className="admin-dashboard-content flex flex-row w-full justify-between lg:flex-wrap lg:justify-center lg:gap-10">
        <div className="appointments-info w-1/2">
          <TotalAppointments apptList={apptList} />
        </div>
        <div className="faculty-of-the-month h-[100%] w-[45%]">
          <FacultyLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default AdminGraphs;
