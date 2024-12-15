import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import Loading from "../../../../../components/Loading/Loading";
import InsRatingCard from "./InsRatingCard";
import calculateRating from "../../../../../lib/utility/CalculateRating";

const Leaderboard = ({ insList }) => {
  const db = useDB();
  const [allRating, setAllRating] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRatings = async () => {
      setLoading(true);
      try {
        if (insList.length === 0) return;

        let ratedInstructors = await calculateRating(db, insList)
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
    <div className="leaderboard-container flex-1 overflow-auto" >
      {allRating && allRating.length > 0 &&<InsRatingCard allRating={allRating} />}
    </div>
  );
};

export default Leaderboard;
