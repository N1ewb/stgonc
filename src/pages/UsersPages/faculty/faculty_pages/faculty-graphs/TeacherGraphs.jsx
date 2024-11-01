import { useEffect, useState } from "react";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import TotalAppointments from "../../../admin/admin-components/graphs/TotalAppointments";

const TeacherGraphs = () => {

  const auth = useAuth();
  const db = useDB();
  const [apptList, setApptList] = useState([])
 

  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToUserAppointmentChanges((callback) => {
        setApptList(callback)
      })
      return () => unsubscribe()
    }
    fetchData()
  },[db])

  return (
    <div className="h-[100%] w-full">
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

export default TeacherGraphs;
