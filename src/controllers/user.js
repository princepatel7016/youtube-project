import { asynchandler } from "../utils/asynchandler.js";
import {ApiError}  from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"



const genrateaccessandrefreshtoken = async(userid) => {
    try{
        const user = await User.findById(userid) // Database se pura user object aa gaya.
        const accesstoken = user.genrateAccessToken() //Access Token banana
        const refreshToken = user.genrateRefreshToken()

        
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})  //Refresh Token database me save karna

        return {accesstoken,refreshToken}

    }catch(error){
        throw new ApiError(500, "somthing went wrong while genrating refresh and acess token" )
    }
}



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
// console.log(req.body);
// console.log(req.files);

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
// const coverimagepath = req.files?.coverimage?.[0]?.path;

let coverimagelocalpath;
if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length >0 ){
    coverimagelocalpath= req.files.coverimage[0].path
}


if(!avatarlocalpath){
throw new ApiError(400, "avatar file is required")
}



//upload them cloudinary and check avtar
const avatar = await uploadoncloudinary(avatarlocalpath) 
// console.log("Avatar =>", avatar)  
const coverimage = await uploadoncloudinary(coverimagelocalpath)

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
const createduser = await User.findById(user._id).select("-password -refreshToken")

if(!createduser){
    throw new ApiError(500, "something went wrong while registering the user")
}



// return res
return res.status(201).json(
    new ApiResponse(201,createduser,"user registerd sucessfully")
)

})


const loginuser = asynchandler( async (req,res)=>{
//jab user ka account he and vo login karta he
// req body -> data req body ma thi data layava nu
// username or email
// find the user
// password check
// access and refresh token
// send cookie


const {email,password,username} = req.body
console.log(email)

if(!username && !email){
    throw new ApiError(400,"username or password is require")
}


// user.findOne({email})
const user = await User.findOne({    // Database me ek user search karta hai
    $or: [{username},{email}]  //username ka to email find database ma 
})

if(!user){
    throw new ApiError(404, "user dose not exist")
}


const ispasswordvalid = await user.isPasswordCorrect(password)

if(!ispasswordvalid){
    throw new ApiError(401, "inavaid password")
}

const {accesstoken , refreshToken} = await genrateaccessandrefreshtoken(user._id)

const loggedinuser = await User.findById(user._id).select("-password -refreshToken")

const options = {
    //cokkie modified only server not fronted
    httpOnly: true,   
    secure: false,
    
}

return res
.status(200)
.cookie("accesstoken", accesstoken, options)  // "key" , value
.cookie("refreshToken", refreshToken, options)
.json(
    new ApiResponse(200, {
        user:loggedinuser,accesstoken , refreshToken
    },"user logged in sucessfully"
)
)


})


const logoutuser = asynchandler(async (req,res)=>{
    await User.findByIdAndUpdate(  
        //ID se user ko dhoondo aur uski information update karo. <- findbyupadtid
        req.user._id,
        {
            $set:{
                //Kisi field ki value update (change) karna ye $set ka kam he
                refreshToken: undefined
            }
        },  
        {
            new: true  //Update hone ke baad wala document return karo.
        }
    )
    const options = {
    httpOnly: true,    //Browser ka JavaScript cookie ko access nahi kar sakta.
    secure: false
}

return res.status(200).clearCookie("accesstoken", options)  
.clearCookie("refreshToken", options) // browser se refrenshtoken delete
.json(new ApiResponse(200,{},"user logged out"))

})


//Access Token expire ho gaya. tab ye api call hota he refreshaccesstoken
//Frontend automatically ye API call karega.
const refreshaccesstoken = asynchandler( async (req,res) => {
const incommingrefreshtoken = req.cookies.refreshToken || req.body.refreshToken

if(!incommingrefreshtoken){
    throw new ApiError(401,"unothorized request")
}
// aa refreshtoken user pase chhe te mokle chhe

try {
    const decodedToken = jwt.verify(incommingrefreshtoken,process.env.REFRESH_TOKEN_SECRET)
    // verify mate aek token and secret information devi pade
    //decodedtoken ni andar aapne ne _id malse
    
    const user = await User.findById(decodedToken?._id)   // user aavi gayo
    
    if(!user){
        throw new ApiError(401,"invalid refresh token")
    }
    // aa refreshtoken databse me save chhe te chhe
    
    
    if(incommingrefreshtoken !== user?.refreshToken){
        throw new ApiError(401,"refreshtoken expire or used")
    }
    
    const options = {
        httpOnly:true,
        //secure:true    //Cookie sirf HTTPS connection par hi browser bhejega.
        secure: false
    }
    
    const {accesstoken, newrefreshToken} = await genrateaccessandrefreshtoken(user._id)
    
    return res.status(200)
    .cookie("accesstoken",accesstoken,options)
    .cookie("refreshToken",newrefreshToken,options)
    .json(
        new ApiResponse(
            200,
            {accesstoken , refreshToken:newrefreshToken},
            "access token refreshed"
        )
    )
    
}catch (error) {
    throw new ApiError(401,error?.message || "invalid refresh token")
}

})

export {registeruser , loginuser ,logoutuser , refreshaccesstoken}
