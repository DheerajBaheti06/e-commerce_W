import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js"
import { loginUser, logoutUser, registerUser } from "./../controllers/user.controllers.js"
import { verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").patch(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJWT, logoutUser)

export default router;