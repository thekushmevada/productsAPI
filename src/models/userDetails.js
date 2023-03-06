const express = require('express');
const mongoose = require('mongoose');

const userDetailsSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true,
        trim:true,
    },
    lname:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    mobile: {
        type:Number,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        trim:true,
    },
},{
    collection:"UserInfo",
});

mongoose.model("UserInfo" , userDetailsSchema)