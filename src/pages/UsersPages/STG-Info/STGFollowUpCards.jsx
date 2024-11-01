import React from "react";

const STGAllFollowUpCards = ({ followup, appointee, setCurrentAppt, currentAppt }) => {
  return (
    <div
      onClick={() => setCurrentAppt(currentAppt && currentAppt === followup ? null : followup)}
      className="cursor-pointer text-[16px] w-1/2 flex flex-col p-3 text-[#320000] rounded-3xl h-fit
      shadow-inner border border-[#ADADAD] hover:shadow-lg hover:shadow-[#320000]/40 bg-white"
    >
      <header className="flex justify-between border-b-[1px] border-[#7b7b7b] border-solid">
        <div className="deets flex flex-col">
          <h1 className="text-[20px] font-bold">{followup.appointmentType}</h1>
          <p>{`${appointee?.firstName} ${appointee?.lastName}`}</p>
        </div>
      </header>
      <footer className="flex justify-between items-center p-1">
        <p className="text-[16px]">{followup.appointmentDate}</p>
        <button className="bg-[#72B9FF] rounded-3xl py-2 px-3">Download</button>
      </footer>
    </div>
  );
};

export default STGAllFollowUpCards;
