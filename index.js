const express = require('express')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000
const cors = require('cors');

// middleware
app.use(cors());
app.use(express.json())

console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rbfkgiq.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();


    const servicesCollection = client.db('ToyWorld').collection('services')
    const toysCollection = client.db('ToyWorld').collection('toys')

    app.get('/services', async (req, res) => {
      const cursor = servicesCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/services/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await servicesCollection.findOne(query)
      res.send(result)
    })


    // toys
    app.get('/toys', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { email: req.query.email }
      }
      const result = await toysCollection.find(query).toArray();
      res.send(result)
    })


    app.post('/toys', async (req, res) => {
      const toys = req.body
      console.log(toys)
      const result = await toysCollection.insertOne(toys)
      res.send(result)
    })

    app.get('/toys/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    const corsOptions = {
      origin: '*',
      credentials: true,
      optionSuccessStatus: 200,
    }
    app.use(cors(corsOptions))

    app.put('/toys/:id', async (req, res) => {
      const id = req.params.id
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true }
      const updateToy = req.body
      const toys = {
        $set: {
          price: updateToy.price,
          quantity: updateToy.quantity,
          description: updateToy.description
        }
      }
      const result = await toysCollection.updateOne(filter, toys, options)
      res.send(result)
    })

    app.delete('/toys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await toysCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Baby is playing with Toy world')
})

app.listen(port, () => {
  console.log(`Toy-world server is running on ${port}`)
})