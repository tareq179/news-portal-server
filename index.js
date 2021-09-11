const express = require("express");
const bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 5500;

app.get("/", (req, res) => {
  res.send("Hello the NewsPortal app is working working!");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g5ktv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
    console.log("Connection err", err);
    const AdminCollection = client.db("newsPortal").collection("admins");
    const NewsCollection = client.db("newsPortal").collection("post");
    const CategoryCollection = client.db("newsPortal").collection("category");
    

    // Admin
    app.get("/isAdmin",(req,res)=>{
        AdminCollection.find({email: req.query.email}).toArray((err,docs)=>{
            res.send(!!docs.length);
        })
    })

    app.post("/addAdmin",(req,res)=>{
        AdminCollection.insertOne(req.body).then((result)=>{
            res.send(!!result.insertedCount > 0);
        });
    });

    // Category
    app.get("/category",(req,res)=>{
        CategoryCollection.find({email: req.query.email}).toArray((err,docs)=>{
            res.send(!!docs.length);
        })
    })

    app.post("/addCategory",(req,res)=>{
        CategoryCollection.insertOne(req.body).then((result)=>{
            res.send(!!result.insertedCount > 0);
        });
    });
    
    // News
    app.get("/news",(req,res)=>{
        NewsCollection.find().toArray((err,docs)=>{
            res.send(docs);
        })
    })

    app.post("/newsById",(req,res)=>{
        NewsCollection.find({_id: req.params._id}).toArray((err,docs)=>{
            res.send(docs);
        })
    })

    

    app.post("/addNews",(req,res)=>{
        NewsCollection.insertOne(req.body).then((result)=>{
            res.send(!!result.insertedCount > 0);
        });
    });

    app.delete("/deleteNews/:id",(req,res)=>{
        NewsCollection.deleteOne({_id: ObjectId(req.params.id)}).then((result)=>{
            res.send(!!result.deletedCount)
        });
    });
    
    app.patch("/updateNews/:id",(req,res)=>{
        NewsCollection.updateOne(
            {_id: ObjectId(req.params.id)},
            {$set:req.body},
        )
        .then((result)=>{
            res.send(!!result.modifiedCount);
        });
    });

});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });