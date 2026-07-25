import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createTweet , getTweet , getusertweet , updatetweet , deletetweet} from "../controllers/tweet.js";

const router = Router()

router.route("/createTweet").post(verifyjwt, createTweet)

router.route("/getTweet").get(getTweet)

router.route("/getusertweet/:userId").get(getusertweet)

router.route("/updatetweet/:tweetId").patch(verifyjwt,updatetweet)

router.route("/deletetweet/:tweetId").delete(verifyjwt,deletetweet)

export default router