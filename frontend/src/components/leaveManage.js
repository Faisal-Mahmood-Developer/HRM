import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const LeaveRequest = () => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    from: '',
    to: '',
    reason: ''
  });

  const [message, setMessage] = useState('');
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const token = localStorage.getItem('authToken');

  // Extract name from token and fetch leave requests
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded?.name) {
          setFormData(prev => ({ ...prev, name: decoded.name }));
        }
      } catch (err) {
        console.error("Invalid token");
      }
    }
    fetchLeaveRequests();
  }, []);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmit = async e => {
    e.preventDefault();

    // Check for overlapping leaves before submitting
    const overlappingLeave = leaveRequests.find(leave => {
      const fromDate = new Date(leave.from).toISOString().split("T")[0];
      const toDate = new Date(leave.to).toISOString().split("T")[0];

      const newFrom = new Date(formData.from).toISOString().split("T")[0];
      const newTo = new Date(formData.to).toISOString().split("T")[0];

      return (
        (newFrom >= fromDate && newFrom <= toDate) ||
        (newTo >= fromDate && newTo <= toDate) ||
        (fromDate >= newFrom && fromDate <= newTo) ||
        (toDate >= newFrom && toDate <= newTo)
      );
    });

    if (overlappingLeave) {
      setAlert({ type: 'warning', message: 'You already have a leave request during this date range.' });
      setTimeout(() => setAlert({ type: '', message: '' }), 3000);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/leaves/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit request');
      }

      const data = await response.json();
      setMessage(data.message || 'Request submitted successfully');
      setFormData(prev => ({
        ...prev,
        type: '',
        from: '',
        to: '',
        reason: ''
      }));
      fetchLeaveRequests();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const fetchLeaveRequests = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/leaves/my', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch requests');
      }

      const data = await response.json();
      setLeaveRequests(data || []);
    } catch (err) {
      console.error(err.message);
    }
  };

  const getBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'pending':
      default: return 'bg-warning text-dark';
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toISOString().split('T')[0];
  };

  return (
    <div className="container-fluid mt-5">
      <div className="row g-4">

        {/* Form */}
        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title text-center mb-3">Leave Request</h5>
              {alert.message && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                  {alert.message}
                  <button type="button" className="btn-close" onClick={() => setAlert({ type: '', message: '' })}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">Employee Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    value={formData.name}
                    readOnly
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Leave Type</label>
                  <select
                    name="type"
                    className="form-select"
                    onChange={handleChange}
                    required
                    value={formData.type}
                  >
                    <option value="">Select Type</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Casual Leave">Casual Leave</option>
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">From Date</label>
                  <input
                    type="date"
                    name="from"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.from}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">To Date</label>
                  <input
                    type="date"
                    name="to"
                    className="form-control"
                    onChange={handleChange}
                    value={formData.to}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Reason</label>
                  <textarea
                    name="reason"
                    className="form-control"
                    rows="3"
                    onChange={handleChange}
                    value={formData.reason}
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">Submit</button>
                </div>

                {message && (
                  <div className="alert alert-info mt-3" role="alert">
                    {message}
                  </div>
                )}

              </form>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="col-md-9">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title mb-3">My Leave Requests</h5>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Type</th>
                      <th>From</th>
                      <th>To</th>
                      <th>Reason</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.length > 0 ? (
                      leaveRequests.map((leave, index) => (
                        <tr key={leave._id || index}>
                          <td>{index + 1}</td>
                          <td>{leave.name || '-'}</td>
                          <td>{leave.type}</td>
                          <td>{formatDate(leave.from)}</td>
                          <td>{formatDate(leave.to)}</td>
                          <td>{leave.reason}</td>
                          <td>
                            <span className={`badge ${getBadgeClass(leave.status)}`}>
                              {leave.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="text-center">No leave requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeaveRequest;
