const calculateRating = async (db, insList) => {
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
        avgRating: Math.min(averageRating, 5).toFixed(2),
      });
    }
  }
  const top3 = ratedInstructors
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 3);

  return top3;
};

export default calculateRating;
