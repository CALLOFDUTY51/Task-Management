const express=require("express");
const Route=express.Router()
const UserController=require("../Controller/User")
const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname); // Use the original file name
    },
  });
  
  const upload = multer({ storage });
Route.post("/Create", upload.single("profileImage"),UserController.createUser)
Route.post("/LogIn",UserController.checkLogin)
Route.get("/getAllUser",UserController.getAllUsersWithTaskStats)
Route.get("/:username/tasks",UserController.getUserTasks)
Route.delete("/deleteUser/:userId",UserController.deleteUser)


module.exports=Route;