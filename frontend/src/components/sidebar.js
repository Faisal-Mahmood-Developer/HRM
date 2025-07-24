import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Sidebar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user || !user.empId) {
      navigate('/login');
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setSidebarVisible(prev => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>

      {/* Sidebar */}
      <div
        className={`position-fixed ${sidebarVisible ? 'bg-dark' : 'bg-white'}`}
        style={{
          height: '100vh',
          width: sidebarVisible ? '200px' : '60px',
          overflow: 'hidden',
          transition: 'width 0.3s ease',
          top: 0,
          left: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          alignItems: sidebarVisible ? 'flex-start' : 'center',
          paddingTop: '1rem'
        }}
      >
        {/* Toggle Button */}
        <button className="btn btn-light mb-4 ms-2" onClick={toggleSidebar}>
          ☰
        </button>

        <ul
          className="nav flex-column w-100"
          style={{
            display: 'flex',
            alignItems: sidebarVisible ? 'flex-start' : 'center',
          }}
        >
          {/* Home */}
          <li className="nav-item w-100">
            <Link
              className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start ps-2 text-white' : 'justify-content-center text-dark'}`}
              to="/"
            >
              <i className={`fas fa-home ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
              {sidebarVisible && <span className="ms-2">Home</span>}
            </Link>
          </li>

          {/* Employees */}
          <li className="nav-item w-100">
            <a
              className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start  text-white' : 'justify-content-center text-dark'}`}
              data-bs-toggle="collapse"
              href="#employeeSubmenu"
              role="button"
            >
              <i className={`fas fa-users ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
              {sidebarVisible && <span className="ms-2">Employees</span>}
            </a>
            <div className="collapse" id="employeeSubmenu">
              {isAdmin && (
                <Link
                  className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                  to="/addemp"
                >
                  <i className={`fas fa-user-plus ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                  {sidebarVisible && <span className="ms-2">Add Emp</span>}
                </Link>
              )}

              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/viewemp"
              >
                <i className={`fas fa-eye ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">View Emp</span>}
              </Link>
            </div>

          </li>

          {/* Departments */}
          <li className="nav-item w-100">
            <a
              className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start ps-2 text-white' : 'justify-content-center text-dark'}`}
              data-bs-toggle="collapse"
              href="#adddepart"
              role="button"
            >
              <i className={`fas fa-building ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
              {sidebarVisible && <span className="ms-2">Departments</span>}
            </a>
            <div className="collapse" id="adddepart">
              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/software"
              >
                <i className={`fas fa-laptop-code ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">Software</span>}
              </Link>

              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/qa"
              >
                <i className={`fas fa-vial ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">Q A</span>}
              </Link>

              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/db"
              >
                <i className={`fas fa-database ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">Database</span>}
              </Link>

              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/administration"
              >
                <i className={`fas fa-user-shield ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">Administration</span>}
              </Link>
            </div>

          </li>

          {/* Admin-only Sections */}
          {isAdmin && (
            <>
              {/* Payroll */}
              <li className="nav-item w-100">
                <a
                  className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start -2 text-white' : 'justify-content-center text-dark'}`}
                  data-bs-toggle="collapse"
                  href="#Attendance"
                  role="button"
                >
                  <i className={`fas fa-calendar-check ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                  {sidebarVisible && <span className="ms-2">Payroll</span>}
                </a>
                <div className="collapse" id="Attendance">
                  <Link
                    className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                    to="/addPayroll"
                  >
                    <i className={`fas fa-file-invoice-dollar ms-2 ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                    {sidebarVisible && <span className="ms-2">Payroll Details</span>}
                  </Link>
                </div>

              </li>

              {/* Medical */}
              <li className="nav-item w-100">
                <a
                  className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start -2 text-white' : 'justify-content-center text-dark'}`}
                  data-bs-toggle="collapse"
                  href="#meidcal"
                  role="button"
                >
                  <i className={`fas fa-notes-medical ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                  {sidebarVisible && <span className="ms-2">Medical</span>}
                </a>
                <div className="collapse " id="meidcal">
                  <Link
                    className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                    to="/addMedical"
                  >
                    <i className={`fas fa-briefcase-medical ms-2 ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                    {sidebarVisible && <span className="ms-2">Medical Details</span>}
                  </Link>
                </div>

              </li>

              {/* Expenses */}
              <li className="nav-item w-100">
                <a
                  className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start -2 text-white' : 'justify-content-center text-dark'}`}
                  data-bs-toggle="collapse"
                  href="#expense"
                  role="button"
                >
                  <i className={`fas fa-wallet ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                  {sidebarVisible && <span className="ms-2">Expenses</span>}
                </a>
                <div className="collapse -3" id="expense">
                  <Link
                    className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                    to="/addExpense"
                  >
                    <i className={`fas fa-receipt ms-2 ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                    {sidebarVisible && <span className="ms-2">Expense Details</span>}
                  </Link>

                </div>
              </li>

              {/* Inventory */}
              <li className="nav-item w-100">
                <a
                  className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start -2 text-white' : 'justify-content-center text-dark'}`}
                  data-bs-toggle="collapse"
                  href="#Acces"
                  role="button"
                >
                  <i className={`fas fa-boxes ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                  {sidebarVisible && <span className="ms-2">Inventory</span>}
                </a>
                <div className="collapse" id="Acces">
                  <Link
                    className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                    to="/addInventory"
                  >
                    <i className={`fas fa-plus-square ms-2 ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                    {sidebarVisible && <span className="ms-2">Add Inventory</span>}
                  </Link>

                  <Link
                    className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                    to="/viewInventory"
                  >
                    <i className={`fas fa-eye ms-2 ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                    {sidebarVisible && <span className="ms-2">View Inventory</span>}
                  </Link>
                </div>

              </li>
            </>
          )}

          {/* Attendance */}
          <li className="nav-item w-100">
            <a
              className={`nav-link d-flex align-items-center ${sidebarVisible ? 'justify-content-start -2 text-white' : 'justify-content-center text-dark'}`}
              data-bs-toggle="collapse"
              href="#attendance"
              role="button"
            >
              <i className={`fas fa-calendar-alt ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
              {sidebarVisible && <span className="ms-2">Attendance</span>}
            </a>
            <div className="collapse ps-2" id="attendance">
              <Link
                className={`nav-link d-flex align-items-center ${sidebarVisible ? 'text-white' : 'text-dark'}`}
                to="/attendance"
              >
                <i className={`fas fa-list ${sidebarVisible ? 'text-white' : 'text-dark'}`}></i>
                {sidebarVisible && <span className="ms-2">View Details</span>}
              </Link>
            </div>

          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: sidebarVisible ? '200px' : '60px',
          transition: 'margin-left 0.3s ease',
          width: '100%'
        }}
      >
        {/* Navbar */}
        <div className={`p-3 border-bottom d-flex justify-content-between align-items-center ${sidebarVisible ? 'bg-dark text-white' : 'bg-light text-dark'}`}>

          <h2 className={`mb-0 ${sidebarVisible ? 'text-white' : 'text-dark'}`}>
            {/* People Bridge */}
            Cache Cloud

          </h2>

          <div className="d-flex align-items-center gap-3">
            <div className="position-relative me-3">
              <button className="btn btn-outline-light position-relative" onClick={() => setDarkMode(prev => !prev)}>
                {darkMode ? <i className="fas fa-sun"></i> : <i className="fas fa-moon"></i>}
              </button>
            </div>
            <div className="dropdown">
              <button className="btn btn-danger dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-cog me-2"></i> Settings
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
                <li>
                  <Link className="dropdown-item" to="/change-password">
                    <i className="fas fa-key me-2"></i> Change Password
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link className="dropdown-item" to="/createAcc">
                      <i className="fas fa-user-plus me-2"></i> Create Account
                    </Link>
                  </li>
                )}
                <li>
                  <button onClick={handleLogout} className="dropdown-item">
                    <i className="fas fa-sign-out-alt me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;



