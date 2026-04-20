const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");
const sendSMS = require("../snsSms"); // your SNS file

// ADD EXPENSE
router.post("/add-expense", async (req, res) => {
  try {
    const { userId, amount, category } = req.body;

    // Save expense
    await Expense.create({ userId, amount, category });

    // Calculate total
    const totalData = await Expense.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    const total = totalData[0]?.total || 0;

    // Limit
    const limit = 5000;

    // Send SMS if exceeded
    if (total > limit) {
      await sendSMS(`⚠️ Budget exceeded! Total: ₹${total}`);
    }

    res.json({ message: "Expense added successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;