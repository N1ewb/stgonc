import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth/AuthContext";
import { useDB } from "../../context/db/DBContext";
import "./Dashboard.css";
import StudentDashboard from "../UsersPages/student/dashboard/StudentDashboard";
import TeacherDashboard from "../UsersPages/faculty/dashboard/TeacherDashboard";
import AdminDashboard from "../UsersPages/admin/dashboard/AdminDashboard";

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
  }, [auth.currentUser]);
  //Generate Schedule Collection Code
  // const timeslots = [
  //   "07:00-08:00",
  //   "08:00-09:00",
  //   "09:00-10:00",
  //   "10:00-11:00",
  //   "11:00-12:00",
  //   "12:00-13:00",
  //   "13:00-14:00",
  //   "14:00-15:00",
  //   "15:00-16:00",
  //   "16:00-17:00",
  //   "17:00-18:00",
  //   "18:00-19:00",
  //   "19:00-20:00",
  // ];

  // useEffect(() => {
  //   const handleGenerateSchedule = async () => {
  //     daysOfWeek.flatMap(async (day) =>
  //       timeslots.map(async (slot) => await db.generateSchedules(day, slot))
  //     );
  //   };
  //   handleGenerateSchedule();
  // }, []);

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
