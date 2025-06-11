const TaskSchema=require("../Model/Task")
const UserSchema=require("../Model/user")

const createTask=async (req, res) => {
    try {
        const {username,title,description,priority,dueDate,assignedDate}=req.body
      const user =await UserSchema.findOne({username})
      if(!user ){
        return res.status(404).send("invalid username")
      }
      const task = await TaskSchema.create({
        title,description,dueDate,priority,assignedDate,assignedTo:user._id,completion:"pending"
      });
      
      console.log(task)
      user.task.push(task._id)
      await user.save()
      res.status(201).send("Task created successfully");
    } catch (err) {
      res.status(500).send(err);
      console.log(err)
    }
  };


  const getAssignedTasks = async (req, res) => {
    try {
        const { username } = req.params;
       

        const user = await UserSchema.findOne({ username });
        if (!user) {
            return res.status(404).send("User not found");
        }

        const priorityOrder = {
            High: 1,
            Medium: 2,
            Low: 3,
          };
        

        
const tasks = await TaskSchema.find({ assignedTo: user._id })
.sort({
  priority: 1,  // Sort by priority field (ascending)
})


// Sort tasks by custom order after fetching
tasks.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
      console.log(tasks)
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).send(err);
    }
};

UpdateCompletion=async(req,res)=>{
    const { taskId } = req.params;
    const { completion } = req.body;  // "pending" or "completed"
  
    try {
      const updatedTask = await TaskSchema.findByIdAndUpdate(taskId, { completion }, { new: true });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task completion" });
      console.log(error)
    }
}
getTask=async(req,res)=>{
    const { id } = req.params; // Extract task ID from the request parameters
  try {
    const task = await TaskSchema.findById(id).populate("assignedTo"); // Fetch task from the database using the ID
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task); // Send the task details as a JSON response
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task" });
  }
}

const getAllTasks = async (req, res) => {
    try {
      const tasks = await TaskSchema.find().populate("assignedTo"); // Populate username for assigned user
      res.json(tasks);
    } catch (err) {
      res.status(500).send("Error fetching tasks: " + err.message);
    }
  };
  
  const UpdateTask=async(req,res)=>{
    const { id } = req.params;
  const {assignedTo, title, description, priority, dueDate, assignedDate,completion ,newusername} = req.body;
  
  try {
    
    if(assignedTo){
    const user=await UserSchema.findById(assignedTo._id)
    
        user.task=user.task.filter((key)=>key!=id)

        await user.save()
    }
    

    const newUserName=await UserSchema.findOne({username:newusername})
    if(!newUserName){
      res.status(404).send("no user found")
    }
    console.log(newUserName)
    const assignId=newUserName._id
    // Find the task by ID and update it
    const updatedTask = await TaskSchema.findByIdAndUpdate(
      id,
      {
        assignedTo:assignId,
        title,
        description,
        priority,
        dueDate: new Date(dueDate), // Convert to Date object
        assignedDate: new Date(assignedDate), // Convert to Date object
        completion
      },
      { new: true } // Return the updated document
    );
    newUserName.task.push(updatedTask._id)
    await newUserName.save()

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
  }

  const UpdatePriority=async(req,res)=>{
    const {id}= req.params;
    const {priority}=req.body
   
    const updatedTask = await TaskSchema.findByIdAndUpdate(id,{
      priority
    }
    )
  }

  
 const updateTasksAssignedToUser=async(req,res)=>{
  try {
    const { userId } = req.params;
    const { assignedTo } = req.body;

    // Update all tasks assigned to this user
    await TaskSchema.updateMany({ assignedTo: userId }, { $set: { assignedTo } });

    res.status(200).send('Tasks updated successfully');
  } catch (error) {
    console.error("Error updating tasks:", error);
    res.status(500).send("Error updating tasks");
  }
 }

 const deleteTask=async(req,res)=>{
  try{
    const {taskId}=req.params;
    const task=await TaskSchema.findById(taskId)
    console.log(task)
    const user=await UserSchema.findById(task.assignedTo?._id)
    if(user){

    user.task=user.task.filter((key)=>key!=taskId)
    await user.save()
    
    }
    await TaskSchema.findByIdAndDelete(taskId)
    res.status(200).send({user,task})
  }
  catch(err){
       console.log(err);
       res.status(400).send(err)
  }

 }

module.exports = {deleteTask,updateTasksAssignedToUser, UpdatePriority, UpdateTask, createTask, getAssignedTasks,UpdateCompletion,getTask ,getAllTasks};




