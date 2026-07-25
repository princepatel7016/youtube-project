import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createTweet , getTweet , getusertweet} from "../controllers/tweet.js";

const router = Router()

router.route("/createTweet").post(verifyjwt, createTweet)

router.route("/getTweet").get(getTweet)

router.route("/getusertweet/:userId").get(getusertweet)

export default router