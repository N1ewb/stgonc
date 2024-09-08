import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";
import "./DashboardSelector.css";
import StudentDashboard from "../UsersPages/student/dashboard/StudentDashboard";
import TeacherDashboard from "../UsersPages/faculty/dashboard/TeacherDashboard";
import AdminDashboard from "../UsersPages/admin/dashboard/AdminDashboard";

const DashboardSelector = () => {
  const auth = useAuth();
  const db = useDB();
  const [user, setUser] = useState();

  const handleGetUser = async () => {
    if (auth.currentUser) {
      const user = await db.getUser(auth.currentUser?.uid);
      setUser(user);
    }
  };

  useEffect(() => {
    if (auth.currentUser) {
      handleGetUser();
    }
  }, [auth.currentUser]);

  return (
    <div>
      {user && user.role === "Student" ? (
        <StudentDashboard />
      ) : user && user.role === "Teacher" ? (
        <TeacherDashboard />
      ) : user && user.role === "Admin" ? (
        <AdminDashboard />
      ) : (
        <h1>Invalid Role</h1>
      )}
    </div>
  );
};

export default DashboardSelector;
