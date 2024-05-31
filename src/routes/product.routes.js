import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductDetails,
} from "../controllers/product.controllers.js";
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/").get(verifyJWT, authorizeRoles("admin"), getAllProducts);
router.route("/create").post(verifyJWT, createProduct);
router
  .route("/product-detail/:_id")
  .get(getProductDetails)
  .delete(verifyJWT, deleteProduct)
  .put(verifyJWT, updateProduct);
// router.route("/delete/:_id").delete(deleteProduct);
// router.route("/update/:_id").put(updateProduct);

export default router;
