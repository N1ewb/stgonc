import React, { useEffect, useState } from "react";

import "./admin_pending_reg.css";
import toast, { Toaster } from "react-hot-toast";
import { AdminAccepptStudentAccount } from "../../../../../context/auth/adminCreateAccount";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";

const AdmingPendingRegPage = () => {
  const auth = useAuth();
  const db = useDB();
  const [pendingRegistrationList, setPendingRegistrationList] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState(false);

  const toastMessage = (message) => toast(message);
  const toggleShow = () => setShow(!show);

  const handleApproveRegistrationRequest = async (
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    studentIdnumber,
    requestID
  ) => {
    try {
      await AdminAccepptStudentAccount(
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        studentIdnumber,
        requestID
      );
    } catch (error) {
      toastMessage(error);
    }
  };

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
      {pendingRegistrationList && pendingRegistrationList.length !== 0 ? (
        pendingRegistrationList.map((pendingRegistrations, index) => (
          <div className="pending-registration-container" key={index}>
            <p>{pendingRegistrations.firstName}</p>
            <p>{pendingRegistrations.lastName}</p>
            <p>{pendingRegistrations.status}</p>
            {pendingRegistrations.status === "Pending" ? (
              <button
                onClick={() =>
                  handleApproveRegistrationRequest(
                    pendingRegistrations.email,
                    pendingRegistrations.password,
                    pendingRegistrations.firstName,
                    pendingRegistrations.lastName,
                    pendingRegistrations.phoneNumber,
                    pendingRegistrations.studentIdnumber,
                    pendingRegistrations.id
                  )
                }
              >
                Approve Request
              </button>
            ) : (
              <p></p>
            )}
          </div>
        ))
      ) : (
        <p>No pending Registrations</p>
      )}
      <Toaster />
    </div>
  );
};

export default AdmingPendingRegPage;
