import { Router } from "express";
import {
  adminRequest,
  createProduct
} from "./../controllers/admin.controllers.js";
import { authorizeRoles, verifyJWT } from "./../middlewares/auth.middleware.js";
// import { createProduct } from "../controllers/product.controllers.js";
const router = Router();

router.route("/").get(verifyJWT, (req, res)=>{
  res.send("welcome to admin page")
});

router.route("/request").post(adminRequest); // no need of verifyJWT, so that admin can login directly through admin panel also
router.route("/create-product").post(verifyJWT, authorizeRoles(), createProduct);



export default router;
