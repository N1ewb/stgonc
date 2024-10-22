import React from "react";
import "./Usercard.css";
import { useAuth } from "../../context/auth/AuthContext";
import DefaultProfile from '../../static/images/default-profile.png'
import Footer from "./Footer";

const Usercard = ({ data , buttons }) => {
  const auth = useAuth();
  
  return (
    <div className="datacard-container h-auto w-full flex flex-col p-3 text-[#320000] border-[1px] border-solid border-[#ADADAD] rounded-3xl">
      <div className="div flex flex-row h-full w-full pb-3 gap-3 border-b-[1px] border-solid border-[#777777]">
            <img
              className="w-[50px] p-[2px] bg-[#320000] h-[50px] rounded-full object-cover"
              src={data.photoURL ? data.photoURL : DefaultProfile}
              alt="profile"
            />

            <p className="text-[16px] flex flex-col">
              <span className="font-bold">{data.firstName + " " + data.lastName}</span>
              <span className="text-[#360000] text-base font-light">{data?.email}</span>
            </p>
          </div>
      <footer className="pt-2 w-full">
        <Footer buttons={buttons} data={data} />
      </footer>
    </div>
  );
};

export default Usercard;
