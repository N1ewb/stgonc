import React, { useEffect, useState } from "react";

import "./admin_pending_reg.css";
import { Toaster } from "react-hot-toast";

import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import RegistrationReqCards from "../../admin-components/RegistrationReqCards";

const AdmingPendingRegPage = () => {
  const auth = useAuth();
  const db = useDB();
  const [pendingRegistrationList, setPendingRegistrationList] = useState();
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
      {pendingRegistrationList && pendingRegistrationList.length !== 0 ? (
        pendingRegistrationList.map((pendingRegistrations, index) => (
          <RegistrationReqCards
            pendingRegistrations={pendingRegistrations}
            key={index}
          />
        ))
      ) : (
        <p>No pending Registrations</p>
      )}
      <Toaster />
    </div>
  );
};

export default AdmingPendingRegPage;
