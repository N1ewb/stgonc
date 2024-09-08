import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth/AuthContext";
import Navbar from "../components/heading/Navbar";
import { useDB } from "../context/db/DBContext";

const Layout = () => {
  const auth = useAuth();
  const db = useDB();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRedirect = async () => {
      if (auth.currentUser) {
        try {
          const user = await db.getUser(auth.currentUser.uid);
          if (user) {
            const userRole = user.role;
            console.log(userRole);
            if (userRole === "Student") {
              navigate("/private/student/dashboard");
            } else if (userRole === "Teacher") {
              navigate("/private/faculty/dashboard");
            } else if (userRole === "Admin") {
              navigate("/private/admin/dashboard");
            } else if (userRole === "GuidanceCounsellor") {
              navigate("/private/guidance-counselor/dashboard");
            } else {
              navigate("/");
            }
          } else {
            console.error("User not found or failed to fetch user details.");
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserAndRedirect();
  }, [auth.currentUser, navigate]);

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <main>
        <div className="outlet h-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
