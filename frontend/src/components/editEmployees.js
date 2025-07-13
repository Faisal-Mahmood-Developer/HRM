import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', fatherName: '', empId: '', designation: '', email: '', contact: '',
    ice: '', idNumber: '', department: 'Software Department', city: '', address: '',
    linkedin: '', bloodGroup: '', joiningDate: '', gender: '', maritalStatus: '', nationality: '',
    employeeStatus: '', workLocation: '', jobType: '', emergencyContactName: '',
    resignationDate: '', lastWorkingDay: ''
  });

  const [file, setFile] = useState(null);
  const [resume, setResume] = useState(null);
  const [cnicCopy, setCnicCopy] = useState(null);
  const [academicDocs, setAcademicDocs] = useState(null);
  const [experienceLetters, setExperienceLetters] = useState(null);
  const [contractLetter, setContractLetter] = useState(null);

  const [alertMsg, setAlertMsg] = useState('');
  const [alertType, setAlertType] = useState('');

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/employees/editEmp/${id}`);
        if (!res.ok) throw new Error("Failed to fetch employee");
        const data = await res.json();
        setFormData({
          ...data,
          resignationDate: data.resignationDate || '',
          lastWorkingDay: data.lastWorkingDay || ''
        });
      } catch (err) {
        console.error('Error fetching employee:', err);
        setAlertMsg("Failed to load employee data.");
        setAlertType("danger");
      }
    };
    fetchEmployee();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleFileChange = (setter) => (e) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    // File type validations
    if (resume && resume.type !== "application/pdf") {
      setAlertMsg("Resume must be a PDF file.");
      setAlertType("danger");
      return;
    }
    if (experienceLetters && experienceLetters.type !== "application/pdf") {
      setAlertMsg("Experience Letters must be a PDF file.");
      setAlertType("danger");
      return;
    }
    if (academicDocs && academicDocs.type !== "application/pdf") {
      setAlertMsg("Academic Documents must be a PDF file.");
      setAlertType("danger");
      return;
    }
    if (contractLetter && contractLetter.type !== "application/pdf") {
      setAlertMsg("Contract/Offer Letter must be a PDF file.");
      setAlertType("danger");
      return;
    }
    if (file && !file.type.startsWith("image/")) {
      setAlertMsg("Uploaded image must be an image file.");
      setAlertType("danger");
      return;
    }
    if (cnicCopy && !cnicCopy.type.startsWith("image/")) {
      setAlertMsg("CNIC Copy must be an image file.");
      setAlertType("danger");
      return;
    }

    // Append files
    if (file) data.append('photo', file);
    if (resume) data.append('resume', resume);
    if (cnicCopy) data.append('cnicCopy', cnicCopy);
    if (academicDocs) data.append('academicDocs', academicDocs);
    if (experienceLetters) data.append('experienceLetters', experienceLetters);
    if (contractLetter) data.append('contractLetter', contractLetter);

    try {
      const res = await fetch(`http://localhost:5000/api/employees/update/${id}`, {
        method: 'PUT',
        body: data
      });
      const result = await res.json();
      if (res.ok) {
        setAlertMsg("Employee updated successfully!");
        setAlertType("success");
        setTimeout(() => {
          navigate('/viewemp');
        }, 1500);
      } else {
        setAlertMsg(result.message || "Failed to update employee.");
        setAlertType("danger");
      }
    } catch (error) {
      console.error('Update failed:', error);
      setAlertMsg("Failed to update employee data.");
      setAlertType("danger");
    }
  };

  const cancelhandle = () => {
    navigate('/viewemp');
  };

  return (
    <div className="container mt-2">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0 text-center">Edit Employee</h4>
        </div>
        <div className="card-body" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {alertMsg && (
            <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
              {alertMsg}
              <button type="button" className="btn-close" onClick={() => setAlertMsg('')} aria-label="Close"></button>
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row g-3">
              
              {/* Basic Info */}
              <div className="col-md-4"><label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Father Name</label>
                <input type="text" className="form-control" name="fatherName" value={formData.fatherName} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Employee ID</label>
                <input type="text" className="form-control" name="empId" value={formData.empId} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Designation</label>
                <input type="text" className="form-control" name="designation" value={formData.designation} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Contact Number</label>
                <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">ICE Number</label>
                <input type="text" className="form-control" name="ice" value={formData.ice} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">ID Number</label>
                <input type="text" className="form-control" name="idNumber" value={formData.idNumber} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">City</label>
                <input type="text" className="form-control" name="city" value={formData.city} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Address</label>
                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Linkedin</label>
                <input type="text" className="form-control" name="linkedin" value={formData.linkedin} onChange={handleChange} />
              </div>
              <div className="col-md-4"><label className="form-label">Blood Group</label>
                <input type="text" className="form-control" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} required />
              </div>

              {/* Dropdowns */}
              <div className="col-md-4"><label className="form-label">Gender</label>
                <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Marital Status</label>
                <select className="form-select" name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Nationality</label>
                <input type="text" className="form-control" name="nationality" value={formData.nationality} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Department</label>
                <select className="form-select" name="department" value={formData.department} onChange={handleChange}>
                  <option value="Software Department">Software Department</option>
                  <option value="HR Department">HR Department</option>
                  <option value="Database Department">Database Department</option>
                  <option value="QA Department">QA Department</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Joining Date</label>
                <input type="date" className="form-control" name="joiningDate" value={formData.joiningDate} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Upload Image</label>
                <input type="file" className="form-control" onChange={handleFileChange(setFile)} accept="image/*" />
              </div>

              {/* New Fields */}
              <div className="col-md-4"><label className="form-label">Employee Status</label>
                <select className="form-select" name="employeeStatus" value={formData.employeeStatus} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Active">Active</option>
                  <option value="Resigned">Resigned</option>
                  <option value="Terminated">Terminated</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Work Location</label>
                <select className="form-select" name="workLocation" value={formData.workLocation} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Office">Office</option>
                  <option value="Remote">Remote</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Job Type</label>
                <select className="form-select" name="jobType" value={formData.jobType} onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="Permanent">Permanent</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="col-md-4"><label className="form-label">Emergency Contact Person</label>
                <input type="text" className="form-control" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} required />
              </div>
              <div className="col-md-4"><label className="form-label">Resignation Date</label>
                <input type="date" className="form-control" name="resignationDate" value={formData.resignationDate} onChange={handleChange} />
              </div>
              <div className="col-md-4"><label className="form-label">Last Working Day</label>
                <input type="date" className="form-control" name="lastWorkingDay" value={formData.lastWorkingDay} onChange={handleChange} />
              </div>

              {/* File Uploads */}
              <div className="col-md-4"><label className="form-label">Upload Resume</label>
                <input type="file" className="form-control" onChange={handleFileChange(setResume)} />
              </div>
              <div className="col-md-4"><label className="form-label">Upload CNIC Copy</label>
                <input type="file" className="form-control" onChange={handleFileChange(setCnicCopy)} />
              </div>
              <div className="col-md-4"><label className="form-label">Upload Academic Documents</label>
                <input type="file" className="form-control" onChange={handleFileChange(setAcademicDocs)} />
              </div>
              <div className="col-md-4"><label className="form-label">Upload Experience Letters</label>
                <input type="file" className="form-control" onChange={handleFileChange(setExperienceLetters)} />
              </div>
              <div className="col-md-4"><label className="form-label">Upload Contract/Offer Letter</label>
                <input type="file" className="form-control" onChange={handleFileChange(setContractLetter)} />
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end gap-3">
              <button type="submit" className="btn btn-success w-100">Update</button>
              <button type="button" className="btn btn-secondary w-100" onClick={cancelhandle}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditEmployee;
