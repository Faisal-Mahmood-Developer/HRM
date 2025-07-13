import React, { useState, useEffect } from "react";

const AddMedical = () => {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [empRes, medRes] = await Promise.all([
                    fetch("http://localhost:5000/api/employees/view"),
                    fetch("http://localhost:5000/api/payroll/viewpayroll")
                ]);

                if (!empRes.ok || !medRes.ok) throw new Error("Failed to fetch data");

                const empData = await empRes.json();
                const medData = await medRes.json();

                setEmployees(empData);

                const enriched = medData.map(rec => {
                    const matchedEmp = empData.find(emp => String(emp.empId) === String(rec.empId));
                    return {
                        ...rec,
                        maritalStatus: matchedEmp?.maritalStatus?.toLowerCase() || "unknown"
                    };
                });

                setMedicalRecords(enriched);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-12 text-center">
                    <h4 className="mb-3">
                        All Medical Records
                    </h4>

                    <div className="mb-3 d-flex justify-content-center align-items-center">
                        <label className="me-2">Filter by Status:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value.toLowerCase())}
                            className="form-select w-auto"
                        >
                            <option value="">All</option>
                            <option value="married">Married</option>
                            <option value="single">Single</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading records...</p>
                    ) : error ? (
                        <p className="text-danger">Error: {error}</p>
                    ) : medicalRecords.length === 0 ? (
                        <p>No records yet.</p>
                    ) : (
                        <table className="table table-bordered">
                            <thead className="table-primary">
                                <tr>
                                    <th>#</th>
                                    <th>Month</th>
                                    <th>Name</th>
                                    <th>Emp ID</th>
                                    <th>Marital Status</th>
                                    <th>Total Medical</th>
                                    <th>Remaining</th>
                                </tr>
                            </thead>
                            <tbody>
                                {medicalRecords
                                    .filter(rec =>
                                        statusFilter ? rec.maritalStatus === statusFilter : true
                                    )
                                    .map((record, index) => {
                                        const medical = parseFloat(record.medicalAllowance || 0);
                                        const maxAllowance = record.maritalStatus === "single" ? 35000 : 65000;
                                        const remaining = Math.max(0, maxAllowance - medical);

                                        return (
                                            <tr key={record._id || index}>
                                                <td>{index + 1}</td>
                                                <td>{record.month}</td>
                                                <td>{record.name}</td>
                                                <td>{record.empId || "N/A"}</td>
                                                <td className="text-capitalize">{record.maritalStatus}</td>
                                                <td>{medical}</td>
                                                <td>{remaining}</td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AddMedical;
