import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const AddPayroll = () => {
    const [employees, setEmployees] = useState([]);
    const [payrollRecords, setPayrollRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState({ message: "", type: "" });
    const [deleteId, setDeleteId] = useState(null);

    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    const [formData, setFormData] = useState({
        name: "",
        empId: "",
        month: "",
        basicSalary: "",
        bonus: "",
        extraOvertime: "",
        medicalAllowance: "",
        conveyanceAllowance: "",
        loanDeductions: "",
        incomeTax: ""
    });

    const showAlert = (message, type = "success") => {
        setAlert({ message, type });
        setTimeout(() => setAlert({ message: "", type: "" }), 3000);
    };

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/employees/view");
                const data = await res.json();
                setEmployees(data);
            } catch (err) {
                console.error("Failed to fetch employees:", err);
            }
        };
        fetchEmployees();
    }, []);

    useEffect(() => {
        const fetchPayrolls = async () => {
            setLoading(true);
            try {
                const res = await fetch(`http://localhost:5000/api/payroll/viewpayroll?month=${selectedMonth}`);
                if (!res.ok) throw new Error("Failed to fetch payrolls");
                const data = await res.json();
                setPayrollRecords(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPayrolls();
    }, [selectedMonth]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "empId") {
            const selectedEmp = employees.find(emp => String(emp.empId) === value);
            setFormData({
                ...formData,
                empId: value,
                name: selectedEmp?.name || ""
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const selectedEmp = employees.find(emp => String(emp.empId) === String(formData.empId));
        if (!selectedEmp) {
            alert("Employee not found.");
            return;
        }

        const finalPayload = {
            ...formData,
            maritalStatus: selectedEmp.maritalStatus,
        };

        try {
            const res = await fetch("http://localhost:5000/api/payroll/addpayroll", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(finalPayload)
            });

            if (!res.ok) throw new Error("Submission failed");

            setFormData({
                name: "",
                empId: "",
                month: "",
                basicSalary: "",
                bonus: "",
                extraOvertime: "",
                medicalAllowance: "",
                conveyanceAllowance: "",
                loanDeductions: "",
                incomeTax: ""
            });

            showAlert("Payroll added successfully", "success");

            // ✅ Fetch updated payroll data after submit
            const fetchUpdatedPayrolls = async () => {
                try {
                    const res = await fetch(`http://localhost:5000/api/payroll/viewpayroll?month=${formData.month}`);
                    const data = await res.json();
                    setPayrollRecords(data);
                } catch (err) {
                    console.error("Error fetching updated payrolls:", err.message);
                }
            };
            fetchUpdatedPayrolls();

        } catch (err) {
            console.error("Error:", err.message);
            showAlert("Failed to add payroll", "danger");
        }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await fetch(`http://localhost:5000/api/payroll/delpayroll/${deleteId}`, { method: 'DELETE' });
            setPayrollRecords(payrollRecords.filter(record => record._id !== deleteId));
            setDeleteId(null);
            const modal = window.bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            modal.hide();
            showAlert("Payroll deleted successfully", "danger");
        } catch (err) {
            console.error(err);
            showAlert("Failed to delete payroll", "danger");
        }
    };

    const handleDelete = (id) => {
        setDeleteId(id);
        const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
        modal.show();
    };

    return (
        <div className="container-fluid p-3 mt-4">
            <div className="row">
                <div className="col-md-3">
                    <h4>Add Payroll</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-2">
                                <label className="form-label">Payroll Month</label>
                                <input type="month" name="month" className="form-control" value={formData.month} onChange={handleChange} required />
                            </div>

                            <div className="col-md-6 mb-2">
                                <label className="form-label">Employee ID</label>
                                <select name="empId" className="form-select" value={formData.empId} onChange={handleChange} required>
                                    <option value="">-- Select Emp ID --</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp.empId}>{emp.empId}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-6 mb-2">
                                <label className="form-label">Employee Name</label>
                                <input type="text" className="form-control" value={formData.name} readOnly />
                            </div>

                            {formData.empId && (
                                <div className="col-md-6 mb-2">
                                    <label className="form-label">Marital Status</label>
                                    <input type="text" className="form-control" value={employees.find(emp => String(emp.empId) === String(formData.empId))?.maritalStatus || ""} readOnly />
                                </div>
                            )}

                            {[
                                ["basicSalary", "Basic Salary"],
                                ["bonus", "Bonus"],
                                ["extraOvertime", "Extra Overtime"],
                                ["medicalAllowance", "Medical Allowance"],
                                ["conveyanceAllowance", "Conveyance Allowance"],
                                ["loanDeductions", "Loan Deductions"],
                                ["incomeTax", "Income Tax"]
                            ].map(([field, label]) => (
                                <div className="col-md-6 mb-2" key={field}>
                                    <label className="form-label">{label}</label>
                                    <input type="number" name={field} className="form-control" value={formData[field]} onChange={handleChange} required />
                                </div>
                            ))}
                        </div>
                        <button type="submit" className="btn btn-primary w-100 mt-3">Submit</button>
                    </form>
                </div>

                <div className="col-md-9">
                    <h4 className="mb-3 text-center">Payroll Records</h4>

                    <div className="mb-3 text-end">
                        <label className="me-2">Filter by Month:</label>
                        <input type="month" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="form-control d-inline-block" style={{ width: "200px" }} />
                    </div>
                    {alert.message && (
                        <div className={`text-center alert alert-${alert.type} alert-dismissible fade show text-center`} role="alert">
                            {alert.message}
                            <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    )}
                    {loading ? (
                        <p className="text-center">Loading payrolls...</p>
                    ) : error ? (
                        <p className="text-danger text-center">Error: {error}</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped align-middle mb-0">
                                <thead className="table-primary">
                                    <tr>
                                        <th>#</th>
                                        <th>Month</th>
                                        <th>Name</th>
                                        <th>Basic</th>
                                        <th>Bonus</th>
                                        <th>OT</th>
                                        <th>Medical</th>
                                        <th>Conveyance</th>
                                        <th>Gross</th>
                                        <th>Loan</th>
                                        <th>Tax</th>
                                        <th>Net</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payrollRecords.length === 0 ? (
                                        <tr>
                                            <td colSpan="13" className="text-center py-3">No payroll records yet.</td>
                                        </tr>
                                    ) : (
                                        <>
                                            {payrollRecords.map((record, index) => {
                                                const gross = Number(record.basicSalary) + Number(record.bonus) + Number(record.extraOvertime) + Number(record.medicalAllowance) + Number(record.conveyanceAllowance);
                                                const net = gross - (Number(record.loanDeductions) + Number(record.incomeTax));
                                                return (
                                                    <tr key={record._id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{record.month ? new Date(record.month + "-01").toLocaleString("en-US", { month: "long", year: "numeric" }) : "N/A"}</td>
                                                        <td>{record.name}</td>
                                                        <td>{record.basicSalary}</td>
                                                        <td>{record.bonus}</td>
                                                        <td>{record.extraOvertime}</td>
                                                        <td>{record.medicalAllowance}</td>
                                                        <td>{record.conveyanceAllowance}</td>
                                                        <td>{gross}</td>
                                                        <td>{record.loanDeductions}</td>
                                                        <td>{record.incomeTax}</td>
                                                        <td>{net}</td>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <Link to={`/editPayroll/${record._id}`} className="me-3">
                                                                    <i className="far fa-edit" style={{ cursor: 'pointer' }}></i>
                                                                </Link>
                                                                <i className="far fa-trash-alt" style={{ cursor: 'pointer' }} onClick={() => handleDelete(record._id)}></i>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                            <tr className="fw-bold bg-light">
                                                <td colSpan="11" className="text-end">Total Net Salary:</td>
                                                <td>
                                                    {
                                                        payrollRecords.reduce((sum, record) => {
                                                            const gross = Number(record.basicSalary) + Number(record.bonus) + Number(record.extraOvertime) + Number(record.medicalAllowance) + Number(record.conveyanceAllowance);
                                                            const net = gross - (Number(record.loanDeductions) + Number(record.incomeTax));
                                                            return sum + net;
                                                        }, 0).toFixed(2)
                                                    }
                                                </td>
                                                <td></td>
                                            </tr>
                                        </>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="deleteModalLabel">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete this employee?
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

export default AddPayroll;
