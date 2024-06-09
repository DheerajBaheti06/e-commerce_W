import { Router } from "express";
import {
  adminRequest,
  createProduct,
  getAllAdminProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
} from "./../controllers/admin.controllers.js";
import { authorizeRoles, verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

//  first visit app.js > routes declaration

// get all admin products
router.route("/").get(verifyJWT, authorizeRoles(), getAllAdminProducts);

// request to become admin
router.route("/request").post(adminRequest); // no need of verifyJWT, so that admin can login directly through admin panel also

// create a new product
router
  .route("/create-product")
  .post(verifyJWT, authorizeRoles(), createProduct);

// get detail, delete and update any product through single route by just providing an product id after url via "/"
router
  .route("/product-detail/:_id")
  .get(getProductDetails)
  .delete(verifyJWT, authorizeRoles(), deleteProduct)
  .put(verifyJWT, authorizeRoles(), updateProduct);

export default router;
