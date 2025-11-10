const express = require('express') // Imports the express module, which is a web application framework for Node.js which provides functionality to do the following: It simplifies routing and handling HTTP (a set of rules we follow when trasnfering info on the internet or bteween our computer and a server) REQUESTS like POST, GET, etc.

const mongoose = require('mongoose') //Imports the mongoose module, which creates the documents inside of the collections on our database within MongoDB

const cors = require ('cors') // Imports the cors module, which enables Cross-Origin Resource Sharing, allowing your server to handle requests from different origins.

//Though our data is stored remotely on MongoDB's cloud server, we will use a localhost (a server running from the local machine) as the middle man between the frontend and the MongoDB

//connecting to our remote database on MongoDB via mongoose
mongoose.connect("mongodb+srv://iffatrahman99_db_user:GamingBuddies123!@gamingbuddies.hiktmwi.mongodb.net/?appName=GamingBuddies")
    .then(() => console.log("successfully connected to the remote database on MongoDB - Gamming_Buddies_Database"))
    .catch(err => console.error("error", err));
//the lines below are the configuration to the mongoDB if you did so via the MongoDB driver
/*
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://iffatrahman99_db_user:GamingBuddies123!@gamingbuddies.hiktmwi.mongodb.net/?appName=GamingBuddies";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("Gaming_Buddies_Database").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

//the following methods are methods used to interact with the database (server-side logic)

const app = express(); //app is an instance of the framework express. app will allows us to execute the provided funcalities from express to do the above stated routes
//creates or uploads new data by grabbing data from html doc where user input is stored to database-> app.post() -> POST REQUEST ()
//read or retrieve only NON-SENSITIVE data from database -> app.get() -> GET REQUEST
//update exsisting data in the database -> app.put() -> PUT REQUEST
//delete data in the database -> app.delete() -> DELETE REQUEST
//The value of the method attribute within the form element fo your html document needs to match the rspective http method/request: ex html -> method=POST, js -> app.post();
app.use(cors());
app.use(express.json());


//create the model for how each documentation should look like in the collection:
const Model = new mongoose.Schema({
    College: String,
    Username: String,
    Status: String,
    Last_Game_Played: String
});

// first parameter: name of variable
// second parameter: name of model
// third parameter: Name of collection
const Player = mongoose.model("Player", Model, "Players");

//utlize app to do post reuqest and send data to database under collection Players
app.post("/DataUpload", async (request, response) => {
    try {
        const newPlayer = new Player(request.body);
        await newPlayer.save();
        console.log(newPlayer); //verify if data is any good by seeing it uploaded to the console.
        response.json({message: "Data uploaded to collections"});
    } 
    catch(error){
        response.status(500).json({Uhoh: error.message});
    }
});