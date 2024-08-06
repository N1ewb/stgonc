import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
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
import TeacherRegister from "./pages/teacher/teacher_register/TeacherRegister";
import { CallProvider } from "./context/call/CallContext";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";
import { MessagingProvider } from "./context/notification/NotificationContext";
import AdminRegistration from "./pages/admin/admin_register/AdminRegistration";

function App() {
  return (
    <AuthProvider>
      <DBProvider>
        <CallProvider>
          <MessagingProvider>
            <div className="App">
              <BrowserRouter>
                <Navbar />
                <Routes>
                  <Route path="/" exact element={<LandingPage />} />
                  <Route element={<PrivateRoutes />}>
                    <Route path="/VideoCall" element={<VideoCall />} />
                    <Route path="/SendCallReq" element={<SendCallReq />} />
                    <Route
                      path="/ReceiveCallReq"
                      element={<ReceiveCallReq />}
                    />
                    <Route path="/Chatroom" element={<Chatroom />} />
                    <Route path="/Userpage" element={<Userpage />} />
                    <Route path="/Dashboard" element={<Dashboard />} />
                  </Route>
                  <Route path="/Login" element={<Login />} />
                  <Route
                    path="/StudentRegister"
                    element={<StudentRegister />}
                  />
                  <Route
                    path="/TeacherRegister"
                    element={<TeacherRegister />}
                  />
                  <Route
                    path="/AdminRegister"
                    element={<AdminRegistration />}
                  />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </BrowserRouter>
            </div>
          </MessagingProvider>
        </CallProvider>
      </DBProvider>
    </AuthProvider>
  );
}

export default App;
