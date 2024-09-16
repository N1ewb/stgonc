import React, { useEffect, useState } from "react";

import "./admin_pending_reg.css";
import { Toaster } from "react-hot-toast";

import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import RegistrationReqCards from "../../admin-components/RegistrationReqCards";
import RegistrationReqInfo from "../../admin-components/RegistrationReqInfo";

const AdmingPendingRegPage = () => {
  const auth = useAuth();
  const db = useDB();
  const [pendingRegistrationList, setPendingRegistrationList] = useState();
  const [currentOpenedRegistrationCard, setCurrentOpenedRegistrationCard] = useState(null)
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const toggleShow = () => setShow(!show);

  useEffect(() => {
    if (auth.currentUser) {
      const handleGetPendingRegistrations = async () => {
        try {
          const registrations = await db.getPendingRegistrationRequests();
          console.log(registrations);
          setPendingRegistrationList(registrations);
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      handleGetPendingRegistrations();
    }
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="pending-registrations-container">
      <h1 className="text-[#320000] text-4xl font-bold">
        Pending<br></br> <span className="font-light">Registrations</span>
      </h1>
      <div className="pending-regitrations-content-container flex flex-row justify-between w-full"><div className="pending-registration-list-container w-1/2">{pendingRegistrationList && pendingRegistrationList.length !== 0 ? (
        pendingRegistrationList.map((pendingRegistrations, index) => (
          <RegistrationReqCards
            pendingRegistrations={pendingRegistrations}
            setCurrentOpenedRegistrationCard={setCurrentOpenedRegistrationCard}
            key={index}
          />
        ))
      ) : (
        <p>No pending Registrations</p>
      )}</div>
      <div className={`more-registartion-info w-[45%] transition-all ease-in-out duration-300 ${currentOpenedRegistrationCard
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"}`}>
        {currentOpenedRegistrationCard && <RegistrationReqInfo setCurrentOpenedRegistrationCard={setCurrentOpenedRegistrationCard} currentOpenedRegistrationCard={currentOpenedRegistrationCard} />}
      </div></div>
    </div>
  );
};

export default AdmingPendingRegPage;
