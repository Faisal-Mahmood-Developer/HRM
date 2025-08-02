const Leave = require('../models/leave.model');
const sendEmail = require('../utils/mailer');
const User = require('../models/User');

// Employee submits a leave request
exports.submitLeaveRequest = async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.USER:", req.user);

    // Check if overlapping leave already exists
    const overlapping = await Leave.findOne({
      empId: req.user._id, // or req.user.empId depending on how you save it
      $or: [
        {
          from: { $lte: req.body.to },
          to: { $gte: req.body.from }
        }
      ]
    });

    if (overlapping) {
      return res.status(400).json({ error: 'You already have a leave request in this date range.' });
    }
    const newLeave = new Leave({
      ...req.body,
      empId: req.user.empId,
      status: 'Pending'
    });
    await newLeave.save();
    res.json({ message: 'Leave request submitted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};
// Employee sees own leave requests
exports.getMyLeaveRequests = async (req, res) => {
  try {
    const isAdmin = req.user.isAdmin;

    const leaves = isAdmin
      ? await Leave.find().sort({ createdAt: -1 }) // Admin sees all
      : await Leave.find({ empId: req.user.empId }).sort({ createdAt: -1 }); // User sees own
    // console.log("User Info:", req.user);

    res.status(200).json(leaves);
  } catch (error) {
    console.error("Error fetching leaves:", error);
    res.status(500).json({ message: "Server error while fetching leaves" });
  }
};
// Admin sees all leave requests
exports.getAllLeaveRequests = async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });
    res.json(leaves);
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
};

// Admin updates status
exports.updateLeaveStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Approved', 'Rejected'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ error: 'Leave not found' });

    leave.status = status;
    await leave.save();

    const user = await User.findOne({ empId: leave.empId });
    if (user?.email) {
      const subject = `Leave Request ${status}`;
      const html = `
        <p>Dear ${user.name || 'Employee'},</p>
        <p>Your leave request from <b>${leave.from}</b> to <b>${leave.to}</b> has been <strong>${status}</strong>.</p>
        <p><i>Reason:</i> ${leave.reason}</p>
        <p>Status: <b>${status}</b></p>
        <br/>
        <p>Regards,</p>
<hr style="border: none; border-top: 1px solid #ccc;" />

<!-- Email Signature Start -->
<!-- Email Signature Start -->
<div style="font-family: Arial, sans-serif; max-width: 600px; color: #000;">
  <p style="margin: 0; font-size: 0.8rem;">---</p>
  <h2 style="margin: 4px 0 2px 0; font-size: 1.2rem;">Faisal Mahmood</h2>
  <p style="margin: 0 0 6px 0; font-size: 0.95rem;">HR Manager</p>

  <table cellpadding="0" cellspacing="0" style="width: 100%; margin-bottom: 6px;">
    <tr>
      <td style="vertical-align: middle; width: 40px;">
        <img src="../images/Logo.png" class="img-fluid" alt="Cache Cloud Logo" style="height: 35px;" />
      </td>
      <td style="vertical-align: middle;">
        <span style="font-size: 1rem; color: #f78c2f; font-weight: 500;">Cache Cloud</span>
      </td>
    </tr>
  </table>

  <p style="margin: 0 0 6px 0; font-size: 0.85rem;">
    PAK: <a href="tel:+923083470930" style="color: #000; text-decoration: none;">+92 (308) 3470930</a><br>
    <a href="mailto:info@cache-cloud.com" style="color: #000; text-decoration: none;">info@cache-cloud.com</a> &nbsp;|&nbsp;
    <a href="https://www.cache-cloud.com" style="color: #0000ee; text-decoration: none;">www.cache-cloud.com</a>
  </p>

  <table cellpadding="0" cellspacing="0" style="font-size: 0.85rem; width: 100%;">
    <tr>
      <td style="vertical-align: top; width: 50%;">
        <strong>PAK Office:</strong><br>
        Suite 1208, 12th Floor,<br>
        ISE Towers, Islamabad,<br>
        Pakistan
      </td>
      <td style="vertical-align: top; width: 50%;">
        <strong>USA Office:</strong><br>
        30 Wall Street 8th Floor<br>
        New York City, New York 10005,<br>
        USA
      </td>
    </tr>
  </table>
</div>
<!-- Email Signature End -->



      `;

      await sendEmail(user.email, subject, html);
      console.log(`✅ Email sent to: ${user.email}`);
    } else {
      console.log('⚠️ Email not found for user:', leave.empId);
    }

    res.json({ message: `Leave ${status.toLowerCase()} successfully` });

  } catch (err) {
    console.error('❌ Leave status update failed:', err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};



// DELETE
exports.deleteLeave = async (req, res) => {
  try {
    const deletedLeave = await Leave.findByIdAndDelete(req.params.id);
    if (!deletedLeave) return res.status(404).json({ message: 'Leave not found' });
    res.status(200).json({ message: 'Leave deleted successfully' });
  } catch (error) {
    console.error('Error deleting Leave:', error);
    res.status(500).json({ message: 'Server error while deleting Leave' });
  }
};


exports.getApprovedLeavesCount = async (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ message: "Date is required" });

  const selectedDate = new Date(date);

  try {
    const leaves = await Leave.find({
      status: "Approved",
      from: { $lte: selectedDate },
      to: { $gte: selectedDate }
    });

    const count = leaves.length;

    res.json({ count, leaves });
  } catch (error) {
    console.error("Error fetching approved leaves", error);
    res.status(500).json({ message: "Server error" });
  }
};

