import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditPayroll = () => {
    const { id } = useParams();
    const navigate = useNavigate();
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

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alert, setAlert] = useState("");

    useEffect(() => {
        const fetchPayroll = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/payroll/getpayroll/${id}`);
                if (!res.ok) throw new Error("Failed to fetch payroll record");
                const data = await res.json();
                setFormData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchPayroll();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`http://localhost:5000/api/payroll/updatepayroll/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to update payroll");

            setAlert("Payroll updated successfully!");
            setTimeout(() => {
                setAlert("");
                navigate("/addPayroll");
            }, 2000);
        } catch (err) {
            setAlert(err.message);
        }
    };

    const handleCancel = () => {
        navigate("/addPayroll");  // You can update this route based on where you want to navigate
    };

    if (loading) return <p className="text-center">Loading payroll data...</p>;
    if (error) return <p className="text-danger text-center">Error: {error}</p>;

    return (
        <div className="container mt-4">
            <h4>Edit Payroll</h4>
            {alert && (
                <div className={`text-center alert ${alert.includes("successfully") ? 'alert-success' : 'alert-danger' } alert-dismissible fade show`} role="alert">
                    {alert}
                    <button type="button" className="btn-close" data-bs-dismiss="alert"></button>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="row">
                    {[
                        ["month", "Payroll Month", "month"],
                        ["empId", "Employee ID", "text"],
                        ["name", "Name", "text"],
                        ["basicSalary", "Basic Salary", "number"],
                        ["bonus", "Bonus", "number"],
                        ["extraOvertime", "Extra Overtime", "number"],
                        ["medicalAllowance", "Medical Allowance", "number"],
                        ["conveyanceAllowance", "Conveyance Allowance", "number"],
                        ["loanDeductions", "Loan Deductions", "number"],
                        ["incomeTax", "Income Tax", "number"]
                    ].map(([field, label, type]) => (
                        <div className="col-md-6 mb-2" key={field}>
                            <label className="form-label">{label}</label>
                            <input
                                type={type}
                                name={field}
                                className="form-control"
                                value={formData[field]}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    ))}
                </div>
                <div className="mt-4 d-flex justify-content-end gap-3">
                    <button type="button" className="btn btn-secondary w-100 mt-3" onClick={handleCancel}>Cancel</button>
                    <button type="submit" className="btn btn-success w-100 mt-3">Update Payroll</button>
                </div>
            </form>
        </div>
    );
};

export default EditPayroll;
