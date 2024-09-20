import React from "react";
import { useAuth } from "../../../../context/auth/AuthContext";

const InstructorsList = ({ instructors, More, DefaultProfile, setInstructorInfo }) => {
  const auth = useAuth();
  return (
    <div className="flex flex-col gap-3 max-h-[100%] pb-10 !overflow-auto">
      {instructors && instructors.length !== 0 ? (
        instructors.map((instructor, index) => (
          <div
            className="CCS-instructor-cards-container w-full flex flex-row justify-between items-center text-[15px] shadow-md p-3 rounded-md"
            key={index}
          >
            <div className=" flex-row flex items-center gap-2  w-[60%]">
              <img
                className="w-[80px] h-[80px] rounded-full object-cover p-1 bg-[#320000]"
                src={instructor.photoURL ? instructor.photoURL : DefaultProfile}
                alt="profile picture"
              />
              <p className="w-[50%] text-[#360000]">
                {instructor.firstName} {instructor.lastName}
                <br></br>
                <span className="text-sm text-[#d4d4d4]">
                  {instructor.email}
                </span>
              </p>
            </div>

           
            <button className="bg-transparent py-2 px-4" onClick={() => setInstructorInfo(instructor)}>
              <img src={More} alt="more" width={25} height={25} />
            </button>
          </div>
        ))
      ) : (
        <div className="">No instructors</div>
      )}
    </div>
  );
};

export default InstructorsList;
