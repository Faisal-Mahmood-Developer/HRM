const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  empId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }  // ✅ Include this
});

module.exports = mongoose.model('User', UserSchema);
