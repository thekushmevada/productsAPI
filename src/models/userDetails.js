const express = require("express");
const mongoose = require("mongoose");

const userDetailsSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      required: true,
    },
    fname: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    lname: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    mobile: {
      type: Number,
      unique: false,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    collection: "UserInfo",
  }
);

mongoose.model("UserInfo", userDetailsSchema);
