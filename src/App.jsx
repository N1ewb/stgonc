import React from "react";
import "./App.css";
import "react-tooltip/dist/react-tooltip.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./context/auth/AuthContext";
import { DBProvider } from "./context/db/DBContext";
import { PrivateRoutes } from "./utils/protected-routes/routes";
import { CallProvider } from "./context/call/CallContext";
import { MessagingProvider } from "./context/notification/NotificationContext";
import { StorageProvider } from "./context/storage/StorageContext";
import { ChatProvider } from "./context/chatContext/ChatContext";
import { Appointmentprovider } from "./context/appointmentContext/AppointmentContext";
import { Toaster } from "react-hot-toast";
import { PrimeReactProvider } from "primereact/api";

import Chatroom from "./pages/chatroom/Chatroom";
import LandingPage from "./pages/landingpage/LandingPage";
import VideoCall from "./pages/videocall/VideoCall";
import SendCallReq from "./pages/videocall/SendCallReq";
import ReceiveCallReq from "./pages/videocall/ReceiveCallReq";
import AdminRegistration from "./pages/authentication/register/admin_register/AdminRegistration";
import StudentRegister from "./pages/authentication/register/student_register/Register";
import TeacherRegister from "./pages/authentication/register/teacher_register/TeacherRegister";
import Userpage from "./pages/UsersPages/UsersProfile/Userpage";
import LoginPage from "./pages/authentication/login/Login";
import Layout from "./layouts/Layout";
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import GuidanceCounselorLayout from "./layouts/GuidanceCounselorLayout/GuidanceCounselorLayout";
import FacultyLayout from "./layouts/FacultyLayout/FacultyLayout";
import StudentLayout from "./layouts/StudentLayout/StudentLayout";
import AuthLayout from "./layouts/AuthLayout/AuthLayout";
import StudentDashboard from "./pages/UsersPages/student/student-pages/dashboard/StudentDashboard";
import AdminGraphs from "./pages/UsersPages/admin/admin_pages/admin_graphs/admin_graphs";
import AdminAppointmentListPage from "./pages/UsersPages/admin/admin_pages/admin_appointments/admin_appointments_list";
import AdmingPendingRegPage from "./pages/UsersPages/admin/admin_pages/admin_pending_registratons/admin_pending_reg";
import AdminSchedulesPage from "./pages/UsersPages/admin/admin_pages/admin_schedules/admin_schedules";
import AdminUserList from "./pages/UsersPages/admin/admin_pages/admin_userlist/adminUserList";
import AdminRegisteruserPage from "./pages/UsersPages/admin/admin_pages/adming_register_user/admin_reg_user";
import TeacherGraphs from "./pages/UsersPages/faculty/faculty_pages/faculty-graphs/TeacherGraphs";
import TeacherAppointmentListPage from "./pages/UsersPages/faculty/faculty_pages/appointment-list-page/TeacherAppointmentListPage";
import TeacherAppointmentReqPage from "./pages/UsersPages/faculty/faculty_pages/appointment-req-page/TeacherAppointmentReqPage";
import TeacherSchedulePage from "./pages/UsersPages/faculty/faculty_pages/schedules-page/TeacherSchedulePage";
import AdminAppointmentReqsPage from "./pages/UsersPages/admin/admin_pages/admin_appointment_reqs/AdminAppointmentReqs";
import PendingReqMessagePage from "./pages/authentication/YourRegReqisPending/PendingReqMessagePage";
import NotificationPage from "./pages/Notifications/notifications-page/NotificationPage";
import ExportToPDF from "./ComponentToPDF/ExportComponentToPDF";
import StudentAppointments from "./pages/UsersPages/student/student-pages/student-appointments/StudentAppointments";
import StudentPendingAppointments from "./pages/UsersPages/student/student-pages/student-pending-appointments/StudentPendingAppointments";
import StudentApptArchive from "./pages/UsersPages/student/student-pages/student-appointments-archive/StudentApptArchive";
import Chatslist from "./pages/messages/Messages";
import EndCallPage from "./pages/videocall/EndCallPage";
import FacultyEndCallPage from "./pages/videocall/FacultyEndCallPage";
import StudentCounselingServices from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/StudentCounselingServices";
import GuidanceRegister from "./pages/authentication/register/guidance_register/GuidanceRegister";
import GuidanceDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceDashboard";
import GuidanceAppointments from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointments";
import GuidanceAppointmentReq from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointmentReq";
import GuidanceSchedules from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceSchedules";
import Referal from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/Referal";
import Walkin from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/Walkin";
import AdminWalkinLayout from "./pages/UsersPages/admin/admin_pages/admin_walkins/AdminWalkinLayout";
import WalkinApptList from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinApptList";
import WalkinForm from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinForm";
import WalkinScheduleAppt from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinScheduleAppt";
import WalkinPendingAppointment from "./pages/UsersPages/admin/admin_pages/admin_walkins/walkin-pages/WalkinPendingAppointment";
import SCSDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/StudentCounselingServices/SCSDashboard";
import GuidanceAppointmentDashboard from "./pages/UsersPages/GuidanceCounselor/GuidancePages/GuidanceAppointments/GuidanceAppointmentDashboard";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <LandingPage />,
        },
        {
          path: "/private",
          element: <PrivateRoutes />,
          children: [
            {
              path: "/private/Admin",
              element: <AdminLayout />,
              children: [
                {
                  path: "/private/Admin/dashboard",
                  element: <AdminGraphs />,
                },
                {
                  path: "/private/Admin/dashboard/walkins",
                  element: <AdminWalkinLayout />,
                  children: [
                    {
                      path: "/private/Admin/dashboard/walkins",
                      element: <WalkinApptList />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/data-form",
                      element: <WalkinForm />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/schedule-form",
                      element: <WalkinScheduleAppt />,
                    },
                    {
                      path: "/private/Admin/dashboard/walkins/pending-walkin-appointments",
                      element: <WalkinPendingAppointment />,
                    },
                  ],
                },
                {
                  path: "/private/Admin/dashboard/appointments-list",
                  element: <AdminAppointmentListPage />,
                },
                {
                  path: "/private/Admin/dashboard/appointments-requests",
                  element: <AdminAppointmentReqsPage />,
                },
                {
                  path: "/private/Admin/dashboard/pending-registrations",
                  element: <AdmingPendingRegPage />,
                },
                {
                  path: "/private/Admin/dashboard/schedules",
                  element: <AdminSchedulesPage />,
                },
                {
                  path: "/private/Admin/dashboard/user-list",
                  element: <AdminUserList />,
                },
                {
                  path: "/private/Admin/dashboard/register-user",
                  element: <AdminRegisteruserPage />,
                },
                {
                  path: "/private/Admin/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Admin/export-components",
                  element: <ExportToPDF />,
                },
                {
                  path: "/private/Admin/messages",
                  element: <Chatslist />,
                },
              ],
            },
            {
              path: "/private/Guidance",
              element: <GuidanceCounselorLayout />,
              children: [
                {
                  path: "/private/Guidance/dashboard",
                  element: <GuidanceDashboard />,
                },
                {
                  path: "/private/Guidance/student-counseling-services",
                  element: <StudentCounselingServices />,
                  children: [
                    {
                      path: "/private/Guidance/student-counseling-services/Dashboard",
                      element: <SCSDashboard />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/Walkin",
                      element: <Walkin />,
                    },
                    {
                      path: "/private/Guidance/student-counseling-services/Referal",
                      element: <Referal />,
                    },
                  ],
                },
                {
                  path: "/private/Guidance/appointments",
                  element: <GuidanceAppointmentDashboard />,
                  children: [
                    {
                      path: "/private/Guidance/appointments/list",
                      element: <GuidanceAppointments />,
                    },
                    {
                      path: "/private/Guidance/appointments/request",
                      element: <GuidanceAppointmentReq />,
                    },
                  ],
                },

                {
                  path: "/private/Guidance/schedules",
                  element: <GuidanceSchedules />,
                },
                {
                  path: "/private/Guidance/notifications",
                  element: <NotificationPage />,
                },
              ],
            },
            {
              path: "/private/Faculty",
              element: <FacultyLayout />,
              children: [
                {
                  path: "/private/Faculty/dashboard",
                  element: <TeacherGraphs />,
                },
                {
                  path: "/private/Faculty/appointments-list",
                  element: <TeacherAppointmentListPage />,
                },
                {
                  path: "/private/Faculty/appointments-request",
                  element: <TeacherAppointmentReqPage />,
                },
                {
                  path: "/private/Faculty/schedules",
                  element: <TeacherSchedulePage />,
                },
                {
                  path: "/private/Faculty/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Faculty/messages",
                  element: <Chatslist />,
                },
              ],
            },
            {
              path: "/private/Student",
              element: <StudentLayout />,
              children: [
                {
                  path: "/private/Student/dashboard",
                  element: <StudentDashboard />,
                },
                {
                  path: "/private/Student/dashboard/appointments",
                  element: <StudentAppointments />,
                },
                {
                  path: "/private/Student/dashboard/pending-appointments",
                  element: <StudentPendingAppointments />,
                },
                {
                  path: "/private/Student/dashboard/appointments-archive",
                  element: <StudentApptArchive />,
                },
                {
                  path: "/private/Student/notifications",
                  element: <NotificationPage />,
                },
                {
                  path: "/private/Student/messages",
                  element: <Chatslist />,
                },
              ],
            },

            {
              path: "/private/VideoCall",
              element: <VideoCall />,
            },
            {
              path: "/private/SendCallReq",
              element: <SendCallReq />,
            },
            {
              path: "/private/ReceiveCallReq",
              element: <ReceiveCallReq />,
            },
            {
              path: "/private/Chatroom",
              element: <Chatroom />,
            },
            {
              path: "/private/Userpage",
              element: <Userpage />,
            },
            {
              path: "/private/end-call-page",
              element: <FacultyEndCallPage />,
            },
            {
              path: "/private/Endcallpage",
              element: <EndCallPage />,
            },
          ],
        },
        {
          path: "/auth",
          element: <AuthLayout />,
          children: [
            {
              path: "/auth/Login",
              element: <LoginPage />,
            },
            {
              path: "/auth/StudentRegistration",
              element: <StudentRegister />,
            },
            {
              path: "/auth/FacultyRegistration",
              element: <TeacherRegister />,
            },
            {
              path: "/auth/AdminRegister",
              element: <AdminRegistration />,
            },
            {
              path: "/auth/GuidanceRegister",
              element: <GuidanceRegister />,
            },
            {
              path: "/auth/PendingRequestMessage",
              element: <PendingReqMessagePage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <AuthProvider>
      <MessagingProvider>
        <DBProvider>
          <CallProvider>
            <StorageProvider>
              <ChatProvider>
                <Appointmentprovider>
                  <PrimeReactProvider>
                    <div className="App h-full w-full bg-[#320000] overflow-auto">
                      <RouterProvider router={router} />
                      <Toaster />
                    </div>
                  </PrimeReactProvider>
                </Appointmentprovider>
              </ChatProvider>
            </StorageProvider>
          </CallProvider>
        </DBProvider>
      </MessagingProvider>
    </AuthProvider>
  );
}

export default App;
