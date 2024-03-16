import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError as apiError} from '../utils/ApiError.js'
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"

 const registerUser = asyncHandler(async (req,res) =>{
    // get user detailed from forntend
    // validation - not empty
    // check if user already exist: username,email
    // check for images,check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and referesh token field from reponse
    // check for user creation
    // retunr response

    const {fullName, email,username,password} = req.body
    

    if( [fullName,email,username,password].some((field)=>{
         field?.trim() === "" 
      })){
         throw new apiError(404,"you need to fill all record")
      }
    
      const userExist = await User.findOne({
         $or: [{username}, {email}]
      })

      if(userExist){
         throw new apiError(409,'user already exist')
      }

  
      const avatarLocalPath = req.files?.avatar[0]?.path;
      // const coverImageLocalPath = req.files?.coverImage[0]?.path;

      
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

      if(!avatarLocalPath){
         throw new apiError(409,"no avatar image is found!")
      }

      console.log(req.files)
       const avatar =await uploadOnCloudinary(avatarLocalPath)
       const coverImage = await uploadOnCloudinary(coverImageLocalPath)
      //  console.log("it is first|\n")
       if (!avatar) {
        
        throw new apiError(400, "Avatar file is required")
    }
   
    // console.log(avatar , "it is second|\n")

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email, 
        password,
        username: username.toLowerCase()
    })
    // console.log("it is third|\n")
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // console.log("it is fourth|\n")
    if (!createdUser) {
      console.log("it is seocnd means usercreated")
        throw new apiError(500, "Something went wrong while registering the user")
    }
    // console.log("it is sexth|\n")
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
 })


export {registerUser}

