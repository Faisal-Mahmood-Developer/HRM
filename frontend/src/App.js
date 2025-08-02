import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

import Sidebar from "./components/sidebar";
import AddEmp from "./components/addEmp";
import ViewEmp from "./components/viewEmp";
import Home from "./components/home";
import DepartmentView from "./components/departments";
import AddMedical from "./components/addMedical";
import Addexpense from "./components/addExpneses";
import Inventory from "./components/addinventory";
import AddPayroll from "./components/addPayroll";
import QaDepart from "./components/qaDepart";
import SoftwareDepart from "./components/softwareDeprt";
import Dbdepart from "./components/dbDepart";
import EditEmployee from "./components/editEmployees";
import EditPayroll from "./components/EditPayroll";
import CreateAccountPage from "./components/createAcc";
import LoginPage from "./components/loginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewInventory from "./components/viewInventory";
import EditInventory from "./components/editinventory";
import AttendancePage from "./components/AttendancePage";
import ViewDetail from "./components/ViewDetail";
import ChangePassword from "./components/ChangePassword";
import PayrollDetail from './components/PayrollDetail';
import LeaveRequest from "./components/leaveManage";
import AdminLeaveManager from "./components/LeaveRequestsAdmin";
function App() {
  const [login, setLogin] = useState(() => !!localStorage.getItem('loggedInUser'));
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Apply theme class to <body>
  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage setLogin={setLogin} />} />
        <Route path="/createAcc" element={<CreateAccountPage />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute isAllowed={login}>
              <Sidebar setLogin={setLogin} darkMode={darkMode} setDarkMode={setDarkMode} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home />} />
          <Route path="addemp" element={<AddEmp />} />
          <Route path="viewemp" element={<ViewEmp />} />
          <Route path="administration" element={<DepartmentView />} />
          <Route path="addMedical" element={<AddMedical />} />
          <Route path="addExpense" element={<Addexpense />} />
          <Route path="addInventory" element={<Inventory />} />
          <Route path="addPayroll" element={<AddPayroll />} />
          <Route path="qa" element={<QaDepart />} />
          <Route path="software" element={<SoftwareDepart />} />
          <Route path="db" element={<Dbdepart />} />
          <Route path="editEmployee/:id" element={<EditEmployee />} />
          <Route path="editPayroll/:id" element={<EditPayroll />} />
          <Route path="viewInventory" element={<ViewInventory />} />
          <Route path="editInventory/:id" element={<EditInventory />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/viewDetail/:id" element={<ViewDetail />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/viewPayroll/:id" element={<PayrollDetail />} />
          <Route path="/leave" element={<LeaveRequest />} />
          <Route path="/admin/requests" element={<AdminLeaveManager  />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
