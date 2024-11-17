import React, { useEffect, useState } from "react";
import TotalAppointments from "../../admin/admin-components/graphs/TotalAppointments";
import { useDB } from "../../../../context/db/DBContext";
import { Link } from "react-router-dom";


const GuidanceDashboard = () => {
  const db = useDB()
  const [apptList, setAppts] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToAllAppointmentChanges((callback) => {
        setAppts(callback)
    })
    return () => unsubscribe()
    }
    fetchData()
  },[db])
  return (
    <div className="h-[100%] w-full">
      <Link to='/private/GuidanceEndcallPage' >GO to end call page</Link>
      <header>
        <h1 className="font-bold">Dashboard</h1>
      </header>
      <main className="w-full flex flex-row justify-between h-[100%]">
        <div className="col w-1/2"><TotalAppointments apptList={apptList} /></div>
        <div className="col w-[45%]"></div>
      </main>
    </div>
  );
};

export default GuidanceDashboard;
