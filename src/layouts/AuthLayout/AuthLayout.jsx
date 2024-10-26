import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <main className="h-[100%] w-full bg-white">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
