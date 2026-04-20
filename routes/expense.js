const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// AWS SNS
const AWS = require("aws-sdk");

const sns = new AWS.SNS({
  region: "ap-south-1"
});


// ➤ ADD EXPENSE
router.post("/add-expense", async (req, res) => {
  try {

    // SAVE TO DB
    const expense = await Expense.create(req.body);
    const expense = await Expense.create({
  desc: req.body.desc || "No Desc",
  amount: Number(req.body.amount) || 0,
  category: req.body.category || "Other",
  date: req.body.date || new Date().toISOString().split("T")[0]
});

    // SEND SMS VIA SNS
    await sns.publish({
      Message: `Expense Added: ${expense.desc} - ₹${expense.amount}`,
      TopicArn: "arn:aws:sns:ap-south-1:721572846396:expense-alert-topic"
    }).promise();

    res.json(expense);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error adding expense" });
  }
});


// ➤ GET EXPENSES
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ _id: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching expenses" });
  }
});


// ➤ DELETE EXPENSE
router.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting expense" });
  }
});

module.exports = router;