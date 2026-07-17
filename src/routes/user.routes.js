import { Router } from "express";
import { registeruser, loginuser, logoutuser, refreshaccesstoken, changecoorentpassword, getcurrentuser, updateaccountdetails, updateuseravtar, updateusercoverimage, getuserchhenelprofile, getwatchHistory } from "../controllers/user.js";
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

router.route("/change-password").post(verifyjwt,changecoorentpassword)

router.route("/current-user").get(verifyjwt,getcurrentuser)

router.route("/update-account").patch(verifyjwt,updateaccountdetails)

router.route("/avatar").patch(verifyjwt, upload.single("avatar"), updateuseravtar)

router.route("/cover-image").patch(verifyjwt, upload.single("/coverimage"), updateusercoverimage)

router.route("/c/:username").get(verifyjwt,getuserchhenelprofile)

router.route("/history").get(verifyjwt,getwatchHistory)

export default router