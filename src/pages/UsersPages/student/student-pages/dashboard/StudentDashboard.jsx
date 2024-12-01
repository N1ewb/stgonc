import React, { useEffect, useState } from "react";

import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";

import { useCall } from "../../../../../context/call/CallContext";

import More from "../../../../../static/images/more-dark.png";
import DefaultProfile from "../../../../../static/images/default-profile.png";

import RequestAppointmentForm from "../../student-components/forms/RequestAppointmentForm";
import InstructorsList from "../../student-components/InstructorsList";
import InstructorInfo from "../../student-components/InstructorInfo";
import Loading from "../../../../../components/Loading/Loading";
import toast from "react-hot-toast";

const StudentDashboard = () => {
  const db = useDB();
  const auth = useAuth();
  const call = useCall();
  const navigate = useNavigate();
  const [instructors, setInstructors] = useState([]);
  const [currentInstructor, setCurrentInstructor] = useState();
  const [instructorInfo, setInstructorInfo] = useState(null);
  const [myInfo, setMyInfo] = useState();
  const [show, setShow] = useState(false);
  const [currentOption, setCurrentOption] = useState("Instructors");
  const [loading, setLoading] = useState(true);
  const toastMessage = (message) => toast(message);

  const handleSetCurrentOption = (option) => {
    setCurrentOption(option);
  };

  useEffect(() => {
    if (currentOption === "Instructors") {
      const handleGetTeachers = async () => {
        try {
          setLoading(true);
          const teachers = await db.getTeachers();
          setInstructors(teachers);
        } catch (error) {
          toastMessage("Error occured in retreiving the instructors");
        } finally {
          setLoading(false);
        }
      };
      handleGetTeachers();
    } else if (currentOption === "Guidance") {
      const handleGetGuidance = async () => {
        try {
          setLoading(true);
          const guidance = await db.getGuidance();
          setInstructors(guidance);
        } catch (error) {
          toastMessage("Error occured in retreiving the guidance counselor");
        } finally {
          setLoading(false);
        }
      };
      handleGetGuidance();
    }
  }, [currentOption, db]);

  const toggleShow = (instructor) => {
    setShow(!show);
    setCurrentInstructor(instructor);
  };

  const handleGetMyinfo = async () => {
    if (auth.currentUser) {
      const me = await db.getUser(auth.currentUser.uid);
      setMyInfo(me);
    }
  };

  useEffect(() => {
    if (myInfo === undefined) {
      handleGetMyinfo();
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const unsubscribe = call.subscribeToCallChanges((newcalloffers) => {
          navigate(
            `/private/ReceiveCallReq?appointment=${newcalloffers.appointment}&receiver=${auth.currentUser.uid}&caller=${newcalloffers.caller}`
          );
        }, "calling");
        return () => unsubscribe();
      } catch (error) {
        toastMessage("Error occured in Receiving call");
      }
    };
    fetchData();
  }, [call, auth.currentUser, navigate]);

  return (
    <div className="h-[100%] flex flex-col gap-10  w-full">
      <header className="flex w-full justify-between items-center lg:!flex-col">
        <h1 className="text-[#360000] flex flex-col xl:gap-4  lg:flex-row">
          <span className="font-bold">{myInfo && myInfo.department} </span>{" "}
          <span className="font-light">Department Instructors</span>{" "}
        </h1>
        <div className="options flex flex-row w-1/2 lg:w-full lg:justify-start gap-4 justify-end bg-[#320000] rounded-3xl  [&_button]:rounded-3xl p-2">
          <button
            className={` ${
              currentOption === "Instructors"
                ? "bg-white text-[#320000]"
                : "text-white border-2 border-solid bg-transparent border-white"
            }`}
            onClick={() => handleSetCurrentOption("Instructors")}
          >
            Instructors
          </button>
          <button
            className={`${
              currentOption === "Guidance"
                ? "bg-white text-[#320000]"
                : "text-white border-2 border-solid bg-transparent border-white"
            }`}
            onClick={() => handleSetCurrentOption("Guidance")}
          >
            Guidance Counselor
          </button>
        </div>
      </header>
      <div className="flex flex-row w-full h-[100%] justify-between lg:relative">
        <div className="main max-h-full w-1/2 lg:w-full">
          {!loading ? (
            <InstructorsList
              instructors={instructors}
              More={More}
              DefaultProfile={DefaultProfile}
              setInstructorInfo={setInstructorInfo}
            />
          ) : (
            <Loading />
          )}
        </div>
        <div
          className={`instructor-info-container w-[45%] lg:w-full lg:absolute transition-all ease-in-out duration-300 ${
            instructorInfo
              ? "opacity-100 h-auto translate-y-0"
              : "opacity-0 h-0 -translate-y-10"
          }`}
        >
          {instructorInfo && (
            <InstructorInfo
              toggleShow={toggleShow}
              currentInstructor={instructorInfo}
              setInstructorInfo={setInstructorInfo}
            />
          )}
        </div>
      </div>

      <RequestAppointmentForm
        instructor={currentInstructor}
        toggleShow={toggleShow}
        show={show}
        myInfo={myInfo}
      />
    </div>
  );
};

export default StudentDashboard;
