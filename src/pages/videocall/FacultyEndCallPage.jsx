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

  const [submitting, setSubmitting] = useState(false);
  const [isFollowupFormOpen, setIsFollowupFormOpen] = useState(false);

  const keyissuesRef = useRef();
  const rootCauseRef = useRef();
  const recommendationRef = useRef();
  const expectedOutcomeRef = useRef();
  const yearLevelRef = useRef();
  const ageRef = useRef();
  const dateRef = useRef();
  const durationRef = useRef();

  useEffect(() => {
    if (auth.currentUser) {
      const handleGetUser = async () => {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          setUser(user);
        } catch (error) {
          toast.error("Error fetching user data.");
          console.error(error);
        }
      };
      handleGetUser();
    }
  }, [db, auth.currentUser]);

  const submitForm = async (e) => {
    e.preventDefault();

    const date = dateRef.current.value;
    const duration = durationRef.current.value;
    const yearlevel = yearLevelRef.current.value;
    const age = ageRef.current.value;
    const keyissues = keyissuesRef.current.value;
    const rootcause = rootCauseRef.current.value;
    const recommendation = recommendationRef.current.value;
    const expectedOutcome = expectedOutcomeRef.current.value;

    if (
      appointment &&
      date &&
      duration &&
      keyissues &&
      rootcause &&
      recommendation &&
      expectedOutcome &&
      yearlevel &&
      age
    ) {
      try {
        setSubmitting(true);

        const payload = {
          appointment,
          currentAppointment: currentAppointment || null,
          appointmentDate: date,
          appointmentDuration: duration,
          receiver,
          keyissues,
          rootcause,
          recommendation,
          expectedOutcome,
          yearlevel,
          age,
        };

        const res = await db.makeReport(payload);

        if (res.status === "success") {
          toast.success(`Success: ${res.message}`);
        } else {
          toast.error(`Error: ${res.error || "Submission failed"}`);
        }
      } catch (error) {
        toast.error("Error during submission. Please try again.");
      } finally {
        navigate(`/private/${user?.role}/dashboard`);
        setSubmitting(false);
      }
    } else {
      toast.error("Please fill in all required fields.");
    }
  };

  const handleSubmitReport = async (e) => {
    try {
      await submitForm(e);
      await db.finishAppointment(appointment, receiver);
      toast.success("Appointment marked as finished.");
    } catch (error) {
      toast.error("Error marking appointment as finished.");
      console.error(error);
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
            setSubmitting={setSubmitting}
            submitting={submitting}
            receiver={receiver}
            dateRef={dateRef}
            durationRef={durationRef}
            keyissuesRef={keyissuesRef}
            rootCauseRef={rootCauseRef}
            recommendationRef={recommendationRef}
            expectedOutcomeRef={expectedOutcomeRef}
            yearLevelRef={yearLevelRef}
            ageRef={ageRef}
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
