import  Mongoose ,  {isValidObjectId} from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";


const togglevideolike = asynchandler(async (req,res)=>{
    const {videoId} = req.params

    if(!videoId){
        throw new ApiError(400,"invalid video id")
    }

     // Check if user has already liked the video
    const existinglike = await Like.findOne({
        video: videoId,
        likedby: req.user._id
    })

     // If already liked, remove the like
    if(existinglike){
        await Like.findByIdAndDelete(existinglike._id)

        return res.status(200).json(
            new ApiResponse(200,{},"video unliked susdfulluy")
        )
    }

      // If not liked, create a new like
        const like = await Like.create({
            video: videoId,
            likedby: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(200,like,"video liked sussfully")
        )
})

export {
    togglevideolike
}