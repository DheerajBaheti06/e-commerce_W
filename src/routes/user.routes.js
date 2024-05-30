import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js"
import { loginUser, registerUser } from "./../controllers/user.controllers.js"

const router = Router();

router.route("/register").patch(upload.single("avatar"), registerUser)
router.route("/login").post(loginUser)

export default router;