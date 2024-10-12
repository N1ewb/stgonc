import React, { useEffect, useState } from "react";
import Add from "../../../../../static/images/add.png";
import ReferalForm from "../../GuidanceComponents/ReferalForm";
import { useDB } from "../../../../../context/db/DBContext";
import SCSApptCards from "../../GuidanceComponents/SCSApptCards";

const Referal = () => {
  const [isFormOpen, setisFormOpen] = useState(false);
  const db = useDB();
  const [appts, setAppts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const unsubscribe = db.subscribeToSCSChanges("Referal", (callback) => {
        setAppts(callback);
      });
      return () => unsubscribe();
    };
    fetchData();
  }, [db]);
  const handleOpenForm = () => {
    setisFormOpen(!isFormOpen);
  };

  return (
    <div className="flex flex-col gap-5 h-[100%] w-full">
      <header className="flex flex-row items-center gap-10 h-[5%]">
        <h3>
          Referal <span className="font-light">Page</span>
        </h3>
        <button className="bg-transparent p-0" onClick={handleOpenForm}>
          <img src={Add} alt="add" height={35} width={35} />
        </button>
      </header>
      <main className="h-[95%] flex flex-row">
        <div
          className={`form-container transition-all duration-500 ease-out h-[100%] overflow-auto ${
            isFormOpen ? "w-1/2" : "w-0"
          }`}
        >
          {isFormOpen && <ReferalForm handleOpenForm={handleOpenForm} />}
        </div>
        <div
          className={`data-container transition-all duration-500 ease-out max-h-[100%] overflow-auto ${
            !isFormOpen ? "w-full" : "w-1/2"
          }`}
        >
          {appts.length !== 0
            ? appts.map((appt) => <SCSApptCards appt={appt} />)
            : "No referal data yet"}
        </div>
      </main>
    </div>
  );
};

export default Referal;
