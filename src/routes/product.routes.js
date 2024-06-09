import { Router } from "express";
import { getAllProducts } from "../controllers/product.controllers.js";

const router = Router();

//  first visit app.js > routes declaration


//  product section
//  get all products
// no more routes for now
router.route("/").get(getAllProducts);

export default router;
