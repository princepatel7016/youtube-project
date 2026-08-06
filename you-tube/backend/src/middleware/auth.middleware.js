import { ApiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyjwt = asynchandler(async (req,res,next) => {
try {
    const token = req.cookies?.accesstoken || req.header
    ("Authorization")?.replace("bearer ", "")
    
    if(!token){
        throw new ApiError(401 , "unauthorized request")
    }
    
    const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    //decodedtoken aapn ne id,email,user ni vigat aapshe
    
    const user = await User.findById(decodedtoken?._id).select("-password -refreshToken")
    
    if(!user){
        throw new ApiError(401, "invalid access token")
    }
    
    req.user = user;
    next()
    
} catch (error) {
    throw new ApiError(401, error?.message || "invalid access token")
}
})


// jwt.sign()
// Token banata hai.

// jwt.verify()
// Token check karta hai.

// {    req.user me ye hoga
// _id:"687abc123",

// username:"Prince",

// email:"prince@gmail.com"
// }