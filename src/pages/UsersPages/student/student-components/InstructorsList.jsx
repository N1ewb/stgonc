import React from "react";
import { useAuth } from "../../../../context/auth/AuthContext";
import Usercard from "../../../../components/userscard/Usercard";

const InstructorsList = ({
  instructors,
  More,
  DefaultProfile,
  setInstructorInfo,
}) => {
  const auth = useAuth();

  const buttons = [
    
    {
      src: More,
      alt: "More",
      function: (instructor) => setInstructorInfo(instructor),
    },
  ];

  return (
    <div className="flex flex-row flex-wrap w-full gap-3 max-h-[100%] px-2 pb-10 !overflow-auto">
      {instructors && instructors.length !== 0 ? (
        instructors.map((instructor, index) => (
          <div
            className="w-[48%]"
            key={index}
          >
           <Usercard buttons={buttons} data={instructor} />
          </div>
        ))
      ) : (
        <div className="">No instructors</div>
      )}
    </div>
  );
};

export default InstructorsList;
