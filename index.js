const express = require("express");
const cors = require("cors");
require('dotenv').config()
const app = express();
const brands = require("./data/brands.json");
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o8c7bsg.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
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
    await client.connect();

    const carCollection = client.db('carDB').collection('car');
    const cartCollection = client.db('cartDb').collection('cart') 

    app.get('/car', async(req,res) =>{
        const cursor = carCollection.find()
        const result = await cursor.toArray();
        res.send(result)
    })

    app.get('/car/:id', async(req,res) =>{
        const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await carCollection.findOne(query);
      res.send(result);
    })

    app.get('/carCart', async(req,res) =>{
        const cursor = cartCollection.find();
      const result = await cursor.toArray()
      res.send(result);
    })

    app.post("/car", async (req, res) => {
        const newCar = req.body;
        console.log(newCar);
  
        const result = await carCollection.insertOne(newCar);
        res.send(result)
      });

    app.post('/carCart', async(req,res) =>{
      const addCar = req.body;
      console.log(addCar);

      const result = await cartCollection.insertOne(addCar);
      res.send(result)
    }) 
    
    
    app.put("/car/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedCar = req.body;
      const car = {
        $set: {
          model:updatedCar.model,
          image:updatedCar.image,
          brand:updatedCar.brand,
          type:updatedCar.type,
          price:updatedCar.price,
          rating:updatedCar.rating,
          details:updatedCar.details
                  },
      };

      const result = await carCollection.updateOne(filter, car, options);
      res.send(result)
    });

    app.delete("/carCart/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });


    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/brands", (req, res) => {
  res.send(brands);
});

app.get("/", (req, res) => {
  res.send("Brand Shop server is running successfully");
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
