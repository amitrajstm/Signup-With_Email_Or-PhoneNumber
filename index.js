const express = require("express");
const cookieParser = require("cookie-parser");
const MongoDB  = require("./config/mongoDB.js");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const authRoute = require("./routers/authRoute.js");

const app = express();
dotenv.config();
const PORT = process.env.PORT;

// Middleware
app.use(express.json())//parse body Data
app.use(cookieParser());// parse token on every request
app.use(bodyParser.urlencoded({extended:true}));

// connections With Database
MongoDB();


// Routers
app.use("/api/auth",authRoute)

app.listen(PORT,()=>{
    console.log(`Sever is running on port :${PORT}`);
    
})