
import React, { useEffect, useState } from "react";

const AttendancePage = () => {
    const [formData, setFormData] = useState({
        date: "",
        empId: "",
        name: "",
        status: "Present"
    });

    const [attendanceList, setAttendanceList] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [isAdmin, setIsAdmin] = useState(false);
    const [selectedDate, setSelectedDate] = useState(getTodayDate());

    const [yearlyRecords, setYearlyRecords] = useState([]);

    const [yearlyEmpId, setYearlyEmpId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);



    function getTodayDate() {
        const today = new Date();
        return today.toISOString().split("T")[0];
    }

    const showAlert = (message, type = "info") => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("loggedInUser"));
        if (user?.isAdmin) {
            setIsAdmin(true);
        } else {
            setFormData(prev => ({
                ...prev,
                empId: user?.empId || "",
                name: user?.name || ""
            }));
        }
    }, []);

    useEffect(() => {
        fetchEmployees();
        fetchAttendance(selectedDate);
    }, [selectedDate]);

    const fetchEmployees = async () => {
        try {
            const res = await fetch("http://localhost:5000/api/employees/view");
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            console.error("Failed to fetch employees", err);
        }
    };

    const fetchAttendance = async (date) => {
        try {
            const res = await fetch(`http://localhost:5000/api/attendance/view?date=${date}`);
            const data = await res.json();
            const user = JSON.parse(localStorage.getItem("loggedInUser"));

            if (user?.isAdmin) {
                setAttendanceList(data);
            } else {
                setAttendanceList(data.filter(rec => rec.empId === user.empId));
            }
        } catch (err) {
            console.error("Failed to fetch attendance", err);
        }
    };

    const handleCheckYearly = async (empId) => {
        if (!empId) {
            showAlert("Please enter a valid Employee ID", "warning");
            return;
        }

        // Find employee and update name in formData
        const emp = employees.find(emp => emp.empId === empId);
        if (emp) {
            setFormData(prev => ({ ...prev, name: emp.name }));
        }

        try {
            const res = await fetch(`http://localhost:5000/api/attendance/yearly?empId=${empId}`);
            const data = await res.json();
            setYearlyRecords(data);
            setShowModal(true);
        } catch (err) {
            console.error("Failed to fetch yearly records", err);
            showAlert("Failed to load yearly data", "danger");
        }
    };


    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await fetch(`http://localhost:5000/api/attendance/delete/${deleteId}`, {
                method: "DELETE"
            });
            await fetchAttendance(selectedDate);
            setDeleteId(null);
            showAlert("Attendance deleted successfully!", "success");

            const modal = window.bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
        } catch (err) {
            console.error("Delete failed", err);
            showAlert("Failed to delete attendance.", "danger");
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "empId") {
            const emp = employees.find(emp => emp.empId === value);
            if (emp) {
                setFormData(prev => ({ ...prev, name: emp.name }));
            }
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const normalizedDate = new Date(formData.date).toISOString().split("T")[0];

        const duplicate = attendanceList.find(
            (rec) =>
                rec.empId === formData.empId &&
                new Date(rec.date).toISOString().split("T")[0] === normalizedDate &&
                (!isEditing || rec._id !== editingId)
        );

        if (duplicate) {
            showAlert("Attendance already marked for this employee on the selected date.", "warning");
            return;
        }

        const url = isEditing
            ? `http://localhost:5000/api/attendance/update/${editingId}`
            : "http://localhost:5000/api/attendance/add";

        const method = isEditing ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error("Failed to save attendance");

            showAlert(`Attendance ${isEditing ? "updated" : "added"} successfully!`, "success");

            const refreshedDate = formData.date;
            setFormData({ date: "", empId: "", name: "", status: "Present" });
            setIsEditing(false);
            setEditingId(null);
            setSelectedDate(refreshedDate);
            await fetchAttendance(refreshedDate);
        } catch (err) {
            console.error(err);
            showAlert("Failed to save attendance", "danger");
        }
    };


    const handleEdit = (record) => {
        setFormData({
            date: record.date.slice(0, 10),
            empId: record.empId,
            name: record.name || "",
            status: record.status
        });
        setIsEditing(true);
        setEditingId(record._id);
    };

    const handleCancelEdit = () => {
        setFormData({ date: "", empId: "", name: "", status: "Present" });
        setIsEditing(false);
        setEditingId(null);
        showAlert("Edit cancelled.", "warning");
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "2-digit" });
    };

    return (
        <div className="container-fluid p-2 mt-4">
            <div className="row">
                <div className="col-md-3">
                    <div className="card shadow">
                        <div className="card-header bg-info text-white">
                            <h5>{isEditing ? "Edit Attendance" : "Add Attendance"}</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Date</label>
                                    <input
                                        type="date"
                                        name="date"
                                        className="form-control"
                                        value={formData.date}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Employee</label>
                                    {isAdmin ? (
                                        <select
                                            name="empId"
                                            className="form-control"
                                            value={formData.empId}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Employee</option>
                                            {employees.map(emp => (
                                                <option key={emp.empId} value={emp.empId}>
                                                    {emp.empId} - {emp.name}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            name="empId"
                                            className="form-control"
                                            value={formData.empId}
                                            readOnly
                                        />
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Status</label>
                                    <select
                                        name="status"
                                        className="form-control"
                                        value={formData.status}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="Present">Present</option>
                                        <option value="Leave">Leave</option>
                                        <option value="Work from Home">Work from Home</option>
                                    </select>
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="btn btn-secondary w-100 mb-2"
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel Edit
                                    </button>
                                )}
                                <button type="submit" className="btn btn-info w-100">
                                    {isEditing ? "Update" : "Add"} Attendance
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className="col-md-9">
                    <div className="d-flex justify-content-end  mb-3">
                        <input
                            type="date"
                            className="form-control"
                            style={{ maxWidth: "200px" }}
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                    <div className="card shadow">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h5 className="mb-0">Attendance Records</h5>

                            {isAdmin && (
                                <div className="d-flex align-items-center">
                                    <span className="me-2">Check Yearly Leave / WFH:</span>
                                    <input
                                        type="text"
                                        className="form-control form-control-sm me-2"
                                        placeholder="Enter Emp ID"
                                        value={yearlyEmpId}
                                        onChange={(e) => setYearlyEmpId(e.target.value)}
                                        style={{ width: "150px" }}
                                    />
                                    <button
                                        className="btn btn-sm btn-outline-info"
                                        type="button"
                                        onClick={() => handleCheckYearly(yearlyEmpId)}
                                    >
                                        Check
                                    </button>
                                </div>
                            )}
                        </div>


                        {alert.message && (
                            <div className={`alert alert-${alert.type} alert-dismissible fade show text-center`} role="alert">
                                {alert.message}
                                <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        )}

                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table text-center">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Date</th>
                                            <th>Emp ID</th>
                                            <th>Name</th>
                                            <th>Status</th>
                                            {isAdmin && (
                                                <th>Action</th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendanceList.map((rec, index) => (
                                            <tr key={rec._id}>
                                                <td>{index + 1}</td>
                                                <td>{formatDate(rec.date)}</td>
                                                <td>{rec.empId}</td>
                                                <td>{rec.name}</td>
                                                <td>{rec.status}</td>
                                                <td>
                                                    {isAdmin && (
                                                        <>
                                                            <i
                                                                className="far fa-edit me-2 text-primary"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleEdit(rec)}
                                                            ></i>
                                                            <i
                                                                className="far fa-trash-alt text-danger"
                                                                style={{ cursor: 'pointer' }}
                                                                onClick={() => handleDelete(rec._id)}
                                                            ></i>

                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="modal show fade d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    Yearly Record for <strong>{formData.name || "Employee"}</strong>
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {yearlyRecords.length > 0 ? (
                                    <>
                                        <div className="mb-3">
                                            <strong>Total Leaves:</strong>{" "}
                                            {
                                                yearlyRecords.filter(r => r.status === "Leave").length
                                            }{" "}
                                            / <strong>Allowed:</strong> 14
                                            <br />
                                            <strong>Total Work From Home:</strong>{" "}
                                            {
                                                yearlyRecords.filter(r => r.status === "Work from Home").length
                                            }
                                        </div>

                                        <table className="table table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {yearlyRecords.map((rec, i) => (
                                                    <tr key={rec._id}>
                                                        <td>{i + 1}</td>
                                                        <td>{formatDate(rec.date)}</td>
                                                        <td>{rec.status}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </>
                                ) : (
                                    <p>No records found for this employee.</p>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this attendance record?
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

export default AttendancePage;
