const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middluare
app.use(cors());
app.use(express.json());

// user:admin
//pass:md5i1aVDa9r3eV7J

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkylv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
 
try{
          
          await client.connect();
          const InventoryCollection = client.db("pharmacy").collection("inventory");

          app.get("/inventory", async(req,res)=>{

                    const query = {};
                    const cursor= InventoryCollection.find(query);
                    const inventory = await cursor.toArray()
                    res.send(inventory)

          })

          app.get("/inventory/:id",async(req,res)=>{

                    const id= req.params.id;
                    const query = {_id : ObjectId(id)}
                    const inventory = await InventoryCollection.findOne(query);
                    res.send(inventory)
          })
}
catch{


}



}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pharmacy manegment running server");
});

app.listen(port, () => {
  console.log(`Pharmacy manegment app listening on port ${port}`);
});
