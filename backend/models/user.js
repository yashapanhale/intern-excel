//Scheme to upload data in the MongoDB collection 'Users_Data':
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

    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},
{
    timestamps: true
});
// Create a model for the user schema
const User = mongoose.model('User',userSchema, 'User_Data');
export default User;
