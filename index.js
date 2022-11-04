const express = require('express');
const cors = require('cors');
require('dotenv').config();
const {MongoClient, ServerApiVersion, ObjectId} = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.egsefuu.mongodb.net/?retryWrites=true&w=majority`;
const uri = 'mongodb://127.0.0.1:27017/';
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});

async function run() {
    try {
        const database = client.db("amazon");
        const collection = database.collection("products");

        // Read Data (GET Method)
        app.get("/products", async (req, res) => {
            const query = {};
            const cursor = collection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await collection.findOne(query);
            res.send(result);
        });

        // Create Data (POST Method)
        app.post("/products", async (req, res) => {
            const products = req.body;
            const result = await collection.insertOne(products);
            res.send(result);
            console.log('Data added successfully!!!');
        });

        // Update Data (PUT Method)
        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const filter = {_id: ObjectId(id)};
            const product = req.body;
            const updatedProduct = {
                $set: {
                    title: product.title,
                    quantity: product.quantity,
                    price: product.price
                }
            };
            const option = {upsert: true};
            const result = await collection.updateOne(filter, updatedProduct, option);
            res.send(result);
        });

        // Delete Data (DELETE Method)
        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await collection.deleteOne(query);
            res.send(result);
        });


    } catch {
        console.log("An error has occured!!!");
    } finally {
        console.log("Good Job!!! Go Ahead!!!");
    }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Server is running fine!!!");
});

app.listen(port, () => {
    console.log(`Server is running on ${port} !!!`);
});