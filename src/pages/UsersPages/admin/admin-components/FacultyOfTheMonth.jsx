import React, { useEffect, useState } from "react";
import { useDB } from "../../../../context/db/DBContext";
import { useAuth } from "../../../../context/auth/AuthContext";

const FacultyOfTheMonth = () => {
  const db = useDB();
  const auth = useAuth();
  const [insList, setInsList] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);

  useEffect(() => {
    const fetchInstructors = async () => {
      const unsubscribe = await db.subscribeToInstructorChanges((callback) => {
        setInsList(callback);
      });
      return () => unsubscribe();
    };

    fetchInstructors();
  }, [db]);

  useEffect(() => {
    const fetchRatings = async () => {
      if (insList.length === 0) return;

      let ratedInstructors = [];

      for (const ins of insList) {
        const ratings = await db.getFacultyRatings(ins.id);

        if (ratings.length > 0) {
          const totalRatings = ratings.reduce(
            (sum, rating) => sum + Number(rating.facultyRating),
            0
          );

          const averageRating = totalRatings / ratings.length;

          ratedInstructors.push({
            ins,
            avgRating: Math.min(averageRating, 5),
          });
        }
      }
      const top3 = ratedInstructors
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 3);

      setTopInstructors(top3);
    };

    fetchRatings();
  }, [insList, db]);

  return (
    <div>
      <h5 className="text-[#320000] font-bold">
        Faculty <span className="font-light">of the Month</span>
      </h5>
      {topInstructors.length > 0 ? (
        <div className="top-instructors flex gap-5">
          <div className="w-[60%] flex justify-center">
            <div
              className="instructor-card p-5 rounded-xl shadow-md flex flex-col items-center w-[300px] h-[455px]"
            >
              <div
                className="profile-wrapper h-[200px] w-[200px] flex justify-center items-center bg-[#320000] p-2 rounded-lg overflow-hidden"
              >
                <img
                  className="object-cover object-center w-full h-full scale-110"
                  src={topInstructors[0].ins.photoURL}
                  alt="profile"
                />
              </div>
              <div className="instructor-details mt-4 text-center">
                <p>
                  {topInstructors[0].ins.firstName}{" "}
                  {topInstructors[0].ins.lastName}
                </p>
                <p>Average Rating: {topInstructors[0].avgRating}</p>
              </div>
            </div>
          </div>

          <div className="w-[40%] flex flex-col gap-3">
            {topInstructors.slice(1).map((instructor, index) => (
              <div
                key={index}
                className="instructor-card p-1 rounded-xl shadow-md flex flex-col items-center w-[220px] h-[220px]"
              >
                <div
                  className="profile-wrapper h-[100px] w-[100px] flex justify-center items-center bg-[#320000] p-2 rounded-lg overflow-hidden"
                >
                  <img
                    className="object-cover object-center w-full h-full scale-110"
                    src={instructor.ins.photoURL}
                    alt="profile"
                  />
                </div>

                <div className="instructor-details mt-4 text-center">
                  <p>
                    {instructor.ins.firstName}{" "}
                    {instructor.ins.lastName}
                  </p>
                  <p>Average Rating: {instructor.avgRating}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No ratings available.</p>
      )}
    </div>
  );
};

export default FacultyOfTheMonth;
