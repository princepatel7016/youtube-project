import  Mongoose ,  {isValidObjectId} from "mongoose";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asynchandler } from "../utils/asynchandler.js";
import { Playlist } from "../models/playlist.model.js";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { Video } from "../models/video.model.js";

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

const getUserPlaylist = asynchandler(async(req,res)=>{
    const { userId } = req.params

    const playlist = await Playlist.find({
        owner: userId
    })

    if(playlist.length === 0){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist fetched sussfully")
    )
})

const getPlaylistById = asynchandler(async(req,res)=>{
    //2 ,3 playlist me se kis playlist chaiye uske liye
    const {playlistId} = req.params

    const playlist = await Playlist.findById(
        playlistId
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist fetched sussfully")
    )
})

const addVideotoPlaylist = asynchandler(async(req,res)=>{
    const {playlistId , videoId} = req.params

    const video = await Video.findById(
        videoId
    )

    if(!video){
        throw new ApiError(404,"video not found")
    }

    const addplaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push:{
            video:videoId
            }
        },
        {
            new:true
        }
    )

    if(!addplaylist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,addplaylist,"video added to playlist sussfully")
    )
})

const removevideofromplaylist = asynchandler(async(req,res)=>{
    const {playlistId , videoId} = req.params

    const video = await Video.findById(
        videoId
    )

    if(!video){
        throw new ApiError(404,"video not found")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull:{
                video:videoId
            }
        },
        {
            new:true
        }
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,playlist,"video removed from playlist sussfully")
    )
})

const updatePlaylist = asynchandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(400,"playlistId is required")
    }

    const {name, description} = req.body

    if(!name?.trim()){
        throw new ApiError(400,"name is required")
    }

    if(!description){
        throw new ApiError(400,"description is required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set:{
                name:name,
                description:description
            }
        },
        {
            new:true
        }
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist updated sussfully")
    )
})


const deletePlaylist = asynchandler(async(req,res)=>{
    const {playlistId} = req.params

    const playlist = await Playlist.findByIdAndDelete(
        playlistId,
    )

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200,playlist,"playlist deleted sussfully")
    )
})

export {
    createPlaylist,
    getUserPlaylist,
    getPlaylistById,
    addVideotoPlaylist,
    removevideofromplaylist,
    updatePlaylist,
    deletePlaylist
}