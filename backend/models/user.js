import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,

    }
},
{
    timestamps: true
});
// Create a model for the user schema
const User = mongoose.model('User',userSchema, 'User_Data');
export default User;
