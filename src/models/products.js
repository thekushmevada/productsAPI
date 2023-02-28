const express = require('express');
const mongoose = require('mongoose');
const uuidv4 = require("uuid/v4")

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    company:{
        type:String,
        required:true,
        trim:true,
    },
    price:{
        type:Number,
    },
    colors:[
        {
            type:String,
        },
        {
            type:String,
        },
        {
            type:String,
        },
    ],
    image:[
        {
            type:String,
        },
        {
            type:String,
        },
        {
            type:String,
        },
        {
            type:String,
        },
    ],
    description:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
        trim:true,
    },
    featured:{
        type:Boolean,
    },
    shipping:{
        type:Boolean,
    },
    stock:{
        type:Number,
    },
    reviews:{
        type:Number,
    },
    stars: {
        type:Number,
    }
})

const ProductRanking = new mongoose.model("ProductRanking" , productSchema)

module.exports = ProductRanking;