import React, { useEffect, useState } from "react";
import Stars from "../../../../static/images/Subtract.png";
import { useDB } from "../../../../context/db/DBContext";

const InstructorInfo = ({
  currentInstructor,
  setInstructorInfo,
  toggleShow,
}) => {
  const db = useDB();
  const [ratingList, setRatingList] = useState([]);
  const [facultyRating, setFacultyRating] = useState(0);

  useEffect(() => {
    setFacultyRating(0);
    const fetchData = async () => {
      const unsubscribe = db.subscribeToRatingChanges((callback) => {
        setRatingList(callback);
      }, currentInstructor.id);
      return () => unsubscribe();
    };
    fetchData();
  }, [db, currentInstructor.id]);

  useEffect(() => {
    const calculateFacultyRating = () => {
      if (ratingList.length === 0) {
        setFacultyRating(0);
        return;
      }

      const totalRatings = ratingList.reduce(
        (sum, rating) => sum + Number(rating.facultyRating),
        0
      );

      var averageRating = totalRatings / ratingList.length;
      averageRating = Math.min(Number(averageRating), 5);
      setFacultyRating(averageRating);
    };

    calculateFacultyRating();
  }, [ratingList]);

  return (
    <div className="faculty-info h-auto flex flex-col w-full bg-white shadow-lg rounded-[30px] p-10 xsm:p-5 xxsm:p-3 relative overflow-hidden xsm:z-20 ">
      <div className="faculty-info-header flex items-center justify-between border-b-[1px] border-solid border-[#aeaeae] mb-4 xsm:mb-2">
        <h1 className="text-[#720000] text-3xl xsm:text-[16px] xxsm:text-[12px]">
          Faculty Info
        </h1>
        <button
          className="bg-[#320000] hover:bg-[rgb(114,0,0)] rounded-md text-white text-3xl xsm:text-[12px] xsm:p-2"
          onClick={() => setInstructorInfo(null)}
        >
          X
        </button>
      </div>
      <div className="faculty-info flex xsm:flex-col-reverse xsm:items-center w-full justify-between">
        <div className="faculty-info-content flex-col flex xsm:flex-row xsm:flex-wrap [&_span]:text-[#d1d1d1] [&_p]:m-0 gap-3 xsm:[&_p]:text-[8px]">
          <p className="capitalize">
            <span className="">Name: </span>
            <br></br>
            {currentInstructor.firstName} {currentInstructor.lastName}
          </p>
          <p className="">
            <span className="">Email: </span>
            <br></br>
            {currentInstructor.email}
          </p>
          <p>
            <span>Faculty ID Number: </span>
            <br></br>
            {currentInstructor.facultyIdnumber}
          </p>
          <p>
            <span>Department: </span>
            <br></br>
            {currentInstructor.department}
          </p>
        </div>
        <div className="faculty-profile w-[47%] h-[100%] flex flex-col items-center justify-center rounded-md p-[2px]">
          <div className="profile-wrapper flex items-center justify-center w-[250px] h-[250px] xsm:w-[150px] xsm:h-[150px] xxsm:w-[100px] xxsm:h-[100px] bg-[#320000] rounded-md">
            <img
              className="h-[100%] max-h-[100%] w-full object-cover object-center"
              src={currentInstructor.photoURL}
              alt="Faculty Profile"
            />
          </div>
          <div className="faculty-rating w-full">
            <div className="stars-wrapper w-full bg-[#d4d4d4] relative">
              <div
                className="stars-progress h-[100%] bg-yellow-400 absolute top-0 left-0 z-10"
                style={{
                  width: `${(facultyRating / 5) * 100}%`,
                  maxWidth: "250px",
                }}
              ></div>
              <img
                src={Stars}
                alt="stars"
                className="z-20 w-full h-auto relative"
              />
            </div>
            <p>
              <span className="xsm:text-[12px]">
                Out of: {facultyRating.toFixed(1)} / 5
              </span>
            </p>
          </div>
        </div>
      </div>
      <div className="faculty-info-footer  w-full justify-between gap-10 flex flex-row  items-center [&_p]:m-0 [&_span]:text-[#d1d1d1] mt-5">
        <p className="flex items-center justify-center gap-2">
          <span>Status: </span>
          <span className="p-2 bg-red-400 rounded-md"></span>
        </p>

        <button
          className="bg-[#360000] rounded-[4px] px-6 py-2 hover:bg[#323232]"
          onClick={() => toggleShow(currentInstructor)}
        >
          Request Appointment
        </button>
      </div>
    </div>
  );
};

export default InstructorInfo;
