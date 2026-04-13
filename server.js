const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb+srv://lakshmipriyasarathi_db_user:P59u4JPapOXBFdy9@cluster0.jgahvno.mongodb.net/?appName=Cluster0");

// Serve HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Your existing routes below...
app.get('/expenses', async (req, res) => {
  const expenses = await Expense.find();
  res.json(expenses);
});

app.post('/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

app.delete('/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on port 5000'));