import mongoose, { isValidObjectId } from "mongoose";
import { asynchandler } from "../utils/asynchandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { Subscription } from "../models/subscription.model.js";

const toggleSubscription = asynchandler(async (req, res) => {
    //tame kok ne subscribe karo tena mate
    const { channelId } = req.params;

    // Check whether channelId is provided
    if (!channelId) {
        throw new ApiError(400, "Channel ID is required");
    }

    // Current logged-in user
    const subscriberId = req.user._id;

    // Check whether current user already subscribed to this channel
    const existingSubscription = await Subscription.findOne({
        subscriber: subscriberId,
        channel: channelId
    });

    // If subscription already exists -> unsubscribe
    if (existingSubscription) {
        await Subscription.findByIdAndDelete(existingSubscription._id);

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    { subscribed: false },
                    "Channel unsubscribed successfully"
                )
            );
    }

    // If subscription does not exist -> subscribe
    await Subscription.create({
        subscriber: subscriberId,
        channel: channelId
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { subscribed: true },
                "Channel subscribed successfully"
            )
        );
});


const getUserChannelSubscribers = asynchandler(async (req, res) => {
    // mtlab ke aa chanal ne subscribe kar va vala kon chhe
    //Ek channel ko kaun-kaun subscribe karta hai

    const { subscriberId } = req.params;

    // Check channelId
    if (!subscriberId?.trim()) {
        throw new ApiError(400, "Channel ID is required");
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(subscriberId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriberDetails"
            }
        },

        {
            $unwind: "$subscriberDetails"
        },

        {
            $project: {
                _id: 0,
                subscriber: {
                    _id: "$subscriberDetails._id",
                    fullName: "$subscriberDetails.fullName",
                    username: "$subscriberDetails.username",
                    avatar: "$subscriberDetails.avatar"
                },
                subscribedAt: "$createdAt"
            }
        },

        {
            $sort: {
                subscribedAt: -1
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Channel subscribers fetched successfully"
            )
        );
});


const getSubscribedChannels = asynchandler(async (req, res) => {
    //Ek user ne kaun-kaun se channels subscribe kiye hain
    const { channelId  } = req.params;

    // Check channelId 
    if (!channelId ?.trim()) {
        throw new ApiError(400, "Subscriber ID is required");
    }

    const subscribedChannels = await Subscription.aggregate([
        {
            // Find all subscriptions made by this user
            $match: {
                subscriber: new mongoose.Types.ObjectId(channelId)
            }
        },

        {
            // Get channel/user details
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channelDetails"
            }
        },

        {
            // Convert array into object
            $unwind: "$channelDetails"
        },

        {
            // Select only required channel information
            $project: {
                _id: 0,

                channel: {
                    _id: "$channelDetails._id",
                    fullName: "$channelDetails.fullName",
                    username: "$channelDetails.username",
                    avatar: "$channelDetails.avatar",
                    coverimage: "$channelDetails.coverimage"
                },

                subscribedAt: "$createdAt"
            }
        },

        {
            // Latest subscribed channel first
            $sort: {
                subscribedAt: -1
            }
        }
    ]);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribedChannels,
                "Subscribed channels fetched successfully"
            )
        );
});



export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}