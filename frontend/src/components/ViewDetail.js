import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewDetail = () => {
  const { id } = useParams();
  const [empData, setEmpData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const openBase64InNewTab = (base64Data) => {
    const win = window.open();
    win.document.write(`<iframe src="${base64Data}" frameborder="0" style="width:100%;height:100%"></iframe>`);
  };

  useEffect(() => {
    const fetchEmpDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/view`);
        const data = await res.json();
        const filtered = data.find(emp => emp._id === id);
        setEmpData(filtered);
      } catch (err) {
        console.error("Failed to fetch employee detail", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmpDetail();
  }, [id]);

  return (
    <div className="container mt-5">
      <div className="card shadow p-4" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <h3 className="mb-4 text-center">Employee Full Detail</h3>

        {loading ? (
          <p>Loading...</p>
        ) : empData ? (
          <div>
            <div className="text-center mb-4">
              <img
                src={empData.photo || "https://via.placeholder.com/150"}
                alt="Employee"
                className="img-thumbnail"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
            </div>

            <div className="row g-4">
              <div className="col-md-4"><strong>Name:</strong> {empData.name}</div>
              <div className="col-md-4"><strong>Employee ID:</strong> {empData.empId}</div>
              <div className="col-md-4"><strong>Designation:</strong> {empData.designation}</div>
              <div className="col-md-4"><strong>Email:</strong> {empData.email}</div>
              <div className="col-md-4"><strong>Contact:</strong> {empData.contact}</div>
              <div className="col-md-4"><strong>Father Name:</strong> {empData.fatherName}</div>
              <div className="col-md-4"><strong>Department:</strong> {empData.department}</div>
              <div className="col-md-4"><strong>City:</strong> {empData.city}</div>
              <div className="col-md-4"><strong>Address:</strong> {empData.address}</div>
              <div className="col-md-4"><strong>Gender:</strong> {empData.gender}</div>
              <div className="col-md-4"><strong>Marital Status:</strong> {empData.maritalStatus}</div>
              <div className="col-md-4"><strong>Nationality:</strong> {empData.nationality}</div>
              <div className="col-md-4"><strong>ICE:</strong> {empData.ice}</div>
              <div className="col-md-4"><strong>ID Number:</strong> {empData.idNumber}</div>
              <div className="col-md-4"><strong>LinkedIn:</strong> {empData.linkedin}</div>
              <div className="col-md-4"><strong>Blood Group:</strong> {empData.bloodGroup}</div>
              <div className="col-md-4"><strong>Employee Status:</strong> {empData.employeeStatus}</div>
              <div className="col-md-4"><strong>Work Location:</strong> {empData.workLocation}</div>
              <div className="col-md-4"><strong>Job Type:</strong> {empData.jobType}</div>
              <div className="col-md-4"><strong>Emergency Contact:</strong> {empData.emergencyContactName}</div>
              <div className="col-md-4"><strong>Joining Date:</strong> {empData.joiningDate?.slice(0, 10)}</div>
              <div className="col-md-4"><strong>Resignation Date:</strong> {empData.resignationDate?.slice(0, 10)}</div>
              <div className="col-md-4"><strong>Last Working Day:</strong> {empData.lastWorkingDay?.slice(0, 10)}</div>
            </div>

            <hr className="my-4" />
            <h5>Uploaded Documents</h5>
            <ul className="list-group">
              {empData.resume && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Resume
                  <div>
                    <i className="fas fa-download me-3 text-primary" title="Download" onClick={() => openBase64InNewTab(empData.resume)} style={{ cursor: 'pointer' }}></i>
                  </div>
                </li>
              )}
              {empData.cnicCopy && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  CNIC Copy
                  <div>
                    <i className="fas fa-download me-3 text-primary" title="Download" onClick={() => openBase64InNewTab(empData.cnicCopy)} style={{ cursor: 'pointer' }}></i>
                  </div>
                </li>
              )}
              {empData.academicDocs && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Academic Documents
                  <div>
                    <i className="fas fa-download me-3 text-primary" title="Download" onClick={() => openBase64InNewTab(empData.academicDocs)} style={{ cursor: 'pointer' }}></i>
                  </div>
                </li>
              )}
              {empData.experienceLetters && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Experience Letters
                  <div>
                    <i className="fas fa-download me-3 text-primary" title="Download" onClick={() => openBase64InNewTab(empData.experienceLetters)} style={{ cursor: 'pointer' }}></i>
                  </div>
                </li>
              )}
              {empData.contractLetter && (
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  Contract Letter
                  <div>
                    <i className="fas fa-download me-3 text-primary" title="Download" onClick={() => openBase64InNewTab(empData.contractLetter)} style={{ cursor: 'pointer' }}></i>
                  </div>
                </li>
              )}
            </ul>

            <div className="mt-4 text-end">
              <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                ← Back
              </button>
              
            </div>
          </div>
        ) : (
          <p>No data found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewDetail;
