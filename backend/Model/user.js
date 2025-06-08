import mongoose from "mongoose";
const Userschema=mongoose.Schema({
    name:{
        type:String,
        requried:true
    },
    email:{
        type:String,
        requried:true,
        unique:true
    },
    password:{
        type:String,
        requried:true

    }
})
// Create a model for the user schema
const User=mongoose.model("User",Userschema);
export default User;