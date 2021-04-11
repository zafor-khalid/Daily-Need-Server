const express = require('express')
const app = express()
const port = 5000
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(bodyParser.json())
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fxiau.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("ki-lagbe").collection("products");
  
    app.get('/allProducts', (req, res)=>{
        productsCollection.find()
        .toArray((err, items)=>{
            res.send(items)
        })
    })

    app.post('/addProduct', (req, res)=>{
        const event = req.body;
        // console.log('add', event);
        productsCollection.insertOne(event)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.delete('/delete/:id', (req, res)=>{
        const id = ObjectID(req.params.id);
        productsCollection.findOneAndDelete({_id:id})
        .then(documents => {
            res.send('true')
        })
    })


})

app.listen(process.env.PORT || port)