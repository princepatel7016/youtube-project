import { asynchandler } from "../utils/asynchandler.js";
import {ApiError}  from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";

const registeruser = asynchandler( async (req,res) => {
//get user details from frontend
//validation - not empty
//chek if user already exist  : username,email
//check for image,check for avtar
//upload them cloudinary and check avtar and cloudinar pase thi avtar nu url pan lesu
// creat user object - create entry in db
//remove password and refresh token field from response
//mongodf pase data aave atle te data pachho aape pan te password na aape and refresh token 
//check for user cration 
// return res


const {fullName,email,username,password} = req.body      //get user details from frontend
console.log("email: ", email);


if (fullName === ""){                                     //validation - not empty
    throw new ApiError(400,"full name is required")  
}
if (email === ""){
    throw new ApiError(400,"email is required")  
}
if (username === ""){
    throw new ApiError(400,"username is required")  
}
if (password === ""){
    throw new ApiError(400,"password is required")  
}

// if(
//     [fullname,email,username,password].some( (field) => field?.trim() === "")
// ){
//     throw new ApiError(400,"all field is required")  
// }


//chek if user already exist  : username,email
const existeduser = await User.findOne({                   
    $or: [{ username } , { email }]
})

if(existeduser){
    throw new ApiError(409,"user with email or username")
}


//check for image,check for avtar
const avatarlocalpath = req.files?.avatar?.[0]?.path;       
const coverimagepath = req.files?.coverimage?.[0]?.path;

if(!avatarlocalpath){
    throw new ApiError(400, "avatar file is required")
}



//upload them cloudinary and check avtar
const avatar = await uploadoncloudinary(avatarlocalpath)   
const coverimage = await uploadoncloudinary(coverimagepath)

if(!avatar){
    throw new ApiError(400, "avtar file is reqired")
}


// creat user object - create entry in db
const user = await User.create({                                
    fullName,
    avatar:avatar.url,
    coverimage:coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})


//remove password and refresh token field from response
const createduser = await User.findById(user._id).select(   
    "-password refreshToken"
)

if(!createduser){
    throw new ApiError(500, "something went wrong while registering the user")
}



// return res
return res.status(201).json(
    new ApiResponse(200,createduser,"user registerd sucessfully")
)

})

// jyare url aave tyare aa mothod run thai

export {registeruser}