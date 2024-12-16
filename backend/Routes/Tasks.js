const express=require("express");
const Route=express.Router()

const TaskController=require("../Controller/Tasks")

Route.post("/create",TaskController.createTask)
Route.get("/getTasks/:username", TaskController.getAssignedTasks)
Route.put("/updateCompletion/:taskId",TaskController.UpdateCompletion)
Route.get("/getTask/:id",TaskController.getTask)
Route.get("/getAllTasks",TaskController.getAllTasks)
Route.put("/updateTask/:id",TaskController.UpdateTask)
Route.put("/updatePriority/:id",TaskController.UpdatePriority)
Route.put('/updateTasksAssignedToUser/:userId',TaskController.updateTasksAssignedToUser)
Route.delete("/delete/:taskId",TaskController.deleteTask)
module.exports=Route;