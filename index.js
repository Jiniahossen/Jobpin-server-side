const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app=express();
const port =process.env.PORT || 5000;


//pass : ILO1UzlYLCFeSDZE
//user:Apply4you

//middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.aygxif0.mongodb.net/?retryWrites=true&w=majority`;

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
     
    //job collection

    const JObsDB=client.db('JOBDB');
    const jobCollections=JObsDB.collection('jobCollections');
    const appliedJobsCollections=JObsDB.collection('Applied Jobs')


    //post data

    app.post('/jobs',async(req,res)=>{
      const body=req.body;
      const result=await jobCollections.insertOne(body);
      res.send(result);
      console.log(result)
    })

    //get All data

    app.get('/jobs', async (req, res) => {
      const result = await jobCollections.find().toArray();
      res.send(result);
    })

    //get product by ID

    app.get('/jobs/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)};
      const cursor=jobCollections.find(query);
      const result= await cursor.toArray();
      res.send(result);
    })

    //get  specific user data by email

    app.get('/jobs/:email', async (req, res) => {
      const user = req.params.email;
      const query = { email: user };
      const cursor = jobCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })


    //Post applied jobs data

    app.post('/applied-jobs',async(req,res)=>{
       const body=req.body;
       const result=await appliedJobsCollections.insertOne(body)
       res.send(result);
       console.log(result)
    }
    )


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/',(req,res)=>{
    res.send('Server is running')
})

app.listen(port,()=>{
    console.log(`server is running at port : ${port}`)
})