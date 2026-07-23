import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createPlaylist ,  getUserPlaylist} from "../controllers/playlist.js";

const router  = Router()


router.route("/createPlaylist").post(verifyjwt,createPlaylist)

router.route("/getUserPlaylist/:userId").get(verifyjwt, getUserPlaylist)

export default router