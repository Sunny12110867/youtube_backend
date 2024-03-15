import {asyncHandler} from "../utils/asyncHandler.js"
import {apiError} from '../utils/ApiError.js'
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"

 const registerUser = asyncHandler(async (req,res) =>{
    // get user detailed from forntend
    // validation - not empty
    // check if user already exist: username,email
    // check for images,check for avtar
    // upload them to cloudinary, avtar
    // create user object - create entry in db
    // remove password and referesh token field from reponse
    // check for user creation
    // retunr response

    const {fullName, email,username,password} = req.body
    console.log(email)

    if( [fullName,email,username,password].some((field)=>{
         field?.trim() === "" 
      })){
         throw new apiError(404,"you need to fill all record")
      }
    
      const userExist = User.findOne({
         $or: [{username}, {email}]
      })

      if(userExist){
         throw new apiError(409,'user already exist')
      }

      const avtarLocalPath = req.field?.avtar[0]?.path
      const coverImagePath = req.field?.coverImage[0]?.path

      if(!avtarLocalPath){
         throw new apiError(409,"no avtar image is found!")
      }

    
       const avtar =await uploadOnCloudinary(avtarLocalPath)
       const coverImage = await uploadOnCloudinary(coverImagePath)
       
       if(!avtar){
         throw new apiError(400,'error while registerUser')
       }
     
       User.create({
         fullName,
         avtar: avtar?.url,
         coverImage: coverImage?.url || "",
         email,
         password,
         username: username.ToLowerCase()
       })

       const createdUser = await User.findById(User._id).select(
         "-password -refreshToken"
       )

       if(!createdUser){
         throw new apiError(404,'error while calling registerUser')
       }

       return res.status(200).json(
         new ApiResponse(200,createdUser,"user register sucessufuly")
       )
 })


export {registerUser}

