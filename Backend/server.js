const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');
const employeeRoutes = require('./routes/EmpRoutes'); // ✅ Make sure path is correct
const payrollRoutes = require('./routes/payrollRoutes'); // ✅ Make sure path is correct
const expneseRoutes = require('./routes/expenseRoute'); // ✅ Make sure path is correct
const inventoryRoutes = require("./routes/inventoryRoutes");
const createACc = require('./routes/createAccRoute')
const loginPage = require('./routes/loginPage')
const attendancePage = require('./routes/attendanceRoutes')

const app = express();
connectDB(); // ✅ Don't forget to connect to MongoDB
app.use(cors()); // ✅ Enable CORS here

// ✅ Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // frontend port
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
// ✅ Add this line to serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/employees', employeeRoutes); // ✅ This expects `employeeRoutes` to be a router
app.use('/api/payroll', payrollRoutes); // ✅ Mount payroll routes
app.use('/api/expense', expneseRoutes); // ✅ Mount payroll routes
app.use("/api/inventory", inventoryRoutes);
app.use("/api/auth", createACc);
app.use('/api/home', loginPage);
app.use('/api/attendance', attendancePage);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
