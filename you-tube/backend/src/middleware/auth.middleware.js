import { ApiError } from "../utils/apiError.js";
import { asynchandler } from "../utils/asynchandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyjwt = asynchandler(async (req,res,next) => {
try {
        // read token from cookie first, then Authorization header (supports "Bearer" case-insensitively)
        const headerAuth = req.get?.("Authorization") || req.headers?.authorization;
        const tokenFromHeader = headerAuth?.replace(/^Bearer\s+/i, "");
        const token = req.cookies?.accesstoken || tokenFromHeader;

        // Debugging info in development to inspect incoming auth
        if (process.env.NODE_ENV === 'development') {
            console.log('[verifyjwt] headerAuth:', headerAuth);
            console.log('[verifyjwt] tokenFromHeader:', tokenFromHeader);
            console.log('[verifyjwt] cookie accesstoken present:', !!req.cookies?.accesstoken);
        }
    
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