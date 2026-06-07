require('dotenv').config();

const mongoose = require('mongoose');
const db_username = process.env.MONGODB_CLUSTER_USERNAME;
const db_password = process.env.MONGODB_CLUSTER_PASSWORD;

async function connectDB(){
    try {
        await mongoose.connect(`mongodb+srv://${db_username}:${db_password}@cluster0.taa5fey.mongodb.net/products?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } 
    catch (err) {
        console.log("Error in Connecting", err);
    }
}

module.exports = connectDB;