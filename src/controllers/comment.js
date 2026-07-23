import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Mongoose } from "mongoose";

const getVideocomment = asynchandler( async (req,res)=>{
    const { videoId } = req.params

    const {page=1 , limit=10 } = req.query

    const pageNumber = Number(page)
    const limitNumber = Number(limit)

    if(pageNumber<1 || limitNumber<10){
        throw new ApiError(400,"invalid number page and limit")
    }

    const skip = (pageNumber - 1) * limitNumber;

    const comment = await Comment.find({video: videoId})
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitNumber)

    return res.status(200).json(
        new ApiResponse(200, comment, "comment fetched sussfully")
    )

})




export {
    getVideocomment,
}