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
let UserCredsCollection;
// Connect to MongoDB
async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Successfully connected to MongoDB!");
    
    db = client.db("Gaming_Buddies_Database");
    UserCredsCollection = db.collection("UserCreds");
    console.log("✅ Database and collection ready");
  } catch (error) {
    console.error("❌ Connection failed:", error);
    process.exit(1);
  }
}
connectDB();

// POST endpoint
app.post("/UserCredsUpload", async (request, response) => {
    console.log("📥 Received data:", request.body);
    
    try {
        const result = await UserCredsCollection.insertOne(request.body);
        console.log("✅ Data saved! ID:", result.insertedId);
        
        response.json({
            message: "Success!", 
            id: result.insertedId
        });
    } 
    catch(error){
        console.error("❌ Error:", error.message);
        response.status(500).json({error: error.message});
    }
});

app.listen(3000, () => { 
    console.log("🚀 Server running on port 3000");
});
// Graceful shutdown
process.on('SIGINT', async () => {
    await client.close();
    console.log("MongoDB connection closed");
    process.exit(0);
});