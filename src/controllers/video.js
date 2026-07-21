import { asynchandler } from "../utils/asynchandler.js";
import {ApiError}  from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import {uploadoncloudinary} from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken"
import mongoose , {isValidObjectId} from "mongoose";

const videoupload = asynchandler(async (req,res) => {
    const { title ,description  } = req.body
    console.log("title :" , title)

    if(title === ""){
        throw new ApiError(400, "title is requrid")
    }
    if(description === ""){
        throw new ApiError(400, "description is requrid")
    }

    const videolocalpath = req.files?.videofile?.[0]?.path;

    if(!videolocalpath){
        throw new ApiError(400, "video file is required")
    }

    const thumbnaillocalpath = req.files?.thumbnail?.[0]?.path;

    if(!thumbnaillocalpath){
        throw new ApiError(400, "thumbnail is requride")
    }

    const video = await uploadoncloudinary(videolocalpath);

    if(!video){
        throw new ApiError(400, "video file id requird")
    }

    const thumbnail = await uploadoncloudinary(thumbnaillocalpath);

    if(!thumbnail){
        throw new ApiError(400, "thumnail file id requird")
    }

    const user = await Video.create({
        title,
        description,
        videofile: video.url,
        thumbnail: thumbnail.url,
        duration: video.duration, 
        owner: req.user._id                    //Login user ka _id
    })

    return res.status(201).json(
        new ApiResponse(201, user, "user video upload successfully")
    )
})


export {
    videoupload
}