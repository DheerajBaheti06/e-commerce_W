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
router.route("/home").get((req, res) => {
  res.send("welcome to user page");
});

// route to register
router.route("/register").patch(upload.single("avatar"), registerUser);

// route to user login
router.route("/login").post(loginUser);

// route to user logout
router.route("/logout").get(verifyJWT, logoutUser);

// not completed
router.route("/password/forgot").get(forgotPassword);

export default router;
