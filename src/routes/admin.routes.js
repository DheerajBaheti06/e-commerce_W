import { Router } from "express";
import {
  adminRequest,
  createProduct,
  getAllAdminProducts,
  getProductDetails, 
  deleteProduct,
  updateProduct
} from "./../controllers/admin.controllers.js";
import { authorizeRoles, verifyJWT } from "./../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, authorizeRoles(), getAllAdminProducts);
router.route("/request").post(adminRequest); // no need of verifyJWT, so that admin can login directly through admin panel also
router.route("/create-product").post(verifyJWT, authorizeRoles(), createProduct);
router
  .route("/product-detail/:_id")
    .get(getProductDetails)
    .delete(verifyJWT, authorizeRoles(), deleteProduct)
    .put(verifyJWT, authorizeRoles(), updateProduct);


export default router;
