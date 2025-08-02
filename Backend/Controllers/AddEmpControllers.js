const Employee = require('../models/Employee');

const toBase64 = (file) => {
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};

// CREATE
exports.createEmployee = async (req, res) => {
  try {
    const formData = req.body;
    const files = req.files;

    const existing = await Employee.findOne({ empId: formData.empId });
    if (existing) {
      return res.status(400).json({ message: 'Employee ID already exists' });
    }

    const newEmployee = new Employee({
      ...formData,
      photo: files.photo ? toBase64(files.photo[0]) : '',
      resume: files.resume ? toBase64(files.resume[0]) : '',
      cnicCopy: files.cnicCopy ? toBase64(files.cnicCopy[0]) : '',
      academicDocs: files.academicDocs ? toBase64(files.academicDocs[0]) : '',
      experienceLetters: files.experienceLetters ? toBase64(files.experienceLetters[0]) : '',
      contractLetter: files.contractLetter ? toBase64(files.contractLetter[0]) : '',
    });

    await newEmployee.save();
    res.status(201).json({ message: 'Employee created successfully' });
  } catch (error) {
    console.error('Error creating employee:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// READ ALL
exports.getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employees', error: error.message });
  }
};

// READ ONE
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};

// UPDATE
exports.updateEmployee = async (req, res) => {
  try {
    const updatedData = { ...req.body };
    const files = req.files;

    if (files.photo) updatedData.photo = toBase64(files.photo[0]);
    if (files.resume) updatedData.resume = toBase64(files.resume[0]);
    if (files.cnicCopy) updatedData.cnicCopy = toBase64(files.cnicCopy[0]);
    if (files.academicDocs) updatedData.academicDocs = toBase64(files.academicDocs[0]);
    if (files.experienceLetters) updatedData.experienceLetters = toBase64(files.experienceLetters[0]);
    if (files.contractLetter) updatedData.contractLetter = toBase64(files.contractLetter[0]);

    await Employee.findByIdAndUpdate(req.params.id, updatedData);
    res.status(200).json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: 'Error updating employee' });
  }
};

// DELETE
exports.deleteEmp = async (req, res) => {
  try {
    const deletedEmp = await Employee.findByIdAndDelete(req.params.id);
    if (!deletedEmp) return res.status(404).json({ message: 'Employee not found' });
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({ message: 'Server error while deleting employee' });
  }
};


exports.getUniq_Emp = async (req, res) => {
  try {
    const empId = req.user.empId || req.user._id;

    if (!empId) {
      return res.status(400).json({ error: 'Employee ID not found in token' });
    }

    const employee = await Employee.findOne({ empId: String(empId) });

    if (!employee) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.status(200).json(employee);
  } catch (error) {
    console.error("Error fetching employee:", error.message);
    res.status(500).json({ message: 'Failed to fetch employee', error: error.message });
  }
};
