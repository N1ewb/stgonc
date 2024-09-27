import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import BarGraph from "./BarGraph";
import TodayInfo from "./TodayInfo";

const TotalAppointments = () => {
  const db = useDB();
  const auth = useAuth();
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
    <div className="flex flex-col gap-5 ">
      <div className="seven-day-graph">
        <BarGraph apptList={apptList} />
      </div>
      <div className="today-info">
        <TodayInfo apptList={apptList} />
      </div>
    </div>
  );
};

export default TotalAppointments;
