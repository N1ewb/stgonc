import React from "react";
import Usercard from "../../../../components/userscard/Usercard";

const InstructorsList = ({
  instructors,
  More,
  setInstructorInfo,
}) => {

  const buttons = [ 
    
    {
      src: More,
      alt: "More",
      function: (instructor) => setInstructorInfo(instructor),
      needsParams: true
    },
  ];

  return (
    <div className="flex flex-row flex-wrap w-full gap-2 xsm:gap-1 max-h-[95%] lg:px-2 pb-10  !overflow-x-hidden !overflow-y-auto">
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
