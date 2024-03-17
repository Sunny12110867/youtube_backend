import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError as apiError} from '../utils/ApiError.js'
import { User } from "../models/user.models.js"
import {uploadOnCloudinary} from '../utils/cloudinary.js'
import { ApiResponse } from "../utils/ApiResponse.js"
import  jwt from "jsonwebtoken"

const generateAccessAndRefreshToken = async(userId) =>{
    try{
      const user = await User.findById(userId)
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      user.refreshToken = refreshToken
      await user.save({validateBeforeSave: false})
      console.log("gart done \n")
      return { accessToken, refreshToken }
    

    }catch(error){
      throw new apiError(500,'something went wrong while generating refresh tokens and access tokens')
    }
}

 const registerUser = asyncHandler(async (req,res) =>{
    // get user detailed from forntend
    // validation - not empty
    // check if user already exist: username,email
    // check for images,check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from reponse
    // check for user creation
    // retunr response

    const {fullName, email,username,password} = req.body
    console.log("login start done")

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
      
      console.log('upper')
      // const avatarLocalPath = req.files?.avatar[0]?.path;
      const avatarLocalPath = req.files?.avatar[0]?.path;
      // const coverImageLocalPath = req.files?.coverImage[0]?.path;
      console.log('lowwer')
      
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }
    

      if(!avatarLocalPath){
         throw new apiError(409,"no avatar image is found!")
      }
     
      // console.log(req.files)
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
    // console.log("login end done")

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered Successfully")
    )
 })

const loginUser = asyncHandler( async(req,res)=>{
      // get req body ->data
      // check username or password is there
      // find the user in database
      // password check in data base
      // generate access and refresh token
      // send cookie

      const {email,username,password} = req.body

      // if(!email || !username ){
      //   throw new apiError(400,'userrname or gamil is require')
      // }
      if (!username && !email) {
        throw new apiError(400, "username or email is required")
    }
      const user = await User.findOne({
        $or: [{username},{email}]
      })

      const isPasswordValid =  await user.isPasswordCorrect(password)

      if(!isPasswordValid){
          throw new apiError(401,'password is not matching')
      }

    const {accessToken , refreshToken } = await  generateAccessAndRefreshToken(user._id)
       
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const options = {
      httpOnly: true,
      secure: true
    }
    console.log('login sucessful done bro')
    return res.status(200).cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200, {
          user: loggedInUser,accessToken,refreshToken
        },
        "user logged in sucessfully"
      )
    )
})

const logoutUser = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
      throw new apiError(400, "User information is missing in the request");
  }

  await User.findByIdAndUpdate(
      req.user._id,
      {
          $set: {
              refreshToken: undefined
          }
      },
      {
          new: true
      }
  );

  const options = {
      httpOnly: true,
      secure: true
  };
  console.log("logout done")
  return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async(req,res)=>{
      const incomingRefreshToken = req.cookies.refreshToken 
      || req.body.refreshToken

      if(!incomingRefreshToken){
        throw new apiError(401,'erorr while calling refreshAcessToken')
      }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    )

    const user = await User.findById(decodedToken?._id)

    if(!user){
      throw new apiError(404,'error during finding decodedtoken in database')
    }
    
    if(incomingRefreshToken !== user.refreshToken){
      throw new apiError(404,'access tokens does not match')
    }
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshToken(user?._id)

    const option = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
    .cookie('accessToken',accessToken,option)
    .cookie('refreshToken',newRefreshToken,option)
    .json(
      new ApiResponse(
        200,
        {
          accessToken,
         refreshToken: newRefreshToken,
        message: "access and refresh token"
        }
      )
    )
  } catch (error) {
    throw new apiError(404,'error while refreshAccessToken')
  }
})

const changeCurrentPassword = asyncHandler(async (req,res) =>{

    const {oldPassword,newPassword} = req.body;

    const user = await User.findById(req?._id)

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
      throw new apiError(401,'please enter the correct old password')
    }

    user.password=newPassword
    await user.save({validateBeforeSave: false})

    return res.status(200)
    .json(ApiResponse(200,{},'password change sucessfully'))

})

const getCurrentUser = asyncHandler(async (req,res) =>{

  return res.status(200)
  .json(new ApiResponse(200,req.user,'getting the user succesfully'))
})



export {registerUser , loginUser,logoutUser,refreshAccessToken, getCurrentUser, changeCurrentPassword}

