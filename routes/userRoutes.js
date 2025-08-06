
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const  {sendNotification}  = require("../notificationFunction");

// 🔐 Signup
router.post("/signup", async (req, res) => {
  const { userName, password, pushNotificationToken } = req.body;
  console.log("Signup request:", req.body);
  
  try {
    const exists = await User.findOne({ userName });
    if (exists)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      userName,
      password: hashedPassword,
      pushNotificationToken,
    });

    await newUser.save();
    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
});

// 🔐 Signin
router.post("/signin", async (req, res) => {
  const { userName, password } = req.body;
  try {
    const user = await User.findOne({ userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid password" });

    res.json({ message: "Login successful", userId: user._id, user });
  } catch (err) {
    res.status(500).json({ message: "Signin failed", error: err.message });
  }
});

// ✏️ Update user (pushNotificationToken or password)
router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { pushNotificationToken, password } = req.body;

  try {
    const updateData = {};
    if (pushNotificationToken)
      updateData.pushNotificationToken = pushNotificationToken;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updated = await User.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User updated", user: updated });
  } catch (err) {
    res.status(500).json({ message: "Update failed", error: err.message });
  }
});

// 👤 Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Get user failed", error: err.message });
  }
});
// 👤 Get user by ID
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    if (!users) return res.status(404).json({ message: "Users not found" });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Get users failed", error: err.message });
  }
});

// POST /api/notify
// req.body = { token, title, body }

router.post('/notify', async (req, res) => {
  const { token, title, body } = req.body;
  logger.log('Notification request:', req.body);
  try {
    await sendNotification({ token, title, body });
    res.json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

module.exports = router;
