import React, { useEffect, useRef, useState } from "react";
import ConsultationReport from "../../components/forms/ConsultationReport";
import FollowupAppointment from "../../components/forms/FollowupAppointment";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";

const FacultyEndCallPage = () => {
  const db = useDB();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const appointment = queryParams.get("appointment");
  const toastMessage = (message) => toast(message);
  const [submitting, setSubmitting] = useState(false);
  const remarksRef = useRef();
  const dateRef = useRef();
  const durationRef = useRef();
  const modeRef = useRef();
  const agendaRef = useRef();
  const summaryRef = useRef();
  const [isResolved, setIsResolved] = useState("");
  const [isFollowupFormOpen, setIsFollowupFormOpen] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      const handleGetUser = async () => {
        const user = await db.getUser(auth.currentUser.uid);
        setUser(user);
      };
      handleGetUser();
    }
  }, [db, auth.currentUser]);

  const submitForm = async (e) => {
    e.preventDefault();

    const remarks = remarksRef.current.value;
    const date = dateRef.current.value;
    const duration = durationRef.current.value;
    const mode = modeRef.current.value;
    const agenda = agendaRef.current.value;
    const summary = summaryRef.current.value;
    if (
      (appointment, remarks, date, duration, mode, isResolved, agenda, summary)
    ) {
      try {
        setSubmitting(true);
        if (auth.currentUser) {
          await db.makeReport(
            appointment,
            remarks,
            date,
            duration,
            mode,
            isResolved,
            agenda,
            summary,
            receiver
          );
          toastMessage("Report made successfuly!");
        }
      } catch (error) {
        console.error("Error in:", error);
      } finally {
        setSubmitting(false);
        navigate(`/private/${user?.role}/dashboard`);
      }
    } else {
      toastMessage("Fill in fields");
    }
  };

  const handleSubmitReport = async (e) => {
    try {
      submitForm(e);
      await db.finishAppointment(appointment, receiver);
    } catch (error) {
      toastMessage(
        `Error in submitting report or Marking appointment finished`
      );
    }
  };
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center ">
      <div className="f-end-page-header w-full"></div>
      <div className="f-end-page-content w-full flex items-center justify-center">
        <div
          className={`container flex transition-all duration-500 ease-out main-w-[60%] ${
            isFollowupFormOpen ? "translate-x-0" : "translate-x-1/2"
          }`}
        >
          <ConsultationReport
            submitForm={handleSubmitReport}
            setIsResolved={setIsResolved}
            isResolved={isResolved}
            setSubmitting={setSubmitting}
            submitting={submitting}
            receiver={receiver}
            remarksRef={remarksRef}
            dateRef={dateRef}
            durationRef={durationRef}
            modeRef={modeRef}
            agendaRef={agendaRef}
            summaryRef={summaryRef}
            setIsFollowupFormOpen={setIsFollowupFormOpen}
          />
        </div>
        <div
          className={`container transition-all duration-500 ease-out overflow-hidden min-w-[40%] ${
            !isFollowupFormOpen
              ? "translate-x-[100%] opacity-0"
              : "translate-x-0 opacity-100"
          }`}
        >
          <FollowupAppointment
            receiver={receiver}
            appointment={appointment}
            submitForm={submitForm}
            setIsFollowupFormOpen={setIsFollowupFormOpen}
            isFollowupFormOpen={isFollowupFormOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default FacultyEndCallPage;
