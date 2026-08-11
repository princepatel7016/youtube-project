import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import {  toggleSubscription , getUserChannelSubscribers , getSubscribedChannels } from "../controllers/subscription.js"

const router  = Router()

router.route("/c/:channelId").post(verifyjwt, toggleSubscription)

router.route("/u/:subscriberId").get(verifyjwt, getUserChannelSubscribers)

router.route("/c/:channelId").get(verifyjwt,  getSubscribedChannels)


export default router