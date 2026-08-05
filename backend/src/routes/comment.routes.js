import { Router } from "express";
import { verifyjwt } from "../middleware/auth.middleware.js";
import { getVideocomment , addComment, updateComment , deleteComment} from "../controllers/comment.js";

const router = Router()

router.route("/getVideocomment/:videoId").get(getVideocomment)

router.route("/comment/:videoId").post(verifyjwt,addComment)

router.route("/updatecomment/:commentId").patch(verifyjwt,updateComment )

router.route("/deleteComment/:commentId").delete(verifyjwt,deleteComment )


export default router