import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import { useAuth } from "../../../../../context/auth/AuthContext";
import TopInstructors from "./TopInstructors";
import Leaderboard from "./Leaderboard";
import Loading from "../../../../../components/Loading/Loading";

const FacultyLeaderboard = () => {
  const db = useDB();
  const auth = useAuth();
  const [insList, setInsList] = useState([]);
  const [topInstructors, setTopInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setLoading(true);
      try {
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
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [insList, db]);

  if(loading){
    return <Loading />
  }

  return (
    <div className="h-[100%] w-full flex flex-col justify-start">
      <h5 className="text-[#320000] font-light">
        Faculty <span className="font-bold">Leaderboard</span>
      </h5>
      {topInstructors.length > 0 ? (
        <div className="top-instructors flex flex-col gap-5">
          <TopInstructors topInstructors={topInstructors} />
          <Leaderboard insList={insList} />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default FacultyLeaderboard;
