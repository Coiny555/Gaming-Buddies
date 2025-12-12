const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://iffatrahman99_db_user:GamingBuddies123!@gamingbuddies.hiktmwi.mongodb.net/?appName=GamingBuddies";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;
let playersCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    db = client.db("Gaming_Buddies_Database");
    playersCollection = db.collection("Players");
    console.log("✅ Database and collection ready");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}

connectDB();

app.post('http://localhost:3000', async (req, res) => {
    try {
        const { userId, avatar } = req.body;

        if (!userId || !avatar) {
            return res.status(400).json({ error: "Missing userId or avatar" });
        }

        // Avatar is a Base64 string like: "data:image/png;base64,iVBORw..."
        const base64PNG = avatar.split(",")[1];

        // Convert base64 → binary buffer
        const avatarBuffer = Buffer.from(base64PNG, "base64");

        // Update existing user document
        const result = await playersCollection.updateOne(
            { _id: new MongoClient.ObjectId(userId) },
            { $set: { avatarPNG: avatarBuffer } }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Avatar saved successfully!" });

    } catch (error) {
        console.error("Error saving avatar:", error);
        res.status(500).json({ error: "Server error while saving avatar" });
    }
});


app.listen(3000, () => { 
    console.log("🚀 Server running on port 3000");
});