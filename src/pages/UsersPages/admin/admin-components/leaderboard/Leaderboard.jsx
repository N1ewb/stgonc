import React, { useEffect, useState } from "react";
import { useDB } from "../../../../../context/db/DBContext";
import Loading from "../../../../../components/Loading/Loading";

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
      <RatedInsCard allRating={allRating} />
    </div>
  );
};

export default Leaderboard;

const RatedInsCard = ({ allRating }) => {
  return (
    <div className="w-full h-full overflow-hidden flex flex-col">
      <table className="w-full">
        <thead>
          <tr className="grid grid-cols-6 w-full">
            <th className="col-span-1 text-left">Place</th>
            <th className="col-span-4 text-left">Name</th>
            <th className="col-span-1 text-left">Avg Rating</th>
          </tr>
        </thead>
      </table>
      <div className="overflow-y-auto flex-grow">
        <table className="w-full">
          <tbody>
            {allRating.map((item, index) => (
              <tr
                key={index}
                className="grid grid-cols-6 w-full py-2 items-center border-solid border-b-2 border-b-[#cacaca]"
              >
                <td className="col-span-1">{index + 1}</td>
                <td className="col-span-4 flex items-center space-x-4 gap-3">
                  <img
                    src={item.ins.photoURL}
                    alt="profile"
                    className="h-[50px] w-[50px] rounded-full object-cover object-center bg-[#320000]"
                  />
                  {item.ins.firstName} {item.ins.lastName}
                </td>
                <td className="col-span-1">{item.avgRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
