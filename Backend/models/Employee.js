const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: String,
  fatherName: String,
  empId: { type: String, unique: true },
  designation: String,
  email: String,
  contact: String,
  ice: String,
  idNumber: String,
  department: String,
  city: String,
  address: String,
  linkedin: String,
  bloodGroup: String,
  joiningDate: String,
  gender: String,
  maritalStatus: String,
  nationality: String,
  employeeStatus: String,
  workLocation: String,
  jobType: String,
  emergencyContactName: String,
  resignationDate: String,
  lastWorkingDay: String,

  // Store files as Base64 strings
  photo: String,
  resume: String,
  cnicCopy: String,
  academicDocs: String,
  experienceLetters: String,
  contractLetter: String,
});

module.exports = mongoose.model('Employee', employeeSchema);
