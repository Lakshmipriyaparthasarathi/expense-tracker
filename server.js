const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb+srv://lakshmipriyasarathi_db_user:P59u4JPapOXBFdy9@cluster0.jgahvno.mongodb.net/?appName=Cluster0")
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.log('❌ Error:', err));

// Expense Schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes

// GET all expenses
app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

// POST add new expense
app.post('/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

// DELETE an expense
app.delete('/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));