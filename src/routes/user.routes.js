import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
} from "./../controllers/user.controllers.js";
import { verifyJWT } from "./../middlewares/auth.middleware.js";
import sendEmail from "../utils/sendEmail.js";
const router = Router();

router.route("/").get((req, res)=>{
  res.send("welcome to user page")
});
router.route("/register").patch(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/password/forgot").get(forgotPassword);

export default router;
