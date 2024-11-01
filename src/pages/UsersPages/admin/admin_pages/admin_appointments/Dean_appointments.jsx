import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavLink from "../../../../../components/buttons/NavLinks";
import AdminSearchBar from "../../admin-components/AdminSearchBar";

const DeanAppointments = () => {
    const location = useLocation();
    const navigate = useNavigate()

    useEffect(() => {
        if(location.pathname === '/private/Admin/dashboard/appointments'){
            navigate('/private/Admin/dashboard/appointments/list')
        }
    },[location])

    return (
      <div className="w-full h-full">
        <header className="flex flex-row justify-between w-full">
          <h1 className="font-light">Appointment</h1>
          <div className="nav-links flex flex-row items-center gap-5  bg-[#320000] px-10 py-3 rounded-3xl w-[70%]">
            <NavLink
              to="/private/Admin/dashboard/appointments/list"
              location={location}
              label="Upcoming"
            />
              <NavLink
                to="/private/Admin/dashboard/appointments/followup"
                location={location}
                label="Followup"
              />
            <NavLink
              to="/private/Admin/dashboard/appointments/requests"
              location={location}
              label="Requests"
            />
            <NavLink
              to="/private/Admin/dashboard/appointments/archive"
              location={location}
              label="Archive"
            />
            {/* <div className="search-bar w-1/4"><AdminSearchBar /></div> */}
          </div>
        </header>
        <main className="w-full h-full">
          <Outlet />
        </main>
      </div>
    );
  };
  

export default DeanAppointments;
