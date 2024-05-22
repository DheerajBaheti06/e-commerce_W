import { Router } from "express";

import {
  createProduct,
  getAllProducts,
  deleteProduct,
  updateProduct,
  getProductDetails
} from "../controllers/product.controllers.js";

const router = Router();

router.route("/").get(getAllProducts);
router.route("/create").post(createProduct);
router.route("/product-detail/:_id").get(getProductDetails);
router.route("/delete/:_id").delete(deleteProduct);
router.route("/update/:_id").put(updateProduct)


export default router;
