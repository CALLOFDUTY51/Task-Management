const mongoose=require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true
    },
    password: {
        type: String,
        required: true,
      },
    profileImagePath: {
        type: String,
        default: "",
      },
      task:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      }],
      admin:{
        type:Boolean,
        default:false
      }
});

const User=mongoose.model("User",UserSchema)

module.exports=User
