import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/landingpage/LandingPage";
import { AuthProvider } from "./context/auth/AuthContext";
import Dashboard from "./pages/dashboard/Dashboard";
import Navbar from "./components/heading/Navbar";
import VideoCall from "./pages/videocall/VideoCall";
import Login from "./pages/login/Login";
import StudentRegister from "./pages/student/student_register/Register";
import Userpage from "./pages/Users/Userpage";
import { DBProvider } from "./context/db/DBContext";
import Chatroom from "./pages/chatroom/Chatroom";
import { PrivateRoutes } from "./utils/protected-routes/routes";
import StudentDashboard from "./pages/student/dashboard/StudentDashboard";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import TeacherRegister from "./pages/teacher/teacher_register/TeacherRegister";
import TeacherDashboard from "./pages/teacher/dashboard/TeacherDashboard";
import { CallProvider } from "./context/call/CallContext";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <CallProvider>
          <div className="App">
            <BrowserRouter>
              <Navbar />
              <Routes>
                <Route path="/" exact element={<LandingPage />} />

                <Route element={<PrivateRoutes />}>
                  <Route
                    index
                    path="/StudentDashboard"
                    element={<StudentDashboard />}
                  />
                  <Route path="/AdminDashboard" element={<AdminDashboard />} />
                  <Route
                    path="/TeacherDashboard"
                    element={<TeacherDashboard />}
                  />
                  <Route path="/VideoCall" element={<VideoCall />} />
                  <Route path="/SendCallReq" element={<SendCallReq />} />
                  <Route path="/ReceiveCallReq" element={<ReceiveCallReq />} />
                  <Route path="/Chatroom" element={<Chatroom />} />
                  <Route path={`/Userpage`} element={<Userpage />} />
                  <Route path="/Dashboard" element={<Dashboard />} />
                </Route>

                <Route path="/Login" element={<Login />} />
                <Route path="/StudentRegister" element={<StudentRegister />} />
                <Route path="/TeacherRegister" element={<TeacherRegister />} />
              </Routes>
            </BrowserRouter>
          </div>
        </CallProvider>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
