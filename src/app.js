const express = require("express");
require("../src/db/conn.js");

const ProductRanking = require("../src/models/products");

const app = express();
const port = process.env.PORT || 4000;

const mongoose = require("mongoose");
const connectDB = require("../src/db/conn");
const e = require("express");
mongoose.set("strictQuery", false);

//Users
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECRET =
  "abcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()_-+=`~?<>,.:;''|";
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
var nodemailer = require("nodemailer");

const cors = require("cors");
app.use(
  cors({
    origin: "*",
  })
);

connectDB().then(() => {
  ProductRanking.findOne({}, function (error, data) {
    if (error) return console.error(error);
  });
});

app.listen(port, () => {
  console.log(`connection is live at port ${port}`);
});

app.use(express.json());

//we will handle post request
app.post("/products", async (req, res) => {
  try {
    new ProductRanking(req.body);
    //console.log(req.body);
    const insertProduct = await ProductRanking(req.body).save();
    res.status(201).send(insertProduct);
  } catch (e) {
    res.status(400).send(e);
  }
});

//we will handle get request
app.get("/products", async (req, res) => {
  try {
    const getProduct = await ProductRanking.find({});
    // console.log(req.query);
    res.send(getProduct);
  } catch (e) {
    res.status(400).send(e);
  }
  // console.log("Please provide ID of Product")
  // res.send(e);
});

//we will handle get request of individual
app.get("/products/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const getProductU = await ProductRanking.findById({ _id });
    // console.log(req.query);
    res.send(getProductU);
  } catch (e) {
    res.status(400).send(e);
  }
});

//User Register API
require("./models/userDetails");
const User = mongoose.model("UserInfo");
app.post("/register", async (req, res) => {
  const { fname, lname, email, mobile, password, userType } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);
  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ error: "User Already exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      mobile,
      password: encryptedPassword,
      userType,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

//User Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ error: "error" });
    }
  }
  res.json({ status: "error", error: "InvAlid Password" });
});

// User Data API
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "user not exists!" });
    }
    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `https://productssapi.onrender.com/reset-password/${oldUser._id}/${token}`;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "diyafurnitures18@gmail.com",
        pass: "jgpzwdtmpqcswgxc",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: oldUser.email,
      subject: "Reset Password",
      text: "Please click on this link for reset password : " + link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    // console.log(link);
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  // console.log(req.params);
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "user not exists!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not verified" });
  } catch (error) {
    res.send("not verified");
  }
  // res.send("Done");
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "user not exists!" });
  }
  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );
    res.json({ status: "Password Updated" });
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    res.json({ status: "Something went wrong" });
  }
});

//get users data api
app.get("/getAllUser", async (req, res) => {
  try {
    const allUser = await User.find({});
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

//delete user
app.post("/deleteUser", async (req, res) => {
  const { userID } = req.body;
  try {
    User.deleteOne({ _id: userID }, function (err, res) {
      // console.log(err);
    });
    res.send({ status: "ok", data: "Deleted User" });
  } catch (error) {
    // console.log(error);
  }
});
