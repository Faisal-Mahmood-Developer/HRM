import React, { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    leave: 0,
    wfh: 0
  });
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);


  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const [selectedDate, setSelectedDate] = useState(getTodayDate());



  const [personalLeave, setPersonalLeave] = useState(0);
  const [empName, setEmpName] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [uniqueIdpay, setUniqueIdpay] = useState(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/view?date=${selectedDate}`);
        const data = await res.json();
        setAttendanceList(data);
      } catch (err) {
        console.error("Failed to fetch attendance", err);
        setAttendanceList([]);
      } finally {
        setLoading(false);
      }
    };

    const fetchSummary = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/summary?date=${selectedDate}`);
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error("Failed to fetch summary", err);
      }
    };

    fetchAttendance();
    fetchSummary();
  }, [selectedDate]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (!user?.empId) return;

    setEmpName(user.name); // ✅ set name early

    const fetchEmployeeLeaves = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/attendance/leaves/all?empId=${user.empId}`);
        const data = await res.json();
        setPersonalLeave(data.length);
      } catch (err) {
        console.error("Failed to fetch employee leave records", err);
      }
    };

    fetchEmployeeLeaves();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const empId = user?.empId;
    if (!empId) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/view`);
        const data = await res.json();
        const match = data.find(emp => emp.empId === empId);
        if (match) {
          setUniqueId(match._id);
        }
      } catch (err) {
        console.error("Failed to fetch employee unique ID", err);
      }
    };

    fetchEmployee();
  }, []);


  // fetching unique payroll 
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const empId = user?.empId;
    if (!empId) return;

    const uncPayroll = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payroll/viewpayroll`);
        const data = await res.json();
        const match = data.find(emp => emp.empId === empId);
        if (match) {
          setUniqueIdpay(match._id);
        }
      } catch (err) {
        console.error("Failed to fetch employee unique ID", err);
      }
    };

    uncPayroll();
  }, []);

  const themeClass = darkMode ? "bg-dark text-white" : "";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };

  return (
    <div className={`container-fluid mt-5 ${themeClass}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Welcome {empName || "--"}</h2>
        <button className="btn btn-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <div className="mb-4">
        <label className="form-label">Select Date:</label>
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: "200px" }}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      <div className="row mb-4">
        {["Total Employees", "Present", "Leave", "Work from Home"].map((label, index) => {
          const value = [summary.total, summary.present, summary.leave, summary.wfh][index];
          const classes = ["primary", "success", "warning text-dark", "info text-dark"];
          return (
            <div className="col-md-3" key={label}>
              <div className={`card border-${classes[index].split(" ")[0]} text-center p-3`}>
                <h6>{label}</h6>
                <h2>{value}</h2>
                <span className={`badge bg-${classes[index]}`}>{label}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Attendance Records</div>
            <div className="card-body">
              {loading ? (
                <p>Loading...</p>
              ) : attendanceList.length === 0 ? (
                <p className="text-center text-muted">No records found for this month.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered text-center">
                    <thead className="table-dark">
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Emp ID</th>
                        <th>Name</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceList.map((rec, index) => (
                        <tr key={rec._id}>
                          <td>{index + 1}</td>
                          <td>{formatDate(rec.date)}</td>
                          <td>{rec.empId}</td>
                          <td>{rec.name || "--"}</td>
                          <td>
                            <span className={`badge ${rec.status === "Present" || rec.status === "Online"
                              ? "bg-success"
                              : rec.status === "Leave"
                                ? "bg-danger"
                                : rec.status === "Work from Home" || rec.status === "WFH"
                                  ? "bg-warning text-dark"
                                  : "bg-dark"
                              }`}>
                              {rec.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">Other Details</div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="card border-danger text-center p-3">
                    <h6>Your Leaves {empName ? `(${empName})` : ""}</h6>
                    <h2>{personalLeave}</h2>
                    <span className="badge bg-danger">Taken</span>
                    <hr />
                    <h6>Balance Leaves</h6>
                    <h2>{14 - personalLeave >= 0 ? 14 - personalLeave : 0}</h2>
                    <span className="badge bg-secondary">Remaining</span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-danger text-center p-3">
                    <h6>Name</h6>
                    <h2 className="mb-4">{empName || "--"}</h2>
                    <span className="">
                      {uniqueId ? (
                        <Link to={`/viewDetail/${uniqueId}`} className="btn btn-outline-success btn-sm">View Detail</Link>
                      ) : (
                        <span className="text-muted">Loading...</span>
                      )}
                    </span>
                    <hr />
                    <h6 className="mb-3">Payroll Information</h6>
                    <div className="d-flex justify-content-center">
                      {uniqueIdpay ? (
                        <Link to={`/viewPayroll/${uniqueIdpay}`} className="btn btn-outline-primary btn-sm">
                          View Payroll
                        </Link>
                      ) : (
                        <span className="text-muted">Loading...</span>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
