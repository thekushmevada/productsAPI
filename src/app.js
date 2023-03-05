const express = require('express');
require("../src/db/conn.js")

const ProductRanking = require("../src/models/products")

const app = express();
const port = process.env.PORT || 4000;

const mongoose = require("mongoose");
const connectDB = require("../src/db/conn");
const e = require('express');
mongoose.set('strictQuery', false);
const bcrypt = require("bcryptjs");

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
        // console.log(req.query);
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
        // console.log(req.query);
        res.send(getProductU);
    }catch(e){
        res.status(400).send(e);
    }
});

//Register API
require("./models/userDetails");
const User = mongoose.model("UserInfo");
app.post("/register", async(req,res) => {
    const { fname , lname , email , password } = req.body;

    const encryptedPassword = await bcrypt.hash(password,10);
    try {
        const oldUser = await User.findOne({email});
        if(oldUser) {
            return res.send({error : "User Already exists"});
        }
        await User.create({
            fname ,
            lname , 
            email , 
            password : encryptedPassword ,
        });
        res.send({status: "ok"});
    } catch (error) {
        res.send({status: "error"});
    }
});