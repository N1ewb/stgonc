import React, { useEffect, useRef, useState } from "react";
import { useDB } from "../../context/db/DBContext";
import { useAuth } from "../../context/auth/AuthContext";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const EndCallPage = () => {
  const db = useDB();
  const auth = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const caller = queryParams.get("caller");
  const appointment = queryParams.get("appointment");
  const [faculty, setFaculty] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [facultyRating, setFacultyRating] = useState(0);
  const [consultationRating, setConsultationRating] = useState(0);
  const consultationFeedbackRef = useRef();
  const facultyFeedbackRef = useRef();

  const ratingNum = [1, 2, 3, 4, 5];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const consultationFeedback = consultationFeedbackRef.current.value;
    const facultyFeedback = facultyFeedbackRef.current.value;

    try {
      if (
        facultyRating &&
        facultyFeedback &&
        consultationRating &&
        consultationFeedback
      ) {
        await db.rateExperiences(
          caller,
          facultyRating,
          facultyFeedback,
          appointment,
          consultationRating,
          consultationFeedback
        );
        toast.success("Rating sent successfully");
      } else {
        toast.error("Please fill in all fields");
      }
    } catch (error) {
      toast.error("Failed to send rating");
    } finally {
      setSubmitting(false);

      consultationFeedbackRef.current.value = "";
      facultyFeedbackRef.current.value = "";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (caller) {
        const user = await db.getUser(caller);
        setFaculty(user);
      }
    };
    fetchData();
  }, [caller, db]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center">
      <div className="flex flex-col h-[80%] p-10 shadow-lg items-center ">
        <div className="end-call-page-header">
          <h3>Help us improve your experience with your feedback</h3>
        </div>
        <form
          onSubmit={handleSubmit}
          className="end-call-page-content w-full flex flex-col items-center"
        >
          <div className="consultation-rating flex flex-col items-center">
            <p>Rate the Consultation experience</p>
            <div className="radio-group flex flex-row gap-2">
              {ratingNum.map((num) => (
                <div key={num} className="group">
                  <label htmlFor={`consultation-${num}`}>{num}</label>
                  <input
                    type="radio"
                    name="consultationRating"
                    id={`consultation-${num}`}
                    value={num}
                    onChange={() => setConsultationRating(num)} // Update state on change
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="additional-feedback flex-col flex items-center justify-center w-[80%]">
            <label htmlFor="feedback">
              Additional Feedback for this Consultation
            </label>
            <textarea
              id="feedback"
              className="w-full p-2 border-[1px] border-solid border-[#320000] rounded-md"
              ref={consultationFeedbackRef}
              required
            ></textarea>
          </div>
          <div className="faculty-rating flex flex-col items-center">
            <p>Rate this teacher</p>
            <div className="radio-group flex flex-row gap-2">
              {ratingNum.map((num) => (
                <div key={num} className="group">
                  <label htmlFor={`faculty-${num}`}>{num}</label>
                  <input
                    type="radio"
                    name="facultyRating"
                    id={`faculty-${num}`}
                    value={num}
                    onChange={() => setFacultyRating(num)} // Update state on change
                    required
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="additional-feedback flex-col flex items-center justify-center w-[80%]">
            <label htmlFor="faculty-feedback">
              Additional Feedback for this Teacher
            </label>
            <textarea
              id="faculty-feedback"
              className="w-full p-2 border-[1px] border-solid border-[#320000] rounded-md"
              ref={facultyFeedbackRef}
              required
            ></textarea>
          </div>
          <button
            className="submit-button bg-[#720000] hover:bg-[#320000] rounded-md px-10 py-3"
            type="submit"
            disabled={submitting}
          >
            {submitting ? <span>Submitting...</span> : <span>Submit</span>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EndCallPage;
