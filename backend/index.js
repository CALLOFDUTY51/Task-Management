const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser');

const userRoute=require("./Routes/User")
const tasksRoute=require("./Routes/Tasks")

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/user",userRoute)
app.use("/tasks",tasksRoute)

mongoose.connect("mongodb://127.0.0.1:27017/third_database").then(()=>{
    app.listen(9000,()=>{
        console.log("server running")
    })
}
).catch((err)=>{
   console.log(err)
})


