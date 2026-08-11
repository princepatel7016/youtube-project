import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const getVideocomment = asynchandler( async (req,res)=>{
    const videoId = req.params.videoId || req.params.videoid

    const {page=1 , limit=10 } = req.query

    if (!videoId) {
    throw new ApiError(400, "Invalid video id");
}

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if(pageNumber<1 || limitNumber<1){
        throw new ApiError(400,"invalid number page and limit")
    }

    const skip = (pageNumber - 1) * limitNumber;

    const comment = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $unwind: "$owner"
        },
        {
            $sort:{
                createdAt:-1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: limitNumber
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                "owner._id": 1,
                "owner.username": 1,
                "owner.avatar": 1
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200, comment, "comment fetched sussfully")
    )

})


const addComment = asynchandler(async (req,res)=>{
    const {videoId} = req.params

    const { content } = req.body 
    console.log("content: ", content)

    if(!content?.trim()){
        throw new ApiError(400,"add content please")
    }

    const comment = await Comment.create({
        content:content,
        video:videoId,
        owner:req.user._id
    }
    )

    return res.status(200).json(
        new ApiResponse(200,comment,"comment is sussfully")
    )
})


const updateComment = asynchandler(async (req,res)=>{

    const {commentId} = req.params

    const {content} = req.body

    if(!content){
        throw new ApiError(400,"not available content")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set:{
                content:content
            }
        },
        {
            new:true
        }
    )

    return res.status(200).json(
        new ApiResponse(200,comment,"update comment succfully")
    )
})


const deleteComment = asynchandler(async (req,res)=>{
    const {commentId} = req.params

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "comment not found");
    }

    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own comment");
    }

    const deleteCommentDoc = await Comment.findByIdAndDelete(
        commentId
    )

    return res.status(200).json(
        new ApiResponse(200,deleteCommentDoc,"delete comment succfully")
    )

})


export {
    getVideocomment,
    addComment,
    updateComment,
    deleteComment
}