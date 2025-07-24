import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import hrmImage from '../images/hrm.jpg';


const LoginPage = ({ setLogin }) => {
    const [formData, setFormData] = useState({ empId: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const navigate = useNavigate();

    const handleChange = e => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
        setSuccess('');
    };

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/home/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.msg);

            // ✅ Save token and user to localStorage
            localStorage.setItem('authToken', data.token); // 🔐 Save token
            localStorage.setItem('loggedInUser', JSON.stringify(data.user)); // 👤 Save user

            setSuccess(data.msg);
            setLogin(true);
            navigate('/');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="bg-light p-5">
            <div className="login-page bg-light mt-5">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <h3 className="mb-3">Login Now</h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    {/* Left Side Form */}
                                    <div className="col-md-7 pe-0">
                                        <div className="form-left h-100 py-5 px-5">
                                            {error && <div className="alert alert-danger text-center">{error}</div>}
                                            {success && <div className="alert alert-success text-center">{success}</div>}

                                            <form onSubmit={handleSubmit} className="row g-4">
                                                {/* Employee ID */}
                                                <div className="col-12">
                                                    <label htmlFor="empId" className="form-label">Employee ID</label>
                                                    <div className="input-group">
                                                        <div className="input-group-text"><i className="bi bi-person-fill"></i></div>
                                                        <input
                                                            type="text"
                                                            name="empId"
                                                            id="empId"
                                                            className="form-control"
                                                            placeholder="Enter Employee ID"
                                                            value={formData.empId}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                {/* Password */}
                                                <div className="col-12">
                                                    <label htmlFor="password" className="form-label">Password</label>
                                                    <div className="input-group mb-2">
                                                        <div className="input-group-text"><i className="bi bi-lock-fill"></i></div>
                                                        <input
                                                            type={showPassword ? 'text' : 'password'}
                                                            name="password"
                                                            id="password"
                                                            className="form-control"
                                                            placeholder="Enter Password"
                                                            value={formData.password}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id="showPassword"
                                                            checked={showPassword}
                                                            onChange={() => setShowPassword(!showPassword)}
                                                        />
                                                        <label className="form-check-label" htmlFor="showPassword">Show Password</label>
                                                    </div>
                                                </div>

                                                {/* Login Button */}
                                                <div className="col-12">
                                                    <button type="submit" className="btn px-4 float-end mt-4 text-white"
                                                        style={{ background: 'linear-gradient(135deg, #fc5c7d, #6a82fb)' }}>
                                                        Login
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>

                                    {/* Right Side Image */}
                                    <div className="col-md-5 ps-0 d-none d-md-block">
                                        <div className="form-right h-100 text-white text-center pt-5"
                                            style={{ background: 'linear-gradient(135deg, #fc5c7d, #6a82fb)' }}>
                                            <img
                                                src={hrmImage}
                                                className="img-fluid rounded-circle my-logo w-75 mb-5"
                                                alt="Logo"
                                            />
                                        </div>
                                    </div>
                                </div> {/* row */}
                            </div> {/* card */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
