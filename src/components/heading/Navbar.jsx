import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/auth/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";
import { useDB } from "../../context/db/DBContext";
import Profile from "../userProfile/Profile";

const Navbar = () => {
  const auth = useAuth();
  const db = useDB();
  const [user, setUser] = useState(null);

  const handleGetUser = async () => {
    const user = await db.getUser();
    setUser(user);
    console.log(user && user.role);
  };

  useEffect(() => {
    if (user === null || user === undefined) {
      handleGetUser();
    }
  });

  return (
    <div className="navbar-container">
      <div className="logo-wrapper">
        <h2>Student Counsel</h2>
      </div>
      <div className="nav-links">
        <Link to="/">
          <p>Landing page</p>
        </Link>

        {auth.currentUser && (user && user.role) === "admin" ? (
          <Link to="/AdminDashboard">
            <p>A Dashboard</p>
          </Link>
        ) : user && user.role === "teacher" ? (
          <Link to="/TeacherDashboard">
            <p>T Dashboard</p>
          </Link>
        ) : user && user.role === "student" ? (
          <Link to="/StudentDashboard">
            <p>S Dashboard</p>
          </Link>
        ) : (
          "hello"
        )}

        <Link to="/VideoCall">
          <p>VideoCall</p>
        </Link>
        {!auth.currentUser ? (
          <>
            <Link to="/Login">
              <p>Login</p>
            </Link>
            <Link to="/StudentRegister">
              <p>Register</p>
            </Link>
          </>
        ) : (
          <>
            <img src={auth.currentUser && auth.currentUser.photoUrl} />
            <Profile />
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
