const express = require("express");
const mongoose = require("mongoose");

const inquiryDetailsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
    Message: {
      type: String,
      required: true,
      trim: true,
      unique: false,
    },
  },
  {
    collection: "Queries",
  }
);

mongoose.model("inquiryDetails", inquiryDetailsSchema);
