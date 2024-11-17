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
  const currentAppointment = queryParams.get("currentAppointment");
  const toastMessage = (message) => toast(message);
  const [submitting, setSubmitting] = useState(false);

  const keyissuesRef = useRef();
  const rootCauseRef = useRef();
  const recommendationRef = useRef();
  const expectedOutcomeRef = useRef();

  const sessionNumberRef = useRef();
  const yearLevelRef = useRef();
  const ageRef = useRef();

  const dateRef = useRef();
  const durationRef = useRef();
  const modeRef = useRef();

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

    const date = dateRef.current.value;
    const duration = durationRef.current.value;
    const mode = modeRef.current.value;

    const yearlevel = yearLevelRef.current.value;
    const age = ageRef.current.value;
    const sessionNumber = sessionNumberRef.current.value;

    const keyissues = keyissuesRef.current.value;
    const rootcause = rootCauseRef.current.value;
    const recommendation = recommendationRef.current.value;
    const expectedOutcome = expectedOutcomeRef.current.value;

    if (
      (currentAppointment || appointment,
      date,
      duration,
      mode,
      isResolved,
      keyissues,
      rootcause,
      recommendation,
      expectedOutcome,
      yearlevel,
      age,
      sessionNumber)
    ) {
      try {
        setSubmitting(true);
        if (auth.currentUser) {
          await db.makeReport(
            appointment,
            currentAppointment,
            date,
            duration,
            mode,
            isResolved,
            receiver,
            keyissues,
            rootcause,
            recommendation,
            expectedOutcome,
            yearlevel,
            age,
            sessionNumber
          );
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
      await submitForm(e);
      await db.finishAppointment(appointment, receiver);
    } catch (error) {
      toastMessage(
        `Error in submitting report or Marking appointment finished`
      );
    }
  };
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-white overflow-x-hidden">
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
            dateRef={dateRef}
            durationRef={durationRef}
            modeRef={modeRef}
            setIsFollowupFormOpen={setIsFollowupFormOpen}
            keyissuesRef={keyissuesRef}
            rootCauseRef={rootCauseRef}
            recommendationRef={recommendationRef}
            expectedOutcomeRef={expectedOutcomeRef}
            yearLevelRef={yearLevelRef}
            ageRef={ageRef}
            sessionNumberRef={sessionNumberRef}
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
            currentAppointment={currentAppointment}
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
