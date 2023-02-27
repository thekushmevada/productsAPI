const mongoose = require('mongoose');

// mongoose.connect("mongodb+srv://diyafurnitures18:diyafurnitures@cluster0.taa5fey.mongodb.net/products?retryWrites=true&w=majority" , {
//     useCreateIndex:true,
//     useNewUrlParser:true,
//     useUnifiedTopology:true
// }).then(() => {
//     console.log("connection succesfull");
// }).catch((e) => { 
//     // console.log(e)
//     console.log("some error occured in connection");
// } )

async function connectDB(){
    try {
        await mongoose.connect("mongodb+srv://diyafurnitures18:diyafurnitures@cluster0.taa5fey.mongodb.net/products?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.log("Error in Connecting", err);
    }
}

module.exports = connectDB;