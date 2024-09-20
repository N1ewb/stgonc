import React from "react";
import WalkinForm from "../../admin-components/WalkinForm";
import WalkinApptList from "../../admin-components/WalkinApptList";

const AdminWalkins = () => {
 
  return (
    <div className="walkins-container w-full h-[100%] flex-col flex ">
      <div className="walkins-header">
        <h1 className="text-[#320000] font-bold">
          Walkins <span className="font-light">Appointment</span>
        </h1>
      </div>
      <div className="walkins-content w-full flex flex-row ">
        <div className="col w-[40%]">
          <WalkinForm />
        </div>
        <div className="col w-[55%] ">
          <WalkinApptList />
        </div>
      </div>
    </div>
  );
};

export default AdminWalkins;
