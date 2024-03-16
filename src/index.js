import { app } from "./app.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv"

dotenv.config({
    path: './.env'
})






connectDB()
.then(()=>{
    app.on("error",()=>{                              
        console.log("error in app ",error)
        throw error
    })

    app.listen(process.env.PORT || 8080,()=>{
        console.log(`server is running on port ${process.env.PORT}`)
    })
})
.catch(()=>{
    console.log("this is error is a mongodb connection")
})



