import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import Loading from "../../../../../components/Loading/Loading";
import InsRatingCard from "./InsRatingCard";

const Leaderboard = ({ insList }) => {
  const db = useDB();
  const [allRating, setAllRating] = useState([]);
  const [loading, setLoading] = useState(true);
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
        const sortedIns = ratedInstructors.sort(
          (a, b) => b.avgRating - a.avgRating
        );

        setAllRating(sortedIns);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatings();
  }, [insList, db]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="leaderboard-container">
      {allRating && <InsRatingCard allRating={allRating} />}
    </div>
  );
};

export default Leaderboard;
