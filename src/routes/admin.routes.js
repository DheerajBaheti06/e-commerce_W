import { Router } from "express";
import {
  adminRequest
} from "./../controllers/user.controllers.js";
// import { authorizeRoles, verifyJWT } from "./../middlewares/auth.middleware.js";
// import { createProduct } from "../controllers/product.controllers.js";
const router = Router();

router.route("/").get((req, res)=>{
  res.send("welcome to admin page")
});

router.route("/request").put(adminRequest);
// router.route("/create-product").post(verifyJWT, authorizeRoles(), createProduct);



export default router;
