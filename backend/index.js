import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const app= express();
const port = process.env.PORT || 3000;
const MONGO_URI= process.env.MONGO_URI ;
 // connect to mongodb

  try {
    mongoose.connect(MONGO_URI,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
    console.log("conneted to the databases")
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
app.listen(port,()=>
{
    console.log("example of the listening  express "+port);
}
)
