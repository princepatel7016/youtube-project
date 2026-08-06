import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { createPlaylist ,  getUserPlaylist ,getPlaylistById , addVideotoPlaylist , removevideofromplaylist , updatePlaylist, deletePlaylist } from "../controllers/playlist.js";

const router  = Router()


router.route("/createPlaylist").post(verifyjwt,createPlaylist)

router.route("/getUserPlaylist/:userId").get(verifyjwt, getUserPlaylist)

router.route("/getPlaylistById/:playlistId").get(verifyjwt, getPlaylistById)

router.route("/addPlaylist/:videoId/:playlistId").patch(verifyjwt, addVideotoPlaylist)

router.route("/removePlaylist/:videoId/:playlistId").patch(verifyjwt, removevideofromplaylist)

router.route("/updatePlaylist/:playlistId").patch(verifyjwt, updatePlaylist )

router.route("/deletePlaylist/:playlistId").delete(verifyjwt,deletePlaylist)

export default router