import { Router } from "express";
import { registeruser, loginuser, logoutuser, refreshaccesstoken } from "../controllers/user.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyjwt } from "../middleware/auth.middleware.js";


const router = Router() 

router.route("/register").post(
    upload.fields([                    // middleware 
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]),
    registeruser)

router.route("/login").post(loginuser)

router.route("/logout").post(verifyjwt, logoutuser)

router.route("/refresh-token").post(refreshaccesstoken)

export default router