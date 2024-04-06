import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import StudentDashboard from "../student/dashboard/StudentDashboard";
import TeacherDashboard from "../teacher/dashboard/TeacherDashboard";
import AdminDashboard from "../admin/dashboard/AdminDashboard";
import { useDB } from "../../context/db/DBContext";

const Dashboard = () => {
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
  }, []);
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

export default Dashboard;
