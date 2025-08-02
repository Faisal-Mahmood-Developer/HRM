import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateAccountPage = () => {
    const navigate = useNavigate();

    const [employees, setEmployees] = useState([]);
    const [formData, setFormData] = useState({ empId: '', name: '', email: '', password: '' });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/employees/view');
                const data = await res.json();
                setEmployees(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchEmployees();
    }, []);

    const handleChange = e => {
        const { name, value } = e.target;

        if (name === 'empId') {
            const selectedEmp = employees.find(emp => emp.empId === value);
            setFormData({
                ...formData,
                empId: value,
                name: selectedEmp ? selectedEmp.name : '',
                email: selectedEmp ? selectedEmp.email : ''
            });
        }
        else {
            setFormData({
                ...formData,
                [name]: value
            });
        }

        setError('');
        setSuccess('');
    };


    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/create-account', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            setTimeout(() => navigate('/'), 1500);
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed');
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow p-4">
                        <h3 className="text-center mb-4">Create Account</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group mb-3">
                                <label>Employee ID</label>
                                <select
                                    name="empId"
                                    className="form-control"
                                    value={formData.empId}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Employee</option>
                                    {employees.map(emp => (
                                        <option key={emp._id} value={emp.empId}>
                                            {emp.empId}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group mb-3">
                                <label>Employee Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    value={formData.name}
                                    readOnly
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Employee Email</label>
                                <input
                                    type="text"
                                    name="email"
                                    className="form-control"
                                    value={formData.email}
                                    readOnly
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label>Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {success && <div className="alert alert-success">{success}</div>}

                            <button type="submit" className="btn mb-3 btn-primary w-100">Create Account</button>
                            <button
                                type="button"
                                className="btn btn-secondary w-100"
                                onClick={() => navigate("/")}
                            >
                                Go back
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateAccountPage;
