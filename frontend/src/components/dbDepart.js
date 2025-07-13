import React, { useEffect, useState } from "react";

const Dbdepart = () => {
    const [hrEmployees, setHrEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/employees/view");
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();

                const hr = data.filter(
                    (emp) => emp.department?.trim().toLowerCase() === "database department"
                );
                setHrEmployees(hr);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    if (loading) return <p className="text-center mt-5">Loading employees...</p>;
    if (error) return <p className="text-center text-danger mt-5">Error: {error}</p>;

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0 text-center">Database Department</h5>
                </div>
                <div className="card-body table-responsive">
                    {hrEmployees.length === 0 ? (
                        <p className="text-center">No employees found in the Database  Department.</p>
                    ) : (
                        <table className="table table-bordered table-hover text-center align-middle">
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Photo</th>
                                    <th>Name</th>
                                    <th>Designation</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Links</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hrEmployees.map((emp, index) => (
                                    <tr key={emp._id}>
                                        <td>{index + 1}</td>
                                        <td>
                                            <img
                                                src={emp.photo || "https://via.placeholder.com/60"}
                                                alt={emp.name}
                                                style={{
                                                    width: "60px",
                                                    height: "60px",
                                                    borderRadius: "50%",
                                                    objectFit: "cover"
                                                }}
                                            />

                                        </td>
                                        <td>{emp.name}</td>
                                        <td>{emp.designation}</td>
                                        <td>{emp.email}</td>
                                        <td>{emp.contact}</td>
                                        <td>
                                            {emp.status && (
                                                <a
                                                    href={emp.status}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary me-2"
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    <i className="fab fa-linkedin"></i>
                                                </a>
                                            )}
                                            {emp.contact && (
                                                <a
                                                    href={`https://wa.me/${emp.contact}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-success me-3"
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    <i className="fab fa-whatsapp"></i>
                                                </a>

                                            )}
                                            {emp.linkedin && (
                                                <a
                                                    href={emp.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-primary me-2"
                                                    style={{ fontSize: '18px' }}
                                                >
                                                    <i className="fab fa-linkedin"></i>
                                                </a>
                                            )}

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dbdepart;
