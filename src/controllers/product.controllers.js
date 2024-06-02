import { Product } from "../models/product.models.js";
import {
  ApiError,
  ApiFeatures,
  ApiResponse,
  asyncHandler,
} from "./../utils/index.js";

let productCount;

const createProduct = asyncHandler(async (req, res) => {
  req.body.owner = req.user._id;
  const product = await Product.create(req.body);
  if (!product) {
    throw new ApiError(500, "something went wrong while creating product!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, product, "product created successfully"));
});

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

const deleteProduct = asyncHandler(async (req, res) => {
  if (req.user.role === "admin" || req.user.role === "Admin") {
    const product = await Product.findById(_id);
    if (!product.owner === req.user._id) {
      throw new ApiError(405, "this product does not belongs to you !!");
    }
  }
  const { _id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(_id);
  if (!deletedProduct) {
    throw new ApiError(404, "product not found!!");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, deletedProduct, "product deleted sucessfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { _id } = req.params;
  if (req.user.role === "admin" || req.user.role === "Admin") {
    const product = await Product.findById(_id);
    if (!product.owner === req.user._id) {
      throw new ApiError(405, "this product does not belongs to you !!");
    }
  }
  let product = await Product.findById(_id);
  if (!product) {
    throw new ApiError(404, "product not found!!");
  }
  const updatedProduct = await Product.findByIdAndUpdate(_id, req.body, {
    new: true,
  });
  return res
    .status(201)
    .json(new ApiResponse(200, updatedProduct, "product updated sucessfully"));
});

export {
  createProduct,
  getAllProducts,
  getProductDetails,
  deleteProduct,
  updateProduct,
};
