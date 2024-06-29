const mongoose = require('mongoose');

const loadDb = async () => {
    console.log(process.env.MONGOCDN)
    // mongoose.connect('mongodb://127.0.0.1:27017/CaseQuestDB');
    await mongoose.connect("mongodb+srv://rwili:0547458985Aa%40%21@casequestdb.rc5i7al.mongodb.net/?appName=casequestdb");
}



module.exports = loadDb;


// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://rwili:0547458985Aa%40%21@casequestdb.rc5i7al.mongodb.net/?appName=casequestdb";

// // Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function loadDb() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

module.exports = loadDb;
