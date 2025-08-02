import React, { useState, useEffect } from 'react';

const AdminLeaveManager = () => {
    const [leaveRequests, setLeaveRequests] = useState([]);
    const [message, setMessage] = useState('');
    const [employees, setEmployees] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    const token = localStorage.getItem('authToken');

    const fetchAllLeaves = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/leaves/all', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to fetch');

            setLeaveRequests(data);
        } catch (err) {
            setMessage(err.message);
        }
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/employees/view');
                if (!res.ok) throw new Error('Failed to fetch employee data');

                const data = await res.json();
                setEmployees(data);
            } catch (err) {
                console.error('Error fetching employees:', err.message);
            }
        };

        fetchEmployees();
    }, []);

    useEffect(() => {
        fetchAllLeaves();
    }, []);

    const updateStatus = async (id, status) => {
        try {
            const res = await fetch(`http://localhost:5000/api/leaves/status/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update status');

            setMessage(data.message);
            fetchAllLeaves(); // Refresh
        } catch (err) {
            setMessage(err.message);
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
        return date.toLocaleDateString('en-GB').replace(/\//g, '-');
    };

    const filteredLeaves = leaveRequests;

    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;

        try {
            const res = await fetch(`http://localhost:5000/api/leaves/del/${deleteId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("Delete failed");

            setDeleteId(null);
            fetchAllLeaves();

            const modal = window.bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();

            setMessage('Leave request deleted successfully');
        } catch (err) {
            setMessage('Failed to delete leave request');
        }
    };

    return (
        <div className="container mt-5">
            <h3 className="mb-4 text-center">Admin Leave Management</h3>
            {message && <div className="alert alert-info">{message}</div>}

            <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>Emp ID</th>
                            <th>Name & Email</th>
                            <th>Type</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Reason</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLeaves.length ? (
                            filteredLeaves.map((leave, idx) => (
                                <tr key={leave._id}>
                                    <td>{idx + 1}</td>
                                    <td>{leave.empId}</td>
                                    <td>
                                        {(() => {
                                            const emp = employees.find(e => e.empId === leave.empId);
                                            return emp ? `${emp.name} (${emp.email})` : 'N/A';
                                        })()}
                                    </td>
                                    <td>{leave.type}</td>
                                    <td>{formatDate(leave.from)}</td>
                                    <td>{formatDate(leave.to)}</td>
                                    <td>{leave.reason}</td>
                                    <td>
                                        <span className={`badge ${getBadgeClass(leave.status)}`}>
                                            {leave.status}
                                        </span>
                                    </td>
                                    <td>
                                        {leave.status === 'Pending' && (
                                            <>
                                                <button
                                                    className="btn btn-sm btn-success me-1"
                                                    onClick={() => updateStatus(leave._id, 'Approved')}
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-sm btn-danger me-1"
                                                    onClick={() => updateStatus(leave._id, 'Rejected')}
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                        <i
                                            className="far fa-trash-alt text-danger"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => handleDelete(leave._id)}
                                        ></i>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No leave requests found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Delete Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this leave request?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No</button>
                            <button type="button" className="btn btn-danger" onClick={confirmDelete}>Yes</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLeaveManager;
