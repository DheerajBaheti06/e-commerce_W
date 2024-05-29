import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js"
import { registerUser } from "./../controllers/user.controllers.js"

const router = Router();

router.route("/register").patch(upload.single("avatar"), registerUser)

export default router;