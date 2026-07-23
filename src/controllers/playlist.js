import  Mongoose ,  {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Playlist } from "../models/playlist.model.js";
import { verifyjwt } from "../middleware/auth.middleware.js";

const createPlaylist = asynchandler(async(req,res)=>{
    const {name , description} = req.body

    if(!name?.trim()){
        throw new ApiError(400,"name is required")
    }

    if(!description){
        throw new ApiError(400,"description is required")
    }

    const playlist = await Playlist.create(
    {
        name:name,
        description:description,
        owner:req.user._id   
    }
    )

    return res.status(201).json(
        new ApiResponse(201,playlist,"playlist created sussfully")
    )
})


export {
    createPlaylist
}