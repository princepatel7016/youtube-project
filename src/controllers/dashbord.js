import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {

    const userId = req.user._id;

    // Get all videos of current user
    const videos = await Video.find({
        owner: userId
    });

    // Total Videos
    const totalVideos = videos.length;

    // Total Views
    const totalViews = videos.reduce((acc, video) => {
        return acc + video.views;
    }, 0);

    // Get all video ids
    const videoIds = videos.map(video => video._id);

    // Total Likes
    const totalLikes = await Like.countDocuments({
        video: {
            $in: videoIds
        }
    });

    // Total Subscribers
    // const totalSubscribers = await Subscription.countDocuments({
    //     channel: userId
    // });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
                // totalSubscribers
            },
            "Channel stats fetched successfully"
        )
    );
});


const getChannelVideos = asynchandler(async (req, res) => {

    const userId = req.user._id;

    const videos = await Video.find({
        owner: userId
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            videos,
            "Channel videos fetched successfully"
        )
    )
})

export {
    getChannelStats,
    getChannelVideos
}