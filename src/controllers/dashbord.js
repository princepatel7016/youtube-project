import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/apiError.js"
import { ApiResponse } from "../utils/apiResponse.js"
import { asynchandler } from "../utils/asynchandler.js"

const getChannelStats = asynchandler(async (req, res) => {
    const userId = new mongoose.Types.ObjectId(req.user._id);

    // Total Videos + Total Views
    const videoStats = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: "$views" },
                videoIds: { $push: "$_id" }
            }
        }
    ]);

    let totalVideos = 0;
    let totalViews = 0;
    let totalLikes = 0;

    if (videoStats.length > 0) {
        totalVideos = videoStats[0].totalVideos;
        totalViews = videoStats[0].totalViews;

        const likeStats = await Like.aggregate([
            {
                $match: {
                    video: {
                        $in: videoStats[0].videoIds
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    totalLikes: { $sum: 1 }
                }
            }
        ]);

        totalLikes = likeStats.length > 0 ? likeStats[0].totalLikes : 0;
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalVideos,
                totalViews,
                totalLikes,
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