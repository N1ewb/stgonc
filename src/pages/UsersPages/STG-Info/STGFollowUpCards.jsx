import React from "react";

const STGAllFollowUpCards = ({ followup }) => {
  return (
    <div className="text-[16px] w-[30%] h-auto shadow-lg rounded-xl p-10">
      <header className="flex justify-between"><h2 className="text-[16px]">{followup.appointmentDate}</h2> <button>Download</button></header>
      <main></main>
    </div>
  );
};

export default STGAllFollowUpCards;
