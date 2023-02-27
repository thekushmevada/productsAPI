const express = require('express');
require("../src/db/conn.js")

const ProductRanking = require("../src/models/products")

const app = express();
const port = process.env.PORT || 4000;

const mongoose = require("mongoose");
const connectDB = require("../src/db/conn");
const e = require('express');
mongoose.set('strictQuery', false);

const cors = require('cors');
app.use(cors({
    origin: '*'
}));

connectDB().then(() => {
    ProductRanking.findOne({}, function (error, data) {
        if (error) return console.error(error);
    });
})

app.listen(port,() => {
    console.log(`connection is live at port ${port}`);
})

app.use(express.json());

//we will handle post request
app.post("/products", async(req, res) => {
    try{
        new ProductRanking(req.body)
        //console.log(req.body);
        const insertProduct = await ProductRanking(req.body).save();
        res.status(201).send(insertProduct);
    }catch(e){
        res.status(400).send(e);
    }
});

//we will handle get request
app.get("/products", async(req, res) => {
    try{
        const getProduct = await ProductRanking.find({});
        res.send(getProduct);
    }catch(e){
        res.status(400).send(e);
    }
    // console.log("Please provide ID of Product")
    // res.send(e);
});

//we will handle get request of individual
app.get("/products/:id", async(req, res) => {
    try{
        const _id = req.params.id;
        const getProductU = await ProductRanking.findById({_id});
        res.send(getProductU);
    }catch(e){
        res.status(400).send(e);
    }
});

