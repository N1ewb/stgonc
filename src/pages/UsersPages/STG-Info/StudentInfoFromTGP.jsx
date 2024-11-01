import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useDB } from "../../../context/db/DBContext";
import Loading from "../../../components/Loading/Loading";
import ErrorPage from '../../Error/ErrorPage'
import StudentInfoCard from "./STGStudentInfoCard";
import STGAppointmentList from "./STGAppointmentList";

const StudentInfoFromTGP = () => {
  const db = useDB();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const appointee = queryParams.get("appointee");
  const [currentAppointee, setCurrentAppointee] = useState(null);
  const [pastAppointments, setPastAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (appointee) {
      const fetchData = async () => {
        try {
          const user = await db.getUser(appointee);
          setCurrentAppointee(user);
        } catch (error) {
          console.error("Error fetching user:", error);
          setError("Failed to fetch user information.");
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [appointee, db]);

  useEffect(() => {
    const fetchData = async () => {
      if (!appointee) return;

      const unsubscribe = await db.subscribeToSwithTGAppointmentChanges(
        appointee,
        ["Finished"],
        (callback) => {
          setPastAppointments(callback);
        }
      );

      return () => unsubscribe();
    };

    fetchData();
  }, [appointee, db]);

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorPage />
  }

  return (
    <div className=" p-2 h-[95%] w-full flex flex-col items-start justify-start gap-1">
      <StudentInfoCard currentAppointee={currentAppointee} />
      <STGAppointmentList pastAppointments={pastAppointments} />
    </div>
  );
};

export default StudentInfoFromTGP;
