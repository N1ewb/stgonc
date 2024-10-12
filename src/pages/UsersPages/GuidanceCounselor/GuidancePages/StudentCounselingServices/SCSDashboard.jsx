import { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import SCSApptCards from "../../GuidanceComponents/SCSApptCards";

const SCSDashboard = () => {
  const db = useDB();
  const [appts, setAppts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToSCSChanges(['Referal', 'Walkin'],(callback) => {
        setAppts(callback);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  return (
    <div className="w-full h-[100%]">
      <header>
        <h3 className="font-bold"> Dashboard</h3>
      </header>
      <main className="max-h-[80%] overflow-auto pb-10">
        {appts.length !== 0
          ? appts.map((appt) => <SCSApptCards appt={appt} key={appt.id} />)
          : "No appts"}
      </main>
    </div>
  );
};

export default SCSDashboard;
