import React from "react";
import { Link } from "react-router-dom";
import FacultyLeaderboard from "../../admin-components/leaderboard/FacultyLeaderboard";
import TotalAppointments from "../../admin-components/graphs/TotalAppointments";

const AdminGraphs = () => {
  return (
    <div className="h-[100%] w-full flex flex-col">
      <div className="admin-dashboard-header">
        <Link to='/private/end-call-page'>End page access</Link>
      </div>
      <div className="admin-dashboard-content flex flex-row w-full justify-between lg:flex-wrap lg:justify-center lg:gap-10">
        <div className="appointments-info w-1/2">
          <TotalAppointments />
        </div>
        <div className="faculty-of-the-month h-[100%] w-[45%]">
          <FacultyLeaderboard />
        </div>
      </div>
    </div>
  );
};

export default AdminGraphs;
