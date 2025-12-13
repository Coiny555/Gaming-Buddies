const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// MongoDB connection
const uri = "mongodb+srv://iffatrahman99_db_user:GamingBuddies123!@gamingbuddies.hiktmwi.mongodb.net/?appName=GamingBuddies";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let AvatarCollection;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    db = client.db("Gaming_Buddies_Database");
    AvatarCollection = db.collection("Avatars");
    console.log("✅ Database and collection ready");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}

connectDB();

// Route to save avatar
app.post("/api/save-avatar", async (req, res) => {
  try {
    const { username, avatar } = req.body;

    if (!username || !avatar) {
      return res.status(400).json({ error: "Missing username or avatar" });
    }

    // Check if avatar is a valid base64 image
    if (!avatar.startsWith('data:image/')) {
      return res.status(400).json({ error: "Invalid avatar format" });
    }

    // Insert document into Avatars collection
    const result = await AvatarCollection.insertOne({
      username,
      avatar,
      createdAt: new Date()
    });

    res.json({ 
      success: true, 
      message: "Avatar saved successfully!",
      id: result.insertedId 
    });

  } catch (error) {
    console.error("Error saving avatar:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: Route to get avatar by username
app.get("/api/get-avatar/:username", async (req, res) => {
  try {
    const { username } = req.params;
    
    const avatar = await AvatarCollection.findOne({ username });
    
    if (!avatar) {
      return res.status(404).json({ error: "Avatar not found" });
    }

    res.json({ 
      success: true, 
      avatar: avatar.avatar,
      createdAt: avatar.createdAt
    });

  } catch (error) {
    console.error("Error fetching avatar:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: Route to get all avatars
app.get("/api/avatars", async (req, res) => {
  try {
    const avatars = await AvatarCollection.find({}).toArray();
    
    res.json({ 
      success: true, 
      count: avatars.length,
      avatars 
    });

  } catch (error) {
    console.error("Error fetching avatars:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await client.close();
  console.log('✅ MongoDB connection closed');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});