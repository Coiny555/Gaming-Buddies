const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB (replace with your connection string)
mongoose.connect("mongodb+srv://iffatrahman99_db_user:GamingBuddies123!@gamingbuddies.hiktmwi.mongodb.net/?appName=GamingBuddies")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

// Define schema and model
const avatarSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  avatar: { type: String, required: true } // store base64 or image URL
});

const Avatar = mongoose.model('Avatar', avatarSchema);

// Route to save avatar
app.post('/api/users/save-avatar', async (req, res) => {
  try {
    const { userId, avatar } = req.body;

    if (!userId || !avatar) {
      return res.status(400).json({ error: "Missing required fields: userId or avatar" });
    }

    // Save to MongoDB
    const newAvatar = new Avatar({ userId, avatar });
    await newAvatar.save();

    res.json({ success: true, message: "Avatar saved successfully!" });
  } catch (err) {
    console.error("Error saving avatar:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start server
app.listen(3000, () => {
  console.log(`Backend running at http://localhost:3000`);
});
