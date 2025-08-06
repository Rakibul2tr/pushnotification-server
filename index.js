
const express = require("express");
const { google } = require("googleapis");
const axios = require("axios");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT || 4000;
const cors = require("cors");
require("dotenv").config();
app.use(cors());
app.use(bodyParser.json());
const userRoute =require('./routes/userRoutes')

mongoose
  .connect(
    "mongodb+srv://rakibul2tr:WeXVJHyi2vpDDr6y@cluster0.wp9dz8x.mongodb.net/pushnotification?retryWrites=true&w=majority&appName=Cluster0"
  ) // Change as needed
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));


app.use("/api/users", userRoute);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
