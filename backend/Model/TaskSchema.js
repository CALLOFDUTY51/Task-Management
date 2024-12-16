const mongoose=require("mongoose")


const TaskSchema=new mongoose.Schema({
    assignedTo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },priority:{
        type:String,
        required:true
    },
    assignedDate:{
        type:Date,
        required:true
    },
    completion:{
        type:String,
        required:true
    }
});

const Task=mongoose.model("Task",TaskSchema)

module.exports=Task