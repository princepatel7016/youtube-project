import mongoose, { isValidObjectId } from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Like } from "../models/like.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";



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

const togglecommentlike = asynchandler(async(req,res)=>{
    const {commentId} = req.params

     // Check valid ObjectId
    if (!commentId) {
        throw new ApiError(400, "Invalid Comment Id");
    }

    // Check if already liked
    const alreadyLiked = await Like.findOne({
        comment: commentId,
        likedby: req.user._id
    });

    // Unlike
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res.status(200).json(
            new ApiResponse(200,{},"Comment unliked successfully"
            )
        );
    }

    // Like
    await Like.create({
        comment: commentId,
        likedby: req.user._id
    });

    return res.status(200).json(
        new ApiResponse(200,{},"Comment liked successfully"
        )
    );
});

const toggletweetlike = asynchandler(async(req,res)=>{
    const { tweetId } = req.params;

    // 1. Check valid ObjectId
    if (!tweetId) {
        throw new ApiError(400, "Invalid Tweet Id");
    }

    // 2. Check tweet exists
    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // 3. Check if already liked
    const alreadyLiked = await Like.findOne({
        tweet: tweetId,
        likedby: req.user._id,
    });

    // 4. If liked then remove like
    if (alreadyLiked) {
        await Like.findByIdAndDelete(alreadyLiked._id);

        return res.status(200).json(
            new ApiResponse(200, {}, "Tweet unliked successfully")
        );
    }

    // 5. Otherwise create like
    await Like.create({
        tweet: tweetId,
        likedby: req.user._id,
    });

    return res.status(200).json(
        new ApiResponse(200, {}, "Tweet liked successfully")
    );

})

const getlikevideos = asynchandler(async(req,res)=>{

    const likedVideos = await Like.aggregate([
        {
            $match:{
                likedby: new mongoose.Types.ObjectId(req.user._id),
                video: { $exists: true }
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video"
            }
        },
        {
            $unwind:"$video"
        },
        {
            $lookup:{
                from:"users",
                localField:"video.owner",
                foreignField:"_id",
                as:"owner"
            }
        },
        {
            $unwind:"$owner"
        },
        {
            $project:{
                _id: 0,
                "video._id": 1,
                "video.title": 1,
                "video.thumbnail": 1,
                "video.views": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200,likedVideos,"Liked videos fetched successfully")
    );
})

export {
    togglevideolike,
    togglecommentlike,
    toggletweetlike,
    getlikevideos
}