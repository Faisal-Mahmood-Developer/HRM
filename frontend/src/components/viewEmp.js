import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


import { Modal, Button } from 'react-bootstrap';

const ViewEmp = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  // for admin and user 

  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (user?.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  const navigate = useNavigate();


  // for the open file 
  const openBase64InNewTab = (base64String) => {
    if (!base64String) return;

    const mimeType = base64String.substring(base64String.indexOf(":") + 1, base64String.indexOf(";"));
    const base64Data = base64String.split(',')[1];

    const byteCharacters = atob(base64Data);
    const byteNumbers = Array.from(byteCharacters).map(c => c.charCodeAt(0));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });

    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };


  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/employees/view');

        console.log(res);

        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleView = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleEdit = (id) => {
    navigate(`/editEmployee/${id}`);
  };


  const handleDelete = (id) => {
    setDeleteId(id);
    const modal = new window.bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`http://localhost:5000/api/employees/delete/${deleteId}`, {
        method: 'DELETE',
      });
      setEmployees(employees.filter(emp => emp._id !== deleteId));
      setDeleteId(null);

      const modal = window.bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
      modal.hide();

      setDeleteSuccess(true); // show alert
      setTimeout(() => setDeleteSuccess(false), 3000); // auto-hide after 3 seconds
    } catch (err) {
      alert('Failed to delete employee');
    }
  };


  if (loading) return <div className="container mt-5 text-center">Loading employees...</div>;
  if (error) return <div className="container mt-5 text-danger text-center">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h3 className="mb-4 text-center">Employee List</h3>
      {deleteSuccess && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          Employee deleted successfully!
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body p-3">
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>

            <table className="table table-striped align-middle mb-0">
              <thead className="table-primary">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>EmpID</th>
                  <th>Designation</th>
                  <th>Email</th>
                  <th>Contact</th>
                  {isAdmin && (
                    <th>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp._id}>
                    <td>{index + 1}</td>
                    <td>{emp.name}</td>
                    <td>{emp.empId}</td>
                    <td>{emp.designation}</td>
                    <td>{emp.email}</td>
                    <td>{emp.department}</td>
                    {isAdmin && (
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="fas fa-eye me-3" style={{ cursor: 'pointer' }} onClick={() => handleView(emp)}></i>
                          <i className="far fa-edit me-3" style={{ cursor: 'pointer' }} onClick={() => handleEdit(emp._id)}></i>
                          <i className="far fa-trash-alt" style={{ cursor: 'pointer' }} onClick={() => handleDelete(emp._id)}></i>
                        </div>
                      </td>
                    )}


                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* View Modal */}
      {/* View Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} fullscreen centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>Employee Details</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedEmployee ? (
            <div className="container">
              {/* Profile Image */}
              <div className="text-center mb-4">
                <img
                  src={selectedEmployee.photo || "https://via.placeholder.com/150"}
                  alt="Employee"
                  className="img-thumbnail"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              </div>

              {/* Basic Details */}
              <div className="row g-4">
                <div className="col-md-4"><strong>Name:</strong> {selectedEmployee.name}</div>
                <div className="col-md-4"><strong>Employee ID:</strong> {selectedEmployee.empId}</div>
                <div className="col-md-4"><strong>Designation:</strong> {selectedEmployee.designation}</div>
                <div className="col-md-4"><strong>Email:</strong> {selectedEmployee.email}</div>
                <div className="col-md-4"><strong>Contact:</strong> {selectedEmployee.contact}</div>
                <div className="col-md-4"><strong>Father Name:</strong> {selectedEmployee.fatherName}</div>
                <div className="col-md-4"><strong>Department:</strong> {selectedEmployee.department}</div>
                <div className="col-md-4"><strong>City:</strong> {selectedEmployee.city}</div>
                <div className="col-md-4"><strong>Address:</strong> {selectedEmployee.address}</div>
                <div className="col-md-4"><strong>Gender:</strong> {selectedEmployee.gender}</div>
                <div className="col-md-4"><strong>Marital Status:</strong> {selectedEmployee.maritalStatus}</div>
                <div className="col-md-4"><strong>Nationality:</strong> {selectedEmployee.nationality}</div>
                <div className="col-md-4"><strong>ICE:</strong> {selectedEmployee.ice}</div>
                <div className="col-md-4"><strong>ID Number:</strong> {selectedEmployee.idNumber}</div>
                <div className="col-md-4"><strong>LinkedIn:</strong> {selectedEmployee.linkedin}</div>
                <div className="col-md-4"><strong>Blood Group:</strong> {selectedEmployee.bloodGroup}</div>
                <div className="col-md-4"><strong>Employee Status:</strong> {selectedEmployee.employeeStatus}</div>
                <div className="col-md-4"><strong>Work Location:</strong> {selectedEmployee.workLocation}</div>
                <div className="col-md-4"><strong>Job Type:</strong> {selectedEmployee.jobType}</div>
                <div className="col-md-4"><strong>Emergency Contact:</strong> {selectedEmployee.emergencyContactName}</div>
                <div className="col-md-4"><strong>Joining Date:</strong> {selectedEmployee.joiningDate?.slice(0, 10)}</div>
                <div className="col-md-4"><strong>Resignation Date:</strong> {selectedEmployee.resignationDate?.slice(0, 10)}</div>
                <div className="col-md-4"><strong>Last Working Day:</strong> {selectedEmployee.lastWorkingDay?.slice(0, 10)}</div>
              </div>

              {/* Uploaded Files */}
              <hr className="my-4" />
              <h5>Uploaded Documents</h5>
              <ul className="list-group">
                {selectedEmployee.resume && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Resume
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={() => openBase64InNewTab(selectedEmployee.resume)}
                    ></i>
                  </li>
                )}
                {selectedEmployee.cnicCopy && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    CNIC Copy
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={() => openBase64InNewTab(selectedEmployee.cnicCopy)}
                    ></i>
                  </li>
                )}
                {selectedEmployee.academicDocs && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Academic Documents
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={() => openBase64InNewTab(selectedEmployee.academicDocs)}
                    ></i>
                  </li>
                )}
                {selectedEmployee.experienceLetters && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Experience Letters
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={() => openBase64InNewTab(selectedEmployee.experienceLetters)}
                    ></i>
                  </li>
                )}
                {selectedEmployee.contractLetter && (
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Contract/Offer Letter
                    <i
                      className="fas fa-eye"
                      style={{ cursor: "pointer" }}
                      onClick={() => openBase64InNewTab(selectedEmployee.contractLetter)}
                    ></i>
                  </li>
                )}
              </ul>


            </div>
          ) : (
            <p>Loading employee details...</p>
          )}
        </Modal.Body>



        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>




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

export default ViewEmp;
