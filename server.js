const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://lakshmipriyasarathi_db_user:P59u4JPapOXBFdy9@cluster0.jgahvno.mongodb.net/?appName=Cluster0")
  .then(() => console.log('MongoDB connected!'))
  .catch(err => console.log('MongoDB error:', err));

// Routes
const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const expenseRoutes = require("./routes/expense");
app.use("/api", expenseRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));