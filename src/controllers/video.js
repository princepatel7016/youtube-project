import { asynchandler } from "../utils/asynchandler.js";
import {ApiError}  from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose , {isValidObjectId} from "mongoose";

const videofileadd = asynchandler(async (req,res) => {
    const videolocalpath = req.file?.path

    if(!videolocalpath){
        throw new ApiError(400, "video file is missing")
    }

    const video = await uploadoncloudinary(videolocalpath)

    if(!video){
        throw new ApiError(400, "error uploading not cloudinary")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                videofile: video.url
            }
        }
    )
})