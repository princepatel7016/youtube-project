import  Mongoose ,  {isValidObjectId} from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";

const createTweet = asynchandler(async(req,res)=>{
    const { content } = req.body

    if(!content?.trim()){
        throw new ApiError(400,"content is required")
    }

    if(content.length > 200){
        throw new ApiError(400,"content must be less than 200 characters")
    }

    const tweet = await Tweet.create(
        {
            content:content,
            owner:req.user._id
        }
    )

    if(!tweet){
        throw new ApiError(500,"tweet not create ")
    }

    return res.status(201).json(
        new ApiResponse(201,tweet, "tweet created successfully")
    )
})

export {
    createTweet
}
