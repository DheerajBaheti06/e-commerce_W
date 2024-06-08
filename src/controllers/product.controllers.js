import { Product } from "../models/product.models.js";
import {
  ApiError,
  ApiFeatures,
  ApiResponse,
  asyncHandler,
} from "./../utils/index.js";


let productCount;

const getAllProducts = asyncHandler(async (req, res) => {
  const resultsPerPage = 5;
  productCount = await Product.countDocuments();

  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  const allProducts = await apiFeature?.query;
  return res
    .status(200)
    .json(new ApiResponse(200, allProducts, "product founded sucessfully"));
});

const getProductDetails = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  const product = await Product.findById(_id);
  if (!product) {
    throw new ApiError(404, "product not found!!");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        [product, productCount],
        "product deleted sucessfully"
      )
    );
});


export {
  getAllProducts,
  getProductDetails,
};
