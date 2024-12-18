import React, { useEffect, useRef, useState } from "react";
import FollowupAppointment from "../../components/forms/FollowupAppointment";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import GuidanceConsultationReport from "../../components/forms/GuidanceConsultationReport";

const GuidanceEndcallPage = () => {
  const db = useDB();
  const auth = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();
  const queryParams = new URLSearchParams(location.search);
  const receiver = queryParams.get("receiver");
  const appointment = queryParams.get("appointment");
  const currentAppointment = queryParams.get("currentAppointment");

  useEffect(() => {
    if (appointment) {
      console.log(appointment);
    }
  }, [appointment]);

  const toastMessage = (message) => toast(message);
  const [submitting, setSubmitting] = useState(false);

  const yearLevelRef = useRef();
  const ageRef = useRef();
  const locationRef = useRef();
  const concernTypeRef = useRef();
  const observationRef = useRef();
  const nonVerbalCuesRef = useRef();
  const summaryRef = useRef();
  const techniquesRef = useRef();
  const actionPlanRef = useRef();
  const evaluationRef = useRef();
  const dateRef = useRef();

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

    const concernType = concernTypeRef.current?.value || "";
    const apptDate = dateRef.current?.value || "";
    const yearLevel = yearLevelRef.current?.value || "";
    const age = ageRef.current?.value || "";
    const location = locationRef.current?.value || "";
    const observation = observationRef.current?.value || "";
    const nonVerbalCues = nonVerbalCuesRef.current?.value || "";
    const summary = summaryRef.current?.value || "";
    const techniques = techniquesRef.current?.value || "";
    const actionPlan = actionPlanRef.current?.value || "";
    const evaluation = evaluationRef.current?.value || "";

    if (
      !concernType ||
      !yearLevel ||
      !age ||
      !location ||
      !nonVerbalCues ||
      !techniques ||
      !actionPlan ||
      !appointment ||
      !apptDate ||
      !concernType ||
      !observation ||
      !summary
    ) {
      toastMessage("Please fill in all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      if (auth.currentUser) {
        const res = await db.makeGuidanceReport({
          appointment,
          currentAppointment,
          concernType,
          apptDate,
          yearLevel,
          age,
          location,
          observation,
          nonVerbalCues,
          summary,
          techniques,
          actionPlan,
          evaluation,
          receiver,
        });

        if (res.status === "success") {
          toast.success(`Success: ${res.message}`);
        } else {
          toast.error(`Error: ${res.error || "Submission failed"}`);
        }
      }

    } catch (error) {
      
      toast.error("Error during submission. Please try again.");
    } finally {
      navigate(`/private/${user?.role}/dashboard`);
      setSubmitting(false);
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
    <div className="h-screen w-full flex flex-col justify-center items-center bg-white ">
      <div className="f-end-page-header w-full"></div>
      <div className="f-end-page-content w-full flex items-center justify-center">
        <div
          className={`container flex transition-all duration-500 ease-out main-w-[60%] ${
            isFollowupFormOpen ? "translate-x-0" : "translate-x-1/2"
          }`}
        >
          <GuidanceConsultationReport
            setIsFollowupFormOpen={setIsFollowupFormOpen}
            submitForm={handleSubmitReport}
            yearLevelRef={yearLevelRef}
            ageRef={ageRef}
            locationRef={locationRef}
            concernTypeRef={concernTypeRef}
            observationRef={observationRef}
            nonVerbalCuesRef={nonVerbalCuesRef}
            summaryRef={summaryRef}
            techniquesRef={techniquesRef}
            actionPlanRef={actionPlanRef}
            evaluationRef={evaluationRef}
            dateRef={dateRef}
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

export default GuidanceEndcallPage;
