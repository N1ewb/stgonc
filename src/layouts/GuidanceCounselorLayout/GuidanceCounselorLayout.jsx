import React from "react";
import { Outlet } from "react-router-dom";

const GuidanceCounselorLayout = () => {
  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default GuidanceCounselorLayout;
