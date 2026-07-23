import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createPlaylist } from "../controllers/playlist.js";

const router  = Router()


router.route("/createPlaylist").post(verifyjwt,createPlaylist)

export default router