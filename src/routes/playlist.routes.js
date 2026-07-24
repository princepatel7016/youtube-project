import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createPlaylist ,  getUserPlaylist ,getPlaylistById , addVideotoPlaylist , removevideofromplaylist , updatePlaylist } from "../controllers/playlist.js";

const router  = Router()


router.route("/createPlaylist").post(verifyjwt,createPlaylist)

router.route("/getUserPlaylist/:userId").get(verifyjwt, getUserPlaylist)

router.route("/getPlaylistById/:playlistId").get(verifyjwt, getPlaylistById)

router.route("/addPlaylist/:videoId/:playlistId").patch(verifyjwt, addVideotoPlaylist)

router.route("/removePlaylist/:videoId/:playlistId").patch(verifyjwt, removevideofromplaylist)

router.route("/updatePlaylist/:playlistId").patch(verifyjwt, updatePlaylist )

export default router