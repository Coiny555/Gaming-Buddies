//import the dependencies from the package.json
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

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

//


//Fill the YourBio.html form
app.get('/Players/Username/:Username', async (request, response) => {
    try {
        const username = request.params.Username;
        
        const player = await playersCollection.findOne({ Username: username });
        
        if (player) {
            response.json(player);
        } else {
            response.status(404).json({ error: 'Player not found' });
        }
    } catch (err) {
        response.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => { 
    console.log("🚀 Server running on port 3000");
});