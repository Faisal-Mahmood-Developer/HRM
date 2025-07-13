import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInventory = () => {
    const navigate = useNavigate();
    const [employees, setEmployees] = useState([]);
    const [addSuccess, setAddSuccess] = useState(false);

    const [formData, setFormData] = useState({
        date: "",
        employeeId: "",
        name: "",
        systemManufacturer: "",
        systemModel: "",
        monitor: "",
        romRam: "",
        product: "",
        headphone: "",
        keyboardMouse: ""
    });

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/employees/view');
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            console.error("Failed to fetch employees:", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "employeeId") {
            const selected = employees.find(emp => emp.empId === value);
            setFormData(prev => ({
                ...prev,
                employeeId: value,
                name: selected ? selected.name : ""
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/inventory/addInventory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            if (!res.ok) throw new Error("Failed to add inventory");

            setAddSuccess(true);
            setTimeout(() => {
                setAddSuccess(false);
                navigate("/viewInventory"); // 🔁 Redirect after success
            }, 1500);
        } catch (err) {
            console.error(err.message);
            alert("Something went wrong.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0">Add Inventory</h5>
                </div>
                <div className="card-body">
                    {addSuccess && (
                        <div className="alert alert-success text-center">
                            Inventory added successfully! Redirecting...
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Date</label>
                                <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Employee ID</label>
                                <select name="employeeId" className="form-control" value={formData.employeeId} onChange={handleChange} required>
                                    <option value="">Select Employee ID</option>
                                    {employees.map((emp, i) => (
                                        <option key={i} value={emp.empId}>{emp.empId}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Name</label>
                                <input type="text" name="name" className="form-control" placeholder="Auto-filled name" value={formData.name} readOnly />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Manufacturer</label>
                                <input type="text" name="systemManufacturer" className="form-control" placeholder="Enter system manufacturer" value={formData.systemManufacturer} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">System Model</label>
                                <input type="text" name="systemModel" className="form-control" placeholder="Enter system model" value={formData.systemModel} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Monitor</label>
                                <input type="text" name="monitor" className="form-control" placeholder="Enter monitor details" value={formData.monitor} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">ROM / RAM</label>
                                <input type="text" name="romRam" className="form-control" placeholder="Enter ROM and RAM" value={formData.romRam} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Product</label>
                                <input type="text" name="product" className="form-control" placeholder="Enter product name" value={formData.product} onChange={handleChange} required />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label">Headphone</label>
                                <input type="text" name="headphone" className="form-control" placeholder="Enter headphone info" value={formData.headphone} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="row mb-3">
                            <div className="col-md-4">
                                <label className="form-label">Keyboard / Mouse</label>
                                <input type="text" name="keyboardMouse" className="form-control" placeholder="Enter keyboard/mouse info" value={formData.keyboardMouse} onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="text-end">
                            <button type="submit" className="btn btn-primary">Add Item</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddInventory;
