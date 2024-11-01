import React, { useEffect, useState } from "react";

import { useAuth } from "../../../../../context/auth/AuthContext";
import { useDB } from "../../../../../context/db/DBContext";
import RegistrationReqCards from "../../admin-components/RegistrationReqCards";
import RegistrationReqInfo from "../../admin-components/RegistrationReqInfo";
import AdminSearchBar from "../../admin-components/AdminSearchBar";

const AdmingPendingRegPage = () => {
  const auth = useAuth();
  const db = useDB();
  const [pendingRegistrationList, setPendingRegistrationList] = useState();
  const [currentOpenedRegistrationCard, setCurrentOpenedRegistrationCard] =
    useState(null);
  const [loading, setLoading] = useState(true);
  const [temp, setTemp] = useState();

  useEffect(() => {
    if (auth.currentUser) {
      const handleGetPendingRegistrations = async () => {
        try {
          const unsubscribe = await db.subscribetoPendingRegistration(
            (callback) => {
              setPendingRegistrationList(callback);
              setTemp(callback);
            }
          );
          return () => unsubscribe();
        } catch (error) {
          console.log(error);
        } finally {
          setLoading(false);
        }
      };
      handleGetPendingRegistrations();
    }
  }, [db, auth.currentUser]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading</p>
      </div>
    );
  }

  return (
    <div className="pending-registrations-container h-full w-full">
      <header className="flex flex-row justify-between w-1/2 items-end pb-3">
        <h1 className="text-[#320000] text-4xl font-bold">
          Pending<br></br> <span className="font-light">Registrations</span>
        </h1>
        <AdminSearchBar
          datas={pendingRegistrationList}
          setData={setPendingRegistrationList}
          temp={temp}
          setCurrentPage={() => null}
        />
      </header>
      <div className="pending-regitrations-content-container flex flex-row justify-between h-[90%] w-full">
        <div className="flex flex-wrap items-start w-1/2 max-h-full gap-3 overflow-auto py-3">
          {pendingRegistrationList && pendingRegistrationList.length !== 0 ? (
            pendingRegistrationList.map((pendingRegistrations, index) => (
              <div className="w-[48%] h-fit" key={index}>
                <RegistrationReqCards
                  pendingRegistrations={pendingRegistrations}
                  setCurrentOpenedRegistrationCard={
                    setCurrentOpenedRegistrationCard
                  }
                />
              </div>
            ))
          ) : (
            <p>No pending Registrations</p>
          )}
        </div>
        <div
          className={`more-registartion-info w-[45%] transition-all ease-in-out duration-300 ${
            currentOpenedRegistrationCard
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {currentOpenedRegistrationCard && (
            <RegistrationReqInfo
              setCurrentOpenedRegistrationCard={
                setCurrentOpenedRegistrationCard
              }
              currentOpenedRegistrationCard={currentOpenedRegistrationCard}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdmingPendingRegPage;
