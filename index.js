const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
// const { response } = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//middluare
app.use(cors());
app.use(express.json());

// function JwtVerify(req, res, next) {

//   const headerAuth= req.headers.authorization;
//   // console.log(headerAuth.authorization)
//   next();
// }

// user:admin
//pass:md5i1aVDa9r3eV7J
{/* <h1>Change rep0</h1> */}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fkylv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    await client.connect();
    const InventoryCollection = client.db("pharmacy").collection("inventory");

    app.post("/login", async (req, res) => {
      const user = req.body;
      const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, {
        expiresIn: "1d",
      });
      res.send({ accessToken });
    });

    app.get("/inventory", async (req, res) => {
      const query = {};
      const cursor = InventoryCollection.find(query);
      const inventory = await cursor.toArray();
      res.send(inventory);
    });

    app.get("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const inventory = await InventoryCollection.findOne(query);
      res.send(inventory);
    });

    //post

    app.post("/inventory", async (req, res) => {
      const newIteam = req.body;
      const result = await InventoryCollection.insertOne(newIteam);
      res.send(result);
    });
    //delete
    app.delete("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await InventoryCollection.deleteOne(query);
      res.send(result);
    });
    //get

    // app.get("/my-inventory", async (req, res) => {
    //   const email = req.query.email;

    //   // console.log(email)
    //   const query = { email };
    //   const cursor = InventoryCollection.find(query);
    //   const inventory = await cursor.toArray();
    //   res.send(inventory);
    // });

    app.get("/my-inventory/:id", async (req, res) => {
      const email = req.params.id;

      const query = { userID: email };
      const iteams = InventoryCollection.find(query);
      const result = await iteams.toArray();
      res.send(result);
    });

    app.put("/inventory/:id", async (req, res) => {
      const id = req.params.id;
      const data = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedoc = {
        $set: {
          quantity: data.Quentity,
        },
      };
      const result = await InventoryCollection.updateOne(
        filter,
        updatedoc,
        options
      );
      res.send(result);
    });
  } catch {}
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Pharmacy manegment running server");
});

app.listen(port, () => {
  console.log(`Pharmacy manegment app listening on port ${port}`);
});
