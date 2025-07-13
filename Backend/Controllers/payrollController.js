const Payroll = require('../models/payroll');

const addPayroll = async (req, res) => {
    try {
        const {
            name,
            empId,
            month,
            basicSalary,
            bonus,
            extraOvertime,
            medicalAllowance,
            conveyanceAllowance,
            loanDeductions,
            incomeTax,
            maritalStatus // ✅ Add this line
        } = req.body;

        const newPayroll = new Payroll({
            name,
            empId,
            month,
            basicSalary,
            bonus,
            extraOvertime,
            medicalAllowance,
            conveyanceAllowance,
            loanDeductions,
            incomeTax,
            maritalStatus // ✅ Save this field
        });

        await newPayroll.save();

        res.status(201).json({
            message: 'Payroll added successfully',
            data: newPayroll
        });
    } catch (error) {
        console.error('Error adding payroll:', error.message);
        res.status(500).json({
            error: 'Failed to add payroll',
            details: error.message
        });
    }
};


// View Payrolls (optional month filter)
const getPayrolls = async (req, res) => {
    try {
        const { month } = req.query;
        const filter = month ? { month } : {};
        const payrolls = await Payroll.find(filter);
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch payrolls' });
    }
};

// Delete Employee
// Example delete function
const deletePyroll = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await Payroll.findByIdAndDelete(id);
        if (!result) return res.status(404).json({ message: "Payroll not found" });
        res.status(200).json({ message: "Payroll deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



const getPayrollById = async (req, res) => {
    try {
        const { id } = req.params;
        const payroll = await Payroll.findById(id);
        if (!payroll) {
            return res.status(404).json({ message: "Payroll not found" });
        }
        res.json(payroll);
    } catch (error) {
        console.error("Error fetching payroll:", error.message);
        res.status(500).json({ message: "Server error" });
    }
};


const updatePayroll = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await Payroll.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Payroll not found" });
        res.json({ message: "Payroll updated successfully", data: updated });
    } catch (error) {
        console.error("Update error:", error.message);
        res.status(500).json({ error: "Failed to update payroll" });
    }
};



const getPayrollsByYear = async (req, res) => {
  try {
    const { id } = req.params; // Now expecting MongoDB _id
    const { year } = req.query;

    if (!id || !year) {
      return res.status(400).json({ error: "Payroll ID and year are required" });
    }

    // Find the initial record by _id
    const record = await Payroll.findById(id);
    if (!record) {
      return res.status(404).json({ error: "Payroll record not found" });
    }

    const empId = record.empId;

    // Build regex to match month starting with year (e.g., "2025-")
    const regex = new RegExp(`^${year}-`);

    // Find all payrolls for this empId and year
    const payrolls = await Payroll.find({
      empId: String(empId),
      month: { $regex: regex }
    }).sort({ month: 1 });

    res.json(payrolls);
  } catch (error) {
    console.error("Error fetching payrolls by year:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};





module.exports = {
    addPayroll,
    getPayrolls,
    deletePyroll,
    getPayrollById,
    getPayrollsByYear,
    updatePayroll
};

