import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: './env'
})
connectDB();



// import mongoose from "mongoose";
// import {DB_NAME} from './constant.js'

// import express from 'express'

// const app = express();

// (async()=>{
//     try{
//         mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)

//         app.on("error",(error)=>{
//             console.log("error",error)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`app is running on port no ${process.env.PORT}`)
//         })
//     }
//     catch(error){
//         console.error("error while connected to mongooses",error);
//     }
// })()