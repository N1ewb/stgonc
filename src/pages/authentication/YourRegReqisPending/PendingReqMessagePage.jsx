import React from "react";

const PendingReqMessagePage = () => {
  return (
    <div className="items-center justify-center flex flex-col text-xl font-bold text-[#320000] h-screen w-full ">
      <p className="shadow-lg rounded-[30px] p-10">
        Your <span className="font-black">registration</span> is pending, please
        wait until your Department Dean approves your request!
      </p>
      <p className="font-normal">
        Check your email to see if your registration was approved
      </p>
    </div>
  );
};

export default PendingReqMessagePage;
