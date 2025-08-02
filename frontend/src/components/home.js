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
  const [approvedLeaveCount, setApprovedLeaveCount] = useState(0);
  const [personalLeave, setPersonalLeave] = useState(0); // ✅ Add this
  const [empName, setEmpName] = useState("");
  const [uniqueId, setUniqueId] = useState(null);
  const [uniqueIdpay, setUniqueIdpay] = useState(null);
  const [approvedLeaves, setApprovedLeaves] = useState([]);

  // for all 

  useEffect(() => {
    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);

        const [attendanceRes, summaryRes, leavesRes] = await Promise.all([
          fetch(`http://localhost:5000/api/attendance/view?date=${selectedDate}`),
          fetch(`http://localhost:5000/api/attendance/summary?date=${selectedDate}`),
          fetch(`http://localhost:5000/api/leaves/approved-leaves-details?date=${selectedDate}`)
        ]);

        const [attendanceData, summaryData, leaveData] = await Promise.all([
          attendanceRes.json(),
          summaryRes.json(),
          leavesRes.json()
        ]);

        setSummary(summaryData);
        setApprovedLeaveCount(leaveData.count || 0);
        setApprovedLeaves(leaveData.leaves || []);

        // Merge leaves not in attendance list
        const attendanceEmpIds = attendanceData.map(rec => rec.empId);
        const filteredLeaves = leaveData.leaves.filter(
          leave => !attendanceEmpIds.includes(leave.empId)
        );

        const mergedList = [
          ...attendanceData,
          ...filteredLeaves.map(leave => ({
            ...leave,
            date: selectedDate,
            status: "Leave"
          }))
        ];

        setAttendanceList(mergedList);
      } catch (err) {
        console.error("Error loading dashboard data", err);
        setAttendanceList([]);
        setSummary({ total: 0, present: 0, leave: 0, wfh: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, [selectedDate]);


  // Show name instantly
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    if (user?.name) {
      setEmpName(user.name);
    }
  }, []);

  // Fetch from API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const token = localStorage.getItem("authToken");
    const empId = user?.empId;

    if (!empId || !token) return;

    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/view`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();
        console.log("Employees fetched:", data);
        console.log("Searching for empId:", empId);

        const match = data.find(emp => String(emp.empId).trim() === String(empId).trim());
        console.log("Matched employee:", match);

        if (match) {
          setUniqueId(match._id);
          setEmpName(match.name);
          console.log(match._id);
          
        }
      } catch (err) {
        console.error("Failed to fetch employee unique ID", err);
      }
    };

    fetchEmployee();
  }, []);



  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    const token = localStorage.getItem("authToken");
    const empId = user?.empId;
    if (!empId || !token) {
      console.warn("Missing empId or token");
      return;
    }

    const uncPayroll = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/payroll/viewpayroll`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Fetch failed:", res.status, text);
          return;
        }

        const data = await res.json();
        console.log("Token:", token);
        console.log("EmpID:", empId);
        console.log("Fetched payroll data:", data);

        const match = data.find(emp => emp.empId.trim() === empId.trim());
        // console.log("Matched payroll record:", match);

        if (match) {
          setUniqueIdpay(match._id);
        } else {
          console.warn("No matching payroll found for empId:", empId);
        }
      } catch (err) {
        console.error("Failed to fetch employee payroll", err);
      }
    };

    uncPayroll();
  }, []);


  const themeClass = darkMode ? "bg-dark text-white" : "";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB");
  };
  // for indiviual 
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const fetchMyLeaves = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/leaves/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // Count only approved leaves
        const approvedLeaves = data.filter(leave => leave.status === "Approved");
        setPersonalLeave(approvedLeaves.length);
      } catch (err) {
        console.error("Failed to fetch personal leave records", err);
        setPersonalLeave(0);
      }
    };

    fetchMyLeaves();
  }, []);


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
          const value = [summary.total, summary.present, approvedLeaveCount, summary.wfh][index];

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
                        <tr key={rec._id || index}>
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
