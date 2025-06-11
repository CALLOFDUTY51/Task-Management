const userModel=require("../Model/user")
const taskModel=require("../Model/Task")
const bcrypt=require("bcryptjs")

const createUser= async(req,res)=>{
    try{
    const {username,password}=req.body
    const profileImage = req.file;

    if (!profileImage) {
      return res.status(400).send("No file uploaded");
    }

    const profileImagePath = profileImage.path;

    const existingUsername=await userModel.findOne({username})
    

    if(existingUsername){
        res.status(400).send("username Already exists")
        return;
    }
    const salt=await bcrypt.genSalt()
    const hashedPassword=await bcrypt.hash(password,salt)

    const newUser=new userModel({
        username,
        password:hashedPassword,
        profileImagePath,
        admin:false
    })
   await newUser.save()
   res.status(201).send("User created successfully")
  }
  catch(err){
    res.status(500).send(err)
    console.log(err)
  }

}
const checkLogin=async (req,res)=>{
    try{
        const {username,password}=req.body;

    const user=await userModel.findOne({username})

    console.log(user)

    if(!user){
        return res.status(409).send({message:"user dosen't exists"})
    }
    const isMatch= bcrypt.compare(password,user.password);
    if(!isMatch){
        return res.status(400).send({message:"wrong password"})
    }
    
    delete user.password
    res.status(200).json(user)
    }
    catch(err){
       res.status(500).send({message:"me wrong"})
       console.log("me error")
    }
}

const getAllUsersWithTaskStats = async (req, res) => {
    try {
     
      const user = await userModel.find({ admin: false }).populate("task"); // Fetch all users

      console.log(user);
  
      const ans = [];
  
      for (let i = 0; i < user.length; i++) {
        let comp = 0;
        let unfin = 0;
  
        for (let j = 0; j < user[i].task.length; j++) {
          if (user[i].task[j].completion == "pending") {
            unfin++;
          } else {
            comp++;
          }
        }
        ans.push({
          _id: user[i]._id,
          username: user[i].username,
          
          taskStats: {
            total: comp+unfin,
            completed: comp,
            pending: unfin,
          },
        });
      }
  
      res.status(200).send(ans);
     
     
     
     
     
     
     
  
     
     
      // const users = await userModel.find({admin:false}); // Fetch all users
  
      // const userStats = await Promise.all(
      //   users.map(async (user) => {
      //     const tasks = await taskModel.find({ _id: { $in: user.task } }); // Fetch tasks using IDs in the `task` array
      //     const completedTasks = tasks.filter((task) => task.completion === "completed").length;
      //     const pendingTasks = tasks.filter((task) => task.completion === "pending").length;
  
      //     return {
      //       _id: user._id,
      //       username: user.username,
      //       email: user.email,
      //       taskStats: {
      //         total: tasks.length,
      //         completed: completedTasks,
      //         pending: pendingTasks,
      //       },
      //     };
      //   })
      // );
  
      res.status(200).json(userStats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Failed to fetch user statistics" });
    }
  };

  const getUserTasks=async(req,res)=>{
    try {
        const { username } = req.params;
        const user = await userModel.findOne({ username }).populate("task"); // Populate the tasks array
        console.log(user)
        if (!user) {
          return res.status(404).send("User not found");
        }
        res.json(user.task);  // Return the tasks associated with the user
      } catch (err) {
        res.status(500).send("Error fetching tasks: " + err.message);
      }
  }

  const deleteUser=async(req,res)=>{
    try {
      const { userId } = req.params;
  
      // Delete the user
      await userModel.findByIdAndDelete(userId);
  
      res.status(200).send('User deleted successfully');
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send("Error deleting user");
    }
  }

module.exports={deleteUser, createUser,checkLogin,getAllUsersWithTaskStats,getUserTasks}