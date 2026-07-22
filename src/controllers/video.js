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

const getAllvideo = asynchandler(async (req,res) =>{
    const {page=1 , limit=10 , query, sortBy, sortType, userId} = req.query
    //req.query URL ke end me jo data aata hai, usko receive karta hai. sab value string hoti he
    //ye string value data base me save he

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    if(pageNumber<1 || limitNumber<10){
        new ApiError(400,"inavalid page and")
    }

    const skip =(pageNumber-1) * limitNumber;

    const videos = await  Video.find({ ispublished: true})
        .skip(skip)
        .limit(limitNumber);

    return res.status(200).json(
        new ApiResponse(200, videos , "video fetched succfully")
    )
    

})


export {
    videoupload,
    getAllvideo
}