import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const ChangePassword = () => {

  const [name, setName] = useState('');
  const [userId, setUserId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('info');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const storedUserRaw = localStorage.getItem('loggedInUser');
    if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      setName(storedUser.name);
      setUserId(storedUser._id);
    } else {
      setMessage('❌ User not logged in');
      setAlertType('danger');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword) {
      setMessage('⚠️ Please enter a new password');
      setAlertType('warning');
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/auth/change-password/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password: newPassword })
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('✅ Password updated successfully');
        setAlertType('success');
        setNewPassword('');

        // Wait 2 seconds, then redirect to dashboard
        setTimeout(() => navigate('/'), 2000);
      } else {
        setMessage(result.msg || '❌ Failed to update password');
        setAlertType('danger');
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Server error');
      setAlertType('danger');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <h3 className="text-center mb-4">Change Password</h3>

      {message && <div className={`alert alert-${alertType}`}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={name} readOnly />
        </div>

        <div className="mb-3">
          <label className="form-label">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <div className="form-check mt-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPassword"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label" htmlFor="showPassword">
              Show Password
            </label>
          </div>
        </div>


        <button type="submit" className="btn mb-3 btn-primary w-100">
          Update Password
        </button>
        <button
          type="button"
          className="btn btn-secondary w-100"
          onClick={() => navigate("/")}
        >
          Go back
        </button>

      </form>
    </div>
  );
};

export default ChangePassword;
