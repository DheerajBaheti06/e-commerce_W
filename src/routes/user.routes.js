import { Router } from "express";
import { upload } from "./../middlewares/multer.middleware.js";
import {
  forgotPassword,
  loginUser,
  logoutUser,
  registerUser,
} from "./../controllers/user.controllers.js";
import { verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

//  first visit app.js > routes declaration


// user page
router.route("/").get((req, res) => {
  res.send("welcome to user page");
});

// route to register
router.route("/register").patch(upload.single("avatar"), registerUser); // don't upload file, file uploading not working rest is okk, avatar field ko required field mat rakhna...

// route to user login
router.route("/login").post(loginUser);

// route to user logout
router.route("/logout").get(verifyJWT, logoutUser);

// not completed
router.route("/password/forgot").get(forgotPassword);

export default router;
