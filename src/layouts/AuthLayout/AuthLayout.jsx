import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="h-[100%] w-full">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
