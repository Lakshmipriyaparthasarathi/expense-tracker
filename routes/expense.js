const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// AWS SNS
const AWS = require("aws-sdk");

// 🔥 AWS CONFIG (RENDER SAFE)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: "ap-south-1"
});

const sns = new AWS.SNS({ apiVersion: "2010-03-31" });


// ➤ ADD EXPENSE
router.post("/add-expense", async (req, res) => {
  try {

    console.log("🔥 ADD EXPENSE HIT");

    // SAVE TO DB
    const expense = await Expense.create({
      desc: req.body.desc || "No Desc",
      amount: Number(req.body.amount) || 0,
      category: req.body.category || "Other",
      date: req.body.date || new Date().toISOString().split("T")[0]
    });

    console.log("🔥 EXPENSE SAVED:", expense);

    // SNS TRIGGER
    console.log("🔥 ABOUT TO SEND SNS");

    try {
      const result = await sns.publish({
        Message: `Expense Added: ${expense.desc} - ₹${expense.amount}`,
        TopicArn: "arn:aws:sns:ap-south-1:721572846396:expense-alert-topic"
      }).promise();

      console.log("✅ SNS SUCCESS:", result);

    } catch (snsErr) {
      console.log("❌ SNS ERROR:", snsErr);
    }

    res.json(expense);

  } catch (err) {
    console.log("❌ ADD EXPENSE ERROR:", err);
    res.status(500).json({ message: "Error adding expense" });
  }
});


// ➤ GET EXPENSES
router.get("/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ _id: -1 });
    res.json(expenses);
  } catch (err) {
    console.log("❌ FETCH ERROR:", err);
    res.status(500).json({ message: "Error fetching expenses" });
  }
});


// ➤ DELETE EXPENSE
router.delete("/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.log("❌ DELETE ERROR:", err);
    res.status(500).json({ message: "Error deleting expense" });
  }
});


// ➤ TEST SNS
router.get("/test-sms", async (req, res) => {
  try {
    const result = await sns.publish({
      Message: "Test SMS from Expense Tracker",
      TopicArn: "arn:aws:sns:ap-south-1:721572846396:expense-alert-topic"
    }).promise();

    console.log("✅ TEST SNS SUCCESS:", result);

    res.send("✅ SMS Sent Successfully");

  } catch (err) {
    console.log("❌ TEST SNS ERROR:", err);
    res.status(500).send("❌ SMS Failed");
  }
});

module.exports = router;