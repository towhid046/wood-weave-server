const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.q1nysvk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const craftCollection = client.db("craftDB").collection("crafts");

    app.get("/", async (req, res) => {
      res.send("Craft server bd is running...");
    });

    app.get("/crafts", async (req, res) => {
      const cursor =  craftCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/crafts/:id', async(req, res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result  = await craftCollection.findOne(query)
      res.send(result)
    })

    app.get('/user-crafts/:email', async(req, res)=>{
      const email = req.params.email
      const query = {user_email: email}
      const cursor = craftCollection.find(query)
      const result = await cursor.toArray()
      res.send(result)
    })

    app.post("/crafts", async (req, res) => {
      const craft = req.body;
      const result = await  craftCollection.insertOne(craft);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`craft server bd is running on PORT: ${port}`);
});
